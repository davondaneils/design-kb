#!/usr/bin/env node
// Render a page to full-page screenshots at 390px and 1440px, light and dark.
//
// Usage:
//   node tools/render.mjs <html-or-url[?state=x]> <outdir> [--name base] [--jpeg [quality]]
//          [--widths 390,1440] [--schemes light,dark] [--viewport-only]
//
// Output: <outdir>/<base>-<width>-<scheme>.png (or .jpg), plus a list on stdout.
import fs from 'node:fs';
import path from 'node:path';
import { launch, toUrl, splitTarget } from './browser.mjs';

function parseArgs(argv) {
  const opts = { widths: [390, 1440], schemes: ['light', 'dark'], jpeg: false, quality: 70, viewportOnly: false };
  const pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--name') opts.name = argv[++i];
    else if (a === '--jpeg') {
      opts.jpeg = true;
      if (argv[i + 1] && /^\d+$/.test(argv[i + 1])) opts.quality = Number(argv[++i]);
    } else if (a === '--widths') opts.widths = argv[++i].split(',').map(Number);
    else if (a === '--schemes') opts.schemes = argv[++i].split(',');
    else if (a === '--viewport-only') opts.viewportOnly = true;
    else if (a === '--max-height') opts.maxHeight = Number(argv[++i]);
    else pos.push(a);
  }
  [opts.target, opts.outdir] = pos;
  return opts;
}

const opts = parseArgs(process.argv.slice(2));
if (!opts.target || !opts.outdir) {
  console.error('Usage: node tools/render.mjs <html-or-url> <outdir> [--name base] [--jpeg [q]] [--widths 390,1440] [--schemes light,dark]');
  process.exit(2);
}
const isRemote = /^https?:/.test(opts.target);
const split = isRemote ? { file: opts.target, slug: '' } : splitTarget(opts.target);
const base = opts.name || (path.basename(split.file).replace(/\.html?$/, '') + (split.slug ? '-' + split.slug : '')) || 'page';
fs.mkdirSync(opts.outdir, { recursive: true });

const browser = await launch();
const written = [];
let failures = 0;
try {
  for (const scheme of opts.schemes) {
    for (const width of opts.widths) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        colorScheme: scheme,
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      try {
        await page.goto(toUrl(opts.target), { waitUntil: isRemote ? 'domcontentloaded' : 'load', timeout: 45000 });
        if (isRemote) {
          await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
          // Scroll through once so lazy images load, then return to top.
          await page.evaluate(async () => {
            const step = window.innerHeight;
            const max = Math.min(document.body.scrollHeight, 20000);
            for (let y = 0; y < max; y += step) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 150)); }
            window.scrollTo(0, 0);
          }).catch(() => {});
          await page.waitForTimeout(800);
        }
        await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
        const ext = opts.jpeg ? 'jpg' : 'png';
        const file = path.join(opts.outdir, `${base}-${width}-${scheme}.${ext}`);
        const shot = { path: file, fullPage: !opts.viewportOnly, animations: 'disabled', type: opts.jpeg ? 'jpeg' : 'png' };
        if (opts.jpeg) shot.quality = opts.quality;
        if (opts.maxHeight && !opts.viewportOnly) {
          const h = await page.evaluate(() => document.documentElement.scrollHeight);
          if (h > opts.maxHeight) { shot.fullPage = true; shot.clip = { x: 0, y: 0, width, height: opts.maxHeight }; }
        }
        await page.screenshot(shot);
        written.push(file);
        console.log(`wrote ${file}`);
      } catch (err) {
        failures++;
        console.error(`FAILED ${width}px ${scheme}: ${err.message.split('\n')[0]}`);
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}
process.exit(failures && !written.length ? 1 : 0);
