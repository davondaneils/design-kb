# Build notes: Ferry October 2026 run review (Brief 2, round 2)

Builder: designer-builder subagent, clean context (nothing under `kb/tests/benchmark/round1/` or `kb/reviews/benchmark-round1-*` opened; citations to them in skills were not followed).

Files:
- `run-review.html`: the screen, self-contained (197 KB), light and dark.
  - States: default, `?state=confirm` (dialog open), `?state=approved` (after the commit), `?state=error` (funding rejected after approval), `?state=empty`, `?state=loading`.
  - Extras: `?filter=review` keeps the filter in the URL; `?open=menu` opens the phone and tablet drawer.
- `run-review-states.html`: the state sheet (87 KB).
- `src/`: `data.mjs` (sample data and arithmetic), `build.mjs` (writes both pages), `styles.css`, `app.js`, `icons.mjs`, `latin.css`, `rupee.b64`, `wm.svg`, `favicon.svg`, `favicon-64.png`, `inter-OFL.txt`. Rebuild with `node src/build.mjs` from `src/`.
- `shots/`: `r2-*` are the final renders, `r1-*` are loop round 1 (kept for the diff by eye).

## 1. Read log, in order

1. `CLAUDE.md` (system context)
2. `skills/design-director/SKILL.md`
3. `kb/tests/benchmark/briefs.md` (Brief 2)
4. `kb/FOUNDATIONS.md`
5. `skills/design-foundations/SKILL.md`, then `references/tokens.md`, `references/fundamentals-checklist.md`, `references/accessibility.md`
6. `skills/design-playbook-dashboard/SKILL.md`, then `references/signature-moves.md`
7. `skills/design-ux/SKILL.md`, then references 01, 02, 03, 04
8. `skills/design-product-ui/SKILL.md`, then references 01 (tables), 05 (states, bulk), 06 (dashboards), 04 (shells, density), 02
9. `skills/design-layout/SKILL.md`, then references 05, 01, 04, 06
10. `skills/design-typography/SKILL.md` (head), then references 04, 05, 06 (type without web fonts)
11. `skills/design-color/SKILL.md`, then `references/ui-tokens-themes`
12. dataviz skill (bundled)
13. `skills/design-art-direction/references/04-visuals-without-image-hosts.md` (recipe 3 section)
14. `skills/design-graphic/references/02` (build section), SKILL fundamentals, `assets/tab_contrast.py` and `assets/wordmark.py` headers
15. `skills/design-copy/references/02-ux-microcopy.md`, `references/06`
16. `skills/design-motion/references/07`, `references/04`
17. `skills/design-conversion/references/04` ("summary never leaves" section)
18. `skills/design-search/references/07` (private grep)
19. `skills/design-frontend/SKILL.md`, `references/07-measured-build-quality.md`
20. `skills/design-polish/SKILL.md`, `references/06-polish-checklist.md`
21. Teardowns:
    - `kb/teardowns/INDEX.md`, `linear-app.md`, `stripe-dashboard.md`, `vercel-dashboard.md`
    - Shots: linear-home 1440 and 390, stripe-docs-dashboard 1440 and 390, vercel-docs-dashboard 1440 and 390, linear-changelog 1440
22. Tool headers:
    - `tools/lint-truth.mjs`, `tools/lint.mjs`, `tools/render.mjs`, `skills/design-typography/assets/font_kit.py`
    - Later, for the loop: `design-motion/assets/motion-audit.mjs`, `design-polish/assets/polish-audit.mjs`, `kb/teardowns/measure.mjs`
    - `tools/lint.mjs` lines 351 to 395 and 1199 to 1275, read to diagnose the overlay finding
    - `design-director` SKILL section 5 re-read for the hand-over list

## 2. Fonts

The route is self-hosted (design-typography 06), with a metric fallback.

- **Inter**:
  - Source: `npm pack @fontsource-variable/inter@5.3.0`. OFL licence copied to `src/inter-OFL.txt`.
  - Latin subset, wght axis 400 to 600: 27.4 KB woff2, inlined as a data URI.
