#!/usr/bin/env node
// Derived measurements for the polish domain. Run from the repo root:
//   node kb/research/polish/scripts/measure.mjs
// 1. Stem thickness of Inter at UI sizes and weights (to match icon stroke to text weight).
// 2. How Chromium renders 0.5px and 1px borders at devicePixelRatio 1, 2 and 3.
// 3. Common hairline colors (alpha black or white) as composited values and their contrast.
import { launch } from '../../../../tools/browser.mjs';
const browser = await launch();

// 1. Stems: draw a lowercase "l" at 10x size on a canvas, sum ink coverage across one row in the stem.
{
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.setContent('<canvas id=c width=400 height=400></canvas>');
  const res = await page.evaluate(async () => {
    const out = [];
    for (const family of ['Inter', 'Inter Display']) {
      for (const weight of [400, 500, 600, 700]) {
        for (const size of [12, 14, 16, 20]) {
          const S = size * 10;
          const font = `${weight} ${S}px "${family}"`;
          await document.fonts.load(font);
          const c = document.getElementById('c'); const g = c.getContext('2d');
          g.clearRect(0, 0, 400, 400); g.fillStyle = '#000';
          g.font = font;
          g.fillText('l', 50, 300);
          const d = g.getImageData(0, 0, 400, 400).data;
          const y = Math.round(300 - S * 0.35);
          let ink = 0;
          for (let x = 0; x < 400; x++) ink += d[(y * 400 + x) * 4 + 3] / 255;
          out.push({ family, weight, size, stemPx: Math.round((ink / 10) * 100) / 100 });
        }
      }
    }
    return out;
  });
  console.log('Inter stem thickness in CSS px (ink width of "l" drawn at 10x, divided by 10):');
  for (const r of res) console.log(`  ${r.family.padEnd(13)} ${r.weight} ${String(r.size).padStart(2)}px  stem ${r.stemPx}px  ratio ${(r.stemPx / r.size).toFixed(3)}`);
  await ctx.close();
}

// 2. Borders at each DPR.
for (const dpr of [1, 2, 3]) {
  const ctx = await browser.newContext({ deviceScaleFactor: dpr, viewport: { width: 200, height: 100 } });
  const page = await ctx.newPage();
  await page.setContent('<div id=a style="border-top:0.5px solid #000;width:100px"></div><div id=b style="border-top:1px solid #000;width:100px"></div><div id=c style="border-top:0.33px solid #000;width:100px"></div>');
  const r = await page.evaluate(() => ['a', 'b', 'c'].map((id) => { const el = document.getElementById(id); return `${id}: specified ${id === 'a' ? '0.5' : id === 'b' ? '1' : '0.33'}px -> computed ${getComputedStyle(el).borderTopWidth}`; }));
  console.log(`DPR ${dpr}: ${r.join('; ')}`);
  await ctx.close();
}

// 3. Hairline colors.
const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const cr = (a, b) => { const [x, y] = [lum(...a), lum(...b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const mix = (fg, bg, a) => fg.map((v, i) => Math.round(v * a + bg[i] * (1 - a)));
console.log('Hairline colors, composited:');
for (const a of [0.06, 0.08, 0.1, 0.12, 0.16, 0.24, 0.4, 0.45]) { const c = mix([0, 0, 0], [255, 255, 255], a); console.log(`  black ${a} on white -> rgb(${c}) contrast ${cr(c, [255, 255, 255]).toFixed(2)}:1`); }
for (const a of [0.06, 0.08, 0.1, 0.12, 0.16, 0.24, 0.4, 0.45]) { const c = mix([255, 255, 255], [16, 18, 20], a); console.log(`  white ${a} on #101214 -> rgb(${c}) contrast ${cr(c, [16, 18, 20]).toFixed(2)}:1`); }
await browser.close();
