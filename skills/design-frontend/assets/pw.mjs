// Shared helpers for the design-frontend measuring scripts (vitals, pixel-diff, css-audit, weight).
// Finds playwright-core (installed, or in design-kb tools/node_modules) and a Chromium (PLAYWRIGHT_BROWSERS_PATH, default
// /opt/pw-browsers). Never runs `playwright install`.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import zlib from 'node:zlib';
import { pathToFileURL } from 'node:url';

const here = path.dirname(new URL(import.meta.url).pathname);

async function loadPlaywright() {
  try { return await import('playwright-core'); } catch { /* fall through */ }
  const tries = [process.env.DESIGN_KB_TOOLS, path.join(process.cwd(), 'tools'), path.resolve(here, '../../../tools')].filter(Boolean);
  for (const t of tries) {
    const p = path.join(t, 'node_modules/playwright-core/index.mjs');
    if (fs.existsSync(p)) return import(pathToFileURL(p).href);
  }
  throw new Error('playwright-core not found: run `npm ci` in tools/ or set DESIGN_KB_TOOLS');
}

function findChromium() {
  if (process.env.CHROMIUM_PATH && fs.existsSync(process.env.CHROMIUM_PATH)) return process.env.CHROMIUM_PATH;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  try {
    for (const d of fs.readdirSync(root)) {
      const p = path.join(root, d, 'chrome-linux', 'chrome');
      if (d.startsWith('chromium-') && fs.existsSync(p)) return p;
    }
  } catch { /* none */ }
  return undefined;
}

export async function launch() {
  const { chromium } = await loadPlaywright();
  try { return await chromium.launch(); } catch (err) {
    const executablePath = findChromium();
    if (!executablePath) throw err;
    return chromium.launch({ executablePath });
  }
}

// Static server for one directory, with real compression, so network throttling sees wire bytes (file: URLs are never throttled).
// latency: ms added before each response's headers (CDP's latency setting is not applied to 127.0.0.1 in this Chromium);
// the first request also pays 2 more round trips, a cold TCP plus TLS 1.3 connection.
export function serve(dir, { encoding = 'gzip', latency = 0 } = {}) {
  let first = true;
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
    '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.json': 'application/json' };
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    const file = path.join(dir, decodeURIComponent(u.pathname));
    if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
    const ext = path.extname(file);
    let body = fs.readFileSync(file);
    const headers = { 'content-type': types[ext] || 'application/octet-stream', 'cache-control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable' };
    const compressible = /text|svg|json|javascript/.test(headers['content-type']);
    if (compressible && encoding === 'br') { body = zlib.brotliCompressSync(body); headers['content-encoding'] = 'br'; }
    else if (compressible && encoding === 'gzip') { body = zlib.gzipSync(body, { level: 6 }); headers['content-encoding'] = 'gzip'; }
    headers['content-length'] = body.length;
    const wait = latency * (first ? 3 : 1); first = false;
    setTimeout(() => { res.writeHead(200, headers); res.end(body); }, wait);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve({ server, origin: `http://127.0.0.1:${server.address().port}`, cold: () => { first = true; } })));
}

export const median = (a) => { const s = a.filter((v) => v != null && !Number.isNaN(v)).sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

export function parseArgs(argv, valueFlags) {
  const opts = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      if (valueFlags.includes(k)) opts[k] = argv[++i]; else opts[k] = true;
    } else opts._.push(a);
  }
  return opts;
}
