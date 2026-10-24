# Motion and micro-interaction

| Field | Value |
|---|---|
| Domain number | 7 |
| Layer | reference |
| Skill | design-motion |
| Branch | restructure (merged from wave/motion on 2026-10-10) |
| Status (editor-in-chief) | testing done, ready for librarian |
| Shipped version (librarian) | none (v0.2 proposed) |
| Reuses | none |
| Last updated | 2026-10-24 |

## Where it stands
v0.2 render-tested (`kb/tests/design-motion.md`, run 2). Both test pages gained purposeful motion; 16 animations filmed with `skills/design-motion/assets/motion-audit.mjs`, all on the tokens, none moving under reduced motion. Lint PASS before and after on both pages and all states. Critic round 2 approved (`kb/reviews/design-motion.md`), including a 20 percent citation re-fetch. New reference 07 and the audit tool.

## Open items
- Research debt: about 40 v0.1 claims in `kb/research/motion/01` to `06` lack a per-claim quote.
- Shared-file suggestions (lint motion checks, director film step, FOUNDATIONS `--motion-*` values and `linear`, 600 vs 800 ms reveal ceiling): `kb/reviews/design-motion-pipeline-notes.md`.
- Exemplars not filmed (hosts blocked); values come from the teardowns.

## 2026-10-23: cinematic scroll (from Davon's references)
New research `kb/research/motion/08-cinematic-scroll.md` (Scrolltide catalogue and eBook samples, motionin.design, easings.net, the 12 sites from an X post) and new reference `references/08-cinematic-scroll.md`; landing playbook gains `references/build-spec.md`. Not yet through critic or tester.

**Adopted as FOUNDATIONS v0.4.5 (Davon approved, 2026-10-23):** a marketing-only reveal curve `--ease-reveal: cubic-bezier(0.22, 1, 0.36, 1)` (easeOutQuint). Reason: at the 600ms marketing reveal it is 97% settled at half time against 89% for `--ease-enter`, so the screen goes still sooner; Scrolltide runs 249 elements on it (measured 2026-10-23). Marketing reveals use it; UI keeps `--ease-enter`.

## 2026-10-24: components, shaders, UI, and a full cinematic build
Davon rejected a cinematic page that only added a zoom to a static layout and asked for the Scrolltide components, shaders, UI and backgrounds to be used. Watched all 66 component, 55 shader and 14 UI preview recordings; rebuilt the Stand Firm waitlist page around them (v4) and folded the lessons into research section G, reference 08 (fundamentals 8 to 10, a component table, expert moves 17 to 24), the landing playbook and two lint fixes. Not yet through critic or tester.

## Next step
Librarian: ship v0.2 and update INDEX and TOPIC_MAP. Editor: decide the pipeline notes.
