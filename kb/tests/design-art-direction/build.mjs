#!/usr/bin/env node
// Builds coffee-after.html from coffee-after.src.html by inlining seeded art from
// skills/design-art-direction/assets/contours.mjs and the batch 412 roast log below.
// Usage: node kb/tests/design-art-direction/build.mjs   (from the repo root)
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const gen = path.resolve(here, '../../../skills/design-art-direction/assets/contours.mjs');
const contours = (a) => execFileSync('node', [gen, ...a.split(' ')], { encoding: 'utf8' }).trim();

// Contour interval: one line per 150 m of altitude, so higher farms carry more lines (data, not decoration).
const art = {
  // Hero: one field drawn twice, as stage texture and clipped to the bag, so the map runs across the bag edge.
  STAGE: contours('--seed 412 --w 400 --h 500 --levels 14 --peaks 0.8,0.18,1;0.3,0.75,0.5 --noise 0.18 --cell 8 --precision 0'),
  GUJI: contours('--seed 412 --w 320 --h 240 --levels 14 --peaks 0.7,0.3,1 --noise 0.3 --cell 10 --smooth 1 --precision 0'),
  HUILA: contours('--seed 207 --w 320 --h 240 --levels 12 --peaks 0.35,0.45,1;0.85,0.9,0.4 --noise 0.35 --cell 10 --smooth 1 --precision 0'),
  BLEND: contours('--seed 88 --w 320 --h 240 --levels 11 --peaks 0.2,0.3,0.7;0.75,0.65,1 --noise 0.4 --cell 10 --smooth 1 --precision 0'),
  BAND: contours('--seed 2026 --w 1200 --h 400 --levels 10 --peaks 0.85,0.4,1;0.15,0.9,0.6 --noise 0.35 --cell 16 --smooth 1 --precision 0'),
};

// Batch 412 roast log (bean temperature, deg C, every 30 s). Stand-in for the roaster's real log.
const log = [[0,200],[30,150],[60,112],[90,92],[120,101.8],[150,111.2],[180,120.3],[210,128.9],[240,137.2],[270,145.1],[300,152.6],
  [330,159.7],[360,166.4],[390,172.7],[420,178.7],[450,184.3],[480,189.5],[510,194.3],[520,195.8],[540,198.7],[570,202.5],[600,205.7],[610,206.7]];
// Generated from a rate of rise falling from 20 to 9 deg C per minute between turning point and first crack, then to 5.5 by drop.
const x = (t) => (t / 630) * 100;
const y = (c) => 100 - ((c - 60) / 160) * 100; // 60 to 220 deg C: leaves room under the turning point for its label
const pts = log.map(([t, c]) => x(t).toFixed(2) + ',' + y(c).toFixed(2)).join(' ');
art.CURVE = pts;
art.CURVE_AREA = '0,100 ' + pts + ' ' + x(610).toFixed(2) + ',100';
// Mini curve for the bag label, same data, sparkline size.
art.SPARK = log.map(([t, c]) => (t / 610 * 96).toFixed(1) + ',' + (24 - ((c - 80) / 140) * 22).toFixed(1)).join(' ');

let html = fs.readFileSync(path.join(here, 'coffee-after.src.html'), 'utf8');
for (const [k, v] of Object.entries(art)) html = html.split('{{' + k + '}}').join(v);
fs.writeFileSync(path.join(here, 'coffee-after.html'), html);
console.log('wrote coffee-after.html', (html.length / 1024).toFixed(1) + ' KB');