- **Rupee**: U+20B9 is in a separate 992-byte latin-ext @font-face, because the latin file does not contain it.
- **Narrow no-break space**: U+202F is missing from both files, so the page uses U+00A0 (`nb()` in build.mjs).
- **Fallback**: "Inter fallback" is Arial or Liberation Sans with size-adjust 107.59%, ascent 90.04% and descent 22.42% (lint `fallback` passes).
- **Faux bold**: the file stops at 600, so `b, strong, th` are set to 600 explicitly. The measure run caught 547 characters asking for 700 before this fix, and `font-synthesis: none` is on.
- **Production**: use the external hashed WOFF2 with `preload`. Inlining is for the self-contained test file only.
- **Wordmark**: "ferry" outlined from Inter at wght 640 (`src/wm.svg`).
- **Favicon**: the mark on its own field, two-tone by scheme, plus a 64px PNG. tab_contrast minimum is 4.03 on the light strips and 6.73 on the dark strips (PASS).

## 3. Final tool results per state

| Check | default | confirm | approved | error | empty | loading | state sheet |
|---|---|---|---|---|---|---|---|
| `tools/lint.mjs` | PASS 0 fail, 38 warn | PASS 0, 0 | PASS 0, 38 | PASS 0, 38 | PASS 0, 0 | PASS 0, 0 | PASS 0, 0 |
| claims_inventory `--year 2026 --render` | 0 flags, 76 strings | 0, 81 | 0, 70 | 0, 73 | 0, 2 | 0, 1 | n/a |
| search-check `--expect private` | PASS 0 fail 0 warn | | | | | | |
| icon_audit | PASS, 14 distinct icons (volume prompts on 3, looked at) | | | | | | |
| motion-audit (5 scenarios) | PASS: dialog from pointer 200ms enter; dialog from keyboard 0 animations (expect none); drawer 100ms; filter 100ms; press 100ms; reduce rows checked | | | | | | |
| polish-audit | PASS 0 fail, 1 warn | | | | | | PASS 0 fail, 1 warn |

Notes on the warnings:
- **The 38 lint warnings in each state** are the same: person-name links at 390 are 24px tall, under the 44px touch size.
  - Each one carries a stretched `::after` that covers the whole row (two lines, 56px or more), so the touch target is the row.
  - The lint measures the anchor box, not the pseudo-element.
  - Every other phone control was raised to `--size-control-lg` (48px) in this loop.
- **The polish-audit warning** is "1 numeric cell without tabular figures". It points at the BRL row header, whose only digits are in "Above 30-day average". It is a word, not a figure column, so it was left as is.

Measured contrast (`kb/teardowns/measure.mjs`, 1440):

| Scheme | Pair | Ratio |
|---|---|---|
| Light | text #303338 on #fff | 12.68:1 |
| Light | muted #676c75 on #fff | 5.28:1 |
| Light | muted-on-tint on the amber, red and blue tints | 6.62 to 6.67:1 |
| Dark | text on raised | 14.87:1 |
| Dark | muted on raised | 8.83:1 |
| Dark | muted-on-tint on the tints | 11.78 to 11.89:1 |

Border contrast:

| Border | Surface | Ratio |
|---|---|---|
| border-strong | white | 3.43:1 |
| border-strong | dark raised | 4.65:1 |
| border-on-tint | light tints | 4.90:1 |
| border-on-tint | dark tints | 6.64 to 6.87:1 |

All of these are at or above the 3.3:1 margin.

## 4. Arithmetic check

Rates are units per 1 USD, quoted at 10:48 am ET (sample). Each payment converts as USD = round(local / rate, cents). Subtotals and the total are sums of the rounded cents, so everything adds up with no rounding drift.

| Ccy | People | Local total | Rate | USD | Share |
|---|---|---|---|---|---|
| USD | 12 | $130,650.00 | 1.0000 | $130,650.00 | 41.7% |
| CAD | 5 | CA$57,200.00 | 1.3712 | $41,715.28 | 13.3% |
| GBP | 6 | £42,350.00 | 0.7486 | $56,572.28 | 18.1% |
| EUR | 7 | €44,700.00 | 0.8594 | $52,013.02 | 16.6% |
| MXN | 3 | MX$202,300.00 | 18.4120 | $10,987.40 | 3.5% |
| BRL | 1 | R$38,500.00 | 5.3480 | $7,198.95 | 2.3% |
| INR | 4 | ₹1,253,967.74 | 88.6450 | $14,145.95 | 4.5% |
| **Total** | **38** | | | **$313,282.88** | **100.0%** |

