# Round 3: every wave 2 gain on one coffee page and one dashboard

Tester report, 2026-10-10. Branch `round3/build`, merged with `origin/restructure` at 714c837 (FOUNDATIONS v0.4, the stricter `tools/lint.mjs`, updated director and playbooks) before the final gates. Pages, sources and evidence live in `kb/tests/round3/`.

## What was built
- **Coffee homepage** (`coffee.src.html` built to `coffee.html` by `build.mjs`): design-director, then design-playbook-landing. All wave 2 gains folded in: layout (12-column grid with a margin column, ruled lots index, chart paper bleeding right, hanging labels, 2.3x ledger with rules to scale), copy (absolute dates, one verb per action, numbers that match their data), graphic (outlined wordmark with the ember O, favicon on its own field, icons on a 16 grid), search (title, canonical, one JSON-LD graph, social card, PNG icons), motion (two-transform curve wipe, contour rise, cart digit roll, tokens only), conversion (price and primary in the first phone screen, term line, proof with a denominator, checkout with Pay naming the amount), UX (three-question order slip, quick add asks the grind, cart drawer with undo, phone menu), frontend (cascade layers, `light-dark()` tokens, skip link, self-hosted preloaded fonts).
- **Tally dashboard** (`dashboard.src.html`): design-director, then design-playbook-dashboard. Combined page merged wave by wave (layout, copy, graphic, conversion, motion, UX), then the frontend fixes ported by hand (head script for saved density, content-area container queries in rem, dark shadows transparent, hover guards, tooltip moved with `translate` in a frame callback, redraw on `ResizeObserver`).
- **Fonts**: Newsreader 400 roman and italic (opsz kept), Inter 400 to 700 (opsz kept) and Geist Mono, downloaded from the Google Fonts CSS2 API and subset to `fonts/` (`fonts/build-fonts.sh`, OFL texts beside them). 127 KB for all four files.
- **Photos**: `photos.py` writes WebP q80 and JPEG q82 derivatives into `kb/assets/photos/` (552 KB of WebP across 13 sizes) with `srcset` and `sizes`, art directed per width.

