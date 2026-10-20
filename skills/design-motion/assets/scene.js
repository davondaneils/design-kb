/* scene.js (design-motion v0.3): a tiny, dependency-free runner for product scenes.
 *
 * A product scene is a mock-up that acts out the product's core state change on a scripted timeline with holds
 * (FOUNDATIONS v0.5 "Product scenes"; measured: Stripe's mock-ups run 1.42s, 2.26s and 4.48s beats with a 4s rest,
 * kb/teardowns/motion-imagery.md section 2). This file only steps a state attribute. All motion lives in CSS, keyed
 * off that attribute, on the motion tokens, so the scene is filmed and audited like any other motion.
 *
 * Markup (author the HTML on the still frame, data-state and data-seen included, so it is right without JS):
 *   <div data-scene id="run-scene" aria-hidden="true"
 *        data-beats="queued:1600 sending:2400 paid:3200"   state:hold-ms, in order; each beat 1200 to 4500 ms
 *        data-rest="4000"                                  hold on the last state before replaying, 2000 ms or more
 *        data-still="paid"                                 frame shown under reduced motion (default: last state)
 *        data-loop="false">                                optional: play once and stop on the still frame
 *   <button type="button" data-scene-pause aria-controls="run-scene" aria-pressed="false">Pause animation</button>
 *
 * The runner writes, on the [data-scene] element:
 *   data-state="sending"          the current state (CSS: [data-state="sending"] .row-live { ... })
 *   data-seen="queued sending"    every state reached in this play, so CSS can keep earlier changes ([data-seen~="sending"])
 *   style --beat: 2400ms           the current beat's length, for CSS that fills a beat (a progress bar)
 *   data-scene-seam                only with data-seam="fade": for one --duration-fast before a replay, CSS fades the mock
 *                                  out, the state resets underneath with no transitions, and it fades back in.
 *                                  The default replay (data-seam absent or "in-place") returns to the first state with
 *                                  its transitions running, in place, like any other state change (Stripe's checkout
 *                                  cycles back the same way). Three of three blind critics read the whole-mock fade as a
 *                                  cut to a blank frame (gate round v07, kb/tests/fresh/landing/gate/).
 *   event scene:state              dispatched synchronously on every state change (moments.js listens to it)
 *   data-scene-paused              while paused for any reason
 *
 * It pauses while hovered, while focus is inside, while the tab is hidden, while less than a third of the scene is on
 * screen, and while the pause button is pressed. Pausing keeps the time left in the beat; resuming continues it.
 * Under prefers-reduced-motion: reduce it renders the still frame, hides the pause button and does nothing else.
 *
 * No millisecond literals: beats and rest come from data attributes (FOUNDATIONS: "scene beats are set per scene in
 * data-beats, never as tokens"); the seam length is read from the --duration-fast token. A rest may also be set in
 * CSS as --scene-rest on the scene element.
 */
