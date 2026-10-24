# Build notes: Ferry run review (benchmark round 1, Brief 2)

Pages:
- `run-review.html` (states by URL: default, `?state=empty`, `?state=error`, `?state=loading`; `?filter=attention`, `?open=approve` also work)
- `run-review-states.html` (state sheet: every control in every state, every panel state)
- Sources: `src/` (`data.mjs` sample run, `build.mjs` arithmetic and assembly, `page.mjs` markup and script, `states.mjs`, `app.css`, `icons.mjs`, `motion-scenarios.mjs`). Rebuild from the repo root: `node kb/tests/benchmark/round1/app/src/build.mjs`.
- Screens: `shots/` (40 full pages: 5 pages x 390, 768, 1024, 1440 x light, dark; plus `?open=approve` viewport shots and `shots/motion/` strips). Reports: `reports/`.

Gate not claimed: this is a self-review by the builder, not a critic pass.

## Read log (in order)

1. `CLAUDE.md`
2. `skills/design-director/SKILL.md`
3. `kb/FOUNDATIONS.md`
4. `kb/tests/benchmark/briefs.md` (Brief 2)
5. `skills/design-foundations/SKILL.md`, `references/fundamentals-checklist.md`, `references/tokens.md`, `references/accessibility.md`
6. `skills/design-playbook-dashboard/SKILL.md`, `references/signature-moves.md`
7. `skills/design-ux/references/01-fundamentals.md`, `02-navigation-ia.md`, `03-forms.md`, `04-states-feedback.md`
8. `skills/design-product-ui/SKILL.md`, `references/01-tables.md`, `05-states-bulk.md`, `06-dashboards.md`, `04-shells-density.md`, `02-find-and-command.md`
9. `skills/design-layout/references/05-page-composition-and-density.md`, `01-grids-and-structure.md`, `04-responsive-and-adaptive.md`, `06-pacing-signature-and-phone-editing.md`
10. `skills/design-typography/references/04-hierarchy-ui-editorial.md`, `05-typographic-detail.md`, `06-type-without-web-fonts.md`
11. `skills/design-color/references/ui-tokens-themes.md`
12. `skills/design-art-direction/references/04-visuals-without-image-hosts.md`
13. `skills/design-graphic/references/02-icon-systems.md`
14. `skills/design-copy/references/02-ux-microcopy.md`, `06-copy-in-context.md`
15. `skills/design-motion/references/04-micro-interactions.md`, `07-motion-on-real-pages.md`
16. `skills/design-search/references/07-page-build.md`
17. `skills/design-frontend/SKILL.md`, `references/07-measured-build-quality.md`
18. `skills/design-polish/SKILL.md`, `references/06-polish-checklist.md`
19. `kb/teardowns/INDEX.md`, `linear-app.md`, `stripe-dashboard.md`, `vercel-dashboard.md`
20. `kb/exemplars/shots/`: linear-home, linear-changelog, stripe-docs-dashboard, vercel-docs-dashboard (1440 and 390, light)

## Fonts and delivery

- Inter variable (opsz axis kept, weights 400 to 600), from npm `@fontsource-variable/inter` 5.3.0 (SIL OFL 1.1, license in `src/fonts/OFL-Inter.txt`), subset to Latin plus the symbols the page uses with `skills/design-typography/assets/font_kit.py`: 41.7 KB woff2, inlined as base64 so the file is self-contained. `font-display: swap`.
- Metric fallback `Inter Fallback` on local Arial or Liberation Sans (size-adjust 107.59%, ascent 90.04%, descent 22.42%), per design-typography 06.
- Wordmark set as outlined SVG paths (`skills/design-graphic/assets/wordmark.py`), mark and favicon drawn on a 24 grid; favicon ships as SVG plus a 64px PNG (FOUNDATIONS: Google Search excludes SVG favicons).
- Page weight 174 KB uncompressed, one request.

## Tool results (final round)

