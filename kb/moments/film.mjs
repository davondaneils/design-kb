// Film a page with a scripted camera, for moment study and the blind gate.
// node kb/moments/film.mjs <url-or-path> <out.mp4> [--width 1440] [--height 900] [--scheme light|dark]
//   [--reduce] [--script '<json actions>'] [--crop x,y,w,h | --crop-el css [--pad 24]] [--fps 25]
// --crop-el crops to that element's box (plus --pad) as it sits in the viewport when the script ends; do not scroll
// after the element is framed.
// Actions run in order: {"wait":ms} {"scroll":y} {"smooth":[y,ms]} {"hover":"css"} {"move":[x,y,steps]}
//   {"click":"css"} {"press":[x,y]} {"eval":"js"}
// Default script: wait 2500ms on load, then scroll down a screen at a time with 1800ms holds.
// Writes <out.mp4> (H.264) and, when --crop is given, crops to that box in CSS px.
import { launch, toUrl } from '../../tools/browser.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && !['--reduce'].includes(args[i - 1])));
const flag = (n, d) => { const i = args.indexOf('--' + n); return i === -1 ? d : args[i + 1]; };
const [target, out] = pos;
if (!target || !out) { console.error('usage: film.mjs <url> <out.mp4> [--width] [--height] [--script json] [--crop x,y,w,h]'); process.exit(2); }
const width = +flag('width', 1440), height = +flag('height', 900);
const scheme = flag('scheme', 'light');
const reduce = args.includes('--reduce');
const fps = +flag('fps', 25);
const script = JSON.parse(flag('script', 'null') || 'null');

const tmp = fs.mkdtempSync(path.join(path.dirname(path.resolve(out)), '.film-'));
const browser = await launch();
const ctx = await browser.newContext({
  viewport: { width, height }, deviceScaleFactor: 1, colorScheme: scheme,
  reducedMotion: reduce ? 'reduce' : 'no-preference',
  recordVideo: { dir: tmp, size: { width, height } },
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
});
const page = await ctx.newPage();
const t0 = Date.now();
try { await page.goto(toUrl(target), { waitUntil: 'domcontentloaded', timeout: 45000 }); } catch (e) { console.error('goto:', e.message); }
const loadedAt = (Date.now() - t0) / 1000;
const log = [];
const mark = (what) => log.push({ t: +((Date.now() - t0) / 1000).toFixed(2), what });
mark('loaded');
const steps = script || (await (async () => {
  const h = await page.evaluate(() => document.documentElement.scrollHeight).catch(() => 4000);
  const s = [{ wait: 2500 }];
  for (let y = height * 0.8; y < Math.min(h, 14000); y += height * 0.8) s.push({ smooth: [Math.round(y), 500] }, { wait: 1800 });
  return s;
})());
for (const st of steps) {
  try {
    if (st.wait) await page.waitForTimeout(st.wait);
    else if (st.scroll != null) await page.evaluate((y) => window.scrollTo(0, y), st.scroll);
    else if (st.smooth) {
      const [y, ms] = st.smooth;
      await page.evaluate(([y, ms]) => new Promise((r) => {
        const y0 = scrollY, s = performance.now();
        const f = (n) => { const k = Math.min(1, (n - s) / ms); const e = 1 - Math.pow(1 - k, 3); scrollTo(0, y0 + (y - y0) * e); k < 1 ? requestAnimationFrame(f) : r(); };
        requestAnimationFrame(f);
      }), [y, ms]);
    } else if (st.hover) await page.hover(st.hover, { timeout: 3000 });
    else if (st.move) await page.mouse.move(st.move[0], st.move[1], { steps: st.move[2] || 20 });
    else if (st.click) await page.click(st.click, { timeout: 3000 });
    else if (st.press) { await page.mouse.move(st.press[0], st.press[1], { steps: 15 }); await page.mouse.down(); await page.waitForTimeout(90); await page.mouse.up(); }
    else if (st.eval) await page.evaluate(st.eval);
    mark(JSON.stringify(st));
  } catch (e) { mark('skip ' + JSON.stringify(st) + ' ' + e.message.split('\n')[0]); }
}
let cropEl = null;
if (flag('crop-el', null)) {
  cropEl = await page.evaluate(([sel, pad]) => {
    const r = document.querySelector(sel)?.getBoundingClientRect(); if (!r) return null;
    const x = Math.max(0, Math.floor(r.left - pad)), y = Math.max(0, Math.floor(r.top - pad));
    return [x, y, Math.min(innerWidth - x, Math.ceil(r.width + pad * 2)), Math.min(innerHeight - y, Math.ceil(r.height + pad * 2))].join(',');
  }, [flag('crop-el'), +flag('pad', 24)]);
}
const video = page.video();
await ctx.close();
await browser.close();
const raw = await video.path();
const crop = flag('crop', null) || cropEl;
const vf = [`fps=${fps}`];
if (crop) { const [x, y, w, h] = crop.split(',').map(Number); vf.push(`crop=${w - (w % 2)}:${h - (h % 2)}:${x}:${y}`); }
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-vf', vf.join(','), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-crf', '24', out]);
fs.rmSync(tmp, { recursive: true, force: true });
fs.writeFileSync(out.replace(/\.mp4$/, '.log.json'), JSON.stringify({ target, width, height, scheme, reduce, loadedAt, crop: flag('crop', null) || cropEl, log }, null, 1));
console.log(`${out}  (${log.length} steps)`);
