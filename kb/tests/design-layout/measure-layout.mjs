#!/usr/bin/env node
// Layout metrics for the design-layout rendered test (kb/tests/design-layout.md). Run from the repo root:
//   node kb/tests/design-layout/measure-layout.mjs kb/tests/combined/coffee.html kb/tests/design-layout/coffee.html ...
// Per page and width (390, 768, 1024, 1440; light; 900px tall viewport) it reports:
//   height     full document height in px (phone length is the cost of not editing)
//   cta        bottom edge of the first visible primary button (in the first screen when under 844 on a phone)
//   fold       top edges of named landmarks, to check what peeks above a 900px fold
//   edges      distinct left edges of text blocks inside <main> at that width, and how many carry 3 or more blocks
//              (design-layout gate rule 4: count the left edges; a strong grid reuses few edges many times)
import { launch, toUrl } from '../../../tools/browser.mjs';

const pages = process.argv.slice(2);
const marks = ['#shop', '#subscribe', '#story', '.split', '.attention', '#pages-title'];
const b = await launch();
const out = [];
for (const file of pages) {
  for (const width of [390, 768, 1024, 1440]) {
    const ctx = await b.newContext({ viewport: { width, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    await p.goto(toUrl(file), { waitUntil: 'load' });
    await p.waitForTimeout(150);
    const r = await p.evaluate((marks) => {
      const vis = (e) => { const s = getComputedStyle(e); const q = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && q.width > 0 && q.height > 0; };
      const cta = [...document.querySelectorAll('.btn-primary')].find(vis);
      const fold = {};
      for (const m of marks) { const e = document.querySelector(m); if (e && vis(e)) fold[m] = Math.round(e.getBoundingClientRect().top + scrollY); }
      const main = document.querySelector('main');
      const blocks = [...main.querySelectorAll('h1, h2, h3, p, li, dt, dd, caption, figcaption, th')].filter((e) => vis(e) && e.textContent.trim() && !e.closest('[aria-hidden=true], dialog, .state, .sr-only'));
      const count = new Map();
      for (const e of blocks) { const x = Math.round(e.getBoundingClientRect().left / 4) * 4; count.set(x, (count.get(x) || 0) + 1); }
      return {
        height: document.documentElement.scrollHeight,
        cta: cta ? Math.round(cta.getBoundingClientRect().bottom + scrollY) : null,
        fold,
        edges: count.size,
        strongEdges: [...count.values()].filter((n) => n >= 3).length,
      };
    }, marks);
    out.push({ page: file.replace(/^kb\/tests\//, ''), width, ...r, fold: JSON.stringify(r.fold) });
    await ctx.close();
  }
}
await b.close();
console.table(out);
