# Product and tool UI

| Field | Value |
|---|---|
| Domain number | 18 |
| Layer | reference |
| Skill | design-product-ui |
| Branch | restructure (merged from wave/product-ui on 2026-10-09) |
| Status (editor-in-chief) | testing |
| Shipped version (librarian) | none (v0.1 built, awaiting Davon's review) |
| Reuses | dataviz, design-ux, design-layout, design-typography |
| Last updated | 2026-10-09 |

## Where it stands
Full pipeline run on 2026-10-09: briefs (`kb/briefs/product-ui/`, 6 subtopics plus slice test briefs), research (6 notes, 137 claims, tiers 1 to 4; exemplar evidence from the teams' public docs because the apps sit behind logins and exemplar hosts are blocked to curl), drafts, skill (`skills/design-product-ui/`, SKILL.md plus 6 references), critic (20 percent citation re-fetch 28 of 28 confirmed; round 1 revise, round 2 approve), tester (rendered, 2 rounds).

Test result (`kb/tests/design-product-ui.md`): the Tally dashboard, rebuilt from the color pilot page, passes the lint in all 8 rendered states (ready, loading, empty, partial failure, viewer permission, compact density, palette open, shortcut sheet open) and is rated close to Vercel and Stripe on the product UI rubric, clearly below on visual polish and iconography. The coffee landing page was checked for product UI only (add to cart and newsletter states).

Merged into `restructure` on 2026-10-09; the shared-file changes from its pipeline notes are applied (FOUNDATIONS v0.3, director, playbooks, lint). Combined test on 2026-10-09 (`kb/tests/combined.md`): both pages built through design-director with every skill pass the lint with 0 fails in every state.

## Open
- Run test briefs not covered by the slice: bulk archive (05), workspace settings (03).
- Davon's blind ranking of before and after.
- Exemplar teardowns from real screenshots when Davon supplies them.
- Suggested shared-file changes: `kb/reviews/design-product-ui-pipeline-notes.md`.

## Next step
1. Davon ranks the combined blind pairs (`kb/tests/combined/blind/`) and this wave's own pairs, if any.
2. Librarian ships on approval and re-runs `node tools/rollup.mjs`.
