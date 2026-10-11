// Ember & Oak identity marks, built from outlined Newsreader (OFL) plus one drawn detail.
// Idea (one sentence): "An ember in the O of Oak": the O is the hill's contour and the oak's ring, the dot is the fire.
// The only quirk is the off-centre ember and its two eccentric rings; everything else is the typeface, spaced by eye.
//
// Source outlines: marks/wordmark.svg and marks/wordmark.json, made with
//   python3 skills/design-graphic/assets/wordmark.py work/NR.ttf "Ember & Oak" --axes wght=480,opsz=72 \
//     --swap "&=work/NRi.ttf" --slot O --track -16 --kern "r =-24, &=-20,& =-8, O=-10" --json marks/wordmark.json
// (fonts from github.com/google/fonts ofl/newsreader, not committed; the outlines are).
import fs from 'node:fs';
import path from 'node:path';

const here = path.dirname(new URL(import.meta.url).pathname);
const svgSrc = fs.readFileSync(path.join(here, 'marks/wordmark.svg'), 'utf8');
const meta = JSON.parse(fs.readFileSync(path.join(here, 'marks/wordmark.json'), 'utf8'));
const glyphs = [...svgSrc.matchAll(/<path data-char="([^"]+)" d="([^"]+)"\/>/g)].map((m) => ({ ch: m[1], d: m[2] }));
const [, , W, H] = svgSrc.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
const o = meta.slot; // the O: its own outline, plus the drawn ember
const [ox0, oy0, ox1, oy1] = o.ink;
const ocx = (ox0 + ox1) / 2, ocy = (oy0 + oy1) / 2;

// Ember: placed by eye inside the counter, up and right of centre (the hilltop, and the stress axis of the O).
// Units are cap-height units (cap = 100). Ring stroke 3 = the O's own hairline, so the rings read as part of the letter.
const ember = { cx: ocx + 6, cy: ocy - 12, r: 7.5 };
// Two rings, each pulled further toward the ember than the last: contour lines around a summit, or an oak's growth rings.
const rings = [{ cx: ocx + 1.5, cy: ocy - 2.5, rx: 23, ry: 33 }, { cx: ocx + 4, cy: ocy - 8, rx: 13.5, ry: 18.5 }];
const ringW = 3;
const ringEls = (n = 2) => rings.slice(0, n).map((r) => `<ellipse cx="${r.cx}" cy="${r.cy}" rx="${r.rx}" ry="${r.ry}" fill="none" stroke="currentColor" stroke-width="${ringW}"/>`).join('');

// Full wordmark (tier 1 and 2, 24px cap height and up). fill: currentColor; the ember takes --logo-ember.
export function wordmark({ title = 'Ember & Oak', cls = 'wordmark', ringOn = true, id = 'wm' } = {}) {
  const body = glyphs.map((g) => `<path d="${g.d}"/>`).join('');
  const ringEl = ringEls(ringOn === true ? 2 : ringOn || 0);
  const a11y = title ? `role="img" aria-labelledby="${id}-t"><title id="${id}-t">${title}</title>` : 'aria-hidden="true">';
  return `<svg class="${cls}" viewBox="0 0 ${W} ${H}" ${a11y}`
    + `<g fill="currentColor">${body}<path d="${o.slotPath}"/></g>${ringEl}`
    + `<circle class="ember" cx="${ember.cx}" cy="${ember.cy}" r="${ember.r}"/></svg>`;
}

// Symbol, drawn per tier (design-graphic 01, responsive tiers). Not the wordmark's O scaled down.
// Tier 3 (32 to 80px): the typeface O with ring and ember, on a 120 box, optically centred (ink centre, not box centre).
export function symbol({ cls = 'symbol', label = '', rings: nr = 2 } = {}) {
  const s = 120, k = 1.0, dx = s / 2 - ocx, dy = s / 2 - ocy + 1; // +1: the ember pulls the mass up, so the O sits 1 unit low
  const a = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg class="${cls}" viewBox="0 0 ${s} ${s}" ${a}><g transform="translate(${dx.toFixed(1)} ${dy.toFixed(1)}) scale(${k})">`
    + `<path fill="currentColor" d="${o.slotPath}"/>${ringEls(nr)}`
    + `<circle class="ember" cx="${ember.cx}" cy="${ember.cy}" r="${ember.r}"/></g></svg>`;
}

// Tier 4 (16 to 32px), drawn on a 32 grid: monoline ring (the serif O's hairlines vanish under 1px at 16px),
// stroke 4 = 2px at 16px; no inner ring; ember r 5.5 (5.5/32 of the box, larger than the big version on purpose).
export const tiny = (ink, emberFill) =>
  `<ellipse cx="16" cy="16.5" rx="11.5" ry="12.5" fill="none" stroke="${ink}" stroke-width="4.25"/>`
  + `<circle cx="17.5" cy="14" r="5" fill="${emberFill}"/>`;

// Favicon SVG (design-graphic 06). The mark carries its own field, so its contrast never depends on the tab strip.
// Measured (skills/design-graphic/assets/tab_contrast.py): brand orange alone is 3.04:1 on white but 2.32:1 on a light
// gray inactive-tab strip, and a prefers-color-scheme rule inside an SVG follows the OS, not the strip a themed browser
// paints. On the warm 950 field: ring warm 50 at 15:1, ember orange at 5:1, on every strip.
export function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#27201a"/>`
    + `<ellipse cx="16" cy="16.5" rx="9.25" ry="10.25" fill="none" stroke="#f9f6f4" stroke-width="3.5"/>`
    + `<circle cx="17.25" cy="14.25" r="4" fill="#f26b21"/></svg>`;
}
// App icon / apple-touch master: symbol on the darkest warm field, ember in brand orange, 180 box with 20 percent margin.
export function appIconSvg(size = 180) {
  const inner = symbol().replace(/class="symbol"/, `x="${size * 0.14}" y="${size * 0.14}" width="${size * 0.72}" height="${size * 0.72}" fill="#f9f6f4" color="#f9f6f4"`)
    .replace('<circle class="ember"', '<circle fill="#f26b21"');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="#27201a"/>${inner}</svg>`;
}
export const dataUri = (svg) => 'data:image/svg+xml,' + encodeURIComponent(svg);
export const dims = { W, H, ratio: W / H };
