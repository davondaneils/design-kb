#!/usr/bin/env node
// choreo-probe: records what a page's motion and imagery actually do, from the live page, not from the stylesheet.
// measure.mjs lists declared transition values; this records each animation as it runs: when it started, on what,
// for how long, on which curve, with which keyframes, and what triggered it (load, scroll, hover). It then derives
// the choreography (stagger gaps, travel distances, start values, duration ladder) and an imagery map (how much of
// each screen is picture, product mock-up or text).
//
// Usage (repo root, after `npm ci` in tools/):
//   node kb/teardowns/choreo-probe.mjs <url-or-path> <out.json> [--width 1440] [--height 900] [--shots dir] [--scheme light]
// Works on local pages too, so builders run it on their own page and compare with the exemplar JSON in data/choreo/.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const here = path.dirname(new URL(import.meta.url).pathname);
const { launch, toUrl } = await import(pathToFileURL(path.resolve(here, '../../tools/browser.mjs')).href);

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i === -1 ? d : args[i + 1]; };
const pos = args.filter((a, i) => !a.startsWith('--') && !['--width','--height','--shots','--scheme'].includes(args[i - 1]));
const [target, out] = pos;
if (!target || !out) { console.error('Usage: node choreo-probe.mjs <url> <out.json> [--width 1440] [--shots dir]'); process.exit(2); }
const W = Number(flag('--width', 1440)), H = Number(flag('--height', W < 600 ? 844 : 900));
const shots = flag('--shots', null), scheme = flag('--scheme', 'light'), reduce = args.includes('--reduce');

