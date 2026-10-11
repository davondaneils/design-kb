# Tests: design-product-ui v0.1

Tester run, 2026-10-09. Briefs and rubric: `kb/briefs/product-ui/slice-test-briefs.md` (editor-in-chief). Pages, lint JSON and screenshots: `kb/tests/design-product-ui/`.

## Method
- **Baseline ("before")**: the with-skill pages from the color pilot (`kb/tests/design-color/dashboard-with.html`, `coffee-with.html`), copied unchanged as `dashboard-before.html` and `coffee-before.html`. They were built through design-director with design-color and FOUNDATIONS defaults, before design-product-ui existed, so they are an honest "without this skill" baseline. Their screenshots are `kb/tests/design-color/shots/{dashboard,coffee}-with-*.png` (not duplicated here).
- **After**: the same pages rebuilt through design-director > design-playbook-dashboard > design-product-ui (all six references), keeping the pilot's color, type and chart untouched so the difference is this domain only.
- **Clean context note**: the same agent wrote the skill and the pages. The baseline was written earlier by a different session, which is cleaner than the color pilot, but a fresh subagent should still rebuild the "after" page from the skill alone before v1.0.
- **States are rendered, not described**: the dashboard reads `?state=loading|empty|partial|viewer`, `?density=compact` and `?open=palette|sheet`; the coffee page reads `?state=added|subscribed`. Each state was linted and rendered as its own page.
- Fonts: Inter is installed locally and used; no web font or image CDN was reachable (network policy). Icons are hand-drawn inline SVG at one 1.5 stroke.

## Lint (`node tools/lint.mjs`, final versions)
| Page | Before | After |
|---|---|---|
| Dashboard, ready | PASS, 0 fail, 16 warn | PASS, 0 fail, 30 warn |
| Dashboard, loading / empty / partial / viewer | not built | PASS 0 fail each (9 / 9 / 15 / 30 warn) |
| Dashboard, compact density | not built | PASS, 0 fail, 30 warn |
| Dashboard, palette open / shortcut sheet open | not built | PASS, 0 fail (30 / 32 warn) |
| Coffee landing, default | PASS, 0 fail, 17 warn | PASS, 0 fail, 17 warn |
| Coffee, item added / newsletter subscribed | not built | PASS, 0 fail, 17 warn each |

Warnings are the lint's judged items: targets under 44px at 390px (sort buttons 24px tall, chips 32px, row menu buttons 40px; all at or over the 24px floor) and axe "needs review" contrast on SVG text and the scrim. Reviewed by eye; SVG axis text is the same pairs the color pilot measured (5.29:1 light, 9.65:1 dark).

Lint fails caught and fixed during the build (round 1, 19 fails then 11 more in states):
1. `.sr-only` with the common `margin: -1px` fails the spacing scale; changed to `margin: 0` (works the same with `clip`).
2. The page path "/" was a 5px-wide link (target under 24); `min-width: 24px` on the primary cell link.
3. Alert links at 22px tall; padding raised to `--space-2`.
4. Workspace switcher `aria-label` did not contain its visible text (2.5.3 label in name); replaced by visible text plus an sr-only suffix.
5. `aria-label` on a KPI `span` (full value of "48.2k", and the "no data" dash): `aria-prohibited-attr`. Replaced by `aria-hidden` visible text plus sr-only full value. **Skill gap, fixed in `references/06-dashboards.md`.**
6. Palette `margin-top: 15vh` (135px) off the spacing scale; 96px. Native input padding 1px; zeroed.
7. Shortcut sheet help text at 85 characters per line; `max-width: 32em`.

## Judged items (`[judged]` rows), after pages
| Item | Dashboard | Coffee (product UI only) |
|---|---|---|
| 3 Non-text contrast | Control borders slate 500 (3.44:1 / 5.07:1), switch track the same, focus ring teal 600 / 400 as the pilot; chip dashed border is the "inactive filter" cue, solid when active | Cart count badge text 15:1 on near-black fill; buttons unchanged from pilot |
| 11 Not color alone | Sort state: arrow plus weight plus `aria-sort` plus footer text "Sorted by views, highest first"; deltas arrow, sign, "worse"; alerts icon plus "Error:"/"Warning:"; restricted tile lock icon plus sentence | "Added" has a check icon and the word; error has icon and text |
| 12 One primary action | "Share report" (ready), "Install snippet" (empty state) | unchanged |
| 13 Consistency | One icon stroke, 8px controls, 12px panels, 4px kbd, pill chips (filters only) | Cart badge uses the page's pill family |
| 14 Both themes | All states rendered light and dark; palette and sheet use raised surface plus ring in dark (no shadow) | Added and subscribed states in both themes |
| 15 States | Ready, loading (skeleton keeps panel geometry), first-use empty, partial failure (table only, Retry), viewer permission (Revenue tile names who to ask), stale freshness line, hover, focus, selected nav, sort, row menu open, palette, shortcut sheet, compact density | Add to cart: idle, added (optimistic, 2s), cart count; newsletter: error, sending (spinner, label kept), success in a status region |

Gate: **pass** on every page and state.

