# Changelog: design-layout

## 0.2 (2026-10-10, wave 2, rendered test)
- New reference 06, page pacing, signature moves, phone editing and dashboard grids: flatplan with kinds of loudness, the margin column, one directed grid break, data drawn into rules, ruled index over cards, proof next to claim, supporting pane at 2:1 with a 320px floor, alerts as rows, a phone edit verb list (keep, reorder, crop, thumbnail, merge duplicate, shorten label, collapse, defer; never cut a unique fact), tablet and container query rules, the `gap` versus `column-gap` pitfall.
- SKILL.md: gate rules 18 (phone is edited, not shrunk; source order; no unique fact cut) and 19 (next section peeks at 1440 x 900; one page grid); workflow step 2b (flatplan) and wider test widths; expert moves 14 to 20; expert move 13 now says to re-run the lint after compressing rows; dashboard skeleton row order; reference map row for 06; measure note that `ch` resolves on the element's own font (52ch re-measured: 63 to 68 characters).
- Tested on rendered pages (kb/tests/design-layout.md run 2): coffee and dashboard improved from the combined pages, lint 0 fails on 2 pages, 11 state URLs and 2 state sheets; coffee phone 17 percent shorter with the action in the first screen.
- Critic (kb/reviews/design-layout.md run 2): one citation quote completed after the 20 percent re-fetch; two page fixes.

## 0.1.1 (2026-10-09, editor-in-chief)
- Measure default `66ch` replaced by `52ch` in SKILL.md and references 01, 04, 05 (FOUNDATIONS v0.3; typography measured 66ch at 81 to 86 characters in every face).
- Tables and collections link to design-product-ui reference 01 for responsive strategies and table semantics; hand-offs name design-product-ui, design-polish and design-art-direction.

## 0.1 (2026-10-09)
- First release. SKILL.md with a 17-rule fundamentals gate (structure, hierarchy, WCAG 2.2 AA, responsive), workflow, core decision tables, 13 expert moves, page skeletons and reference map.
- References: 01 grids and structure, 02 spacing and rhythm, 03 hierarchy and gestalt (with poster and print composition), 04 responsive and adaptive, 05 page composition and density.
- Defaults aligned to the shared foundation contract v0.1 (spacing tokens, breakpoints, measure, radius, target sizes).
- Critic fixes applied (kb/reviews/design-layout.md): muted text contrast gate, unsourced claims removed or labeled, container margin math, token naming, dialog widths, logical properties and RTL, graphic composition.
- Tester fixes applied (kb/tests/design-layout.md): dashboard tablet and phone behavior, density on touch, stacked priority order.

Review interval: yearly (foundation domain). Next review due 2027-10. Recheck sooner if `text-box-trim`, `reading-flow` or Material window size classes change status.
Related skills: design-color, design-typography, design-ux, design-frontend, design-product-ui, design-art-direction, design-polish, design-graphic, design-copy, design-motion; website-strategy, copywriting, sales-funnels.
