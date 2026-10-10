#!/usr/bin/env node
// Prove a refactor did not change the look: render two pages the same way and compare every pixel.
//
// Usage:
//   node pixel-diff.mjs <before.html> <after.html> [--widths 390,768,1024,1440] [--schemes light,dark]
//        [--queries "state=loading,density=compact"] [--out dir] [--tolerance 0] [--json out.json]
//        [--inject-after "css"] [--inject "css"]
//
// Each (query x scheme x width) renders both pages full page at DPR 1 with reduced motion and fonts loaded (as
// tools/render.mjs does), then compares RGBA per pixel. A pixel differs when any channel differs by more than
// --tolerance (default 0: exact). Writes <out>/<name>-diff.png only where pixels differ: changed pixels in red over a
// faded copy of "before". Exit 1 if any pair differs or the page heights differ.
// --inject-after adds a style tag to the after page only: use it to switch off one intended change (a bug fix) and
// prove that everything else is pixel-identical. --inject adds a style tag to both pages (to bisect a difference). Report the intended change and its own diff separately.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { launch, parseArgs } from './pw.mjs';

const opts = parseArgs(process.argv.slice(2), ['widths', 'schemes', 'queries', 'out', 'tolerance', 'json', 'inject-after', 'inject']);
const [a, b] = opts._;
if (!a || !b) { console.error('Usage: node pixel-diff.mjs <before.html> <after.html> [--widths ..] [--schemes ..] [--queries ..] [--out dir]'); process.exit(2); }
const widths = (opts.widths || '390,768,1024,1440').split(',').map(Number);
const schemes = (opts.schemes || 'light,dark').split(',');
const queries = ['', ...(opts.queries ? opts.queries.split(',').map((q) => '?' + q.replace(/\+/g, '&')) : [])];
const tol = Number(opts.tolerance || 0);
const out = opts.out || null;
if (out) fs.mkdirSync(out, { recursive: true });
const url = (f, q) => pathToFileURL(path.resolve(f)).href + q;

const browser = await launch();
const cmp = await (await browser.newContext()).newPage();
const results = [];
let failed = 0;
try {
  for (const q of queries) for (const scheme of schemes) for (const width of widths) {
    const shots = [];
    for (const f of [a, b]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1, colorScheme: scheme, reducedMotion: 'reduce' });
      const p = await ctx.newPage();
      await p.goto(url(f, q), { waitUntil: 'load' });
      if (opts.inject) await p.addStyleTag({ content: opts.inject });
      if (f === b && opts['inject-after']) await p.addStyleTag({ content: opts['inject-after'] });
      await p.evaluate(() => document.fonts && document.fonts.ready);
      await p.waitForTimeout(150);
      shots.push(await p.screenshot({ fullPage: true, animations: 'disabled', caret: 'hide' }));
      await ctx.close();
    }
    const r = await cmp.evaluate(async ({ A, B, tol }) => {
      const load = (s) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + s; });
      const [ia, ib] = await Promise.all([load(A), load(B)]);
      const w = Math.min(ia.width, ib.width), h = Math.min(ia.height, ib.height);
      const ca = new OffscreenCanvas(w, h), cb = new OffscreenCanvas(w, h);
      const xa = ca.getContext('2d'), xb = cb.getContext('2d');
      xa.drawImage(ia, 0, 0); xb.drawImage(ib, 0, 0);
      const da = xa.getImageData(0, 0, w, h).data, db = xb.getImageData(0, 0, w, h).data;
      let diff = 0, maxDelta = 0, minY = Infinity, maxY = -1;
      const mark = new Uint8Array(w * h);
      for (let i = 0, px = 0; i < da.length; i += 4, px++) {
        const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]), Math.abs(da[i + 3] - db[i + 3]));
        if (d > maxDelta) maxDelta = d;
        if (d > tol) { diff++; mark[px] = 1; const y = (px / w) | 0; if (y < minY) minY = y; if (y > maxY) maxY = y; }
      }
      let png = null;
      if (diff) {
        const img = xa.getImageData(0, 0, w, h);
        for (let px = 0; px < mark.length; px++) { const i = px * 4;
          if (mark[px]) { img.data[i] = 255; img.data[i + 1] = 0; img.data[i + 2] = 0; img.data[i + 3] = 255; }
          else { img.data[i] = 255 - (255 - img.data[i]) * 0.25; img.data[i + 1] = 255 - (255 - img.data[i + 1]) * 0.25; img.data[i + 2] = 255 - (255 - img.data[i + 2]) * 0.25; } }
        xa.putImageData(img, 0, 0);
        const blob = await ca.convertToBlob({ type: 'image/png' });
        const buf = new Uint8Array(await blob.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
        png = btoa(s);
      }
      return { wa: ia.width, ha: ia.height, wb: ib.width, hb: ib.height, pixels: w * h, diff, maxDelta, rows: diff ? [minY, maxY] : null, png };
    }, { A: shots[0].toString('base64'), B: shots[1].toString('base64'), tol });
    const name = `${path.basename(b, '.html')}${q ? '-' + q.slice(1).replace(/[=&]/g, '-') : ''}-${width}-${scheme}`;
    const sameSize = r.wa === r.wb && r.ha === r.hb;
    if (r.png && out) fs.writeFileSync(path.join(out, name + '-diff.png'), Buffer.from(r.png, 'base64'));
    const ok = r.diff === 0 && sameSize;
    if (!ok) failed++;
    results.push({ name, query: q, scheme, width, sizeBefore: [r.wa, r.ha], sizeAfter: [r.wb, r.hb], pixels: r.pixels, diffPixels: r.diff, maxDelta: r.maxDelta, rows: r.rows, identical: ok });
    console.log(`${ok ? 'same' : 'DIFF'}  ${name.padEnd(48)} ${r.wa}x${r.ha} vs ${r.wb}x${r.hb}  ${r.diff} px differ${r.diff ? ` (max channel delta ${r.maxDelta}, rows ${r.rows[0]} to ${r.rows[1]})` : ''}`);
  }
} finally { await browser.close(); }
console.log(`${results.length - failed} of ${results.length} identical`);
if (opts.json) fs.writeFileSync(opts.json, JSON.stringify({ before: a, after: b, tolerance: tol, results }, null, 2));
process.exit(failed ? 1 : 0);
