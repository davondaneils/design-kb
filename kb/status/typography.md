# Typography and font pairing

| Field | Value |
|---|---|
| Domain number | 3 |
| Layer | reference |
| Skill | design-typography |
| Branch | wave/typography (from restructure) |
| Status (editor-in-chief) | testing |
| Shipped version (librarian) | none (v0.2 ready, awaiting Davon's blind ranking) |
| Reuses | none |
| Last updated | 2026-10-09 |

## Where it stands
v0.2 on branch `wave/typography`. Critic approved after 2 rounds (citation batch failed once on unfetchable X posts, fixed). Rendered tester run done (`kb/tests/design-typography.md`): both pages lint 0 fail; type rated close to the exemplars on the coffee landing page and the dashboard; whole pages still clearly below on imagery, art direction and product UI states. New: reference 06 (type without a font CDN), reference 07 (type-led pages), `assets/font_kit.py`. Measure rule corrected by measurement to `52ch`.

## Next step
1. Davon blind-ranks the type pages against the design-color pages (`kb/tests/design-typography/shots/` vs `kb/tests/design-color/shots/`).
2. Editor-in-chief decides the shared-file changes in `kb/reviews/design-typography-pipeline-notes.md` (FOUNDATIONS measure `52ch`, design-layout `66ch`, director and playbook load orders, lint checks).
3. Librarian: on approval, ship v0.2, update INDEX and TOPIC_MAP (`node tools/rollup.mjs`).