How the figures were checked:
- **Rendered DOM** (`arith.mjs` in the scratchpad), for default, confirm, approved and error:
  - 38 rows and 7 currencies.
  - Each currency USD cell equals the sum of its people's USD cells.
  - The currency sum equals `#total`, which equals the commit button amount: $313,282.88.
  - The shares sum to 100.0. They are rounded by largest remainder, and the bars run 0 to 100 of the track.
- **Lint `truth`**: passes on `data-sum-of`, `data-derived-from`, `data-bar`, `data-explained-by` and `data-data="none"` (empty state) across 3 ticks.
- **Flags**:
  - **BRL rate alert**: 5.4600 / 5.3480 = 1.0209, so BRL costs 2.1% more than its 30-day average, above the 2% alert. The extra is $7,198.95 minus $7,051.28 (at the average) = $147.67.
  - **Held pay**: Tomás Herrera, MX$64,500.00 / 18.4120 = $3,503.15. The money is part of the locked total and stays in the Ferry balance.
  - **New hire**: Aditi Rao, ₹360,000.00 × 13/31 = ₹150,967.74, which is $1,703.06. She starts Mon, Oct 19 and is paid for Oct 19 to 31, 13 of 31 days.
- **Dates and times**:
  - Fri, Oct 30, 2026 is a Friday and Mon, Oct 19, 2026 is a Monday (the claims inventory weekday check passes).
  - The times are quote 10:48, approve 10:52, lock until 11:22 (30 min) and failure 10:58, so the error state shows 24 min left. All are in ET, and every time carries its zone.

## 5. Hand-over list (design-director section 5, step 13), item by item

**Click every primary action and render the result.**
- Done. Approve opens the dialog (`?state=confirm`), and confirming goes to `?state=approved`. Retry goes to approved, and Draft goes to default.
- Approved copy has no "estimate" or "until you approve": the badge reads "Locked", the steps read "Approved at 10:52 am ET" and "Funding in progress", and the status reads "Pays Fri, Oct 30". It was "Paid Fri, Oct 30" in loop round 1, a past tense for a future event, and was fixed in this loop.
- Evidence: `shots/r2-approved-*`, plus lint and claims PASS.

**KPI labels true in every state.**
- Labels: "People in this run", "Currencies", "Pay date", and "Need a look" before approval, which becomes "Held" after it. "Total to fund, USD" carries an "Estimate" badge before the lock and "Locked" after.
- Evidence: `r2-default-1440-*`, `r2-approved-1024-dark`.

**Selected controls.**
- Lint `selected-state` passes in all states.
- Nav: the selected item goes from weight 400 to 600, with a fill and a 2px inset bar.
- Segment: the selected button is a filled `--color-selected` against a transparent neighbor.
- Evidence: state sheet.

**Rest, pressed and disabled side by side.**
- The state sheet has rest, hover, pressed, focus, disabled and busy for primary, secondary and ghost, plus filter, nav, an invalid field and panels.
- Pressed is one ramp step past hover. Disabled is a neutral fill, never an opacity on the brand fill.
- Evidence: `r2-sheet-1440-light`, `r2-sheet-390-dark`.

**Most common text size.**
- 14/20 running text in the app, measured as the top size at both widths. On phones, line 2 of a row is 14px, and 12px is used only for table headers and badges.
- Lint `reading-size` passes.

**Time zones.**
- Every time carries "ET" at every width, and the collapsed phone rows keep country, local amount, USD and status.
- Evidence: `r2-default-390-*`.

**Long table.**
- The thead is sticky below the 64px sticky page head, and `scroll-padding-top` covers both (lint `sticky-header` passes).
- On touch the row link stretches over the row.

