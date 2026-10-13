// Halyard product icon set: one source module, 16 grid, shapes only (no stroke width, no colors).
// Drawn with stems on .25/.75 for a 1.5px stroke (design-graphic 02). One CSS rule draws the set:
// .i { fill:none; stroke:currentColor; stroke-width:var(--icon-stroke); stroke-linecap:round; stroke-linejoin:round }
// Status icons are solid with the mark knocked out (one evenodd path, fill currentColor, class "solid").
export const icons = {
  // Navigation
  route: '<circle cx="4" cy="4.25" r="1.75"/><circle cx="12" cy="11.75" r="1.75"/><path d="M5.75 4.25h4.5a2.25 2.25 0 0 1 0 4.5h-4.5a2.25 2.25 0 0 0 0 4.5h4.5"/>',
  saved: '<path d="M4.25 2.75h7.5v10.5L8 10.75l-3.75 2.5z"/>',
  boat: '<path d="M7.75 2.25v8.5M7.75 2.75l4.5 7.5h-4.5M7.75 4.25l-3.5 6h3.5M2.75 12.25h10.5l-1.5 1.5h-7.5z"/>',
  tide: '<path d="M2.25 6.25c1 0 1.4-1 2.3-1s1.3 1 2.3 1 1.3-1 2.3-1 1.3 1 2.3 1 1.3-1 2.3-1M2.25 10.75c1 0 1.4-1 2.3-1s1.3 1 2.3 1 1.3-1 2.3-1 1.3 1 2.3 1 1.3-1 2.3-1"/>',
  settings: '<path d="M2.75 4.75h6.5M12.25 4.75h1M2.75 11.25h1M6.75 11.25h6.5"/><circle cx="10.75" cy="4.75" r="1.5"/><circle cx="5.25" cy="11.25" r="1.5"/>',
  menu: '<path d="M2.75 4.25h10.5M2.75 8h10.5M2.75 11.75h10.5"/>',
  close: '<path d="M3.75 3.75l8.5 8.5M12.25 3.75l-8.5 8.5"/>',
  retry: '<path d="M12.75 8a4.75 4.75 0 1 1-1.4-3.36M12.75 2.75v2.5h-2.5"/>',
  plus: '<path d="M8 3.25v9.5M3.25 8h9.5"/>',
  check: '<path d="M3.25 8.25l3 3 6.5-6.5"/>',
  clock: '<circle cx="8" cy="8" r="5.25"/><path d="M8 5.25V8l2 1.25"/>',
  sun: '<circle cx="8" cy="9.25" r="2.75"/><path d="M8 2.75v1.5M3.25 9.25h-1M13.75 9.25h-1M4.5 5.75l-.75-.75M11.5 5.75l.75-.75M2.25 13.25h11.5"/>',
  grip: '<path d="M6.25 4.75v6.5M9.75 4.75v6.5"/>',
  // Status (solid, mark knocked out)
  warning: '<path class="solid" fill-rule="evenodd" d="M8 1.75c.4 0 .77.21.97.56l5.6 9.75a1.12 1.12 0 0 1-.97 1.69H2.4a1.12 1.12 0 0 1-.97-1.69l5.6-9.75c.2-.35.57-.56.97-.56zM7.25 5.5v3.75h1.5V5.5zM8 10.25a.88.88 0 1 0 0 1.75.88.88 0 0 0 0-1.75z"/>',
  danger: '<path class="solid" fill-rule="evenodd" d="M5.4 1.75h5.2l3.65 3.65v5.2l-3.65 3.65H5.4L1.75 10.6V5.4zM7.25 4.75v4.5h1.5v-4.5zM8 10.25a.88.88 0 1 0 0 1.75.88.88 0 0 0 0-1.75z"/>',
  clear: '<path class="solid" fill-rule="evenodd" d="M8 1.75a6.25 6.25 0 1 1 0 12.5 6.25 6.25 0 0 1 0-12.5zM10.7 5.4L7.1 9 5.3 7.2 4.25 8.25l2.85 2.85 4.65-4.65z"/>',
  info: '<path class="solid" fill-rule="evenodd" d="M8 1.75a6.25 6.25 0 1 1 0 12.5 6.25 6.25 0 0 1 0-12.5zM7.25 7v4.25h1.5V7zM8 4.25a.88.88 0 1 0 0 1.75.88.88 0 0 0 0-1.75z"/>',
};
export const icon = (name, cls = '') => {
  if (!icons[name]) throw new Error('no icon ' + name);
  return `<svg class="i ${cls}" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${icons[name]}</svg>`;
};