## What changed on the dashboard (before > after)
1. Table: no longer scrolls sideways at 390; rows collapse to two-line items with the sorted measure on line 1 and "Avg. time" and "Share" on a muted line 2; ARIA table roles restated (Safari). Sortable headers as buttons, arrow on the inner side of numeric headers, `aria-sort`, announced sort, footer with sort and "1 to 6 of 214". Unit moved to header ("Share, %"). Row "More" menu (keyboard: arrows, Home, End, Esc returns focus), hover reveal on desktop only. Middle truncation for long paths with the full path for screen readers.
2. Answer line above the KPIs, linking to the alert that explains the caveat. Alerts moved before the charts as a "Needs attention" strip. Freshness and time zone in the header.
3. Keyboard layer: Cmd/Ctrl+K palette (APG combobox in a modal dialog, grouped, shortcuts shown, aliases, ranked matching), `/` focuses search, `?` opens a shortcut sheet with a "Single-key shortcuts" switch that autosaves (WCAG 2.1.4), G-then-key navigation, nothing fires while typing.
4. Shell: workspace switcher, sidebar footer with Commands and Shortcuts, 56px icon rail with tooltips from 768 to 1023, drawer under 768.
5. Density: Default and Compact segmented control remaps 5 tokens on the root; coarse pointers keep 40px rows.
6. States as above, reviewable through `?state=`.

## Exemplar comparison
**Limit: no exemplar screenshot exists.** The apps are behind logins and exemplar hosts are blocked to `curl` and the renderer (`kb/exemplars.md`). Comparison is against the teams' public docs (fetched) and the judge's memory of the apps, and must be redone side by side with real screenshots.

| Page | Nearest exemplar | Rating | Why, in the pixels |
|---|---|---|---|
| dashboard-with (ready) | Vercel Dashboard, Stripe Dashboard home | **Close** on the product UI rubric (answer first, table craft, states, keyboard, density) | The 1440 shot reads in the order a Stripe home does: finding, numbers, what needs me, trend, detail. Table columns share edges; numbers are typography. The phone shot is one vertical scroll with the table comparison intact. |
| dashboard-with, as a whole | same | **Clearly below** on polish | Hand-drawn icons, not a designed set; header is crowded at 1024 to 1280 (search, Commands, primary); ghost "Manage alerts" and "Open in Events" read as plain text; the chart is the pilot's basic line chart; no motion layer; filter chips are not functional. Linear's and Vercel's chrome is quieter and tighter than this. |
| dashboard-with states | Vercel (Geist empty states), Linear | **Close** | Loading skeleton mirrors geometry (no jump), empty state teaches one action and swaps the primary button, partial failure stays in one card, permission state names a person. Still missing: a skeleton for the legend and axis labels, and a stale-data warning tint. |
| coffee-with, product UI only | apple.com product pages (bag), family.co | **Close** for the two elements checked | Add to cart now confirms in place and in the header count; newsletter has sending and success states. The rest of the page was out of scope and is unchanged; it stays **clearly below** its exemplars for type, imagery and art direction (color pilot finding). |

Versus the baseline: **clearly better** on the dashboard (it closes four of the five craft gaps the color pilot named: states, keyboard layer, density, phone table; the fifth, a real icon set, is not this domain). Coffee: small, real gain in feedback states only.

## Verdict
- **Pass** on the dashboard brief: gate 100 percent across 8 rendered states, rated close on rubric items 1 to 5, clearly better than the baseline.
- **Pass** on the coffee brief for its product UI elements. Not a judgement of the landing page.
- **Not yet at the Jordan bar overall.** The page now behaves like a top product UI; it does not yet look like one. The remaining gap is visual polish and iconography (planned domains: visual polish, art direction), and Davon's blind ranking has not been run for this wave.

## Gaps found
| # | Gap | Where | Status |
|---|---|---|---|
| G1 | Abbreviated KPI values had no safe pattern for the full value; `aria-label` on a span fails axe | `references/06-dashboards.md`, SKILL.md numbers | Fixed |
| G2 | Palette matching: typo-tolerant subsequence alone ranks badly ("set" found "Share report" first) | `references/02-find-and-command.md` move 3, SKILL.md move 7 | Fixed |
| G3 | Bulk actions and settings pages were not exercised by slice brief B (no bulk need on an overview) | test briefs 03 and 05 in `kb/briefs/product-ui/` | Open: run "Bulk archive 300 issues" and "Workspace settings for Tally" next |
| G4 | Coffee page has a visible fundamentals defect outside this domain: the "How we roast" ordered list shows both the list marker and the numeral ("1. 01") at 1440 | `kb/tests/design-color/coffee-with.html` | Reported to the editor-in-chief (pipeline notes); not fixed here because the brief limits this domain to product UI |
| G5 | The lint cannot see states behind a query string unless the tester lints each URL; `lint.mjs` writes JSON next to the target and crashes on `file://...?state=` targets without `--json` | `tools/lint.mjs` | Pipeline note |

## Screenshots
- After, ready: `kb/tests/design-product-ui/shots/{dashboard,coffee}-with-{390,1440}-{light,dark}.png`.
- After, states: `shots/dashboard-with-{state-loading,state-empty,state-partial,state-viewer,density-compact,open-palette,open-sheet}-{390,1440}-{light,dark}.png` (viewport only); `shots/coffee-with-state-{added,subscribed}-*.png` (full page).
- Before: `kb/tests/design-color/shots/{dashboard,coffee}-with-*.png`.
