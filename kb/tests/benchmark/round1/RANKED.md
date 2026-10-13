# Round 1: fundamentals that fall short, ranked

Source: the two fresh-context critic reviews (`kb/reviews/benchmark-round1-landing.md`, `kb/reviews/benchmark-round1-app.md`) and the measured scorecards (`score-landing.md`, `score-app.md`). Ranked by what a user would feel first: a false statement, then an unreadable or invisible state, then reading comfort, then consistency.

"Said" means a skill already has the rule and the builder did not follow it. "Silent" or "wrong" means no skill would have prevented it. The pattern matters: **10 of the 14 were already in a skill, at least in part**, buried in a reference the builder read and did not apply. Writing the rule again does not fix those; a lint check or a line in the hand-over list does.

| # | Shortfall (page) | Measured | Skill | Said or silent | Fix in this PR |
|---|---|---|---|---|---|
| 1 | Screen goes false after its own primary action: "estimates until you approve" still shown after Approve; "People paid 38" under "Nobody has been paid" (app) | 4 false sentences across 2 states | design-playbook-dashboard non-negotiable 10; lint-truth tests ticks, not actions | Said; tool gap | Every primary action gets a post-action `?state=` URL that is rendered, linted and claim-checked; KPI labels true in every state (dashboard playbook, design-product-ui 05, director) |
| 2 | Times without a zone, facts cut when the hero card reflows ("lands 6:48 pm" next to "8:52 am ET") (landing) | 5 of 7 rows at 390 to 1023 | design-layout rule 18 (said); FOUNDATIONS Content mechanics (silent on zones) | Both | FOUNDATIONS: a page with times in more than one zone labels every time; `claims_inventory.mjs` warns `ZONE` |
| 3 | Selected filter segment 1.21:1 light, 1.08:1 dark against its track, same weight (app) | 1.08 to 1.21:1, need 3:1 | design-color contrast ref (said); design-product-ui 04 line 9 blesses "a selected surface" with no number (wrong) | Both | New lint check `selected-state`; design-product-ui rule rewritten with the number |
| 4 | Pressed primary reads as disabled (landing) | delta E 6.5 | design-color line 82 (said); silent on dark ink on a mid fill | Both | design-color and design-polish: pressed moves away from disabled, delta E 15 or more; never disable with `opacity` on a brand fill |
| 5 | Reading text too small: 14px is the most common size on the marketing page; 48% of app text at 390 is 12px | Stripe 16, Linear 15 | design-typography F2 (said); design-product-ui SKILL lines 35 and 51 contradict | Both | New lint check `reading-size`; design-product-ui contradiction resolved (14px on phones for line 2 of a row) |
| 6 | Phone measure 33 characters per line (landing) | exemplars 34 to 50 | FOUNDATIONS sets only a ceiling at 390 | Silent | FOUNDATIONS floor of 35 at 390; lint `measure` fails under 35 |
| 7 | Count split from its noun ("12 / people") (landing) | 1 break at 390 | FOUNDATIONS no-break list | Silent | Add number plus count noun to the no-break list |
| 8 | The committed total is the same size as "7 currencies", and Approve scrolls away with no amount on it (app) | all KPIs 31px; Approve gone after 900px | design-product-ui 06 and design-layout 05 (silent on approval screens); design-copy 02 (said: amount on the button) | Both | design-product-ui 06: review-and-commit screens |
| 9 | 38-row table with no sticky header; phone row target 24px inside an 89px row (app) | 1,824px table | design-product-ui line 68 (said); 01-tables line 68 teaches a target that only feels large (wrong) | Both | 01-tables: stretch the row link over the row |
| 10 | Control borders at 3.02:1 and 3.04:1 on dark raised and tinted surfaces (both) | 0.02 to 0.04 margin | FOUNDATIONS covers muted text on tints, not borders | Silent | design-color: measure borders on every raised and tinted surface in dark, keep 3.3:1 |
| 11 | Phone menu text 12px off the logo edge; a 44px box on an inline link breaks paragraph leading (landing) | 12px offset, 33px line gap | accessibility.md line 89 (said); design-layout silent on menu panels | Both | design-layout: hang hit-area padding outside the text edge; design-polish: never put `min-block-size` on something that can sit in a sentence |
| 12 | Phone nav hides every link and the primary action; trigger never reads "Close" (landing) | 0 links at 390 | design-ux line 58 (said) | Said | Director hand-over list |
| 13 | KPIs stack to 4 rows at 768 instead of 2x2 (app) | 320px of first screen | design-layout 05 line 35 (said) | Said | Director hand-over list |
| 14 | Status painted twice (amber panel and amber table rows) (app) | 3 rows plus panel | design-layout 06 line 73 against Linear's measured rule | Contradiction | design-product-ui 01: status in tables is glyph plus word |

## Above the gate (expert gaps)
- **No ownable image in the first screen** (landing, clearly below): the concept lives in the copy. design-art-direction knows where the motif goes, not that it must be visible and drawn in the first screen. Fix: reject test in the landing playbook signature moves.
- **Motion has no voice** (landing, clearly below: 1 duration and 1 curve against the exemplars' 5 to 8 and 4 to 9): design-motion reference 03 forbids a hero entrance, FOUNDATIONS and the landing playbook allow one up to 800ms. The builder read both and chose none. Fix: resolve the contradiction in favor of FOUNDATIONS, and teach native `<details>` animation.
- **Dark theme is a remap, not a retune** (landing): solid hex hairlines and a full-chroma orange band, where Linear uses white-alpha borders. Fix: design-color dark rules for alpha borders and lower chroma on large brand fields.
- **Tablet is a stretched phone** (landing): design-layout 04 gives 640 to 1023 one line.
- **Commit dialog restates only one of three warnings; rate lock has no clock** (app): design-product-ui 05 silent.

## Tool defects found on the way (fixed in this PR where marked)
- `kb/teardowns/measure.mjs` could not read `oklch()` colors and only measured light: fixed (canvas conversion, `--scheme`).
- `tools/lint.mjs` counted text inside closed `<details>` as visible (14 false fails): fixed.
- Contradictions builders reported: hover 150ms in design-polish against 100ms in FOUNDATIONS; `--duration-page` 600ms in design-motion 07 against 400ms; content width 1280 against 1136; container queries in `em` in design-frontend against `rem` in FOUNDATIONS; `none` inside shadow tokens; two items numbered 6 in design-typography. Fixed in the skill text.
