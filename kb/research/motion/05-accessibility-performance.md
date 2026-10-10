# Research: 05 Reduced motion, accessibility and performance

Status key: C = consensus, P = practitioner opinion, S = single source.

## Accessibility
| Claim | Source | Status |
|---|---|---|
| WCAG 2.2.2 Pause, Stop, Hide (Level A): moving, blinking or scrolling content that starts automatically, lasts more than 5 s and runs in parallel with other content needs a pause, stop or hide mechanism. Spinners are not automatically exempt; a preloader that is the only content is. | W3C Understanding 2.2.2 | C |
| WCAG 2.3.1 Three Flashes (Level A): no more than three general or red flashes in any 1 s unless below the area threshold (about 341 x 256 CSS px, 87,296 px total). | W3C Understanding 2.3.1 | C |
| WCAG 2.3.3 Animation from Interactions (AAA): interaction-triggered motion can be disabled unless essential. Erratum: opacity, color and blur are no longer excluded from "motion animation". Techniques C39 (CSS) and SCR40 (JS). | W3C Understanding 2.3.3 | C |
| Apple reduced motion criteria: depth simulation (parallax, animated blur, depth of field), multi-axis, multi-speed, spinning, vortex, scaling and peripheral motion must be disabled or changed. Meaningful motion should be replaced with "a dissolve, highlight fade, or color shift", not removed. Ongoing motion and auto carousels: stop or offer a control. | App Store Connect, Reduced Motion evaluation criteria | C |
| Triggers: large-area motion, parallax, scroll-jacking, direction mismatch, fast travel through virtual space, uncontrollable loops. Low risk: small elements, opacity, color. | Val Head, A List Apart | C |
| Reduce parallax and smooth scrolling; swap the animated property (transform to opacity) keeping timing; show the most meaningful static frame; use `picture` with a reduced-motion source for GIFs; in-site toggle for motion-heavy sites, seeded from the OS and persisted. Only `reduce` is a reliable signal. | Val Head, Smashing Magazine, Designing With Reduced Motion For Motion Sensitivities (2020) | C |
| No-motion-first: put transitions inside `@media (prefers-reduced-motion: no-preference)`; avoid global resets that kill all animation, since not all animation is motion; SSR hooks should default to reduced. | Josh W. Comeau | P (widely adopted) |
| `prefers-reduced-motion` Baseline widely available since Jan 2020; OS paths for Windows, macOS, iOS, Android. | MDN | C |
| Motion: `MotionConfig reducedMotion="user"` disables transform and layout animations, keeps opacity and backgroundColor; `useReducedMotion()` hook. | motion.dev accessibility | C |

## Performance
| Claim | Source | Status |
|---|---|---|
| Animate `transform` and `opacity`; in the test, top/left dropped 50 percent of frames, transform 1 percent. | web.dev Animations guide | C |
| `will-change` sparingly, only for a measured problem; apply just before and remove after. | web.dev | C |
| Blurs and shadows cost more to paint. | web.dev | C |
| CSS and WAAPI animations of compositor properties stay smooth under main-thread load; requestAnimationFrame-driven JS animation can lag. | Kowalski, Great Animations | P (consistent with web.dev rendering model) |
| Motion layout animations use FLIP (measure, then transform); border changes break it. | motion.dev layout docs | C |
| Chromium excludes opacity 0 elements from LCP candidates, so fade-in heroes can delay LCP. | web.dev LCP | C |
| INP good at or below 200 ms. | web.dev INP | C |

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://developer.apple.com/help/app-store-connect/manage-app-accessibility/reduced-motion-evaluation-criteria
- https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/
- https://www.smashingmagazine.com/2020/09/design-reduced-motion-sensitivities
- https://www.joshwcomeau.com/react/prefers-reduced-motion/
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- https://motion.dev/docs/react-accessibility
- https://web.dev/articles/animations-guide
- https://web.dev/articles/lcp
- https://web.dev/articles/inp

## Quotes added by the critic's spot check (2026-10-10)
- WCAG 2.3.1: "Web pages do not contain anything that flashes more than three times in any one second period"; "the combined area of flashing becomes 341 x 256 CSS pixels, or a flashing area of 87,296 CSS pixels." https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html
- v0.1 claims not listed here still lack a quote (open item).
