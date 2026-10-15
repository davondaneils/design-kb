// Critic scratch: sizes, row heights, weights in use at 1440 (default state).
import { launch, toUrl } from '../../../../../tools/browser.mjs';
const b = await launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); const p = await ctx.newPage();
await p.goto(toUrl(process.argv[2])); await p.waitForTimeout(300);
console.log(JSON.stringify(await p.evaluate(() => {
  const sizes = {}, weights = {};
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const e = n.parentElement; if (!n.data.trim() || !e.offsetParent || e.closest('.sr-only')) continue; const cs = getComputedStyle(e); sizes[cs.fontSize] = (sizes[cs.fontSize] || 0) + n.data.trim().length; weights[cs.fontWeight] = (weights[cs.fontWeight] || 0) + n.data.trim().length; }
  const h = (s) => [...document.querySelectorAll(s)].filter((e) => e.offsetParent).map((e) => Math.round(e.getBoundingClientRect().height));
  const lh = (s) => { const e = document.querySelector(s); const cs = getComputedStyle(e); return cs.fontSize + '/' + cs.lineHeight + ' ' + cs.fontWeight + ' ' + cs.letterSpacing; };
  return { sizes, weights, navRows: h('.sidebar .nav-list a'), warnRows: h('.warn'), facts: h('.fact'), tlRows: h('.tl-row'), wpRows: h('.wp-table tbody tr'), topbar: h('.topbar'), h1: lh('h1'), h2: lh('.panel-head h2'), big: lh('.fact .big'), answer: lh('#answer'), headings: [...document.querySelectorAll('h1,h2,h3')].filter((e) => e.offsetParent).map((e) => e.tagName + ':' + e.textContent.trim().slice(0, 24)) };
}), null, 1));
await b.close();
