// Builds plan.html and plan-states.html from src/: inlines CSS, JS, the Inter subset, the wordmark and the icon set.
// Usage: node kb/tests/fresh/app/src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { icon } from './icons.mjs';
const here = path.dirname(new URL(import.meta.url).pathname);
const out = path.resolve(here, '..');
const read = (f) => fs.readFileSync(path.join(here, f), 'utf8');
const font = fs.readFileSync(path.join(here, 'inter-halyard.woff2')).toString('base64');
const wordmark = read('wordmark.svg').replace('<svg ', '<svg class="wordmark" aria-hidden="true" focusable="false" ');
const favicon = 'data:image/svg+xml,' + encodeURIComponent(read('favicon.svg'));
function fill(src) {
  return src
    .replaceAll('{{STYLE}}', () => read('plan.css'))
    .replaceAll('{{FONT}}', () => font)
    .replaceAll('{{MODEL}}', () => read('model.js'))
    .replaceAll('{{SCRIPT}}', () => read('plan.js'))
    .replaceAll('{{WORDMARK}}', () => wordmark)
    .replaceAll('{{FAVICON}}', () => favicon)
    .replace(/\{\{i:([a-z]+)(?:\s+([a-z-]+))?\}\}/g, (_, n, c) => icon(n, c || ''));
}
for (const [src, dst] of [['plan.src.html', 'plan.html'], ['plan-states.src.html', 'plan-states.html']]) {
  if (!fs.existsSync(path.join(here, src))) continue;
  const html = fill(read(src));
  if (/\u2014/.test(html)) throw new Error(dst + ' contains an em dash');
  fs.writeFileSync(path.join(out, dst), html);
  console.log(dst, (html.length / 1024).toFixed(1), 'KB');
}
