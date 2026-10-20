// Frame-accurate trace of named elements: samples computed transform, opacity, clip-path, filter and box every
// animation frame, then reports each movement segment (start, end, duration, from, to) and the holds between them.
// node kb/moments/trace.mjs <url-or-path> <out.json> --select "css1|css2|..." [--for 15000] [--script json]
//   [--width 1440] [--height 900] [--first]   (--first: trace only the first match of each selector)
// Times are ms from the first sample. Use it on exemplars (to read real timing) and on your own build (to prove holds).
import { launch, toUrl } from '../../tools/browser.mjs';
import fs from 'node:fs';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf('--' + n); return i === -1 ? d : args[i + 1]; };
const pos = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && args[i - 1] !== '--first'));
const [target, out] = pos;
const sels = (flag('select', '') || '').split('|').filter(Boolean);
if (!target || !out || !sels.length) { console.error('usage: trace.mjs <url> <out.json> --select "a|b" [--for ms] [--script json]'); process.exit(2); }
const forMs = +flag('for', 15000);
const width = +flag('width', 1440), height = +flag('height', 900);
const script = JSON.parse(flag('script', '[]'));

const browser = await launch();
const ctx = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
const page = await ctx.newPage();
await page.goto(toUrl(target), { waitUntil: 'domcontentloaded', timeout: 45000 }).catch((e) => console.error('goto:', e.message));
for (const st of script) {
  if (st.wait) await page.waitForTimeout(st.wait);
  else if (st.scroll != null) await page.evaluate((y) => scrollTo(0, y), st.scroll);
  else if (st.click) await page.click(st.click, { timeout: 3000 }).catch(() => {});
  else if (st.eval) await page.evaluate(st.eval).catch(() => {});
}
const samples = await page.evaluate(([sels, forMs, first]) => new Promise((resolve) => {
  // Re-query every frame so elements that mount mid-trace (toasts, drawers) are caught; ids follow first appearance.
  const ids = sels.map(() => new Map());
  const rows = [];
  const t0 = performance.now();
  const f = (now) => {
    const t = Math.round(now - t0);
    sels.forEach((s, si) => [...document.querySelectorAll(s)].slice(0, first ? 1 : 12).forEach((el) => {
      if (!ids[si].has(el)) ids[si].set(el, ids[si].size);
      const ei = ids[si].get(el);
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      rows.push([t, si, ei, cs.transform, cs.opacity, cs.clipPath, cs.filter, Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height), (el.textContent || '').trim().slice(0, 24)]);
    }));
    now - t0 < forMs ? requestAnimationFrame(f) : resolve(rows);
  };
  requestAnimationFrame(f);
}), [sels, forMs, args.includes('--first')]);
await browser.close();

// Collapse samples into segments per element: a segment is a run of frames whose style or box changes.
const byEl = new Map();
for (const r of samples) { const k = r[1] + ':' + r[2]; if (!byEl.has(k)) byEl.set(k, []); byEl.get(k).push(r); }
const frames = new Set(samples.map((r) => r[0])).size; // frames in which a traced element existed
const report = [];
for (const [k, rows] of byEl) {
  const sig = (r) => r.slice(3, 11).join('|');
  const segs = [];
  let cur = null;
  for (let i = 1; i < rows.length; i++) {
    const moving = sig(rows[i]) !== sig(rows[i - 1]);
    if (moving && !cur) cur = { start: rows[i - 1][0], from: rows[i - 1] };
    if (!moving && cur) { segs.push({ ...cur, end: rows[i - 1][0], to: rows[i - 1] }); cur = null; }
  }
  if (cur) segs.push({ ...cur, end: rows.at(-1)[0], to: rows.at(-1), open: true });
  const [si, ei] = k.split(':').map(Number);
  report.push({
    selector: sels[si], index: ei, text: rows[0][11],
    segments: segs.filter((s) => s.end - s.start >= 30).map((s) => ({
      start: s.start, end: s.end, ms: s.end - s.start, open: !!s.open,
      from: { transform: s.from[3], opacity: s.from[4], clip: s.from[5], filter: s.from[6], box: s.from.slice(7, 11) },
      to: { transform: s.to[3], opacity: s.to[4], clip: s.to[5], filter: s.to[6], box: s.to.slice(7, 11), text: s.to[11] },
    })),
  });
}
for (const e of report) e.holds = e.segments.slice(1).map((s, i) => s.start - e.segments[i].end);
fs.writeFileSync(out, JSON.stringify({ target, sels, frames, ms: forMs, elements: report }, null, 1));
for (const e of report) if (e.segments.length) console.log(`${e.selector}[${e.index}] "${e.text}": ` + e.segments.map((s) => `${s.start}-${s.end} (${s.ms}ms)`).join(', ') + (e.holds.length ? `  holds ${e.holds.join('/')}` : ''));
console.log(`${frames} frames over ${forMs}ms (${(frames / forMs * 1000).toFixed(0)} fps)`);
