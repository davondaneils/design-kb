# Tests: design-art-direction

Tester, 2026-10-09. Briefs and rubric: `kb/briefs/art-direction/slice-test-briefs.md` (editor-in-chief). Pages, lint JSON, screenshots, blind pairs: `kb/tests/design-art-direction/`.

## Method
- **Baseline ("before")** = the with-skill pages from the color pilot, unchanged (`coffee-before.html`, `dashboard-before.html`, copies of `kb/tests/design-color/*-with.html`). Davon ranked them better than generic but "not super special".
- **After** = the same pages through design-director, the landing or dashboard playbook, and design-art-direction. Copy and content facts are unchanged except three lines the concept rewrote (subscription headline "A new hill at your door", one perk, the story intro). Layout changes forced by the art direction: the story section gained a full-width figure; the dashboard gained a bottom row (empty and loading states). Type, color tokens and spacing are untouched.
- **Clean context**: not applicable in the usual sense. The comparison is before and after this domain, on the same baseline, by the same agent that wrote the skill. Treat the judgement as the author's and re-run blind (pairs below).
- **Reproducible art**: `coffee-after.html` is built by `node kb/tests/design-art-direction/build.mjs` from `coffee-after.src.html`, using `skills/design-art-direction/assets/contours.mjs` (seeded, deterministic) and the batch 0412 roast log in the build script.
- **Network limit**: no photos, web fonts or exemplar pixels could load. Every visual is inline SVG or CSS. Exemplar comparison below is from memory and text fetches, and says so.

## Concepts built
| Page | Concept (one sentence) | Reject test | Where it shows |
|---|---|---|---|
| Coffee | "The hill and the fire: every coffee is drawn as the contour map of the hill it grew on and the roast curve that finished it." | Does it show a place, a measurement or the roast? | Hero bag printed with the Guji map that continues off the bag onto the stage, summit marker at 2,100 m; label sparkline of the roast; subscription band map texture; a contour tile per coffee, one line per 150 m (so higher farms carry more lines); the full batch 0412 roast curve in the story; the roastery's own coordinates in the footer |
| Dashboard | "Only counts are pictures: every image in the product is a count, drawn with the chart's own line." | Does it show a number or the state of a number? | Tally-mark logo; 12-week sparkline per KPI (churn end dot in danger color); Funnels empty state drawn from chart parts with the tally mark in the last step; loading skeleton that mirrors the cohort rows |

## Lint (`node tools/lint.mjs`, final versions)
| Page | Before | After |
|---|---|---|
| Coffee | PASS, 0 fail, 17 warn (2 axe needs-review, 15 targets under 44px at 390) | **PASS, 0 fail, 17 warn** (same classes: 2 axe needs-review, 15 targets under 44px) |
| Dashboard | PASS, 0 fail, 16 warn | **PASS, 0 fail, 17 warn** (one more target warning: the new "Create a funnel" button at 40px tall) |

## Worst-pixel checks (text over art; axe reports these as "needs review")
Run with `node kb/tests/design-art-direction/overlay-check.mjs <page> <selector> <width> <scheme>`, which hides the text, screenshots the clean background and runs `assets/overlay_contrast.py` on every text box.
| Area | 1440 light | 1440 dark | 390 light | 390 dark |
|---|---|---|---|---|
| Subscription band over contour map (15 to 18 text boxes) | worst 5.28:1, all pass | worst 13.44:1, all pass | all pass | all pass |
| Roast curve labels, first build | **2 fail, 2.85:1** | **2 fail, 1.74:1** | 1 fail | 1 fail |
| Roast curve labels, after fix (solid backplates, labels above-left of a rising line) | all pass | all pass | all pass | all pass |
The band numbers equal the plain band contrast: lines lighter than the band under dark text (and darker under light text) cost nothing. The curve-label failure was invisible to axe and the lint; it is now a rule in the skill.

## Judged items (FOUNDATIONS `[judged]` rows), after
| Item | Coffee | Dashboard |
|---|---|---|
| 3 Non-text contrast | Roast curve orange 600 on white 5.6:1, orange 300 in dark; contours decorative (hidden) | Sparkline end dots and lines decorative next to stated values; empty-state art decorative; chart unchanged |
| 11 Not color alone | Altitude stated in text on every card; curve events labelled | Churn sparkline: red dot plus "worse" in text plus labelled `role="img"` |
| 12 Hierarchy | Blurred screenshot: headline, bag, orange CTA, in that order | KPI row first, sparklines secondary to numbers |
| 13 Consistency | One line weight family (1 and 1.5 contours, 2 curve), one annotation style (12px tabular), radius family unchanged | Sparkline 1.5px, chart 2px, illustration 1.5 dashed plus 2 mark; same radius family |
| 14 Both themes | Illustration tokens remap: lines warm 300 to warm 800, curve orange 600 to 300, band lines flip lighter to darker, grain multiply to screen | Tokens unchanged from baseline; new parts use them |
| 15 States | Error state kept | Empty (Funnels) and loading (Retention, `aria-busy`, `role="status"`, shimmer only without reduced motion) added |
| Art a11y | Hero figure `role="img"` with an `aria-label` naming the map and lot; curve figure captioned in words; textures `aria-hidden` | Each sparkline `role="img"` with a trend sentence; empty-state art hidden |
Gate: **pass** on both.

