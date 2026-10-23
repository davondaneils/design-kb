#!/usr/bin/env node
// motion-audit: proves what a page's motion actually does, on real pixels, in both motion settings.
// Screenshots cannot show motion, so this tool triggers each animation, freezes every animation it started with the
// Web Animations API (document.getAnimations(), pause, currentTime), seeks them together to evenly spaced moments and
// screenshots each moment. The result is a frame strip per scenario (no-preference row, reduce row) plus a timing table
// checked against the design-kb motion tokens (kb/FOUNDATIONS.md, Motion).
//
// Usage (from the design-kb repo root, after `npm ci` in tools/):
//   node skills/design-motion/assets/motion-audit.mjs <scenarios.mjs> <outdir> [--only name,name] [--frames 6]
//
// <scenarios.mjs> default-exports an array of scenarios:
//   { name, url,                       // page path (relative to the cwd, may carry ?query) or http(s) URL
//     width = 1440, height = 900, scheme = 'light',
//     setup:   async ({ page }) => {},  // optional: get the page ready (scroll, open a menu)
//     trigger: async ({ page }) => {},  // the user action that starts the motion (click, key press, scroll into view)
//     clip: '.selector',                // region to film (union of matches), padded by `pad` px (default 24)
//     expect: 'motion' | 'none',        // 'none' = this action must not animate at all (keyboard shortcuts, frequent actions)
//     frames: 6, wait: 1500 }           // optional: frames per row; ms to wait for the first animation to start
//
// Checks per animation (fail unless noted):
//   duration   on the token set 100, 150, 200, 250, 300, 400, 500, 600, 800 ms (800 only for one hero reveal, FOUNDATIONS v0.4); loops (infinite) are reported, not judged
//   easing     one of the four token curves or linear; the CSS default `ease` fails
//   property   transform, translate, scale, rotate and opacity pass; paint-only properties (color, fill, stroke,
//              stroke-dashoffset) pass on control-sized elements and warn above 200x200 px (40,000 px2); layout and blur properties
//              (width, height, top, left, margin, padding, box-shadow, filter, clip-path) fail
//   reduce     under prefers-reduced-motion: reduce, anything that moves (transform family with changing values) fails;
//              an opacity or color change longer than 150 ms warns
//   expect     a scenario marked expect: 'none' fails if anything animates
// Exit code 1 when any check fails.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const here = path.dirname(new URL(import.meta.url).pathname);
const toolsDir = process.env.DESIGN_KB_TOOLS || path.resolve(here, '../../../tools');
const { launch, toUrl } = await import(pathToFileURL(path.join(toolsDir, 'browser.mjs')).href);

const TOKENS_MS = [100, 150, 200, 250, 300, 400, 500, 600, 800];
const EASINGS = {
  'cubic-bezier(0.2, 0, 0, 1)': 'standard',
  'cubic-bezier(0, 0, 0, 1)': 'enter',
  'cubic-bezier(0.3, 0, 1, 1)': 'exit',
  'cubic-bezier(0.22, 1, 0.36, 1)': 'reveal',
  linear: 'linear',
};
const COMPOSITOR = new Set(['transform', 'translate', 'scale', 'rotate', 'opacity']);
const PAINT = new Set(['color', 'backgroundColor', 'borderColor', 'outlineColor', 'fill', 'stroke', 'strokeDashoffset', 'visibility', 'display', 'overlay', 'textDecorationColor']);
const MOVING = new Set(['transform', 'translate', 'scale', 'rotate']);

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); return i === -1 ? null : args[i + 1]; };
const pos = args.filter((a, i) => !a.startsWith('--') && !['--only', '--frames'].includes(args[i - 1]));
const [scenPath, outdir] = pos;
if (!scenPath || !outdir) { console.error('Usage: node motion-audit.mjs <scenarios.mjs> <outdir> [--only a,b] [--frames 6]'); process.exit(2); }
const only = flag('--only') ? flag('--only').split(',') : null;
const framesDefault = Number(flag('--frames') || 6);
const scenarios = (await import(pathToFileURL(path.resolve(scenPath)).href)).default.filter((s) => !only || only.includes(s.name));
fs.mkdirSync(outdir, { recursive: true });