Lint (`tools/lint.mjs`, 40 checks, light and dark, 390 to 1440):

| Page | Fail | Warn | Warnings |
|---|---|---|---|
| default | 0 | 43 | targets 39, axe needs-review 2, icon-stroke 1, fallback 1 |
| `?state=empty` | 0 | 4 | targets 1, axe 2, icon-stroke 1 |
| `?state=error` | 0 | 43 | targets 39, axe 2, icon-stroke 1 |
| `?state=loading` | 0 | 4 | targets 1, axe 2, icon-stroke 1 |
| state sheet | 0 | 22 | targets 17, axe 2, icon-stroke 2, fallback 1 |

Warning decisions:
- targets (touch under 44 at 390): breadcrumb link and the 38 person-name links in the collapsed people list. Each is at least 24px tall (the WCAG 2.2 floor, FOUNDATIONS line 98) and the rows are 56px apart, so no two targets crowd. Kept; making every name a 44px block would double the list height (opinion). The segmented filter was raised to 44 this round.
- axe aria-valid-attr-value on `#menu-open`: `aria-controls="drawer"` points at a closed `<dialog>`. The value is valid; axe cannot verify a hidden target. Kept because nav-parity needs it (see skill problems).
- icon-stroke on `.logo-mark`: the logo, exempt from icon rules (FOUNDATIONS line 106). Kept.
- fallback: layout moves 22px at 1440 if the web font fails (the BRL alert gains a line). Metric overrides are in place; accepted.

Other tools:
- Claims inventory (`--year 2026 --render`, all 4 states): 0 mechanical flags. Every date checked against the 2026 calendar (Mon Oct 19, Tue Oct 27, Wed Oct 28, Fri Oct 30).
- Search check `--expect private`: PASS, 0 fail, 0 warn (noindex, nofollow; no JSON-LD).
- Icon audit: 21 distinct icons, one stroke (1.5 on 16, 1.25 on 12), solid status glyphs; volume and pad flags on small glyphs (check, chevron) are the drawing, kept.
- Motion audit (`src/motion-scenarios.mjs`): PASS. Approve dialog from a pointer: opacity and scale 200ms `--ease-enter`; reduce row is opacity only. From the keyboard: 0 animations. Confirm from the keyboard: 0. Drawer: 100ms.
- Polish audit: run review PASS, 0 fail, 2 warn (badge dot nested radius, logo stroke); state sheet PASS, 0 fail.
- Measure and score (`kb/teardowns/measure.mjs`, `kb/tests/benchmark/score.py app`): spacing on 4px grid 99.8 to 100%, type steps and weights in range. Its contrast gate reads FAIL (100% under 4.5:1, lowest pair 1.0) because the tool cannot parse `oklch()` colors; axe passes every pair in both schemes. Out of range by design: fewer spacing values, radii, shadows, durations and easings than the exemplars (token discipline), one family.

## Arithmetic check

Computed in `src/build.mjs` from `src/data.mjs`; the build exits on any mismatch. Written to `src/arithmetic.json`.

- 38 people: USD 14, CAD 5, GBP 5, EUR 6, MXN 4, BRL 1, INR 3. 7 currencies.
- USD per currency = local / rate (local per USD, 4 decimals), rounded to cents: USD 131,041.67; CAD 42,150.00 / 1.3990 = 30,128.66; GBP 26,050.00 / 0.7510 = 34,687.08; EUR 35,950.00 / 0.8605 = 41,778.04; MXN 251,500.00 / 18.4520 = 13,629.96; BRL 26,400.00 / 5.4760 = 4,821.04; INR 803,000.00 / 88.1500 = 9,109.47.
- Total to fund $265,195.92 = sum of the seven. Table footer and KPI carry `data-sum-of`; lint truth check passes in all states.
- September $262,162.43 (37 people at September rates). Delta $3,033.49 = new hire $3,328.89 (GBP 2,500.00 / 0.7510; 5,500 x 10 / 22 working days) plus rates −$295.40.
- Shares to 1 decimal by largest remainder: 49.4 + 11.4 + 13.1 + 15.8 + 5.1 + 1.8 + 3.4 = 100.0.
- BRL alert: 5.4760 vs 30-day average 5.6200 is 2.6% stronger, over the 2.0% threshold; at the average the BRL cost would be $4,697.51.

