# 06 Implementation: CSS, Web Animations, Motion, Lottie

## Pick the tool
| Need | Tool | Why |
|---|---|---|
| State changes (hover, open, selected) | CSS transitions | Interruptible: a transition retargets from the current value; keyframes restart (Kowalski) |
| Enter and exit of popovers, dialogs, `display: none` elements, no JS | CSS transitions plus `@starting-style` and `transition-behavior: allow-discrete` | Baseline since Aug 2024 (MDN) |
| Looping or multi-step decorative motion | CSS `@keyframes` | Declarative, compositor-friendly |
| Imperative control (reverse, pause, sequence, read progress) without a framework | Web Animations API (`element.animate`) | Same engine as CSS, promise-based (MDN) |
| React: enter and exit of conditional elements, shared layout, gestures, springs with velocity | Motion (formerly Framer Motion) | `AnimatePresence`, `layout`, `layoutId`, drag (motion.dev) |
| Route and page transitions | View Transitions API | Native snapshotting; same-document Baseline Oct 2025 (web.dev) |
| Scroll-linked progress and reveals | CSS scroll-driven animations | Off main thread for transform and opacity; progressive enhancement (Chrome docs) |
| Illustrative, brand or character animation designed in After Effects | Lottie (prefer dotLottie) | Vector, small, designer-authored |
| Interactive illustration with states and inputs | Rive or dotLottie state machines | Lottie JSON alone has no state logic (opinion) |

Never use Lottie or a JS library for something CSS does (a fade, a press, a chevron). Bundle and main-thread cost for zero gain.

## CSS
```css
/* Tokens: design-kb foundation */
:root {
  --duration-instant: 100ms; --duration-fast: 150ms; --duration-base: 200ms;
  --duration-slow: 300ms; --duration-page: 400ms;
  --easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --easing-enter: cubic-bezier(0, 0, 0, 1);
  --easing-exit: cubic-bezier(0.3, 0, 1, 1);
}

/* Color feedback is low risk (Val Head), so it stays on under reduced motion */
.button { transition: background-color var(--duration-instant) var(--easing-standard); }
@media (hover: hover) and (pointer: fine) {
  .button:hover { background-color: var(--color-primary-hover); }
}
/* No-motion-first: movement only when allowed */
@media (prefers-reduced-motion: no-preference) {
  .button {
    transition:
      background-color var(--duration-instant) var(--easing-standard),
      transform var(--duration-instant) var(--easing-standard);
  }
  .button:active { transform: scale(0.97); }
}
```
Note: `--color-primary-hover` is illustrative; color tokens come from design-color.

**Dialog enter and exit with no JS animation code**
```css
/* Base: a crossfade, which is also the reduced-motion behavior */
dialog {
  opacity: 0;
  transition:
    opacity var(--duration-fast) var(--easing-standard),
    display var(--duration-fast) allow-discrete,
    overlay var(--duration-fast) allow-discrete;
}
dialog[open] { opacity: 1; transition-duration: var(--duration-base); }
@starting-style { dialog[open] { opacity: 0; } } /* after [open]: same specificity */

/* Movement only when allowed */
@media (prefers-reduced-motion: no-preference) {
  dialog {
    transform: scale(0.97);
    transition:
      opacity var(--duration-fast) var(--easing-standard),
      transform var(--duration-fast) var(--easing-standard),
      display var(--duration-fast) allow-discrete,
      overlay var(--duration-fast) allow-discrete;
  }
  dialog[open] {
    transform: scale(1);
    transition-duration: var(--duration-base);
    transition-timing-function: var(--easing-enter);
  }
  @starting-style { dialog[open] { transform: scale(0.95); } }
}

dialog::backdrop {
  background-color: rgb(0 0 0 / 0);
  transition:
    background-color var(--duration-fast) var(--easing-standard),
    display var(--duration-fast) allow-discrete,
    overlay var(--duration-fast) allow-discrete;
}
dialog[open]::backdrop { background-color: rgb(0 0 0 / 0.4); transition-duration: var(--duration-base); }
@starting-style { dialog[open]::backdrop { background-color: rgb(0 0 0 / 0); } }
```
How it works: opening uses the transition declared on `dialog[open]` (the after-change style), so enter runs at `--duration-base`; closing uses the plain `dialog` rule, so exit runs at the shorter `--duration-fast`. Each `transition` shorthand lists every property with its own `allow-discrete`, because overriding only `transition-property` would re-map the behavior list onto the wrong properties. The scrim color is illustrative; it belongs to design-color. Test that `display` and `overlay` really stay through the exit in each target browser (MDN marks the pattern Baseline 2024).

**Accordion height**
```css
.panel { display: grid; grid-template-rows: 0fr; }
.panel[data-open] { grid-template-rows: 1fr; }
.panel > .inner { overflow: hidden; }
@media (prefers-reduced-motion: no-preference) {
  .panel { transition: grid-template-rows var(--duration-base) var(--easing-standard); }
}
```
This animates layout, so keep it to one panel at a time and small content. Where supported, `interpolate-size: allow-keywords` with `height: auto` is the native alternative (MDN: not Baseline).

