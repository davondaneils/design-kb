// Writes icon-sheet.html: the Tally icon set at real size beside 14px text, and magnified 3x on its 16 grid with
// keylines (circle 13, square 12, live area 14), in both themes. Run from the repo root.
import fs from 'node:fs';
import path from 'node:path';
import { icon, names, iconCss, tallyMark } from './icons.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const grid = (s) => {
  const lines = [];
  for (let k = 0; k <= s; k++) lines.push(`<path d="M${k} 0V${s}M0 ${k}H${s}"/>`);
  return lines.join('');
};
const big = (n) => {
  const s = /^arrow/.test(n) ? 12 : 16;
  const inner = icon(n).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return `<svg class="big" viewBox="0 0 ${s} ${s}" width="${s * 6}" height="${s * 6}" aria-hidden="true"><g class="grid">${grid(s)}</g>`
    + (s === 16 ? '<g class="key"><circle cx="8" cy="8" r="6.5"/><rect x="2" y="2" width="12" height="12"/><rect x="1" y="1" width="14" height="14"/></g>' : '')
    + `<g class="ink i">${inner}</g></svg>`;
};
const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark">
<title>Tally icon set</title>
<style>
:root { color-scheme: light dark; --bg: #ffffff; --text: #101214; --muted: #5b6168; --line: #e3e6e8; --key: #f2a8a0;
  --font: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; }
@media (prefers-color-scheme: dark) { :root { --bg: #101214; --text: #eef0f1; --muted: #a3a9ae; --line: #2a2e31; --key: #7a3a34; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text); font: 500 0.875rem/1.5 var(--font); }
main { max-width: 1280px; margin: 0 auto; padding: 32px 16px 64px; display: grid; gap: 32px; }
h1 { font-size: 1.25rem; font-weight: 600; margin: 0; } p { margin: 4px 0 0; color: var(--muted); font-weight: 400; max-inline-size: 52ch; }
${iconCss}
.list { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 24px; }
.cell { display: grid; gap: 8px; }
.row { display: flex; align-items: center; gap: 8px; }
.row.sel { font-weight: 600; --icon-stroke: 1.75px; }
.big { display: block; overflow: visible; }
.big .grid { stroke: var(--line); stroke-width: 0.03; }
.big .key { fill: none; stroke: var(--key); stroke-width: 0.06; }
.big .ink { --icon-stroke: 1.5px; }
.i-12 { width: 12px; height: 12px; }
.small { font-size: 0.75rem; }
</style></head><body><main>
<header><h1>Tally icons</h1><p>16 grid for 14px labels, 12 grid for 12px labels. Stroke from CSS: 1.5px beside 500 text, 1.75px beside 600. Straight stems on quarter pixels, round caps and joins, status icons solid.</p></header>
<section class="list">
${names.map((n) => `<div class="cell">${big(n)}<div class="row ${/^arrow/.test(n) ? 'small' : ''}">${icon(n)}<span>${n}</span></div>${/^arrow/.test(n) ? '' : `<div class="row sel">${icon(n)}<span>${n}</span></div>`}</div>`).join('\n')}
<div class="cell"><svg class="big" viewBox="0 0 16 16" width="96" height="96" aria-hidden="true"><g class="grid">${grid(16)}</g><g>${tallyMark()}</g></svg><div class="row"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">${tallyMark()}</svg><span>tally (brand)</span></div></div>
</section></main></body></html>`;
fs.writeFileSync(path.join(here, 'icon-sheet.html'), html);
console.log('wrote icon-sheet.html');
