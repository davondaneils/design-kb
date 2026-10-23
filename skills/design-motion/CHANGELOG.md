# design-motion changelog

## 0.3 draft (2026-10-23)
- New `references/08-cinematic-scroll.md`: scroll-driven films, frame sequences, pinned stages and chapters. Fundamentals (the scene must earn its place, three moments move, visible first paint, native scroll, reduced motion tells the story, a phone budget, contrast on the worst frame), a mechanism picker, making the frames (plate and layout, photographer's slots, one change between frames), easing on a cinematic page, 16 expert moves. From Scrolltide, motionin.design and easings.net (`kb/research/motion/08-cinematic-scroll.md`). Not yet through critic or tester.
- Proposal, not applied: `--ease-reveal` easeOutQuint for marketing reveals (`kb/status/motion.md`).

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
- Cross-document View Transitions support in Firefox; scroll-driven animations in Firefox stable; `interpolate-size` Baseline status.
- Material 3 Expressive motion tokens for changes; Motion library defaults (`bounce`, `visualDuration`).
- WCAG 3 drafts for any motion requirement changes.
- Verify the shared-axis 30 px slide distance against MDC `SlideDistanceProvider`.

**Related skills:** design-ux, design-layout, design-color, design-typography, design-graphic, design-frontend, design-search, design-copy; user skills website-strategy, copywriting, sales-funnels.
