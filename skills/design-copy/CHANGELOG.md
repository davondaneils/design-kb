# design-copy changelog

## 0.2.1 (2026-10-10, editor-in-chief)
- `assets/claims_inventory.mjs`: PROMISE warning (one promise said with two values or units, with label-and-value pairs and date intervals read together) and PERIOD warning (two comparison bases on one page); `--render` reads the rendered text through `tools/browser.mjs`, so script-built strings and `?state=` URLs are inventoried; `--strict` turns the warnings into exit 1. From the round 3 critic: "48h", "next day" and "ships by Thu" for one promise passed with exit 0 (`kb/reviews/round3-critic.md`).

## 0.2 (2026-10-10)
- **Render-tested.** Both slice pages (Ember & Oak coffee landing page, Tally analytics overview) rewritten through design-director and linted and rendered at 390 and 1440, light and dark, every state and both state sheets: 0 lint fails before and after (`kb/tests/design-copy.md` run 2).
- **New reference `references/06-copy-in-context.md`:** the render pass. Copy-to-data reconciliation, the promise ledger, one verb per action, caveat at the point of reading, price-paired CTAs, no-break spaces inside dates, prices and ranges, announcements as copy, mechanics sheet (clock, weekday-checked dates, numerals, spelling, perspective). Worked examples for the pricing feature table and the settings screen (v0.1 ticket 3).
- **New asset `assets/claims_inventory.mjs`:** lists every string with a number, date or comparison for ticking against its source; flags wrong weekdays, relative dates in money or shipping copy, and mixed clocks.
- **Fundamentals gate 14 to 16 rules:** 13 every number is true against its source; 14 one promise, one wording. Mechanics rule extended (clock, dates, perspective); real-copy rule extended to every state and to no-break units.
- **Sources (v0.1 tickets 1 and 2):** Apple HIG Writing verified (Dec 16, 2025 revision: possessives, no "we" in UI, settings described by their on state, link to settings); Shopify Polaris and Mailchimp mechanics; FTC truth in advertising and 16 CFR 233 for savings claims. Practitioner primary material (Stratton, Shleyner, Yifrah) still out of reach; logged as leads only.
- Measure line aligned with FOUNDATIONS v0.3 (`max-inline-size: 52ch`).
- Critic round 2: approve (`kb/reviews/design-copy.md`), citation sample 5 of 19, all confirmed.

**Open tickets for v0.3:**
1. Footnote or source markers for claims that need substantiation (Apple product page pattern, measured in the exemplar teardown).
2. Hero density test: one supporting line (Linear teardown) against two paragraphs.
3. Primary practitioner sources: Make It Punchy (Stratton), Very Good Copy (Shleyner), Microcopy: The Complete Guide (Yifrah), from the books or authors' own sites.
4. String table export for JavaScript-built strings so the claims inventory can read them.

## 0.1 (2026-10-09)
- First release. Covers page copy structure (hero, sections, CTAs, slot budgets), UX microcopy (buttons, forms, adaptive errors, empty states, dialogs, onboarding, notifications, AI features), voice and tone systems (voice chart, tone dials, tone map, mechanics), readability and scannability, and content design process (string tables, localization, copy testing, AI draft QA).
- Fundamentals gate of 14 rules; aligned with the shared foundation contract (measure 45 to 75 / 66, `--color-danger`, 24 px minimum targets, WCAG 2.2 AA).
- Critic fixes applied (kb/reviews/design-copy.md); tester gap fixed: absolute dates for money and deadlines, toggle labels.
- Reuses, does not duplicate: copywriting, website-strategy, sales-funnels.

**Review interval:** 6 months (next: 2027-04). Copy fundamentals are stable, but AI feature microcopy, practitioner sources and conversion benchmarks (Unbounce publishes yearly) move fast.

**Open tickets for v0.2:**
1. Add practitioner sources not reached this run (search budget ran out): Eddie Shleyner, Emma Stratton, Kinneret Yifrah, X.com resource compilations.
2. Verify Apple HIG Writing (page did not render) and add a platform capitalization note.
3. Worked examples: pricing page feature table, settings screen.
