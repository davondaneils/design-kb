# Research: 06 Implementation

Status key: C = consensus, P = practitioner opinion, S = single source or vendor claim.

| Claim | Source | Status |
|---|---|---|
| CSS transitions can be interrupted and retarget from the current value ("A CSS transition can be interrupted and smoothly transition to a new value, even before the first transition has finished."). Keyframe animations restart: not in this source; it follows from how CSS animations start (a new animation runs from its first keyframe). Prefer transitions for interactive state. | Kowalski, Great Animations (re-fetched 2026-10-10) for transitions; derived for keyframes | P (transitions); derived (keyframes) |
| `@starting-style` gives transitions a from-state on first render or when leaving display:none; with `allow-discrete` on `display` and `overlay` it animates popover and dialog enter and exit. Baseline 2024 (Aug 2024). `@starting-style` must come after the open-state rule (same specificity). | MDN @starting-style | C |
| `interpolate-size: allow-keywords` enables height:auto transitions; not Baseline, limited availability. | MDN | C |
| WAAPI: `el.animate(keyframes, {duration, easing, fill, iterations, composite})`; easing default linear; `finished` promise; `reverse()`, `updatePlaybackRate()`; prefer `commitStyles()` then `cancel()` over permanent `fill: forwards`. | MDN Using the Web Animations API | C |
| View Transitions API: `document.startViewTransition(update)`; `view-transition-name`; `::view-transition-old/new/group`; `view-transition-class`; types; cross-document via `@view-transition`. | MDN | C |
| Motion: tween default 0.3 s; springs with `visualDuration` and `bounce`; `layout`, `layoutId`, `layout="position"`, `LayoutGroup`, `AnimatePresence`; scale correction for borderRadius and boxShadow when set via style. | motion.dev | C |
| lottie-web renderers: svg, canvas, html; lean After Effects projects; too many nodes slow it; inverted masks have a large cost; convert images and AI layers to shapes. | airbnb/lottie-web README | C |
| dotLottie: zipped container "often up to 80% smaller" than JSON; themes, multiple animations, state machines; dotLottie player built on ThorVG. | LottieFiles docs | S (vendor claim) |
| Jake Archibald's linear() easing generator (linked from MDN as "linear() easing generator by Jake Archibald") turns a curve, such as a spring, into a CSS `linear()` value. | MDN linear() | C (tool exists); derived (springs) |

## Sources
- https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size
- https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- https://motion.dev/docs/react-transitions
- https://motion.dev/docs/react-layout-animations
- https://motion.dev/docs/react-accessibility
- https://github.com/airbnb/lottie-web
- https://docs.lottiefiles.com/en/format/dotlottie/why-dotlottie
- https://linear-easing-generator.netlify.app/

## Quotes added by the critic's spot check (2026-10-10)
- MDN @starting-style: "CSS transitions are by default not triggered on an element's initial style update, or when its display type changes from none to another value."; "Since August 2024, this feature works across the latest devices and browser versions." https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- LottieFiles: "often up to 80% smaller than equivalent JSONs" (vendor claim). https://docs.lottiefiles.com/en/format/dotlottie/why-dotlottie
- v0.1 claims not listed here still lack a quote (open item).
