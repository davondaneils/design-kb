// Tightens the outlined wordmark (src/logo/wordmark.svg, from skills/design-graphic/assets/wordmark.py)
// to its ink box, including the descender of "y" that wordmark.py's default viewBox clips.
// Writes src/logo/wordmark.json: { d, viewBox, w, h, baseline }.
// Run from the repo root: node kb/tests/benchmark/round1/landing/src/build-logo.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const { launch } = await import(path.join(here, '../../../../../../tools/browser.mjs'));
const svg = fs.readFileSync(path.join(here, 'logo/wordmark.svg'), 'utf8');
const ds = [...svg.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
const d = ds.join('');
const meta = JSON.parse(fs.readFileSync(path.join(here, 'logo/wordmark.json'), 'utf8'));
const browser = await launch();
const page = await browser.newPage();
await page.setContent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><path id="p" d="${d}"/></svg>`);
const b = await page.evaluate(() => { const r = document.getElementById('p').getBBox(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
await browser.close();
const x0 = Math.floor(b.x), y0 = Math.floor(b.y), x1 = Math.ceil(b.x + b.w), y1 = Math.ceil(b.y + b.h);
const out = { d, viewBox: `${x0} ${y0} ${x1 - x0} ${y1 - y0}`, w: x1 - x0, h: y1 - y0, capTop: 4 - y0, baseline: meta.baseline - y0, capHeight: meta.capHeight };
fs.writeFileSync(path.join(here, 'logo/wordmark.out.json'), JSON.stringify(out));
console.log(out.viewBox, 'cap top', out.capTop, 'baseline', out.baseline);
