#!/usr/bin/env node
// Builds the design-search test pages (run from the repo root: node kb/tests/design-search/build.mjs).
//   coffee.src.html -> coffee.html: the combined coffee page (kb/tests/combined/) with design-search applied.
//     Art and fonts are made exactly as kb/tests/combined/build.mjs makes them, so the only diff is search work.
//   dashboard.html: the built combined dashboard plus its keep-out-of-search head tags (no visual change).
//   coffee-states.html: the combined state sheet, rebuilt from this page's CSS (footer heading rule changed).
//   site/: the files the production origin would serve for this page: og/home-1200x630.png, icon-192.png,
//     apple-touch-icon.png, logo-512.png, rendered from og.src.html and icon.src.html with the same fonts.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const root = path.resolve(here, '../../..');
const combined = path.join(root, 'kb/tests/combined');
const fonts = path.join(root, 'kb/tests/design-typography/fonts');
const gen = path.join(root, 'skills/design-art-direction/assets/contours.mjs');
const contours = (a) => execFileSync('node', [gen, ...a.split(' ')], { encoding: 'utf8' }).trim();
const inlineFonts = (html) => html.replace(/\/\* @inline ([\w.-]+) \*\//g, (_, f) => fs.readFileSync(path.join(fonts, f), 'utf8'));

// Same seeds and parameters as kb/tests/combined/build.mjs.
const art = {
  STAGE: contours('--seed 412 --w 400 --h 500 --levels 14 --peaks 0.8,0.18,1;0.3,0.75,0.5 --noise 0.18 --cell 8 --precision 0'),
  GUJI: contours('--seed 412 --w 320 --h 240 --levels 14 --peaks 0.7,0.3,1 --noise 0.3 --cell 10 --smooth 1 --precision 0'),
  HUILA: contours('--seed 207 --w 320 --h 240 --levels 12 --peaks 0.35,0.45,1;0.85,0.9,0.4 --noise 0.35 --cell 10 --smooth 1 --precision 0'),
  BLEND: contours('--seed 88 --w 320 --h 240 --levels 11 --peaks 0.2,0.3,0.7;0.75,0.65,1 --noise 0.4 --cell 10 --smooth 1 --precision 0'),
  BAND: contours('--seed 2026 --w 1200 --h 400 --levels 10 --peaks 0.85,0.4,1;0.15,0.9,0.6 --noise 0.35 --cell 16 --smooth 1 --precision 0'),
};
const log = [[0,200],[30,150],[60,112],[90,92],[120,101.8],[150,111.2],[180,120.3],[210,128.9],[240,137.2],[270,145.1],[300,152.6],
  [330,159.7],[360,166.4],[390,172.7],[420,178.7],[450,184.3],[480,189.5],[510,194.3],[520,195.8],[540,198.7],[570,202.5],[600,205.7],[610,206.7]];
const x = (t) => (t / 630) * 100;
const y = (c) => 100 - ((c - 60) / 160) * 100;
const pts = log.map(([t, c]) => x(t).toFixed(2) + ',' + y(c).toFixed(2)).join(' ');
art.CURVE = pts;
art.CURVE_AREA = '0,100 ' + pts + ' ' + x(610).toFixed(2) + ',100';
art.SPARK = log.map(([t, c]) => (t / 610 * 96).toFixed(1) + ',' + (24 - ((c - 80) / 140) * 22).toFixed(1)).join(' ');
// Social card art: the subscription band's contour field, wider, one line per 150 m like the page.
art.CARD = contours('--seed 2026 --w 1200 --h 630 --levels 12 --peaks 0.82,0.35,1;0.12,0.85,0.6 --noise 0.35 --cell 16 --smooth 1 --precision 0');

function build(src, out, vars = {}) {
  let html = inlineFonts(fs.readFileSync(path.join(here, src), 'utf8'));
  for (const [k, v] of Object.entries(vars)) html = html.split('{{' + k + '}}').join(v);
  if (/\{\{[A-Z_]+\}\}/.test(html)) throw new Error(`${src}: unfilled placeholder`);
  fs.writeFileSync(path.join(here, out), html);
  console.log(`wrote ${out}  ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
  return html;
}
const coffee = build('coffee.src.html', 'coffee.html', art);
build('og.src.html', 'og.html', art);
build('icon.src.html', 'icon.html', art);

// Dashboard: an app behind login. Only the head changes; the page must stay out of every index and unfurl.
let dash = fs.readFileSync(path.join(combined, 'dashboard.html'), 'utf8');
const keepOut = '<title>Overview, Tally</title>\n<meta name="robots" content="noindex, nofollow">\n' +
  '<!-- design-search: app page behind login. Auth is the control (unauthenticated requests get a 302 to /login);\n' +
  '     this tag and the X-Robots-Tag: noindex, nofollow header on every app response are the backstop.\n' +
  '     Do not Disallow the app in robots.txt, or crawlers never see the noindex. No canonical, no JSON-LD, no og:* here. -->\n';
if (!dash.includes('<title>Overview, Tally</title>\n')) throw new Error('dashboard title not found');
dash = dash.replace('<title>Overview, Tally</title>\n', keepOut);
fs.writeFileSync(path.join(here, 'dashboard.html'), dash);
console.log('wrote dashboard.html');

// State sheet from this page's CSS (same body as the combined sheet).
const { sheets } = await import(path.join(combined, 'states.mjs'));
const css = coffee.match(/<style>([\s\S]*?)<\/style>/)[1];
const s = sheets.coffee;
fs.writeFileSync(path.join(here, 'coffee-states.html'), `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="color-scheme" content="light dark">\n<title>${s.title}</title>\n<style>${css}\n${s.css}</style>\n</head>\n<body>\n${s.body}\n</body>\n</html>\n`);
console.log('wrote coffee-states.html');

// Render the files the origin serves: social card and icons.
const { launch } = await import(path.join(root, 'tools/browser.mjs'));
const site = path.join(here, 'site');
fs.mkdirSync(path.join(site, 'og'), { recursive: true });
const browser = await launch();
async function shot(file, w, h, out, query = '') {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(here, file) + query);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(site, out), clip: { x: 0, y: 0, width: w, height: h } });
  await page.close();
  console.log(`wrote site/${out}  ${w}x${h}`);
}
await shot('og.html', 1200, 630, 'og/home-1200x630.png');
await shot('icon.html', 192, 192, 'icon-192.png', '?size=192');
await shot('icon.html', 180, 180, 'apple-touch-icon.png', '?size=180');
await shot('icon.html', 512, 512, 'logo-512.png', '?size=512');
await browser.close();
