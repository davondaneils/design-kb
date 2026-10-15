#!/usr/bin/env node
// motion-plan-check: measures a built page's motion the way the exemplars were measured, and fails a product landing
// page that has no motion voice. Same recording method as kb/teardowns/choreo-probe.mjs (document.getAnimations()
// polled every frame from an init script; load, then scroll in 60%-of-screen steps every 450ms, then hover over up
// to 24 controls), plus what a scene needs: where each animation runs (inside [data-scene], inside
// [data-visual="product"]) and every data-state change of every scene.
//
// Usage (repo root, after `npm ci` in tools/):
//   node skills/design-motion/assets/motion-plan-check.mjs <page.html|url> [--width 1440] [--json out.json]
//        [--product]      default: the page is a product page, so a product scene is required
//        [--no-scene]     a marketing page with no product (an agency, an event): skip the scene requirement and say
//                         why in the motion plan
//
// Fails (FOUNDATIONS v0.5 Motion; numbers from kb/teardowns/motion-imagery.md):
//   bands      fewer than 3 duration bands among the recorded animations, hover included. Bands by duration:
//              press/hover <=150, UI change 151-399, entrance 400-599, reveal 600-1199, scene 1200+
//   scene      no product scene: no [data-scene] whose data-beats has 3+ states and that is seen to step through 3+
//              states with animations inside it, and no animation of 1200ms+ inside [data-visual="product"]
//   beats      a scene beat outside 1200-4500ms, a loop over 12000ms, a rest under 2000ms, or a looping or 5s+ scene
//              with no visible [data-scene-pause][aria-controls] button (WCAG 2.2.2)
//   behavior   a scene that keeps stepping while hovered, while scrolled out of view, or after its pause button is pressed
//   stagger    a staggered group (3+ same animations started in one burst, outside scenes) whose median gap is
//              outside 20-80ms (2ms recording tolerance), or whose spread is over 500ms (text) or 800ms (cards)
//   travel     an entrance (outside scenes) that travels under 8px or over 50px; a 100% move inside a clipping
//              parent (a masked line or word rise) is allowed
//   reduce     under prefers-reduced-motion: reduce, anything that moves, scales, rotates or blurs; any animation
//              inside a scene; a scene that steps, or that does not rest on its still frame (data-still, else its
//              last state); a 1200ms+ timeline still running in a product visual; an open <details> whose summary
//              (icon rotation, opacity, visibility) differs from its no-preference end state
//   plan       (v0.4) a scene with no shot plan (<script type="application/json" data-shot-plan>, assets/moments.js), a
//              beat with no shot, a shot whose owner does not match exactly one element
//   event      a product page whose scenes never act out an event: a shot with "aim", a later "press", then a "read"
//   read       a shot's "read" text held for less than max(1000, 300 + 330ms per visible word) after the change
//              settles (reading aloud, Brysbaert 2019; kb/moments/STUDY.md)
//   quiet      anything outside the owner that starts moving after the change settles, in the same beat
//   payoff     a scene in the first screen whose result shot starts more than 4500ms into the play
//   depth      (reference 10) a blocking <script src> for motion, three, cobe, rive, gsap or lottie in the head; a
//              <canvas> whose pixels change 700ms apart under reduced motion
// Warns: two hover speeds on one page (pick 100 or 150 and hold it).
// Exit 1 on any fail.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const here = path.dirname(new URL(import.meta.url).pathname);
const toolsDir = process.env.DESIGN_KB_TOOLS || path.resolve(here, '../../../tools');
const { launch, toUrl } = await import(pathToFileURL(path.join(toolsDir, 'browser.mjs')).href);

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(n); return i === -1 ? d : args[i + 1]; };
const pos = args.filter((a, i) => !a.startsWith('--') && !['--width', '--json'].includes(args[i - 1]));
const target = pos[0];
if (!target) { console.error('Usage: node motion-plan-check.mjs <page.html|url> [--width 1440] [--json out.json] [--no-scene]'); process.exit(2); }
const W = Number(flag('--width', 1440)), H = W < 600 ? 844 : 900;
const needScene = !args.includes('--no-scene');

