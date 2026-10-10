# Front-end build quality: semantic HTML, modern CSS, performance

| Field | Value |
|---|---|
| Domain number | 10 |
| Layer | reference |
| Skill | design-frontend |
| Branch | wave/frontend (from restructure) |
| Status (editor-in-chief) | review (render test passed; ready to merge) |
| Shipped version (librarian) | 0.2 on wave/frontend, not merged |
| Reuses | design-foundations (accessibility floor), tools/lint.mjs |
| Last updated | 2026-10-10 |

## Where it stands
Brief 07, research 07 (C1 to C34 and M1 to M9), draft 07 and `references/07-measured-build-quality.md` are added. There are also new tools in `assets/` (pixel-diff, vitals, weight, css-audit, pw) and SKILL.md 0.2: every gate item now says how it is checked, rule 24 adds pixel-diff proof, and new decision rules and expert moves 14 to 18 are in. Critic round 3 approved; the citation spot check matched 7 of 7.

Render test (`kb/tests/design-frontend.md`) passed:
- lint: 0 fails on 19 targets before and after;
- pixel diffs: 120 of 120 identical, with 3 intended changes shown on their own;
- css-audit: both pages FAIL to PASS;
- vitals: good, with one measured trade (+28 ms desktop LCP for CLS 0 with saved density);
- build rubric: 8 of 8 on both pages.

## Next step
Librarian: merge wave/frontend into restructure and update TOPIC_MAP and INDEX. Owners of the shared files: review `kb/reviews/design-frontend-pipeline-notes.md` (FOUNDATIONS dark shadows `none` should be transparent; lint skip-link check and two false positives). When network allows, measure exemplar weight and font loading with `assets/weight.mjs` and `assets/vitals.mjs`.
