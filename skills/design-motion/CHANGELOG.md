# design-motion changelog

## 0.3.1 (2026-10-14, from the fresh-brief critic, `kb/reviews/fresh-landing.md`)
- `assets/motion-plan-check.mjs`: a text stagger group (words, lines, headings) spreading over 500ms now fails instead of warning; cards keep the 800ms cap. The Halyard page's 612 to 693ms word rises passed as warnings before.

## 0.3 (2026-10-13, domain-specialist, from the exemplar benchmark's motion verdict and the live choreography capture)
Why: both benchmark rounds rated motion "clearly below" Stripe and Linear; the builders followed v0.2 and shipped one transition duration, one curve and a single hero reveal, with no product state change animating, and reduced motion deleted the FAQ's open state (`kb/tests/benchmark/RESULTS.md`, `kb/reviews/benchmark-round2-landing.md`). The live capture (`kb/teardowns/motion-imagery.md`) showed what the exemplars actually run: duration ladders of 3 to 20 values, product mock-ups on scripted timelines with holds, masked word rises at 325ms and 50ms gaps. Built on FOUNDATIONS v0.5 (motion ladder, `--duration-reveal`, `--stagger`, `--travel`, product scenes).
- SKILL.md: new required sections before any code: the **motion plan** table (each moving thing, job, band, duration, curve, trigger, reduced-motion end state), the **ladder** (three to five bands, one hover speed per page) and the **product scene** (states a buyer would name, beats 1200 to 4500ms with holds, loop 12s or less, rest 2s or more, seam, in view only, pause on hover, focus, hidden tab and a button, still frame under reduce, totals that re-foot).
- Fundamentals: 1 adds "explain the product" as a job; 5 names the three things allowed above 600ms (reveal, hero reveal, scene); 6 adds `steps(1)`; 7 now says **end states are kept under reduce, only the transition goes** (the round 2 gate fail); 9 allows a text blur-in of 10px or less; 11 requires `motion-plan-check.mjs` at 1440 and 390.
- Expert moves 23 to 33 from the measurements: budget to the product, hold keyframes, value stacks, masked rises with padded masks, blur-in on dark, split fade and move (Mercury's 150ms offset), `steps(1)` for digital things, hover speed as a brand statement, progress fills that end before the beat, author the still frame, and what not to borrow under reduce from Stripe, Linear and Raycast. Moves 1 to 22 kept their numbers (FOUNDATIONS cites move 17).
- New `references/08-product-scenes-and-choreography.md`: ledger scene (Queued, Sending, Paid, re-footing total) in full HTML and CSS, masked heading rise, split card reveal, a full-page motion plan, myths with corrections.
- New `assets/scene.js`: dependency-free scene runner (data-beats, data-rest, data-still; data-state, data-seen and --beat for CSS; seam; pause on hover, focus, hidden tab, off screen and `[data-scene-pause]`; still frame and nothing else under reduce; no millisecond literals).
- New `assets/motion-plan-check.mjs`: records the page the way `kb/teardowns/choreo-probe.mjs` recorded the exemplars and fails on fewer than 3 bands, no scene, scene beats, rest or pause out of rule, a scene that keeps stepping while hovered, paused or off screen, stagger outside 20 to 80ms, travel outside 8 to 50px (masks allowed), anything moving under reduce, a scene without its still, and an open `<details>` whose end state changes under reduce. FAILS on the round 2 Ferry page (no scene; five FAQ items lose their open state under reduce); PASSES on the new fixture `assets/fixtures/scene-good.html`, which also passes `tools/lint.mjs` with 0 warnings.
- `assets/motion-audit.mjs`: accepts 1000ms (text blur-in only), any 1200 to 12000ms inside `[data-scene]`, `steps(1)`, and `filter: blur()` of 10px or less; blur under reduce fails.
- `assets/motion-tokens.css`: `--duration-reveal`, `--stagger`, `--travel`; comments map each token to its band.
- References: 02 adds the ladder and the steps(1), value-stack and split-reveal curve rows; 03 stagger and reveal values per FOUNDATIONS v0.5, landing example rewritten around the scene; 04 accordion row now keeps the icon's open state under reduce (the critic's fix 4), one hover speed; 05 reduce matrix adds end states, scenes and text reveals, spinners stop rotating, blur 10px; 06 tokens, WAAPI example reads tokens, scene section; 07 blur exception, end-state rule, live capture supersedes the declared values, check commands; 01 motion budget goes to the product.

