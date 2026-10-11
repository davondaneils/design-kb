#!/usr/bin/env node
// Page weight of a self-contained HTML file, split by what the bytes are, raw and compressed, plus the critical path:
// how many compressed bytes must arrive before the browser can paint the first content and the hero (LCP) element.
//
// Usage: node weight.mjs <page.html> [--lcp "selector"] [--json out.json]
//
// Categories: inline font files (data: URLs in @font-face), other data: URLs, CSS (without the font data), inline SVG
// markup, script, the rest of the HTML. "Before first paint" is everything up to the end of <head> (render-blocking CSS
// and sync script); "before LCP" is everything up to the end of the hero element's opening tag plus its text.
// Reference point: the first round trip carries about 14 KB (MDN, "How browsers work"); every further 14 KB to 28 KB
// costs another round trip while TCP slow start ramps up.
import fs from 'node:fs';
import zlib from 'node:zlib';
import { parseArgs } from './pw.mjs';

const opts = parseArgs(process.argv.slice(2), ['lcp', 'json']);
const file = opts._[0];
if (!file) { console.error('Usage: node weight.mjs <page.html> [--lcp "#hero-title"] [--json out.json]'); process.exit(2); }
const html = fs.readFileSync(file, 'utf8');
const B = (s) => Buffer.byteLength(s);
const gz = (s) => zlib.gzipSync(s, { level: 6 }).length;
const br = (s) => zlib.brotliCompressSync(s).length;

const cats = { fonts: '', dataUrls: '', css: '', svg: '', script: '', html: '' };
let rest = html;
const take = (re, cat) => { rest = rest.replace(re, (m) => { cats[cat] += m; return ''; }); };
// Font data first (inside CSS), then other data URLs, then the containers.
let css = (html.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []).join('\n');
const fontData = css.match(/url\(["']?data:font\/[^)]*\)/g) || [];
cats.fonts = fontData.join('');
let cssNoFonts = css; for (const f of fontData) cssNoFonts = cssNoFonts.replace(f, 'url()');
const otherData = cssNoFonts.match(/url\(["']?data:[^)]*\)/g) || [];
cats.dataUrls = otherData.join('');
for (const d of otherData) cssNoFonts = cssNoFonts.replace(d, 'url()');
cats.css = cssNoFonts;
rest = rest.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
take(/<script[^>]*>[\s\S]*?<\/script>/g, 'script');
take(/<svg[\s\S]*?<\/svg>/g, 'svg');
cats.html = rest;

const rows = Object.entries(cats).map(([k, v]) => ({ part: k, raw: B(v), gzip: v ? gz(v) : 0 }));
const total = { raw: B(html), gzip: gz(html), br: br(html) };
const headEnd = html.indexOf('</head>');
let lcpEnd = -1;
if (opts.lcp) {
  const sel = opts.lcp.replace(/^#/, '');
  const i = html.search(new RegExp(`id=["']${sel}["']`));
  if (i !== -1) { const close = html.indexOf('</', html.indexOf('>', i)); lcpEnd = close; }
}
const crit = {
  beforePaint: { raw: B(html.slice(0, headEnd)), gzip: gz(html.slice(0, headEnd)), br: br(html.slice(0, headEnd)) },
  beforeLcp: lcpEnd > 0 ? { raw: B(html.slice(0, lcpEnd)), gzip: gz(html.slice(0, lcpEnd)), br: br(html.slice(0, lcpEnd)) } : null,
};
const kb = (n) => (n / 1024).toFixed(1).padStart(7);
console.log(`${file}`);
console.log(`  total      ${kb(total.raw)} KB raw  ${kb(total.gzip)} KB gzip  ${kb(total.br)} KB brotli`);
for (const r of rows) console.log(`  ${r.part.padEnd(10)} ${kb(r.raw)} KB raw  ${kb(r.gzip)} KB gzip  (${((r.raw / total.raw) * 100).toFixed(0)}% of raw)`);
console.log(`  before first paint (end of <head>): ${kb(crit.beforePaint.gzip)} KB gzip, ${kb(crit.beforePaint.br)} KB brotli`);
if (crit.beforeLcp) console.log(`  before LCP element (${opts.lcp}):     ${kb(crit.beforeLcp.gzip)} KB gzip, ${kb(crit.beforeLcp.br)} KB brotli`);
if (opts.json) fs.writeFileSync(opts.json, JSON.stringify({ file, total, parts: rows, critical: crit }, null, 2));
