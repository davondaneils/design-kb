# Tests: design-motion v0.1

Method: each brief answered twice, once as a strong generic assistant would (no skill), once following SKILL.md and the references. Answers are condensed to the decisions that matter. Scored 0 to 10 per criterion. The fundamentals gate is pass or fail and is checked first; a gate fail caps the total at 50 percent (30 of 60) and means the answer is not shippable regardless of score.

Rubric (from the skill's own rules): G = fundamentals gate (purpose, frequency, tokens, curves, reduced motion, WCAG floor, compositor only, first paint); C = correctness of numbers and code; S = specificity (buildable without guessing); A = accessibility; P = performance; X = expert depth (non-obvious moves); F = fit to brief.

---

## Brief 1: Onboarding and first-success motion for a calm fintech app (web and iOS)
"Three onboarding screens, a card-linking step, and a 'first payment sent' moment. Brand is calm and trustworthy. Give me a motion spec."

### Generic answer (condensed)
Screens slide horizontally with 300 ms ease-in-out; illustrations are Lottie files that autoplay and loop; card linking shows a spinner; success screen plays confetti for 2 s with a bounce on the checkmark; "respect prefers-reduced-motion by disabling animations"; use Framer Motion with default springs.

### With-skill answer (condensed)
- Jobs: onboarding slides = spatial orientation (shared axis X); illustrations = signifier, rare, expressive budget allowed once; linking wait = state change; success = feedback, rare.
- Onboarding: shared axis X, outgoing and incoming slide 30 px with fade, `--duration-slow` (300 ms), `--easing-standard`; swipe tracks 1:1 and commits on release by velocity (above about 0.11 px/ms) or 40 percent distance; spring on release `{stiffness: 700, damping: 48}`. No auto-advance (2.2.2); if added, pause control.
- Illustrations: dotLottie, play once on screen entry (not loop), lazy loaded, paused off-screen, `role="img"` with label. Reduced motion: most meaningful still frame.
- Card linking: no loader for the first 400 ms, then a skeleton of the linked-card row; over 10 s, step progress ("Verifying with your bank, step 2 of 3").
- First payment sent: checkmark stroke draw at `--duration-base`, amount uses `tabular-nums`, one soft scale 0.95 to 1 on the receipt card with ratio-1 spring (calm brand: no bounce, no confetti), haptic success on iOS, `role="status"` announcement. Never repeated for later payments beyond a 150 ms check.
- Reduced motion: crossfades at `--duration-fast` replace slides; still frames; no scale; haptics and text remain.
- iOS: same values via SwiftUI `.spring(response:dampingFraction:)` gated by `accessibilityReduceMotion`.

### Scores
| | G | C | S | A | P | X | F | Total /60 |
|---|---|---|---|---|---|---|---|---|
| Generic | Fail (looping autoplay beside content with no control; blanket disable deletes meaning; confetti and bounce off-brand) | 5 | 4 | 3 | 5 | 2 | 4 | 23, cap 30 does not bind: **23** |
| With skill | Pass | 9 | 9 | 9 | 9 | 9 | 9 | **54, gate pass** |

Gap found: the skill gave no native API mapping for springs (SwiftUI, Compose). Sent back; fixed in `references/02` (native mapping section).

---

## Brief 2: Product grid to product detail plus add to cart (Next.js storefront)
"Make browsing feel premium: tapping a product should flow into its page, and add to cart should feel satisfying."

### Generic answer (condensed)
Wrap pages in Framer Motion `AnimatePresence` with a page fade and slide-up of 20 px over 500 ms; product image uses `layoutId`; on add to cart, animate a flying image into the cart icon and bounce the badge; fade in product page sections on mount with stagger 100 ms.

### With-skill answer (condensed)
- Pattern: container transform. View Transitions API with feature check; root crossfade at `--duration-base`; only the clicked card's image gets `view-transition-name: product-hero` just before navigation (unique-name rule); group animates at `--duration-slow`, `--easing-standard`. Back reverses through the same name. Reduced motion: name removed, root crossfade at `--duration-fast`.
- Product page: hero image and title visible at first paint (LCP rule); no mount stagger; below-fold sections reveal once via `view()` timeline inside `@supports`.
- Add to cart: press scale 0.97 at `--duration-instant`; label crossfades to "Added" with icon swap (scale 0.8 to 1, blur 2 px to 0, `--duration-fast`); badge count rolls with `tabular-nums` and scales 1 to 1.15 to 1 once; double-tap guard; `role="status"` "Added to cart, 3 items"; returns to idle after 2 s. No flying image (frequency: shoppers add many items; meaning already carried by badge).
- Performance: only transform and opacity; card hover shadow via pseudo-element opacity, hover gated to fine pointers.

### Scores
| | G | C | S | A | P | X | F | Total /60 |
|---|---|---|---|---|---|---|---|---|
| Generic | Fail (500 ms page transition on a repeated action; mount fade hurts LCP; no reduced-motion path; stagger 100 ms) | 5 | 5 | 2 | 4 | 4 | 5 | 25, cap 30 does not bind: **25** |
| With skill | Pass | 9 | 10 | 9 | 9 | 9 | 9 | **55, gate pass** |

Gap found: none blocking. Minor: skill did not say how View Transitions interact with Next.js app router navigation. Logged for design-frontend hand-off; out of scope here.

---

## Brief 3: "Our SaaS landing page feels janky and someone complained it made them dizzy. Fix the motion."
Page has: parallax hero, headline that fades and slides up on load, autoplaying looping background video, auto-rotating testimonial carousel every 4 s, 24 feature cards with `box-shadow` hover transitions, smooth scroll, scroll-jacked "pinned" product tour.

### Generic answer (condensed)
Add `@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important } }`; add `will-change: transform` to animated elements; slow the carousel to 6 s; reduce parallax intensity.

### With-skill answer (condensed)
Ordered by severity:
1. Scroll-jacked tour: remove scroll-jacking; let the tour scroll natively with sticky sections and scroll-driven progress (`linear`, `@supports` guarded). Highly likely vestibular trigger (Val Head).
2. Carousel: auto-rotation beside content over 5 s needs pause (2.2.2, Level A); better: no auto-rotation, manual controls; under reduced motion static.
3. Background video: pause control (2.2.2); reduced motion shows poster frame; pause off-screen.
4. Parallax: removed under reduced motion; otherwise background offset under 20 percent of scroll distance.
5. Headline fade-in: remove; opacity 0 start excludes it from LCP in Chromium and delays the page's LCP.
6. Card shadows: replace `box-shadow` transitions with pseudo-element opacity; hover gated to `(hover: hover) and (pointer: fine)`.
7. Smooth scroll: only inside `no-preference`.
8. Do not use the blanket `animation: none` reset (kills meaningful crossfades and focus feedback); write a per-element reduced-motion matrix. Do not sprinkle `will-change`; measure with 4x CPU throttle first.
9. Add a visible site motion toggle seeded from the OS setting, since the page is motion-heavy.

### Scores
| | G | C | S | A | P | X | F | Total /60 |
|---|---|---|---|---|---|---|---|---|
| Generic | Fail (carousel still violates 2.2.2; scroll-jacking kept; will-change everywhere) | 4 | 4 | 4 | 3 | 2 | 5 | 22, cap 30 does not bind: **22** |
| With skill | Pass | 9 | 9 | 10 | 9 | 9 | 10 | **56, gate pass** |

Gap found: skill lacked an explicit ordering of audit fixes by severity. Fixed: `references/05` worked example now states the order principle (WCAG A failures and vestibular triggers first, then LCP, then paint cost).

---

## Trigger check
- Should fire: all three briefs (phrases "motion spec", "transition", "feel premium" with "flow into", "janky", "dizzy"). "Feel premium" alone is weak; the description includes "make it feel smoother or snappier", and the brief's "flow into its page" maps to page transitions. Pass.
- Should stay quiet: "pick a color palette for a fintech brand" (design-color), "write a sales page headline" (copywriting), "set up a type scale" (design-typography). The description ends with "Do not use for static visual styling with no state change." Pass.

## Result
With-skill answers pass the gate on every brief and beat the generic answers by 30 to 34 points out of 60. The with-skill answers read as specs a top product studio would ship. **Pass.** Gaps sent back and fixed: native spring mapping (02), audit severity order (05).