// Runs in the page before any script. Logs each animation once, with where it runs, and every scene state change.
const RECORDER = () => {
  const seen = new WeakSet(); window.__mp = { anims: [], states: [], phase: 'load' };
  const sel = (el) => {
    if (!el || !el.tagName) return '?';
    const c = (typeof el.className === 'string' ? el.className : el.className?.baseVal || '').trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (c ? '.' + c : '');
  };
  // Vertical or horizontal translation of one keyframe value, in px (percent resolved against the element's box).
  const shift = (v, r) => {
    if (!v || v === 'none') return 0;
    const pct = (n, u, size) => (u === '%' ? (parseFloat(n) / 100) * size : parseFloat(n));
    let m;
    if ((m = v.match(/matrix(3d)?\(([^)]+)\)/))) { const n = m[2].split(',').map(Number); return m[1] ? Math.hypot(n[12], n[13]) : Math.hypot(n[4], n[5]); }
    let x = 0, y = 0;
    for (const t of v.matchAll(/translate(X|Y|3d)?\(([^)]+)\)/g)) {
      const parts = t[2].split(',').map((s) => s.trim().match(/^(-?[\d.]+)(px|%)?$/)).map((p) => p || [0, 0, 'px']);
      if (t[1] === 'X') x += pct(parts[0][1], parts[0][2], r.width);
      else if (t[1] === 'Y') y += pct(parts[0][1], parts[0][2], r.height);
      else { x += pct(parts[0][1], parts[0][2], r.width); if (parts[1]) y += pct(parts[1][1], parts[1][2], r.height); }
    }
    if (!/translate|matrix/.test(v) && (m = v.trim().match(/^(-?[\d.]+)(px|%)?(?:\s+(-?[\d.]+)(px|%)?)?/))) { // the translate property
      x = pct(m[1], m[2] || 'px', r.width); y = m[3] ? pct(m[3], m[4] || 'px', r.height) : 0;
    }
    return Math.hypot(x, y);
  };
  const pctOnly = (v) => /(-?100(\.0+)?)%/.test(v || '');
  const clipped = (el) => { for (let a = el?.parentElement, i = 0; a && i < 3; a = a.parentElement, i++) { const s = getComputedStyle(a); if (/hidden|clip/.test(s.overflow + s.overflowY + s.overflowX) || s.clipPath !== 'none') return true; } return false; };
  const tick = () => {
    try {
      for (const a of document.getAnimations()) {
        if (seen.has(a)) continue; seen.add(a);
        const e = a.effect, tm = e?.getTiming ? e.getTiming() : {}, ct = e?.getComputedTiming ? e.getComputedTiming() : {};
        let kf = []; try { kf = e.getKeyframes(); } catch {}
        const el = e?.target; const r = el?.getBoundingClientRect ? el.getBoundingClientRect() : { width: 0, height: 0 };
        const props = {};
        for (const k of kf) for (const p of Object.keys(k)) if (!['offset', 'computedOffset', 'easing', 'composite'].includes(p)) (props[p] ||= []).push(String(k[p]).slice(0, 100));
        const moveVals = [...(props.transform || []), ...(props.translate || [])];
        const scene = el?.closest?.('[data-scene]');
        window.__mp.anims.push({
          t: Math.round(performance.now()), phase: window.__mp.phase, kind: a.constructor.name, name: a.animationName || a.transitionProperty || '',
          dur: typeof ct.duration === 'number' ? Math.round(ct.duration) : null, delay: Math.round(tm.delay || 0),
          iterations: tm.iterations === Infinity ? 'infinite' : tm.iterations,
          curve: [...new Set(kf.map((k) => k.easing).filter((x) => x && x !== 'linear'))].join('|') || tm.easing,
          props: Object.keys(props), target: sel(el),
          scene: scene ? (scene.id || 'scene') : null, product: !!el?.closest?.('[data-visual="product"]'),
          moves: ['transform', 'translate', 'scale', 'rotate', 'filter'].some((p) => props[p] && new Set(props[p]).size > 1),
          travelFrom: moveVals.length ? Math.round(shift(moveVals[0], r)) : 0, travelTo: moveVals.length ? Math.round(shift(moveVals[moveVals.length - 1], r)) : 0,
          mask: moveVals.length ? pctOnly(moveVals[0]) && clipped(el) : false,
          fromOpacity: props.opacity ? props.opacity[0] : null,
        });
      }
    } catch {}
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  new MutationObserver((list) => {
    for (const m of list) if (m.target.hasAttribute && m.target.hasAttribute('data-scene')) {
      window.__mp.states.push({ t: Math.round(performance.now()), id: m.target.id || 'scene', state: m.target.getAttribute('data-state'), phase: window.__mp.phase });
      watchBeat(m.target);
    }
  }).observe(document, { subtree: true, attributes: true, attributeFilter: ['data-state'] });

  // Shot plans (moments.js): for each beat, when the change settles, how many words of the shot's "read" text are
  // visible, and what else in the scene moves after that while the owner should have the screen to itself.
  window.__mp.beats = [];
  const planOf = (scene) => { try { return JSON.parse(scene.querySelector('script[data-shot-plan]')?.textContent || 'null'); } catch { return 'invalid'; } };
  const visibleWords = (el) => {
    if (!el) return 0;
    const clips = [];
    for (let a = el; a && a !== document.body; a = a.parentElement) { const st = getComputedStyle(a); if (/hidden|clip/.test(st.overflow + st.overflowX + st.overflowY)) clips.push(a.getBoundingClientRect()); }
    let words = 0;
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const txt = n.textContent.trim(); if (!txt) continue;
      let op = 1; for (let a = n.parentElement; a && a !== document.body; a = a.parentElement) { const st = getComputedStyle(a); op *= parseFloat(st.opacity); if (st.visibility === 'hidden' || st.display === 'none') op = 0; }
      if (op < 0.5) continue;
      const r = document.createRange(); r.selectNodeContents(n); const b = r.getBoundingClientRect();
      if (b.width < 1 || b.height < 1) continue;
      const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
      // Clips between the read element and this text count too: a kit swap (.swap) masks its other values inside
      // the read element itself, and those values must not be counted as words to read.
      const inner = [];
      for (let a = n.parentElement; a && a !== el; a = a.parentElement) { const st = getComputedStyle(a); if (/hidden|clip/.test(st.overflow + st.overflowX + st.overflowY)) inner.push(a.getBoundingClientRect()); }
      if ([...clips, ...inner].some((c) => cx < c.left || cx > c.right || cy < c.top || cy > c.bottom)) continue;
      words += txt.split(/\s+/).filter(Boolean).length;
    }
    return words;
  };
  const watchBeat = (scene) => {
    const plan = planOf(scene); if (!plan || plan === 'invalid') return;
    const state = scene.getAttribute('data-state');
    const shot = (plan.shots || []).find((x) => x.state === state); if (!shot) return;
    const owner = shot.owner ? scene.querySelector(shot.owner) : null;
    const push = (plan.shots || []).map((x) => x.push && scene.querySelector(x.push)).filter(Boolean);
    const rec = { id: scene.id || 'scene', state, t: Math.round(performance.now()), settled: null, words: null, read: shot.read || null, quiet: [] };
    window.__mp.beats.push(rec);
    const counts = (a) => {
      const e = a.effect, tm = e?.getTiming?.() || {}, el = e?.target;
      // The scene's own section revealing on scroll counts too: until it lands, the first beat is not legible yet.
      if (!el || !(scene.contains(el) || el.contains(scene)) || tm.iterations === Infinity) return false;
      if (push.some((p) => p === el)) return false;                                        // the camera push runs the whole beat
      if (/linear/.test(String(tm.easing)) && (e.getComputedTiming().duration || 0) >= 1200) return false; // fills along a time axis
      // In its active interval: a transition still waiting out its delay is not motion yet.
      return a.playState === 'running' && e.getComputedTiming().progress !== null && (a.currentTime ?? 0) >= (tm.delay || 0);
    };
    const seen = new WeakSet();
    const poll = () => {
      if (scene.getAttribute('data-state') !== state) return;
      const running = document.getAnimations().filter(counts);
      if (rec.settled == null) {
        if (!running.length) { rec.settled = Math.round(performance.now()); rec.words = shot.read ? visibleWords(scene.querySelector(shot.read)) : null; running.forEach((a) => seen.add(a)); }
      } else {
        for (const a of running) {
          if (seen.has(a)) continue; seen.add(a);
          const el = a.effect.target;
          const moves = (() => { try { return a.effect.getKeyframes().some((k) => k.transform || k.translate || k.scale || k.rotate || k.filter); } catch { return false; } })();
          if (!moves) continue;
          if (owner && (owner === el || owner.contains(el))) continue;
          // The press and its release, and the cursor that makes it, are part of an aim or press beat's change.
          const cursor = scene.querySelector('.shot-cursor'), pressed = shot.press ? scene.querySelector(shot.press) : null;
          if ((shot.aim || shot.press) && ((cursor && cursor.contains(el)) || (pressed && pressed.contains(el)))) continue;
          rec.quiet.push(el.className && typeof el.className === 'string' ? el.tagName.toLowerCase() + '.' + el.className.trim().split(/\s+/)[0] : el.tagName.toLowerCase());
        }
      }
      setTimeout(poll, 50);
    };
    setTimeout(poll, 60);
  };
};

