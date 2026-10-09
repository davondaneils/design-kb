#!/usr/bin/env node
// How many device pixels each hairline technique actually paints in Chromium, at DPR 1, 2 and 3.
// Run from the repo root: node kb/research/polish/scripts/hairline.mjs
// Method: render each technique as a black line on white, screenshot, count rows with ink in one column.
import { launch } from '../../../../tools/browser.mjs';
const browser = await launch();
const techniques = {
  'border 1px': 'border-top:1px solid #000',
  'border 0.5px': 'border-top:0.5px solid #000',
  'box-shadow inset 0 1px': 'box-shadow:inset 0 1px #000;height:8px',
  'box-shadow 0 0 0 0.5px': 'box-shadow:0 0 0 0.5px #000;height:8px;margin:0 4px',
  'height 0.5px background': 'height:0.5px;background:#000',
  'height 1px + scaleY(0.5)': 'height:1px;background:#000;transform:scaleY(0.5);transform-origin:0 0',
  'border 1px, color alpha 0.5': 'border-top:1px solid rgb(0 0 0 / 0.5)',
};
for (const dpr of [1, 2, 3]) {
  const ctx = await browser.newContext({ deviceScaleFactor: dpr, viewport: { width: 120, height: 40 } });
  const page = await ctx.newPage();
  const lines = [];
  for (const [name, css] of Object.entries(techniques)) {
    await page.setContent(`<body style="margin:0;background:#fff"><div style="position:absolute;top:10px;left:10px;width:100px;${css}"></div></body>`);
    const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 120, height: 40 } });
    const res = await page.evaluate(async (b64) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      const x = Math.round(img.width / 2);
      let rows = 0, darkest = 255;
      for (let y = 0; y < img.height; y++) { const v = g.getImageData(x, y, 1, 1).data[0]; if (v < 250) { rows++; darkest = Math.min(darkest, v); } }
      return { rows, darkest };
    }, buf.toString('base64'));
    // box-shadow 0 0 0 0.5px around an 8px box: count only top edge rows (rows painted minus interior).
    lines.push(`${name}: ${res.rows} device px rows inked, darkest value ${res.darkest}`);
  }
  console.log(`DPR ${dpr}\n  ` + lines.join('\n  '));
  await ctx.close();
}
await browser.close();
