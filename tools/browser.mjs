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

// Accepts a local path (optionally with a ?query, for page states), a file: URL or an http(s) URL.
export function toUrl(target) {
  if (/^https?:\/\//.test(target) || target.startsWith('file:')) return target;
  const q = target.indexOf('?');
  if (q === -1) return pathToFileURL(path.resolve(target)).href;
  return pathToFileURL(path.resolve(target.slice(0, q))).href + target.slice(q);
}

// Local file path and a file-name-safe slug of the query, for output names.
// 'page.html?state=loading' or 'file:///x/page.html?state=loading' -> { file: '/x/page.html', slug: 'state-loading' }
export function splitTarget(target) {
  let t = target;
  if (t.startsWith('file:')) t = decodeURIComponent(new URL(t).pathname) + (new URL(t).search || '');
  const q = t.indexOf('?');
  const file = q === -1 ? t : t.slice(0, q);
  const query = q === -1 ? '' : t.slice(q + 1);
  const slug = query.replace(/[=&]+/g, '-').replace(/[^\w.-]+/g, '').replace(/^-+|-+$/g, '');
  return { file, slug };
}

// Fixed-canvas artifacts (posters, social images, OG cards) are one size, not responsive pages. The canvas comes from
// a --canvas WxH flag, or from data-canvas="1080x1350" on any element in the file (the first one wins). Optional, as a
// flag or an attribute on the same element:
//   --canvas-view N    / data-canvas-view="N"      CSS px wide the canvas is seen at. Default 390: a phone feed shows a
//                                                   1080 post at about 360 to 430px (design-graphic 05, thumbnail math)
//   --print WxH        / data-canvas-print="WxH"   physical size in mm (A2 is 420x594); text is then judged in points
//   --distance CM      / data-canvas-distance="CM" print viewing distance in cm (default 100 for a poster)
// Returns null for a responsive page.
export function readCanvas(file, flags = {}) {
  let html = '';
  if (file && !/^https?:/.test(file)) {
    try { html = fs.readFileSync(file.startsWith('file:') ? new URL(file) : file, 'utf8'); } catch { /* missing */ }
  }
  const tag = (html.match(/<[a-z][^>]*\sdata-canvas="[^"]*"[^>]*>/i) || [''])[0];
  const attr = (name) => { const m = tag.match(new RegExp('\\s' + name + '="([^"]*)"', 'i')); return m ? m[1] : null; };
  const pair = (v) => { const m = String(v || '').match(/^\s*(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/); return m ? { w: Number(m[1]), h: Number(m[2]) } : null; };
  const size = pair(flags.canvas) || pair(attr('data-canvas'));
  if (!size) return null;
  return {
    w: Math.round(size.w),
    h: Math.round(size.h),
    view: Number(flags.view || attr('data-canvas-view') || 390),
    print: pair(flags.print) || pair(attr('data-canvas-print')),
    distance: Number(flags.distance || attr('data-canvas-distance') || 100),
  };
}