const SCENES = () => [...document.querySelectorAll('[data-scene]')].map((el) => {
  const planTag = el.querySelector('script[data-shot-plan]');
  let plan = null; try { plan = planTag ? JSON.parse(planTag.textContent) : null; } catch { plan = 'invalid'; }
  const shotInfo = plan && plan !== 'invalid' ? (plan.shots || []).map((x) => ({ ...x, ownerFound: x.owner ? el.querySelectorAll(x.owner).length : 0, readFound: x.read ? el.querySelectorAll(x.read).length : null })) : null;
  const toMs = (v) => (v == null || v === '' ? null : /ms$/.test(v) ? parseFloat(v) : /s$/.test(v) ? parseFloat(v) * 1000 : parseFloat(v));
  const beats = (el.dataset.beats || '').trim().split(/\s+/).filter(Boolean).map((b) => { const [s, ms] = b.split(':'); return { state: s, ms: toMs(ms) }; });
  const restCss = getComputedStyle(el).getPropertyValue('--scene-rest').trim();
  const btns = el.id ? [...document.querySelectorAll(`[data-scene-pause][aria-controls~="${el.id}"]`)] : [];
  const visible = (b) => { const r = b.getBoundingClientRect(); const s = getComputedStyle(b); return r.width >= 24 && r.height >= 24 && s.visibility !== 'hidden' && !b.hidden; };
  return { id: el.id || 'scene', hasId: !!el.id, beats, still: el.dataset.still || (beats.length ? beats[beats.length - 1].state : null), state: el.getAttribute('data-state'),
    loop: el.dataset.loop !== 'false', rest: toMs(el.dataset.rest) ?? toMs(restCss) ?? 0, pauseButtons: btns.length, pauseVisible: btns.some(visible),
    plan: plan === 'invalid' ? 'invalid' : plan ? 'ok' : null, shots: shotInfo, top: Math.round(el.getBoundingClientRect().top + scrollY) };
});

