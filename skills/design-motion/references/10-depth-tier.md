# 10. The depth tier: springs, layout, WebGL and Rive, with limits

Why this reference exists: CSS transitions, WAAPI and `scene.js` cover the ladder and product scenes, and the moment kit adds springs through CSS `linear()`. Some moments need more: a drag that keeps its velocity, a list that re-lays out without jumping, a globe of live data, a 3D product, an illustrated character with states. The exemplars use exactly these (Framer's CSS `linear()` springs, Stripe's dot globe and gradient canvas, Ramp's 9 animated canvases; `kb/teardowns/motion-imagery.md`). This tier says which tool, when, and the limits every use must meet.

Sizes below were measured on 2026-10-15 from jsDelivr and gzipped at level 9 (`curl` plus `gzip -9c | wc -c`); they are not the vendors' claims.

## 1. Fundamentals (non-negotiable for every depth-tier use)

1. **The plain tier first.** Reach for a library only when the decision table (section 2) says the plain tools cannot do the job. A fade-up never needs Motion; a spring that only plays forward is `--ease-spring` from `moments.js`.
2. **Never on the first paint's critical path.** Load after the page is interactive: a dynamic `import()` when the element is within a screen of the viewport (`IntersectionObserver`, `rootMargin: '100% 0px'`), never a blocking `<script>` in the head. `motion-plan-check.mjs` fails a blocking script from these libraries (`depth`).
3. **The still is authored in HTML.** Every canvas or Rive element sits on a poster (an `<img>` or the CSS-drawn final frame) that is right if the script never loads, if WebGL is unavailable, and under reduced motion.
4. **Reduced motion: the still, not a slower loop.** Under `prefers-reduced-motion: reduce` the canvas is not animated: draw one frame and stop, or do not start. `motion-plan-check.mjs` films every canvas twice, 700ms apart, under reduce and fails any that changed (`depth`).
5. **Runs only when seen.** Stop the render loop when the element is off screen or the tab is hidden; pause on the same `[data-scene-pause]` button rule as scenes when it loops past 5s beside content (WCAG 2.2.2).
6. **Never carries content.** Anything the viewer must read lives in HTML beside the canvas (`aria-hidden="true"` on the canvas, the fact in text). Canvas text is not searchable, selectable or translated.
7. **Budget per page** (**opinion**, set from the measured sizes and held tight on purpose): springs and layout up to **30KB** gzipped of library; one WebGL feature up to **8KB** (cobe class) on a landing page; **three.js (171KB)** and **Rive (47KB plus a 199KB wasm with canvas-lite)** only when section 2 says the job needs them, one per page, lazy, with a poster.
8. **Device pixel ratio capped at 2**, and the canvas sized to its box, not the window.

## 2. Which tool (decision table)

| The moment needs | Use | Measured size (gzip) | Not this |
|---|---|---|---|
| A forward-only spring (a hand moving, a card landing) | `--ease-spring` from `moments.js` (CSS `linear()` sampled from a spring) | 0 extra | Motion |
| A gesture that keeps velocity, interruption mid-flight, drag to dismiss | Motion `animate()` with `type: "spring"` and the release velocity (motion.dev); or hand-written per design-motion expert move 1 | Motion full bundle 28KB (`motion@12.23.12/dist/motion.js`) | CSS transitions (cannot take a velocity) |
| A list or grid that re-lays out (filter, sort, reorder) without jumping | FLIP by hand (measure, invert, play on `--ease-standard`), or Motion `layout` in React | 0, or Motion | Animating `top`/`height` (fundamental 9) |
| Geography or global reach in the data | cobe (WebGL globe, markers from your data) | 3.8KB plus phenomenon 1.9KB = about 6KB | three.js |
| A 3D product the buyer holds or stands in (hardware, a space) | three.js with a compressed glTF, or a pre-rendered video with a poster | 171KB (`three@0.170.0` module, minified) plus the model | three.js for a flat UI mock-up |
| An illustrated character or object with states driven by input (a mascot reacting, an empty state that responds) | Rive state machine from a designer's `.riv` | canvas 55KB plus 481KB wasm; canvas-lite 47KB plus 199KB wasm | Rive for UI chrome or text |
| A launch film for social or a page hero video | Remotion, rendered to MP4 with a poster; the page plays the file (`<video muted playsinline>` with controls past 5s) | the video file | Live WebGL for something that never reacts |

## 3. Patterns

**Lazy import with a poster (every depth use).**
```html
<figure class="globe" data-depth="cobe">
  <img src="globe-still.webp" alt="" width="560" height="560" class="globe-poster">
  <canvas width="560" height="560" aria-hidden="true"></canvas>
  <figcaption>Payouts land in 47 countries; the busiest today: Lagos, São Paulo, Manila.</figcaption>
</figure>
<script type="module">
const fig = document.querySelector('[data-depth="cobe"]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) new IntersectionObserver(async ([e], io) => {
  if (!e.isIntersecting) return; io.disconnect();
  const { default: createGlobe } = await import('https://cdn.jsdelivr.net/npm/cobe@0.6.4/+esm');
  const canvas = fig.querySelector('canvas'); let phi = 0, running = true;
  const globe = createGlobe(canvas, { devicePixelRatio: Math.min(2, devicePixelRatio), width: 1120, height: 1120,
    phi: 0, theta: 0.25, dark: 0, diffuse: 1.2, mapSamples: 12000, mapBrightness: 6,
    baseColor: [1, 1, 1], markerColor: [0.12, 0.37, 0.82], glowColor: [1, 1, 1],
    markers: [{ location: [6.52, 3.38], size: 0.06 }, { location: [-23.55, -46.63], size: 0.05 }],
    onRender: (s) => { if (running) s.phi = phi += 0.003; } });
  fig.classList.add('is-live');                       // CSS fades the poster out at --duration-fast
  new IntersectionObserver(([v]) => { running = v.isIntersecting; }).observe(fig);
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });
}, { rootMargin: '100% 0px' }).observe(fig);
</script>
```

**Velocity spring with Motion (a draggable card that is thrown).**
```js
const { animate } = await import('https://cdn.jsdelivr.net/npm/motion@12.23.12/+esm');
// on release, with v in px/s measured over the last 3 pointer events:
animate(card, { x: target }, { type: 'spring', stiffness: 700, damping: 48, velocity: v });
```
Default UI spring: stiffness 700, damping 48 (design-motion section 6). Under reduce, set the end position with no animation.

**FLIP for a reorder (no library).** Read every item's box, change the DOM, read again, set `transform: translate(dx, dy)` with no transition, then on the next frame transition `transform` to `none` on `--duration-slow` `--ease-standard`. Under reduce, skip the invert step.

**Rive.** Load `@rive-app/canvas-lite` only for a `.riv` made by a designer; drive inputs from real state (`stateMachineInputs`), `autoplay: false` under reduce and draw the state machine's resting state; call `rive.pause()` off screen.

## 4. Checks

- `motion-plan-check.mjs` (`depth`): fails a render-blocking `<script src>` for motion, three, cobe, @rive-app, gsap or lottie in the head (no `defer`, `async` or `type="module"`), and any `<canvas>` whose pixels change between two element screenshots 700ms apart under reduced motion.
- The blind gate judges the moment as it plays; a globe that spins without telling the viewer anything will not be the moment a critic remembers.

## 5. Myths

| Myth | Correction |
|---|---|
| A 3D hero makes the page premium | Apple's MacBook Air page runs 50 animations and carries the product with video and photography (`kb/teardowns/motion-imagery.md`). Depth is for products that are physical or data that is spatial |
| Springs need a library | A forward-only spring is a curve: sample it into CSS `linear()` (Framer ships these, measured). A library earns its bytes only for velocity and interruption |
| Reduced motion means slow the loop down | It means the still. A slower globe is still a moving globe |
