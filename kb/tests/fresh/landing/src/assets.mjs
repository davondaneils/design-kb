#!/usr/bin/env node
// Renders the favicon (96px PNG, the symbol on its own field) and the 1200x630 social card from the built og page.
// Usage: node kb/tests/fresh/landing/src/assets.mjs   (then run build.mjs again to inline the favicon)
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const { launch } = await import(pathToFileURL(path.resolve(here, '../../../../../tools/browser.mjs')).href);
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 96, height: 96 }, deviceScaleFactor: 1, colorScheme: 'light' });
const p = await ctx.newPage();
await p.setContent(`<html><body style="margin:0;background:transparent"><svg width="96" height="96" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#1d2227"/><path d="M5 18.5c3.2 0 4.6-6 8-6s4.6 6 7.5 6 3.8-3 6.5-3" fill="none" stroke="#ffffff" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/><rect x="10.5" y="22.5" width="10" height="3" rx="1.5" fill="#df4897"/></svg></body></html>`);
await p.screenshot({ path: path.join(here, 'assets', 'favicon-96.png'), omitBackground: true });
const ctx3 = await browser.newContext({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
const p3 = await ctx3.newPage();
await p3.setContent((await p.content()).replace('width="96" height="96"', 'width="512" height="512"'));
await p3.screenshot({ path: path.resolve(here, '..', 'logo-512.png'), omitBackground: true });
const ctx2 = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
const p2 = await ctx2.newPage();
await p2.goto(pathToFileURL(path.join(here, 'og.built.html')).href);
await p2.evaluate(() => document.fonts.ready);
await p2.screenshot({ path: path.resolve(here, '..', 'og.png') });
await browser.close();
console.log('wrote favicon-96.png, logo-512.png and og.png');
