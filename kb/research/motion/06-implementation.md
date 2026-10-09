# Research: 06 Implementation

Status key: C = consensus, P = practitioner opinion, S = single source or vendor claim.

| Claim | Source | Status |
|---|---|---|
| CSS transitions can be interrupted and retarget from the current value; keyframe animations restart. Prefer transitions for interactive state. | Kowalski, Great Animations | P (matches CSS Transitions behavior) |
| `@starting-style` gives transitions a from-state on first render or when leaving display:none; with `allow-discrete` on `display` and `overlay` it animates popover and dialog enter and exit. Baseline 2024 (Aug 2024). `@starting-style` must come after the open-state rule (same specificity). | MDN @starting-style | C |
| `interpolate-size: allow-keywords` enables height:auto transitions; not Baseline, limited availability. | MDN | C |
| WAAPI: `el.animate(keyframes, {duration, easing, fill, iterations, composite})`; easing default linear; `finished` promise; `reverse()`, `updatePlaybackRate()`; prefer `commitStyles()` then `cancel()` over permanent `fill: forwards`. | MDN Using the Web Animations API | C |
| View Transitions API: `document.startViewTransition(update)`; `view-transition-name`; `::view-transition-old/new/group`; `view-transition-class`; types; cross-document via `@view-transition`. | MDN | C |
| Motion: tween default 0.3 s; springs with `visualDuration` and `bounce`; `layout`, `layoutId`, `layout="position"`, `LayoutGroup`, `AnimatePresence`; scale correction for borderRadius and boxShadow when set via style. | motion.dev | C |
| lottie-web renderers: svg, canvas, html; lean After Effects projects; too many nodes slow it; inverted masks have a large cost; convert images and AI layers to shapes. | airbnb/lottie-web README | C |
| dotLottie: zipped container "often up to 80% smaller" than JSON; themes, multiple animations, state machines; dotLottie player built on ThorVG. | LottieFiles docs | S (vendor claim) |
| Jake Archibald's linear() easing generator converts springs to CSS. | MDN linear() | C |

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
