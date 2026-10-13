// First-screen facts for ferry.html: where the primary action, the price line and the motif sit, and what peeks above the fold.
// Run from the repo root: node kb/tests/benchmark/round2/landing/src/firstscreen.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const { launch, toUrl } = await import(path.join(here, '../../../../../../tools/browser.mjs'));
const b = await launch();
for (const [w, h] of [[390, 844], [768, 1024], [1024, 768], [1440, 900]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(toUrl(path.join(here, '../ferry.html')));
  await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const bot = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().bottom) : null; };
    const top = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().top) : null; };
    return { h1: bot('#hero-title'), cta: bot('#signup .btn'), price: bot('#email-terms'), runTop: top('.run'), firstLane: top('.ledger tbody tr'), next: top('.proof') };
  });
  console.log(w + 'x' + h, JSON.stringify(r));
  await p.close();
}
await b.close();
