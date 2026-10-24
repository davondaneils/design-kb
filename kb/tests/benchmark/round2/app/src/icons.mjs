// Ferry product icon set (design-graphic reference 02, "Building a product icon set (code)").
// One source, shapes only. Drawn on a 16 grid for 14px labels (1.5px stroke, round caps and joins, set once in CSS
// on .i). Status glyphs are solid with the mark knocked out (evenodd, class "solid"), one color via currentColor.
// Metaphor table: payroll runs = calendar page (rejected: banknote, reads as "cash"); funding = bank columns
// (rejected: arrow into a box, reads as "download"); people = two heads; reports = three bars; held = clock
// (rejected: pause bars, reads as a media control); partial month = "i" in a circle (it is information, not a fault).

export const ICONS = {
  home: '<path d="M2.75 7.25 8 2.75l5.25 4.5v6h-3.5v-3.5h-3.5v3.5h-3.5z"/>',
  runs: '<rect x="2.75" y="3.75" width="10.5" height="9.5" rx="1.5"/><path d="M5.25 2.25v3M10.75 2.25v3M2.75 7.25h10.5"/>',
  people: '<circle cx="6" cy="5.5" r="2.25"/><path d="M2.25 13c.4-2.3 1.9-3.5 3.75-3.5s3.35 1.2 3.75 3.5"/><path d="M10.5 3.6a2.1 2.1 0 0 1 0 3.8M11.6 9.6c1.1.4 1.85 1.5 2.15 3.4"/>',
  funding: '<path d="M2.25 6 8 2.75 13.75 6M3.25 13.25h9.5M4.25 7.75v4M8 7.75v4M11.75 7.75v4"/>',
  reports: '<path d="M3.25 13.25V8.75M8 13.25V3.25M12.75 13.25v-6.5"/>',
  settings: '<circle cx="8" cy="8" r="2.25"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/>',
  help: '<circle cx="8" cy="8" r="5.75"/><path d="M6.4 6.4a1.65 1.65 0 1 1 2.3 1.5c-.45.2-.7.6-.7 1.05v.3M8 11.25v.01"/>',
  menu: '<path d="M2.75 4.75h10.5M2.75 8h10.5M2.75 11.25h10.5"/>',
  close: '<path d="m4 4 8 8M12 4l-8 8"/>',
  chevron: '<path d="m6.25 3.75 4.25 4.25-4.25 4.25"/>',
  sortDown: '<path d="M8 3.25v9.5M4.75 9.5 8 12.75l3.25-3.25"/>',
  sortUp: '<path d="M8 12.75v-9.5M4.75 6.5 8 3.25l3.25 3.25"/>',
  check: '<circle cx="8" cy="8" r="5.75"/><path d="m5.6 8.1 1.65 1.65L10.5 6.5"/>',
  clock: '<circle cx="8" cy="8" r="5.75"/><path d="M8 4.75V8l2.25 1.5"/>',
  lock: '<rect x="3.25" y="7.25" width="9.5" height="6.5" rx="1.5"/><path d="M5.5 7.25V5.5a2.5 2.5 0 0 1 5 0v1.75"/>',
  external: '<path d="M9.25 2.75h4v4M13.25 2.75 7.5 8.5M11.75 9.5v3.75h-9v-9H6.5"/>',
  // solid status glyphs, mark knocked out
  danger: '<path class="solid" fill-rule="evenodd" d="M8 1.75a6.25 6.25 0 1 1 0 12.5 6.25 6.25 0 0 1 0-12.5ZM7.2 4.5h1.6v4.75H7.2zM8 10.25a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9Z"/>',
  warning: '<path class="solid" fill-rule="evenodd" d="M8 1.75c.4 0 .75.2.95.55l5.6 9.9c.4.7-.1 1.55-.9 1.55H2.35c-.8 0-1.3-.85-.9-1.55l5.6-9.9c.2-.35.55-.55.95-.55ZM7.25 5.75h1.5v4h-1.5zM8 10.6a.85.85 0 1 1 0 1.7.85.85 0 0 1 0-1.7Z"/>',
  info: '<path class="solid" fill-rule="evenodd" d="M8 1.75a6.25 6.25 0 1 1 0 12.5 6.25 6.25 0 0 1 0-12.5ZM7.2 6.75h1.6v4.75H7.2zM8 3.85a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9Z"/>',
  failed: '<path class="solid" fill-rule="evenodd" d="M8 1.75a6.25 6.25 0 1 1 0 12.5 6.25 6.25 0 0 1 0-12.5ZM5.4 6.5l1.1-1.1L8 6.9l1.5-1.5 1.1 1.1L9.1 8l1.5 1.5-1.1 1.1L8 9.1l-1.5 1.5-1.1-1.1L6.9 8z"/>',
  done: '<path class="solid" fill-rule="evenodd" d="M8 1.75a6.25 6.25 0 1 1 0 12.5 6.25 6.25 0 0 1 0-12.5Zm2.45 4.2-3.2 3.2-1.7-1.7-1.05 1.05 2.75 2.75 4.25-4.25z"/>',
};

export const icon = (name, cls = '') =>
  `<svg class="i${cls ? ' ' + cls : ''}" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
