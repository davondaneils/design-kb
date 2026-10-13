#!/usr/bin/env node
// Builds ../ferry.html and ../ferry-states.html from page.html, page.css, page.js and the font and logo sources here.
// Run from the repo root: node kb/tests/benchmark/round2/landing/src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..');
const read = (f) => fs.readFileSync(path.join(here, f), 'utf8');
const { launch } = await import(path.join(here, '../../../../../../tools/browser.mjs'));

// Wordmark: outlined Bricolage Grotesque, wght 640, opsz 96, track -20 (wordmark.py). viewBox raised for the y descender.
const raw = read('wordmark-raw.svg');
const paths = [...raw.matchAll(/<path[^>]*\/>/g)].map((m) => m[0]).join('');
const WORD_VB = '0 -4 317 135';
const mark = '<svg class="logo__mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false" data-logo><path d="M2 12h6M8 12c4 0 5-6.5 9-6.5h5M8 12h14M8 12c4 0 5 6.5 9 6.5h5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const LOGO = `${mark}<svg class="logo__word" viewBox="${WORD_VB}" aria-hidden="true" focusable="false" data-logo>${paths}</svg>`;
const WORDMARK_OUTLINE = `<svg viewBox="${WORD_VB}" focusable="false" data-logo>${paths}</svg>`;
fs.writeFileSync(path.join(here, 'wordmark.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${WORD_VB}">${paths}</svg>\n`);

// Favicon: the mark on its own dark field, so it reads on light and dark tabs.
const favSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0e1217"/><path d="M5 16h7M12 16c5 0 6-8.5 11-8.5h4M12 16h15M12 16c5 0 6 8.5 11 8.5h4" fill="none" stroke="#ff7549" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
fs.writeFileSync(path.join(here, 'favicon.svg'), favSvg + '\n');
const browser = await launch();
const pg = await browser.newPage({ viewport: { width: 32, height: 32 }, deviceScaleFactor: 1 });
await pg.setContent(`<html><body style="margin:0;background:transparent">${favSvg.replace('<svg ', '<svg width="32" height="32" ')}</body></html>`);
const png = await pg.screenshot({ omitBackground: true });
fs.writeFileSync(path.join(here, 'favicon-32.png'), png);
await browser.close();
const FAVICON_SVG = 'data:image/svg+xml,' + encodeURIComponent(favSvg);
const FAVICON_PNG = 'data:image/png;base64,' + png.toString('base64');

// Font: one variable subset (wght 400 to 640, opsz 14 to 96, wdth 100) made by font_kit.py, plus a metric-matched fallback.
const font = fs.readFileSync(path.join(here, 'bricolage-sub.woff2')).toString('base64');
const FONTFACE = `@font-face { font-family: "Bricolage"; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 400 640; font-style: normal; font-display: swap; }
@font-face { font-family: "Bricolage Fallback"; src: local("Arial"), local("Liberation Sans"), local("Helvetica"); size-adjust: 97.83%; ascent-override: 95.06%; descent-override: 27.60%; line-gap-override: 0%; }`;

const fill = (tpl, map) => tpl.replace(/\{\{([A-Z_]+)\}\}/g, (m, k) => (k in map ? map[k] : m));
// Inline every <use> icon from the page's sprite, so audits and forced colors see real paths; then drop the sprite.
const inlineIcons = (html) => {
  const syms = Object.fromEntries([...html.matchAll(/<symbol id="([^"]+)" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/g)].map((m) => [m[1], { vb: m[2], body: m[3] }]));
  html = html.replace(/<svg class="([^"]+)" aria-hidden="true"><use href="#([^"]+)"\/><\/svg>/g, (m, cls, id) => `<svg class="${cls}" viewBox="${syms[id].vb}" aria-hidden="true" focusable="false">${syms[id].body}</svg>`);
  return html.replace(/<svg width="0" height="0"[\s\S]*?<\/svg>\n?/, '');
};
const map = { LOGO, WORDMARK_OUTLINE, FAVICON_SVG, FAVICON_PNG, FONTFACE, CSS: read('page.css'), JS: read('page.js') };
const html = inlineIcons(fill(read('page.html'), map));
if (/\u2014/.test(html)) throw new Error('em dash in output');
fs.writeFileSync(path.join(out, 'ferry.html'), html);
const states = inlineIcons(fill(read('states.html'), { ...map, JS: read('states.js') }));
if (/\u2014/.test(states)) throw new Error('em dash in state sheet');
fs.writeFileSync(path.join(out, 'ferry-states.html'), states);
console.log('ferry.html', (Buffer.byteLength(html) / 1024).toFixed(1), 'KB; ferry-states.html', (Buffer.byteLength(states) / 1024).toFixed(1), 'KB');
