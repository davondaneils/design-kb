#!/usr/bin/env node
// Measures real characters per line (CPL) for CSS max-width values in installed fonts.
// Same counting method as tools/lint.mjs (words grouped by rendered line, last line dropped).
// Usage (from the repo root): node kb/research/typography/measure-cpl.mjs
import { launch } from '../../../tools/browser.mjs';

// A realistic English paragraph (landing page body copy, mixed word lengths).
const text = `Every coffee we sell is roasted within a week of shipping, in small batches of twelve kilos, on a drum roaster we restored ourselves. We buy directly from farms we visit, pay well above the fair trade floor, and publish what we paid next to every bag so you can see where the money goes. The roast is light enough to taste the place it came from and developed enough to taste sweet, never sour or grassy. Brew it however you like; we will tell you how we brew it, and we answer every email ourselves, usually within a day. That is the whole idea, and it has been for nine years now, through two moves and one very long winter.`;
const fonts = (process.argv[2] || 'Inter,Bitstream Charter,Liberation Serif,Liberation Sans,DejaVu Sans,Carlito,Caladea,FreeSerif').split(',');
const widths = ['28em', '32em', '34em', '48ch', '50ch', '52ch', '54ch', '60ch', '66ch'];

const b = await launch();
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.setContent('<html lang="en"><body></body></html>');
const res = await p.evaluate(({ text, fonts, widths }) => {
  const out = [];
  for (const f of fonts) for (const size of [16, 20]) {
    const row = { font: f, px: size };
    const probe = document.createElement('span');
    probe.style.cssText = `font:${size}px "${f}";white-space:pre`;
    document.body.append(probe);
    probe.textContent = '0';
    row.ch_em = +(probe.getBoundingClientRect().width / size).toFixed(3);
    probe.textContent = text;
    row.avg_em = +(probe.getBoundingClientRect().width / size / text.length).toFixed(3);
    probe.remove();
    for (const w of widths) {
      const el = document.createElement('p');
      el.style.cssText = `font-family:"${f}";font-size:${size}px;max-width:${w};line-height:1.5;margin:0`;
      el.textContent = text;
      document.body.append(el);
      const lines = new Map(); const n = el.firstChild; const re = /\S+\s*/g; let m; const r = document.createRange();
      while ((m = re.exec(n.textContent))) {
        r.setStart(n, m.index); r.setEnd(n, m.index + m[0].trimEnd().length);
        const rc = r.getClientRects()[0]; const k = Math.round(rc.bottom / 4);
        lines.set(k, (lines.get(k) || 0) + m[0].replace(/\s+/g, ' ').length);
      }
      const c = [...lines.entries()].sort((a, b) => a[0] - b[0]).map((e) => e[1]).slice(0, -1);
      row[w] = Math.round(c.reduce((a, b) => a + b, 0) / c.length);
      el.remove();
    }
    out.push(row);
  }
  return out;
}, { text, fonts, widths });
console.table(res);
await b.close();
