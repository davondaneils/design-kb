# Round 4 critic review: coffee landing page and Tally dashboard

- Reviewer: critic, clean context (did not build the pages). Branch `restructure` at `b78c90a`.
- Judged against: `CLAUDE.md` quality bar, `kb/FOUNDATIONS.md` v0.4.1 (16-item checklist, token schema, content mechanics), `skills/design-foundations/references/fundamentals-checklist.md`, `skills/design-director/SKILL.md`, both job playbooks, `kb/teardowns/INDEX.md` and the teardowns it names (stripe-home, linear-home, vercel-home, ramp-home and apple-macbook-air with their "Live capture (2026-10)" sections; linear-app, stripe-dashboard, vercel-dashboard), and `kb/reviews/round3-critic.md`.
- Pages: `kb/tests/round4/coffee.html`, `coffee-states.html`, `dashboard.html`, `dashboard-states.html`, built from the `.src.html` files. Line numbers refer to the `.src.html` sources unless a built file is named.
- Order of work: sections 1 to 5 were written before opening `kb/tests/round4.md`. Section 6 is the comparison.

## Verdict

**Revise. Both pages fail the fundamentals gate on judged items, although all 31 lint runs pass.** The fails are fewer and smaller than round 3 (7 judged fails then; 5 now, each a one-line to ten-line fix), and every round 3 class the lint now covers stayed fixed. What is left is the class the lint still cannot see: a sheet-only CSS rule that paints nothing, a caveat that outlives its cause in another state, and two promises about money that disagree across a dialog.

