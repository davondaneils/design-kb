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

## Davon's blind ranking (2026-10-11)

Davon answered "1A, 2B, 3B, 4B". Against the key (now revealed in `kb/tests/heldout/blind-key.md`), the skilled version won 2 of 4:

| Pair | View | Picked | Skilled was | Result |
|---|---|---|---|---|
| 1 | App home, 390 light | A | A | Skilled |
| 2 | App first run, 390 dark | B | B | Skilled |
| 3 | Poster, 1080x1350 | B | A | Baseline |
| 4 | Event page, 1440 light | B | A | Baseline |

Reading: the skills won the product UI brief and lost the brand brief, even though the baseline festival pages fail lint (canvas text too small, contrast at 4.29:1, three filled buttons in one screen). The losses match the gaps this report already named: the skilled poster's mirrored S read as a mistake, and the skilled event hero was quieter than the baseline's. Gate correctness does not win a brand brief on its own; identity at full strength does. Those gaps were fixed in commit 489c61b (brand concept legibility check, event-hero rule, high-contrast type floors, canvas lint) after the pairs were made, so the festival brief is re-run with the fixed skills.

## Festival re-run (2026-10-11, branch `heldout/festival2`)

Brief 2 only, same brief and dates, rebuilt with the skills as fixed in 489c61b: design-playbook-brand (section 0 brief-only scope, section 2a concept legibility check), design-playbook-landing 3b (the event hero carries the identity at full strength), design-typography `references/08-high-contrast-faces.md`, and the canvas lint (`data-canvas`). The bar on impact is the baseline poster and event page Davon picked; they were looked at, not copied (different face, colour, concept and layout).

**Method.** Single builder again: this session had no Agent or Task tool, so there was no clean-context critic and no subagent cold viewer. Judged rows are **self-scored, unverified**; gate not claimed (design-director step 13).

**Brief-only scope** (brand section 0). Built: poster 1080x1350, poster A2 (1191x1684, linted as 420x594 mm print read at 150 cm), event page, its state sheet, social card `og.png`, favicon (SVG plus 192 and 180 PNG). Not built: guidelines page, logo kit, brand strategy document; the brief did not ask for them. Three-line brief instead of website-strategy: audience, people who make or love letters and print in and around Glasgow; true fact, Glasgow is built of red sandstone laid in courses, and type is "set" the way stone is; competitor wall, festival posters lean on a Didone or a misregistration effect (both earlier versions of this test did).