**Commit screen.**
- The total is the largest figure (39px), and the amount is on the button ("Approve $313,282.88").
- The commit stays reachable: in the sticky page head at 40rem and up, and in a fixed bottom bar under 40rem.
- The dialog restates all 3 open warnings, each with its effect.
- The lock shows its absolute end time (11:22 am ET), a minutes countdown that announces every 5 minutes, and a Hide countdown control (WCAG 2.2.2).
- Evidence: `r2-confirm-390-light`, `r2-confirm-1440-dark`.

**Phone menu.** Partial.
- The drawer shows all 7 links, and the trigger reads Close, sitting above the scrim. This was fixed in this loop: it had been dimmed under the scrim.
- The primary action is not inside the drawer. It stays in the commit bar under the scrim.
- Evidence: `r2-menu-390-*`.

**KPIs at 768.**
- Four across at 768 in one row (not four stacked rows), and 2x2 at 390.
- Evidence: `r2-default-768-light`.

**Menu text on the logo's edge, and control borders.**
- Fixed in this loop: the nav icons, labels and workspace name now sit on the logo's left edge (x 12), and the pill padding hangs outside (x 4).
- Borders measured in section 3: 3.43:1 minimum, 4.65:1 on dark raised.

**Fresh-context critic (step 14).**
- **Gate not claimed: self-review only.** No second reviewer was available inside this subagent.
- Judged rows that a critic should re-walk:
  - Hierarchy at 1024 in the error state (two tinted blocks in the first screen).
  - Dark tint weight. Tints were softened in this loop to 23% L and 0.02 chroma.
  - Copy tone of the error block.
  - Drawer composition.
  - Every 768 and 1024 render.

## 6. Self-critique loop log (3 rounds)

