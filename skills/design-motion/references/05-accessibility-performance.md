# 05 Reduced motion, accessibility and performance

Cross-cutting accessibility floor: design-foundations `references/accessibility.md`. This file keeps the motion-specific part.

## Principles
1. Reduce means replace, not remove. Motion that carries meaning becomes "a dissolve, highlight fade, or color shift"; decorative motion stops (Apple reduced motion criteria; Val Head). The state a motion leads to is never removed: only the transition goes (benchmark round 2, `kb/reviews/benchmark-round2-landing.md` item 15c).
2. The risk is in how much of the visual field moves and in what way: scaling, spinning, multi-speed layers (parallax), large-area wipes and fast travel through depth are the triggers; small opacity and color changes are low risk (Val Head, A List Apart; Apple).
3. Only `transform` and `opacity` are cheap. Everything else costs layout or paint on every frame (web.dev).
4. Smoothness is judged on a mid-range phone with the main thread busy, not on the designer's laptop (opinion).

## Legal and standards floor
| Rule | Level | What it means in practice |
|---|---|---|
| WCAG 2.2.2 Pause, Stop, Hide | A | Anything that starts on its own, runs more than 5 s and sits beside other content (carousels, marquees, looping video, animated backgrounds, long loaders next to usable content) needs a visible pause or stop control. |
| WCAG 2.3.1 Three Flashes | A | Never more than 3 flashes per second, including red flashes, unless the flashing area is below about 341 x 256 CSS px total. Strobing success effects and glitch transitions fail. |
| WCAG 2.3.3 Animation from Interactions | AAA | Interaction-triggered motion can be turned off unless essential. Since the erratum, blur, opacity and color changes can also count as motion. Treat this as the house standard even when only AA is contracted, because `prefers-reduced-motion` makes it nearly free. |
| Foundation contract | house | Always honor `prefers-reduced-motion`. |

## Reduced motion matrix
| Motion type | Under `prefers-reduced-motion: reduce` |
|---|---|
| Parallax, scroll-linked transforms, scroll-jacking, smooth scroll | Remove. Use default anchor jumps (`scroll-behavior: smooth` only inside `no-preference`). |
| Page or view slides, zooms, container transforms | Replace with a crossfade at `--duration-fast`. |
| Popover or dialog scale plus fade | Keep the fade, drop the scale. Same tokens. |
| Disclosure icon, tab indicator, selection mark, toggle thumb | Keep the end state (icon rotated or swapped, indicator under the selected tab, thumb at the "on" end); remove only the transition. Never `transform: none !important` on an element whose transform is its state. |
| Product scene (scripted mock-up) | The still frame: the final, most informative state, rendered in place; nothing animates inside; the pause button is hidden (`assets/scene.js` does this). |
| Masked text rise, text blur-in, block reveal | Text and blocks in place at first paint; no fade over 150 ms. |
| Hover color, focus ring, button color change | Keep. |
| Button press scale | Drop the scale; keep color feedback. |
| Spinners and progress | The state stays, the rotation stops (FOUNDATIONS: nothing rotates under reduce; the lint fails it): a static icon plus "Loading" text, or a determinate bar that updates in steps without animating. |
| Skeleton shimmer | Static skeleton. |
| Autoplay video, GIF, Lottie, marquee | Do not autoplay. Show the most meaningful still frame (not necessarily the first) with a play control (`picture` with a reduced-motion source for GIFs). |
| Celebration, confetti, bounce | Replace with a static badge, color change and text; haptic on native. |
| Error shake | Remove; the message and color already carry the meaning. |

**Patterns**
- No-motion-first CSS (Comeau): write the static state, then add movement inside `@media (prefers-reduced-motion: no-preference) { ... }`. Browsers that do not support the query get no motion.
- Do not make the global `*, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important }` reset your whole strategy. It uses 0.01 ms rather than `none` so `transitionend` and `animationend` still fire, which is good, but it also deletes meaningful crossfades that people who reduce motion still benefit from (Comeau: "Not all animations include motion"). A scoped reset for decorative layers is fine.
- SSR apps: a reduced-motion hook should start as `true` on the server and flip after hydration, so first paint never animates for someone who asked for less motion (Comeau).
- Motion library: wrap the app in `<MotionConfig reducedMotion="user">`; transforms and layout animations turn off while opacity and color still animate (motion.dev). Use `useReducedMotion()` for custom values such as parallax offsets.
- Only `reduce` is a reliable signal; `no-preference` is not consent to heavy motion (Val Head, Smashing).
- Motion-heavy storytelling sites: add a visible site toggle, seeded from the OS setting and stored per visitor (Val Head, Smashing; Apple says in-app settings should mirror the system one).
- Native apps: SwiftUI `@Environment(\.accessibilityReduceMotion)`, UIKit `UIAccessibility.isReduceMotionEnabled` (Apple); Android's "Remove animations" sets the system animator duration scale to 0, so platform animators already respect it but custom loops must check it (opinion on the custom-loop risk).
- Test: Chrome DevTools Rendering panel, "Emulate CSS media feature prefers-reduced-motion"; OS settings: macOS Accessibility > Display (or Motion) > Reduce motion, iOS Accessibility > Motion, Windows 11 Accessibility > Visual effects > Animation effects, Android Accessibility > Remove animations (MDN).

