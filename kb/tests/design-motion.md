# Tests: design-motion

## Run 2: v0.2, rendered (2026-10-10)

**Method.** Rendered, not text. The two combined test pages (`kb/tests/combined/coffee.html`, `dashboard.html`) were copied to `kb/tests/design-motion/before/` and linted as the baseline, then rebuilt following SKILL.md and references 01 to 07 (`coffee.src.html`, `dashboard.src.html`, built by `build.mjs` with the shared state sheets). Every page and state was linted with `tools/lint.mjs` (any fail = fail) and rendered with `tools/render.mjs` at 390 and 1440 px, light and dark (`shots/`). Screenshots cannot show motion (render.mjs runs with reduced motion, so they show end states), so every animation was also filmed with the new `skills/design-motion/assets/motion-audit.mjs`: 16 scenarios (`scenarios.mjs`), each filmed under no-preference and reduce, 6 frames per row, timings read from the browser (`document.getAnimations()`), not from the source (`strips/`, `strips/motion-audit.json`). Frame times at 4x CPU throttle in `perf.txt`. Exemplar values come from the measured teardowns (`kb/teardowns/*.md` on `claude/exemplar-library-xfa3bl`, not copied here). Limit: exemplar sites are blocked, so no exemplar was filmed; photo hosts are blocked, so the pages keep their generated SVG imagery.

Clean-context note: the same agent wrote the before and after pages and judged them. The lint, the audit and the frame times are mechanical; the judged items below are not, so treat them as a strong self-review, not an independent one.

### Lint, before and after
| Page | Before | After |
|---|---|---|
| coffee.html | PASS, 0 fail, 21 warn (motion: 0 animations, 11 moving transitions) | PASS, 0 fail, 21 warn |
| coffee states (added, subscribed, error, sending) | not run | each PASS, 0 fail, 21 warn |
| coffee-states.html | not run | PASS, 0 fail, 14 warn |
| dashboard.html | PASS, 0 fail, 27 warn | PASS, 0 fail, 28 warn |
| dashboard states (loading, empty, partial, viewer, compact, open palette, open sheet) | not run | each PASS, 0 fail (8 to 35 warn) |
| dashboard-states.html | not run | PASS, 0 fail, 35 warn |

Warn delta: the one new dashboard warn is the "Pause" button at 42.8 x 24 px on phone (meets WCAG 2.5.8 at 24 px; under the 44 px touch target, like the 40 px buttons that already warn on both pages). Two fails were hit on the way and fixed: `?open=sheet` measured a 24 px switch at 23 px because the lint ran mid-entrance (fix: review hooks open settled), and a reduce-row warn for three `transform` transitions declared outside the no-preference block (fix: transform transitions moved inside it).

### Motion added and filmed
| Scenario | What moves | Filmed timing | Audit |
|---|---|---|---|
| coffee-1 roast curve | two-transform wipe, linear, markers pop as the pen passes, labels one instant later | 600 ms linear; markers 150 ms enter at share x 600 ms | pass |
| coffee-2 contour rise | 37 contour lines fade up, one wave | step min(40, 300/levels) ms, last start under 300 ms | pass |
| coffee-3a add to cart | press, fade-through label, check draws | out 100 ms exit, in 200 ms enter after 100 ms | pass |
| coffee-3b cart badge | changed digit rolls, badge bumps once | out 150 exit, in 200 enter, bump 200 standard | pass |
| coffee-4 card hover | lift 2 px, shadow on `::before` opacity | 150 ms standard | pass |
| coffee-5 newsletter | success line rises 4 px | 200 ms enter | pass |
| dash-1 live KPI | only changed digits roll, by direction | 150 exit, 200 enter; reduce: 100 ms crossfade | pass |
| dash-2 row menu | scale 0.95 plus fade from the trigger corner | 150 enter, 100 exit | pass |
| dash-3 / 4 shortcut sheet | pointer: scale 0.96 plus fade; keyboard: nothing | 200 enter, 150 exit; `?`: 0 animations | pass |
| dash-5 / 6 palette | pointer: 100 ms fade; Ctrl K: nothing | 100 ms; 0 animations | pass |
| dash-7 phone drawer | slide plus scrim, `@starting-style`, `allow-discrete` | 300 enter, 200 exit | pass |
| dash-8 retry rows | first appearance stagger | 30 ms per row, opacity only | pass |
| dash-9 sort arrow, dash-10 switch | rotate; thumb on transform, not `left` | 150 ms; 100 ms | pass |

Audit verdict: "PASS: every filmed animation is on the motion tokens", 16 of 16, both rows. No movement under reduce in any scenario.

Frame times at 4x CPU throttle (headless, so relative only): roast curve wipe median 16.7 ms, 3 frames over 25 ms, against 10 for the old `clip-path` draw; contour rise p95 33.4 ms, 6 over 25 ms (the heaviest, 37 paths); live digits 2; drawer 2.

### Motion rubric (brief 07, judged)
| # | Item | Result |
|---|---|---|
| 1 | Every animation has a job (feedback, orientation, attention, state change) | pass: each scenario names its job in the strip caption |
| 2 | Tokens only, CSS and scripts | pass (audit); scripts read tokens with `getComputedStyle` |
| 3 | Compositor properties only | pass (audit): no shadow, layout or clip-path animation |
| 4 | Reduced motion designed per element, no global reset | pass: reduce row of every strip; matrix comment in both sources |
| 5 | First paint static; numbers and charts never animate on arrival | pass: hero, KPIs and dashboard chart static; curve below the fold |
| 6 | Keyboard paths instant | pass: dash-4 and dash-6 film 0 animations |
| 7 | Auto-updating content can be paused (WCAG 2.2.2) | pass: "Pause updates" (phone: "Pause"), mutes the live dot |

7 of 7.

### Exemplar comparison (honest)
- Close on product UI. Linear and Vercel ship 100 ms hover colors (teardowns); both pages hover at `--duration-instant` (100 ms). Vercel fades at 300 ms; ours sit at 150 to 300 ms. Linear's buttons run 160 ms, between our fast and base.
- Different on marketing reveals. Stripe reveals run 800 ms on `cubic-bezier(.165,.84,.44,1)` with 1.2 s heading color fades; Raycast cards slide in 700 ms. The coffee curve stops at 600 ms (the FOUNDATIONS page ceiling), so the page reads quicker and less cinematic than Stripe. Whether to allow 800 ms for one below-the-fold reveal is an editor question (pipeline notes item 10).
- Reduced motion: all five exemplars ship explicit reduced-motion rules (Apple 40, Vercel 16, Linear 14, Raycast 10). Ours is per element with a written matrix, at least on par in intent; the count is not comparable.
- Clearly below in craft that a strip cannot show: spring physics on drag (none on these pages), and Stripe-grade choreography across a whole scroll. Not tested: real devices, 120 Hz, and filming the exemplars themselves (hosts blocked).

### Verdict
Pass. Both pages now move with purpose, every animation is filmed and on the tokens, and the fundamentals gate holds in lint and in the audit. Ships as v0.2 for the librarian.

### Gaps sent back
- The lint motion check is too weak to gate motion (pipeline notes 1 to 3); until it changes, the audit is the evidence.
- v0.1 research notes 01 to 06: about 40 claims still lack a per-claim quote (critic, open).
- No native (SwiftUI, Compose) render test; motion was filmed on web only.

---

## Run 1: v0.1, text only (2026-10-09, kept for history)

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
