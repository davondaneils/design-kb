# Conversion design for websites (CRO)

| Field | Value |
|---|---|
| Layer | reference |
| Skill | design-conversion |
| Branch | wave/conversion (from restructure) |
| Status (editor-in-chief) | testing |
| Shipped version (librarian) | v0.1 (2026-10-10, on branch, not merged) |
| Reuses | sales-funnels, copywriting, website-strategy, design-ux `references/03-forms.md` |
| Last updated | 2026-10-10 |

## Where it stands
v0.1 passed the rendered slice: lint 0 fails on every page and state (as the baseline did), conversion audit 0 fails, rubric 7 of 7 after vs 2 of 7 before. It found a real number error in the baseline (15% claimed, 14.29% actual) and a phone primary below the first screen. Critic re-fetched 11 of 51 claims (21.6%): all pass, two punctuation fixes. Measured exemplar claims C51 to C55 were added after that review. See `kb/tests/design-conversion.md` and `kb/reviews/design-conversion.md`.

## Next step
Clean-context re-run (a fresh agent with only the skill). Davon's look at the coffee subscription band and checkout. Merge decisions for the shared files in `kb/reviews/design-conversion-pipeline-notes.md`.

## Subtopics
| # | Subtopic | Brief | Reference | Status |
|---|---|---|---|---|
| 01 | CTA hierarchy and placement | `briefs/conversion/01-cta-hierarchy.md` | `references/01-cta-hierarchy.md` | testing |
| 02 | Proof and trust | `briefs/conversion/02-proof-and-trust.md` | `references/02-proof-and-trust.md` | testing |
| 03 | Pricing and plans | `briefs/conversion/03-pricing-and-plans.md` | `references/03-pricing-and-plans.md` | testing |
| 04 | Checkout and forms | `briefs/conversion/04-checkout-and-forms.md` | `references/04-checkout-and-forms.md` | testing |
| 05 | In-product upgrades | `briefs/conversion/05-in-product-upgrades.md` | `references/05-in-product-upgrades.md` | testing |
| 06 | Evidence and testing | `briefs/conversion/06-evidence-and-testing.md` | `references/06-evidence-and-testing.md` | testing |