// Runs in the page before any script: polls document.getAnimations() every frame and logs each new animation once.
const RECORDER = () => {
  const seen = new WeakSet(); window.__choreo = []; window.__phase = 'load';
  const sel = (el) => {
    if (!el || !el.tagName) return '?';
    const c = (typeof el.className === 'string' ? el.className : el.className?.baseVal || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (c ? '.' + c : '');
  };
  const KEEP = ['opacity', 'transform', 'translate', 'scale', 'rotate', 'filter', 'clipPath', 'color', 'backgroundColor', 'strokeDashoffset', 'width', 'height', 'backgroundPosition', 'offsetDistance', 'gridTemplateRows', 'maskPosition', 'transformOrigin'];
  const tick = () => {
    try {
      for (const a of document.getAnimations()) {
        if (seen.has(a)) continue; seen.add(a);
        const e = a.effect, t = e?.getComputedTiming ? e.getComputedTiming() : {}, tm = e?.getTiming ? e.getTiming() : {};
        let kf = []; try { kf = e.getKeyframes(); } catch {}
        const props = {};
        for (const k of kf) for (const p of Object.keys(k)) if (KEEP.includes(p)) (props[p] ||= []).push(String(k[p]).slice(0, 120));
        const el = e?.target; const r = el?.getBoundingClientRect ? el.getBoundingClientRect() : null;
        window.__choreo.push({
          t: Math.round(performance.now()), phase: window.__phase, scrollY: Math.round(scrollY),
          kind: a.constructor.name, name: a.animationName || a.transitionProperty || a.id || '',
          dur: typeof tm.duration === 'number' ? Math.round(tm.duration) : (t.duration ?? null), delay: Math.round(tm.delay || 0),
          easing: tm.easing, kfEasing: [...new Set(kf.map((k) => k.easing).filter((x) => x && x !== 'linear'))],
          iterations: tm.iterations === Infinity ? 'infinite' : tm.iterations, props,
          target: sel(el), pseudo: e?.pseudoElement || null,
          rect: r ? [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)] : null,
          inView: r ? r.bottom > 0 && r.top < innerHeight : null,
        });
      }
    } catch {}
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

// Imagery map: what fills each screen-height slice of the page.
const IMAGERY = () => {
  const vw = innerWidth, vh = innerHeight, docH = document.documentElement.scrollHeight;
  const vis = (el) => { const s = getComputedStyle(el); return s.visibility !== 'hidden' && s.display !== 'none' && Number(s.opacity) > 0.05; };
  const boxes = [];
  const add = (el, kind) => { const r = el.getBoundingClientRect(); if (r.width < 48 || r.height < 48 || !vis(el)) return; boxes.push({ kind, x: r.x, y: r.y + scrollY, w: Math.min(r.width, vw), h: r.height, el }); };
  for (const el of document.querySelectorAll('img,picture,video,canvas')) {
    if (el.tagName === 'PICTURE') continue;
    const r = el.getBoundingClientRect();
    const kind = el.tagName === 'IMG' ? ((el.naturalWidth >= 500 && r.width >= 240) ? 'photo-or-raster' : 'small-raster') : el.tagName.toLowerCase();
    add(el, kind);
  }
  for (const el of document.querySelectorAll('svg')) { if (!el.closest('svg:not(:scope)') || el.parentElement.closest('svg') === null) { const r = el.getBoundingClientRect(); if (r.width >= 120 && r.height >= 80) add(el, 'svg-illustration'); } }
  // Product mock-ups: containers 240x160+ holding 12+ text leaves at 13px or less (UI-sized text), outermost only.
  const cands = [];
  for (const el of document.querySelectorAll('div,section,figure,article,ul,table')) {
    const r = el.getBoundingClientRect(); if (r.width < 240 || r.height < 160 || r.width > vw * 0.98 || !vis(el)) continue;
    let small = 0, total = 0;
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = tw.nextNode(); n && total < 400; n = tw.nextNode()) { if (!n.textContent.trim()) continue; total++; const fs = parseFloat(getComputedStyle(n.parentElement).fontSize); if (fs <= 13.5) small++; }
    if (small >= 12 && small / total >= 0.6) cands.push({ el, r });
  }
  for (const c of cands) if (!cands.some((o) => o !== c && o.el.contains(c.el) && o.r.height < vh * 1.6) && !c.el.closest('[data-visual]')) add(c.el, 'product-mock');
  // Builders may label their visuals: data-visual="product" counts as a product mock-up, any other value as that kind.
  for (const el of document.querySelectorAll('[data-visual]')) { if (el.parentElement?.closest('[data-visual]')) continue; const v = el.dataset.visual; add(el, v === 'product' ? 'product-mock' : v); }
  // background images on large blocks (hero gradients, photo bands)
  for (const el of document.querySelectorAll('body *')) {
    const s = getComputedStyle(el); if (s.backgroundImage === 'none' || !/url\(|gradient/.test(s.backgroundImage)) continue;
    const r = el.getBoundingClientRect(); if (r.width * r.height < vw * vh * 0.08) continue;
    add(el, /url\(/.test(s.backgroundImage) ? 'bg-image' : 'bg-gradient');
  }
  const slices = [];
  for (let y = 0; y < docH; y += vh) {
    const cov = {}; let any = 0;
    const grid = new Uint8Array(40 * 40);
    for (const b of boxes) {
      const top = Math.max(b.y, y), bot = Math.min(b.y + b.h, y + vh); if (bot <= top) continue;
      const a = (b.w * (bot - top)) / (vw * vh); cov[b.kind] = (cov[b.kind] || 0) + a;
      if (b.kind === 'bg-gradient') continue;
      for (let gy = 0; gy < 40; gy++) for (let gx = 0; gx < 40; gx++) {
        const px = (gx + 0.5) * vw / 40, py = y + (gy + 0.5) * vh / 40;
        if (px >= b.x && px <= b.x + b.w && py >= top && py <= bot) grid[gy * 40 + gx] = 1;
      }
    }
    for (const v of grid) any += v;
    for (const k in cov) cov[k] = +Math.min(1, cov[k]).toFixed(2);
    slices.push({ y, visualCoverage: +(any / 1600).toFixed(2), byKind: cov });
  }
  const count = (k) => boxes.filter((b) => b.kind === k).length;
  return {
    viewport: [vw, vh], pageHeight: docH, screens: +(docH / vh).toFixed(1),
    counts: { productMock: count('product-mock'), photo: count('photo-or-raster'), video: count('video'), canvas: count('canvas'), svgIllustration: count('svg-illustration'), illustration: count('illustration'), dataViz: count('chart'), bgImage: count('bg-image'), bgGradient: count('bg-gradient') },
    mocks: boxes.filter((b) => b.kind === 'product-mock').map((b) => ({ y: Math.round(b.y), w: Math.round(b.w), h: Math.round(b.h) })),
    slices,
    screensWithVisual: slices.filter((s) => s.visualCoverage >= 0.15).length,
  };
};

const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, colorScheme: scheme, reducedMotion: reduce ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
await ctx.addInitScript(RECORDER);
const page = await ctx.newPage();
const url = toUrl(target);
const t0 = Date.now();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
// Filmstrip of the first screen during load choreography.
if (shots) fs.mkdirSync(shots, { recursive: true });
const slug = path.basename(out, '.json');
for (const ms of [200, 500, 900, 1500, 3000]) {
  const wait = ms - (Date.now() - t0); if (wait > 0) await page.waitForTimeout(wait);
  if (shots) await page.screenshot({ path: path.join(shots, `${slug}-load-${ms}.jpg`), type: 'jpeg', quality: 55 }).catch(() => {});
}
await page.waitForTimeout(1500);
// Scroll in 60%-of-screen steps, slowly enough for scroll-triggered reveals to fire.
await page.evaluate(() => { window.__phase = 'scroll'; });
let last = -1;
for (let i = 0; i < 80; i++) {
  const y = await page.evaluate((h) => { scrollBy(0, h); return scrollY; }, Math.round(H * 0.6));
  await page.waitForTimeout(450);
  if (y === last) break; last = y;
}
await page.waitForTimeout(1500);
// Hover: sample buttons, links and cards across the page.
await page.evaluate(() => { window.__phase = 'hover'; scrollTo(0, 0); });
await page.waitForTimeout(600);
const hoverTargets = await page.$$('header a, main a, button, [role=button]');
let hovered = 0;
for (const h of hoverTargets) {
  if (hovered >= 24) break;
  const box = await h.boundingBox().catch(() => null); if (!box || box.width < 8 || box.y > 2400) continue;
  await h.hover({ timeout: 1500 }).catch(() => {}); await page.waitForTimeout(250); hovered++;
}
await page.mouse.move(1, 1);
await page.evaluate(() => { scrollTo(0, 0); });
await page.waitForTimeout(800);
// Imagery map on the settled page (scroll through once more so lazy media have loaded).
for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += H) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(150); }
await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
const imagery = await page.evaluate(IMAGERY);
const raw = await page.evaluate(() => window.__choreo);
const reducedRules = await page.evaluate(() => { let n = 0; for (const s of document.styleSheets) { try { for (const r of s.cssRules) if (r.media && /prefers-reduced-motion/.test(r.media.mediaText)) n++; } catch {} } return n; });
await browser.close();

// ---- derive choreography ----
const finite = raw.filter((a) => a.iterations !== 'infinite' && a.dur > 0);
const loops = raw.filter((a) => a.iterations === 'infinite');
const round = (n) => Math.round(n / 10) * 10;
const tally = (arr, f) => { const m = {}; for (const a of arr) { const k = f(a); if (k == null) continue; m[k] = (m[k] || 0) + 1; } return Object.entries(m).sort((a, b) => b[1] - a[1]).map(([v, n]) => ({ v, n })); };
const curve = (a) => (a.kfEasing.length ? a.kfEasing.join('|') : a.easing);
const firstVal = (a, p) => a.props[p]?.[0];
const travel = (a) => { // px or % travelled, read from translate/transform keyframes
  const vals = [...(a.props.transform || []), ...(a.props.translate || [])];
  for (const v of vals) {
    let m = v.match(/translate(?:Y|3d)?\((?:[^,)]*,\s*)?(-?[\d.]+)(px|%)/) || v.match(/^(-?[\d.]+)(px|%)?\s+(-?[\d.]+)(px|%)/);
    if (/matrix\(/.test(v)) { const n = v.match(/matrix\(([^)]+)\)/)[1].split(',').map(Number); if (Math.abs(n[5]) > 0.5) return `${Math.round(n[5])}px`; if (Math.abs(n[4]) > 0.5) return `${Math.round(n[4])}px x`; }
    if (m) { const val = m[3] ? m[3] : m[1]; const u = m[3] ? (m[4] || 'px') : m[2]; if (Math.abs(Number(val)) > 0.4) return `${Number(val)}${u}`; }
  }
  return null;
};
// Stagger: groups of 3+ same-duration, same-curve animations in one phase whose starts (t + delay) are spread out.
const groups = {};
for (const a of finite.filter((x) => x.phase !== "hover")) { const k = `${a.phase}|${a.dur}|${curve(a)}|${Object.keys(a.props).sort().join(',')}`; (groups[k] ||= []).push(a); }
const staggers = [];
for (const [k, g] of Object.entries(groups)) {
  if (g.length < 3) continue;
  const starts = g.map((a) => a.t + a.delay).sort((x, y) => x - y);
  // cluster by bursts: a new burst begins after a 600ms silence
  let burst = [starts[0]];
  const flush = () => { if (burst.length >= 3) { const gaps = burst.slice(1).map((s, i) => s - burst[i]).filter((d) => d > 4); if (gaps.length >= 2) { gaps.sort((x, y) => x - y); staggers.push({ key: k, n: burst.length, medianGap: gaps[Math.floor(gaps.length / 2)], span: burst[burst.length - 1] - burst[0] }); } } };
  for (let i = 1; i < starts.length; i++) { if (starts[i] - starts[i - 1] > 600) { flush(); burst = []; } burst.push(starts[i]); }
  flush();
}
const enters = finite.filter((a) => a.phase !== 'hover' && (a.props.opacity || a.props.transform || a.props.translate || a.props.filter || a.props.clipPath));
const summary = {
  url, measuredAt: new Date().toISOString(), viewport: [W, H], scheme, elapsedMs: Date.now() - t0,
  totals: { animations: raw.length, finite: finite.length, loops: loops.length, byPhase: tally(raw, (a) => a.phase), reducedMotionRules: reducedRules },
  durationLadder: tally(finite, (a) => round(a.dur)).map((x) => ({ ms: Number(x.v), n: x.n })).sort((a, b) => a.ms - b.ms),
  durationsByPhase: Object.fromEntries(['load', 'scroll', 'hover'].map((ph) => [ph, tally(finite.filter((a) => a.phase === ph), (a) => round(a.dur)).map((x) => `${x.v}ms x${x.n}`)])),
  curves: tally(finite, curve).slice(0, 12),
  propertiesAnimated: tally(finite, (a) => Object.keys(a.props).sort().join('+') || a.name).slice(0, 14),
  enterStartValues: {
    opacity: tally(enters, (a) => firstVal(a, 'opacity')).slice(0, 6),
    travel: tally(enters, travel).slice(0, 10),
    filter: tally(enters, (a) => firstVal(a, 'filter')).slice(0, 6),
    clipPath: tally(enters, (a) => firstVal(a, 'clipPath')?.slice(0, 50)).slice(0, 6),
  },
  delays: tally(finite.filter((a) => a.delay > 0), (a) => round(a.delay)).slice(0, 12),
  staggers: staggers.sort((a, b) => b.n - a.n).slice(0, 12),
  loops: tally(loops, (a) => `${a.name || a.target} ${a.dur}ms ${curve(a)}`).slice(0, 12),
  scrollTriggered: finite.filter((a) => a.phase === 'scroll').length,
  imagery,
  raw: raw.slice(0, 1500),
};
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(summary, null, 1));
const s = summary;
console.log(`${slug}: ${s.totals.animations} animations (${s.totals.loops} loops); ladder ${s.durationLadder.map((d) => d.ms).join('/')}; curves ${s.curves.length}; staggers ${s.staggers.map((x) => x.n + '@' + x.medianGap + 'ms').join(', ') || 'none'}; mocks ${imagery.counts.productMock}, photos ${imagery.counts.photo}, screens with visual ${imagery.screensWithVisual}/${imagery.slices.length}`);
