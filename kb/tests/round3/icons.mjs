// Tally icon set: one definition per icon, expanded inline by build.mjs ({{i:name}} or {{i:name:class}}).
// Spec (design-graphic references/02-icon-systems.md):
//   16 grid for 14px UI text, 12 grid for 12px text. Live area 14 (1px padding); keylines: circle 13 across,
//   square 12, so a round and a square icon look the same size.
//   Stroke comes from CSS, never from the icon: .i { stroke-width: var(--icon-stroke) }, 1.5px default to match Inter
//   14px 500 (stem 1.50), 1.75px where the label is 600 (stem 1.78). Round caps and joins on every icon.
//   Straight stems sit on .25 or .75: a 1.5px stroke centred there lands on whole device pixels at 2x (3 device px,
//   zero partial columns) and leaves one soft column at 1x; centred on a whole or half pixel it blurs two columns at
//   both densities (measured: kb/research/graphic/scripts/stroke-snap.mjs).
//   Status icons (error, warning) are solid with the mark knocked out (evenodd), one color, so they keep their mass at
//   16px, work in both themes and in forced colors, and never hard-code white or black.
//   Metaphor table: overview = 2x2 tiles (layout, not "home"); events = activity trace; funnels = funnel outline
//   (rejected: stepped bars, which read as "align center"); retention = return arrow (rejected: calendar, which is the
//   date picker); users = person; settings = gear (universal; drawn with 6 teeth, the most a 16px gear survives);
//   commands = the command key; shortcuts = keyboard.

const gear = (() => {
  // 6 teeth: outer r 6.25, root r 4.75, tooth half-width 0.5 rad at the tip, 0.62 at the root. Centre hole r 2.
  const c = 8, n = 6, ro = 6.25, ri = 4.75, pts = [];
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 - Math.PI / 2;
    const t = 0.26, r = 0.36;
    pts.push([a - r, ri], [a - t, ro], [a + t, ro], [a + r, ri]);
  }
  const P = ([a, rad]) => `${(c + rad * Math.cos(a)).toFixed(2)} ${(c + rad * Math.sin(a)).toFixed(2)}`;
  let d = `M${P(pts[0])}`;
  for (let i = 1; i < pts.length; i++) {
    const prevOnRoot = pts[i - 1][1] === ri && pts[i][1] === ri;
    d += prevOnRoot ? ` A${ri} ${ri} 0 0 1 ${P(pts[i])}` : ` L${P(pts[i])}`;
  }
  d += ` A${ri} ${ri} 0 0 1 ${P(pts[0])}Z`;
  return `<path d="${d}"/><circle cx="8" cy="8" r="2"/>`;
})();

