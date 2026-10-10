#!/usr/bin/env node
// Builds the combined test pages from their sources (run from the repo root: node kb/tests/combined/build.mjs).
//   coffee.src.html -> coffee.html: seeded contour art (skills/design-art-direction/assets/contours.mjs), the batch 0412
//     roast log, and the self-hosted Newsreader subsets inlined (kb/tests/design-typography/fonts/).
//   dashboard.src.html -> dashboard.html: the Inter subset and its metric fallback inlined.
// Then writes the state sheets (coffee-states.html, dashboard-states.html) from each built page's CSS plus states.mjs.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(here, '../../..');
const fonts = path.join(root, 'kb/tests/design-typography/fonts');
const gen = path.join(root, 'skills/design-art-direction/assets/contours.mjs');
const contours = (a) => execFileSync('node', [gen, ...a.split(' ')], { encoding: 'utf8' }).trim();
const inlineFonts = (html) => html.replace(/\/\* @inline ([\w.-]+) \*\//g, (_, f) => fs.readFileSync(path.join(fonts, f), 'utf8'));

// Coffee art. One contour per 150 m of altitude, so higher farms carry more lines (data, not decoration).
const art = {
  STAGE: contours('--seed 412 --w 400 --h 500 --levels 14 --peaks 0.8,0.18,1;0.3,0.75,0.5 --noise 0.18 --cell 8 --precision 0'),
  GUJI: contours('--seed 412 --w 320 --h 240 --levels 14 --peaks 0.7,0.3,1 --noise 0.3 --cell 10 --smooth 1 --precision 0'),
  HUILA: contours('--seed 207 --w 320 --h 240 --levels 12 --peaks 0.35,0.45,1;0.85,0.9,0.4 --noise 0.35 --cell 10 --smooth 1 --precision 0'),
  BLEND: contours('--seed 88 --w 320 --h 240 --levels 11 --peaks 0.2,0.3,0.7;0.75,0.65,1 --noise 0.4 --cell 10 --smooth 1 --precision 0'),
  BAND: contours('--seed 2026 --w 1200 --h 400 --levels 10 --peaks 0.85,0.4,1;0.15,0.9,0.6 --noise 0.35 --cell 16 --smooth 1 --precision 0'),
};
// Batch 0412 roast log (bean temperature, deg C, every 30 s). Stand-in for the roaster's real log (see photo-request and combined.md).
const log = [[0,200],[30,150],[60,112],[90,92],[120,101.8],[150,111.2],[180,120.3],[210,128.9],[240,137.2],[270,145.1],[300,152.6],
  [330,159.7],[360,166.4],[390,172.7],[420,178.7],[450,184.3],[480,189.5],[510,194.3],[520,195.8],[540,198.7],[570,202.5],[600,205.7],[610,206.7]];
const x = (t) => (t / 630) * 100;
const y = (c) => 100 - ((c - 60) / 160) * 100;
const pts = log.map(([t, c]) => x(t).toFixed(2) + ',' + y(c).toFixed(2)).join(' ');
art.CURVE = pts;
art.CURVE_AREA = '0,100 ' + pts + ' ' + x(610).toFixed(2) + ',100';
art.SPARK = log.map(([t, c]) => (t / 610 * 96).toFixed(1) + ',' + (24 - ((c - 80) / 140) * 22).toFixed(1)).join(' ');

function build(src, out, vars = {}) {
  let html = inlineFonts(fs.readFileSync(path.join(here, src), 'utf8'));
  for (const [k, v] of Object.entries(vars)) html = html.split('{{' + k + '}}').join(v);
  if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error(`${src}: unfilled placeholder`);
  fs.writeFileSync(path.join(here, out), html);
  console.log(`wrote ${out}  ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
  return html;
}
const pages = { coffee: build('coffee.src.html', 'coffee.html', art) };
if (fs.existsSync(path.join(here, 'dashboard.src.html'))) pages.dashboard = build('dashboard.src.html', 'dashboard.html');

// State sheets: the page's own CSS plus a sheet body, so every state is drawn by the real rules.
const { sheets } = await import(path.join(here, 'states.mjs'));
for (const [name, html] of Object.entries(pages)) {
  if (!sheets[name]) continue;
  const css = html.match(/<style>([\s\S]*?)<\/style>/)[1];
  const s = sheets[name];
  const doc = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="color-scheme" content="light dark">\n<title>${s.title}</title>\n<style>${css}\n${s.css}</style>\n</head>\n<body>\n${s.body}\n</body>\n</html>\n`;
  fs.writeFileSync(path.join(here, `${name}-states.html`), doc);
  console.log(`wrote ${name}-states.html  ${(Buffer.byteLength(doc) / 1024).toFixed(1)} KB`);
}