## Issues found and fixed during testing (3 tester rounds)
1. Page weight 308 KB: the hero map was inlined twice. Fixed with one `<defs>` map and two `<use>`, stroke inherited per use: 122 KB. Now a skill rule.
2. Roast log spiked 10 deg C in 10 seconds before first crack. Rebuilt from a falling rate of rise (20 to 9 deg C per minute), labels derived from it.
3. Turning-point label crossed the curve on phones. Axis range widened to 60 deg C so the label sits under the dip.
4. Curve labels at 2.85:1 and 1.74:1 where the line passed behind them (above). Fixed with backplates.
5. Dashboard sparklines overlapped the KPI numbers at 390 and 1024 to 1279px; lint cannot see SVG over text. Fixed with a container query. Now a skill rule.
6. Dashboard bottom row stretched the table to the side column's height. Re-laid out as table full width, then empty and loading side by side.
7. The bag read flat; round 3 added side gussets, a blurred fold highlight, the bottom gusset seam and a seal shadow.

## Exemplar comparison
**Limit:** exemplar pixels are blocked (`kb/exemplars.md`); this is from memory of the public pages plus WebFetch text of Stripe, Mercury, Linear, family.co and teenage.engineering homepages. Repeat with real screenshots.

| Page | Exemplars | Rubric 3 concept | 4 specificity | 5 finish | 6 restraint | 7 dark | Overall |
|---|---|---|---|---|---|---|---|
| coffee-after | apple.com product pages, family.co, teenage.engineering | close | close | **clearly below** | close | close | **clearly below, much nearer than before** |
| dashboard-after | Linear app, Stripe Dashboard, Vercel Dashboard | close | close | close | close | close | **close** on imagery and states |

Why, in pixels:
- **Coffee, what is now close.** There is a real idea and it is everywhere: hide the logo and the contour maps, the roast curve with first crack and the 2,100 m summit could only be this roaster. The map running across the bag's edge onto the stage is the kind of move a studio would present. The story section's single large curve is the "one big statement" rest beat the playbook asks for, and it is information, not decoration. Dark mode carries the concept (the band at night is the best screen on the page).
- **Coffee, what is still short.** Apple's product pages put a photographed or rendered object at near-photographic fidelity in the first screen; ours is a competent flat illustration with soft shading, and on phones it sits below the fold. The band and stage maps are seeded noise around stated peaks, not real terrain data (a real DEM would make the claim literally true). Typography is unchanged: Charter as a fallback serif and Inter, no chosen display face, which caps "special" more than imagery now does. No motion: teenage.engineering and Apple both use the object itself in motion; a reduced-motion-safe slow draw of the roast curve would be the next move.
- **Dashboard.** The sparklines, tally-mark logo and chart-part empty state give Tally a recognisable voice without adding chrome, which is how Linear and Vercel do it. Still missing (not this domain): a real icon set, density options, a keyboard layer, and table reflow at 390 (it still scrolls inside its region).

## Verdict
- **Gate:** pass on both pages, lint 0 fails before and after.
- **Dashboard:** pass (close on rubric 3 to 7, clearly better than baseline).
- **Coffee:** clearly better than baseline and close on 3, 4, 6, 7; **clearly below on 5 (finish)** because no photograph or rendered product can load and type is unchanged. Under the editor's rule this is a fail on one rubric item after 3 rounds: escalated to Davon with the open issues below rather than claimed done.
- Ship decision for the skill: **ready for review**, held at testing until Davon's blind ranking (below) agrees.

## Open issues (escalated)
1. Real photography for the coffee hero and story (request ready: `photo-request.md`).
2. Display typeface: needs design-typography with a self-hosted face; the bundled fonts on this machine (Charter, Caladea, Inter) are the ceiling.
3. Real terrain data for the contour maps (a DEM tile per farm) to make the map literally true; the generator already takes peaks, a DEM import would replace the noise.
4. Optional motion: draw-on of the roast curve on first view, removed under reduced motion (design-motion).

## Blind pairs for Davon
`kb/tests/design-art-direction/blind/pair-{1,2,3}-{A,B}.png`, instructions in `blind/README.md`, key in `blind-key.md` outside the folder. Ask also: is either one "special", or only better?

## Screenshots
`kb/tests/design-art-direction/shots/{coffee,dashboard}-{before,after}-{390,1440}-{light,dark}.png` (16 files). Copies of the after shots (desktop light, phone dark) are in `/mnt/project-files/design-kb/wave/art-direction/`.
