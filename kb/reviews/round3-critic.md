# Round 3 critic review: coffee landing page and Tally dashboard

- Reviewer: critic, clean context (did not build the pages). Branch `restructure` at `63b8f28`.
- Judged against: `CLAUDE.md` quality bar, `kb/FOUNDATIONS.md` v0.4 (16-item checklist, token schema, content mechanics), `skills/design-director/SKILL.md`, both job playbooks and their `references/signature-moves.md`, `kb/teardowns/INDEX.md` and the teardowns it names (stripe-home, linear-home, vercel-home, ramp-home, apple-macbook-air, linear-app, stripe-dashboard, vercel-dashboard).
- Pages: `kb/tests/round3/coffee.html`, `coffee-states.html`, `dashboard.html`, `dashboard-states.html` (built from the `.src.html` files; line numbers below refer to the `.src.html` sources unless a built file is named).
- Order of work: everything in sections 1 to 4 was written before opening `kb/tests/round3.md`. Section 5 is the comparison.

## Verdict

**Revise. Both pages fail the fundamentals gate on judged items**, although every lint run passes.

- Coffee: fails items 13 (aligned edges), 15 (the state sheet's loading button is blank) and 16 (one promise in three wordings).
- Dashboard: fails items 12 and 13 (the page header breaks at 768 and 1024, and the search field covers the Pause control there), 15 (the state sheet has no disabled, busy, error or panel states) and 16 (the empty and setup states show numbers they cannot have; the live feed contradicts the page's own error).

Above the gate, both pages carry real expert moves (listed in section 4). The work is close. The misses are the kind the lint cannot see: tablet widths, states other than the default, and the truth of the copy over time.

## 1. Numbers measured (re-run, not copied)

Tools were run from the repo root with Chromium at `/opt/pw-browsers`. My scripts are in the session scratchpad and are not committed.

| Check | Result |
|---|---|
| `node tools/lint.mjs` on `coffee.html`, `dashboard.html`, `coffee-states.html`, `dashboard-states.html` | All four PASS, 0 fail. Warnings: coffee 10, dashboard 34, coffee sheet 3, dashboard sheet 37 |
| `tools/lint.mjs --states` with all 12 coffee states and all 14 dashboard variants (`state=`, `density=`, `open=`, `metric=`) | All 26 PASS, 0 fail. (The run wrote `.lint.json` files beside the pages. I restored them with `git checkout` so the builder's copies stay unchanged.) |
| `claims_inventory.mjs --year 2026`, both pages | Exit 0, "No mechanical flags" |
| `search-check.mjs` coffee (public), dashboard (`--expect private`) | Both PASS, 0 fail, 0 warn |
| `conversion-audit.mjs` coffee | No fails; 1 warn (add-to-cart has no shipping note beside it at 390) |
| `icon_audit.mjs` dashboard | PASS |
| Weekdays (2026) | Mon Oct 12, Tue Oct 13, Thu Oct 15, Thu Oct 22, Tue Oct 27, Tue Nov 10, Wed Oct 7 are all correct |
| Coffee arithmetic | Rating mean (5x1040 + 4x160 + 3x44 + 2x22 + 18) / 1284 = 4.699, so 4.7 is right. 4.10 / 1.80 = 2.28, so 2.3x is right. The ledger rules are drawn to scale (200, 291 and 455px against 1.80, 2.62 and 4.10). Each subscription price is $3 below the single-bag price. 20 cups / 14 days = 1.43 a day ("a cup and a half"). Oct 13 + 28 days = Nov 10. |
| Dashboard arithmetic | 44,600 to 48,210 = +8.09%. Eight rises in a row after index 3 of the series (`dashboard.src.html:1302`). 31,040 + 9,870 + 7,300 = 48,210. Revenue 170.4k to 184.2k = +8.1%. Usage: 3.6M by day 12 projects to 9.3M for October, and 7.8M at that rate reaches 10M on about Oct 16. All right. |
| Display clamps | `--text-display` 49 to 88px (1.8x), `--text-display-2` 39 to 76px (1.95x), `--text-numeral` 61 to 152px (2.49x, inside the 2.5x cap) (`coffee.src.html:122-124`) |

Contrast (WCAG formula, my script on the token hex values):

| Pair | Ratio | Needs |
|---|---|---|
| Coffee muted `#79685b` on bg `#f9f6f4` / on white | 4.95 / 5.32 | 4.5 |
| Coffee muted `#79685b` on sunken `#eee8e4` | **4.39** (not used for text: `.terms` uses `--color-text`; keep it that way) | 4.5 |
| Coffee ink `#27201a` on band `#f26b21` / on band light `#f7884a` | 5.28 / 6.56 | 4.5 |
| Coffee white on primary `#b14500` | 5.64 | 4.5 |
| Coffee focus ring `#b14500` on bg; dark ring `#ffa97e` on `#16100c` | 5.25; 10.08 | 3 |
| Coffee input and option border `#998779` on white / on bg; dark on `#1e1813` | 3.44 / 3.20; 5.10 | 3 |
| Coffee dark primary fill `#b14500` against dark bg (button edge) | 3.34 | 3 |
| Dashboard muted `#676c73` on white / on bg / on warning and danger tints | 5.29 / 4.93 / 4.92 / 4.91 | 4.5 |
| Dashboard white on primary `#027d71`; dark `#101214` on `#14b8a6` | 5.03; 7.54 | 4.5 |
| Dashboard focus ring light on white / on bg; dark | 5.03 / 4.69; 7.98 | 3 |
| Dashboard previous-period chart line, light / dark | 3.44 / 3.30 | 3 |
| Dashboard dark bar and meter track `#1f2224` on surface `#181a1c` | 1.09 (only a problem because the bars are scaled to the maximum; see dashboard fix 5) | 3 if it carries meaning |

Layout probes (Playwright, `getBoundingClientRect` and `elementFromPoint`):

| Probe | Result |
|---|---|
| Dashboard header, 768 / 900 / 1024 / 1280 | At 768 and 1024 the right edge of `#live-btn` ("Pause updates") hit-tests to `.search`: **the search field covers the 2.2.2 pause control**. The live dot squashes to 2x8px. "Updated 2 min ago, times in PT" wraps to five one-word lines. The sticky header grows to 142px while `scroll-padding-top` is 80px (`dashboard.src.html:156`). The header is fine at 900 and 1280. |
| Coffee promise columns, 1440 and 1024 | The text block of column 2 sits 12px higher than columns 1 and 3 at 1440 (6036 vs 6048) and 13px lower at 1024 (6006 vs 5993) |
| Coffee ledger (`#paid` table), 390 and 1024 | 0px between the row label (`th` right edge) and the price (`td` left edge). At 390 the render reads "Sep 30$2.62". |
| Coffee slip grind options, 1024 | Each option is 96px wide in 3 columns. The text runs into the right padding, and "Pour-over" and "Medium-fine" break at the hyphen. |

## 2. Fundamentals gate, item by item

Screenshots are in `kb/tests/round3/shots/`. State renders were made with `tools/render.mjs`.

### Coffee landing page (`coffee.html`, `coffee-states.html`)

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | axe WCAG 2.2 AA, light and dark, 390 and 1440 | Pass | lint `axe` pass on the page, the sheet and 12 states |
| 2 | Text contrast | Pass | lint `axe` and `overlay` pass; my pairs above |
| 3 | Non-text contrast 3:1 | Pass | Borders 3.44 and 3.20, rings 5.25 and 10.08, dark button edge 3.34 |
| 4 | Targets 24px (44 preferred) | Pass | 3 warns on `.card-link`. Each row's `::after` covers the whole row (`coffee.src.html:364`), so the real target is large. |
| 5 | Measure | Pass | lint `measure`. Advisory: at 1024 the roast-curve caption column is about 160px wide, about 20 characters per line (`coffee-1024-light.jpg`, slice 4). |
| 6 | Type scale | Pass | lint; the fluid display sizes are inside the 2.5x cap |
| 7 | Spacing | Pass | lint `spacing` |
| 8 | No horizontal scroll at 390 | Pass | lint `overflow` |
| 9 | Focus | Pass | lint `focus`, `focus-shape`, `skip-link`. The ring in the orange band switches to ink (5.28:1, `coffee.src.html:403`). `scroll-padding-top: 80px` covers the 64px header. |
| 10 | Reduced motion | Pass | lint `motion`. The spinner and the curve wipe are gated by `prefers-reduced-motion: no-preference` (`coffee.src.html:232-237, 481-494`). |
| 11 | Not color alone | Pass | Errors carry an icon plus text (`coffee-states-1440-light.jpg`). Body links are underlined. The roast meter has words. The chart is labelled. |
| 12 | Hierarchy | Pass | One filled CTA per screen (lint `primary`). The 390 first screen holds the category ("single-origin coffee"), the price and the CTA within 844px (`coffee-390-light.jpg`). |
| 13 | Consistency, aligned edges | **Fail** | (a) The three promise columns do not share a top edge: off by 12px at 1440 and 13px at 1024 (probe; visible in `coffee-1440-light.jpg` around y 5990). (b) The ledger label and price touch with 0px gap ("Sep 30$2.62" at 390, `coffee-390-light.jpg` around y 6400). (c) At 1024 the slip's 3-column grind grid gives 96px options with hyphen breaks (`coffee-1024-light.jpg` around y 2400). (d) The option hover layer is 4% (`coffee.src.html:427`); the FOUNDATIONS state layer for hover is 8%. |
| 14 | Both themes designed, `color-scheme` | Pass | Dark is remapped, not inverted: the band goes from `#f26b21` to orange-950 `#3f0f00`, and surfaces step up. Minor: the empty cart badge disappears in dark because `surface-sunken` equals `bg` (`warm-990`, `coffee.src.html:87, 263`; `coffee-1440-dark.jpg` header). |
| 15 | States exist; no layout shift | **Fail (judged)** | lint `state-shift` passes on all 12 states. But the state sheet's "Sending" cell renders as a blank orange pill (`coffee-states-1440-light.jpg`, top row). The cause: the sheet-only class `.is-loading { color: transparent !important }` (`coffee-states.html:670`) also hides the spinner, which draws with `currentColor` (`coffee.src.html:230`). The loading state is not shown. The sheet's claim to be "drawn by the page's own CSS" is false for this cell; the real page keeps its label. |
| 16 | Copy true and consistent | **Fail (judged)** | `claims_inventory` exits 0, but one promise gets three wordings and two numbers: "Roast to ship 48h" (hero facts) and "shipped in 48 hours" (H2), against "We roast on Tuesdays and Fridays and ship the next day" (step 3), against "ships by Thu, Oct 15" for a Tuesday roast. The H2 says "tasted twice" while the step heading says "Two of us taste every batch" (two people or two tastings?). The hero puts "4.7 from 1,284 reviews" beside the Guji price, but the band explains these are subscriber reviews of the whole store since 2023, which reads as a product rating where none exists. The source comment promises "one promise said one way" (`coffee.src.html:40`). |

### Tally dashboard (`dashboard.html`, `dashboard-states.html`)

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | axe | Pass | lint pass on the page, the sheet and 14 variants. The sheet has one needs-review `duplicate-id-aria` (`section[aria-labelledby="d7"]`): fix the duplicate id. |
| 2 | Text contrast | Pass | Pairs above; the muted text measured on the tints passes (4.91, 4.92) |
| 3 | Non-text contrast | Pass | Rings 5.03 / 4.69 / 7.98; borders 3.44 and 5.07; previous-period line 3.44 and 3.30 |
| 4 | Targets | Pass with 34 warns at 390 | The primary "Share report" is 110x40 and the KPI pickers are 24px tall (lint JSON). The page already lifts compact rows to 40 on `pointer: coarse` (`dashboard.src.html:117`) but not its controls. |
| 5 to 8 | Measure, scale, spacing, overflow | Pass | lint |
| 9 | Focus | Pass on lint; **at risk at 768 to 1024** | The sticky header grows to 142px against `scroll-padding-top: 80px`, so a focused element can land under it (WCAG 2.4.11) at the widths where the header breaks |
| 10 | Reduced motion | Pass | lint `motion` |
| 11 | Not color alone | Pass | Deltas carry an arrow plus a sign plus "down" or "worse" (`dashboard-1440-light.jpg`). The chart uses solid against dashed lines. Alerts use an icon plus a word. |
| 12 | Hierarchy | **Fail (judged)** | At 768 and 1024 the page header wraps into a 142px block, the freshness line breaks into five one-word lines, and the search field covers the "Pause updates" control (`dashboard-768-light.jpg`, `dashboard-1024-light.jpg`, top). The scan path breaks on the first line of the screen. |
| 13 | Consistency | **Fail (judged)** | Same header collision. Root cause: the header uses viewport `@media` (`dashboard.src.html:236, 244, 263`) inside a shell whose content width jumps when the sidebar opens at 1024. The playbook (`design-playbook-dashboard` 1.4) and FOUNDATIONS Breakpoints say components respond to the content area. The KPIs already do (`@container content`, line 296); the header does not. Token schema: the page still cites v0.3, uses `--color-positive` and `--color-negative` instead of `success` and `danger`, has no `surface-sunken`, `text-muted-on-tint`, `warning`, `info`, `--size-control-*`, `--size-icon-*`, `--shadow-2` or `--elevation-card` (`dashboard.src.html:49-118`). |
| 14 | Themes | Pass | Dark is remapped: lighter surfaces, white ring and highlight, transparent shadows (`dashboard.src.html:146-152`) |
| 15 | States | **Fail (judged)** | Every `?state=` URL lints clean, but the state sheet (`dashboard-states.html`) has no disabled or busy buttons, no field error, and no loading, error or partial panels. The director requires "empty, loading, error and partial panels for data pages" on the sheet (`design-director` 4, state sheet). Its only empty state is one KPI tile. |
| 16 | Copy true | **Fail (judged)** | (a) The empty state ("No events yet") and the setup state ("sample data, nothing tracked yet") still show "Events this month 3.6M of 10M, On pace for 9.3M" in the sidebar, and "The three add up to 48,210" under an empty platform panel (rendered `?state=empty` and `?state=check-failed`). (b) The live feed ticks revenue up (184.2 to 184.6 to 184.9 to 185.3, `dashboard.src.html:1271`) while the page's own error says checkout events, the revenue source, stopped at 2:05 pm. (c) The feed takes weekly active users from 48,251 to 48,249. A distinct-user count for an open week cannot fall. (d) After one tick the KPI reads 48,236 while the platform footnote still says 48,210 and the sentence still says +8.1% (48,236 / 44,600 is +8.2%). (e) "Share, %" for 6 of 214 pages sums to exactly 100 (34 + 28 + 16 + 12 + 8 + 2): these are shares of the six rows shown, labelled as shares of all traffic. (f) The toolbar chip says "Compared to: previous 12 weeks", every KPI says "vs last week", and the table's "Change" is against the previous 12 weeks (code comment, line 1080) with no label. That is three comparison bases on one screen, and the control names only one. |

## 3. Ten fixes per page, ranked (gate first, then exemplar level)

### Coffee landing page (exemplars: Apple MacBook Air first for a consumer product, then Stripe, Linear, Vercel, Ramp)

1. **One shipping promise, one number** (gate 16). Pick the true interval and use it everywhere. If it is "roasted Tuesday, ships Wednesday, arrives by Thursday", the hero fact becomes "Roast to ship 24h", the H2 "shipped the next day", and the slip keeps "ships by Thu, Oct 15" only if that is the latest ship date. Otherwise change step 3 to "ship within two days". Change "Two of us taste every batch" to "We taste every batch twice" so it matches "tasted twice". Files: `coffee.src.html` hero facts, `#promise-title` (line 911), step 3.
2. **Align the promise columns** (gate 13). Make `.promises .steps li` `align-content: start`, or put the three items on `grid-template-rows: subgrid` so numeral, heading and body share rows across columns. Today the middle column floats 12px off at 1440 (`coffee.src.html:528-529`).
3. **Give the ledger a gutter** (gate 13). Set `column-gap: var(--space-5)` on the `#paid` table rows (a `padding-inline-start: var(--space-5)` on the `td` works). Under 640px, shorten the label to "New York “C” price, Sep 30", or stack the label over the value. A ledger whose numbers touch their labels undercuts the most distinctive section on the page.
4. **Make the slip respond to its own width** (gate 13). Put `container-type: inline-size` on `.slip` and replace `@media (min-width: 640px) { .opts.cols-3 ... }` (`coffee.src.html:417`) with `@container (width >= 26rem)`. At 1024 the slip is about 336px wide, so the grind options drop to 2 columns and stop breaking "Pour-over".
5. **Repair the Sending cell on the state sheet** (gate 15). Delete the `.is-loading` color trick (`coffee-states.html:670-672`) and render the button with the page's own `aria-busy` rule, which shows the spinner beside the label. If the label must hide, set `.spinner { border-color: var(--color-on-primary); border-right-color: transparent; }` and keep a visible "Sending" text. Then re-render and look.
6. **Close the 280px hole in the subscription band** at 1024 and up (`coffee-1440-light.jpg` around y 2400). Today the left column floats the rating block halfway down. Pin it under the bullets (`align-content: start`) and let the slip run long, or make the slip `position: sticky` beside a left column that ends with the review. At Apple and Stripe the copy column and the object it explains end together or the object sticks (opinion).
7. **Put the rating where it is true.** Change the hero line to "4.7 from 1,284 subscriber reviews", or show a Guji-only count. Add `Product` plus `Offer` JSON-LD for the three lots, with price, `priceCurrency` and availability (merchant listing). The page sells three priced products, yet its graph types stop at `OnlineStore` and `CafeOrCoffeeShop` (search-check output).
8. **Spend the italic once per screen** (opinion). Italic serif carries the H1 ("roasted Tuesday"), the lead, the shop H2 ("meters up"), the band H2 ("two or four"), the statement ("what we paid"), the promise H2 ("48 hours"), the review and every taste note. Used eight times, it stops signalling. Keep it for taste notes (the coffee's voice) and the H1, and set the other heads roman. The exemplar version of this device is Stripe's and Ramp's two-tone heading: one rule, used the same way in every section (`kb/teardowns/stripe-home.md`, `ramp-home.md`).
9. **Bring display leading inside the contract or change the contract.** The H1 runs at 77px with leading 0.95 and the section heads at 1.0 (`coffee.src.html:125, 206, 386`). FOUNDATIONS allows 0.95 only at 100px and up, and 1.1 to 1.25 for other headings. Either set 1.05 (Apple measures 1.05 to 1.09 at 48 to 80px) or send the measured case to the editor-in-chief (Linear and Vercel run 1.0 at 48 to 64px). Do not ship an undeclared deviation.
10. **Finish the roast chart.** The gridlines run to the viewport edge, past the 1232px container, while the data stops at 10:10 (`coffee-1440-light.jpg` around y 3300). The comment says "the log runs on past the drop" (`coffee.src.html:452`), but nothing is drawn there. Either draw the cooling-tray tail the bleed promises (bean temperature falling after the drop, in a lighter stroke) or stop the gridlines at the plot edge. Under 1280px, set the caption above the chart instead of in a 160px margin column.

Also worth doing: keep "$18 on subscription" in each lot row at 390 (hidden by `coffee.src.html:362`; this is the comparison at the moment of choice, so keep it rather than defer it). Give the empty cart badge a visible field in dark. Move "See all 9 coffees" below its heading.

### Tally dashboard (exemplars: Linear app first, then the Stripe and Vercel dashboards)

1. **Rebuild the page header on the content container** (gate 12, 13, and 2.4.11 risk). Put `.page-head` inside the `content` container, or give it its own, and switch lines 236, 244 and 263 to `@container` in `rem`. Give `.freshness .dot` `flex: none` and `.freshness` `white-space: nowrap`. Under 64rem of content width, fold the search field into the Commands button (Linear has no standing search box; the palette is the search). Keep the header at one 64px row at every width so the 80px `scroll-padding-top` stays true.
2. **Make every state tell the truth about its data** (gate 16). In `?state=empty`, `first-run` and `check-failed`, the sidebar meter shows 0 events (or hides), and the platform footnote reads "No platforms yet" with no total. Drive the meter and the footnote from `data-state` the way the KPIs already are (`dashboard.src.html:530, 602`).
3. **Make the live feed consistent with the page** (gate 16). Revenue does not tick while checkout events are stopped. Weekly active users only rise within an open week. When a KPI ticks, recompute the delta, the answer sentence and the platform total in the same frame, or tick only "Updated just now". Today the first tick makes three numbers on screen disagree.
4. **One comparison basis, named where it is read** (gate 16). Either the "Compared to" chip drives every delta (KPIs, table, platform), or the chip is relabelled "Chart compares with: previous 12 weeks" and the table header becomes "Change vs prev. 12 weeks". Stripe's Dashboard pairs every delta with its period. Here the control and the numbers disagree.
5. **Fix the share encoding** (gate 16 and data integrity). Compute share against all 214 pages (the six shown would come to well under 100%), and scale bars 0 to 100% of the track. Better: drop the 64px track and use Vercel's bar-as-row-background, a full-row fill whose width is the share (`kb/teardowns/vercel-dashboard.md`, Hierarchy). Same for the platform bars: Web at 64% of users now fills the whole track because the bars are scaled to the maximum (`dashboard.src.html:1096` uses `r.share / maxShare`).
6. **Complete the state sheet** (gate 15). Add disabled and busy buttons, a field error, and four panel states: the skeleton (`?state=loading`), the "query timed out" error with Retry, the partial KPI tile with "Partial since 2:05 pm", and the viewer lock. Fix the duplicate `aria-labelledby="d7"` id.
7. **Take the boxes off** (opinion, exemplar gap). The page has six bordered, 12px-radius containers (KPI strip, Needs attention, chart, platform, table, usage meter). The Linear app separates with 1px hairlines at 5 to 8% alpha, 44px bars and a 4% selection wash, with no cards (`kb/teardowns/linear-app.md`). Keep a bordered surface only for the alert list. Turn the panel heads into 40px section bars with a bottom hairline. This is playbook move 3, "separation by hairline and space, not by cards".
8. **Bring the tokens to v0.4** (FOUNDATIONS conformance). Rename `--color-positive` and `--color-negative` to `--color-success` and `--color-danger`, and fold `*-text` and `*-mark` into `--color-{role}` and `--color-{role}-subtle`. Add `--color-warning`, `--color-info`, `--color-surface-sunken` (for the skeleton and the code block in the setup guide) and `--color-text-muted-on-tint`. Replace `--control-h` with `--size-control-sm` and `--size-control-md` (the values 32 and 40 already match). Add `--size-icon-*`, `--shadow-2` and `--elevation-card`. Update the "FOUNDATIONS v0.3" comments.
9. **Separate "good" from "ours"** (opinion). Success green `#026a2e` and the series teal `#01675c` sit close in hue at similar lightness, and in dark green-300 `#8ad69a` sits beside teal-400 `#1ebdac`. On the KPI strip the up-arrow and the chart line read as one signal. Either draw the series in neutral ink with teal only for the selected metric's 2px rule, or move success to a yellower green. Linear spends hue only on state (`linear-app.md`, Color).
10. **Touch sizes on the phone layout** (34 lint warns). Under `pointer: coarse`, lift `--control-h` to 44, the KPI pickers to the full tile (the `::after` is already there; make the element 44px tall) and the filter chips to 40. The page already does this for compact rows (`dashboard.src.html:117`), so apply the same rule to its controls.

## 4. Expert-learning test: what a top practitioner would not already know

These lines are genuinely above the generalist bar. They are why the gap to exemplar level is small:

- Coffee: the bag label is live HTML printed onto a blank label in a generated photo, with each crop recording where the label lands (`photos.py` docstring). The lot number, curve and name on the product shot are real data that cannot go stale.
- Coffee: the ledger draws each price as a rule to scale (verified: 200, 291 and 455px against $1.80, $2.62 and $4.10), with the 2.3x figure as the headline. Proof as a measured graphic, not an adjective.
- Coffee: a 3-star review shown on purpose, answered in place by the head roaster. That is rarer and more credible than a five-star carousel.
- Coffee: the term line reserves three lines of height so changing the plan never moves the pay button (`coffee.src.html:438-440`).
- Coffee: wide buttons press to 0.98, not 0.97, because the same scale moves wide edges further (`coffee.src.html:235`).
- Dashboard: an answer-first sentence whose caveat is a link to the affected numbers, and "Partial since 2:05 pm" printed on each affected tile (playbook rule 7, done well).
- Dashboard: the chart never animates, on purpose ("a switch is a redraw, not a transition"), and sorting never animates rows.
- Dashboard: the setup state checks the customer's own pages and names the exact CSP line to add, with "Send to a developer". That is real onboarding, not a tour.
- Dashboard: middle truncation of URLs (`/blog/retenti…-saas-2026`) keeps both the section and the slug.

The list is long enough that the ceiling is not the problem. The floor is.

## 5. Comparison with the builder's self-review (`kb/tests/round3.md`)

(Written after sections 1 to 4.)

The builder's tool numbers reproduce exactly: lint 0 fail with 10 and 34 warnings, 12 of 12 and 14 of 14 states, and claims, search, conversion and icon audits all clean. The arithmetic it ticked is right. The differences are all in judged items, and they run one way.

### Where the builder over-rated itself

| Builder's claim | My finding | Size of the gap |
|---|---|---|
| Gates table: every gate passes on both pages, "every line ticked" | 3 judged gate fails on coffee (13, 15, 16) and 4 on the dashboard (12, 13, 15, 16) | Large. The verdict changes from "pass, below exemplar on photography" to "revise". |
| Dashboard "close to the Stripe and Vercel dashboards on density, hierarchy and **chrome restraint**" | Six bordered 12px-radius containers, a header that breaks into 142px at 768 and 1024, and three boxed controls plus a search field in the top bar. Linear and Vercel separate with hairlines and keep one header row. | One step. I rate it **close on hierarchy and density at 1440 only, clearly below on chrome restraint, and below at tablet widths** (opinion). |
| "Pause updates rendered as Pauseupdates ... Fixed" | Fixed at 1440. At 768 and 1024 the search field covers the control. The builder rendered those widths (`shots/dashboard-768-light.jpg`, `-1024-`) but did not flag them. | The director's own warning applies: "Tablet failures ... are invisible at 390 and 1440". The shots existed and were not read. |
| Dashboard claims "every line ticked" | The ticks cover the default state only. The empty and setup states show 3.6M events and a 48,210 total. The live feed contradicts the checkout error and lets a distinct count fall. "Share, %" sums to 100 over 6 of 214 rows. The comparison chip and the deltas disagree. | Large. Item 16 asks for truth in every state and over time, not only in the first frame. Its notes already count three waves in which false numbers passed every tool; these make a fourth. |
| Coffee "one promise said one way" (source comment) and claims ticked | Shipping is said three ways ("48h", "next day", "by Thu") with two different intervals; "tasted twice" against "Two of us" | Medium |
| State sheets PASS | Coffee "Sending" cell is a blank pill. The dashboard sheet lacks the disabled, busy, error and panel states the director requires. | Medium. Lint passes a sheet that shows nothing. |
| Coffee "close to Stripe, Linear and Ramp on type, hierarchy and rhythm" | Close on type and hierarchy at 1440 and 390 (agree). Not yet on rhythm: a 280px hole in the band at 1024 and 1440, misaligned promise columns, the ledger gutter at 0px and cramped slip options at 1024. | One step on rhythm and craft (opinion) |

### Where the builder under-rated itself or aimed at the wrong gap

- **"Linear's 13px UI type ... denser than our 14px default" listed as a gap.** Vercel's dashboard runs all UI at 14px (`vercel-dashboard.md`), and FOUNDATIONS has no 13. A 14px dashboard is within the exemplar set, so this is not a gap.
- **The sticky-focus warning on the skip link** was rightly called a likely false positive (the link is fixed at z 30). Agree.
- **The page-printed bag label** was called "subtle". It is the single most non-obvious move on either page (section 4), and the right answer to "product as the hero" when photos are stand-ins. The builder undersold it. Its own named gap (the label is flat on a curved pouch) is fair but secondary.
- **Photography** is named as "the single largest gap". It is the largest gap above the gate. It is not the largest gap overall: the gate fails come first, and every one of them is a cheaper fix than a photo shoot.

### Calibration note for the next round

The builder's method was strong (it filmed motion, caught the curve bug that screenshots hide, and fixed two false sparkline numbers). Its blind spot is consistent: it judged the widths and states the lint covers (390 and 1440, default data) and trusted the rest. For round 4, the builder walks the 768 and 1024 shots and every `?state=` render against the `[judged]` rows. Every number in a non-default state, and every number after one live tick, gets the same claim-by-claim tick as the default page.
