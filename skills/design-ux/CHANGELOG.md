# design-ux changelog

## 0.2.2 (2026-10-13, editor-in-chief, benchmark round 1, `kb/tests/benchmark/round1/RANKED.md`)
- Phone navigation: the opened menu repeats the primary action and its trigger reads "Close" with `aria-expanded` (SKILL section 3, reference 02 pattern chooser). Round 1 showed 0 links at 390 and a trigger that never changed.

## 0.2.1 (2026-10-10, editor-in-chief)
- Checkout field average updated from the outdated 14.88 to Baymard's 2024 figure of 11.3 (via `kb/research/conversion/04-checkout-and-forms.md` C9; baymard.com was blocked from this environment, so the quote was not re-fetched).
- PR #6 findings folded in with links to `kb/references/patterns/`: onboarding (real product first, permission only when a feature needs it, per-platform primers) and notifications (ask after the first useful moment, one channel per event, needs-you inbox split).

## 0.2 (2026-10-10, wave 2)
- New `references/07-commerce-flows.md`: purchase and subscription flows (options as radio cards, grind asked as "How do you brew?", cadence, the button as the summary, terms under it, cart drawer as a modal dialog, remove with undo, checkout entry). Sourced claims C1 to C21 in `kb/research/ux/07-commerce-flows.md` (Baymard, Shopify, W3C, APG, NN/g, California ARL, Nunes and Dreze).
- `05-onboarding.md`: first run as states for data products (sample, setup guide, listening, check failed, first data; "not enough data yet is not zero").
- Overlap trimmed: dense app UI links to design-product-ui; platform conventions link to design-playbook-mobile. Review template renumbered to `08-review-template.md`.
- SKILL.md: "What lives elsewhere" table, commerce and first-run rules, 14 expert moves.
- Critic: round 1 revise (6 fixes), round 2 approve; citation re-fetch 18 of 92, all passed. Tester: first rendered run on the coffee and dashboard pages, every page, state and state sheet lint PASS; see `kb/tests/design-ux.md` run 2.

## 0.1.1 (2026-10-09, editor-in-chief)
- Hand-off to design-product-ui no longer marked planned; finish details hand off to design-polish.

## 0.1 (2026-10-09)
- First release. SKILL.md (gate of 12 fundamentals checks, core numbers, decision rules by area, 12 expert moves, answer procedure, reference map) plus 7 references: fundamentals, navigation and IA, forms, states and feedback, onboarding, platforms touch and systems, review template.
- Built on the shared foundations contract v0.1 (breakpoints, type base 16 px, durations, semantic token names, WCAG 2.2 AA floor). Conflicts logged in `kb/reviews/design-ux-pipeline-notes.md`.
- Critic: 10 fixes applied (sourcing, NIST Rev 4 passwords, deceptive patterns, RTL). Tester: 3 briefs, with-skill 24/25 vs generic 10/25 on each; 2 gaps fixed (faceted filters, streaming text and screen readers).

## Review schedule
- Interval: 6 months (mixed area). Platform guidance (Apple HIG, Android adaptive navigation and window size classes, Material) moves yearly with OS releases; AI and agent UX patterns move fast.
- Next review due: 2027-04-09. Recheck: new iOS and Android releases, WCAG 3 status, NIST 800-63 updates, Baymard checkout benchmark refresh, NN/g AI UX research, DTCG token spec versions.
- Open for 0.2: data tables (sorting, bulk actions, density) with design-data; notification permission timing; search results UX with design-search.
