// Shared Chromium launcher for render.mjs and lint.mjs.
// Uses the preinstalled browsers in PLAYWRIGHT_BROWSERS_PATH (default /opt/pw-browsers).
// Never runs `playwright install`.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function findChromium() {
  if (process.env.CHROMIUM_PATH && fs.existsSync(process.env.CHROMIUM_PATH)) return process.env.CHROMIUM_PATH;
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  const candidates = [path.join(root, 'chromium')];
  try {
    for (const d of fs.readdirSync(root)) {
      if (d.startsWith('chromium-')) candidates.push(path.join(root, d, 'chrome-linux', 'chrome'));
    }
  } catch { /* ignore */ }
  return candidates.find((p) => fs.existsSync(p));
}

export async function launch() {
  try {
    return await chromium.launch();
  } catch (err) {
    const executablePath = findChromium();
    if (!executablePath) throw err;
    return chromium.launch({ executablePath });
  }
}

// Accepts a local path or an http(s) URL.
export function toUrl(target) {
  if (/^https?:\/\//.test(target) || target.startsWith('file:')) return target;
  return pathToFileURL(path.resolve(target)).href;
}
