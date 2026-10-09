# Product UI wave: rendered slice test briefs

Editor-in-chief, 2026-10-09. The tester runs these and does not change them. Both briefs are the slice briefs from `kb/briefs/color/slice-test-briefs.md`, re-run with design-product-ui applied, starting from the with-skill pages in `kb/tests/design-color/` so the gain is measurable against a known baseline.

## Brief B (main test): Tally SaaS analytics dashboard, light and dark
Same brief text as the color slice. Added requirements this domain owns:
1. The "top pages" table works at 390px without sideways scroll (the color pilot table scrolled), keeps the comparison it exists for, sorts by keyboard and announces the sort.
2. Empty, loading, partial failure and permission states exist and can be shown on the rendered page (a state switcher or a `?state=` parameter), each keeping panel size.
3. A keyboard layer: Cmd/Ctrl+K palette, `/` to search, `?` for the shortcut sheet, all with clickable twins, WCAG 2.1.4 safe.
4. A density option (default and compact).
5. The page answers a question in words before the KPIs.

Closest exemplars: Stripe Dashboard home, Vercel Dashboard, Linear app (public docs and remembered layouts only; see network note in `00-plan.md`).

## Brief A (secondary): Ember and Oak coffee landing page, light and dark
Marketing page: this domain only checks the product UI shown in it (add to cart buttons, the newsletter form). Layout, type, imagery and art direction are other domains and are not judged here.

## Rubric
**Gate (any miss fails):** `node tools/lint.mjs` exits 0 on every page and every state; every `[judged]` row of the FOUNDATIONS checklist holds on the screenshots, with item 15 (states) checked on state screenshots.

**Exemplar closeness for B (close / clearly below / far below):**
1. Answer first: within 5 seconds the page says what changed.
2. Table craft: shared column edges, units in headers, quiet rules, primary cell as link, phone view in one vertical scroll.
3. States look designed and keep layout.
4. Keyboard layer present and calm.
5. Chrome restraint and density: compact mode is deliberate.

**Pass** = gate 100 percent, rated close on 1 to 5, clearly better than the color pilot page.
For A: gate 100 percent and every product UI element has its feedback states.
