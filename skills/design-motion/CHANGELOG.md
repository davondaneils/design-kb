# design-motion changelog

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