- Coffee: fails item 13 (the option hover layer is still 4 percent, a round 3 finding left unfixed; control sizes as raw px) and item 16 (the slip says "charged on roast day", the cart and checkout charge the subscription today).
- Dashboard: fails item 13 ("Invite  a teammate" split by a 12px gap in the header primary), item 15 (the state sheet's 75 percent usage meter draws an empty bar under "7.8M of 10M") and item 16 (the sample-data states keep "Partial since 2:05 pm" and the iOS warning glyph while the alerts that explain them are hidden).

Against the exemplars (opinion): coffee is **below** Apple MacBook Air and Stripe; the dashboard is **close** to the Linear app and the Vercel and Stripe dashboards at 1440 and 1024, below Linear on density.

## 1. Numbers measured (re-run, not copied)

Tools were run from the repo root with Chromium at `/opt/pw-browsers`, pages served over `python3 -m http.server` so lazy images load (rendering the files from disk with `tools/render.mjs` leaves the two below-the-fold photos blank; the builder's `render-all.mjs` serves over HTTP for this reason). Lint JSON went to the session scratchpad (`--out-dir`), so the committed `.lint.json` files are untouched. My probe scripts are in the scratchpad and are not committed.

| Check | Result |
|---|---|
| `tools/lint.mjs` coffee page plus 12 states (`--states`), coffee sheet | 14 runs, all PASS, 0 fail. Warnings: page 9 (3 targets under 44 at 390 on `.card-link`, 4 fluid display sizes, 1 sticky-focus on the fixed skip link, 1 fallback), states 7 to 16 (checkout states add `svg-overlap` from content behind the open dialog), sheet 3 |
| `tools/lint.mjs` dashboard page plus 14 variants, dashboard sheet | 16 runs, all PASS, 0 fail. `truth`, `proportion`, `sticky-header`, `occlusion`, `squash`, `grid-edge`, `run-together`, `word-break`, `nav-parity` all pass. Warnings: page 10 (9 targets under 44 at 390, 1 fallback); first-data 1 `proportion` warn ("Share of views sums to 100.1 over the 4 rows shown", rounding; the table keeps `data-share-base="214"` in this state, while round4.md says 4); sheet 45 target warns |
| `claims_inventory.mjs --year 2026` coffee; coffee `?state=cart --render` | Exit 0, "No mechanical flags" |
| `claims_inventory.mjs --year 2026` dashboard | Exit 0; 1 `PERIOD` warning ("vs last week" and "vs previous 12 weeks"). Each basis is named where it is read (KPI deltas and table column say "vs last week", the chart legend says "vs previous 12 weeks"), which playbook rule 12 allows |
| `search-check.mjs` coffee (public); dashboard `--expect private` | Both PASS, 0 fail, 0 warn. Coffee JSON-LD now carries `Product` and `Offer` (round 3 fix 7 done); dashboard `noindex, nofollow` |
| `conversion-audit.mjs` coffee | No fails; 1 warn (3 add-to-cart buttons with no shipping cost beside them at 390) |
| `icon_audit.mjs` coffee, dashboard | Both PASS. Dashboard strokes 1.5 (default), 1.75 (600-weight active label) and 1.25 (12px sort arrows): stroke set beside text weight, as FOUNDATIONS Icons allows and `icons.mjs` documents |
| Weekdays (2026) | Mon Oct 12, Tue Oct 13, Wed Oct 14, Fri Oct 16, Thu Oct 22, Tue Oct 27, Tue Nov 10, Sun Nov 1, Tue Oct 6, Wed Oct 7, Tue Jul 21 all correct. Jul 21 to Oct 12 is 84 days, 12 weeks |
| Coffee arithmetic | Ledger 4.10 / 1.80 = 2.28 (2.3x right); rules 200, 291, 455px at 1440 (to scale). Rating bars 1,040 / 1,284 = 81% of the track (measured 226 of 280px). Each subscription price is $3 under its single bag. Oct 13 + 14 = Oct 27, + 28 = Nov 10. Cart $18 + $21 = $39 |
| Dashboard arithmetic | 48,210 / 44,600 = +8.09%. 31,040 + 9,870 + 7,300 = 48,210. Platform bars 64.4%, 20.5%, 15.1% of the track (measured 236, 75, 56 of 368px at 1440). Table shares against 112,560 views: 21.48, 17.70, 10.13, 7.76, 5.34, 1.32 (all match); six rows 71,738 = 63.73% ("63.7%" right); `/pricing` row fill 244 of 1,135px = 21.5%. Platform prior weeks from the rounded deltas give 44,429 to 44,860, which contains 44,600. Limit: 7.8M by Oct 12 runs out on about Oct 16 (right) |
| Display sizes and leading (computed) | Coffee H1 50 / 88 / 63 / 77px at 390 / 768 / 1024 / 1440, H2 39 / 52 / 60 / 75px, all at line height 1.1 (round 3 fix 9 done). H1 tracking -0.025em |
| Layout probes (`getBoundingClientRect`) | Coffee promise columns: tops equal at every width; body text 25px lower in column 1 at 1024 (its heading wraps to two lines). Subscription band: left column ends 159px above the slip at 1440 and **343px** above it at 1024; the slip is `position: static`. Ledger: label and price boxes still touch (0px) but the text no longer runs together at any width. Dashboard header 64px at every width against `scroll-padding-top: 80px` |
| `kb/tests/round4/check.mjs` (repo served on 8765) | 91 of 91 PASS, reproduced. It tests the round 3 findings at the widths they failed; none of this round's five fails is in it |
| Touch, coarse pointer emulated (390, `hasTouch`) | Dashboard `#live-btn` ("Pause", the WCAG 2.2.2 control) 43x24px; KPI pickers 136x44; row menus 44x44 |

Contrast (WCAG formula on the token hex values; tints mixed in sRGB):

| Pair | Ratio | Needs |
|---|---|---|
| Coffee muted `#79685b` on bg / white / sunken | 4.95 / 5.32 / 4.39 (sunken carries `text-muted-on-tint` `#4f4238`, 7.98) | 4.5 |
| Coffee muted on the option hover: 4% layer / 8% layer | 4.93 / 4.56 (the page switches `.sub` to on-tint on hover, so both pass) | 4.5 |
| Coffee ink on band `#f26b21` / band lift `#f7884a` | 5.28 / 6.56 | 4.5 |
| Coffee rating fill against its track on the band (light; dark) | 4.13; 9.83 | 3 |
| Coffee white on primary `#b14500`; primary against dark bg | 5.64; 3.34 | 4.5; 3 |
| Coffee focus ring light on bg; dark | 5.25; 10.08 | 3 |
| Coffee input border `#998779` on white; dark on `#1e1813` | 3.44; 5.10 | 3 |
| Dashboard muted `#676c73` on white / bg / share fill / warning and danger tints | 5.29 / 4.93 / 4.73 / 4.92 / 4.91 | 4.5 |
| Dashboard success, danger, warning text on white | 6.77, 5.80, 5.39 | 4.5 |
| Dashboard dark success, danger, warning on `#181a1c` | 10.11, 9.25, 9.51 | 4.5 |
| Dashboard focus ring light; dark | 5.03; 7.42 | 3 |
| Dashboard input border and previous-period line, light; dark | 3.44; 5.07 | 3 |
| Dashboard platform bar fill against its track | 4.39 | 3 |

## 2. Fundamentals gate, item by item

My renders: 390, 768, 1024 and 1440, light and dark, for both pages and both sheets; the committed state renders in `kb/tests/round4/shots/states/` were read at 1440 and 390 for every state.

### Coffee landing page (`coffee.html`, `coffee-states.html`)

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | axe, light and dark, 390 and 1440 | Pass | lint `axe` on the page, the sheet and 12 states |
| 2 | Text contrast | Pass | lint `axe` and `overlay`; pairs above |
| 3 | Non-text contrast 3:1 | Pass | Borders 3.44 and 5.10, rings 5.25 and 10.08, rating fill 4.13, dark button edge 3.34 |
| 4 | Targets | Pass | 3 warns: the lot name links are 31px tall at 390, but each row's `::after` covers the whole row |
| 5 | Measure | Pass | lint `measure` |
| 6 | Type scale | Pass | lint; four fluid display sizes inside the clamp rule |
| 7 | Spacing | Pass | lint |
| 8 | No horizontal scroll | Pass | lint `overflow` at four widths |
| 9 | Focus, skip link, sticky header | Pass | lint `focus`, `focus-shape`, `skip-link`, `sticky-header`. The `sticky-focus` warn names the fixed skip link (z 30): a false positive, as in round 3 |
| 10 | Reduced motion | Pass | lint `motion` |
| 11 | Not color alone | Pass | Errors carry an icon and text (`coffee.state-checkout-error`, sheet); body links underlined; roast meter labelled in words |
| 12 | Hierarchy | Pass | One filled CTA per screen (lint `primary`). At 390 the first 844px hold "single-origin coffee", $18 and the primary. Advisory under section 3: at 1024 and 1440 the section H2s are 96 percent of the H1 |
| 13 | Consistency | **Fail (judged)** | (a) The subscription option hover is still `color-mix(... 4%, surface)` (`coffee.src.html:429`; the sheet copies it, `states.mjs` `.opt.is-hover`). FOUNDATIONS state layers: hover 8 percent. Round 3 listed this as 13(d); it is unfixed and undeclared. (b) Control heights are raw `min-height: 48px` and `40px` (`coffee.src.html:216, 227, 554`) where FOUNDATIONS names `--size-control-lg` and `--size-control-md`; the file has no `--size-control-*` or `--size-icon-*` token, and the motion block still cites "FOUNDATIONS v0.3" (line 134). The dashboard file in the same round has all of them. |
| 14 | Both themes, `color-scheme` | Pass | Dark is remapped (band `#f26b21` to orange-950, surfaces step up); the cart badge is visible in dark now (round 3 minor fixed). Advisory: the hero photo is the light daylight shot in both themes |
| 15 | States | Pass | lint on 12 states and the sheet. The Sending cell now shows spinner and label (round 3 fix 5 done). Sheet note: at 1440 the "Menu: closed, hover, open, focus" cell is empty (the page hides `.menu-toggle` at 768 and up with `!important`, line 271); the four states render at 390, so coverage holds |
| 16 | Copy true and consistent | **Fail (judged)** | **When the subscription is charged is said two ways.** The slip term line: "$18 every 2 weeks, charged on roast day. First roast Tue, Oct 13; next charge Tue, Oct 27" (`coffee.src.html:836`, rebuilt at 1258; comment at 1073). The cart and checkout then put that same $18 into "Due today $39.00" and "Pay $39.00" (`coffee.src.html:1150-1153, 1194`; `shots/states/coffee.state-cart-*`, `-checkout-*`), on a page whose hero says "Order by Mon, Oct 12 for the Oct 13 roast", so today is not roast day. A subscriber reads one promise about money and gets charged under the other. Smaller, same item: the empty cart says the Guji was "roasted Tue, Oct 13 in Portland and shipped Wed, Oct 14" (past tense for dates still ahead), and the cart's "Shipping: Free with your subscription" for a single bag is a third shipping rule the page states nowhere else ("Single bags ship for $6, free over $40. Subscriptions always ship free.") |

### Tally dashboard (`dashboard.html`, `dashboard-states.html`)

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | axe | Pass | lint on the page, the sheet and 14 variants |
| 2 | Text contrast | Pass | Pairs above, including muted text on the share fill (4.73) and both tints |
| 3 | Non-text contrast | Pass | Rings 5.03 and 7.42; borders and comparison line 3.44 and 5.07; platform bars 4.39 |
| 4 | Targets | Pass with warns | 9 warns at 390. Coarse pointer emulated: "Pause" is still 43x24 (round 3 fix 10 asked for 44 under `pointer: coarse`; only compact rows were lifted, `dashboard.src.html:132`) |
| 5 to 8 | Measure, scale, spacing, overflow | Pass | lint |
| 9 | Focus, sticky header | Pass | Header 64px at 390, 768, 1024 and 1440 against `scroll-padding-top: 80px`; lint `sticky-header` and `sticky-focus` pass |
| 10 | Reduced motion | Pass | lint `motion` |
| 11 | Not color alone | Pass | Deltas carry arrow, sign and "down" or "worse"; alerts carry icon and word; the comparison line is dashed |
| 12 | Hierarchy | Pass | Header one row at every width; search folds into Commands below 1024 content width; lint `occlusion` and `squash` pass at four widths (round 3 fix 1 done) |
| 13 | Consistency | **Fail (judged)** | (a) In `?state=first-data` the header primary reads "Invite&nbsp;&nbsp;&nbsp;a teammate" with a gap of about 12px, three word spaces wide: the label is `Invite<span class="live-more">&nbsp;a teammate</span>` inside an `inline-flex` button with `gap: var(--space-3)` (8px, `dashboard.src.html:268, 805`), so the gap and the no-break space add up (`shots/states/dashboard.state-first-data-1440-light.jpg`, top right). The one filled button on the screen has a broken word space. (b) The sheet uses `--color-warning-mark`, a token that exists nowhere (`dashboard-states.html:786`, from `states.mjs`); the round 3 `*-mark` names were folded into `--color-{role}` |
| 14 | Themes | Pass | Dark remapped: lighter surfaces, ring and highlight, transparent shadows; teal primary carries dark text (7.54) |
| 15 | States | **Fail (judged)** | The sheet's "75% and up: warning, projected date" cell draws an **empty bar** under "7.8M of 10M, Limit Oct 16" (my render of `dashboard-states.html` at 1440, light and dark, bottom row). Cause: `.usage.warn .meter i { background: var(--color-warning-mark) }` and the ring both use the undefined token, so the declarations are invalid at computed time and the fill paints nothing. The one warning state of the meter is the one cell the sheet fails to show, and a bar that reads 0 beside "7.8M of 10M" is also false. Same class as round 3's blank Sending pill: a sheet-only rule that paints nothing, passed by the lint (`hidden-content` needs the text gone; `proportion` needs a percent). The real page is fine: `?state=limit` fills the sidebar meter in warning amber (`dashboard.src.html:572`) |
| 16 | Copy true | **Fail (judged)** | In the sample-data states (`?state=first-run`, `listening`, `check-failed`) the demo tiles still print "Partial since 2:05 pm" under Conversion and Revenue, and iOS keeps its warning glyph, while `.attention` and the answer sentence that explain them are hidden by `html[data-phase~=setup]` (`dashboard.src.html:655`). The header says "Sample data, nothing tracked yet" and the guide says the workspace was created at 1:58 pm, so a caveat about a 2:05 pm outage reads as the user's own data breaking. Round 3 asked that no state show a number it cannot have; this is a caveat it cannot have. Everything round 3 found here is fixed: empty and setup meters and footnotes, live ticks (lint `truth` with 3 ticks), share base, 0 to 100 bars, named bases |

## 3. Round 3 critic failures: fixed or not

| Round 3 finding | Status | Evidence |
|---|---|---|
| Coffee 16: shipping said three ways; "tasted twice" against "Two of us" | Fixed | "Roast to ship 1 day", "shipped the day after the roast", step 3 "the day after, on Wednesdays and Saturdays", "First bag ships Wed, Oct 14"; step 2 "We taste every batch twice" |
| Coffee 16: store rating beside the product | Fixed | "4.7 from 1,284 subscriber reviews" |
| Coffee 13a: promise columns off a shared edge | Fixed at 1440 (all tops equal); at 1024 column 1's heading wraps and its body sits 25px low (advisory, fix list) |
| Coffee 13b: ledger "Sep 30$2.62" | Fixed visually: text no longer touches at any width (cell boxes still meet at 0px) |
| Coffee 13c: slip options breaking "Pour-over" at 1024 | Fixed: two columns at 1024, three at 768 |
| Coffee 13d: option hover 4 percent | **Not fixed** (`coffee.src.html:429`) |
| Coffee 15: blank Sending pill | Fixed |
| Coffee fix 6: 280px hole in the band at 1024 and up | Half fixed: 159px at 1440, **343px at 1024** |
| Coffee fix 7, 8, 9, 10 (JSON-LD, italic budget, display leading, roast chart bleed) | Fixed: `Product` and `Offer` present; section H2s are roman; leading 1.1; gridlines stop at the container and the caption sits above the chart under 1280 |
| Coffee "also": "$18 on subscription" at 390; dark cart badge; "See all 9 coffees" below its heading | First two fixed; the link still precedes its heading at 390 and 768 |
| Dashboard 12, 13: header breaks and covers Pause at 768 and 1024 | Fixed |
| Dashboard 13: tokens at v0.3 | Fixed on the page (`success`, `danger`, `warning`, `info`, `surface-sunken`, `text-muted-on-tint`, `--size-control-*`, `--size-icon-*`, `--elevation-card`); the sheet still carries a dead `*-mark` name (new fail above) |
| Dashboard 15: sheet missing disabled, busy, error and panels | Fixed in scope (disabled, two busy buttons, field error, loading, error, empty, no-match panels); the 75% meter cell is broken (new fail above) |
| Dashboard 16a: empty and setup states show 3.6M and 48,210 | Fixed ("No events yet", "No platforms yet") |
| Dashboard 16b to d: live feed contradicts the outage, WAU falls, stale totals | Fixed (lint `truth` passes 3 ticks with the data-attribute contract) |
| Dashboard 16e: shares sum to 100 over 6 of 214 | Fixed (share of 112,560 views; footer "63.7% of 112,560 views") |
| Dashboard 16f: three comparison bases | Fixed (each named where read) |
| Dashboard fix 7, 9: boxes; teal series against success green | Fixed: hairline sections, one bordered alert list; the series is ink, teal only on actions |
| Dashboard fix 10: touch sizes under coarse pointer | **Not fixed** for Pause (43x24) |

## 4. Ten fixes per page, ranked (gate first, then exemplar level)

### Coffee landing page (closest exemplars: Apple MacBook Air for a consumer product page, then Stripe, Ramp)

1. **One rule for when a subscriber pays** (gate 16). Either charge at checkout and say so in the slip ("$18 today, then every 2 weeks on roast day, next Tue, Oct 27"), or keep "charged on roast day" and split the cart and checkout totals: "Due today $21.00" for the single bag, then a line "Charged Tue, Oct 13 when your first bag roasts: $18.00". Files: `coffee.src.html` lines 836, 1073, 1150 to 1153, 1194, 1258. design-conversion's term-line rule (renews when, at what price) only holds if the date it names is the date the card is charged.
2. **Hover layer to the contract** (gate 13). Replace `color-mix(in oklch, var(--color-text) 4%, var(--color-surface))` with `var(--state-hover)` layered on the surface (`background: linear-gradient(var(--state-hover), var(--state-hover)), var(--color-surface)`), in `coffee.src.html:429` and the sheet's `.opt.is-hover`. Keep the switch to `text-muted-on-tint` (8 percent gives 4.56:1 for plain muted, too close to the line).
3. **Name the control sizes** (gate 13). Add `--size-control-sm/md/lg` and `--size-icon-*` to the coffee root, use `min-height: var(--size-control-lg)` on `.btn` and the email field, `var(--size-control-md)` on `.btn-sm`; update the "FOUNDATIONS v0.3" comment. The 44px touch heights stay as literal minimums with a comment.
4. **Close the 343px hole at 1024** (exemplar, rhythm). At 1024 the band's left column ends at y 2812 and the slip at 3155. Make the slip `position: sticky; top: calc(64px + var(--space-6))` from 1024 up, so the order form travels beside the proof, or move the rating block under the slip at 1024 to 1279 (`grid-template-areas` change only). Stripe and Apple let the object that sells end with or stick beside its copy (opinion, as in round 3).
5. **Subgrid the promise columns** (exemplar, craft). `.promises .steps { grid-template-rows: auto auto auto 1fr }` with each `li` on `grid-row: span 4; display: grid; grid-template-rows: subgrid`, so numeral, heading and body share rows; at 1024 the first body sits 25px low today because "We know every grower by name" wraps.
6. **Give the hero one voice above the sections** (opinion, hierarchy). At 1440 the section H2s are 74.6px against a 77.3px H1, and "Bought by name, tasted twice, shipped the day after the roast." runs five lines at about 13 characters a line. Cap section heads at `--text-5xl` (61px) on a `clamp(39px, 5vw, 61px)` ramp, and set that H2 across eight columns above its photo so it breaks in two or three lines. A display line that wraps five times stops being display (opinion).
7. **A dark-graded hero photo** (exemplar, art direction). In dark the daylight bag shot is the brightest surface on the page. Add a `<source media="(prefers-color-scheme: dark)">` crop graded down about one stop with a warmer key, the way Vercel ships every docs image as a `-light` and `-dark` pair (`kb/teardowns/vercel-dashboard.md`).
8. **Tense and one shipping rule in the cart** (copy). Empty cart: "This week's coffee is Ethiopia Guji. It roasts Tue, Oct 13 and ships Wed, Oct 14." Shipping: add "Single bags ship free with a subscription" to the lots footnote (`coffee.src.html` shipping note) so the cart's "Free with your subscription" is a promise the page already made.
9. **Metric fallbacks for the serif** (craft). The lint `fallback` warn: with the web fonts gone the page moves 81px and five elements rewrap, including "$21 / 340 g" onto two lines. Add a `@font-face` fallback for Newsreader with `size-adjust`, `ascent-override` and `descent-override` measured against Georgia (design-typography `references/06-type-without-web-fonts.md`).
10. **Reading order and the phone sheet** (craft). At 390 and 768 "See all 9 coffees" still sits above "Three coffees, grown 1,100 to 2,100 meters up": move it under the heading (round 3 also-list). In the sheet, render the menu toggle at 1440 too (`.sheet .menu-toggle { display: inline-flex !important }`) so the labelled cell is not empty.

### Tally dashboard (closest exemplars: the Linear app, then the Vercel and Stripe dashboards)

1. **Paint the warning meter on the sheet** (gate 15). In `states.mjs` (built into `dashboard-states.html:786`) replace `--color-warning-mark` with `--color-warning` for both the fill and the ring, the same token the page uses at `dashboard.src.html:572`. Then add a lint rule upstream: a `[role=meter]` whose `aria-valuenow` is above 0 must paint a fill wider than 0 (tools/lint-truth.mjs, `proportion`).
2. **No outage caveat on sample data** (gate 16). Add `html[data-phase~=sample] .kpi .caveat { display: none; }` and hide the iOS warning glyph the same way (the `{{i:warning-12}}` built at `dashboard.src.html:1395` when `p.warn`), or keep them and show the demo's own one-line explanation under the "Sample" chip ("The demo store's checkout stopped at 2:05 pm, so its conversion and revenue are partial"). Re-render `first-run`, `listening` and `check-failed`.
3. **Fix the split label** (gate 13). `<button class="btn btn-primary invite-btn">Invite<span class="live-more"> a teammate</span></button>` with `.invite-btn { gap: 0 }`, or one text node per width with `hidden`. Re-render `?state=first-data`.
4. **Name the week the data uses.** "This week, Oct 6 to 12" is Tuesday to Monday: a rolling seven days. Either label it "Last 7 days, Oct 6 to 12" (and the chart "12 weeks to Oct 12") or move the buckets to Monday-start ISO weeks. Linear's own usage chart names its range "Last 7 days" (`kb/teardowns/linear-app.md`, changelog, estimate). The first-data line "Weekly comparisons start on Oct 19, once a full week is in" also needs two full weeks for a comparison, which points to Oct 26.
5. **Touch the Pause control** (round 3 fix 10). Under `pointer: coarse` give `#live-btn` `min-height: 44px` with negative margin so the header stays 64px; it is the WCAG 2.2.2 control and the only one under 44 on the phone header.
6. **Keep the label on busy buttons** (opinion). The sheet's busy cells show a spinner alone in the kept box, so two busy buttons in one toolbar cannot be told apart and a screen magnifier user loses the verb. The coffee kit already keeps "Get the letters" beside its spinner; use the same rule here (spinner in the icon slot, label stays, `aria-busy`).
7. **End the platform panel with its content** (craft). At 1440 the panel stretches to the chart height, leaving about 90px of white between Android and the footnote. Set `align-self: start` on the panel or let the footnote follow the last row; (Opinion.)
8. **Align the table's right edge** (craft). "Share of views" ends 45px short of the table, the footer and "All pages", because an empty "Actions" column holds the row menu that only shows at 390. Show the row menu on row hover and focus at desktop (opinion) so the column earns its width, or drop the column above 640px and right-align Share to 1408.
9. **Durations and names like the exemplars** (copy). "0m 58s" to "58s" (Vercel prints durations tersely: "7s"); one name per destination ("Workspace settings" in the palette, "Settings" in the sidebar and the shortcuts sheet); keep the time zone on the phone header ("Updated 2 min ago, PT": "times in PT" vanishes at 768 and 390 while "Partial since 2:05 pm" stays).
10. **Make compact earn its name** (opinion, density). Compact today saves about 40px on the first screen (KPI strip 12px shorter, rows 32px). Linear's list runs 13px text on 40px rows with 28px nav rows and 24px meta rows (`kb/teardowns/linear-app.md`); a compact mode that drops KPI numerals from 39 to 31px, rows to 32px and the chart to 200px tall would show the table's first rows above 900px at 1440, which default never does.

## 5. Expert-learning test: what a top practitioner would not already know

Lines on these pages that sit above the generalist bar:

- Coffee: the bag label is page HTML printed onto the photographed pouch, so lot, curve and name on the product shot are real data (carried over from round 3; still the most non-obvious move on either page).
- Coffee: the ledger draws each price as a rule to scale (200, 291, 455px for $1.80, $2.62, $4.10) and leads with the ratio; proof as a measured graphic.
- Coffee: a 3-star review shown on purpose with the head roaster's reply in place.
- Coffee: the term line reserves its height so changing the plan never moves the pay button; the rating distribution bars run 0 to 100 of the review count.
- Coffee: "Tax (Oregon has no sales tax) $0.00" in the checkout summary: the zero is explained, not hidden.
- Dashboard: the setup state checks the customer's own pages and names the CSP line to add ("script-src https://t.tally.so"), with "Send to a developer".
- Dashboard: first data says "The line starts tomorrow. Each day becomes a point once it ends at midnight PT": an empty chart that explains its own time grain.
- Dashboard: every KPI tile is a chart switch ("Choose a tile to chart it"), the selected tile underlined, the sparkline drawn in ink with the end dot in the status color only when the delta is bad.
- Dashboard: the keyboard sheet carries a switch for single-key shortcuts (WCAG 2.1.4, `/` and `?` included), and the search field's only failure state is "no match", because a search cannot be invalid.
- Dashboard: the usage meter projects the limit date ("Limit Oct 16") and only turns amber at 75 percent; upgrade stays out of the header unless the member is blocked.

The ceiling is not the problem. As in round 3, the floor is, and it is now a short list.

## Exemplar verdicts (opinion)

- **Coffee: below** Apple MacBook Air and Stripe. Close on type (Newsreader at 1.1 with -0.025em tracking, Stripe's measured tightening) and on proof as graphics (ledger, roast curve); below on photography (generated stand-ins, one light grade in both themes), on rhythm at 1024 (343px hole) and on section hierarchy at 1440 (H2 at 96 percent of the H1).
- **Dashboard: close** to the Linear app, Vercel and Stripe dashboards at 1440 and 1024 on hierarchy and chrome restraint (hairline sections, ink series, status hue only on state, bar-as-row-background shares as Vercel does); below Linear on density (14px rows of 40px, 32px nav rows, a compact mode that barely compacts).

## 6. Comparison with the builder's self-review (`kb/tests/round4.md`)

(Written after sections 1 to 5.)

The tool numbers reproduce exactly: lint 0 fail with 9 and 10 warnings on the pages, 3 and 45 on the sheets, 12 of 12 and 14 of 14 states, `check.mjs` 91 of 91, claims, search, conversion and icon audits as reported. The arithmetic it ticked is right. The report is honest that no clean-context critic ran and labels its ratings "self-scored, unverified". The differences are again all judged, and again they run one way, though the gap is much smaller than in round 3.

### Where the builder over-rated itself

| Builder's claim | My finding | Size of the gap |
|---|---|---|
| "Hierarchy, spacing, alignment, contrast in both schemes and copy truth hold on both pages at all four widths, in every state I looked at" | 5 judged gate fails: coffee 13 (4% hover, raw control sizes) and 16 (charged on roast day against "Due today $39"); dashboard 13 ("Invite&nbsp;&nbsp;&nbsp;a teammate"), 15 (empty warning meter on the sheet), 16 (outage caveats on sample data) | Medium. The verdict changes from "gate passed" to "revise", but every fix is under ten lines |
| Coffee "copy truth": claims ticked, "cart $18 + $21 = $39.00" | The sum is right; the promise it breaks is not on the same screen. The tick was arithmetic, not policy: the slip says the $18 is charged on roast day | The claims inventory cannot see this either: it lists both strings, 300 lines apart |
| State sheet PASS, "every panel state present" (dashboard) | The 75% meter cell paints nothing; a token renamed in round 4 (`*-mark` folded into `--color-{role}`) was not renamed in `states.mjs` | Small fix, but the same class the round 3 critic flagged on the coffee sheet, one round later |
| "Header Pause in first-data" fixed (change list) | Fixed, but the same state's header primary now reads "Invite&nbsp;&nbsp;&nbsp;a teammate" at 1024 and up | Small; visible on the first line of the screen |
| "Sample data has nothing to pause" (change 3) | Right for Pause; the same reasoning was not applied to the "Partial since 2:05 pm" caveats on the sample tiles | Small fix; a truth fail by the playbook's rule 10 |
| Coffee "close to Stripe, Linear and Ramp on rhythm" with the band "159px ragged" | 159px at 1440, but **343px at 1024**, a width the builder lists as rendered and read | One step on rhythm (opinion) |
| "Phone targets (dashboard fix 10): under 40rem of main width, controls are 44px" | "Pause" stays 43x24 under a coarse pointer; the warnings list does name it ("kept so the header stays one 64px row") | Named, so not hidden; I disagree with the trade (fix 5 keeps the row at 64px with a negative margin) |

### Where the builder under-rated itself or aimed at the wrong gap

- **Dashboard "still below the Linear app on craft".** I rate it close at 1440 and 1024 on hierarchy and restraint; the gap to Linear is density (14px rows, a compact mode that barely compacts), not craft. The chart's missing keyboard path to points, which the builder names, is a real gap and a good catch.
- **The setup state's CSP diagnosis, the first-data "The line starts tomorrow" chart and the single-key shortcut switch** are not called out as the expert moves they are (section 5).
- **"Oct 6 to 12" as a rolling window** was ticked as true, and it is; the miss is the label "This week" on a Tuesday-to-Monday window (fix 4), which the builder's own tick describes.
- **The promise H2 change** (round 4 change 1, five lines level with the photo) is a deliberate choice I disagree with (coffee fix 6, opinion): ending level with the photo bought a five-line display heading at 96 percent of the H1's size.
- **The Product JSON-LD conflict** the builder raises (search-check fails three `Product` nodes on one page) is a fair correction of round 3's fix 7; one featured `Product` is the right call until design-search teaches an `ItemList` rule.

### Calibration note for round 5

The builder now walks 768 and 1024 and the state renders, and `check.mjs` turns every past finding into a regression test, which is why nothing from round 3's gate list came back. The remaining blind spot has moved: findings live **between** files and states. A token renamed in the page but not in the sheet generator; a promise in the slip contradicted by the cart drawer; a caveat correct in the live state and false in the sample state; a label correct at 390 and split at 1440. For round 5: (1) grep the sheet generator for every token the page removed; (2) read every money and date promise across the page, the cart and the checkout side by side, not line by line; (3) for each state, list which explanations it hides and remove every caveat that points at a hidden explanation; (4) add `check.mjs` rows for each of this round's five fails so they cannot return.
