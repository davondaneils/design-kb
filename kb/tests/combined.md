# Combined test: every skill through design-director

Date: 2026-10-09. Branch: `restructure` (after merging wave/typography, wave/product-ui, wave/art-direction and wave/polish).

Two pages, built by following design-director with FOUNDATIONS v0.3 and every relevant skill loaded:

| Page | Source | Skills applied |
|---|---|---|
| Ember & Oak coffee landing page | `kb/tests/combined/coffee.src.html` | foundations, layout, color, typography (Newsreader display, self-hosted, ref 07 type-led moves), art direction (contour art from farm altitude, roast curve from the batch log), polish (tokens, state layers, tinted shadows, focus), ux (cart and newsletter states), copy, motion (curve draw-on, reduced motion respected), playbook-landing |
| Tally analytics overview | `kb/tests/combined/dashboard.src.html` | foundations, layout, color, typography (Inter self-hosted with metric fallback, 39px KPI values, muted units, mono paths), product UI (density, palette, shortcut sheet, table, states), art direction ("Only counts are pictures": tally-mark logo, KPI sparklines, empty state from chart parts), polish, playbook-dashboard |

Build: `node kb/tests/combined/build.mjs` (inlines fonts and generated art; writes both state sheets from `states.mjs`). No CDN or network request in any page. Renders: `kb/tests/combined/shots/` at 390 and 1440, light and dark, for both pages and both state sheets.

The "1. 01" list marker from the pilot (visible in `kb/tests/design-color/shots/coffee-with-1440-light.png`) is fixed: the steps list uses `list-style: none` and an italic numeral marked `aria-hidden`, so the number is drawn once and read once.

## Lint (tools/lint.mjs, upgraded on this branch)

| Target | Fails | Warnings |
|---|---|---|
| coffee.html, plus `?state=` added, subscribed, error, sending | 0 on all 5 | 21 each: 18 touch targets between 24 and 44px at 390, 3 fluid display sizes (allowed by FOUNDATIONS `--text-display`) |
| coffee-states.html | 0 | 14 touch targets under 44px at 390 |
| dashboard.html, plus `?state=` loading, empty, partial, viewer, `?density=compact`, `?open=palette`, `?open=sheet` | 0 on all 8 | 8 to 29 touch targets under 44px (dense UI uses 32 to 40px controls; all pass the 24px AA floor); with a dialog open, 1 to 5 svg-overlap warnings, which are the lint ignoring the top layer, not real overlaps; one run showed a 13 to 18px fallback shift at 390, because Liberation Sans stands in for Arial here and the metric overrides were tuned for Arial |
| dashboard-states.html | 0 | 35 touch targets under 44px |

Lint changes made while building (all committed): overlay checks clip to scroll containers and read SVG `fill`; tabular check skips mostly text cells; shadow count skips rings and insets; measure skips flex and grid containers.

## Judged (fundamentals gate first)
Opinion, from the renders, by the agent that built the pages. Not independent.

- **Gate:** passes on both pages in both themes and both widths, as far as the lint and the state sheets show. Contrast measured including text over art (worst pixel). Focus ring identical in shape on every control. Pressed differs from hover everywhere (state sheets).
- **Coffee, against apple.com product pages and family.co (from memory):** clearly better than the color pilot. The type now carries the hero (96px Newsreader with an italic turn), the bag sits on a contour map whose line count is the farm's altitude, and the roast curve is the batch's real log, not decoration. Still below the bar: the bag is drawn in CSS, not photographed, and Apple and Family win on that alone. The middle of the page (cards, steps, ledger) is competent but quieter than the hero; nothing there would make a Pentagram partner stop.
- **Tally, against linear.app and stripe.com dashboards (from memory):** close. The answer-first sentence, 39px tabular KPIs with muted units, sparklines, mono paths, dense table and the command palette are all exemplar moves. What separates it: no custom icon set (generic 1.5px strokes), no product-specific chart interaction beyond the crosshair, and Linear's surfaces carry more subtle depth and motion between states than a static render can show.
- **Exemplar access:** every exemplar host was blocked from this environment on 2026-10-09 (`kb/exemplars.md`), so both comparisons are from memory, not side by side. Treat them as opinion.

## Blind pairs
`kb/tests/combined/blind/`: three pairs against the color pilot's with-skill pages (coffee 1440 light, coffee 390 dark, dashboard 1440 light). A and B set by a seeded coin flip (seed 20261009). The key is kept outside the repo. Copies: `/mnt/project-files/design-kb/combined/blind/`.

## What still separates each page from the bar
1. Coffee: real photography of the bag, the roaster and the farm. The art direction can frame a photo; it cannot replace one.
2. Coffee: a licensed display face with its own voice. Newsreader (OFL) is good and generic; a commissioned or licensed serif would give the brand a signature.
3. Coffee: one more signature moment below the hero (for example, the ledger set as a large editorial table), so the page does not fade after the first two screens.
4. Tally: a drawn icon set at the product's stroke weight, and one interaction that shows the product's point of view (for example, clicking a sparkline to compare periods).
5. Both: side-by-side comparison with live exemplars, and a judge who did not build the pages.

## What only Davon can supply
- Real photography, per the brief in `kb/tests/design-art-direction/photo-request.md`.
- A licensed display face (or a decision to stay with Newsreader).
- Network access to the exemplar hosts, so the teardowns in `kb/teardowns/` can be measured instead of remembered.
- The blind ratings on the three pairs above.

## Davon's blind ranking, round 2 (2026-10-10)

| Pair | Davon picked | That was |
|---|---|---|
| pair-1, coffee desktop light | B | combined |
| pair-2, coffee phone dark | A | combined |
| pair-3, dashboard desktop light | A | combined |

Result: 3 of 3 for the combined pages over the color pilot pages. The four wave skills (typography, art direction, polish, product UI) are validated by Davon's eye. Next: run the remaining domains the same way.