## Round 3 pushes beyond wave 2 (each is opinion unless a source is named)
1. **The bag label is printed by the page.** The hero photo's blank label is measured (x 725 to 918, y 364 to 618 of the master) and every crop records where it lands in percent, so the page prints the live lot (mark, "Ethiopia Guji", the batch's roast curve, "0412") onto it with `mix-blend-mode: multiply`. The lot on the bag always matches the lot on sale. The first label drawn carried 9 to 12 unit type and failed the type-scale floor at 390 (5.2px); the label was redrawn so its smallest print is 24 units, 12.7px on the 768 crop. The green beans stay in every crop.
2. **Art-directed crops**: a 4:5 portrait of the bag for desktop and phones, the full 3:2 room for 640 to 1023px, where the photo spans the column. The roaster drop is 2:1 wide on desktop and a 4:3 crop on the falling beans for phones. The cupping photo is cropped above the table edge (the cup numbers start at y 680, the table labels at y 740; the crop ends at 676), and the out-of-focus roaster badge behind her is softened with a feathered mask so no letterform reads.
3. **Middle sections rebuilt.** The 1440 hero now lets the lots index peek above the fold (`#shop` at 871px, playbook done item 4; measured with `kb/tests/design-layout/measure-layout.mjs`). The promises section was a photo beside a long text column that left about 400px of empty column; it is now the photo and the statement on the 6 + 6 lines, with the three promises as one ruled row across the full measure beneath them.
4. **Dashboard KPI tiles choose the chart** (after Stripe's dashboard metric tiles, `kb/teardowns/stripe-dashboard.md`). The whole tile is the target (a `dt` button with a stretched `::after`, `aria-pressed`). The chosen tile carries the series color as a 2px top rule. The chart redraws with no transition (design-motion 04: frequent actions do not animate; filmed by `motion-audit`, expect none).
5. **Caveat where the number is read** (playbook rule 7). On conversion and revenue the open week's point is drawn hollow with a dotted last segment, and the legend gains "This week, partial since 2:05 pm". A first version put the note inside the plot; the lint's overlay check failed it at 1.09:1 over the grid lines, so it moved to the legend.

## Bugs found and fixed during the gates
- **The roast curve never drew for most visitors.** `document.querySelector('.curve')` matched the new label's polyline before the figure, so the reveal observer watched the label and the figure kept its pre-reveal transform: with motion allowed, the curve stayed wiped out. Screenshots could not show it, because `render.mjs` renders with reduced motion. `motion-audit` caught it ("expected motion, found none"). Fixed by renaming the label class and selecting `figure.curve`. Lesson for design-motion and the director: film every reveal; a reduced-motion screenshot proves nothing about the default path.
- `.dist .bar` collided with the header's `.bar` (flex, 64px tall): the review bars rendered as 48px pills. Renamed `.track`.
- The 1024 grid rules for the subscription band were reset by later `grid-area` shorthands, which collapsed the band into single columns at 1440 (6 characters per line in the review). Fixed by scoping the areas to under 1024.
- "Pause updates" rendered as "Pauseupdates": a flex button drops the leading space of its second span. Fixed with a no-break space.
- Two wave 2 numbers were wrong on the dashboard: the churn sparkline's week before ended at 2.66%, not the 2.5% that the tile's "+0.4 pts vs last week" needs, and the revenue line implied $169.9k against the tile's +8.1% (which needs $170.4k). Both lines now match their tiles, and the churn label reads "up from 2.6%" to match its first point. The claims inventory has no way to see this, because the data sits inside a `points` attribute. This is the third wave in a row where false numbers passed every tool, which supports the FOUNDATIONS item 16 rule that each claim is ticked by hand.
- Dates and ranges that broke across lines at 390 ("Tue, Oct / 27", "1,100 to / 2,100") now carry no-break spaces, in the HTML and in every string the script writes.
- The hard-coded icons left on the dashboard were redrawn on the set's grid: a 12-grid check and warning, a progress ring, and the error mark. One was white on red; it is now solid with the mark knocked out.

## Gates
| Gate | Coffee | Dashboard |
|---|---|---|
| `tools/lint.mjs` (v0.4) page | PASS, 0 fail, 10 warn | PASS, 0 fail, 34 warn |
| every `?state=` URL | 12 of 12 PASS | 14 of 14 PASS (10 states, compact, palette, sheet, metric=conv) |
| state sheet | PASS, 3 warn | PASS |
| `claims_inventory.mjs --year 2026` | exit 0, every line ticked (below) | exit 0, every line ticked |
| `search-check.mjs` | PASS public, 0 warn (`--base https://emberandoak.example/ --assets site`) | PASS private, 0 warn |
| `conversion-audit.mjs` | no fails (page, quick, cart, checkout) | no fails (page, limit) |
| `icon_audit.mjs` | PASS | PASS |
| `motion-audit.mjs` (`scenarios.mjs`, 9 scenarios) | 6 of 6 pass | 3 of 3 pass |
| renders | 390, 768, 1024, 1440, light and dark; 12 states at 390 and 1440 | same; 14 states |

Lint runs: `node kb/tests/round3/lint-all.mjs` (JSON beside each page). Renders: `node kb/tests/round3/render-all.mjs` with the repo served on `127.0.0.1:8765`, so lazy images load (`render.mjs` scrolls only remote URLs) and the `crossorigin` font preloads behave as they would on the origin. Over `file://`, Chromium blocks the preload by CORS and falls back to the `@font-face` fetch.

The warnings, all read:
- **Coffee**: 3 touch targets under 44px at 390 (stretched card links whose real hit area is the whole row); 4 fluid display sizes (allowed by `clamp()`).
- **Coffee, sticky focus**: one sticky-focus warning on the skip link. The link is fixed at z 30 above the z 10 header, and `paintsOver` still reports it (likely a lint false positive).
- **Coffee, font fallback**: when the web fonts fail, the layout moves 25px at 390 and 38px at 1440. The sandbox has no Arial, so Liberation stands in and three lines rewrap. This is open.
- **Dashboard**: 34 targets under 44px at 390, all 24 to 40px controls in a desktop-first tool. Every target is at least 24px (WCAG 2.5.8). Phone-sized rows remain a gap.

Claims ticked against their sources:
- **Coffee**:
  - Reviews: 1,040 + 160 + 44 + 22 + 18 = 1,284, mean 4.70.
  - Ledger: $4.10 / $1.80 = 2.28, shown as 2.3x; the rules are drawn at 0.439 and 0.639.
  - Roast log: turning point 1:30 at 92 °C, yellowing 5:30 at 159.7 °C, first crack 8:40 at 195.8 °C, out at 10:10 at 206.7 °C.
  - Altitudes: one contour per 150 m, so 14, 12 and 11 levels.
  - Prices: $21, $19 and $18, less $3 on subscription. Shipping is $6, free over $40.
  - Cart: $18 + $21 = $39.00, shipping free with the subscription.
  - Dates: Oct 12 is a Monday, Oct 13 and 27 and Nov 10 are Tuesdays, Oct 15 and 22 are Thursdays.
- **Dashboard**:
  - WAU: 44,600 to 48,210 is +8.1%, and it is the eighth rise in a row. Platforms: 31,040 + 9,870 + 7,300 = 48,210.
  - Usage: 0.3M a day x 12 days = 3.6M, on pace for 9.3M in 31 days.
  - Conversion: 3.2% to 3.8% is +0.6 pts. Revenue: $170.4k to $184.2k is +8.1%. Churn: 2.5% to 2.9% is +0.4 pts.

## Exemplar comparison (self-review, not a clean-context critic)
No subagent tool was available in this session, so this is a **self-review by the builder**, and its ratings should be discounted for that reason. Two rounds were run (the measure, grid, bar and curve fixes above came out of round 1). Closest exemplar shots: `kb/exemplars/shots/stripe-home-1440-light.jpg`, `linear-home`, `ramp-home`, `apple-macbook-air-*`, `stripe-docs-dashboard-*`; measured values from `kb/teardowns/linear-app.md`, `stripe-dashboard.md`, `vercel-dashboard.md`.

**Coffee, rated clearly below Apple MacBook Air on photography and close to Stripe, Linear and Ramp on type, hierarchy and rhythm** (opinion):
- Close:
  - One primary per screen with the price beside it (390: CTA bottom at 562px; 1440: lots peek at 871px).
  - A type system with real optical sizes and tabular figures.
  - Ruled, data-carrying middle sections (lots index, ledger, curve) that a generic store does not have.
  - Light and dark both designed. The roastery is a dark room in either scheme.
- Below:
  - The photos are AI stand-ins lit by one soft window. Apple's hero is a product photographed for the page, at a scale and finish these frames do not reach.
  - The printed label is flat on a curved pouch. It reads at a glance but not at a zoom: there is no displacement or shading.
  - The cupping crop is 824px wide, which is soft at 2x on a 552px column.
  - The hero is a conventional 6 + 6 split. Stripe and Apple each have one signature visual move above the fold; ours is the live label, which is subtle.

**Dashboard, rated close to the Stripe and Vercel dashboards on density, hierarchy and chrome restraint, and below the Linear app on craft** (opinion):
- Close: the caveats sit on the affected tiles and the chart, the alerts are rows, the 2:1 explainer panel sits beside the chart, upgrade is never the header primary, and the tiles choosing the chart is a Stripe-grade move.
- Below:
  - Linear's 13px UI type and 32px rows are denser than our 14px default.
  - The phone table becomes a list but its targets stay at 24 to 40px.
  - The chart has no keyboard path to its points; the tooltip is pointer only, and the data is in the `desc` and the table.

## Blind pairs (round 3 against round 2, `kb/tests/combined/`)
Images are in `/mnt/project-files/design-kb/round3/blind/`:
- `pair-1-A.png` and `pair-1-B.png`: coffee, 1440, light.
- `pair-2-A.png` and `pair-2-B.png`: dashboard, 1440, light.
- `pair-3-A.png` and `pair-3-B.png`: coffee, 390, dark, full page.

The order was drawn with an OS random source and redrawn until the three pairs did not share one letter pattern. An image diff confirmed that every A differs from its B. The key is held outside the repo for Davon. Caveat: the round 2 coffee page has no photographs, so pair 1 and pair 3 are not truly blind to anyone who knows that.

## Still below the bar
1. **Photography** (above): real photos of the real bag and room, shot to the brief in `kb/tests/design-art-direction/photo-request.md`, are the single largest gap. The label print should be replaced by a printed label in the shot.
2. **Font fallback shift** at 390 and 1440 (25 and 38px) with Liberation as the stand-in. The metric overrides were measured for Times and Arial, so a fallback measured for Liberation is needed to know whether real devices shift.
3. **Dashboard phone targets** under 44px. The chart has no keyboard access to points.
4. **No clean-context critic.** The ratings above are the builder's own.

## Suggestions for shared files (not edited here; another worker owns them)
- **design-motion and director**: film every reveal with `motion-audit` before judging. `render.mjs` uses reduced motion, so a reveal that never fires looks perfect in every screenshot (the curve bug above).
- **tools/lint.mjs**: the `targets` check measures the element, not a stretched `::after` hit area. Tile and card patterns need a 24px floor on the inner control or a skip.
- **tools/render.mjs**: lazy images below about 2,500px never load for `file://` targets, because the scroll pass runs only for remote URLs. Run the scroll pass for local files too, or document serving over HTTP.
- **design-copy claims_inventory**: it cannot see numbers in chart `points`. Have it list sparkline end values beside the tile deltas, so a reviewer ticks them together.
- **design-frontend**: a flex or inline-flex button drops a leading space in a child span ("Pauseupdates"). Add this to the polish checklist.
