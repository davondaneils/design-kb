/* moments.js (design-motion v0.4): runs the three rebuilt exemplar moments and the shot plan inside product scenes.
 * Load after scene.js (which steps data-state) and moments.css. Study and numbers: kb/moments/STUDY.md.
 *
 * Every scene that acts out the product carries a shot plan, which this file executes and motion-plan-check reads:
 *   <div data-scene id="pay-scene" data-beats="start:2200 aim:1400 press:1200 result:4200" data-rest="2500" ...>
 *     <script type="application/json" data-shot-plan>
 *       {"shots": [
 *         {"state": "start",  "owner": ".invoice",   "read": ".invoice-title"},
 *         {"state": "aim",    "owner": ".shot-cursor", "aim": ".pay-button"},
 *         {"state": "press",  "owner": ".pay-button", "press": ".pay-button"},
 *         {"state": "result", "owner": ".receipt",   "read": ".receipt", "push": ".mock"}
 *       ]}
 *     </script>
 *     <span class="shot-cursor" aria-hidden="true">(an arrow svg)</span> ...
 *
 * Shot fields (one shot per beat, same state names as data-beats):
 *   owner  the one element that owns the screen in this beat (STUDY.md rule 1). Anything else in the scene that moves
 *          during the owner's reading window fails motion-plan-check ("quiet").
 *   read   text the viewer must read in this beat. motion-plan-check fails the beat when the time left after the
 *          change settles is under max(1000ms, 300ms + 330ms per visible word) (Brysbaert 2019 reading aloud, 183 wpm).
 *   aim    selector the cursor travels to (its center), on a spring (--ease-spring, about 520ms).
 *   press  selector that registers the press: it and the cursor get [data-pressed] for two --duration-instant.
 *   push   selector that scales 1.00 to 1.03 over this beat and stays there until the scene resets.
 * A product page scene needs one event: a shot with aim, then a shot with press, then a shot with read (the result).
 *
 * Swap and stack need no plan entries: [data-swap="s1 s2 s3"] picks a value per state, [data-stack] items with
 * data-at="state" join the stack when that state has been reached. See moments.css for the markup.
 *
 * Writes --ease-spring and --duration-spring on :root from spring(300, 26), unless the page set them.
 * No millisecond literals: press length and offsets come from the motion tokens.
 */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const cssMs = (el, name) => { const v = getComputedStyle(el).getPropertyValue(name).trim(); if (!v) return null; const n = parseFloat(v); return /ms$/.test(v) ? n : /s$/.test(v) ? n * 1000 : n; };

  // A damped spring sampled into a CSS linear() curve. Returns { easing, ms } (ms: time to settle within 0.1%).
  function spring(stiffness = 300, damping = 26, mass = 1) {
    let x = 0, v = 0, t = 0; const dt = 1 / 1000, pts = [];
    while (t < 3) {
      const a = (-stiffness * (x - 1) - damping * v) / mass; v += a * dt; x += v * dt; t += dt; pts.push([t, x]);
      if (Math.abs(x - 1) < 0.001 && Math.abs(v) < 0.01) break;
    }
    const ms = Math.round(t * 1000), n = 40, out = [];
    for (let i = 0; i <= n; i++) { const p = pts[Math.min(pts.length - 1, Math.round((i / n) * (pts.length - 1)))]; out.push(+p[1].toFixed(4)); }
    out[out.length - 1] = 1;
    return { easing: `linear(${out.join(', ')})`, ms };
  }
  const rootStyle = getComputedStyle(root);
  if (!root.style.getPropertyValue('--ease-spring') && /cubic-bezier/.test(rootStyle.getPropertyValue('--ease-spring')) && CSS.supports('transition-timing-function', 'linear(0, 1)')) {
    const s = spring();
    root.style.setProperty('--ease-spring', s.easing);
    root.style.setProperty('--duration-spring', s.ms + 'ms');
  }

  function setup(scene) {
    if (scene.__moments) return;
    scene.__moments = true;
    let plan = { shots: [] };
    const tag = scene.querySelector('script[data-shot-plan]');
    if (tag) { try { plan = JSON.parse(tag.textContent); } catch (e) { console.warn('moments.js: shot plan is not valid JSON', e, scene); } }
    const shots = Object.fromEntries((plan.shots || []).map((s) => [s.state, s]));
    const q = (sel) => (sel ? scene.querySelector(sel) : null);
    const cursor = scene.querySelector('.shot-cursor');
    const pressMs = (cssMs(root, '--duration-instant') || 0) * 2;

    // Swap: index each swap's values against its state list; order within its group for the cascade.
    const swaps = [...scene.querySelectorAll('[data-swap]')];
    const groups = {};
    for (const s of swaps) {
      const g = s.dataset.swapGroup || '0';
      s.style.setProperty('--swap-n', String((groups[g] = (groups[g] ?? -1) + 1)));
      s.style.setProperty('--swap-group', g);
      const track = s.querySelector('.swap-track');
      s.style.setProperty('--swap-count', String(track ? track.children.length : 1));
    }
    const stacks = [...scene.querySelectorAll('[data-stack]')];

    const apply = () => {
      const state = scene.dataset.state;
      const seen = (scene.dataset.seen || '').split(/\s+/);
      for (const s of swaps) {
        const list = s.dataset.swap.split(/\s+/);
        // Hold the last value reached until the next listed state arrives.
        let i = -1; for (const st of seen) { const k = list.indexOf(st); if (k !== -1) i = k; }
        s.style.setProperty('--swap-i', String(Math.max(0, i)));
      }
      for (const st of stacks) {
        const items = [...st.children];
        const inItems = items.filter((it) => seen.includes(it.dataset.at));
        items.forEach((it) => { if (!inItems.includes(it)) { it.removeAttribute('data-in'); it.removeAttribute('data-depth'); } });
        inItems.forEach((it, k) => {
          const depth = inItems.length - 1 - k;
          it.setAttribute('data-in', ''); it.dataset.depth = String(depth); it.style.setProperty('--depth', String(depth));
          it.toggleAttribute('data-depth-hidden', depth > 2);
        });
      }
      const shot = shots[state] || {};
      scene.querySelectorAll('[data-owner]').forEach((e) => e.removeAttribute('data-owner'));
      q(shot.owner)?.setAttribute('data-owner', '');
      if (shot.aim && cursor) {
        const t = q(shot.aim);
        if (t) {
          const a = scene.getBoundingClientRect(), b = t.getBoundingClientRect();
          // Aim a little below and right of center, where a hand lands on a button, not dead center.
          cursor.style.setProperty('--cx', Math.round(b.left - a.left + b.width * 0.55) + 'px');
          cursor.style.setProperty('--cy', Math.round(b.top - a.top + b.height * 0.6) + 'px');
        }
      }
      if (shot.press) {
        const t = q(shot.press);
        if (t) {
          t.setAttribute('data-press-target', '');
          // Let the press transition attach first, then press and release.
          requestAnimationFrame(() => {
            t.setAttribute('data-pressed', ''); cursor?.setAttribute('data-pressed', '');
            setTimeout(() => { t.removeAttribute('data-pressed'); cursor?.removeAttribute('data-pressed'); }, pressMs);
          });
        }
      }
      if (shot.push) q(shot.push)?.setAttribute('data-pushing', '');
      // The first state of a play resets the camera and parks the cursor where the plan's first aim will start.
      const first = (scene.dataset.beats || '').trim().split(/\s+/)[0]?.split(':')[0];
      if (state === first) {
        scene.querySelectorAll('[data-pushing]').forEach((e) => e.removeAttribute('data-pushing'));
        // Park the cursor at the lower right: it enters the frame on its first aim, it never pops in.
        if (cursor && !shot.aim) {
          const a = scene.getBoundingClientRect();
          cursor.style.setProperty('--cx', Math.round(a.width * 0.86) + 'px');
          cursor.style.setProperty('--cy', Math.round(a.height * 0.92) + 'px');
        }
      }
    };
    // Mark press targets up front so their transition exists before the first press.
    for (const s of plan.shots || []) if (s.press) q(s.press)?.setAttribute('data-press-target', '');
    for (const s of plan.shots || []) if (s.push) q(s.push)?.setAttribute('data-push', '');
    // scene.js dispatches scene:state synchronously, so a reset under the seam happens with no visible transitions.
    scene.addEventListener('scene:state', apply);
    if (scene.dataset.state) apply();
    scene.getAnimations({ subtree: true }).forEach((a) => a.finish());
    if (reduce.matches) cursor?.setAttribute('hidden', '');
  }

  const init = (r = document) => r.querySelectorAll('[data-scene]').forEach(setup);
  window.DesignKbMoments = { init, spring };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