**Scroll reveal, progressive**
```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 30%;
    }
  }
}
@keyframes reveal { from { opacity: 0; transform: translateY(12px); } }
```
`linear` is correct here: the scroll position is the clock, so easing would fight the person's own scroll speed (opinion).

## Web Animations API
```js
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const anim = panel.animate(
  reduce ? [{ opacity: 0 }, { opacity: 1 }]
         : [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
  { duration: 200, easing: 'cubic-bezier(0, 0, 0, 1)' } // --duration-base, --easing-enter
);
await anim.finished;
anim.commitStyles(); // write final values, then drop the animation
anim.cancel();
```
- WAAPI default easing is `linear` (MDN): always pass one.
- Read tokens from CSS with `getComputedStyle(document.documentElement).getPropertyValue('--duration-base')` so JS and CSS never drift (opinion).
- `anim.reverse()` on an in-flight animation gives an interruptible toggle without restarting.
- `document.getAnimations()` lets a test or debug panel slow everything down with `updatePlaybackRate`.

## View Transitions
```js
function navigate(update) {
  if (!document.startViewTransition) return update();
  document.startViewTransition(update);
}
```
```css
@view-transition { navigation: auto; } /* MPA, both pages */
::view-transition-old(root), ::view-transition-new(root) {
  animation-duration: var(--duration-base);
  animation-timing-function: var(--easing-standard);
}
.product-hero { view-transition-name: product-hero; }
::view-transition-group(product-hero) {
  animation-duration: var(--duration-slow);
  animation-timing-function: var(--easing-standard);
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) {
    animation-duration: var(--duration-fast);
  }
  .product-hero { view-transition-name: none; }
}
```
- Give a `view-transition-name` to one element per navigation; names must be unique at capture time. For lists, set the name on the clicked item only, just before the transition (opinion; avoids duplicate-name failures).
- The update callback blocks rendering until it resolves; keep it fast or the page appears frozen (MDN describes the snapshot model; opinion on impact).

## Motion (React)
```jsx
import { MotionConfig, AnimatePresence, motion } from "motion/react";

const spatial = { type: "spring", stiffness: 700, damping: 48, mass: 1 }; // M3 default spatial
const effects = { duration: 0.2, ease: [0.2, 0, 0, 1] };                  // --duration-base, --easing-standard

<MotionConfig reducedMotion="user">
  <AnimatePresence>
    {open && (
      <motion.div
        key="panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, transition: { scale: spatial, opacity: effects } }}
        exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.15, ease: [0.2, 0, 0, 1] } }}
        style={{ transformOrigin: "var(--radix-popover-content-transform-origin)" }}
      />
    )}
  </AnimatePresence>
</MotionConfig>
```
- `reducedMotion="user"` disables transform and layout animation and keeps opacity and color (motion.dev): the reduced path is automatic for this component.
- Shared element: same `layoutId` on the card and the expanded view; use `layout="position"` for text or images whose aspect ratio changes; set `borderRadius` through `style` so Motion corrects scale distortion (motion.dev).
- Wrap siblings that affect each other's layout in `LayoutGroup`.
- Motion values (`useMotionValue`, `useTransform`) update outside React render; use them for drag and scroll-linked values to avoid re-rendering every frame (motion.dev).
- Split spatial and effects transitions per property as above: springs for transform, tween or ratio-1 spring for opacity (Material 3 rule).

## Lottie
- Format: ship `.lottie` (dotLottie) with the dotLottie web player when possible; LottieFiles claims files "often up to 80% smaller" than JSON (vendor claim) and supports themes (light and dark) and state machines.
- Renderer: SVG for crisp, small, few-node animations; canvas for many nodes or many instances; test both (lottie-web README lists svg, canvas, html).
- Authoring rules (lottie-web README): convert images and Illustrator layers to shapes; avoid huge shapes used as small masks; avoid inverted masks (large cost); fewer nodes is faster. Opinion: avoid mattes and effects with no Lottie equivalent; keep UI icons under about 30 KB and illustrations under about 150 KB before compression.
- Load lazily, pause with IntersectionObserver when off-screen, and never autoplay a loop beside reading content longer than 5 s without a control (WCAG 2.2.2).
- Reduced motion: do not play; jump to the most meaningful frame (`goToAndStop(frame, true)` in lottie-web) and expose a play button if the animation teaches something.
- Accessibility: the container gets `role="img"` and an `aria-label` describing the meaning, or `aria-hidden="true"` if purely decorative.
- Timing still follows the tokens: a Lottie success check inside a button plays in `--duration-base` to `--duration-slow`, not 2 s.

## Hand-offs
- design-frontend owns bundling (Motion and Lottie players are real bundle cost), SSR, and CI testing of reduced motion.
- design-graphic owns Lottie illustration art direction.
- design-color owns scrim and state colors referenced here.
