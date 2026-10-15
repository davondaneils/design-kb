# Changelog: design-art-direction

## v0.2.0 (2026-10-13, imagery rework, from the exemplar benchmark, `kb/tests/benchmark/RESULTS.md`, and the live capture `kb/teardowns/motion-imagery.md`)
- Why: builders followed v0.1 and shipped a correct single product card on 1 of 7 screens where Stripe shows about 12 mock-ups on 14 of 17 and Linear the full product on 10 of 12 (`kb/reviews/benchmark-round2-landing.md` gap 8). FOUNDATIONS v0.5 names this skill owner of the visual plan standard.
- SKILL.md rewritten: fundamentals first (truthful imagery, no fake logos or people, sample data labelled and footing, worst-pixel contrast, named or hidden visuals, mock-up facts in page text, the plan passes its check); a required **visual plan** (one row per slice at 1440 and 390, one treatment as tokens, a fragment set of three or more from one dataset, named type-only beats); 15 expert moves from the measurements (echoed fill, one shell and below-only shadow, mock-up type on the scale scaled by transform, crop not drop at 390, layering over chrome, bleed behind a footing front fragment, one dataset, verb fragments, FIG caption system, scale variety, photography-grade renders, named beats).
- New reference `references/06-product-fragments-and-visual-plans.md`: the plan worked for a sample product, the fragment family in HTML and CSS on FOUNDATIONS tokens, 390 and 768 crops, captions, photography treatment, renders with no image host, two more worked plans, myths.
- New asset `assets/visual-plan-check.mjs` (runs `kb/teardowns/choreo-probe.mjs` at 1440 and 390; fails coverage under 70%, fragments under 3 on a product page, fragments dropped at 390; warns on treatment, naming, unnamed beats). Fails the benchmark Ferry page (17% and 13%, 0 fragments); passes the new fixture `assets/fixtures/visual-plan-good.html` (100% at both widths, 7 fragments at both), which also passes `tools/lint.mjs`.
- Conflicts fixed: 01 "imagery on about every other section" withdrawn for the 70% plan; 01 numbers and hand-offs point at 06; 02 gains the treatment line for photos; 04 software row becomes a fragment set and recipe 7 links the render recipe.

## v0.1.3 (2026-10-13, editor-in-chief, benchmark round 1, `kb/tests/benchmark/round1/RANKED.md`)
- Step 5: the hero placement must be drawn and visible in the first screen, not only named in copy; links the landing playbook's reject test.

## v0.1.2 (2026-10-10, editor-in-chief)
- Expert move 15: print the live HTML label onto the product photo (the move the round 3 clean-context critic named the most non-obvious on either page, `kb/reviews/round3-critic.md` section 4), with its limits.

## v0.1.1 (2026-10-09, editor-in-chief)
- Illustration tokens adopted into FOUNDATIONS v0.3; overlay check promoted into `tools/lint.mjs`; landing, brand and dashboard playbooks and design-director now load this skill.

## v0.1 (2026-10-09)
- First version. SKILL.md plus references 01 concept and consistency, 02 photography, 03 composition and overlays, 04 visuals without image hosts, 05 requesting photography.
- Assets: `contours.mjs` (seeded contour generator), `overlay_contrast.py` (worst-pixel contrast), `duotone_matrix.py`.
- Critic round 1: NN/g 18/82 figure reattributed to the Amazon category page. Round 2: rules added from rendered tests (label backplates, sparkline container query, draw once use twice, clean-render worst-pixel method).
- Tested on the color pilot's coffee and dashboard pages: `kb/tests/design-art-direction.md`.
