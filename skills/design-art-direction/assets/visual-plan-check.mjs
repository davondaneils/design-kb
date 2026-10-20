#!/usr/bin/env node
// visual-plan-check: does a built page meet the visual plan standard (FOUNDATIONS v0.5, Motion, "Visual plan")?
//
// It runs kb/teardowns/choreo-probe.mjs (the probe that measured Stripe, Linear and Framer) at 1440x900 and 390x844,
// then reads the page once more for the things the probe does not know: named type-only beats, the page kind and the
// declared treatment. Same probe, same slices, so a builder's numbers compare like with like against the exemplars
// (kb/teardowns/motion-imagery.md: Stripe 14 of 17 screens, Linear 10 of 12, Framer 12 of 12, benchmark Ferry 1 of 7).
//
// Usage (design-kb repo root, after `cd tools && npm ci`):
//   node skills/design-art-direction/assets/visual-plan-check.mjs <page.html|url> [--product] [--min 0.7]
//        [--widths 1440,390] [--json out.json] [--keep dir] [--probe path/to/choreo-probe.mjs]
//
// FAILS (exit 1) when, at any width:
//   coverage   screens with a visual (a slice whose visual cover is 15% or more, the probe's threshold) are under
//              --min (0.7) of the counted slices. A page with [data-visual] labels is measured on those labels plus
//              real media, on the probe's 40x40 grid; an unlabelled page uses the probe's own slices. Counted slices leave out (a) slices that are 50% or more covered by a section marked
//              data-beat="type" (a named type-only beat: a quote, pricing, a manifesto line) and (b) a last slice
//              shorter than half a screen (the footer stub). Type-only beats past 30% of all slices still count and warn.
//   fragments  a product page (<body data-page="product"> or --product) shows fewer than 3 product fragments
//              Counted as the shown [data-visual="product"] elements when the page labels any (label the stage that
//              crops a fragment, not the shell inside it); otherwise the probe's counts.productMock, which finds
//              unlabelled mock-ups by their UI-sized text (and double counts a card that wraps a labelled stage).
//   dropped    fragments at 390 are fewer than fragments at 1440 minus 1: the phone dropped pictures instead of
//              cropping them (Stripe has 14 at 390 against 12 at 1440).
// WARNS when:
//   treatment  the top-level [data-visual] elements do not share one treatment. Each visual's treatment is its
//              data-treatment attribute, else its computed --visual-treatment custom property (declare it once on
//              :root, for example `--visual-treatment: echo-fill;`). Missing or more than one distinct value warns.
//              This checks the declaration, not the pixels: the critic still compares the thumbnails (reference 01).
//   naming     a [data-visual] is neither aria-hidden="true", nor role="img" with a label, nor an <img> with alt,
//              nor inside a <figure> with a <figcaption>.
//   beats      a data-beat="type" section has no data-beat-name (say which beat it is: "quote", "pricing").
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../../..');
const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i === -1 ? d : args[i + 1]; };
const valued = ['--min', '--widths', '--json', '--keep', '--probe'];
const target = args.find((a, i) => !a.startsWith('--') && !valued.includes(args[i - 1]));
if (!target) { console.error('Usage: node visual-plan-check.mjs <page.html|url> [--product] [--min 0.7] [--widths 1440,390] [--json out.json] [--keep dir]'); process.exit(2); }
const MIN = Number(flag('--min', 0.7));
const WIDTHS = String(flag('--widths', '1440,390')).split(',').map(Number);
const probe = path.resolve(flag('--probe', path.join(repo, 'kb/teardowns/choreo-probe.mjs')));
if (!fs.existsSync(probe)) { console.error(`choreo-probe not found at ${probe}; pass --probe`); process.exit(2); }
const keep = flag('--keep', null);
const outDir = keep ? path.resolve(keep) : fs.mkdtempSync(path.join(os.tmpdir(), 'visual-plan-'));
fs.mkdirSync(outDir, { recursive: true });
const heightFor = (w) => (w < 600 ? 844 : 900); // the probe's defaults; slices must line up with them

const run = (w) => new Promise((resolve, reject) => {
  const out = path.join(outDir, `probe-${w}.json`);
  const p = spawn(process.execPath, [probe, target, out, '--width', String(w), '--height', String(heightFor(w))], { stdio: ['ignore', 'pipe', 'pipe'] });
  let err = '';
  p.stderr.on('data', (d) => { err += d; });
  p.on('close', (code) => (code === 0 ? resolve(JSON.parse(fs.readFileSync(out, 'utf8'))) : reject(new Error(`probe at ${w} exited ${code}: ${err.slice(-400)}`))));
});