const I16 = {
  overview: '<rect x="2.25" y="2.25" width="4" height="4" rx="1.25"/><rect x="9.75" y="2.25" width="4" height="4" rx="1.25"/><rect x="2.25" y="9.75" width="4" height="4" rx="1.25"/><rect x="9.75" y="9.75" width="4" height="4" rx="1.25"/>',
  events: '<path d="M1.75 8.25h2.5l2-4.5 3.5 8.5 2-4h2.5"/>',
  funnels: '<path d="M2.25 2.75h11.5L9.25 8.25v4.75l-2.5-1.25V8.25z"/>',
  retention: '<path d="M2.25 8a5.75 5.75 0 1 0 1.7-4.1L2.25 5.75"/><path d="M2.25 2.25v3.5h3.5"/>',
  users: '<circle cx="8" cy="5.25" r="2.75"/><path d="M2.75 13.75c.5-2.6 2.6-4.25 5.25-4.25s4.75 1.65 5.25 4.25"/>',
  settings: gear,
  commands: '<path d="M10.25 4v8A1.75 1.75 0 1 0 12 10.25H4A1.75 1.75 0 1 0 5.75 12V4A1.75 1.75 0 1 0 4 5.75h8A1.75 1.75 0 1 0 10.25 4z"/>',
  keyboard: '<rect x="1.75" y="3.75" width="12.5" height="8.5" rx="1.5"/><path d="M4.75 6.75h.01M8 6.75h.01M11.25 6.75h.01M5.25 9.25h5.5"/>',
  menu: '<path d="M2.25 3.75h11.5M2.25 7.75h11.5M2.25 11.75h11.5"/>',
  search: '<circle cx="7.25" cy="7.25" r="4.75"/><path d="M10.75 10.75l3 3"/>',
  calendar: '<rect x="2.25" y="3.25" width="11.5" height="10.5" rx="1.5"/><path d="M2.25 6.75h11.5M5.25 1.75v3M10.75 1.75v3"/>',
  plus: '<path d="M7.75 3v9.5M3 7.75h9.5"/>',
  close: '<path d="M4.25 4.25l7.5 7.5M11.75 4.25l-7.5 7.5"/>',
  lock: '<rect x="3.25" y="7.25" width="9.5" height="6.5" rx="1.5"/><path d="M5.25 7.25v-2a2.75 2.75 0 0 1 5.5 0v2"/>',
  more: '<circle class="solid" cx="3.5" cy="8" r="1.25"/><circle class="solid" cx="8" cy="8" r="1.25"/><circle class="solid" cx="12.5" cy="8" r="1.25"/>',
  // Solid status icons: shape plus knocked-out mark in one evenodd path.
  error: '<path class="solid" fill-rule="evenodd" d="M8 1.25a6.75 6.75 0 1 1 0 13.5A6.75 6.75 0 0 1 8 1.25zM7.25 4.75v4a.75.75 0 0 0 1.5 0v-4a.75.75 0 0 0-1.5 0zM8 10.4a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z"/>',
  warning: '<path class="solid" fill-rule="evenodd" d="M6.7 2.1a1.5 1.5 0 0 1 2.6 0l5.55 9.65a1.5 1.5 0 0 1-1.3 2.25H2.45a1.5 1.5 0 0 1-1.3-2.25zM7.25 5.75v3.25a.75.75 0 0 0 1.5 0V5.75a.75.75 0 0 0-1.5 0zM8 10.6a.85.85 0 1 0 0 1.7.85.85 0 0 0 0-1.7z"/>',
};
// 12 grid, for 12px text (deltas 600, table headers 500). Drawn, not scaled from 16.
const I12 = {
  'arrow-up': '<path d="M6.25 10V2.5M3 5.75l3.25-3.25 3.25 3.25"/>',
  'arrow-down': '<path d="M6.25 2v7.5M3 6.25l3.25 3.25 3.25-3.25"/>',
  // Round 3: the setup checklist tick and the inline platform warning, drawn on the 12 grid (were ad hoc, butt caps and white).
  'check-12': '<path d="M2.75 6.25l2.25 2.25 4.25-4.5"/>',
  'warning-12': '<path class="solid" fill-rule="evenodd" d="M5.05 1.85a1.1 1.1 0 0 1 1.9 0l4.15 7.45a1.1 1.1 0 0 1-.95 1.65H1.85a1.1 1.1 0 0 1-.95-1.65zM5.4 4.5v2.4a.6.6 0 0 0 1.2 0V4.5a.6.6 0 0 0-1.2 0zM6 8.15a.65.65 0 1 0 0 1.3.65.65 0 0 0 0-1.3z"/>',
  // Setup guide progress: ring plus a filled quarter (one of four steps), stroke from CSS like the set.
  'progress-16': '<circle cx="8" cy="8" r="5.75"/><path class="solid" d="M8 2.25A5.75 5.75 0 0 1 13.75 8H8z"/>',
};
// Brand mark: four tally strokes and the fifth across them (the product counts). Its own 16 grid, heavier stroke
// (brand marks may sit one step above UI weight), stems on .25/.75 like the set.
export const tallyMark = (stroke = 'currentColor') =>
  `<path d="M3.75 3.25v9.5M6.25 3.25v9.5M8.75 3.25v9.5M11.25 3.25v9.5M2.5 11.25l11-6.5" fill="none" stroke="${stroke}" stroke-width="1.75" stroke-linecap="round"/>`;

