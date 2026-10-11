# Round 4: the round 3 critic's gate failures, fixed and proved

Tester report, 2026-10-10. Branch `round4/build`, cut from `origin/restructure` and merged again with it before the final gates (FOUNDATIONS v0.4.1, `tools/lint-layout.mjs`, `tools/lint-truth.mjs`, claims_inventory PROMISE and PERIOD warnings, director step 13). Pages, sources and evidence live in `kb/tests/round4/`, copied from `kb/tests/round3/` and improved in place. Review: `kb/reviews/round3-critic.md`.

## Proof first: `check.mjs`
`node kb/tests/round4/check.mjs` (repo served on `127.0.0.1:8765`) opens the built pages in Chromium and tests each failure the critic named, at the widths where it failed. It prints one line per check: **91 of 91 pass**. Each row below is one of the critic's gate failures (section 2 of the review) and the check that now holds.

| Critic gate failure | Fix | Proof in `check.mjs` |
|---|---|---|
| Coffee, gate 16: three shipping promises ("48 hours", "ships by Thu", "next day") and two tasting claims | One promise everywhere: "the day after the roast" (H2, step 3, both meta descriptions, JSON-LD, social card). Hero fact "Roast to ship 1 day". First bag "ships Wed, Oct 14" (Tue roast + 1). One tasting claim: "tasted twice" and "We taste every batch twice". The hero rating names its base: "4.7 from 1,284 subscriber reviews". | No "48 h", "ships by", "within 48", "Thu, Oct 15", "next day" or "Two of us" in the page, the state sheet or the card; the promise phrase found twice; Oct 14 is Oct 13 + 1 |
| Coffee, gate 13: promise columns 12px off | `.steps li { align-content: start }` | the three columns share one top edge at 1024 and 1440 |
| Coffee, gate 13: ledger numbers touching labels at 390 | `td { padding-inline-start: var(--space-6); white-space: nowrap }` | label to price gutter at least 16px at 390, 768, 1024, 1440 (24, 78, 24, 38px) |
| Coffee, gate 13: grind options sized by the window | `.slip { container: slip / inline-size }`, `@container slip (width >= 26rem)` for 3 columns | 2 columns for a 304 to 391px slip, 3 for 608px; every name and grind on one line |
| Coffee, gate 15: the state sheet's "Sending" button showed nothing | `.is-loading` trick deleted; the cell uses the page's own `aria-busy` rule | spinner drawn beside the visible label "Get the letters" |
| Dashboard, gates 12 and 13: header overlaps at 768 and 1024 | Header rebuilt on the `main` container in rem: one 64px row, title over the freshness line, time zone from 48rem, search from 64rem, "updates" and "a teammate" sr-only under 40rem | 64px, no overlaps, "Pause updates" hit-tests to itself, dot 8x8, freshness one line: default at 390, 640, 768, 900, 1024, 1280, 1440 and all 10 states at 390 and 768 |
| Dashboard: scroll-padding vs header | header fixed at 64px, `scroll-padding-top` 80px | scroll-padding at least head + 16 at every width and state |
| Dashboard, gate 16: states showing numbers they cannot have | `setUsage()` per state; sample states read "No events yet"; first-data counts its own 38 events and 12 visitors | loading and empty show no usage, total or KPI number; setup states show "No events yet"; first-data shows 38 and 12 on every surface |
| Dashboard, gate 16: live feed raised revenue while checkout was stopped | Revenue's live hook removed; one data model (`PLAT`, `WAU_PREV`) feeds KPI, delta, sentence, sparkline name, platform rows, total and chart point in one frame | 5 updates: users only rise, +8.2% and +8.3% agree everywhere, revenue held at $184.2k; paused, two polls change nothing |
| Dashboard, gate 16: shares summed to 100 over 6 of 214 pages; bars scaled to the max | Share = views / 112,560 (all pages); foot "1 to 6 of 214 pages, 63.7% of 112,560 views"; share drawn as a row background on 0 to 100 (Vercel's pattern); platform bars are share of the total | six rows sum to 63.7%; each bar width equals its share |
| Dashboard, gate 16: "Compared to previous 12 weeks" chip vs "vs last week" deltas | Chip moved into the chart legend as "vs previous 12 weeks" (it drives only the dashed line); every delta reads "vs last week" | KPIs and table say "vs last week"; the 12-week basis appears only in the legend |
| Dashboard, gate 15: state sheet incomplete, duplicate id | Busy, primary busy and disabled buttons; partial and loading KPI tiles; error, empty, loading and no-match panels; invite field in error; `d7` duplicate renamed | busy 2, disabled 1, every panel state present, no duplicate ids |

## Also from the critic's ranked list
- **Tokens to v0.4** (dashboard fix 8): success, warning, danger and info roles with `-subtle`; `surface-sunken`; `text-muted-on-tint`; `size-control-{sm,md,lg}`; `size-icon-*`; `shadow-2`; `elevation-card`.
- **Boxes off** (dashboard fix 7): panels are 40px head bars over a hairline; only "Needs attention" and the setup guide keep a box. The KPI strip is one ruled row with flush outer edges.
- **"Good" apart from "ours"** (dashboard fix 9): the chart series is ink (`--color-chart-current: var(--color-text)`), so teal marks only the selected tile's 2px rule and the primary button.
- **Phone targets** (dashboard fix 10): under 40rem of main width, controls are 44px.
- **Italic spent once per screen** (coffee fix 8): italic stays on the H1's second line, the lead and the taste notes; the shop, band and manifesto heads, the review and the step numerals are roman.
- **Display leading inside the contract** (coffee fix 9): headings at 1.1; 0.95 only on the 1440 ledger numeral, which is over 100px.
- **Roast chart** (coffee fix 10): gridlines stop at the plot edge; from 1024 to 1279px the caption sits above the plot.
- **Subscription band hole** (coffee fix 6): `.proof { align-self: start }` replaces a 280px hole in the middle of the column with a 159px ragged bottom (left column ends at 2,918px, the slip at 3,077px at 1440).
- **Product JSON-LD** (coffee fix 7): one `Product` with an `Offer` ($21.00, USD, in stock) for Ethiopia Guji, named as the page names it. The critic asked for all three lots; `search-check` fails a page with three `Product` nodes (a product page carries one), so the two others stay out. This conflict is listed under suggestions.
- **Kept, as the critic asked**: the live HTML label on the bag photo, and 14px dashboard type.

## Round 4 changes beyond the list (opinion unless a source is named)
1. **Promise statement on six columns.** The longer one-promise H2 set in six lines on five columns at 1440; on columns 7 to 12 it sets in five and ends level with the photo (5,460 to 5,902px beside 5,451 to 5,912px).
2. **Narrow KPI tiles keep one sparkline row.** Under 15rem a tile puts "vs last week" on its own line, so a delta that wraps ("+0.4 pts, worse") no longer pushes its sparkline 24px below its neighbours (seen at 1024 and 390).
3. **Sample data has nothing to pause.** "Pause updates" is hidden in the sample states; the lint found it pushed under the header's edge at 390.
4. **Invite in the setup guide is a field.** Step 4 takes the teammate's email inline, checks it on submit, and names the fix ("Add the rest of the address, for example sam@acme.com"). It is the one field on the page that can be wrong, so the state sheet now shows its error state.
5. **Busy buttons keep their name.** The label under the spinner fades with `opacity`, not `visibility`, so a screen reader still hears "Try again" while it runs (axe `button-name` caught it on the sheet).
6. **The coffee menu does not cover the page.** Open, the phone menu is 305px tall; the header stops being sticky while it is open, so anchors and focus are never under it (WCAG 2.4.11).
7. **Stacked options align to the top.** In quick add, "Your usual" adds a line to one option; names now share a top edge across the row (a real 9px miss found by `grid-edge`, not noise).
8. **Frequency options are parallel**: "About 10 cups a week" and "About 5 cups a week" (20 cups a bag over 14 or 28 days), one line each.

## Truth contract (tools/lint-truth.mjs)
The dashboard carries the data-attribute contract, so the truth pass verifies it after every live update:
- `#wau-val`: `data-num`, `data-value`, `data-monotonic="up"`, `data-sum-of="#plat-list .b-val"`.
- Platform values: `data-num data-monotonic="up"`; the footnote total: `data-sum-of` the same rows; bars: `data-bar` with `data-bar-max="100"`.
- `#wau-pct`: `data-derived-from="pct-change #wau-val #wau-prev"`. Last week's 44,600 is now printed in the platform footnote, so the delta can be checked against a number the reader can see. `#ans-pct`: `same #wau-pct`.
- Table: `data-share-base="214"` (4 in first-data); each share `data-derived-from="share #pv-N #views-total"`.
- Conversion and revenue: `data-source="checkout"`; the error alert: `data-source-stopped="checkout"`.
- `data-data="none"` on `html` in empty, first-run, listening and check-failed; `main` carries `data-sample` in the three sample states.
- `window.__designKbTick()` runs one live update.

## Gates
All runs on the merged tools. Lint: `node kb/tests/round4/lint-all.mjs` (JSON beside each page), widths 390, 768, 1024, 1440, light and dark, layout and truth passes included.

| Gate | Coffee | Dashboard |
|---|---|---|
| `tools/lint.mjs` page | PASS, 0 fail, 9 warn | PASS, 0 fail, 10 warn |
| every `?state=` URL | 12 of 12 PASS | 14 of 14 PASS (10 states, compact, palette, sheet, metric=conv) |
| state sheet | PASS, 0 fail, 3 warn | PASS, 0 fail, 45 warn (all targets: a sheet of 24 to 40px desktop controls) |
| `check.mjs` | 91 of 91 checks pass (both pages) | |
| `claims_inventory.mjs --year 2026` | exit 0, no flags, every line ticked | exit 0; 1 PERIOD warning, named below; every line ticked |
| `search-check.mjs` | PASS public, 0 fail, 0 warn | PASS private, 0 fail, 0 warn |
| `conversion-audit.mjs` | no fails (page, quick, cart); 1 warn | no fails (page, limit) |
| `icon_audit.mjs` | PASS | PASS |
| `motion-audit.mjs` (9 scenarios) | 6 of 6 pass | 3 of 3 pass; the live roll raises users only, revenue holds |
| renders | 390, 768, 1024, 1440, light and dark; 12 states at 390 and 1440; sheet | same; 14 states; sheet |

Warnings, all read:
- **Coffee targets** (3): stretched card links whose hit area is the whole row; the element itself is under 44px.
- **Coffee type-scale** (4): fluid display sizes inside `clamp()`.
- **Coffee sticky-focus** (1): the skip link, fixed above the header; likely a false positive (round 3 said the same).
- **Coffee fallback** (1): the layout moves 81px at 1440 when the web fonts fail (round 3: 38px), because the longer promise H2 and the review footer rewrap in Liberation. Open.
- **Coffee svg-overlap** (cart and checkout states): text in the open drawer over the page's logo and photo. The drawer is a modal over the page; the overlap is the stacking, not a collision. False positive for dialog states.
- **Coffee conversion** (1): no shipping note beside the add-to-cart buttons at 390. Shipping sits once under the lots list; advisory.
- **Dashboard PERIOD** (claims_inventory): two bases on one page, "vs last week" (every delta) and "vs previous 12 weeks" (the chart's dashed line, named in the chart legend that controls it). Kept on purpose: the weekly delta and the 12-week shape answer different questions, and each names its basis where it is read.
- **Dashboard first-data shares** sum to 100.1 over 4 of 4 pages: rounding of 21, 9, 5 and 3 over 38 (55.3 + 23.7 + 13.2 + 7.9).
- **Dashboard targets** (9 at 390, round 3 had 34): the skip link; "Pause" (24px, kept so the header stays one 64px row); the Churn tile's label button, whose real hit area is the whole tile; five sort buttons in the table head, which the phone list layout hides visually; the "/" page link (24px wide, 44px tall). Every one is at least 24px (WCAG 2.5.8).
- **Dashboard fallback** (1): 18px at 390 when the web fonts fail (the platform footnote rewraps).

Opt-outs and false positives in the new lint (named so a reviewer can disagree):
- `data-lint-skip="grid-edge"` on the KPI grids. Their outer tiles are flush with the content edge and the inner tiles sit one 16px step off their divider, the Stripe and Linear divided-row pattern, so the first column's labels are 16px further left in their boxes than the second's. The offset is a full spacing step and deliberate; it is the only skip on either page (the state sheets keep round 3's `focus` and `primary` skips, which let a sheet show several focus rings and primaries side by side).
- The coordinator's known noise (grid-edge on vertically centred names in the coffee option cards) turned out to be real in quick add and was fixed (change 7), not skipped.

Claims ticked against their sources (new or changed this round):
- Coffee: Tue, Oct 13 roast, Wed, Oct 14 ship (2026-10-13 is a Tuesday); next charge Tue, Oct 27 (+14 days); 1,040 + 160 + 44 + 22 + 18 = 1,284, mean 4.70; $4.10 / $1.80 = 2.28, shown 2.3x; subscription $3 less on all three lots; cart $18 + $21 = $39.00; 20 cups over 14 days is 10 a week, over 28 days 5 a week.
- Dashboard: 31,040 + 9,870 + 7,300 = 48,210; 25,600 + 12,040 + 6,960 = 44,600; 48,210 / 44,600 = +8.1%; Web +21.25%, iOS −18.0%, Android +4.9%; table shares over 112,560, six rows 63.7%; usage 0.3M a day x 12 = 3.6M, pace 9.3M; limit state 7.8M at 0.65M a day crosses 10M on Oct 16; first data 9 + 2 + 1 = 12 visitors, 38 views; "Oct 6 to 12" and "Jul 21 to Oct 12" are rolling windows ending on the day shown (84 days); "Week-on-week from Oct 19" is 7 days after the first event on Oct 12; churn "Nov 11" is 30 days after Oct 12.

## Exemplar comparison (self-review, unverified)
No subagent tool is available in this session, so a clean-context re-score could not be run. The judged rows and ratings below are **self-scored, unverified**; the round 3 critic found the builder over-rated itself, so discount them. Shots: `kb/tests/round4/shots/`. Exemplars: `kb/exemplars/shots/` (Apple MacBook Air, Stripe, Linear, Ramp; Stripe and Vercel dashboards) and `kb/teardowns/linear-app.md`, `stripe-dashboard.md`, `vercel-dashboard.md`.

Judged fundamentals, by eye on every shot: hierarchy, spacing, alignment, contrast in both schemes and copy truth hold on both pages at all four widths, in every state I looked at (default, 768 and 1024 for both, phone dark, coffee subscription band, promises, dashboard first-run, first-data, empty, both sheets). I found and fixed four misses this way and through the new lint (KPI sparkline rows, promise H2 measure, header Pause in first-data, quick-add option tops), which is the reason to trust the rows less than a fresh critic would.

**Coffee: clearly below Apple MacBook Air on photography; close to Stripe, Linear and Ramp on type, hierarchy and rhythm** (opinion).
- Close: one true promise and one true rating, the price and primary in the first phone screen (CTA bottom 587px at 390, lots peek at 878px at 1440), ruled data sections nobody else has (lots index, ledger to scale, roast curve), italic now a signal.
- Below: AI stand-in photos lit by one window; the label print is flat on a curved pouch; the band still ends 159px ragged; the fallback shift grew to 81px.

**Dashboard: close to the Stripe and Vercel dashboards on truth, density and restraint; still below the Linear app on craft** (opinion).
- Close: every number on screen is derived from one model and survives live updates (lint-truth verifies it); hairline panels; ink series; a row-background share bar on a true scale; caveats where the number is read.
- Below: Linear's 13px type and 32px rows are denser; the chart has no keyboard path to its points; the setup guide is still a boxed card; the busy button is a spinner with an invisible label, which Linear does not need because its actions are optimistic.

## Still below the bar
1. **Photography**: real photographs of the bag and room (`kb/tests/design-art-direction/photo-request.md`). Unsplash is blocked here; the Figma photos in `kb/assets/photos/` stay.
2. **Font fallback shift**: 81px at 1440 with Liberation standing in.
3. **No clean-context critic** for this round.
4. **Dashboard chart keyboard access** to points.
5. **Mobbin-backed dashboard values** are still estimates (the capture attempt is recorded in the teardowns).

## Suggestions for skills and tools (not edited here; another worker owns them)
- **design-search vs critic**: the critic asked for `Product` JSON-LD for all three lots; `search-check` fails a page with more than one `Product`. Decide the rule for a store home that sells several products (an `ItemList` of `Product`s, or one featured product) and teach it once in design-search and the landing playbook.
- **lint targets**: still measures the element, not a stretched `::after` hit area (coffee cards, dashboard KPI tiles).
- **lint-truth empty-state check**: a plan limit ("of 10M") and a date range ("Oct 6 to 12") count as numbers carried from the default state. Exempt `<time>` and numbers marked `data-limit`, or the check pushes pages to hide true context.
- **lint-truth caveat check**: it reads context by text distance, so a live number and an unrelated "stopped" sentence in one paragraph fail together; pages have to split sentences into sibling spans to pass. An explicit `data-source` on the number should override the heuristic.
- **lint-layout grid-edge**: a divided row with flush outer tiles is a standard pattern; teach the check that offsets of one spacing step toward a divider are intended, instead of requiring a skip.
- **lint svg-overlap**: skip text inside an open modal or drawer.
- **lint measure**: two inline paragraphs set as one line read as a short measure on the second; measure the containing block's lines.
- **design-frontend**: busy buttons hide their label with `opacity`, never `visibility`, or they lose their accessible name.
- **design-ux / sticky headers**: a disclosure menu inside a sticky header makes it tall; unstick it while open.

## Round 4.1: the round 4 critic's judged fails, fixed and proved

Tester report, 2026-10-11. Branch `round4/fixes`, cut from `origin/restructure`. Review: `kb/reviews/round4-critic.md` (fresh critic, clean context: 5 judged gate fails, all 31 lint runs passing). The pages were fixed in place in `kb/tests/round4/`; the blind pairs Davon is ranking were not touched.

### Proof: `check.mjs`, 114 of 114
`KB_PORT=8777 node kb/tests/round4/check.mjs` (the port is now an environment variable; another session's server held 8765). The 91 round 3 checks still pass; 23 new rows prove the round 4 findings.

| Critic finding | Fix | Proof in `check.mjs` |
|---|---|---|
| Coffee 13a: option hover a raw 4 percent `color-mix` | `.opt:hover` and the sheet's `.opt.is-hover` paint `linear-gradient(var(--state-hover), var(--state-hover)), var(--color-surface)`; muted text still switches to `text-muted-on-tint` | no `color-mix` hover in page or sheet; the hovered option computes a gradient; `--state-hover` is 8 percent |
| Coffee 13b: raw 48, 40, 32px control heights | `--size-control-{sm,md,lg}` and `--size-icon-*` on the coffee root (they already exist in FOUNDATIONS v0.4.1, so FOUNDATIONS is unchanged); `.btn`, `.btn-sm`, the email and checkout fields and `.linkish` use them; the 44px touch minimums stay literal with a comment; motion comment says v0.4.1 | no raw `min-height: 32/40/48px` in the source; tokens compute 32, 40, 48, 16; buttons compute 48 and 40 |
| Coffee 16: "charged on roast day" against "Due today $39" | One rule everywhere: the first bag is paid at checkout, then every 2 or 4 weeks on roast day. Slip: "$18 at checkout, then every 2 weeks on roast day: next charge Tue, Oct 27." Cart: "Then every 2 weeks on roast day, from Tue, Oct 27 $18.00". Checkout: "Then $18 every 2 weeks on roast day, next on Tue, Oct 27." ("at checkout", not "today": search-check flags a bare relative date) | the phrase is gone from page and sheet; slip (2 and 4 weeks), cart ($39.00 due today, $18 from Oct 27) and checkout (Pay $39.00, same renewal) each read and matched |
| Coffee 16 (also): past tense for future dates; a third shipping rule | "It roasts Tue, Oct 13 in Portland and ships Wed, Oct 14" (empty cart, page and sheet); quick add "Roasts Tue, Oct 13"; lots note: "Single bags ship for $6, free over $40 or with a subscription" | no "roasted Tue" or "shipped Wed" left; the shipping rule is printed |
| Coffee band hole (fix 4): 343px at 1024, 159px at 1440 | The slip is 1,130 to 1,210px, taller than a laptop screen, so a sticky slip cannot work; the 441px proof column sticks instead (`position: sticky; top: 112px`, band `overflow: clip` so the band is not the scroller). It rides down beside the order form and ends level with the slip | at 1024 and 1440, scrolled to the slip's end, proof and slip bottoms differ by 0px, proof top clear of the 64px header |
| Dashboard 13a: "Invite&nbsp;&nbsp;&nbsp;a teammate" | the label is one flex item: `<span>Invite<span class="live-more">&nbsp;a teammate</span></span>` | in first-data at 1440 the gap between "Invite" and "a" equals one word space |
| Dashboard 15: empty 75 percent meter on the sheet | `states.mjs` uses `--color-warning` for fill and ring (the `*-mark` names were folded in round 4) | the sheet's warning meter fills 78 percent of its track in the warning color, ring drawn; no `warning-mark` left |
| Dashboard 16: outage caveats and the iOS glyph on sample data | Caveats and the glyph name their alert (`data-explained-by="#alert-checkout"`, `"#alert-ios"`); `html[data-phase~=setup]` hides `.kpi .caveat`, `.warn-mark` and the partial legend; the chart drops its dotted partial point and "partial since" from its description in sample states | default state keeps 2 caveats, the glyph and the dotted point beside visible alerts; first-run, listening and check-failed show none, and no visible element points at a hidden alert |
| Dashboard (fix 4): "This week, Oct 6 to 12" on a Tuesday to Monday window | Relabelled as rolling: "Last 7 days, Oct 6 to 12", "vs prior 7 days" on every delta and the table, "Top pages, last 7 days", iOS "down 18% in the last 7 days"; first comparisons on Oct 26 ("once two full weeks are in": Oct 12 to 18 and 19 to 25) | default shows "Last 7 days, Oct 6 to 12" and never "this week" or "vs last week"; first-data says Oct 26 twice and Oct 19 nowhere |
| Dashboard (fix 5): Pause 43x24 under a coarse pointer | `@media (pointer: coarse)`: `min-width: 44px` and a `::after` hit area 12px up and 8px down, so the label stays on the freshness line and the head stays 64px | hit area probed point by point: 44x44 at 390 with `hasTouch`, inside the 64px head |

### Further down the critic's list
- **Coffee fix 5, promise columns on a subgrid**: numeral, heading and body share three rows across the columns, so "We know every grower by name" wrapping at 1024 moves all three bodies down together. The `check.mjs` row now compares heading tops and body tops (the old row measured the wrapping `div`, which is now `display: contents`).
- **Coffee fix 10**: below 1024 "See all 9 coffees" follows the three lots instead of preceding their heading (checked at 390 and 768); the state sheet renders the menu toggle's states at 1440 (inside `@layer components`, because the page's `display: none !important` sits in that layer and a layered `!important` beats an unlayered one).
- **Dashboard fix 7**: the platform panel ends with its footnote (`align-self: start`).
- **Dashboard fix 9**: durations under a minute read "58s"; the palette's "Workspace settings" is "Settings", as in the sidebar and the shortcuts sheet.
- **Found by the new lint, fixed**: `--space-10` was used by `.split .empty` and declared nowhere in the dashboard (the empty panels lost their 96px top offset; it now applies, and the empty state reads balanced at 1440); the legend chip "Last 12 weeks:&nbsp;" sat beside an 8px gap (now one inline label); the phone table's no-match row sat in a max-content grid column and pushed the dashboard sheet to 427px at 390 (now `display: block`).
- **Not done (opinion items)**: coffee fix 6 (cap section H2s under the H1) and fix 7 (a dark-graded hero photo, needs a new asset), fix 9 (Newsreader metric fallback); dashboard fix 6 (busy buttons keep their label: the kept box has no room for a spinner beside the label without a width shift), fix 8 (table right edge), fix 10 (a denser compact mode), the time zone on the phone header (the first-data freshness line would wrap at 390).

### New tool checks (each fails `tools/fixtures/bad-tokens.html`; `good.html` passes)
- `undefined-var` (new `tools/lint-tokens.mjs`): a `var(--x)` with no fallback whose property is declared in no rule, no inline style and no `@property`, in a rule that matches at least one element. Fails the fixture's `--color-warning-mark` meter. It found `--space-10` on the dashboard.
- `state-layer` (`tools/lint-tokens.mjs`): hover and pressed backgrounds (`:hover`, `:active`, `.is-hover`, `.is-active`, `.is-pressed`) must be tokens, never a raw `color-mix()` or color; `--state-hover` must be 8 percent and `--state-pressed` 10.
- `double-space` (`tools/lint-layout.mjs`, every lint width): a flex or grid gap beside a no-break space at an item's edge, or two uncollapsible spaces in a row. It found the legend chip.
- `truth`, explained-by contract (`tools/lint-truth.mjs`): an element with `data-explained-by="<selector>"` fails when it is visible and its alert is hidden or missing; with no markup, a "partial since" caveat on a page with no visible alert naming a cause warns.
- `proportion`, meters (`tools/lint-truth.mjs`): a `role=meter` or `progressbar` above its minimum must paint a fill, to scale within 3 percent (fills under 2px are exempt: "38 of 10M" is an empty track to scale).
- `lint-all.mjs` takes `LINT_JOBS=4` to run four lints at once.

### Gates (round 4.1)
| Gate | Coffee | Dashboard |
|---|---|---|
| `tools/lint.mjs` page, 390/768/1024/1440, light and dark | PASS, 0 fail, 9 warn | PASS, 0 fail, 9 warn |
| every `?state=` URL | 12 of 12 PASS | 14 of 14 PASS |
| state sheet | PASS, 0 fail, 3 warn | PASS, 0 fail, 45 warn (targets on a desktop control sheet, as before) |
| `check.mjs` | 114 of 114 (both pages) | |
| `claims_inventory.mjs --year 2026` | exit 0, no flags; cart state exit 0 | exit 0; the named PERIOD warning ("vs prior 7 days" and "vs previous 12 weeks", each beside what it drives) |
| `search-check.mjs` | PASS public, 0 fail, 0 warn | PASS private, 0 fail, 0 warn |
| `conversion-audit.mjs` | no fails (page, quick, cart) | no fails (page, limit) |
| `icon_audit.mjs` | PASS | PASS |
| `motion-audit.mjs` (9 scenarios) | 6 of 6 | 3 of 3 |
| renders | `kb/tests/round4/shots/`: pages at 390, 768, 1024, 1440, light and dark; every state at 390 and 1440; both sheets | |

Claims ticked again for what changed: Oct 26, 2026 is a Monday, the day after the second full 7-day window (Oct 12 to 18, 19 to 25); Oct 6 is a Tuesday and Oct 12 a Monday, so "Last 7 days, Oct 6 to 12" is right on Oct 12; cart $18 + $21 = $39.00 due at checkout, next $18 on Tue, Oct 27 (+14) or $16 on Tue, Nov 10 (+28).

### Judged rows: self-scored, unverified
No subagent tool is available in this session, so no clean-context critic re-scored round 4.1. I looked at the new renders for each fixed item (listed below); the judged rows are **self-scored, unverified** until a fresh critic reads them.

Read by eye on the new renders: dashboard first-run at 1440 (no caveat under Conversion or Revenue, no iOS glyph, "Last 7 days, Oct 6 to 12", "58s"), first-data head ("Invite a teammate" with one space), empty at 1440 (the 96px offset now applies; both empty messages share one top edge), the dashboard sheet's warning meter (amber fill to 78 percent, amber ring), the coffee cart at 1440 ("Due today $39.00", "Then every 2 weeks on roast day, from Tue, Oct 27 $18.00"), the 1024 band in dark (the term line in the slip; at rest the proof sits under the perks, and it rides down as the reader scrolls, which a full-page render cannot show, so `check.mjs` measures it scrolled), the 1024 promises (headings and bodies on shared rows) and the shop at 768 ("See all 9 coffees" after the lots).

### Still open after round 4.1
1. A clean-context critic for round 4.1 (none available here); until then the judged rows are unverified.
2. The critic's opinion items listed above (coffee 6, 7, 9; dashboard 6, 8, 10; phone time zone), plus everything in "Still below the bar" (photography, font fallback shift, chart keyboard access).
3. FOUNDATIONS item 13, 15 and 16 rows do not yet name the new lint checks (`undefined-var`, `state-layer`, `double-space`, explained-by, meters); that is an editor-in-chief change, proposed here. design-director's state truth contract should add `data-explained-by`.

## Davon's blind ranking (2026-10-11)

Davon answered "1B, 2A, 3A", then corrected pair 3 to "3B". Final: 1B, 2A, 3B. Against the key (now revealed in `kb/tests/round4/blind-key.md`), round 4 won 1 of 3. All three pairs were fully blind (same photos on both sides). The pairs were rendered from round 4 before the 4.1 fixes.

| Pair | View | Picked | Round 4 was | Result |
|---|---|---|---|---|
| 1 | Coffee, 1440 light | B | B | Round 4 |
| 2 | Dashboard, 1440 light | A | B | Round 3 |
| 3 | Dashboard, 1024 light | B | A | Round 3 |

Reading (opinion until Davon says why): he preferred round 3's dashboard at both widths, even though round 3's header broke at 1024 and failed the gate. Round 3 keeps boxed panels, the teal accent on the chart line and share bars, and the date range and comparison controls in the toolbar. Round 4 moved toward Linear-style hairlines, a black chart line, grey row-fill bars and no date control at the top. The critic's "fewer boxes, toward Linear" advice lost to Davon's eye on the dashboard. Round 5 should keep round 4's correctness fixes and restore round 3's visual treatment, then test that.

Davon's follow-up: "Changes were very slight though." So the two dashboard picks are a near tie, not a verdict against round 4. Round 4's dashboard work was mostly correctness that a still screenshot does not show (state truth, overlap at 1024, proportions). The planned revert to round 3's look was stopped. Lesson for the tester: blind pairs only measure visible change; pair them with the gate results, and when the visible delta is small, say so before asking for a ranking.

## Round 4.2: the round 4.1 critic's judged fails, fixed and proved

Tester report, 2026-10-11. Branch `round4/fixes2`, cut from `origin/restructure`. Review: `kb/reviews/round4.1-critic.md` (fresh critic, clean context: 4 judged gate fails, all 30 lint runs passing). Pages fixed in place in `kb/tests/round4/`; the blind pairs were not touched.

### Proof: `check.mjs`, 124 of 124
`KB_PORT=8793 node kb/tests/round4/check.mjs`. The 114 round 4.1 rows still pass; 10 new rows prove the round 4.1 findings and the new tools.

| Critic finding | Fix | Proof in `check.mjs` |
|---|---|---|
| Coffee 16: "Skip, swap or cancel ... before the next roast" (band) against "Skip, pause or cancel ... before a roast" (slip, cart, checkout, sheet) | One promise everywhere: "Skip, swap, pause or cancel online any time before a roast" (band bullet, slip term line for 2 and 4 weeks, cart line, checkout summary, sheet). The cart line now carries the whole sentence, not a shortened "Skip, pause or cancel online" | the visible text of the page, cart, checkout, plan-4 and sheet holds exactly one "Skip, ... or cancel ... roast" variant, and it is this one; the source holds one |
| Coffee 13: `.print .lcurve` names `--color-orange-700` | `--color-illustration-ink-accent: var(--color-orange-700)` on the root, commented as printed ink on a physical label (one value in both themes, not remapped). Advisory done: the label's raw `#2a221b` in three `.print` rules became `--color-illustration-ink` | the curve computes `rgb(147, 55, 1)` in light and dark; no `.print` rule names a primitive or the raw hex |
| Dashboard 11: invite error is red text, no icon | The error line gets a 12px solid error glyph (`error-12`, drawn on the Tally 12 grid as the twin of `error`, same evenodd knock-out) in the error color, from a `<template>`, on the page and the sheet cell; the success line has none | after submitting "sam@" in first-run at 1440, `#invite-msg` holds a 12x12 `error-12` in the message color, `aria-invalid=true`; a valid address clears it; the sheet cell shows it |
| Dashboard 13: `.logo` reads `--color-slate-990`, rail tooltip `--color-slate-950` on `-50`; dark box 1.09 to 1.17:1 against its surfaces | `--color-on-brand` for the logo glyph; `--color-tooltip-bg`, `-text` and `-edge` (light: slate-950 on slate-50, no edge; dark: slate-800 box, slate-50 text, slate-500 1px edge as a box-shadow so nothing shifts) | at 900 (rail), hovering Events: light box 14.66:1 against the bg; dark edge 5.46:1 against the bg and 5.07:1 against the surface on its right, box 1.94:1, text 9:1 or more; the logo glyph is one color in both themes |

### New tool checks (each fails `tools/fixtures/bad-semantic.html`; `good.html` passes)
- `primitive-in-component` (`tools/lint-tokens.mjs`): a declaration that reads `var(--color-{hue}-{50..990})` outside a token-definition block fails. A token block is a rule whose every selector is `:root` or `html` (with attribute, class or `:not()` qualifiers), a bare `[data-*]`, or `.dark`, `.light`, `.theme-*`; only custom properties there may read primitives. Inline styles count as components. Run on the round 4.1 pages it found exactly the critic's three rules (coffee `.print .lcurve`; dashboard `.logo` and the tooltip) and nothing else.
- `error-icon` (`tools/lint-tokens.mjs`): a visible `[role=alert]`, `aria-errormessage` target, or `aria-describedby` target of an `aria-invalid=true` control (with several targets, the ones named for an error) must hold an svg, img, `[role=img]`, a painting `::before` or `::after`, or a text marker such as "Error:". On the round 4.1 sheet it found the invite error cell. The fixture's iconed error and "Error:" alert pass.
- `tools/lint.mjs --states` now sets each state on the target's own query with `URLSearchParams` (`coffee.html?state=removed --states state=checkout` lints `?state=checkout`, not `?state=removed&state=checkout`); a `check.mjs` row proves it.
- `claims_inventory.mjs` PROMISE reads subscription rights as a verb list before its comma split and compares the verb sets: "Skip, swap or cancel" against "Skip, pause or cancel" warns as `subscription rights has 2 different values`. It warned on the round 4.1 coffee page and is silent now.

### Gates (round 4.2)
| Gate | Coffee | Dashboard |
|---|---|---|
| `tools/lint.mjs` page, 390/768/1024/1440, light and dark | PASS, 0 fail, 9 warn | PASS, 0 fail, 9 warn |
| every `?state=` URL and variant | 12 of 12 PASS | 14 of 14 PASS |
| state sheet | PASS, 0 fail, 3 warn | PASS, 0 fail, 45 warn (targets on a desktop control sheet, as before) |
| `check.mjs` | 124 of 124 (both pages and tools) | |
| `claims_inventory.mjs --year 2026 --render` | exit 0, no flags or warnings on page, cart, checkout, cart-empty, subscribed, plan-4, sheet | exit 0; the named PERIOD warning ("vs prior 7 days", "vs previous 12 weeks"), as in 4.1 |
| `search-check.mjs` | PASS public, 0 fail, 0 warn | PASS private, 0 fail, 0 warn |
| `conversion-audit.mjs` | no fails (page, cart); the 390 shipping-cost warn as before | no fails |
| `icon_audit.mjs` | PASS | PASS (page and sheet, `error-12` included) |
| `motion-audit.mjs` (9 scenarios) | 6 of 6 | 3 of 3 |
| renders | `kb/tests/round4/shots/` re-rendered: pages at 390, 768, 1024, 1440, light and dark; every state at 390 and 1440; both sheets | |

Read by eye on close crops at 2x (scratchpad, not committed): the cart at 390 (the promise wraps to two lines under "Pour-over, every 2 weeks", Remove keeps its place), the rail tooltip in dark (a lifted slate box with a visible grey edge against the near-black bg and the rail), the invite error in dark (icon, then the text, in the danger tint, under the red-ringed field).

### Judged rows: self-scored, unverified
No subagent tool in this session, so no clean-context re-score of round 4.2. The four fixes are proved by `check.mjs`; the judged rows stay **self-scored, unverified** until a fresh critic reads the renders.

### Still open after round 4.2
1. A clean-context critic for round 4.2.
2. The critic's opinion and advisory items not done here: band hole at rest at 1024, H2 at 96 percent of H1, dark-graded hero photo, busy buttons without a label, the table's empty Actions column, compact density, "PT" on the phone header, the sheet's empty-cart panel missing "Buy this bag, $21".
3. Foundation conformance items from the critic for the editor-in-chief: off-schema names (`--color-selected-*`, `--color-scrim`, `--color-chart-*`, `--color-feature-*`, `--text-numeral`, `--size-control`). This round adds `--color-tooltip-{bg,text,edge}`, `--color-on-brand` and `--color-illustration-ink(-accent)` to the pages; the schema should adopt tooltip and on-brand as roles or say how to name them.
