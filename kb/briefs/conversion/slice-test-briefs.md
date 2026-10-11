# Conversion: vertical slice test briefs

Written by the editor-in-chief, 2026-10-10. Reuses the two combined-test pages unchanged as the baseline, so the gain from design-conversion is measured on pages that already pass every gate and won Davon's blind ranking.

## Method
- **Before:** `kb/tests/combined/coffee.html` and `dashboard.html`, copied to `kb/tests/design-conversion/before/`.
- **After:** the same pages rebuilt through design-director, the playbook, and design-conversion. Brand, type, art direction and color stay; differences come from conversion design.
- Lint both (`tools/lint.mjs`, every `?state=`), render both (`tools/render.mjs`), run `skills/design-conversion/assets/conversion-audit.mjs` on both.

## Brief A: Ember & Oak coffee roaster (landing, light and dark)
Apply to the subscription band and the shop. Exemplar for closeness: apple.com product and buy pages (price block, terms beside the CTA, quiet proof), mercury.com and family.co (restraint).
Must have after: a cadence choice with a preselected recommendation; a price block that states amount, unit, shipping, next charge and cancel terms beside the CTA; a rating with count and distribution near the subscription; a guarantee with a mechanism; shipping cost on shop cards; a subscription checkout reachable by `?state=checkout`; every number recomputed and correct.

## Brief B: Tally analytics dashboard (light and dark)
The page has no upgrade surface. Add the honest minimum a plan-limited product needs: a usage meter and a limit state reachable by `?state=limit`, without a modal on load and without displacing "Share report" as the primary. Exemplar: Vercel Dashboard usage, Linear app.

## Rubric
**Gate:** lint exits 0 on every page and state; every `[judged]` row holds (FOUNDATIONS checklist).

**Conversion rubric (each pass or fail on screenshots and source):**
1. One filled primary per viewport screenshot; labels predict the next screen.
2. Price block complete (amount, unit, included, cadence, next charge, cancel) and adjacent to the CTA.
3. Every number correct (tester recomputes savings and totals).
4. Proof: rating with count and distribution; proof within one screen of the primary; no badge outside payment context.
5. Forms: labels, autocomplete tokens, field count at or under budget, express pay first, total beside pay button.
6. No dark patterns (fake urgency, preticked add-ons, hidden renewal, confirmshaming).
7. In-product: upgrade is secondary, numeric, non-modal, role-aware.

**Exemplar closeness:** rated close, clearly below or far below on the conversion moments only (price block, proof, checkout), from text reads of the exemplar pages; pixels unavailable.

**Pass** = gate 100 percent, rubric 7 of 7, audit 0 fails, and the after page better than the before page at the moment of decision.