export function icon(name, extra = '') {
  const s16 = I16[name], s12 = I12[name];
  if (!s16 && !s12) throw new Error(`unknown icon ${name}`);
  const size = s16 ? 16 : 12;
  const cls = ['i', size === 12 ? 'i-12' : '', extra].filter(Boolean).join(' ');
  return `<svg class="${cls}" data-icon="${name}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">${s16 || s12}</svg>`;
}
export const names = [...Object.keys(I16), ...Object.keys(I12)];
// Expand {{i:name}} and {{i:name:extra-class}} in a string.
export const expandIcons = (html) => html.replace(/\{\{i:([a-z0-9-]+)(?::([a-z0-9 -]+))?\}\}/g, (_, n, c) => icon(n, c || ''));
// The icon CSS every page that uses the set includes.
export const iconCss = `.i { flex: none; display: block; fill: none; stroke: currentColor; stroke-width: var(--icon-stroke, 1.5px); stroke-linecap: round; stroke-linejoin: round; }
.i .solid { fill: currentColor; stroke: none; }`;

// Ember & Oak set (round 3; closes design-graphic wave gap 1: the coffee icons were not on the grid).
// Same spec as the Tally set: 16 grid, live area 14, stems on .25/.75, round caps and joins, stroke from CSS
// (--icon-stroke, 1.5px to match Inter 16px at 400 to 600), solid status shapes with knocked-out marks.
const C16 = {
  check: '<path d="M3.25 8.25l3 3 6.5-6.5"/>',
  'arrow-right': '<path d="M2.75 8h10.5M9.25 3.75L13.5 8l-4.25 4.25"/>',
  close: '<path d="M4.25 4.25l7.5 7.5M11.75 4.25l-7.5 7.5"/>',
  menu: '<path d="M2.25 5.25h11.5M2.25 10.75h11.5"/>',
  minus: '<path d="M3.25 8h9.5"/>',
  plus: '<path d="M8 3.25v9.5M3.25 8h9.5"/>',
  lock: '<rect x="3.25" y="7.25" width="9.5" height="6.5" rx="1.5"/><path d="M5.25 7.25v-2a2.75 2.75 0 0 1 5.5 0v2"/>',
  truck: '<path d="M1.75 4.25h7.5v6.5h-7.5zM9.25 6.75h2.5l2.5 2.5v1.5h-5"/><circle cx="4.75" cy="11.75" r="1.25"/><circle cx="11.75" cy="11.75" r="1.25"/>',
  star: '<path class="solid" d="M8 1.75l1.85 3.95 4.3.5-3.2 2.95.85 4.25L8 11.25l-3.8 2.15.85-4.25-3.2-2.95 4.3-.5z"/>',
  error: '<path class="solid" fill-rule="evenodd" d="M8 1.25a6.75 6.75 0 1 1 0 13.5A6.75 6.75 0 0 1 8 1.25zM7.25 4.75v4a.75.75 0 0 0 1.5 0v-4a.75.75 0 0 0-1.5 0zM8 10.4a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z"/>',
};
export function cicon(name, extra = '') {
  const s = C16[name];
  if (!s) throw new Error(`unknown coffee icon ${name}`);
  const cls = ['i', extra].filter(Boolean).join(' ');
  return `<svg class="${cls}" data-icon="${name}" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">${s}</svg>`;
}
export const expandCoffeeIcons = (html) => html.replace(/\{\{c:([a-z0-9-]+)(?::([a-z0-9 -]+))?\}\}/g, (_, n, c) => cicon(n, c || ''));
export const coffeeIconNames = Object.keys(C16);
