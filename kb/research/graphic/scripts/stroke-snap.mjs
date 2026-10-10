// Measures how crisp a vertical SVG stroke renders in Chromium for a given stroke width, centre position and DPR.
// Crisp = the ink lands on whole device pixels (no partial-coverage columns either side).
// Run from the repo root: node kb/research/graphic/scripts/stroke-snap.mjs
// Output: for each DPR and stroke width, the coverage of each device-pixel column around the line, per centre offset.
import { launch } from '../../../../tools/browser.mjs';

const widths = [1, 1.25, 1.5, 2];
const offsets = [0, 0.25, 0.5, 0.75];
const browser = await launch();
for (const dpr of [1, 2]) {
  const page = await browser.newPage({ viewport: { width: 200, height: 40 }, deviceScaleFactor: dpr });
  for (const w of widths) {
    const row = [];
    for (const off of offsets) {
      const x = 10 + off;
      await page.setContent(`<body style="margin:0;background:#fff"><svg width="40" height="20" viewBox="0 0 40 20" style="display:block">
        <path d="M${x} 2V18" stroke="#000" stroke-width="${w}" fill="none"/></svg></body>`);
      const buf = await page.screenshot({ clip: { x: 0, y: 0, width: 40, height: 20 } });
      const cov = await page.evaluate(async (b64) => {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const g = c.getContext('2d'); g.drawImage(img, 0, 0);
        const y = Math.floor(img.height / 2);
        const d = g.getImageData(0, y, img.width, 1).data;
        const out = [];
        for (let i = 0; i < img.width; i++) { const v = 1 - d[i * 4] / 255; if (v > 0.02) out.push(Math.round(v * 100)); }
        return out;
      }, buf.toString('base64'));
      const partial = cov.filter((v) => v < 95).length;
      row.push(`x=${x}: [${cov.join(' ')}] partial cols ${partial}`);
    }
    console.log(`DPR ${dpr}, stroke ${w}px\n  ` + row.join('\n  '));
  }
  await page.close();
}
await browser.close();
