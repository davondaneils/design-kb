# Held-out test: two briefs the skills were never tuned on

Date: 2026-10-11. Branch `heldout/test`. Briefs: `kb/tests/heldout/briefs.md` (committed in `c6e43d9` before anything was built).

**Davon: rank the blind pairs before reading sections 4 to 6.** The pairs and the key live outside the repo (scratchpad `heldout-pairs/` and `heldout-blind-key.md`).

## 1. Briefs
1. **Freelancer budgeting app**, 390x844, light and dark: first-run (connect a bank or start manually), home (safe-to-spend this month, upcoming tax set-aside, recent income), add-transaction sheet.
2. **"Set in Stone"**, a two-day independent type and print festival in Glasgow, Sat 17 and Sun 18 April 2027: poster at 1080x1350 and A2 proportion, one-page event site at 390 and 1440.

## 2. Method, and how clean the contexts really were
- **No subagents.** This session had no Agent or Task tool, so all four builds and the critic ran in one context. The clean-context requirement was **not achieved**; this is a single-builder test with ordering controls, not a true A/B of two agents.
- **Ordering control.** The baseline (all 6 pages) was built, rendered and committed (`68900e5`) before any file in `skills/` or `kb/` was opened. Only `CLAUDE.md` (in context from session start: house rules and the quality bar, no design rules) and the `render.mjs` usage line were seen first. The baseline got one honest fix round on its own renders (overlapping list rows, a fixed tab bar breaking the full-page shot, a squeezed heading), as any careful builder would; it was never touched after the skills were read, and lint fails were recorded, not fixed.
- **Leakage the other way.** The skilled builder had seen the baseline, so independence is weak: it reused the brief facts (Sunday Oct 11, three clients, the safe-to-spend arithmetic shape) but chose its own name (Keel), currency and tax model (US quarterly estimates), venue (Trongate 103), palette, type and concept. Expect this to understate the skills' effect on content and overstate it on visual distance.
- **Skilled loading**, in the playbooks' order: design-director, design-foundations (tokens, checklist), design-playbook-mobile (platform conventions, signature moves), design-playbook-brand and design-playbook-landing (signature moves), design-ux 05 onboarding, 03 forms, 06 platforms; design-copy 02 microcopy; design-typography 02, 04, 05, 06 (decision rules), 07; design-color ui-tokens-themes plus `oklch_scale.py`; design-art-direction SKILL and 01; design-graphic 01 and 05 plus `wordmark.py`; design-polish 06; design-search 07. Not read: design-motion, design-layout, design-frontend, design-product-ui, the teardowns.
- **Critic.** Self-scored by the builder, so the judged rows below are **self-scored, unverified**, and the X/Y labels were not blind to the scorer. Gate not claimed for either version (design-director step 13).
- **Fonts.** Baseline: Inter, Fraunces (roman and italic), Inter Tight, Google Fonts latin subsets inlined. Skilled: Inter subset (43 KB) for the app, Bodoni Moda roman 700 and italic 500 pinned at opsz 48 (13 and 15 KB) plus the system sans for the festival, from `npm pack @fontsource-variable/*`, subset with `font_kit.py`. All self-hosted as base64.

## 3. Outputs
| Version | Pages | Shots |
|---|---|---|
| Baseline | `kb/tests/heldout/baseline/*.html` (sources in `baseline/src/`) | `kb/tests/heldout/shots/baseline/` |
| Skilled | `kb/tests/heldout/skilled/*.html` plus `app-states.html`, `event-states.html`, `brand.html`, `og.png`, favicons (sources in `skilled/src/`) | `kb/tests/heldout/shots/skilled/` |
Lint JSON: `kb/tests/heldout/lint/{baseline,skilled}/`. Build scripts: `kb/tests/heldout/scripts/`, `skilled/make-assets.mjs`.

## 4. Lint and tool results
`node tools/lint.mjs` at its default widths (390, 768, 1024, 1440), light and dark.

