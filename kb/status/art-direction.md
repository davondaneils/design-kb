# Art direction and imagery

| Field | Value |
|---|---|
| Domain number | 19 |
| Layer | reference |
| Skill | design-art-direction |
| Branch | restructure (merged from wave/art-direction on 2026-10-09) |
| Status (editor-in-chief) | testing |
| Shipped version (librarian) | none (v0.1 ready for review) |
| Reuses | design-graphic (03, 04), design-color, dataviz |
| Last updated | 2026-10-15 |

## Where it stands
Full pipeline run on 2026-10-09: briefs (5 plus slice briefs), research (5 notes, 66 claims), drafts (5), skill (SKILL.md, 5 references, 3 scripts), critic (round 1 failed the citation batch on one misattributed NN/g figure, fixed; round 2 approve), tester (3 rounds on rendered pages). Gate passes on both test pages (lint 0 fails before and after). Dashboard rated close to the exemplars; coffee page clearly better than the baseline and close on concept, specificity, restraint and dark mode, but still clearly below on finish: no photography or display typeface can load here. Escalated per the loop cap with the open issues in `kb/tests/design-art-direction.md`.

Merged into `restructure` on 2026-10-09; the shared-file changes from its pipeline notes are applied (FOUNDATIONS v0.3, director, playbooks, lint). Combined test on 2026-10-09 (`kb/tests/combined.md`): both pages built through design-director with every skill pass the lint with 0 fails in every state.

2026-10-15: v0.1.3 adds `references/humanize-pass.md` from the owner's "no soul" review of the Flagship sales page, wired into the design-director loop (step 12) and the landing playbook's signature moves. Not yet tested on a rendered page.

## Next step
1. Davon ranks the combined blind pairs (`kb/tests/combined/blind/`) and this wave's own pairs, if any.
2. Librarian ships on approval and re-runs `node tools/rollup.mjs`.
3. Test the humanize pass on the next landing build: run the 12 symptoms before and after, and have the owner rank the pair.