// Second pass: what the probe does not record.
const PAGE = (vh) => {
  const docH = document.documentElement.scrollHeight;
  const beats = [...document.querySelectorAll('[data-beat="type"]')].map((el) => {
    const r = el.getBoundingClientRect();
    return { name: el.getAttribute('data-beat-name') || '', label: el.id || el.getAttribute('aria-labelledby') || el.className || el.tagName, top: r.top + scrollY, bottom: r.bottom + scrollY };
  });
  const visuals = [...document.querySelectorAll('[data-visual]')].filter((el) => !el.parentElement?.closest('[data-visual]')).map((el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const labelled = (el.getAttribute('role') === 'img' && (el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')))
      || (el.tagName === 'IMG' && el.hasAttribute('alt'))
      || el.getAttribute('aria-hidden') === 'true'
      || !!el.closest('figure')?.querySelector('figcaption');
    return {
      kind: el.dataset.visual,
      treatment: (el.dataset.treatment || s.getPropertyValue('--visual-treatment') || '').trim().replace(/^["']|["']$/g, ''),
      shown: s.display !== 'none' && s.visibility !== 'hidden' && r.width >= 48 && r.height >= 48,
      named: labelled,
      sel: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList.length ? '.' + [...el.classList].slice(0, 2).join('.') : ''),
      y: Math.round(r.top + scrollY),
    };
  });
  // Labelled coverage: the probe's grid method (40x40 samples per screen-height slice), counting only labelled
  // visuals and real media (img, video, canvas, svg 120x80+ outside a labelled visual). The probe's own text
  // heuristic is left out here because it reads text inside display:none nodes and can take a whole section as one
  // mock-up, so a page that hides its fragments at 390 still scores as covered.
  const vw = innerWidth;
  const boxes = [];
  const vis = (el) => { const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > 0.05; };
  const add = (el) => { const r = el.getBoundingClientRect(); if (r.width >= 48 && r.height >= 48 && vis(el)) boxes.push({ x: r.x, y: r.y + scrollY, w: Math.min(r.width, vw), h: r.height }); };
  for (const el of document.querySelectorAll('[data-visual]')) if (!el.parentElement?.closest('[data-visual]')) add(el);
  for (const el of document.querySelectorAll('img, video, canvas')) if (!el.closest('[data-visual]')) add(el);
  for (const el of document.querySelectorAll('svg')) { if (el.closest('[data-visual]') || el.parentElement.closest('svg')) continue; const r = el.getBoundingClientRect(); if (r.width >= 120 && r.height >= 80) add(el); }
  const slices = [];
  for (let y = 0; y < docH; y += vh) {
    let any = 0;
    for (let gy = 0; gy < 40; gy++) for (let gx = 0; gx < 40; gx++) {
      const px = (gx + 0.5) * vw / 40, py = y + (gy + 0.5) * vh / 40;
      if (boxes.some((b) => px >= b.x && px <= b.x + b.w && py >= b.y && py <= b.y + b.h && py <= y + vh)) any++;
    }
    slices.push(+(any / 1600).toFixed(2));
  }
  return { docH, beats, visuals, labelledCover: slices, product: document.body?.dataset.page === 'product' };
};

const readPage = async (w) => {
  const { launch, toUrl } = await import(pathToFileURL(path.join(repo, 'tools/browser.mjs')).href);
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: w, height: heightFor(w) }, deviceScaleFactor: 1, colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.goto(toUrl(target), { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(800);
  // scroll through once, like the probe, so lazy content and scroll reveals settle
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += heightFor(w)) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(80); }
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
  const info = await page.evaluate(PAGE, heightFor(w));
  await browser.close();
  return info;
};

const [probes, pages] = await Promise.all([Promise.all(WIDTHS.map(run)), Promise.all(WIDTHS.map(readPage))]);
const productPage = args.includes('--product') || pages.some((p) => p.product);
const fails = [], warns = [], perWidth = [];

WIDTHS.forEach((w, i) => {
  const im = probes[i].imagery, pg = pages[i], vh = heightFor(w);
  // Coverage source: a page that labels its visuals is measured on those labels (and real media); an unlabelled page
  // falls back to the probe's slices, which is how the exemplars were measured.
  const labelledPage = pg.visuals.length > 0;
  const slices = im.slices.map((s, k) => {
    const top = s.y, bottom = Math.min(s.y + vh, im.pageHeight);
    let beatCover = 0; let beatName = '';
    for (const b of pg.beats) { const o = Math.min(bottom, b.bottom) - Math.max(top, b.top); if (o > 0) { beatCover += o; beatName ||= b.name || b.label; } }
    const stub = bottom - top < vh * 0.5 && s.y > 0;
    return { y: s.y, cover: labelledPage ? (pg.labelledCover[k] ?? 0) : s.visualCoverage, probeCover: s.visualCoverage, kinds: s.byKind, beat: beatCover / vh >= 0.5 ? beatName : '', stub };
  });
  const beatSlices = slices.filter((s) => s.beat && !s.stub);
  const maxBeats = Math.floor(slices.length * 0.3);
  const excused = new Set(beatSlices.slice(0, maxBeats));
  if (beatSlices.length > maxBeats) warns.push(`beats ${w}: type-only beats fill ${beatSlices.length} of ${slices.length} slices; only ${maxBeats} (30%) are excused. A page this type-led follows design-typography reference 07, not this plan.`);
  const counted = slices.filter((s) => !s.stub && !excused.has(s));
  const withVisual = counted.filter((s) => s.cover >= 0.15).length;
  const share = counted.length ? withVisual / counted.length : 0;
  // Labelled fragments win when the page labels any: the probe's text heuristic also counts a card that wraps a
  // labelled stage (a bento card around its fragment), which double counts. Unlabelled pages fall back to the probe.
  const labelled = pg.visuals.filter((v) => v.kind === 'product' && v.shown).length;
  const frags = pg.visuals.some((v) => v.kind === 'product') ? labelled : im.counts.productMock;
  perWidth.push({ width: w, source: labelledPage ? 'labelled visuals' : 'probe', slices: slices.length, counted: counted.length, withVisual, share: +share.toFixed(2), fragments: frags, probeProductMock: im.counts.productMock, beats: beatSlices.map((s) => s.beat), sliceTable: slices });
  if (share < MIN) fails.push(`coverage ${w}: ${withVisual} of ${counted.length} counted slices carry a visual (${Math.round(share * 100)}%, needs ${Math.round(MIN * 100)}%). Empty slices at y ${counted.filter((s) => s.cover < 0.15).map((s) => s.y).join(', ')}`);
  if (productPage && frags < 3) fails.push(`fragments ${w}: ${frags} product fragment(s); a product page shows at least 3 at different scales or crops`);
  for (const b of pg.beats) if (!b.name) warns.push(`beats ${w}: data-beat="type" on ${b.label} has no data-beat-name`);
});
const i1440 = WIDTHS.indexOf(Math.max(...WIDTHS)), i390 = WIDTHS.indexOf(Math.min(...WIDTHS));
if (WIDTHS.length > 1) {
  const big = perWidth[i1440].fragments, small = perWidth[i390].fragments;
  if (small < big - 1) fails.push(`dropped: ${small} fragments at ${WIDTHS[i390]} against ${big} at ${WIDTHS[i1440]}; crop and scale them on the phone, do not hide them`);
}
const shown = pages[i1440].visuals.filter((v) => v.shown);
const treatments = [...new Set(shown.map((v) => v.treatment || '(none)'))];
if (!shown.length) warns.push('treatment: no [data-visual] elements; label every visual data-visual="product|photo|illustration|chart" so the plan can be checked');
else if (treatments.length > 1 || treatments[0] === '(none)') warns.push(`treatment: visuals declare ${treatments.join(', ')}; declare one --visual-treatment on :root (or data-treatment) and give every visual that treatment.${shown.some((v) => !v.treatment) ? ' Missing on: ' + shown.filter((v) => !v.treatment).map((v) => v.sel).slice(0, 4).join(', ') : ''}`);
for (const v of pages[i1440].visuals) if (!v.named) warns.push(`naming: ${v.sel} (y ${v.y}) is not aria-hidden, not a labelled role="img", not an img with alt, and has no figcaption`);

const report = { target, productPage, min: MIN, widths: perWidth, treatments, fails, warns, probeJson: keep ? WIDTHS.map((w) => path.join(outDir, `probe-${w}.json`)) : null };
if (flag('--json', null)) fs.writeFileSync(flag('--json'), JSON.stringify(report, null, 1));
if (!keep) fs.rmSync(outDir, { recursive: true, force: true });

console.log(`visual-plan-check ${target}${productPage ? ' (product page)' : ''}`);
for (const p of perWidth) {
  console.log(`  ${p.width} (${p.source}): visual on ${p.withVisual} of ${p.counted} counted slices (${Math.round(p.share * 100)}%; ${p.slices} slices${p.beats.length ? `, type beats excused: ${p.beats.join(', ')}` : ''}); product fragments ${p.fragments} (probe heuristic ${p.probeProductMock})`);
  console.log(`        cover by slice: ${p.sliceTable.map((s) => (s.stub ? 'stub' : s.beat ? 'beat' : Math.round(s.cover * 100) + '%')).join(' ')}`);
}
console.log(`  treatment: ${treatments.join(', ') || 'none declared'}`);
for (const f of fails) console.log(`  FAIL ${f}`);
for (const w of warns) console.log(`  warn ${w}`);
console.log(fails.length ? `FAIL (${fails.length})` : `PASS${warns.length ? ` with ${warns.length} warning(s)` : ''}`);
process.exit(fails.length ? 1 : 0);
