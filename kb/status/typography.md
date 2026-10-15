# Typography and font pairing

| Field | Value |
|---|---|
| Domain number | 3 |
| Layer | reference |
| Skill | design-typography |
| Branch | restructure (merged from wave/typography on 2026-10-09) |
| Status (editor-in-chief) | testing |
| Shipped version (librarian) | none (v0.2 ready, awaiting Davon's blind ranking) |
| Reuses | none |
| Last updated | 2026-10-14 |

## Where it stands
v0.2 on branch `wave/typography`. Critic approved after 2 rounds (citation batch failed once on unfetchable X posts, fixed). Rendered tester run done (`kb/tests/design-typography.md`): both pages lint 0 fail; type rated close to the exemplars on the coffee landing page and the dashboard; whole pages still clearly below on imagery, art direction and product UI states. New: reference 06 (type without a font CDN), reference 07 (type-led pages), `assets/font_kit.py`. Measure rule corrected by measurement to `52ch`.

Merged into `restructure` on 2026-10-09; the shared-file changes from its pipeline notes are applied (FOUNDATIONS v0.3, director, playbooks, lint). Combined test on 2026-10-09 (`kb/tests/combined.md`): both pages built through design-director with every skill pass the lint with 0 fails in every state.

2026-10-11 (fix/heldout-gaps): reference 08 high-contrast faces and `assets/hairline.py` (Bodoni Moda measured at opsz 6 to 96). Needs a critic pass.

2026-10-14 (agency job, field update): research 07 on brand type selection method (Mushich, Damiba, Brett from Designjoy) after the owner rejected three rounds of grotesk and mono pairings. Reference 02 gains a brand selection method, a visible-axis rule, a budget question and display-setting guidance. Needs a critic pass.

## Next step
1. Davon ranks the combined blind pairs (`kb/tests/combined/blind/`) and this wave's own pairs, if any.
2. Librarian ships on approval and re-runs `node tools/rollup.mjs`.