**Concept.** "Type is set the way Glasgow's red sandstone is set: in courses, each stone cut to its word." The name is laid as ashlar: SET and IN are two stones in the first course, STONE one long stone in the second, every word sized to fill its stone (font size = stone width divided by the word's measured em width, `skilled2/src/measure.mjs`), five stone tones and pale lime joints. The width axis of Archivo (wdth 62 to 125) is the mason's cut: condensed on the posters and phones, regular on tablets, extended at 1280 and up, so every format is a wall cut to its own width. Reject test: hide the name and a red wall of cream capitals with staggered joints still says sandstone and setting, not a generic music festival (opinion).

**Concept legibility (brand 2a).** Devices flagged that a stranger could read as an error: none. Every letter is right-reading; nothing is mirrored, rotated, cropped through a letter or misregistered; the reversed S of the first skilled poster was dropped. One risk named: the joint between SET and IN could read as one word "SETIN"; on the renders the 8px lime joint plus the change of stone separates them. Cold-viewer test: **not run** (no subagent available); self-checked only, which section 2a says does not count. Davon's blind rank is the first real cold view.

**Type (typography 08).** Archivo is a low-contrast grotesque with no hairlines, so the hairline floor does not bind; Archivo 900 at wdth 62 was chosen partly for that after the Bodoni loss. Smallest canvas text 40px on 1080 (14.4 CSS px seen in a 390 feed); A2 smallest 30px, about 30pt printed. OFL, subset with `font_kit.py` to 81 KB (wght 400 to 900, wdth 62 to 125), self-hosted as base64.

**Gate results.**
| Check | poster-social | poster-a2 | event | event-states | og-card |
|---|---|---|---|---|---|
| `tools/lint.mjs` | PASS, 0 fail, 1 warn | PASS, 0 fail, 1 warn (print mode) | PASS, 0 fail, 9 warn | PASS, 0 fail, 1 warn | PASS, 0 fail, 1 warn |
| canvas-text | pass | pass | n/a | n/a | pass |
| `claims_inventory.mjs --year 2027` | exit 0 | exit 0 | exit 0 | | |
| `search-check.mjs` | | | PASS, 0 fail, 4 warn | | |
| `conversion-audit.mjs` | | | no fails | | |

Warnings read and kept: fallback layout shift (14 to 54px if the web font fails; an `Archivo Fallback` face with size-adjust is in place, and the fitted wordmark cannot match a fallback by design); `type-scale` fluid display sizes on the h1 (147px at 390, 324px at 1440; `clamp(49px, fit, 512px)`); `heading-wrap` "Stone" alone on its line (the second course, intended); `svg-overlap` 7px between the header logo box and the h1 em box (no ink overlaps; the header sits above with `z-index`); search warns for in-page anchors and weekday names. Lint skips, each with a reason: `data-lint-skip="overlay"` on the three wall words, because the text range rect is the untrimmed em box, which runs into the joint above while the glyphs sit wholly on the stone (`text-box: trim-both cap alphabetic`). Measured instead on the 1080 render: the worst stone pixel against the cream ink is 5.9:1 (flat stone tones 5.61 to 7.76:1). Favicon: `tab_contrast.py` fails each colour alone (lime field 1.08:1 on a light gray tab, stone 1.46:1 on a dark tab), so it is a two-tone mark on its own field: the stones carry 6.3:1 or more on light strips and the lime field 8.55:1 or more on dark.

Claims ticked: Sat 17 and Sun 18 April 2027 (weekdays checked against 2027); Fri 2 April 2027 refund date (a Friday); 10am to 6pm matches JSON-LD 10:00 to 18:00; prices £20, £32, £16 match the three Offers; workshop prices and places match the programme; "Day tickets £20" on the posters matches the page.

Layout: at 390 the category line, dates and the one filled action (Get tickets, cream on the wall) sit at about 600px of the 844 first screen; at 1440 the hero ends near 800px and About peeks above 900. The nav carries a text link to tickets, never a second filled button.

**Outputs.** Pages in `kb/tests/heldout/skilled2/` (`poster-social.html`, `poster-a2.html`, `event.html`, `event-states.html`, `og-card.html`, `og.png`, favicons; sources and build scripts in `skilled2/src/`, font subset in `skilled2/fonts/`). Shots in `kb/tests/heldout/shots/skilled2/` (posters; event 390, 768, 1024, 1440 light and dark; state sheet 390 and 1440 light and dark). Lint output in `kb/tests/heldout/skilled2/lint/`.

**Self-rating (unverified, opinion).** Against the baseline Davon picked: the new hero is the poster at full strength in the first screen at 390 and 1440 (red sandstone field edge to edge, 300px extended capitals at 1440). It is louder than the baseline's black Didone on cream, and it passes the gate where the baseline failed on canvas text, contrast and three filled buttons. Against a studio festival identity: close on idea and system (one rule generates poster, A2, social card, page and favicon), clearly below on finish. The stone grain is a generic noise texture, the joints read as a grid before they read as masonry, and the body below the hero is competent but plain. Pass not claimed: no clean critic, no cold viewer.

**Blind pairs.** Three pairs, new skilled versus the baseline Davon picked: (1) poster 1080x1350, (2) event page 1440 light, full page, (3) event page 390 light, full page. Order drawn with Python `secrets`, redrawn if all three matched; the files and the key are outside the repo (scratchpad `festival2-pairs/` and `festival2-blind-key.md`).

### Cold-viewer check (festival re-run, poster)

Run after the build by a fresh agent with no project context, shown only the two poster images of blind pair 1 (5-second feed read). It read both correctly, found no typos or broken rendering in either, and said the stone-block poster "reads instantly at thumbnail size" and would stop the scroll more. The concept legibility check therefore passes. One mismatch to note: the two versions invented different venue and price details (the brief left them open), which a ranker could notice.
