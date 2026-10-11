// Writes mark-sheet.html: the stress-test suite from design-graphic references/01 run on the Ember & Oak marks,
// at real CSS sizes, in both polarities. Run from the repo root: node kb/tests/design-graphic/mark-sheet.mjs
import fs from 'node:fs';
import path from 'node:path';
import { wordmark, symbol, tiny, faviconSvg, appIconSvg, dataUri, dims } from './marks.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const fav = dataUri(faviconSvg());
const app = dataUri(appIconSvg());
const tinySvg = (px, ink) => `<svg width="${px}" height="${px}" viewBox="0 0 32 32" aria-hidden="true">${tiny(ink, '#f26b21')}</svg>`;
let n = 0;
const wm = (o = {}) => wordmark({ id: 'wm' + n++, ...o });

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${fav}" type="image/svg+xml">
<title>Ember &amp; Oak mark sheet</title>
<style>
:root { color-scheme: light dark; --ink: #27201a; --paper: #f9f6f4; --ember: #f26b21; --muted: #79685b; --line: #dfd5ce;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Arial, sans-serif; }
@media (prefers-color-scheme: dark) { :root { --ink: #f9f6f4; --paper: #16100c; --muted: #ccbeb3; --line: #4f4238; } }
* { box-sizing: border-box; }
body { margin: 0; background: var(--paper); color: var(--ink); font: 0.875rem/1.5 var(--font-sans); }
main { padding: 32px 16px 64px; max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr); gap: 48px; }
h1 { font-size: 1.25rem; margin: 0; } h2 { font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin: 0 0 16px; }
p { margin: 8px 0 0; color: var(--muted); max-inline-size: 52ch; }
.row { display: flex; flex-wrap: wrap; gap: 24px; align-items: flex-end; }
.ember { fill: var(--ember); }
.wordmark { display: block; height: auto; }
.panel { padding: 32px; border-radius: 12px; display: grid; gap: 24px; }
.light { background: #f9f6f4; color: #27201a; } .dark { background: #16100c; color: #f9f6f4; } .orange { background: #f26b21; color: #27201a; }
.orange .ember, .mono .ember { fill: currentColor; }
.tab { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 8px 8px 0 0; background: #eee8e4; color: #27201a; font-size: 0.75rem; }
.tab.d { background: #2b2420; color: #f9f6f4; }
.avatar { width: 64px; height: 64px; border-radius: 9999px; background: #27201a; color: #f9f6f4; display: grid; place-items: center; overflow: hidden; }
.avatar svg { width: 48px; height: 48px; }
.blur svg { filter: blur(6px); width: 200px; height: 200px; }
.clear { position: relative; display: block; width: fit-content; max-width: 100%; padding: 24px; outline: 1px dashed var(--muted); }
.clear .wordmark { outline: 1px solid var(--line); }
small { display: block; color: var(--muted); font-size: 0.75rem; margin-top: 8px; }
.light small { color: #79685b; } .dark small { color: #ccbeb3; }
.wordmark { max-width: 100%; }
.row > * { min-width: 0; max-width: 100%; }
h2 { text-wrap: balance; }
</style></head><body><main>
<header><h1>Ember &amp; Oak marks: stress test</h1><p>Wordmark outlined from Newsreader (OFL, opsz 72, weight 480), italic ampersand, spaced by eye; one drawn detail: an ember in the O. Every sample is at its real CSS size.</p></header>

<section><h2>1. Wordmark, both polarities, plus one color on the brand field</h2>
<div class="panel light">${wm({ cls: 'wordmark', id: 'a' })}<div class="row"><div style="width:240px">${wm({ id: 'b' })}<small>240px wide, header size</small></div><div style="width:120px">${wm({ id: 'c', ringOn: 1 })}<small>120px, minimum: inner ring dropped</small></div></div></div>
<div class="panel dark">${wm({ id: 'd' })}<div class="row"><div style="width:240px">${wm({ id: 'e' })}</div><div style="width:120px">${wm({ id: 'f', ringOn: 1 })}</div></div></div>
<div class="panel orange">${wm({ id: 'g' })}<p style="color:#27201a">One color: the ember takes the ink. The mark still reads; the dot becomes a counter detail.</p></div>
</section>

<section><h2>2. Small sizes: symbol tiers and favicon</h2>
<div class="row">
 <div>${symbol({ label: 'Ember & Oak symbol' }).replace('class="symbol"', 'class="symbol" width="120" height="120"')}<small>Tier 3, 120px</small></div>
 <div>${symbol().replace('class="symbol"', 'class="symbol" width="48" height="48"')}<small>Tier 3, 48px</small></div>
 <div>${tinySvg(32, 'currentColor')}<small>Tier 4, 32px</small></div>
 <div>${tinySvg(16, 'currentColor')}<small>Tier 4, 16px</small></div>
 <div><span class="tab"><img src="${fav}" width="16" height="16" alt="">Ember &amp; Oak</span><span class="tab d"><img src="${fav}" width="16" height="16" alt="">Ember &amp; Oak</span><small>Favicon in a light and a dark tab</small></div>
 <div class="avatar">${symbol()}</div><div><img src="${app}" width="60" height="60" alt="App icon" data-lint-skip="radius" style="border-radius:13px"><small>apple-touch-icon 180, at 60</small></div>
</div></section>

<section><h2>3. Blur test (6px at 200px): the silhouette alone</h2>
<div class="row blur"><div>${symbol()}</div><div style="width:480px;max-width:100%">${wm({ id: 'h' }).replace('class="wordmark"', 'class="wordmark" style="filter:blur(4px)"')}</div></div>
<p>Pass if the ring and dot read as one ring with a hot point, and the word still shows its ascender rhythm (E, b, &amp;, O, k).</p></section>

<section><h2>4. Clear space: one cap height on every side</h2>
<div class="clear" data-lint-skip="spacing" style="padding:${(48 / dims.H * 100).toFixed(0)}px">${wm({ id: 'i' }).replace('class="wordmark"', 'class="wordmark" style="width:480px;max-width:100%"')}</div>
<p>Unit = cap height of the wordmark (wordmark height minus overshoot pad). Minimum size: 120px wide on screen, 30mm in print; below that use the symbol.</p></section>
</main></body></html>`;
fs.writeFileSync(path.join(here, 'mark-sheet.html'), html);
console.log('wrote mark-sheet.html', (html.length / 1024).toFixed(1), 'KB');