## 0.2.1 (2026-10-13, editor-in-chief, benchmark round 1, `kb/tests/benchmark/round1/RANKED.md`)
- Hero entrance resolved in favor of FOUNDATIONS: one hero reveal per marketing page up to 800ms, on the supporting artifact by transform or clip-path; the headline and LCP element never fade from opacity 0 (SKILL move 9, references 03 and 07). Round 1's builder read "no hero entrance" and shipped no motion voice.
- `--duration-page` is 400ms; 600ms is the ceiling, not the token (reference 07 no longer says 600 "until the editor decides"; tokens css, reference 02).
- Native `<details>` animation: `::details-content` with `interpolate-size: allow-keywords`, off under reduced motion (references 04 and 06, SKILL table).

## 0.2 (2026-10-10)
- Render-tested on the coffee landing page and the Tally dashboard (`kb/tests/design-motion.md`, run 2): 16 animations added, filmed in both motion settings, all on the tokens; lint PASS before and after on both pages.
- Fundamentals fix: easing tokens renamed `--easing-*` to `--ease-*` to match FOUNDATIONS (a gate miss in v0.1); `--motion-scale` renamed `--duration-multiplier`; `--motion-hover/enter/exit` pairs added.
- New fundamental 11 (filmed, not assumed); fundamentals 4, 6, 8 and 10 sharpened (tokens in scripts and a curve on every transition entry, linear for time axes, WCAG 2.2.2 covers auto-updating content, numbers and charts never animate on arrival).
- New expert moves 17 to 22: linear time axes, the two-transform wipe, animate the change not the arrival, fade-through under reduce, modality-aware dialogs, review hooks open settled.
- New `references/07-motion-on-real-pages.md` (data and live numbers, label swaps, dialogs, filming), with measured exemplar values from the teardowns.
- New `assets/motion-audit.mjs`: films each scenario under no-preference and reduce and fails off-token durations or curves, animated layout or shadow, movement under reduce, and animated keyboard paths.
- Reference 04: number changes and the add-to-cart example use fade-through and digit roll. Research notes 02, 03, 06 corrected after the critic's citation re-fetch.

## 0.1 (2026-10-09)
- First release. SKILL.md (fundamentals gate, shared tokens, decision rules, 16 expert moves, spec format, review checklist) plus references 01 to 06 and `assets/motion-tokens.css`.
- Built on the design-kb shared foundation contract v0.1: duration tokens `--duration-instant/fast/base/slow/page` at 100, 150, 200, 300, 400 ms (low end of each band); easing `--easing-standard`, `--easing-enter`, `--easing-exit` with the contract's Material 3 curves.
- Critic fixes applied (see `kb/reviews/design-motion.md`): dialog `@starting-style` cascade, hover color outside reduced-motion block, WCAG 1.4.13 tooltips, keyboard rule narrowed, exit-easing consistency.
- Tester gaps fixed (see `kb/tests/design-motion.md`): native spring mapping (SwiftUI, Compose), audit severity order.

**Review interval:** 6 months (next due 2026-04-09 + 6 months = 2027-04-09). Reason: mixed area. Principles and timing are foundations (yearly), but browser support for View Transitions (cross-document), scroll-driven animations (Firefox), `interpolate-size` and the Motion library API move fast.

**Recheck at next review:**
- Re-run `kb/teardowns/choreo-probe.mjs` on Stripe, Linear, Raycast and Mercury: scene beats, stagger and reduce behavior drift with each redesign.
- Cross-document View Transitions support in Firefox; scroll-driven animations in Firefox stable; `interpolate-size` Baseline status.
- Material 3 Expressive motion tokens for changes; Motion library defaults (`bounce`, `visualDuration`).
- WCAG 3 drafts for any motion requirement changes.
- Verify the shared-axis 30 px slide distance against MDC `SlideDistanceProvider`.

**Related skills:** design-ux, design-layout, design-color, design-typography, design-graphic, design-frontend, design-search, design-copy; user skills website-strategy, copywriting, sales-funnels.