const browser = await launch();
const report = { date: new Date().toISOString(), tokensMs: TOKENS_MS, scenarios: [] };
let fails = 0;

async function film(sc, mode) {
  const context = await browser.newContext({ viewport: { width: sc.width || 1440, height: sc.height || 900 }, colorScheme: sc.scheme || 'light', reducedMotion: mode, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(toUrl(sc.url), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  if (sc.setup) await sc.setup({ page });
  await page.waitForTimeout(150);
  // Mark every animation that already exists (running loops, earlier reveals) so only the trigger's animations are filmed.
  // A freezer runs inside the page on every animation frame, so a 100 ms transition is caught in its first frame, not after
  // a round trip to this script. It keeps catching for 80 ms after the first catch (a script's second step, staggers).
  await page.evaluate(() => {
    window.__seen = new WeakSet(document.getAnimations());
    window.__fresh = [];
    window.__first = 0;
    const loop = (now) => {
      for (const a of document.getAnimations()) if (!window.__seen.has(a) && !window.__fresh.includes(a)) { a.pause(); window.__fresh.push(a); }
      if (window.__fresh.length && !window.__first) window.__first = now;
      if (!window.__stop && !(window.__first && now - window.__first > 80)) requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  await sc.trigger({ page });
  const started = await page.waitForFunction(() => window.__first && performance.now() - window.__first > 80, null, { timeout: sc.wait || 1500 })
    .then(() => true).catch(() => false);
  await page.evaluate(() => { window.__stop = true; });
  const anims = started ? await page.evaluate(() => {
    const describe = (el) => {
      if (!el) return '?';
      let s = el.tagName.toLowerCase();
      if (el.id) s += '#' + el.id;
      const cls = typeof el.className === 'string' ? el.className : (el.className && el.className.baseVal) || '';
      if (cls.trim()) s += '.' + cls.trim().split(/\s+/).slice(0, 2).join('.');
      const lvl = el.getAttribute && el.getAttribute('data-level');
      if (lvl !== null && lvl !== undefined) s += '[data-level=' + lvl + ']';
      return s;
    };
    const cmax = Math.max(...window.__fresh.map((a) => a.currentTime || 0));
    return window.__fresh.map((a, i) => {
      const t = a.effect.getComputedTiming();
      const kf = a.effect.getKeyframes();
      const props = {};
      for (const k of kf) for (const [p, v] of Object.entries(k)) {
        if (['offset', 'computedOffset', 'easing', 'composite'].includes(p)) continue;
        (props[p] = props[p] || []).push(String(v));
      }
      const el = a.effect.target;
      const r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : { width: 0, height: 0 };
      return {
        i, type: a.constructor.name, name: a.transitionProperty || a.animationName || a.id || '(script)',
        target: describe(el) + (a.effect.pseudoElement || ''),
        duration: t.duration, delay: t.delay, iterations: t.iterations, easing: t.easing,
        keyframeEasings: [...new Set(kf.slice(0, -1).map((k) => k.easing))],
        props, area: Math.round(r.width * r.height), offset: cmax - (a.currentTime || 0), // started this much later than the first
        
      };
    });
  }) : [];

  // Checks.
  const findings = [];
  const add = (level, msg, a) => findings.push({ level, msg, target: a ? a.target + ' ' + a.name : '' });
  if (sc.expect === 'none' && anims.length && mode === 'no-preference') add('fail', `expected no animation, found ${anims.length}`);
  if (sc.expect === 'motion' && !anims.length && mode === 'no-preference') add('fail', 'expected motion, found none');
  const heroReveals = [];
  for (const a of anims) {
    const loop = a.iterations === Infinity || a.iterations === 'Infinity';
    const ms = Math.round(a.duration);
    if (!loop && !TOKENS_MS.includes(ms)) add('fail', `duration ${ms} ms is off the token set`, a);
    if (!loop && ms > 800) add('fail', `duration ${ms} ms is over the 800 ms hero ceiling`, a);
    else if (!loop && ms > 600) heroReveals.push(a);
    const curves = a.easing !== 'linear' ? [a.easing] : a.keyframeEasings;
    a.curve = curves.map((c) => EASINGS[c.replace(/\s+/g, ' ')] || c).join(', ');
    for (const c of curves) if (!EASINGS[c.replace(/\s+/g, ' ')]) add('fail', `easing ${c} is not a token curve`, a);
    for (const p of Object.keys(a.props)) {
      const changes = new Set(a.props[p]).size > 1;
      if (!changes) continue;
      if (COMPOSITOR.has(p)) continue;
      if (PAINT.has(p)) { a.paint = true; if (a.area > 40000 && p !== 'visibility' && p !== 'display' && p !== 'overlay') add('warn', `${p} animates on ${a.area} px2 (paint each frame)`, a); continue; }
      add('fail', `${p} animates (layout or heavy paint); use transform or opacity`, a);
    }
    if (mode === 'reduce') {
      const moves = Object.keys(a.props).some((p) => MOVING.has(p) && new Set(a.props[p]).size > 1);
      if (moves) add('fail', 'moves under prefers-reduced-motion: reduce', a);
      else if (!loop && ms > 150) add('warn', `${ms} ms change under reduced motion; keep crossfades at 150 ms or less`, a);
    }
  }
  // 601 to 800 ms is allowed only for one unprompted hero reveal per marketing page (FOUNDATIONS v0.4, opinion).
  for (const a of heroReveals) add('warn', `${Math.round(a.duration)} ms is over 600 ms: allowed only as the page's one hero reveal on load, never on a user action`, a);
  if (new Set(heroReveals.map((a) => a.name)).size > 1) add('fail', `${new Set(heroReveals.map((a) => a.name)).size} different animations run over 600 ms; one hero reveal per page`);

  // Frames: every filmed animation seeked to the same moment, from 0 to the end of the longest one.
  const n = sc.frames || framesDefault;
  const end = anims.length ? Math.max(...anims.map((a) => a.offset + a.delay + (a.iterations === Infinity ? 1000 : a.duration * a.iterations))) : 0;
  const box = await page.evaluate(({ sel, pad }) => {
    const els = [...document.querySelectorAll(sel)];
    if (!els.length) return null;
    const rs = els.map((e) => e.getBoundingClientRect());
    const x = Math.min(...rs.map((r) => r.left)) - pad, y = Math.min(...rs.map((r) => r.top)) - pad;
    const w = Math.max(...rs.map((r) => r.right)) + pad - x, h = Math.max(...rs.map((r) => r.bottom)) + pad - y;
    // Viewport coordinates, not page coordinates: a full-page capture can move sticky and fixed elements between frames.
    const vx = Math.max(0, x), vy = Math.max(0, y);
    return { x: vx, y: vy, width: Math.min(w, innerWidth - vx), height: Math.min(h, innerHeight - vy) };
  }, { sel: sc.clip, pad: sc.pad ?? 24 });
  const frames = [];
  const times = anims.length ? Array.from({ length: n }, (_, k) => Math.round((end * k) / (n - 1))) : [0];
  for (const t of times) {
    if (anims.length) await page.evaluate(({ t, lags }) => window.__fresh.forEach((a, i) => { a.currentTime = t - lags[i]; }), { t, lags: anims.map((a) => a.offset) });
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const buf = box ? await page.screenshot({ clip: box }) : await page.screenshot();
    frames.push({ t, png: buf.toString('base64') });
  }
  await context.close();
  return { mode, animations: anims, findings, frames, box, end: Math.round(end) };
}

function strip(sc, rows) {
  const esc = (s) => String(s).replace(/[<&>]/g, (c) => ({ '<': '&lt;', '&': '&amp;', '>': '&gt;' })[c]);
  const row = (r) => `<section><h2>${r.mode === 'reduce' ? 'prefers-reduced-motion: reduce' : 'no-preference'} <small>${r.animations.length} animation${r.animations.length === 1 ? '' : 's'}${r.end ? ', ' + r.end + ' ms' : ''}</small></h2>
<div class="frames">${r.frames.map((f) => `<figure><img src="data:image/png;base64,${f.png}"><figcaption>${f.t} ms</figcaption></figure>`).join('')}</div></section>`;
  const table = rows[0].animations.length ? `<table><tr><th>target</th><th>property</th><th>duration</th><th>delay</th><th>curve</th></tr>${rows[0].animations.slice(0, 14).map((a) => `<tr><td>${esc(a.target)}</td><td>${esc(Object.keys(a.props).join(', ') || a.name)}</td><td>${a.iterations === Infinity ? 'loop ' : ''}${Math.round(a.duration)} ms</td><td>${Math.round(a.delay + a.offset)} ms</td><td>${esc(a.curve)}</td></tr>`).join('')}${rows[0].animations.length > 14 ? `<tr><td colspan=5>and ${rows[0].animations.length - 14} more</td></tr>` : ''}</table>` : '';
  return `<!doctype html><meta charset=utf-8><style>
body{margin:0;padding:24px;font:14px/1.4 system-ui,sans-serif;background:#f6f7f8;color:#1f2224;width:max-content}
h1{font-size:20px;margin:0 0 4px}p{margin:0 0 16px;color:#676c73;max-width:1100px}h2{font-size:14px;margin:16px 0 8px}small{font-weight:400;color:#676c73}
.frames{display:flex;gap:8px}figure{margin:0}img{display:block;border:1px solid #d5d8db;max-width:280px}
figcaption{font-size:12px;color:#676c73;margin-top:4px;font-variant-numeric:tabular-nums}
table{border-collapse:collapse;margin-top:16px;font-size:12px}td,th{border-bottom:1px solid #d5d8db;padding:4px 12px 4px 0;text-align:left;font-variant-numeric:tabular-nums}</style>
<h1>${esc(sc.name)}</h1><p>${esc(sc.note || '')}</p>${rows.map(row).join('')}${table}`;
}

for (const sc of scenarios) {
  const rows = [];
  for (const mode of ['no-preference', 'reduce']) rows.push(await film(sc, mode));
  const page = await browser.newPage({ viewport: { width: 800, height: 400 } });
  await page.setContent(strip(sc, rows));
  const file = path.join(outdir, sc.name + '.png');
  await page.screenshot({ path: file, fullPage: true });
  await page.close();
  const findings = rows.flatMap((r) => r.findings.map((f) => ({ ...f, mode: r.mode })));
  const f = findings.filter((x) => x.level === 'fail').length;
  fails += f;
  report.scenarios.push({ name: sc.name, url: sc.url, strip: file, result: f ? 'FAIL' : 'PASS', findings,
    rows: rows.map((r) => ({ mode: r.mode, end: r.end, animations: r.animations.map(({ props, ...a }) => ({ ...a, props: Object.keys(props) })) })) });
  console.log(`${f ? 'FAIL' : 'pass'}  ${sc.name}  (${rows[0].animations.length} anim, ${rows[0].end} ms; reduce ${rows[1].animations.length} anim)  ${file}`);
  for (const x of findings) console.log(`      ${x.level} [${x.mode}] ${x.msg} ${x.target}`);
}
fs.writeFileSync(path.join(outdir, 'motion-audit.json'), JSON.stringify(report, null, 2));
await browser.close();
console.log(fails ? `FAIL: ${fails} motion check(s) failed` : 'PASS: every filmed animation is on the motion tokens');
process.exit(fails ? 1 : 0);
