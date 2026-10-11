#!/usr/bin/env node
// Seeded contour-map generator for data-driven brand imagery (topographic lines).
// Deterministic: the same arguments always print the same SVG, so a page renders identically every time.
//
// Usage:
//   node contours.mjs [--seed 412] [--w 480] [--h 600] [--levels 14] [--cell 6]
//                     [--peaks "0.62,0.38,1;0.25,0.8,0.45"] [--noise 0.35] [--smooth 2] [--full] [--precision 1]
//
//   --peaks   semicolon list of x,y,height (x and y as 0..1 of the canvas, height 0..1). Use the brand's real
//             facts: e.g. one peak per farm, height scaled from altitude.
//   --noise   amount of seeded value noise mixed into the peaks (0 = smooth cones, 1 = mostly noise)
//   --cell    grid cell in px for marching squares (smaller = smoother, bigger file). 4 to 8 is a good range.
//   --smooth  Chaikin smoothing passes (0 = raw marching squares, 2 = default, 3 = very soft)
//   --full    print a complete <svg> element; otherwise print only <path> elements to paste inside your own <svg>.
//
// Output paths carry class="c" and data-level="n" (0 = lowest). Every 5th level also gets class "c major",
// so you can stroke index contours heavier, like a survey map. Color them with CSS tokens (stroke: currentColor).

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf('--' + name);
  return i === -1 ? dflt : args[i + 1];
};
const seed = Number(opt('seed', 412));
const W = Number(opt('w', 480));
const H = Number(opt('h', 600));
const LEVELS = Number(opt('levels', 14));
const CELL = Number(opt("cell", 8));
const NOISE = Number(opt('noise', 0.35));
const PREC = Number(opt('precision', 1));
const FULL = args.includes('--full');
const SMOOTH = Number(opt('smooth', 2));
const peaks = String(opt('peaks', '0.62,0.38,1;0.25,0.8,0.45'))
  .split(';').filter(Boolean).map((p) => p.split(',').map(Number));

// mulberry32 seeded PRNG
function prng(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Value noise on a lattice, smoothstep interpolation, 4 octaves.
const rand = prng(seed);
const LAT = 64;
const lattice = Array.from({ length: LAT * LAT }, () => rand());
const lat = (x, y) => lattice[((y % LAT + LAT) % LAT) * LAT + ((x % LAT + LAT) % LAT)];
const smooth = (t) => t * t * (3 - 2 * t);
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smooth(x - xi), yf = smooth(y - yi);
  const a = lat(xi, yi), b = lat(xi + 1, yi), c = lat(xi, yi + 1), d = lat(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}
function fbm(x, y) {
  let sum = 0, amp = 0.5, f = 1;
  for (let o = 0; o < 4; o++) { sum += amp * vnoise(x * f, y * f); amp *= 0.5; f *= 2; }
  return sum / 0.9375;
}
// Height field: gaussian peaks plus noise.
const sigma = Math.min(W, H) * 0.32;
function height(px, py) {
  let h = 0;
  for (const [x, y, ht] of peaks) {
    const dx = px - x * W, dy = py - y * H;
    h += ht * Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
  }
  const n = fbm(px / 90, py / 90);
  return h * (1 - NOISE) + n * NOISE;
}

const cols = Math.ceil(W / CELL) + 1, rows = Math.ceil(H / CELL) + 1;
const field = new Float64Array(cols * rows);
let min = Infinity, max = -Infinity;
for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
  const v = height(i * CELL, j * CELL);
  field[j * cols + i] = v; if (v < min) min = v; if (v > max) max = v;
}
const f = (i, j) => field[j * cols + i];
const r = (v) => Number(v.toFixed(PREC));

// Marching squares per level, then join segments into polylines.
function segmentsFor(t) {
  const segs = [];
  const lerp = (a, b) => (t - a) / (b - a);
  for (let j = 0; j < rows - 1; j++) for (let i = 0; i < cols - 1; i++) {
    const a = f(i, j), b = f(i + 1, j), c = f(i + 1, j + 1), d = f(i, j + 1);
    const idx = (a > t) | ((b > t) << 1) | ((c > t) << 2) | ((d > t) << 3);
    if (idx === 0 || idx === 15) continue;
    const x = i * CELL, y = j * CELL;
    const top = [x + CELL * lerp(a, b), y], right = [x + CELL, y + CELL * lerp(b, c)];
    const bottom = [x + CELL * lerp(d, c), y + CELL], left = [x, y + CELL * lerp(a, d)];
    const table = {
      1: [[left, top]], 2: [[top, right]], 3: [[left, right]], 4: [[right, bottom]],
      5: [[left, top], [right, bottom]], 6: [[top, bottom]], 7: [[left, bottom]], 8: [[bottom, left]],
      9: [[bottom, top]], 10: [[top, right], [bottom, left]], 11: [[bottom, right]], 12: [[right, left]],
      13: [[right, top]], 14: [[top, left]],
    };
    for (const s of table[idx]) segs.push(s);
  }
  return segs;
}
// Join segments into polylines, walking both ways (marching-squares segments have no consistent direction).
function join(segs) {
  const key = (p) => p[0].toFixed(3) + ',' + p[1].toFixed(3);
  const byPoint = new Map();
  segs.forEach((s, k) => {
    for (const p of s) { const kk = key(p); (byPoint.get(kk) || byPoint.set(kk, []).get(kk)).push(k); }
  });
  const used = new Uint8Array(segs.length);
  const lines = [];
  const extend = (line, atEnd) => {
    for (;;) {
      const tip = atEnd ? line[line.length - 1] : line[0];
      const n = (byPoint.get(key(tip)) || []).find((m) => !used[m]);
      if (n === undefined) return;
      used[n] = 1;
      const [p, q] = segs[n];
      const other = key(p) === key(tip) ? q : p;
      if (atEnd) line.push(other); else line.unshift(other);
    }
  };
  for (let k = 0; k < segs.length; k++) {
    if (used[k]) continue;
    used[k] = 1;
    const line = [segs[k][0], segs[k][1]];
    extend(line, true);
    extend(line, false);
    if (line.length > 3) lines.push(SMOOTH ? chaikin(line, SMOOTH) : line);
  }
  return lines;
}
// Chaikin corner cutting: rounds the marching-squares staircase into survey-map curves.
function chaikin(pts, n) {
  const closed = key2(pts[0]) === key2(pts[pts.length - 1]);
  for (let it = 0; it < n; it++) {
    const out = closed ? [] : [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const [a, b] = [pts[i], pts[i + 1]];
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
      out.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    if (closed) out.push(out[0]); else out.push(pts[pts.length - 1]);
    pts = out;
  }
  return pts;
}
function key2(p) { return p[0].toFixed(2) + ',' + p[1].toFixed(2); }
const out = [];
for (let L = 1; L <= LEVELS; L++) {
  const t = min + ((max - min) * L) / (LEVELS + 1);
  const lines = join(segmentsFor(t));
  if (!lines.length) continue;
  const d = lines.map((ln) => 'M' + ln.map((p) => r(p[0]) + ' ' + r(p[1])).join('L')).join('');
  const cls = L % 5 === 0 ? 'c major' : 'c';
  out.push(`<path class="${cls}" data-level="${L - 1}" d="${d}"/>`);
}
const body = out.join('\n');
if (FULL) {
  console.log(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" stroke="currentColor" stroke-width="1">\n${body}\n</svg>`);
} else {
  console.log(body);
}
