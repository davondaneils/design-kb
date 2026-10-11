# Visual polish and craft details

| Field | Value |
|---|---|
| Domain number | 16 |
| Layer | reference |
| Skill | design-polish |
| Branch | restructure (merged from wave/polish on 2026-10-09) |
| Status (editor-in-chief) | testing |
| Shipped version (librarian) | v0.1 (on branch, not merged) |
| Reuses | design-layout, design-typography, design-color |
| Last updated | 2026-10-09 |

## Where it stands
Full pipeline run on 2026-10-09. Briefs, research (84 claims, 20% citation re-fetch passed), six chapters, SKILL.md, `assets/polish-tokens.css` and the advisory `assets/polish-audit.mjs`. Critic: approve (round 2). Tester: pass. Both slice pages rebuilt with the skill plus a state sheet each; lint 0 fails on all six pages; audit warns on coffee 12 to 3. Six skill gaps found by rendering and fixed (G1 to G6 in `kb/tests/design-polish.md`). Against exemplars: dashboard close, coffee still clearly below (imagery, display type, art direction are the bottleneck, not polish).

Merged into `restructure` on 2026-10-09; the shared-file changes from its pipeline notes are applied (FOUNDATIONS v0.3, director, playbooks, lint). Combined test on 2026-10-09 (`kb/tests/combined.md`): both pages built through design-director with every skill pass the lint with 0 fails in every state.

## Next step
1. Davon ranks the combined blind pairs (`kb/tests/combined/blind/`) and this wave's own pairs, if any.
2. Librarian ships on approval and re-runs `node tools/rollup.mjs`.