## Performance rules
- Animate `transform` (translate, scale, rotate) and `opacity`. In web.dev's test, animating top/left dropped 50 percent of frames versus 1 percent for transform.
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding` or `border-width`. Use transform, or FLIP (measure, invert with transform, play), which is how Motion's `layout` works (motion.dev).
- Height of unknown content: `display: grid; grid-template-rows: 0fr` to `1fr` (works across modern browsers; opinion on preference), or `interpolate-size: allow-keywords` where supported (Chromium only, not Baseline: MDN). Progressive enhancement only.
- Shadows: put the larger shadow on a pseudo-element and animate its `opacity`, instead of animating `box-shadow` (paint cost; web.dev notes shadows are expensive to paint).
- Blur: `filter: blur()` and `backdrop-filter` are paint-heavy; animate blur only on text blocks as they enter, at 10 px or less (Linear's text blur-in uses 10 px, `kb/teardowns/motion-imagery.md`; Kowalski's outer limit is 20 px), never under reduced motion. `motion-audit.mjs` fails animated blur above 10 px.
- `will-change`: only after measuring a problem, applied just before the animation and removed after (web.dev). Never in a global stylesheet on many elements.
- Prefer CSS transitions, CSS animations and WAAPI for compositor properties; they keep running smoothly when the main thread is busy. JS loops driven by `requestAnimationFrame` stall when the main thread stalls (Kowalski; web.dev rendering model).
- Responsiveness: keep animation setup off the critical path of an interaction so INP stays at or below 200 ms (web.dev).
- LCP: never start the LCP element at opacity 0 (Chromium excludes it from LCP candidates; web.dev).
- Pause what is off-screen: IntersectionObserver to pause Lottie, canvas, video and scene loops out of view (`assets/scene.js` does it for scenes); `content-visibility` or `animation-play-state: paused` for CSS loops (opinion; standard technique).
- Measure: DevTools Performance panel with 4x CPU throttling, Animations panel to slow playback to 10 to 25 percent, and the frame rendering stats. Review recordings frame by frame, and again the next day with fresh eyes (Kowalski).

## Do and don't
- Do: crossfade between views under reduced motion. Don't: remove the transition so content pops with no cue that the view changed.
- Do: pause the hero video under reduced motion and show the poster frame. Don't: autoplay a full-bleed looping video with no pause control.
- Do: animate a pseudo-element's opacity to deepen a card shadow on hover. Don't: transition `box-shadow` across a grid of 60 cards.

## Audit order
Fix in this order: (1) WCAG Level A failures (2.2.2 pause controls, 2.3.1 flashes); (2) vestibular triggers (scroll-jacking, parallax, large-area zooms and wipes); (3) the reduced-motion path for everything else; (4) first paint and LCP (fade-ins above the fold); (5) layout and paint cost (non-compositor properties, shadows, blur); (6) taste (durations, curves, stagger). Opinion on order: harm before speed before polish.

## Worked examples
1. **Audit: SaaS landing page with parallax hero, autoplay background video, logo marquee, scroll reveals.** Fixes in order: (a) the hero headline fades from opacity 0, so LCP is delayed: show it at first paint; (b) video autoplays and loops beside content: add a pause control (2.2.2), and under reduced motion show the poster; (c) parallax: remove under reduced motion, cap offset otherwise; (d) marquee: pause control and pause on hover and focus; (e) reveals: only below the fold, guarded by `@supports`, removed under reduced motion; (f) `box-shadow` hover transitions on 24 cards: switch to pseudo-element opacity.
2. **Dashboard with a live-updating chart.** Data updates animate bars at `--duration-base` only when the person changes a filter (feedback); background polling updates swap values instantly so the chart is not in constant motion beside the content (2.2.2 logic).

## Hand-offs
- design-frontend owns performance budgets, CI checks and testing; design-search owns Core Web Vitals reporting.
- design-ux owns where a motion toggle lives in settings.
