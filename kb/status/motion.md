# Motion and micro-interaction

| Field | Value |
|---|---|
| Domain number | 7 |
| Layer | reference |
| Skill | design-motion |
| Branch | restructure (merged from wave/motion on 2026-10-10) |
| Status (editor-in-chief) | v0.4 drafted (shot plans, moment kit, blind gate, depth tier); proof is the Halyard rebuild |
| Shipped version (librarian) | none (v0.2 proposed) |
| Reuses | none |
| Last updated | 2026-10-15 |

## Where it stands
v0.4 (2026-10-15): the fresh brief passed every v0.3 check and the filmed motion was "not anything special". Nine exemplar moments studied frame by frame (`kb/moments/STUDY.md`); moment kit (`assets/moments.js`), shot plans read by `motion-plan-check.mjs` (plan, event, read, quiet, depth), blind gate (`assets/blind-gate.mjs`), references 09 and 10. FOUNDATIONS v0.6. See CHANGELOG 0.4.

v0.3 (2026-10-13): reworked after the benchmark rated motion "clearly below" twice. Required motion plan, ladder and product scene in SKILL.md; new reference 08; new `assets/scene.js` and `assets/motion-plan-check.mjs` (FAILS the round 2 Ferry page, PASSES `assets/fixtures/scene-good.html`, which lints clean); audit accepts reveal, blur-in, scene and `steps(1)` values from FOUNDATIONS v0.5. See CHANGELOG 0.3.

v0.2 render-tested (`kb/tests/design-motion.md`, run 2). Both test pages gained purposeful motion; 16 animations filmed with `skills/design-motion/assets/motion-audit.mjs`, all on the tokens, none moving under reduced motion. Lint PASS before and after on both pages and all states. Critic round 2 approved (`kb/reviews/design-motion.md`), including a 20 percent citation re-fetch. New reference 07 and the audit tool.

## Open items
- Research debt: about 40 v0.1 claims in `kb/research/motion/01` to `06` lack a per-claim quote.
- Shared-file suggestions (lint motion checks, director film step, FOUNDATIONS `--motion-*` values and `linear`, 600 vs 800 ms reveal ceiling): `kb/reviews/design-motion-pipeline-notes.md`.
- Exemplars now recorded live (`kb/teardowns/motion-imagery.md`); the v0.2 note that they were not filmed is resolved.
- v0.3 needs a critic pass and a benchmark rebuild to see whether builders now ship a ladder and a scene.

## Next step
Critic: review v0.3 (SKILL.md, reference 08, the two new assets). Tester: rebuild a product landing page from the skill and run `motion-plan-check.mjs` at 1440 and 390. Librarian: then update INDEX (still lists 0.2) and TOPIC_MAP.