## Top 3 gaps vs the exemplars (opinion)

1. No keyboard layer. Linear ships a command menu, shortcuts on every action and `j/k` row movement (`kb/teardowns/linear-app.md`); this page has none beyond Tab order and the dialog.
2. No history. Stripe puts every money number next to its trend; here the only comparison is one line vs September. A small run-over-run strip (last 6 runs) would earn the "up $3,033.49" claim visually.
3. Row detail. Person names link to anchors only; Stripe and Vercel open a side panel with the record and its audit trail. On phone the approve confirm is a centered dialog, where a bottom sheet would sit nearer the thumb.

## Skill problems (most important section)

1. `kb/FOUNDATIONS.md:24` (and `skills/design-color/references/ui-tokens-themes.md`): the `text-muted-on-tint` rule lists tints and sunken surfaces but not state layers. `text-muted` on the 8% hover layer over `bg` measured 4.23:1, on pressed 4.07:1 (axe, state sheet). Nothing in foundations or the dashboard playbook says hovered or pressed rows, nav items and switchers need the on-tint ink; only a forced-state sheet catches it. Add "hover, pressed and selected layers" to the rule.
2. `kb/teardowns/measure.mjs:31`: `parse()` only reads `rgb()`/`rgba()`. FOUNDATIONS tokens are `oklch()`, so every color falls back to white and `score.py` reports the contrast gate as FAIL (lowest pair 1.0) on any page built to the contract. The benchmark scorer fails a gate the page passes.
3. `kb/tests/benchmark/score.py:21`: the "app" job is scored against `stripe-docs-dashboard`, `vercel-docs-dashboard` and `linear-home`, which are docs and marketing pages, not the dashboards. Body px (15 to 16) and page height ranges do not describe a dense product screen; a 12px secondary line in a phone table reads as "out".
4. `skills/design-graphic/assets/wordmark.py:26-27` clips descenders "by design" with only a note in the docstring. "Ferry" has a y; the default output cut it off. Default to the descender line, or fail when a glyph crosses the box.
5. `skills/design-graphic/assets/tab_contrast.py:36` exits FAIL on any mark under 3:1 against tab strips even when the mark sits on its own field, which `kb/FOUNDATIONS.md:106` explicitly allows. The tool should measure the field edge, or accept a `--field` flag.
6. `tools/lint.mjs:553` vs axe: nav-parity accepts a hidden nav only through a visible `aria-controls` button, and axe then reports that same attribute as needs-review because the target is closed. The two checks push in opposite directions; nav-parity could also accept `aria-haspopup="dialog"` plus a labelled dialog.
7. `tools/lint.mjs:822` and `skills/design-polish/assets/polish-audit.mjs:178`: icon-stroke has no logo exemption, while the icons check in the same file (`tools/lint.mjs:581`) skips `[class*=logo]`. Every page with a mark gets a permanent warning.
8. `tools/lint.mjs` overlay check: when the page overflows horizontally, it reports "text over art" fails on unrelated text (1.98:1 worst pixel on plain paragraphs in dark). Twenty false fails vanished once overflow was fixed. Suppress overlay findings, or say "fix overflow first", when overflow fails.
9. State sheet guidance (design-director section 4, design-polish 06) says what to show but gives no layout recipe; an auto-fill grid of 10rem cells overflowed and caused 49 fails on the first lint. A one-paragraph recipe (wide cells for composite controls, `minmax(0, 1fr)` page column, wrap table cells) would save a round.
