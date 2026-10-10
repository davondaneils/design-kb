# Tests: design-graphic (wave 2, rendered)

Date: 2026-10-10. Branch `wave/graphic`. Briefs and rubric: `kb/briefs/graphic/07-wave2-render-test.md` (editor-in-chief). Pages, lint JSON, audits and screenshots: `kb/tests/design-graphic/`. One command reruns everything: `node kb/tests/design-graphic/run.mjs`.

## Method
- **Baseline ("without")** = the combined pages Davon picked 3 of 3 (`kb/tests/combined/coffee.html`, `dashboard.html`), built through design-director with every other skill. Copied unchanged into this folder (`coffee.src.html`, `dashboard.src.html`, `build.mjs`, `states.mjs`), then changed only where design-graphic applies. So the gain measured is design-graphic's alone. Clean-context note: the same agent built both, but the baseline was built in an earlier session by other agents and was not touched before the baseline lint and audit were saved (`before/`).
- **With the skill**: design-director > design-foundations > the playbook > design-graphic SKILL.md, references 01, 02, 06, design-polish 03 (stems), design-art-direction (concept "the hill and the fire").
- **Network**: font files download (Newsreader variable TTFs from github.com/google/fonts, OFL), so the wordmark is outlined from the real brand face. Photo and exemplar hosts blocked; exemplar comparison uses the measured teardowns and screenshots on `origin/claude/exemplar-library-xfa3bl` (Linear, Vercel, Stripe, Raycast, Apple MacBook Air), read but not committed here.

## What changed
| Page | design-graphic change | Source |
|---|---|---|
| Coffee | Header logo: live Newsreader text replaced by an outlined wordmark (opsz 72, wght 480, italic ampersand, tracked and kerned by pair) with one drawn detail: two eccentric rings and an ember dot inside the O (tier 2: one ring) | `marks.mjs`, `marks/wordmark.svg` from `assets/wordmark.py` |
| Coffee | Bag label: text "Ember & Oak" replaced by the 32px symbol (tier 3) | same |
| Coffee | Footer sign-off: 152px live text replaced by the full-width outlined wordmark (tier 1, two rings), optical margin -0.6% | same |
| Coffee | Favicon (none before): tier 4 drawn mark on its own warm 950 field; apple-touch-icon 180 | `faviconSvg`, `appIconSvg` |
| Dashboard | 21 hand-drawn inline icons (12 and 16 viewBoxes, mixed caps and joins, hard-coded colors) replaced by one 16-grid set plus a 12-grid pair from one module, expanded inline | `icons.mjs` |
| Dashboard | Stroke bound to label weight: nav and side buttons 400 to 500 (Linear sets UI at 510, teardown), 1.5px icons; selected 600 at 1.75px; sort headers 1.25 and 1.5px | `dashboard.src.html` CSS |
| Dashboard | Solid error and warning icons with knocked-out marks (were filled shapes with `#ffffff` and `#000000` strokes) | `icons.mjs` |
| Dashboard | Tally brand mark redrawn on the quarter-pixel grid; favicon (none before) | `tallyMark` |

## Lint (tools/lint.mjs): any fail = fail
| Target | Before (combined) | After |
|---|---|---|
| coffee.html | PASS, 0 fail, 21 warn | PASS, 0 fail, 21 warn |
| coffee `?state=` added, subscribed, error, sending | (combined: 0 fail) | PASS, 0 fail, 21 warn each |
| coffee-states.html | (combined: 0 fail, 14 warn) | PASS, 0 fail, 14 warn |
| dashboard.html | PASS, 0 fail, 27 warn | PASS, 0 fail, 27 warn |
| dashboard `?state=` loading, empty, partial, viewer, `?density=compact`, `?open=palette`, `?open=sheet` | (combined: 0 fail) | PASS, 0 fail; 8 to 34 warn |
| dashboard-states.html | (combined: 0 fail, 35 warn) | PASS, 0 fail, 35 warn |
| mark-sheet.html, icon-sheet.html | n/a | PASS, 0 fail, 0 warn |
Warnings are the same classes as the combined run: touch targets 24 to 44px at 390 (dense UI, above the AA floor), fluid display sizes, dialog top-layer svg-overlap. None new. The mark sheet failed its first lint (muted caption contrast 1.68:1 on the light panel, an off-scale clear-space padding, 390 overflow, the iOS-mask radius): fixed, with the two deliberate exceptions marked `data-lint-skip` (clear space = cap height, app icon mask radius).

## Domain checks (assets/icon_audit.mjs, assets/tab_contrast.py)
| Check | Before | After |
|---|---|---|
| Icon audit, dashboard | **FAIL**: mixed caps (round, butt), mixed joins (round, miter), 3 hard-coded colors, 3 icons with ink touching the box | **PASS**: 18 distinct icons, one cap, one join, no colors, pad 1 to 2px |
| Partial (soft) pixels at 2x, dashboard icons | 39 to 51% of ink | 10 to 42% (straight-stem icons 10 to 26%: calendar 10, keyboard 14, funnels 20, arrows 23 to 26) |
| Icon audit, coffee | PASS (3 icons) | PASS (unchanged icons) |
| Favicon | none on either page | coffee: ink 14.92:1 and ember 5.28:1 on its own field, on every strip; Tally: marks `#101214` on teal field |
Both the fundamentals lint and the polish audit passed the before set; only the new audit sees caps, joins and hard-coded colors.

