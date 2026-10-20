// Critic scratch: DOM checks per state and width. Reads the built page only.
import { launch, toUrl } from '../../../../../tools/browser.mjs';
const page0 = process.argv[2];
const states = ['default', 'empty', 'error', 'loading', 'nowindow', 'saved'];
const widths = [390, 768, 1024, 1440];
const browser = await launch();
for (const scheme of ['light']) for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, colorScheme: scheme });
  const page = await ctx.newPage();
  for (const s of states) {
    await page.goto(toUrl(page0 + (s === 'default' ? '' : '?state=' + s)));
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const out = { breaks: [], clipped: [], firstScreen: {} };
      // number+unit, ranges, times broken across lines
      const re = /(\d[\d.,]*\s(?:kn|nm|m|min|h)\b)|(\d\d:\d\d to \d\d:\d\d)|(\d+ h \d+ min)|(\d+ of \d+)|(Sat(?:urday)? 24 Oct(?:ober)?(?: 2026)?)|(Fri 23 Oct)/g;
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const el = n.parentElement; if (!el || el.closest('[hidden], .sr-only, script, style, [aria-hidden="true"]')) continue;
        const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        let m; re.lastIndex = 0;
        while ((m = re.exec(n.data))) {
          const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
          const tops = new Set([...rg.getClientRects()].filter((q) => q.width > 0).map((q) => Math.round(q.top)));
          if (tops.size > 1) out.breaks.push(m[0] + '  [' + (el.id || el.className || el.tagName) + ']');
        }
      }
      // text across element boundaries: check whole elements' text for the same patterns spanning nodes
      for (const el of document.querySelectorAll('p, dd, h3, li, span.lbl, .leg-lbl, .sum span, .sum strong')) {
        if (el.closest('[hidden]') || !el.offsetParent) continue;
      }
      // clipped table columns
      for (const t of document.querySelectorAll('table')) {
        if (!t.offsetParent) continue;
        let p = t.parentElement, clipBox = null;
        while (p && p !== document.body) { const cs = getComputedStyle(p); if (/clip|hidden|auto|scroll/.test(cs.overflowX)) { clipBox = p.getBoundingClientRect(); break; } p = p.parentElement; }
        if (!clipBox) continue;
        for (const th of t.querySelectorAll('thead th')) { const b = th.getBoundingClientRect(); if (b.right > clipBox.right + 1) out.clipped.push(`${th.textContent.trim()} right ${Math.round(b.right)} > box ${Math.round(clipBox.right)} (${getComputedStyle(p).overflowX})`); }
      }
      const y = (sel) => { const e = document.querySelector(sel); if (!e || !e.offsetParent) return null; return Math.round(e.getBoundingClientRect().top + scrollY); };
      out.firstScreen = { verdict: y('#verdict'), facts: y('#facts'), timeline: y('#timeline'), planLane: y('[data-row="plan"]'), warnings: y('#warnings-panel'), route: y('#route'), pageH: document.documentElement.scrollHeight };
      return out;
    });
    console.log(`\n== ${s} @${w} ${scheme}`);
    console.log(' positions', JSON.stringify(r.firstScreen));
    if (r.breaks.length) console.log(' BREAKS:', r.breaks.join(' | '));
    if (r.clipped.length) console.log(' CLIPPED:', r.clipped.join(' | '));
  }
  await ctx.close();
}
await browser.close();