**Round 1** (before this file's renders):
- The phone header Approve was not hidden, because of a layer-order fight. Moved the rule to utilities.
- Overflow to 985px at 768. Hid Role and the currency names under 64rem and folded Notes into the currency cell.
- The dialog was pinned top-left. My reset was `* { margin: 0 }`; design-frontend 02 line 114 already says `*:not(dialog)`, so this was my miss. Fixed with `dialog { margin: auto }`.
- Measure fails on alert details. Fixed with `--size-measure`.
- 72px padding was off the scale. Changed to 96px.
- 24px targets on the crumb and person links.
- axe flagged an `li` with `role=alert`. Changed to a `div`.
- The "sample data" wording tripped the empty cue in the truth check.
- Favicon field contrast on a dark tab.

**Round 2**:
- The sidebar rule stopped mid-page in full-page shots. A gradient, then a pseudo-element, were both reverted because they put sidebar text into axe "incomplete" (see skill problem 1). The border is back on the sticky panel; it is a full-page capture artifact only.
- Dark alert tints too heavy. Softened.
- Lone "All 38" filter after approval. Hidden outside default.
- "Paid" changed to "Pays".
- Dark skeleton invisible (neutral-950 on 950). Moved to neutral-900, and the loading blocks got a 32px gap.
- Hairline border added to the dialog for dark.
- Close button under the scrim. Lifted above it.
- Overlay false fails in dark. Color primitives now ship as sRGB hex, with the OKLCH source beside each value.

**Round 3**:
- Phone controls raised to 48px.
- "30-day" kept on one line.
- Sort icon stroke set to 2 at 12px (1.5px rendered); empty icon stroke set to 1 at 24px.
- Explicit 600 for `b`, `strong` and `th`.
- Commit bar hidden in approved; a busy commit button added in loading.
- `main` fills to the bottom on short pages.
- Dialog warning text color scoped.
- Sidebar edge alignment.

Every screenshot in `shots/r2-*` was read after the final build (full page at 4 widths × 2 schemes × 5 states, confirm viewport, menu, state sheet).

## 7. Compared with the exemplars (numbers from `kb/teardowns/data/*.json` and measure.mjs on this page)

| | This page | Linear (changelog data) | Stripe docs dashboard | Vercel docs dashboard |
|---|---|---|---|---|
| Main UI text | 14/20 w400 | 13/20.8 w510 (UI), 15/24 | 14/20 and 16/26 | 14/20 |
| Text on bg (light) | 12.68:1 | 13.64:1 (dark) | 9.96:1 | 8.45:1 |
| Radii | 4, 8, 12, full | 4.5, 5, 8, full | 4 dominant | 6 dominant |
| Hover transitions | 100ms | 100ms | 100ms | 100ms |
| Shadows, distinct | 5 | 3 | 6 | 6 |

Top 3 gaps (opinion):
1. **Density and weight craft.**
   - Linear sets UI text at 13px with a 510 weight and tight tracking, so rows read crisper and denser.
   - This page runs 14/20 at 400/500/600, with 40px rows. That is correct and readable, but it looks one notch looser and plainer.
   - The 38-row table needs about 1.5 screens at 1440 where Linear would need about 1.2.
2. **No keyboard layer.**
   - Linear and Vercel expose command menus and shortcuts (j/k rows, a shortcut to approve, `?` for help).
   - This page is fully keyboard operable but has no accelerators and no command bar.
3. **The money story is told in prose and tables, not in one picture.**
   - Stripe would show the funding timeline (pull, settle, pay out) as a live progress object with exact timestamps.
   - Here "How this run pays out" is a static three-step list.
   - The share bars are honest but small. There is no per-currency rate sparkline beside the 30-day comparison that the BRL alert talks about.

## 8. Skill and tool problems found (file and line)

1. **`tools/lint.mjs` line 1201, `overlayCheck` `toRGB`.**
   - The problem: it parses a computed color by pulling the first numbers from the string.
     - For `oklch(0.81 0.011 260)` it reads r=0.81, g=0.011, b=260.
     - Every axe "incomplete" text in dark therefore failed at 1.89 to 2.24:1 when its real ratio was 8.83:1. I sampled the lint's own screenshot: the background was #202225.
   - It hits any page whose text roles are OKLCH (design-color teaches OKLCH).
   - Workaround here: ship the primitives as hex.
   - Fix: convert the color through a 1x1 canvas, as `skills/design-copy` and my scratch script do, before computing luminance.
2. **`tools/lint-truth.mjs` line 233, `EMPTY_CUE`.**
   - The pattern includes `sample data`, so an honest "Sample workspace: sample data" label in a shell sidebar made the confirm state read as an empty state with numbers, a false truth fail.
   - Workaround: reworded to "Sample workspace: example names and pay". The cue should look inside the content region only, not the shell.
3. **`skills/design-typography/assets/font_kit.py` lines 41 to 42.**
   - The latin unicode-range lists U+202F and U+20B9, but the @fontsource latin file contains neither, so the browser falls back per glyph with no warning.
   - The kit should intersect the range with the font's cmap, or split ₹ into latin-ext.
4. **`skills/design-product-ui/references/04-shells-density.md` line 29 and `SKILL.md` line 53, versus design-ux 02.**
   - They prescribe a 56px icon rail from 768 to 1023. With a 6-column money table (person, role, country, amount, USD, status) and a 7-column currency table, the rail still leaves too little width at 768 without collapsing columns, and a rail with tooltips is weak on touch tablets.
   - I used a drawer under 64rem (opinion). The skill should say when the rail loses to the drawer: content tables wider than 720px.
5. **`kb/FOUNDATIONS.md` line 25 (3.3:1 margin) against row 3 at line 161.**
   - It is unclear whether 3.3:1 applies to `surface` as well as `surface-raised`, or to the focus ring against the page bg.
   - I measured all of them; the wording should list the surfaces.
6. **`skills/design-graphic/references/02` line 66.**
   - "On its own field" does not say that the field itself must pass 3:1 against both tab colors. My single-color field measured 2.28:1 on a dark tab.
   - The rule should point to `tab_contrast.py` and to a two-tone field per scheme.
7. **`skills/design-director/SKILL.md` step 2 and `tools/lint.mjs` `targets`.**
   - Stretched-link rows always warn at 390, 38 times here, because the check measures the anchor rather than its `::after` hit area. The noise hides real target warnings.
   - The check should measure the stretched pseudo-element when `a::after { position: absolute; inset: 0 }` is present.
