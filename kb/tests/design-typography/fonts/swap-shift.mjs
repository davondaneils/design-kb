#!/usr/bin/env node
// Measures how far the layout moves when the web font replaces the fallback (the font-swap shift).
// Compares each page with fonts against the same page with only its fallback stack.
// Usage (repo root): node kb/tests/design-typography/fonts/swap-shift.mjs <with-fonts.html> <fallback-only.html> [selectors]
import { launch, toUrl } from '../../../../tools/browser.mjs';
const [a, b, sels = 'h1,h2,.notes,.lead,.price,.manifesto,main > section,footer'] = process.argv.slice(2);
const br = await launch();
async function boxes(file, width) {
  const p = await (await br.newContext({ viewport: { width, height: 900 } })).newPage();
  await p.goto(toUrl(file)); await p.evaluate(() => document.fonts.ready);
  return p.evaluate((s) => [...document.querySelectorAll(s)].map((el) => {
    const r = el.getBoundingClientRect();
    return { el: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''), top: r.top + scrollY, h: r.height, w: r.width };
  }).concat([{ el: 'document', top: 0, h: document.documentElement.scrollHeight, w: 0 }]), sels);
}
for (const width of [390, 1440]) {
  const A = await boxes(a, width), B = await boxes(b, width);
  console.log(`\n${width}px: element, top shift px, height change px (fallback minus web font)`);
  A.forEach((x, i) => console.log(`  ${x.el.padEnd(22)} ${(B[i].top - x.top).toFixed(0).padStart(5)} ${(B[i].h - x.h).toFixed(0).padStart(5)}`));
}
await br.close();
