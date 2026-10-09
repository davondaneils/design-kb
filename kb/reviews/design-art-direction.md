# Review: design-art-direction

Critic, 2026-10-09. Inputs: `skills/design-art-direction/` (SKILL.md, references 01 to 05, assets), drafts and research in `kb/drafts|research/art-direction/`.

## Round 1

### Citation spot check
Method: all 64 claim rows with a URL across the five research notes; `random.seed(20261009); random.sample(ids, 13)` (20 percent, rounded). Each URL re-fetched with WebFetch on 2026-10-09 and asked whether the exact quote appears.

| ID | URL | Quote found | Supports claim | Result |
|---|---|---|---|---|
| C6 | mercury.com | yes (alt text of "Total visibility" image) | yes | pass |
| C9 | atlassian.design/foundations/illustrations | yes | yes | pass |
| O4 | w3.org G18 | yes | yes | pass |
| O8 | MDN forced-colors | yes | yes | pass |
| O11 | w3.org Understanding 1.4.11 | yes | yes | pass |
| Ph3 | nngroup.com photos-as-web-content | yes | **no**: the 18/82 split is from an Amazon category page where TV photos did not help comparison, not from the staff photo page. The note said "Even then" and the draft said "Even real staff photos took 18 percent". | **FAIL** |
| Ph12 | brand.dropbox.com/imagery | yes | yes | pass |
| R6 | web.dev optimize-lcp | yes | yes | pass |
| V1 | MDN img role | yes | yes | pass |
| V2 | MDN img role | yes | yes | pass |
| V10 | MDN pattern | yes | yes | pass |
| V12 | tylerxhobbs.com flow-fields | yes | yes | pass |
| V13 | edwardtufte.com sparklines | yes ("Sparklines are datawords: data-intense, design-simple, word-sized graphics") | yes | pass |

**Batch result: fail** (one claim misattributed). Sent back to the researcher. Researcher re-fetched the NN/g article: Ph2 context is the FreshBooks staff page ("the user spent 10% more time viewing the portrait photos than reading the biographies, even though the bios consumed 316% more space"); Ph3 context is the Amazon category page. Notes corrected (fix 1). Ph2 was not in the sample but shares the source, so it was rechecked and its context added.

### Fundamentals gate (after the citation fix)
1. Numbers re-checked: large text 24px or 18.66px bold (18pt and 14pt bold) correct; 4.5:1 and 3:1 correct; `object-position` default 50% 50% correct; forced-colors behavior confirmed against the spec (O18) and MDN (O8, O9).
2. Scripts re-run: `contours.mjs` deterministic (same md5 on two runs), `duotone_matrix.py` prints a valid matrix, `overlay_contrast.py` tested in the tester stage on real renders.
3. The skill's own advice on contrast, alt, color alone, focus and motion agrees with design-foundations `references/accessibility.md` (1.1.1 row, forced-colors pass).

### Fix list
| # | File | Change | Owner | Status |
|---|---|---|---|---|
| 1 | `kb/research/art-direction/02-photography.md` | Ph2 and Ph3 contexts corrected (FreshBooks staff page; Amazon category page) | researcher | done |
| 2 | `kb/drafts/art-direction/02-photography.md`, `references/02-photography.md`, SKILL.md | Fundamental 2 rewritten: photos that do not help the task are skipped (Amazon TV photos 18 percent of viewing time); staff photo finding stated with its 316 percent context | specialist | done |
| 3 | `references/04` and draft 04 | Grain recipe was pseudo-code (`url("data:image/svg+xml,...")`). Replace with a working, tested snippet from the tester's page | specialist after tester | done in round 2 |
| 4 | `references/04`, SKILL.md medium table | Gap: no rule for when image generation is available to Claude. Add a row: concepts and moodboards only, never final people, product or place; defer to design-graphic 03 for provenance | specialist | done |
| 5 | `assets/duotone_matrix.py` docstring | State that the luminance weights are applied to gamma-encoded sRGB (a perceptual approximation, not linear-light luminance) | architect | done |
| 6 | Pipeline | design-foundations `references/accessibility.md` line "Alt decision tree, text over images" should also route to design-art-direction `references/03`; logged in `design-art-direction-pipeline-notes.md` (critic cannot edit foundations) | editor-in-chief | logged |

### Expert bar
Would a top art director learn something? Yes on: concept from a true fact with a written reject test; data as illustration with deterministic seeds from brand IDs; texture that moves away from the text color; backplate over scrim because of forced colors (spec-backed); SVG lines plus HTML labels; rule-of-thirds evidence; gaze cue evidence; writing alt text inside the photo request. Nodding lines (one image one job, alt text basics) are kept short and sit in the floor where they belong.

### Verdict round 1
Revise (citation batch failed). After fixes 1, 2, 4 and 5: **approve for testing**, with fix 3 to land after the tester proves the grain snippet.

## Round 2 (after the tester's first build)
Re-read SKILL.md and references 03 and 04 against the tester's findings.
| # | File | Change | Status |
|---|---|---|---|
| 7 | draft and `references/04`, recipe 4 | Fix 3 landed: grain recipe replaced by the snippet tested in `coffee-after.html`, with dark blend and forced-colors fallback | done |
| 8 | draft and `references/04`, recipe 2; SKILL.md move 5 | New rule from a measured failure: every label beside a line gets a solid backplate; place labels where the line is not | done |
| 9 | draft and `references/04`, recipe 3; SKILL.md move 14 | New rule: sparklines next to large numbers need a container query; lint cannot see SVG over text | done |
| 10 | draft and `references/04`, recipe 1; SKILL.md move 13 | Draw once, use twice (`<defs>` plus two `<use>`, stroke on the use); real sizes from the test page | done |
| 11 | draft and `references/03`, worst-pixel check | `--exclude-near` downgraded to a rough screen (measured false fail 2.00:1 vs a true 5.28:1); clean render required; overlay-check script documented | done |
| 12 | draft and `references/03`, worked example | Corrected to what was built: stage lines darker than the stage because no text crosses them; band lines flip with the theme; measured values added | done |

Citation check for the claims added in round 2: none new (all are measurements from the tester's pages, labelled as such).
Em dash grep (U+2014) over `kb/briefs|research|drafts/art-direction`, `kb/reviews/design-art-direction*`, `kb/tests/design-art-direction*`, `skills/design-art-direction`: 0.

### Verdict round 2
**Approve.** Fundamentals hold, accessibility advice agrees with design-foundations, every number traced to a source or a labelled measurement. Remaining weakness is outside the skill's control in this environment (no photos, no display face), and the skill says so.
