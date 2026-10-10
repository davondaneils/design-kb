// Debug helper: list elements wider than the viewport at 390px. Usage: node kb/tests/design-ux/parts/widest.mjs <page.html[?q]>
import { launch, toUrl } from '../../../../tools/browser.mjs';
const target = process.argv[2];
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto(toUrl(target));
const out = await page.evaluate(() => [...document.querySelectorAll('body *')].map((e) => {
  const r = e.getBoundingClientRect();
  return { r: Math.round(r.right), tag: e.tagName.toLowerCase() + '.' + [...e.classList].join('.'), text: (e.textContent || '').trim().slice(0, 40) };
}).filter((x) => x.r > 390).sort((a, b) => b.r - a.r).slice(0, 12));
console.log(out);
await browser.close();
