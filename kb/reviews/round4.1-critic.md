# Round 4.1 critic review: coffee landing page and Tally dashboard

- Reviewer: critic, clean context (did not build the pages). Branch `restructure` at `9ea2277`.
- Judged against: `CLAUDE.md` quality bar, `kb/FOUNDATIONS.md` (v0.4.1 as committed), `skills/design-foundations/references/fundamentals-checklist.md`, `skills/design-director/SKILL.md`, both job playbooks, `kb/teardowns/INDEX.md` and stripe-home, apple-macbook-air, linear-app, stripe-dashboard, vercel-dashboard, and `kb/reviews/round4-critic.md`.
- Pages: `kb/tests/round4/coffee.html`, `coffee-states.html`, `dashboard.html`, `dashboard-states.html` (line numbers refer to the `.src.html` sources unless a built file is named).
- Order of work: sections 1 to 6 were written before opening `kb/tests/round4.md`. Section 7 is the comparison.

## Verdict

**Revise. All 30 lint runs pass and all five round 4 judged fails are truly fixed, but each page still fails the gate on two new judged items.** Every new fail is a one-line to five-line fix. Same pattern as last round: the misses sit between parts of the page that are each fine on their own.

- Coffee: fails **item 16** (the cancel promise is worded two ways with different rights: "Skip, swap or cancel online, any time before the next roast" in the band against "Skip, pause or cancel online any time before a roast" in the slip, cart and checkout) and **item 13** (the bag label's roast curve names the primitive `--color-orange-700` inside a component, `coffee.src.html:329`).
- Dashboard: fails **item 11** (the invite field error is red text with no icon; every other error on both pages carries icon plus text, which the checklist requires) and **item 13** (the collapsed-sidebar tooltip and the logo name primitives `--color-slate-950`, `-50` and `-990` inside components, `dashboard.src.html:222, 247`; in dark the tooltip box sits at 1.09:1 to 1.17:1 against the surfaces it floats over).

Against the exemplars (opinion): coffee is **below** Apple MacBook Air and Stripe. The dashboard is **close** to the Linear app and the Stripe and Vercel dashboards at 1440 and 1024, and still below Linear on density.

## 1. Numbers measured (re-run, not copied)

Chromium at `/opt/pw-browsers`. The repo was served on port 8791. Lint JSON went to the scratchpad (`--out-dir .../r41lint`), so the committed `.lint.json` files are untouched. My renders, probes and strips are in the scratchpad and are not committed.

| Check | Result |
|---|---|
| `tools/lint.mjs`: coffee plus 12 states, coffee sheet | 14 runs, all PASS, 0 fail. Warnings: page 9 (3 targets, 4 fluid display sizes, 1 sticky-focus on the fixed skip link, 1 fallback); checkout states 14 and 16 (`svg-overlap` behind the dialog); sheet 3 |
| `tools/lint.mjs`: dashboard plus 14 variants, dashboard sheet | 16 runs, all PASS, 0 fail. Warnings: page 9 (targets at 390); first-data 11 (one `proportion` warn: 4 shares sum to 100.1, which is rounding over all 4 rows); sheet 45 target warns. The new checks `undefined-var`, `state-layer`, `double-space` and `explained-by` (inside `truth`) ran on every report |
| Note on `--states` | Combining `--states` with a page URL that already has a query appends both params (`?state=removed&state=checkout`). I deleted those reports and re-ran each state on its own. Worth a guard in `tools/lint.mjs`: replace the existing query instead of appending |
| `claims_inventory.mjs --year 2026` | Coffee page plus `--render` on cart, checkout, cart-empty and subscribed: exit 0, no flags. Dashboard page plus 7 states with `--render`: exit 0, 1 `PERIOD` warning on each ("vs prior 7 days", "vs previous 12 weeks"), each named where it is read |
| `search-check.mjs` | Coffee public PASS 0/0; dashboard `--expect private` PASS 0/0 |
| `conversion-audit.mjs` coffee | No fails; 1 warn (add-to-cart at 390 has no shipping cost beside it) |
| `icon_audit.mjs` | Both PASS |
| `motion-audit.mjs kb/tests/round4/scenarios.mjs` | 9 of 9 pass, on tokens. Keyboard paths (`dash-2-metric-switch`, `dash-3-palette-key`) film 0 animations |
| `kb/tests/round4/check.mjs` (KB_PORT 8791) | All pass, including the 5 round 4 fails, the advisories it covers and the bad-tokens fixture |
| Focus ring contrast (Tab through every stop, ring color against the first opaque ancestor) | Coffee min 5.25 light, 10.08 dark (32 stops at 1440). Dashboard min 4.17 light, 6.8 dark (47 stops). Rings drawn on a parent (`.card-link::after`, `.opt:has(:focus-visible)`, `.kpi-pick::after`, search `:focus-within`) sit on surfaces measured below |
| Token contrast (computed per theme) | Coffee: muted on surface and bg 5.32 and 4.95; on-tint on sunken 7.98; input border 3.44 and 5.10; white on primary 5.64; accent on selected fill 4.62 or more (the fill is selected-bg mixed 50% with surface); danger on bg 5.39. Dashboard: muted on surface, bg, danger and warning tints 5.29, 4.93, 4.91, 4.92; border-strong 3.44 on surface and **3.21 on bg** (passes); on-primary 5.03; previous-period line 3.44; dark tooltip `slate-950` on dark bg and surface **1.17 and 1.09** |
| Dark native radios (coffee slip) | Ring about 4.5:1 against the card (sampled from the render, JPEG) |
| Coffee headings (computed) | H1 50 / 88 / 63 / 77px at 390 / 768 / 1024 / 1440; section H2 39 / 52 / 60 / 75px. "Bought by name..." runs 5 lines at 1024 and 1440 |
| Coffee arithmetic | Ratings 1,040 + 160 + 44 + 22 + 18 = 1,284, mean 4.70; 5-star bar 226 of 280px (81%). Ledger rules 200, 291, 455px for $1.80, $2.62, $4.10. Roast curve: every marker within 1px of its time and temperature (80.2px a minute, 2.25px a degree). Cart $18 + $21 = $39; Oct 13 + 14 = Oct 27, + 28 = Nov 10 |
| Dashboard arithmetic | WAU series `cur` (`dashboard.src.html:1462`): 44,600 to 48,210 is +8.09%, and the last 8 steps all rise ("eighth rise in a row" true). Revenue 170,400 to 184,200 +8.10%; conversion 3.2 to 3.8 +0.6 pts; churn 2.5 to 2.9 +0.4 pts. First-data: 21 + 9 + 5 + 3 = 38 views, shares 55.3, 23.7, 13.2, 7.9; platforms 9 + 2 + 1 = 12, web bar 539 of 719px (75%). Nov 11 = Oct 12 + 30 days. Rolling windows: Jul 21 and Oct 6, 2026 are Tuesdays; first comparison with a full prior window is Oct 26 |

## 2. Fundamentals gate, item by item

Read on my renders at 390, 768, 1024 and 1440 (light and dark), viewport renders of all 11 coffee dialog states at 390 and 1440, extra state renders at 768 and 1024 (first-data, first-run, limit, partial, cart, checkout), the committed state shots, and both sheets.

### Coffee (`coffee.html`, `coffee-states.html`)

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | axe | Pass | lint on page, sheet and 12 states |
| 2 | Text contrast | Pass | lint `axe`, `overlay`; pairs in section 1 |
| 3 | Non-text contrast | Pass | Borders 3.44 and 5.10; rings 5.25 or more; rating fill against track 4.13 (round 4, unchanged) |
| 4 | Targets | Pass | 3 warns at 390 on lot name links, each covered by its row's `::after` |
| 5 to 8 | Measure, scale, spacing, overflow | Pass | lint at four widths |
| 9 | Focus, skip link, sticky header | Pass | lint; ring contrast as measured. The `sticky-focus` warn on the fixed skip link is a false positive |
| 10 | Reduced motion | Pass | lint `motion`; strips pass |
| 11 | Not color alone | Pass | Brew error and email error carry icon plus text (sheet); body links underlined |
| 12 | Hierarchy | Pass, advisory | One filled CTA per screen. Advisory, carried from round 4 and still open: section H2s are 95 to 97 percent of the H1 at 1024 and 1440 |
| 13 | Consistency | **Fail (judged)** | `.print .lcurve { stroke: var(--color-orange-700) }` (`coffee.src.html:329`): a component names a primitive, which the FOUNDATIONS token schema forbids ("a component never names a primitive"). The label is printed ink, so it should not follow the theme. That is a reason for a fixed semantic token (`--color-print-ink`), not for a primitive. Same class as round 4's raw control sizes. Round 4's 13a (4% hover) and 13b (raw sizes) are fixed |
| 14 | Themes | Pass, advisory | Dark is remapped. Advisory: the daylight hero photo is the same in both themes |
| 15 | States | Pass | 12 states and the sheet lint; the menu toggle cell now renders at 1440. Advisory: the sheet's empty-cart panel has no "Buy this bag, $21", while the page's `?state=cart-empty` does. The sheet says it uses "the page's own markup", so it has drifted |
| 16 | Copy true and consistent | **Fail (judged)** | **The cancel promise has two wordings and two sets of rights.** Band bullet: "Skip, swap or cancel online, any time before the next roast". Slip term line, cart line, checkout summary and sheet: "Skip, pause or cancel online any time before a roast" (4 places; `grep -o "Skip, [a-z]* or cancel"`). A subscriber reads that they can swap in one place and pause in another. FOUNDATIONS item 16: "each promise has one wording". The claims inventory cannot see it: no number differs. The round 4 money fail is truly fixed: slip, cart and checkout all say "$18 at checkout, then every 2 weeks on roast day, next Tue, Oct 27", and "Due today $39.00" now agrees |

### Tally dashboard (`dashboard.html`, `dashboard-states.html`)

| # | Item | Result | Evidence |
|---|---|---|---|
| 1, 2 | axe, text contrast | Pass | lint on page, sheet and 14 variants; pairs in section 1 |
| 3 | Non-text contrast | Pass | Rings 4.17 or more; borders 3.21 to 5.46; previous line 3.44; platform bars 4.39 (round 4) |
| 4 | Targets | Pass | Pause is 44x44 under a coarse pointer and the header stays 64px (`check.mjs`) |
| 5 to 8 | Measure, scale, spacing, overflow | Pass | lint |
| 9 | Focus, sticky header | Pass | lint `sticky-header`, `focus-shape`; ring contrast measured |
| 10 | Reduced motion | Pass | lint; keyboard paths film 0 animations |
| 11 | Not color alone | **Fail (judged)** | The invite field error (`#invite-msg`, `dashboard.src.html:881, 1438`; sheet cell "Invite field, error") is a red line of text with a red border and **no icon**. `.field-msg` even reserves `gap: var(--space-2)` for one. The checklist row reads "errors have icon plus text". The page's own alerts, the CSP check failure and every coffee error do this. One product, two error anatomies |
| 12 | Hierarchy | Pass | Header one row at every width; one primary |
| 13 | Consistency | **Fail (judged)** | Components name primitives: `.logo { color: var(--color-slate-990) }` (`:222`) and the collapsed-sidebar tooltip `background: var(--color-slate-950); color: var(--color-slate-50)` (`:247`). Because the tooltip skips the semantic layer, it does not remap: in dark its box is 1.17:1 on the bg and 1.09:1 on the surface (text 14.9:1, so it stays legible but has no edge). Round 4's 13a (split "Invite a teammate", now 3.5px, one space) and 13b (`--color-warning-mark`) are fixed |
| 14 | Themes | Pass | Dark remapped; status tints re-made per theme |
| 15 | States | Pass, advisory | Warning meter fills 78% in `--color-warning` with its ring. Advisory, carried from round 4: busy buttons show a spinner with no label |
| 16 | Copy true | Pass | Sample states drop both "Partial since 2:05 pm" caveats, the iOS glyph and the dotted chart point (`data-explained-by`, lint `truth`). Every number in section 1 ticks. "Last 7 days, Oct 6 to 12" names the rolling window; first-data says comparisons start Oct 26. Small wording note, not a fail: "once two full weeks are in" is loose, because on Oct 26 the current window is still open (the default page compares an open window too) |

## 3. Round 4 critic failures: fixed or not

| Round 4 finding | Status | Evidence |
|---|---|---|
| Coffee 13: option hover 4% | Fixed | `.opt:hover` uses `--state-hover` (8%) on page and sheet; lint `state-layer` |
| Coffee 13: raw control sizes, v0.3 comment | Fixed | `--size-control-*`, `--size-icon-*` on the root; comments say v0.4.1 |
| Coffee 16: "charged on roast day" against "Due today $39" | Fixed | One charge rule in slip, cart, checkout and sheet (renders above) |
| Dashboard 13: "Invite&nbsp;&nbsp;&nbsp;a teammate" | Fixed | One word space at 768, 1024 and 1440 (my renders of first-data) |
| Dashboard 15: empty warning meter on the sheet | Fixed | Fill and ring paint (sheet render) |
| Dashboard 16: outage caveats on sample data | Fixed | first-run, listening and check-failed renders: no caveat, glyph or partial point |
| Advisories done | Fixed | Pause 44x44 under a coarse pointer; "Last 7 days" label; Oct 26; promise columns on subgrid; "See all 9 coffees" after the lots at 390 and 768; sheet menu toggle; empty-cart tense; lots footnote states the cart's free-shipping rule; platform panel ends with its footnote; "58s" |
| Advisory: 343px hole at 1024 | Half fixed | The proof column is sticky and meets the slip's end while scrolling (`check.mjs`: gap 0). At rest, and in any full-page shot, the band still shows 343px at 1024 and 159px at 1440 of empty orange under the review |
| Advisories still open | Not fixed | H2 at 96% of H1; dark-graded hero photo; metric fallbacks for the serif (lint `fallback` -81px); busy buttons without label; table's empty Actions column (Share ends 45px short of the table edge at 1440); "times in PT" dropped at 768 and 390 while "Partial since 2:05 pm" stays; compact mode not re-checked by me |

## 4. New judged failures (this round)

1. Coffee 16: "Skip, swap or cancel" against "Skip, pause or cancel" (section 2).
2. Coffee 13: primitive in a component (`--color-orange-700`, label curve).
3. Dashboard 11: invite field error without an icon.
4. Dashboard 13: primitives in the logo and tooltip; the dark tooltip box has no visible edge.

None of these is new code. All four were on the round 4 pages and the round 4 critic missed them. They count against this round because the gate is judged cold.

## 5. Five most valuable remaining fixes per page

### Coffee (closest: Apple MacBook Air, then Stripe)
1. **One cancel promise** (gate 16). Pick the rights the product has and use one string in all five places, for example "Skip, swap, pause or cancel online any time before a roast" (band bullet in `coffee.src.html`, slip, cart, checkout, `states.mjs`). Add a `check.mjs` row that greps for exactly one "Skip, ... or cancel" variant.
2. **Print ink as a semantic token** (gate 13). Declare `--color-print-ink: var(--color-orange-700)` in the root (not remapped per theme, with a comment that it is ink on a physical label) and use it at `:329`.
3. **Close the band at rest, not only while scrolling** (rhythm). Sticky fixes the scroll and leaves the static composition and every screenshot with a 343px orange gap at 1024. Move the rating block under the slip from 1024 to 1279 with `grid-template-areas`, or end the band on the review and let the slip overhang into the next section on a negative margin (opinion: Apple ends a tile when its object ends).
4. **Give the H1 its rank** (opinion, hierarchy). Cap section H2s at `clamp(39px, 4.5vw, 61px)`. "Bought by name, tasted twice, shipped the day after the roast." should break in two or three lines across 8 columns, not five lines at 75px. Also, the H1 is larger at 768 (88px) than at 1440 (77px): make the hero clamp grow with width.
5. **Dark-graded hero photo** (art direction). Add a `<source media="(prefers-color-scheme: dark)">` crop graded about one stop down. In dark the daylight bag is the brightest object on the page by far, and the H1 loses the first fixation.

### Dashboard (closest: Linear app, then Stripe and Vercel dashboards)
1. **Icon on the invite error** (gate 11). Prepend the same `{{i:error-12}}` glyph the alerts use when `m.className` gets `err` (`dashboard.src.html:1439`) and in the sheet cell (`states.mjs`).
2. **Semantic tooltip and logo tokens** (gate 13). Add `--color-tooltip-bg` and `--color-tooltip-text` (light: slate-950 on slate-50; dark: slate-800 with `--ring`) and `--color-on-brand` for the logo mark. In dark the tooltip then gets a visible edge, the way Linear lifts floating panels to `#161718` with a `.12` white border (`kb/teardowns/linear-app.md`).
3. **Busy buttons keep their verb** (opinion, round 4 fix 6). The coffee kit keeps "Get the letters" beside its spinner, while Tally shows a spinner alone. One rule for both: spinner in the icon slot, label stays, `aria-busy`.
4. **Earn the table's right edge** (craft). Hide the empty Actions column above 640px and show the row menu on row hover and focus, so "Share of views" ends at 1408 with the table, the footer and "All pages".
5. **Density** (exemplar gap). Linear's list runs 13px on 40px rows with 28px nav rows. Tally's compact mode should drop KPI numerals to 31px, rows to 32px and the chart to about 200px, so that the first table rows sit above 900px at 1440. Also keep "PT" on the phone header.

## 6. Expert-learning test

What a top practitioner might not already know, still on these pages: the bag label as page HTML printed on the photo; ledger rules drawn to scale with the ratio as the headline; the roast curve with every marker placed to the pixel; the 3-star review answered in place; "Tax (Oregon has no sales tax) $0.00"; the CSP diagnosis with the exact `script-src` line and "Send to a developer"; "The line starts tomorrow" as an empty chart that explains its own time grain; caveats tied to their alerts with `data-explained-by`, so sample data never inherits a live outage note; status hue muted to gray on sample data while the words stay. The ceiling holds. The floor is short by four small items.

## Exemplar verdicts (opinion)

- **Coffee: below** Apple MacBook Air and Stripe. Close on type (Newsreader 1.1, tracking), proof graphics and copy truth. Below on photography (stand-ins, one grade for both themes), on section hierarchy (H2 at 96% of H1) and on the band composition at 1024 at rest.
- **Dashboard: close** to the Linear app, Stripe and Vercel dashboards at 1440 and 1024 (hairline sections, ink series, status hue only on state, row-background shares as Vercel does, named comparison bases as Stripe does). Below Linear on density and on floating-layer craft in dark.

## Foundation conformance (for the editor-in-chief)
- `kb/FOUNDATIONS.md` checklist rows 13 and 16 changed in `9ea2277` (new `undefined-var`, `state-layer`, `double-space`, `explained-by`) with no change-log entry and no version bump. The file and its mirror still say v0.4.1. FOUNDATIONS requires checklist changes to be logged.
- Row 13 and the lint require `--state-hover` and `--state-pressed`, but the token schema has no State row. Add `--state-{hover,focus,pressed,dragged}` (8, 10, 10, 16 percent) to the schema table.
- Off-schema names both pages invent: `--color-selected-{bg,ring,text}`, `--color-scrim`, `--color-chart-*`, `--color-feature-*` (coffee), `--text-numeral` (coffee, a third display size beyond `--text-display` and `-2`), and `--size-control` without a size suffix (dashboard). Either adopt them into the schema (selected, scrim and chart are real roles) or rename.

## 7. Comparison with the builder's self-review (`kb/tests/round4.md`)

(Written after sections 1 to 6.)

The tool numbers reproduce: 0 fails in every lint run, the same warning counts (9 and 9 on the pages, 3 and 45 on the sheets), claims, search, conversion, icon and motion audits as reported, and every `check.mjs` row. Builder and critic agree that all five round 4 fails are fixed; I confirmed each on my own renders, not only through `check.mjs`.

| Builder's claim | My finding | Gap |
|---|---|---|
| Judged rows hold (self-scored, unverified, honestly labelled) | 4 judged fails, all old code the round 4 critic also missed: two cancel wordings (coffee 16), primitive in the label curve (coffee 13), invite error without icon (dashboard 11), primitives in the tooltip and logo (dashboard 13) | Small, but enough to keep the gate closed |
| Band: proof "rides down as the reader scrolls", measured scrolled | True, and an honest note that a full-page render cannot show it. At rest the hole is still 343px at 1024 | I rate it half fixed (opinion) |
| "Oct 26 ... the day after the second full 7-day window (Oct 12 to 18, 19 to 25)" | The page's windows run Tuesday to Monday (Oct 6 to 12), so the windows are Oct 13 to 19 and 20 to 26. Oct 26 is still right, but by the page's rule it is the end of the second window, not the day after | The tick is right for the wrong reason; the page copy is unaffected |
| Proposal that FOUNDATIONS rows 13, 15 and 16 name the new checks (editor-in-chief change) | Rows 13 and 16 were edited anyway in `9ea2277` without a change-log entry or version bump | Process: log it as v0.4.2 |

Calibration for round 5: the classes this round's lint added worked, and nothing they cover came back. What is left is (1) wording promises that cannot be checked by number: diff every "Skip / cancel / refund / ship" sentence as strings across page, cart, checkout and sheet; (2) the semantic layer: a lint rule for any `var(--color-<hue>-<step>)` outside a token block would have caught both item 13 fails; (3) error anatomy as one component shared by both kits, so an icon cannot be left out.
