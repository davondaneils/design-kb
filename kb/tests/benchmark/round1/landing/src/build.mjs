// Builds ferry.html and ferry-states.html (one self-contained file each) and the search assets in site/.
// Run from the repo root after build-fonts.py and build-logo.mjs:
//   node kb/tests/benchmark/round1/landing/src/build.mjs [--no-assets]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '..');
const read = (f) => fs.readFileSync(path.join(here, f), 'utf8');

const fonts = read('css/fonts.css');
const css = read('ferry.css');
const wm = JSON.parse(read('logo/wordmark.out.json'));

// Brand mark: two shores and the crossing between them (concept: money leaves one shore, lands on the other).
const markPaths = (ink, accent, sw) =>
  `<path d="M3 18.5h5.5" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
  `<path d="M15.5 5.5H21" stroke="${ink}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
  `<path d="M8.5 18.5c4.5 0 2.5-13 7-13" stroke="${accent}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
const mark = `<svg class="mark" viewBox="0 0 24 24" aria-hidden="true">${markPaths('currentColor', 'var(--color-accent-mark)', 2.25)}</svg>`;
const word = `<svg class="word" viewBox="${wm.viewBox}" aria-hidden="true"><path d="${wm.d}"/></svg>`;
const logo = mark + word;
const signoff = `<svg viewBox="${wm.viewBox}"><path d="${wm.d}"/></svg>`;

// Favicon: on its own ink field so it holds on light and dark tab strips (design-graphic tab_contrast.py).
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#101214"/><g transform="translate(4 4)">${markPaths('#f6f7f8', '#fe7739', 2.6)}</g></svg>`;
const faviconUri = 'data:image/svg+xml,' + encodeURIComponent(faviconSvg);

function assemble(src) {
  return read(src)
    .replace('/* @inline fonts.css */', () => fonts)
    .replace('/* @inline ferry.css */', () => css)
    .replaceAll('<!-- @logo -->', () => logo)
    .replace('<!-- @wordmark -->', () => signoff)
    .replace('@@FAVICON_SVG_URI@@', () => faviconUri);
}

for (const [src, dest] of [['ferry.src.html', 'ferry.html'], ['states.src.html', 'ferry-states.html']]) {
  if (!fs.existsSync(path.join(here, src))) continue;
  const html = assemble(src);
  if (/\u2014/.test(html)) throw new Error(`${dest} contains an em dash`);
  fs.writeFileSync(path.join(out, dest), html);
  console.log(`${dest}: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
}

if (process.argv.includes('--no-assets')) process.exit(0);

// Search assets, rendered from the page's own fonts and mark (design-search reference 07).
const { launch } = await import(pathToFileURL(path.resolve(here, '../../../../../../tools/browser.mjs')).href);
const site = path.join(out, 'site');
fs.mkdirSync(site, { recursive: true });
const browser = await launch();
const page = await browser.newPage();
async function shot(html, w, h, file) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(site, file), clip: { x: 0, y: 0, width: w, height: h } });
}
const icon = (size) => `<!doctype html><html><body style="margin:0">${faviconSvg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`;
await shot(icon(192), 192, 192, 'favicon-192.png');
await shot(icon(180).replace('rx="7"', 'rx="0"'), 180, 180, 'apple-touch-icon.png');
await shot(icon(512), 512, 512, 'logo.png');
// Social card 1200x630: wordmark over 96px tall, line at 49px; everything inside the centered 630 safe square
// is not required for a wide card with left-aligned type, so the type block stays within x 96 to 1104.
const og = `<!doctype html><html><head><style>${fonts}
body{margin:0;width:1200px;height:630px;background:#101214;color:#f6f7f8;font-family:"Inter Var",sans-serif;display:flex;flex-direction:column;justify-content:space-between;padding:80px 96px;box-sizing:border-box}
.top{display:flex;align-items:center;gap:20px}.top svg.m{width:72px;height:72px}.top svg.w{height:100px;width:auto;fill:#f6f7f8}
h1{font-family:"Ferry Serif",serif;font-weight:400;font-size:76px;line-height:1.1;letter-spacing:-0.015em;margin:0;max-width:980px}
h1 em{font-style:italic;color:#fe7739}
p{margin:0;font-size:31px;color:#bcc1c9}
</style></head><body>
<div class="top"><svg class="m" viewBox="0 0 24 24">${markPaths('#f6f7f8', '#fe7739', 2.25)}</svg><svg class="w" viewBox="${wm.viewBox}"><path d="${wm.d}"/></svg></div>
<h1>Payroll in 28 currencies, <em>paid&nbsp;the&nbsp;same&nbsp;day.</em></h1>
<p>One USD balance. $12 per person a month, first 3 people free.</p>
</body></html>`;
await shot(og, 1200, 630, 'og.png');
await browser.close();
console.log('site/: favicon-192.png, apple-touch-icon.png, logo.png, og.png');
