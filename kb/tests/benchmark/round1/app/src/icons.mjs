// Ferry product icon set (design-graphic references/02-icon-systems.md, "Building a product icon set (code)").
// 16 grid, drawn for 1.5px strokes: straight stems sit on .25 or .75 so they render crisp at 2x. 12 grid for meta arrows.
// One CSS rule (.i in app.css) sets stroke, caps and joins; shapes here carry no stroke width and no color.
// Status glyphs are solid with the mark knocked out (one evenodd path, class "solid").
// Metaphor table:
//   home: house; payroll runs: calendar with a check, rejected a dollar sign (reads as "payments");
//   people: two heads; payments: two opposing arrows (money moving both ways), rejected a card (Ferry has no cards);
//   funding: bank columns, the source account; reports: bar chart on an axis; settings: sliders, rejected a gear
//   (a 16px gear loses its teeth); help: question in a circle; missing bank details: bank (same as funding, the object
//   that is missing); rate alert: trend arrow; new hire: person with a plus.
export const icons16 = {
  home: '<path d="M2.75 6.75 8 2.5l5.25 4.25v6.5H2.75z"/><path d="M6.25 13.25v-3.5h3.5v3.5"/>',
  runs: '<rect x="2.25" y="3.25" width="11.5" height="10.5" rx="2"/><path d="M2.25 6.75h11.5M5.25 1.75v3M10.75 1.75v3"/><path d="m5.75 10.25 1.5 1.25 3-2.75"/>',
  people: '<circle cx="6" cy="5.5" r="2.25"/><path d="M1.75 13.25c.5-2.25 2.1-3.5 4.25-3.5s3.75 1.25 4.25 3.5"/><path d="M10.25 3.35a2.25 2.25 0 0 1 0 4.3M11.75 9.85c1.25.45 2.1 1.6 2.5 3.4"/>',
  payments: '<path d="M2.75 5.25h10.5M10.25 2.25l3 3-3 3M13.25 10.75H2.75M5.75 7.75l-3 3 3 3"/>',
  bank: '<path d="M2.25 6.25 8 2.75l5.75 3.5zM2.25 13.25h11.5M4.25 8.25v3M8 8.25v3M11.75 8.25v3"/>',
  reports: '<path d="M2.75 2.75v10.5h10.5M5.75 10.25v-2.5M8.75 10.25v-5.5M11.75 10.25v-3.5"/>',
  settings: '<path d="M2.75 4.75h5.5M12.25 4.75h1M2.75 11.25h1M7.75 11.25h5.5"/><circle cx="10.25" cy="4.75" r="1.75"/><circle cx="5.75" cy="11.25" r="1.75"/>',
  help: '<circle cx="8" cy="8" r="6.25"/><path d="M6.25 6.25a1.75 1.75 0 1 1 2.6 1.55c-.55.3-.85.7-.85 1.2v.25"/><circle class="solid" cx="8" cy="11.25" r=".85"/>',
  menu: '<path d="M2.75 4.25h10.5M2.75 8h10.5M2.75 11.75h10.5"/>',
  close: '<path d="m4.25 4.25 7.5 7.5M11.75 4.25l-7.5 7.5"/>',
  search: '<circle cx="7.25" cy="7.25" r="4.5"/><path d="m10.5 10.5 2.75 2.75"/>',
  chevrons: '<path d="m5.25 6.25 2.75-2.5 2.75 2.5M5.25 9.75l2.75 2.5 2.75-2.5"/>',
  trend: '<path d="m1.75 11.25 4-4 2.5 2.5 5-5M9.75 4.75h3.5v3.5"/>',
  hire: '<circle cx="6.5" cy="5.25" r="2.25"/><path d="M2.25 13.25c.5-2.25 2.1-3.5 4.25-3.5s3.75 1.25 4.25 3.5M12.75 4.75v4M10.75 6.75h4"/>',
  check: '<path d="m3.75 8.25 2.75 2.75 5.75-6"/>',
  lock: '<rect x="3.25" y="7.25" width="9.5" height="6.5" rx="1.5"/><path d="M5.25 7.25v-2a2.75 2.75 0 0 1 5.5 0v2"/>',
  download: '<path d="M8 2.25v8M4.75 7.25 8 10.5l3.25-3.25M2.75 13.25h10.5"/>',
  retry: '<path d="M13.25 8a5.25 5.25 0 1 1-1.55-3.7M13.25 2.75v3h-3"/>',
  clock: '<circle cx="8" cy="8" r="5.75"/><path d="M8 4.75V8l2.25 1.5"/>',
  info: '<circle cx="8" cy="8" r="6.25"/><path d="M8 7.25v3.5"/><circle class="solid" cx="8" cy="5.25" r=".85"/>',
  // solid status glyphs, mark knocked out
  warn: '<path class="solid" fill-rule="evenodd" d="M6.7 2.5a1.5 1.5 0 0 1 2.6 0l5.2 9.25a1.5 1.5 0 0 1-1.3 2.25H2.8a1.5 1.5 0 0 1-1.3-2.25zM7.25 5.75h1.5v3.75h-1.5zM8 10.6a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z"/>',
  error: '<path class="solid" fill-rule="evenodd" d="M8 1.25a6.75 6.75 0 1 0 0 13.5A6.75 6.75 0 0 0 8 1.25zM7.25 4.25h1.5v4.5h-1.5zM8 10a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>',
};
export const icons12 = {
  sep: '<path d="m4.75 3.25 2.5 2.75-2.5 2.75"/>',
  down: '<path d="M6 2.25v7.5M3.25 7 6 9.75 8.75 7"/>',
  up: '<path d="M6 9.75v-7.5M3.25 5 6 2.25 8.75 5"/>',
  warn: '<path class="solid" fill-rule="evenodd" d="M5.1 1.75a1 1 0 0 1 1.8 0l4.2 7.6a1 1 0 0 1-.9 1.5H1.8a1 1 0 0 1-.9-1.5zM5.4 4h1.2v3h-1.2zM6 7.8a.7.7 0 1 0 0 1.4.7.7 0 0 0 0-1.4z"/>',
};

export function icon(name, cls = '') {
  if (icons16[name]) return `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">${icons16[name]}</svg>`;
  if (name.startsWith('12-') && icons12[name.slice(3)]) return `<svg class="i i-12${cls ? ' ' + cls : ''}" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true" focusable="false">${icons12[name.slice(3)]}</svg>`;
  throw new Error('unknown icon ' + name);
}
export const expandIcons = (html) => html.replace(/\{\{i:([\w-]+)(?:\s+([\w -]+))?\}\}/g, (_, n, c) => icon(n, c || ''));

// The Ferry mark: two piers and the crossing between them, on its own field. 24 grid.
export const markInner = '<rect class="field" width="24" height="24" rx="6"/><path class="ink" d="M5.5 16.75h3.25c2.5 0 3.25-9.5 6.5-9.5h3.25"/>';
export const mark = (label = '') => `<svg class="logo-mark" viewBox="0 0 24 24" width="24" height="24" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${markInner}</svg>`;
// Favicon: the mark on its own brand field (FOUNDATIONS: favicon sits on its own field), white ink.
export const faviconSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="#026fb9"/><path d="M5.5 16.75h3.25c2.5 0 3.25-9.5 6.5-9.5h3.25" fill="none" stroke="#fff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';