(() => {
  'use strict';
  const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');

  // Read a duration custom property ("150ms" or ".15s") from an element as milliseconds; null when unset.
  const cssMs = (el, name) => {
    const v = getComputedStyle(el).getPropertyValue(name).trim();
    if (!v) return null;
    const n = parseFloat(v);
    return /ms$/.test(v) ? n : /s$/.test(v) ? n * 1000 : n;
  };
  // "1600", "1600ms" or "1.6s" to milliseconds.
  const toMs = (v) => (v == null || v === '' ? null : /ms$/.test(v) ? parseFloat(v) : /s$/.test(v) ? parseFloat(v) * 1000 : parseFloat(v));

  function setup(el) {
    if (el.__scene) return el.__scene;
    const beats = (el.dataset.beats || '').trim().split(/\s+/).filter(Boolean).map((b) => {
      const [state, ms] = b.split(':');
      return { state, ms: toMs(ms) };
    }).filter((b) => b.state && b.ms > 0);
    if (beats.length < 2) { console.warn('scene.js: data-beats needs two or more state:ms pairs', el); return null; }

    const still = el.dataset.still || beats[beats.length - 1].state;
    const loop = el.dataset.loop !== 'false';
    const rest = toMs(el.dataset.rest) ?? cssMs(el, '--scene-rest') ?? 0;
    const seamMs = cssMs(document.documentElement, '--duration-fast') ?? 0;
    const total = beats.reduce((s, b) => s + b.ms, 0);
    const buttons = el.id ? [...document.querySelectorAll(`[data-scene-pause][aria-controls~="${el.id}"]`)] : [];
    // WCAG 2.2.2: moving content that starts by itself and lasts more than 5 s beside other content needs a pause
    // control. A loop always lasts more than 5 s.
    if ((loop || total > 5000) && !buttons.length) console.warn('scene.js: a looping or 5s+ scene needs a [data-scene-pause] button (WCAG 2.2.2)', el);

    const reasons = new Set(['offscreen']); // why we are paused; play only when empty
    let index = -1, timer = 0, startedAt = 0, left = 0, phase = 'idle'; // phase: beat | rest | seam

    const show = (i) => {
      index = i;
      const b = beats[i];
      el.dataset.state = b.state;
      el.dataset.seen = beats.slice(0, i + 1).map((x) => x.state).join(' ');
      el.style.setProperty('--beat', b.ms + 'ms');
      // Synchronous, so a listener (moments.js) can change styles inside the same frame as the state.
      el.dispatchEvent(new CustomEvent('scene:state', { detail: { state: b.state, index: i } }));
    };
    // Change state with no transitions (load and the seam): flush styles, then finish what that started.
    const jump = (i) => { show(i); getComputedStyle(el).opacity; el.getAnimations({ subtree: true }).forEach((a) => a.finish()); };
    const schedule = (ms, fn) => { clearTimeout(timer); left = ms; startedAt = performance.now(); timer = setTimeout(fn, ms); };
    const next = () => {
      // Reset under the seam (the mock is faded out), with no transitions, then fade back in on the first state.
      if (phase === 'seam') { jump(0); el.removeAttribute('data-scene-seam'); phase = 'beat'; return schedule(beats[0].ms, next); }
      if (index < beats.length - 1) { show(index + 1); phase = 'beat'; return schedule(beats[index].ms, next); }
      if (phase === 'beat' && loop) { phase = 'rest'; return schedule(rest, next); }   // hold the last frame
      if (phase === 'rest' && el.dataset.seam !== 'fade') { show(0); phase = 'beat'; return schedule(beats[0].ms, next); } // replay in place
      if (phase === 'rest') { phase = 'seam'; el.setAttribute('data-scene-seam', ''); return schedule(seamMs, next); }
      phase = 'done'; // played once: stay on the last state
    };
    const pause = (why) => {
      if (!reasons.size && phase !== 'idle' && phase !== 'done') { clearTimeout(timer); left -= performance.now() - startedAt; }
      reasons.add(why);
      el.setAttribute('data-scene-paused', '');
    };
    const play = (why) => {
      reasons.delete(why);
      if (reasons.size) return;
      el.removeAttribute('data-scene-paused');
      if (phase === 'idle') { show(0); phase = 'beat'; return schedule(beats[0].ms, next); } // first time on screen
      if (phase !== 'done') schedule(Math.max(0, left), next);
    };

    // Reduced motion: the still frame, nothing else.
    const toStill = () => {
      clearTimeout(timer); phase = 'done';
      el.removeAttribute('data-scene-seam');
      show(Math.max(0, beats.findIndex((b) => b.state === still)));
      el.setAttribute('data-scene-still', '');
      for (const b of buttons) b.hidden = true;
    };
    if (reduceQuery.matches) { toStill(); return (el.__scene = { still: toStill }); }

    // The HTML is authored on the still frame (right without JS and under reduce). Jump to the first state with no
    // transition, so the story never plays backwards on load: flush styles, then finish the transitions that created.
    jump(0);
    el.addEventListener('pointerenter', () => pause('hover'));
    el.addEventListener('pointerleave', () => play('hover'));
    el.addEventListener('focusin', () => pause('focus'));
    el.addEventListener('focusout', () => play('focus'));
    document.addEventListener('visibilitychange', () => (document.hidden ? pause('hidden') : play('hidden')));
    new IntersectionObserver(([e]) => (e.isIntersecting ? play('offscreen') : pause('offscreen')), { threshold: 0.35 }).observe(el);
    for (const b of buttons) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => {
        const paused = b.getAttribute('aria-pressed') !== 'true';
        buttons.forEach((x) => x.setAttribute('aria-pressed', String(paused)));
        paused ? pause('user') : play('user');
      });
    }
    // Someone turns on reduced motion while the page is open: stop on the still frame.
    reduceQuery.addEventListener('change', (q) => { if (q.matches) toStill(); });
    // restart: back to the first state with no transitions and play from there (blind-gate.mjs films each scene
    // from its opening, not from wherever the scroll left it).
    const restart = () => { if (phase === 'done' && reduceQuery.matches) return; clearTimeout(timer); el.removeAttribute('data-scene-seam'); jump(0); phase = 'beat'; if (!reasons.size) schedule(beats[0].ms, next); else left = beats[0].ms; };
    return (el.__scene = { pause: () => pause('user'), play: () => play('user'), still: toStill, restart });
  }

  const init = (root = document) => root.querySelectorAll('[data-scene]').forEach(setup);
  window.DesignKbScene = { init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
  else init();
})();
