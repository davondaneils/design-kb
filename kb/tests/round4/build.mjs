#!/usr/bin/env node
// Builds the round 4 pages (run from the repo root: node kb/tests/round4/build.mjs).
//   coffee.src.html -> coffee.html: contour art (same seeds as kb/tests/combined/build.mjs), the batch 0412 roast log,
//     the printed bag label, the identity marks (marks.mjs), the coffee icon set ({{c:name}}, icons.mjs), the JSON-LD graph
//     (jsonld.html, from the design-search wave), and the metric fallbacks inlined. Web fonts are self-hosted files in fonts/.
//   dashboard.src.html -> dashboard.html: the Tally icon set ({{i:name}}), tally mark, favicon, fallbacks inlined.
// Then the state sheets (coffee-states.html, dashboard-states.html) from each built page's CSS plus states.mjs,
// and the files the production origin serves (site/): social card, icon-192, apple-touch-icon, logo-512.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { expandIcons, expandCoffeeIcons, iconCss, tallyMark } from './icons.mjs';
import { wordmark, symbol, faviconSvg, appIconSvg, dataUri } from './marks.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(here, '../../..');
const fonts = path.join(root, 'kb/tests/design-typography/fonts');
const gen = path.join(root, 'skills/design-art-direction/assets/contours.mjs');
const contours = (a) => execFileSync('node', [gen, ...a.split(' ')], { encoding: 'utf8' }).trim();
const inlineFonts = (html) => html.replace(/\/\* @inline ([\w.-]+) \*\//g, (_, f) => fs.readFileSync(path.join(fonts, f), 'utf8'));

// Coffee art. One contour per 150 m of altitude, so higher farms carry more lines (data, not decoration).
const art = {
  GUJI: contours('--seed 412 --w 320 --h 240 --levels 14 --peaks 0.7,0.3,1 --noise 0.3 --cell 10 --smooth 1 --precision 0'),
  HUILA: contours('--seed 207 --w 320 --h 240 --levels 12 --peaks 0.35,0.45,1;0.85,0.9,0.4 --noise 0.35 --cell 10 --smooth 1 --precision 0'),
  BLEND: contours('--seed 88 --w 320 --h 240 --levels 11 --peaks 0.2,0.3,0.7;0.75,0.65,1 --noise 0.4 --cell 10 --smooth 1 --precision 0'),
  BAND: contours('--seed 2026 --w 1200 --h 400 --levels 10 --peaks 0.85,0.4,1;0.15,0.9,0.6 --noise 0.35 --cell 16 --smooth 1 --precision 0'),
};
// Batch 0412 roast log (bean temperature, deg C, every 30 s). Stand-in for the roaster's real log (combined.md).
// Checked against the copy: turning point 1:30 at 92, yellowing 5:30 at about 160, first crack 8:40 (520 s) at 196, out 10:10 at 207.
const log = [[0,200],[30,150],[60,112],[90,92],[120,101.8],[150,111.2],[180,120.3],[210,128.9],[240,137.2],[270,145.1],[300,152.6],
  [330,159.7],[360,166.4],[390,172.7],[420,178.7],[450,184.3],[480,189.5],[510,194.3],[520,195.8],[540,198.7],[570,202.5],[600,205.7],[610,206.7]];
const x = (t) => (t / 630) * 100;
const y = (c) => 100 - ((c - 60) / 160) * 100;
const pts = log.map(([t, c]) => x(t).toFixed(2) + ',' + y(c).toFixed(2)).join(' ');
art.CURVE = pts;
art.CURVE_AREA = '0,100 ' + pts + ' ' + x(610).toFixed(2) + ',100';

// The printed bag label (design-art-direction 03: the page prints the live label onto the blank one in the photograph,
// so the lot on the bag always matches the lot on sale). 194 x 254 units = the blank label's pixels in the master.
// The label is drawn to read at every width: the smallest print is 24 units, which renders at 12.7px on the 768 tablet
// crop (label 15.27% of the frame) and 13.7px at 390, so the type-scale floor holds without a lint exemption.
// So the label carries only what reads: the mark, the name, the curve, the lot. Text classes are styled by the page.
const lx = (t) => 28 + (t / 610) * 138, ly = (c) => 196 - ((c - 80) / 140) * 40;
const labelCurve = log.map(([t, c]) => lx(t).toFixed(1) + ',' + ly(c).toFixed(1)).join(' ');
const sym = symbol({ rings: 1 }).replace('class="symbol"', 'class="symbol" x="75" y="12" width="44" height="44"');
art.LABEL = `<svg class="print" viewBox="0 0 194 254" aria-hidden="true">${sym}`
  + `<text class="serif" x="97" y="96" font-size="31" text-anchor="middle">Ethiopia</text>`
  + `<text class="serif" x="97" y="128" font-size="31" text-anchor="middle">Guji</text>`
  + `<line class="rule" x1="28" x2="166" y1="146" y2="146"/>`
  + `<polyline class="lcurve" points="${labelCurve}"/>`
  + `<text class="mono" x="97" y="236" font-size="24" text-anchor="middle">0412</text></svg>`;

Object.assign(art, {
  FAVICON: dataUri(faviconSvg()),
  WM_HEADER: wordmark({ title: '', ringOn: 1 }),            // 22 to 26px tall: one ring (tier 2)
  WM_SIGNOFF: wordmark({ title: '', id: 'wm2' }),            // footer, full width (tier 1); the legal line names the company
  JSONLD: fs.readFileSync(path.join(here, 'jsonld.html'), 'utf8').trim(),
});

function build(src, out, vars = {}) {
  let html = inlineFonts(fs.readFileSync(path.join(here, src), 'utf8'));
  for (const [k, v] of Object.entries(vars)) html = html.split('{{' + k + '}}').join(v);
  html = expandCoffeeIcons(expandIcons(html));
  const left = html.match(/\{\{[A-Za-z_:-]+\}\}/);
  if (left) throw new Error(`${src}: unfilled placeholder ${left[0]}`);
  fs.writeFileSync(path.join(here, out), html);
  console.log(`wrote ${out}  ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
  return html;
}
const tallyFav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" rx="3.5" fill="#14b8a6"/>${tallyMark('#101214')}</svg>`;
const dash = { ICON_CSS: iconCss, TALLY_MARK: `<svg class="tally" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">${tallyMark()}</svg>`, FAVICON: dataUri(tallyFav) };
const pages = { coffee: build('coffee.src.html', 'coffee.html', art), dashboard: build('dashboard.src.html', 'dashboard.html', dash) };
build('og.src.html', 'og.html', { WM_CARD: wordmark({ title: '', id: 'wm3' }) });

// State sheets: the page's own CSS (and font faces) plus a sheet body, so every state is drawn by the real rules.
const { sheets } = await import(path.join(here, 'states.mjs'));
for (const [name, html] of Object.entries(pages)) {
  const s = sheets[name];
  const css = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
  const doc = `<!DOCTYPE html>\n<html lang="en" data-lint-page="state-sheet">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="color-scheme" content="light dark">\n<meta name="robots" content="noindex">\n<title>${s.title}</title>\n<style>${css}\n${s.css}</style>\n</head>\n<body>\n${expandCoffeeIcons(expandIcons(s.body))}\n</body>\n</html>\n`;
  fs.writeFileSync(path.join(here, `${name}-states.html`), doc);
  console.log(`wrote ${name}-states.html  ${(Buffer.byteLength(doc) / 1024).toFixed(1)} KB`);
}

// The files the origin serves: social card and icons (design-search 07: PNG beside the SVG favicon).
if (!process.argv.includes('--no-site')) {
  const { launch } = await import(path.join(root, 'tools/browser.mjs'));
  const site = path.join(here, 'site');
  fs.mkdirSync(path.join(site, 'og'), { recursive: true });
  fs.writeFileSync(path.join(here, 'app-icon.html'), `<!DOCTYPE html><html><head><style>html,body{margin:0}svg{display:block;width:100vw;height:100vh}</style></head><body>${appIconSvg()}</body></html>`);
  const browser = await launch();
  async function shot(file, w, h, out) {
    const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await page.goto('file://' + path.join(here, file));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(site, out), clip: { x: 0, y: 0, width: w, height: h } });
    await page.close();
    console.log(`wrote site/${out}  ${w}x${h}`);
  }
  await shot('og.html', 1200, 630, 'og/home-1200x630.png');
  await shot('app-icon.html', 192, 192, 'icon-192.png');
  await shot('app-icon.html', 180, 180, 'apple-touch-icon.png');
  await shot('app-icon.html', 512, 512, 'logo-512.png');
  await browser.close();
}
