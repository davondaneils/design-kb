#!/usr/bin/env node
// Worst-pixel check for text over textures (WCAG F83, G18), used by the tester for design-art-direction.
// Renders the page, records every text element inside the selector with its box and color,
// hides all text (color: transparent), screenshots the clean background, then measures each box
// with skills/design-art-direction/assets/overlay_contrast.py.
// Usage (from the repo root): node kb/tests/design-art-direction/overlay-check.mjs <page.html> "<css selector>" [width] [scheme]
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { launch, toUrl } from '../../../tools/browser.mjs';

const [page, selector, width = '1440', scheme = 'light'] = process.argv.slice(2);
const here = path.dirname(new URL(import.meta.url).pathname);
const checker = path.resolve(here, '../../../skills/design-art-direction/assets/overlay_contrast.py');
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: Number(width), height: 900 }, colorScheme: scheme, deviceScaleFactor: 1 });
const p = await ctx.newPage();
await p.goto(toUrl(page), { waitUntil: 'load' });
const items = await p.evaluate((sel) => {
  const out = [];
  const toHex = (c) => { const m = c.match(/\d+(\.\d+)?/g).map(Number); return '#' + m.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join(''); };
  for (const root of document.querySelectorAll(sel)) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const el = walker.currentNode.parentElement;
      if (!walker.currentNode.textContent.trim() || seen.has(el)) continue;
      seen.add(el);
      const s = getComputedStyle(el);
      // Skip text on its own opaque fill (buttons, chips): it does not sit on the texture.
      let n = el, opaque = false;
      while (n && n !== root) { const bg = getComputedStyle(n).backgroundColor; if (!/rgba\(.*, 0\)$/.test(bg) && bg !== 'transparent') { opaque = true; break; } n = n.parentElement; }
      if (opaque) continue;
      const r = document.createRange(); r.selectNodeContents(el);
      for (const b of r.getClientRects()) {
        if (b.width < 2) continue;
        out.push({ text: el.textContent.trim().slice(0, 40), color: toHex(s.color), size: parseFloat(s.fontSize), bold: Number(s.fontWeight) >= 700,
          x: Math.round(b.left + scrollX), y: Math.round(b.top + scrollY), w: Math.round(b.width), h: Math.round(b.height) });
      }
    }
  }
  return out;
}, selector);
await p.addStyleTag({ content: `${selector}, ${selector} * { color: transparent !important; text-shadow: none !important; }` });
const shot = path.join(os.tmpdir(), 'overlay-bg.png');
await p.screenshot({ path: shot, fullPage: true });
await browser.close();
let fails = 0;
for (const it of items) {
  const large = it.size >= 24 || (it.bold && it.size >= 18.66);
  const min = large ? 3 : 4.5;
  let out = '', code = 0;
  try { out = execFileSync('python3', [checker, shot, '--box', it.x, it.y, it.w, it.h, '--text', it.color, '--min', min].map(String), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); }
  catch (e) { out = e.stdout; code = 1; }
  const worst = (out.match(/worst pixel:\s+([\d.]+)/) || [])[1];
  if (code) fails++;
  console.log(`${code ? 'FAIL' : 'pass'}  worst ${worst}:1 (min ${min})  ${it.color}  "${it.text}"`);
}
console.log(`${items.length} text boxes, ${fails} fail`);
fs.rmSync(shot, { force: true });
process.exit(fails ? 1 : 0);