// What an open disclosure's summary shows: transform, opacity and visibility of its parts and pseudo-elements.
const END_STATE = (i) => {
  const d = document.querySelectorAll('details')[i]; const sum = d.querySelector('summary');
  if (!sum) return { i, sig: '' };
  const parts = [];
  for (const el of [sum, ...sum.querySelectorAll('*')]) for (const pseudo of [null, '::before', '::after']) {
    const s = getComputedStyle(el, pseudo);
    if (pseudo && (s.content === 'none' || s.content === 'normal')) continue;
    parts.push([s.transform, Math.round(parseFloat(s.opacity) * 10) / 10, s.visibility, pseudo ? s.content : ''].join(' '));
  }
  return { i, label: (sum.textContent || '').trim().slice(0, 40), sig: parts.join(' | ') };
};

async function record(reduce) {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, reducedMotion: reduce ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
  await ctx.addInitScript(RECORDER);
  const page = await ctx.newPage();
  await page.goto(toUrl(target), { waitUntil: 'load', timeout: 45000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => { window.__mp.phase = 'scroll'; });
  let last = -1;
  for (let i = 0; i < 80; i++) {
    const y = await page.evaluate((h) => { scrollBy({ top: h, behavior: 'instant' }); return scrollY; }, Math.round(H * 0.6));
    await page.waitForTimeout(450);
    if (y === last) break; last = y;
  }
  const scenes = await page.evaluate(SCENES);
  const behavior = [];
  for (const s of scenes) {
    if (!s.hasId) continue;
    const loc = page.locator('#' + s.id);
    const maxBeat = Math.max(1200, ...s.beats.map((b) => b.ms || 0));
    const total = s.beats.reduce((a, b) => a + (b.ms || 0), 0);
    const changes = async (phase, ms) => {
      await page.evaluate((p) => { window.__mp.phase = p; }, phase);
      const n0 = await page.evaluate(() => window.__mp.states.length);
      await page.waitForTimeout(ms);
      // Count this scene's steps only: other scenes on screen keep playing, as they should.
      return page.evaluate(([n, id]) => window.__mp.states.slice(n).filter((x) => x.id === id).length, [n0, s.id]);
    };
    await loc.scrollIntoViewIfNeeded().catch(() => {});
    await page.mouse.move(1, 1);
    // Long enough to see one whole play and the restart after the rest, so the last beat (often the scene's main
    // read) is measured against the next play's first beat.
    await changes('scene:' + s.id, Math.min(20000, total + (s.rest || 0) + 1200));
    if (reduce) continue;
    // Hover: the scene holds still while pointed at.
    await loc.hover({ position: { x: 8, y: 8 } }).catch(() => {});
    behavior.push({ id: s.id, test: 'hover', steps: await changes('scene-hover', maxBeat + 400) });
    await page.mouse.move(1, 1);
    // Pause button.
    const btn = page.locator(`[data-scene-pause][aria-controls~="${s.id}"]`).first();
    if (await btn.count()) {
      await btn.click().catch(() => {}); await page.mouse.move(1, 1);
      behavior.push({ id: s.id, test: 'pause button', steps: await changes('scene-paused', maxBeat + 400) });
      await btn.click().catch(() => {}); await page.mouse.move(1, 1);
    }
    // Off screen: scroll the scene out of view (to whichever end of the page is further away).
    await page.evaluate((id) => { const r = document.getElementById(id).getBoundingClientRect(); const y = r.top + scrollY; scrollTo({ top: y > document.documentElement.scrollHeight / 2 ? 0 : document.documentElement.scrollHeight, behavior: 'instant' }); }, s.id);
    const vis = await page.evaluate((id) => { const r = document.getElementById(id).getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }, s.id);
    if (!vis) behavior.push({ id: s.id, test: 'off screen', steps: await changes('scene-offscreen', maxBeat + 400) });
  }
  // Hover sample, as choreo-probe does.
  await page.evaluate(() => { window.__mp.phase = 'hover'; scrollTo({ top: 0, behavior: 'instant' }); });
  await page.waitForTimeout(500);
  let hovered = 0;
  for (const h of await page.$$('header a, main a, button, [role=button], summary')) {
    if (hovered >= 24) break;
    const box = await h.boundingBox().catch(() => null); if (!box || box.width < 8 || box.y > 2400) continue;
    await h.hover({ timeout: 1500 }).catch(() => {}); await page.waitForTimeout(250); hovered++;
  }
  await page.mouse.move(1, 1); await page.waitForTimeout(300);
  // End states of disclosures: open each <details>, let any transition finish, read what its summary shows.
  const ends = [];
  const nDetails = Math.min(8, await page.evaluate(() => document.querySelectorAll('details').length));
  for (let i = 0; i < nDetails; i++) {
    await page.evaluate((i) => { document.querySelectorAll('details')[i].open = true; }, i);
    await page.waitForTimeout(700);
    ends.push(await page.evaluate(END_STATE, i));
    await page.evaluate((i) => { document.querySelectorAll('details')[i].open = false; }, i);
  }
  // Depth tier (reference 10): blocking library scripts, and canvases that keep drawing under reduced motion.
  const blocking = await page.evaluate(() => [...document.querySelectorAll('head script[src]')]
    .filter((x) => !x.async && !x.defer && x.type !== 'module' && /(motion|three|cobe|rive|gsap|lottie)/i.test(x.src)).map((x) => x.src));
  const canvases = [];
  if (reduce) {
    const n = Math.min(6, await page.evaluate(() => document.querySelectorAll('canvas').length));
    for (let i = 0; i < n; i++) {
      const c = page.locator('canvas').nth(i);
      const box = await c.boundingBox().catch(() => null); if (!box || box.width < 40 || box.height < 40) continue;
      await c.scrollIntoViewIfNeeded().catch(() => {}); await page.waitForTimeout(300);
      const a = await c.screenshot().catch(() => null); await page.waitForTimeout(700); const b = await c.screenshot().catch(() => null);
      if (a && b) canvases.push({ i, changed: !a.equals(b) });
    }
  }
  const endScenes = await page.evaluate(SCENES);
  const data = await page.evaluate(() => window.__mp);
  await browser.close();
  return { ...data, scenes: endScenes, behavior, ends, blocking, canvases };
}

const band = (ms) => (ms <= 150 ? 'press/hover' : ms < 400 ? 'UI change' : ms < 600 ? 'entrance' : ms < 1200 ? 'reveal' : 'scene');
const findings = [];
const add = (level, check, msg) => findings.push({ level, check, msg });

const A = await record(false);
const R = await record(true);

// Bands.
// A transition reversed mid-flight is shortened by the browser (a 100ms hover left early records as 41ms): not a band.
const finite = A.anims.filter((a) => a.iterations !== 'infinite' && a.dur > 0 && !(a.kind === 'CSSTransition' && a.dur < 100));
const loopsInProduct = A.anims.filter((a) => a.iterations === 'infinite' && (a.scene || a.product) && a.dur >= 1200);
const bands = {};
for (const a of [...finite, ...loopsInProduct]) { const b = band(a.dur); (bands[b] ||= new Set()).add(a.dur); }
const bandList = Object.entries(bands).map(([b, s]) => `${b} ${[...s].sort((x, y) => x - y).join('/')}`);
if (Object.keys(bands).length < 3) add('fail', 'bands', `${Object.keys(bands).length} duration band(s) (${bandList.join('; ') || 'nothing moves'}); a page that moves uses 3 to 5, one per job (FOUNDATIONS v0.5 Motion ladder)`);
const hoverSpeeds = [...new Set(A.anims.filter((a) => a.phase === 'hover' && !a.scene && a.dur > 0 && a.dur <= 150).map((a) => a.dur))];
if (hoverSpeeds.length > 1) add('warn', 'bands', `hover runs at ${hoverSpeeds.join(' and ')}ms; pick one hover speed (100 or 150) and hold it everywhere`);

// Scene.
const sceneOk = [];
for (const s of A.scenes) {
  const states = new Set(A.states.filter((x) => x.id === s.id).map((x) => x.state));
  const inside = A.anims.filter((a) => a.scene === s.id).length;
  if (s.beats.length >= 3 && states.size >= 3 && inside) sceneOk.push(s.id);
  else add(needScene ? 'fail' : 'warn', 'scene', `#${s.id}: ${s.beats.length} beats, stepped through ${states.size} state(s), ${inside} animation(s) inside; a scene needs 3+ states that play with motion inside`);
  if (!s.hasId) add('fail', 'beats', 'a [data-scene] has no id, so no pause button can point at it (aria-controls)');
  for (const b of s.beats) if (!(b.ms >= 1200 && b.ms <= 4500)) add('fail', 'beats', `#${s.id} beat "${b.state}" is ${b.ms}ms; beats are 1200 to 4500ms, each state held 1000ms+ so it can be read`);
  const total = s.beats.reduce((x, b) => x + (b.ms || 0), 0);
  if (total > 12000) add('fail', 'beats', `#${s.id} loop is ${total}ms; at most 12000ms (Stripe's longest timeline 11.95s)`);
  if (s.loop && s.rest < 2000) add('fail', 'beats', `#${s.id} rests ${s.rest}ms between plays; at least 2000ms (Stripe 4000)`);
  if ((s.loop || total > 5000) && !s.pauseVisible) add('fail', 'beats', `#${s.id} ${s.loop ? 'loops' : 'runs over 5s'} with no visible [data-scene-pause] button (WCAG 2.2.2)`);
}
const productTimeline = finite.concat(loopsInProduct).filter((a) => a.product && !a.scene && a.dur >= 1200);
if (!sceneOk.length && !productTimeline.length) {
  if (needScene) add('fail', 'scene', 'no product scene: nothing acts out the product. Add a [data-scene] mock-up with 3+ states on data-beats (assets/scene.js), or a 1200ms+ keyframed timeline inside [data-visual="product"] (FOUNDATIONS v0.5 Product scenes)');
}
// Shot plans (v0.4, kb/moments/STUDY.md): every scene directs its beats; one owner per beat; text held long enough to
// read aloud from the moment it is legible; nothing else moves during that hold; a product page acts out one event.
const readMs = (words) => Math.max(1000, 300 + 330 * words);
let eventOk = false;
for (const s of A.scenes) {
  if (!s.plan) { add(needScene ? 'fail' : 'warn', 'plan', `#${s.id} has no shot plan (<script type="application/json" data-shot-plan> with one shot per beat; assets/moments.js)`); continue; }
  if (s.plan === 'invalid') { add('fail', 'plan', `#${s.id} shot plan is not valid JSON`); continue; }
  const states = s.beats.map((b) => b.state), shotStates = s.shots.map((x) => x.state);
  const missing = states.filter((x) => !shotStates.includes(x));
  if (missing.length) add('fail', 'plan', `#${s.id} beats ${missing.join(', ')} have no shot; every beat names what owns the screen`);
  for (const x of s.shots) {
    if (!states.includes(x.state)) add('fail', 'plan', `#${s.id} shot "${x.state}" is not a beat in data-beats`);
    if (!x.owner || x.ownerFound !== 1) add('fail', 'plan', `#${s.id} shot "${x.state}" owner "${x.owner ?? ''}" matches ${x.ownerFound} element(s); one beat, one owner`);
    if (x.read && !x.readFound) add('fail', 'plan', `#${s.id} shot "${x.state}" read "${x.read}" matches nothing`);
  }
  // The event: aim, then press, then a result to read (the article's event shot; Raycast's hotkey closer).
  const iAim = s.shots.findIndex((x) => x.aim), iPress = s.shots.findIndex((x, i) => x.press && i > iAim), iRes = s.shots.findIndex((x, i) => x.read && i > iPress);
  if (iAim !== -1 && iPress !== -1 && iRes !== -1) eventOk = true;
  // The payoff lands while the first look lasts: a scene in the first screen shows its result by 4500ms (Linear's
  // product is on screen 1.1s after its headline; round 1 of the Halyard gate: "the answer never appears in 6s").
  if (iRes !== -1 && s.top < H) {
    const at = s.beats.slice(0, s.beats.findIndex((b) => b.state === s.shots[iRes].state)).reduce((a, b) => a + (b.ms || 0), 0);
    if (at > 4500) add(needScene ? 'fail' : 'warn', 'payoff', `#${s.id} is in the first screen and reaches its result "${s.shots[iRes].state}" ${at}ms in; the first look shows the result by 4500ms`);
  }
}
if (needScene && A.scenes.length && !eventOk) add('fail', 'event', 'no scene acts out an event: a shot with "aim" (the cursor on the action), a later shot with "press", then a shot with "read" (the result)');
const beatsRec = A.beats || [];
const byBeat = {};
for (let i = 0; i < beatsRec.length; i++) {
  const b = beatsRec[i];
  const sc = A.scenes.find((x) => x.id === b.id); if (!sc) continue;
  const next = beatsRec.slice(i + 1).find((x) => x.id === b.id);
  const beatMs = (sc.beats.find((x) => x.state === b.state) || {}).ms || 0;
  // A scene that plays once rests on its last beat for good: that beat's hold has no end.
  const end = next ? next.t : !sc.loop && b.state === sc.beats[sc.beats.length - 1]?.state ? b.t + 60000 : null;
  if (end == null || end - b.t < beatMs * 0.9) continue; // a beat cut short by the check's own hover or pause tests
  const k = b.id + ':' + b.state;
  const hold = b.settled == null ? 0 : end - b.settled;
  const r = byBeat[k] || (byBeat[k] = { id: b.id, state: b.state, holds: [], words: b.words, read: b.read, quiet: new Set() });
  r.holds.push(hold); if (b.words != null) r.words = Math.max(r.words ?? 0, b.words);
  b.quiet.forEach((q) => r.quiet.add(q));
}
for (const r of Object.values(byBeat)) {
  const hold = Math.min(...r.holds);
  if (r.read) {
    const need = readMs(r.words || 0);
    if (hold < need) add('fail', 'read', `#${r.id} "${r.state}": ${r.words} word(s) of ${r.read} are held ${hold}ms after the change settles; reading aloud needs ${need}ms (max(1000, 300 + 330 per word), Brysbaert 2019)`);
  }
  if (r.quiet.size) add('fail', 'quiet', `#${r.id} "${r.state}": ${[...r.quiet].slice(0, 4).join(', ')} moved after the change settled, while the owner should have the screen (one owner at a time)`);
}

for (const b of A.behavior) if (b.steps) add('fail', 'behavior', `#${b.id} kept stepping ${b.test === 'off screen' ? 'while off screen' : b.test === 'hover' ? 'while hovered' : 'after its pause button was pressed'} (${b.steps} state change(s))`);

// Stagger (outside scenes, not hover).
const groups = {};
for (const a of finite.filter((x) => x.phase !== 'hover' && !x.scene)) { const k = `${a.dur}|${a.curve}|${a.props.sort().join(',')}`; (groups[k] ||= []).push(a); }
const staggers = [];
for (const [k, g] of Object.entries(groups)) {
  if (g.length < 3) continue;
  const text = g.filter((a) => /^(span|h[1-6]|p|em|strong|b|i|li)\b/.test(a.target || '')).length / g.length >= 0.6;
  const starts = g.map((a) => a.t + a.delay).sort((x, y) => x - y);
  let burst = [starts[0]];
  const flush = () => { if (burst.length >= 3) { const gaps = burst.slice(1).map((s, i) => s - burst[i]).filter((d) => d > 4).sort((x, y) => x - y); if (gaps.length >= 2) staggers.push({ key: k, text, n: burst.length, gap: gaps[Math.floor(gaps.length / 2)], span: burst[burst.length - 1] - burst[0] }); } };
  for (let i = 1; i < starts.length; i++) { if (starts[i] - starts[i - 1] > 600) { flush(); burst = []; } burst.push(starts[i]); }
  flush();
}
for (const s of staggers) {
  if (s.gap < 18 || s.gap > 82) add('fail', 'stagger', `${s.n} items step ${s.gap}ms apart (${s.key}); stagger gaps are 20 to 80ms (--stagger 40ms)`);
  // Text groups (words, lines, headings) are capped at 500ms; card groups at 800ms (FOUNDATIONS v0.5). Fresh-brief critic:
  // a 594 to 707ms word rise on every heading passed as a warning, so text over 500ms now fails.
  const limit = s.text ? 500 : 800;
  if (s.span > limit) add('fail', 'stagger', `${s.n} ${s.text ? 'text' : 'card'} items spread over ${s.span}ms (${s.key}); one group spreads at most ${limit}ms (500 text, 800 cards)`);
}

// Travel of entrances (outside scenes, not hover).
const entrances = finite.filter((a) => a.phase !== 'hover' && !a.scene && a.travelFrom > 0.5 && a.travelTo <= 0.5);
for (const a of entrances) {
  if (a.mask) continue;
  if (a.travelFrom < 8 || a.travelFrom > 50) add('fail', 'travel', `${a.target} enters from ${a.travelFrom}px away (${a.dur}ms); travel is 8 to 50px (--travel 16px) or a 100% rise inside a clipping mask`);
}

// Reduced motion.
const movingR = R.anims.filter((a) => a.moves);
for (const a of movingR.slice(0, 8)) add('fail', 'reduce', `${a.target} ${a.name || a.kind} still moves under reduced motion (${a.props.join(', ')}, ${a.dur}ms, ${a.phase})`);
if (movingR.length > 8) add('fail', 'reduce', `and ${movingR.length - 8} more moving animations under reduced motion`);
for (const a of R.anims.filter((x) => x.scene && !x.moves).slice(0, 4)) add('fail', 'reduce', `${a.target} animates inside scene #${a.scene} under reduced motion; a scene is a still frame under reduce`);
for (const a of R.anims.filter((x) => x.product && !x.scene && x.dur >= 1200)) add('fail', 'reduce', `${a.target} runs a ${a.dur}ms timeline in a product visual under reduced motion; show its most informative frame as a still`);
for (const s of R.scenes) {
  const steps = new Set(R.states.filter((x) => x.id === s.id).map((x) => x.state));
  if (steps.size > 1) add('fail', 'reduce', `scene #${s.id} steps through ${[...steps].join(', ')} under reduced motion`);
  if (s.state !== s.still) add('fail', 'reduce', `scene #${s.id} shows "${s.state ?? 'no state'}" under reduced motion; it must rest on its still frame "${s.still}" (load assets/scene.js or set data-state)`);
}

// Depth tier (reference 10).
for (const src of A.blocking) add('fail', 'depth', `${src} loads as a blocking script in the head; depth-tier libraries load lazily (dynamic import near the viewport), never on the first paint's path`);
for (const c of R.canvases.filter((x) => x.changed)) add('fail', 'depth', `canvas ${c.i + 1} keeps drawing under reduced motion; draw one still frame (or keep the poster) and stop`);

// End states survive reduced motion: an open disclosure looks open in both settings (benchmark round 2: the FAQ icon
// lost its open rotation under reduce, kb/reviews/benchmark-round2-landing.md gap 3).
for (const e of A.ends) {
  const r = R.ends.find((x) => x.i === e.i);
  if (r && r.sig !== e.sig) add('fail', 'reduce', `open disclosure "${e.label}" looks different under reduced motion; keep the end state (rotate with no transition, or swap the icon), remove only the transition`);
}

// Report.
const summary = {
  page: target, width: W, needScene, measuredAt: new Date().toISOString(),
  animations: A.anims.length, reduceAnimations: R.anims.length,
  ladder: [...new Set(finite.map((a) => a.dur))].sort((x, y) => x - y), bands: bandList,
  scenes: A.scenes.map((s) => ({ ...s, statesSeen: [...new Set(A.states.filter((x) => x.id === s.id).map((x) => x.state))] })),
  productTimelines: productTimeline.map((a) => `${a.target} ${a.dur}ms`).slice(0, 8),
  reversed: A.anims.filter((a) => a.dur > 0 && a.dur < 100).map((a) => `${a.phase} ${a.target} ${a.name} ${a.dur}ms`).slice(0, 8),
  staggers, entrances: entrances.map((a) => ({ target: a.target, from: a.travelFrom, mask: a.mask, dur: a.dur })).slice(0, 20),
  behavior: A.behavior, beats: Object.values(byBeat).map((r) => ({ ...r, quiet: [...r.quiet] })), findings,
};
const jsonOut = flag('--json', null);
if (jsonOut) { fs.mkdirSync(path.dirname(path.resolve(jsonOut)), { recursive: true }); fs.writeFileSync(jsonOut, JSON.stringify(summary, null, 1)); }
const fails = findings.filter((f) => f.level === 'fail').length;
console.log(`motion-plan-check ${target} at ${W}px`);
console.log(`  animations ${A.anims.length} (reduce ${R.anims.length}); ladder ${summary.ladder.join('/') || 'none'} ms`);
console.log(`  bands ${Object.keys(bands).length}: ${bandList.join('; ') || 'none'}`);
console.log(`  scenes ${A.scenes.length ? summary.scenes.map((s) => `#${s.id} [${s.beats.map((b) => b.state + ':' + b.ms).join(' ')}] seen ${s.statesSeen.join('>') || 'none'}`).join(', ') : 'none'}${productTimeline.length ? `; product timelines ${summary.productTimelines.join(', ')}` : ''}`);
console.log(`  staggers ${staggers.map((s) => `${s.n}@${s.gap}ms over ${s.span}ms`).join(', ') || 'none'}; entrances ${entrances.length} (${entrances.filter((a) => a.mask).length} masked)`);
for (const f of findings) console.log(`  ${f.level.padEnd(4)} ${f.check.padEnd(8)} ${f.msg}`);
for (const r of summary.beats) console.log(`  beat #${r.id} ${r.state}: hold ${Math.min(...r.holds)}ms after settle${r.read ? `, ${r.words} word(s) to read (needs ${readMs(r.words || 0)}ms)` : ''}`);
console.log(fails ? `FAIL: ${fails} motion plan check(s) failed` : 'PASS: ladder, scene, shot plan, stagger, travel and reduced motion meet FOUNDATIONS v0.6');
process.exit(fails ? 1 : 0);