| Page | Baseline | Skilled (after 2 fix rounds) |
|---|---|---|
| app-first-run | FAIL 38: type-scale 8, spacing 24, radius 5, icons 1 | PASS, 1 warn |
| app-home | FAIL 58: type-scale 16, spacing 32, radius 7, icons 2, proportion 1 | PASS, 3 warns; `?state=empty` PASS, 4 warns |
| app-add-sheet | FAIL 54: type-scale 10, spacing 40, radius 4 | PASS, 0 warns; `?state=error` PASS, 1 warn |
| poster-social | FAIL 49: overlay 24, type-scale 9, spacing 16 | PASS, 1 warn |
| poster-a2 | FAIL 53: overlay 26, type-scale 9, spacing 18 | PASS, 1 warn |
| event | FAIL 81: axe 2 (red day labels 4.29:1), targets 4, measure 1, type-scale 12, spacing 49, primary 4, radius 4, sticky-header 4, skip-link 1 | PASS, 4 warns |
| state sheets, brand page | none built | app-states, event-states, brand: PASS |

Other checks:
| Check | Baseline | Skilled |
|---|---|---|
| `claims_inventory.mjs` | exit 0 on all pages | exit 0 except app-home: `WEEKDAY "Fri, Jan 15" is a Thu in 2026` on "Due Fri, Jan 15, 2027". Jan 15, 2027 is a Friday; the tool ignores the year written in the string (tool false positive, named here) |
| `search-check.mjs` app screens (`--expect private`) | FAIL 1 each (no noindex) | PASS |
| `search-check.mjs` event | FAIL 16, 6 warns (no canonical, no og tags, `#` links, no JSON-LD) | PASS, 3 warns (in-page nav anchors, weekday names) |
| `conversion-audit.mjs` event | 3 fails | no fails |

What the fails mean: most baseline fails are house-scale rules (spacing, type, radius steps) that a viewer cannot see. The ones a viewer or a user would feel are: red day labels at 4.29:1 (axe), nav targets 20px tall, two and then three filled buttons in one screen, a sticky header with no `scroll-padding-top`, no skip link, no `noindex` on app screens, and on the posters text under 40px on a 1080 canvas. The baseline proportion fail is a lint false positive: a stacked budget bar sits next to an unrelated "66%" on the tax meter.

Lint skips used on the skilled pages, each for a stated reason: `data-lint-skip="measure squash"` on the rotated poster sheet (the rotated box made the line counter report 9 characters per line on text that renders on one line; render checked at 1080, 1191 and 1440), `measure` on the A2 stone caption and the payments list rows (labels and rows, not paragraphs).

## 5. Critic (self-scored, unverified)
Judged rows of the 16-item checklist on the renders at 390, 768, 1024, 1440 and every state.

| Judged row | Baseline | Skilled |
|---|---|---|
| 3 non-text contrast | fail: grouped fields in the sheet have no 3:1 boundary | pass after round 2 (group border moved to `border-strong`, 3.42:1) |
| 9 focus ring 3:1 | not shown anywhere | pass on both state sheets |
| 11 color alone | pass | pass |
| 12 hierarchy, one primary per view | fail on event (three filled ticket buttons, two in the hero screen) | pass |
| 13 consistency | fail (radius family, mixed icon caps) | pass |
| 14 both themes designed | pass on the app | pass |
| 15 states | fail: no empty, error, loading or disabled states, no state sheet | pass: home empty, sheet error, two state sheets |
| 16 copy true | pass on the numbers checked; speakers shown as placeholder initials | pass; every number ticked (2,765 = 5,680 minus 1,415 minus 1,500; 71 percent = 2,780 of 3,900; $350 = 28 percent of 1,250; weekdays checked) |

