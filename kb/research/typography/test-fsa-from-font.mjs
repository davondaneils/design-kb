#!/usr/bin/env node
// Does `font-size-adjust: ex-height from-font` match inline code to the body x-height?
// Measures the rendered width of the same mono string in four set-ups (Chromium via tools/browser.mjs).
// Usage (repo root): node kb/research/typography/test-fsa-from-font.mjs
import { launch } from '../../../tools/browser.mjs';
const b = await launch();
const p = await (await b.newContext()).newPage();
await p.setContent(`<html lang="en"><body style="font: 16px Inter">
<p id="a">Text <code style="font-family:'Liberation Mono'">checkout_completed</code></p>
<p id="b">Text <code style="font-family:'Liberation Mono'; font-size-adjust: ex-height from-font">checkout_completed</code></p>
<p id="c" style="font-size-adjust: ex-height from-font">Text <code style="font-family:'Liberation Mono'">checkout_completed</code></p>
<p id="d">Text <code style="font-family:'Liberation Mono'; font-size-adjust: ex-height 0.546">checkout_completed</code></p>
</body></html>`);
const r = await p.evaluate(() => ['a', 'b', 'c', 'd'].map((id) => {
  const c = document.querySelector('#' + id + ' code');
  return { id, width: Math.round(c.getBoundingClientRect().width * 10) / 10, computed: getComputedStyle(c).fontSizeAdjust };
}));
console.log('a: no adjust | b: from-font on the code | c: from-font on the parent, inherited | d: Inter x-height number (0.546) on the code');
console.table(r);
await b.close();