## Judged (fundamentals first, from the renders)
- **Non-text contrast**: status icons inherit `--color-danger-mark` and `--color-warning-mark` (unchanged tokens, measured in the combined run); every icon is paired with a text label. Ember dot is decorative within an exempt logo.
- **Not color alone**: unchanged; alerts keep "Error:" and "Warning:" text plus distinct shapes (circle vs triangle).
- **Consistency**: one icon family on each page; one cap and join (audit). Wordmark ink follows `--color-text` in both themes; the ember stays brand orange.
- **Both themes**: wordmark, symbol and icons remap through `currentColor` and tokens (`coffee-390-dark.png`, `dashboard-390-dark.png`, `dashboard-state-viewer-1440-dark.png`).
- **States**: selected nav icon gains weight with its label (1.75px), sort icons follow header weight; no layout shift (lint `state-shift` pass).
- **Accessibility of marks**: header link named "Ember & Oak, home" with the SVG hidden; sign-off SVG hidden (the legal line names the company); symbol on the bag is inside an `aria-hidden` label, as before.

## Exemplar comparison (opinion, from pixels)
| Page | Closest exemplars | Rating | Why |
|---|---|---|---|
| Coffee, identity | pentagram.com identity work, apple.com (teardown screenshot) | **Close** on the mark, **clearly below** on the page | The wordmark now reads as drawn for this brand: hide the name and the O still says contour and fire, and it repeats the page's contour art at every size from the 1200px sign-off to the 16px tab. Spacing and the italic ampersand are studio grade. A Pentagram partner would push the detail further (a custom E or k cut to match the O's stress, a drawn rather than typeset ampersand) and would want the mark tested on the real bag. The page as a whole is unchanged elsewhere and still lacks photography (art direction's gap). |
| Dashboard, icons | Linear app (teardown shot `linear-home-1440-light.jpg`, app UI in the hero), Vercel | **Close** | Side by side with the Linear app crop: same 16px monoline family, muted until selected, labels at medium weight (Linear 510, ours 500). Ours are crisp at 2x where Linear's hero screenshot is too small to judge pixel by pixel. Linear's set is smaller relative to labels and uses fewer icons (its 2026 note "reduces icon usage"); ours keeps every nav icon. The Tally mark is serviceable, not memorable. |

Close-ups (DPR 2): `shots/before-zoom-dashboard-sidebar.png` vs `shots/zoom-dashboard-sidebar.png`; `shots/before-zoom-coffee-signoff.png` vs `shots/zoom-coffee-signoff.png`; `shots/zoom-coffee-hero.png`, `zoom-coffee-hero-390-dark.png`, `zoom-dashboard-alerts.png`, `zoom-favicon.png`. Sheets: `shots/mark-sheet-*.png`, `shots/icon-sheet-*.png`.

## Verdict
**Pass**: fundamentals 100 percent (lint 0 fails on 2 pages, 11 states, 2 state sheets and 2 sheets; audit pass), rated close to the nearest exemplar in this domain on both pages, and clearly better than the baseline on the measurable items (icon audit fail to pass, soft pixels roughly halved on straight-stem icons, no favicon to a measured one, live text to a drawn mark). Not a claim that either page is at the bar overall: the coffee page's distance is photography and its middle sections (art direction, layout), not the mark.

## Rounds (2 of 3)
| Round | Found on the renders | Fix |
|---|---|---|
| 1 | Single inner ring made the O read as an eye (upside-down and unwanted-reading test on the mark sheet) | Two eccentric rings pulled toward the ember: reads as contours or growth rings |
| 1 | Favicon in two tones vanished on the dark tab | First fix: one brand-orange color |
| 1 | Chip label gap doubled when icons moved to 16px (flex gap applied to the label text too) | Icon margin, label gap kept at 4 |
| 2 | Measured the one-color favicon on a gray inactive tab: 2.32:1 | Mark on its own warm 950 field; rule rewritten in the skill (critic fix 2) |
| 2 | Skill text said a 1.5px stroke "renders crisp" at 2x | Measured placement; rule rewritten (critic fix 1) |
| 2 | 32px bag symbol with two rings muddy | One ring below tier 2 |

## Gaps (for the domain-specialist and other domains)
1. Coffee page icons (check, arrow, error) were not redrawn on the new grid; they pass the audit but use a 20 viewBox for 14px text. Low priority.
2. No OG image or social card generated from the mark (05 covers composition; a build recipe would help).
3. Tally mark: a stronger product mark needs a concept beyond "tally strokes"; out of scope for icons.
4. Exemplar teardowns do not measure icons or logos (SVG counts only: Linear 229, Vercel 47 inline SVGs on the home page). Add an icon probe to `kb/teardowns/measure.mjs` (stroke widths, viewBoxes, caps) so the next comparison is measured.
5. The fundamentals lint cannot see icon caps, joins or hard-coded colors (pipeline note 7).