Exemplar rating (opinion): **app**, both clearly below Cash App and Things 3; the skilled app is the better product (ledger that sums, honest sample data, real form, error state) but looks like a careful template, not a signature. **Poster**, skilled close to a good studio festival poster on idea (stone and its print, one quirk), clearly below on finish (Bodoni hairlines thin at feed size; the reversed S risks reading as a typo). **Event page**, skilled clearly below the landing exemplars: correct and calm, but the hero is quiet and the stone art is small; the baseline hero is louder.

Verdict: fundamentals clearly improved with the skills (baseline fails the gate on every page; the skilled set passes lint and every self-scored judged row). The brief's pass bar (rated close to the exemplar after a clean-context critic) is **not met**: no clean critic was possible, and no skilled page is rated close.

## 6. Which skills helped, and which underperformed
Helped:
- **design-foundations plus the lint**: the single biggest effect. Scales, one primary per screen, skip link, sticky offset, focus rings, 3:1 boundaries, state sheets. None of these appeared unprompted in the baseline.
- **design-art-direction 01** (concept from a true fact, reject test): produced the stone and print idea; the baseline was a nice misregistration effect with no idea behind it.
- **design-graphic 01 and `wordmark.py`**: outlined wordmark with one deliberate quirk, favicon on its own field, tiers. **05** (40px floor on a 1080 canvas, safe band): caught the baseline's 23px poster text.
- **design-ux 05 onboarding and design-copy 02**: sample data labelled "Sample" on first-run, money button with the amount ("Add $1,250 income"), error copy with the fix.
- **design-search 07**: canonical, og, JSON-LD Festival with visible-match, noindex on app screens; caught one mismatch (offer name).
- **design-color `oklch_scale.py`**: every pair measured before use.

Underperformed or failed:
- **design-foundations content mechanics** are US-only ("US 12-hour clock", "Tue, Oct 13"). A Glasgow festival needs en-GB dates ("Sat 17 April"); the skill has no rule for it, so the builder improvised. The same rule nudged the app to a US user, which changed the product (quarterly estimates instead of UK Self Assessment) for no design reason.
- **claims_inventory.mjs** flags a correct date whose year is written in the string ("Fri, Jan 15, 2027" under `--year 2026`). Any page with a deadline in the next calendar year trips it.
- **design-playbook-mobile signature moves are opinion with no measured exemplar** and gave no help on how a money home screen should look beyond "one bold action"; the skilled app home is correct but generic. There is no teardown for Cash App or Things 3.
- **design-typography 07 and 02** say "one display face, roman and italic" but give no warning about high-contrast Didone hairlines at small sizes and feed scale; Bodoni at opsz 48 thinned out on the poster.
- **design-playbook-brand** demands website-strategy and a full guidelines page before the mark; on a poster-plus-site brief that is scope the brief did not ask for (a compact brand page was built to satisfy it).
- **tools/lint.mjs** misreads rotated text (squash and measure on the tilted poster sheet), counts a clipped skip link as a filled call to action, and treats fixed-canvas posters as responsive pages at 390 to 1440 (the poster needed a zoom-to-fit script to pass `overflow`).
- **design-playbook-landing** pushed toward a calm, conventional page; nothing in it asked for a loud, type-led hero on an event page, and the skilled hero came out quieter than the baseline's.

## 7. Gaps for the domain specialists
1. design-foundations: add en-GB (and a locale switch) to content mechanics; state that the locale follows the audience, not the US default.
2. design-copy: fix `claims_inventory.mjs` to honour a year written in the date.
3. tools/lint: a `data-lint-page="poster"` mode (fixed canvas, one width, no responsive checks); handle rotated text; ignore clipped skip links in `primary`.
4. design-typography: a hairline rule for Didones and other high-contrast faces (minimum hairline in px at the viewing size; pick opsz by viewing size, not canvas size).
5. design-playbook-mobile: measured teardowns of a money app home and an add-transaction sheet.
6. design-playbook-landing: an event-page variant (dates, programme, tickets, access) with a type-led hero allowed to be loud.
7. Re-run this test with real subagents so the baseline and the critic have clean contexts.
