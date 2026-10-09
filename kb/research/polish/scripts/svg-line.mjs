#!/usr/bin/env node
// Does a 1px SVG line at an integer y blur across two device pixels at DPR 1? Run from repo root:
//   node kb/research/polish/scripts/svg-line.mjs
import { launch } from '../../../../tools/browser.mjs';
const browser = await launch();
const cases = {
  'y=20, stroke 1': '<line x1="0" x2="100" y1="20" y2="20" stroke="#000" stroke-width="1"/>',
  'y=20.5, stroke 1': '<line x1="0" x2="100" y1="20.5" y2="20.5" stroke="#000" stroke-width="1"/>',
  'y=20, stroke 1, crispEdges': '<line x1="0" x2="100" y1="20" y2="20" stroke="#000" stroke-width="1" shape-rendering="crispEdges"/>',
};
for (const dpr of [1, 2]) {
  const ctx = await browser.newContext({ deviceScaleFactor: dpr, viewport: { width: 100, height: 40 } });
  const page = await ctx.newPage();
  for (const [name, svg] of Object.entries(cases)) {
    await page.setContent(`<body style="margin:0;background:#fff"><svg width="100" height="40" style="display:block">${svg}</svg></body>`);
    const buf = await page.screenshot();
    const r = await page.evaluate(async (b64) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      const x = Math.round(img.width / 2); const vals = [];
      for (let y = 0; y < img.height; y++) { const v = g.getImageData(x, y, 1, 1).data[0]; if (v < 250) vals.push(v); }
      return vals;
    }, buf.toString('base64'));
    console.log(`DPR ${dpr} ${name}: ${r.length} rows, values ${r.join(',')}`);
  }
  await ctx.close();
}
await browser.close();
