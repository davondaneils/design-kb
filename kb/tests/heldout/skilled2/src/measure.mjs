// Measure line widths in em for the coursed wordmark (fit-to-width sizes are font-size = width / em).
// Usage: node measure.mjs '["SET IN","STONE"]' '[[800,62,0]]'   (weight, width %, tracking em)
import { launch } from '../../../../../tools/browser.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const font = fs.readFileSync(path.join(here, '../fonts/archivo.woff2')).toString('base64');
const b = await launch();
const p = await b.newPage();
const lines = JSON.parse(process.argv[2]);
const combos = JSON.parse(process.argv[3]);
await p.setContent(`<style>@font-face{font-family:A;src:url(data:font/woff2;base64,${font});font-weight:100 900;font-stretch:62% 125%}span{font:1000px A;white-space:pre}</style><div id=d></div>`);
await p.evaluate(async () => { await document.fonts.load('900 100px A'); await document.fonts.ready; });
for (const [w, s, tr] of combos) for (const l of lines) {
  const r = await p.evaluate(([l, w, s, tr]) => {
    const e = document.createElement('span');
    e.textContent = l; e.style.fontWeight = w; e.style.fontStretch = s + '%'; e.style.letterSpacing = tr + 'em';
    document.getElementById('d').append(e);
    const x = e.getBoundingClientRect().width; e.remove(); return x / 1000;
  }, [l, w, s, tr]);
  console.log(w, s, tr, JSON.stringify(l), r.toFixed(4));
}
await b.close();
