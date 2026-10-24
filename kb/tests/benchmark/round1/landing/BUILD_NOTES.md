# Ferry home page: build notes (benchmark round 1, Brief 1)

Page: `kb/tests/benchmark/round1/landing/ferry.html` (170 KB, one file). State sheet: `ferry-states.html`.
States by URL: `?state=faq-open`, `?state=menu-open`, `?state=team-1`, `?state=team-250` (invalid input).
Built 2026-10-13 by the designer-builder subagent. **Gate not claimed: self-review only** (director section 5 step 13; no fresh-context critic ran).

## Read log, in order
1. `CLAUDE.md`
2. `kb/tests/benchmark/briefs.md`
3. `skills/design-director/SKILL.md`
4. `skills/design-foundations/SKILL.md`, then `kb/FOUNDATIONS.md`, `references/tokens.md`, `references/fundamentals-checklist.md`, `references/accessibility.md`
5. `skills/design-playbook-landing/SKILL.md`, `references/signature-moves.md`
6. website-strategy: skipped; audience and positioning are given in the brief (playbook step 2 allows this)
7. `skills/design-copy/SKILL.md`, references 01, 03, 06
8. `skills/design-layout/SKILL.md`, references 05, 01, 04, 06
9. `skills/design-typography/SKILL.md`, references 02, 01, 05, 06, 07
10. `skills/design-color/SKILL.md`, `references/palette-building.md`, `references/ui-tokens-themes.md`
11. `skills/design-art-direction/SKILL.md`, references 01 and 04 (02 and 03 skipped: no photos, no text on images)
12. `skills/design-graphic/SKILL.md`, references 01, 04, 03 (head only)
13. `skills/design-conversion/SKILL.md`, references 01 to 04
14. design-ux references 07 (commerce flows), 03 (forms), 02 (navigation)
15. `skills/design-motion/SKILL.md`, references 01, 04, 03, 07
16. `skills/design-frontend/SKILL.md`, references 05 and 07
17. `skills/design-search/SKILL.md` (head), references 07, 02, 03
18. `skills/design-polish/SKILL.md`, references 06 and 01 (state sheet part), `assets/polish-tokens.css`
19. `kb/teardowns/INDEX.md`, `stripe-home.md`, `linear-home.md`, `ramp-home.md`, `mercury-home.md`
20. Screenshots in `kb/exemplars/shots/`: Stripe, Linear, Ramp, Mercury home at 1440 and 390
21. Tool headers: `tools/render.mjs`, `tools/lint.mjs`, `tools/lint-truth.mjs`, `tools/lint-tokens.mjs`, `skills/design-typography/assets/font_kit.py`, `skills/design-graphic/assets/wordmark.py` and `tab_contrast.py`, `skills/design-search/assets/search-check.mjs`, `skills/design-copy/assets/claims_inventory.mjs`, `skills/design-motion/assets/motion-audit.mjs`, `kb/teardowns/measure.mjs`

## Concept
**Every picture is a crossing: money leaves one shore in dollars and lands on the other in local currency, the same day, at the rate locked when you approve.**
Reject test: does it show money crossing, a locked rate, or a landing time? If not, cut it.
Carried by: the mark (two shores and the line between them), the hero run card ("Rates locked 8:52 am ET", a landing time per currency), the time-axis figure (approval at 8:52 am ET, seven routes landing in local time, linear x axis), and the pricing band.

## Fonts and delivery (design-typography reference 06, mixed self-hosted path)
| Role | Face | Instance | WOFF2 |
|---|---|---|---|
| Display, roman and italic | Source Serif 4, renamed **Ferry Serif** in the name table (OFL Reserved Font Name "Source") | wght 420, opsz 60, pinned | 18.9 KB + 19.5 KB, plus 0.9 KB each for the rupee sign |
| Text and UI | Inter (OFL, no RFN) | wght 400 to 600, opsz 16 pinned | 27.7 KB, plus 1.1 KB for the rupee sign |

- Source: `npm pack @fontsource-variable/inter @fontsource-variable/source-serif-4` (Inter 5.3.0, Source Serif 4 5.3.1). Only the six files used are kept in `src/fonts/`.
- Build: `src/build-fonts.py` instances, subsets to font_kit's Latin core, renames, and writes base64 `@font-face` rules with `unicode-range` and `font-display: swap` to `src/css/fonts.css` (94.4 KB of CSS, 69 KB gzip). The rupee sign is only in the latin-ext files, so each family gets a second one-glyph face on `U+20B9`.
- Metric fallbacks from `font_kit.py fallback`: Inter against Arial or Liberation Sans; Ferry Serif roman and italic against Times New Roman or Liberation Serif. `font-synthesis: none`.
- Logo: wordmark outlined from Source Serif 4 (wght 560, opsz 60, track -12) with `wordmark.py`; the mark is drawn by hand. Favicon: the mark on its own ink field (tab strip contrast passes because it has its own field). PNG favicon 192, apple-touch-icon, logo.png and a 1200x630 social card are rendered at build time from the page's own fonts (`src/build.mjs`, into `site/`).

## Build
From the repo root: `python3 -I kb/tests/benchmark/round1/landing/src/build-fonts.py`, `node kb/tests/benchmark/round1/landing/src/build-logo.mjs`, `node kb/tests/benchmark/round1/landing/src/build.mjs`. Sources: `src/ferry.src.html`, `src/states.src.html`, `src/ferry.css`, `src/data.mjs` (sample run totals). Helpers: `src/crop.py` (tiles full-page shots for reading), `src/lintsum.py`, `src/motion-scenarios.mjs`.

## Final tool results (after round 3)
| Tool | Result |
|---|---|
| `tools/lint.mjs` (390, 768, 1024, 1440, light and dark) | ferry.html **0 fail, 11 warn**; `?state=faq-open` 0 fail, 5 warn; `menu-open` 0 fail, 11 warn; `team-1` 0 fail, 11 warn; `team-250` 0 fail, 11 warn; state sheet 0 fail, 5 warn. Truth check passes (`data-sum-of` on the $78,034.62 total) |
| `claims_inventory.mjs --year 2026` | exit 0 on the page and on every state with `--render`; `--strict` exit 0 (no PROMISE or PERIOD warnings). 84 claims ticked by hand against `src/data.mjs` and the time-zone sums below |
| `search-check.mjs --base https://ferry.example/ --assets site/` | **PASS, 0 fail, 0 warn** |
| `conversion-audit.mjs` | no fails on the page and on `team-1`, `team-250`, `faq-open` |
| `icon_audit.mjs --selector "svg.icon"` | PASS (volume prompts on the 12px chevron and the minus glyph, looked at, fine). Without the selector it fails on the logo mark, see skill problems |
| `motion-audit.mjs` (4 scenarios) | PASS: crossing reveal 400 ms linear (time axis), FAQ icon 200 ms, press 100 ms, keyboard stepper no motion; reduce row has 0 animations |
| `polish-audit.mjs` | page PASS 0 fail, 10 warn; state sheet PASS 0 fail, 4 warn |
| `css-audit.mjs` | 0 fail; 7 `motion-unguarded` warnings |
| `weight.mjs` | 170 KB raw, 88 KB gzip; 79 KB gzip before first paint |

Remaining warnings and decisions:
- **type-scale (2):** fluid display sizes 72px (h1, final h2) and 100.8px (price numeral). Kept: both are `clamp()` display tokens with max at most 2.5 times min.
- **icon-stroke (8):** 1.5px plus and arrow icons beside 20px/500 and 16px/600 text (stem about 2.1px). Kept on the single `--icon-stroke` token; the plus icons are muted secondary affordances. Opinion; a critic may ask for 2px.
- **fallback (1 to 2):** 25px shift at 390 (49 to 73px in `faq-open`) when web fonts fail, from line-count changes, with metric fallbacks in place. Accepted.
- **targets (state sheet, 2):** demo cells at 390 under 44px. Accepted on a review sheet.
- **css-audit motion-unguarded (7):** transitions declared outside a reduced-motion query; a global `prefers-reduced-motion: reduce` rule zeroes every duration. Kept.
- **polish nested radius:** full pill inside a full pill on the theme switch. Correct as is.

Claim checks done by hand: 2+2+1+1+3+2+1 = 12 people; the seven USD amounts sum to $78,034.62; fee (12 - 3) x $12 = $108; 8:52 am to 10:46 am ET = 1 hour 54 minutes; on Fri, Oct 30, 2026 ET is UTC-4 (US DST ends Nov 1), Paris UTC+1 and London UTC+0 (EU DST ended Oct 25), India UTC+5:30, Recife UTC-3, Guadalajara UTC-6, so 9:18 ET = 6:48 pm IST, 9:31 ET = 2:31 pm Paris, 9:40 ET = 1:40 pm London, 10:05 ET = 11:05 am Recife, 10:46 ET = 8:46 am Guadalajara; 7 + 10 + 7 + 4 = 28 currencies; 7 + (21 + 9) + 7 + 4 = 48 countries; Oct 30, 2026 is a Friday.

## Fix rounds
1. Round 1 (render, read every tile): hero card rows 88px tall from a wrapping USD-and-rate line; section labels inheriting 20px from `.head p`; facts strip touching the caption; 224px gap after the hero; MXN lane label wrapping. Lint: axe `aria-label` on a `<p>`, green-on-tint chip at 4.3:1, stepper UA padding off scale, occlusion and measure fails from closed `<details>` content.
2. Round 2: grid gap aligned to 32 from 1024 (grid-edge), phone menu rebuilt as a sheet with `inert` page behind it (overlay check), `.fact span` selector breaking nowrap spans, apostrophes, canonical term line with "Cancel online at any time." (conversion `sub-terms`), search warnings (description length, relative dates, logo width type).
3. Round 3: 44px touch targets below 1024, ledger rows equalised, euro-area disclosure replaced by a visible footnote (an open disclosure broke the shared row edges), raw spacing in the figure moved to tokens or `translate`, range media syntax, and a truth bug: in the invalid state the calculator still showed "$108 a month" for 12 people; it now shows no price.

## My top 3 gaps against the exemplars
1. **No ownable image.** Stripe spends its whole color budget on one gradient, Mercury on photography, Linear on a deep product shot. Ferry's identity is orange, a serif and a product card; the crossing figure is the only drawn graphic and it sits below the fold. With the logo hidden, the hero could belong to any fintech that uses a serif.
2. **Proof is thin and late.** Stripe and Ramp put live proof at the fold (a GDP counter, a processed-volume chip, a logo wall). Ferry has four product facts at the fold and one sample quote with three sample stats in the middle of the page. Honest, but it does not persuade like the exemplars.
3. **Phone edit and fold.** The phone page is 10,136px, and the hero card adds seven 64px rows before the first section; Stripe cuts its hero to one sentence at 390. At 1440 only the rule of the next section peeks above 900px, not its numerals (playbook check 4 asks for a peek). Dark mode is a remap, not tuned the way Linear tunes weights and alpha borders for light-on-dark.

## Skill problems (missing, wrong, contradictory, hard to follow)
1. **Shadow tokens contradict FOUNDATIONS.** `skills/design-polish/assets/polish-tokens.css` lines 14 and 37 set `--shadow-0: none` and dark `--shadow-1` to `--shadow-4: none`; `kb/FOUNDATIONS.md` and `skills/design-foundations/references/tokens.md` (Radius and elevation) say never `none` inside a shadow token. Copying the polish asset breaks composed shadows in dark.
2. **Hover duration disagrees.** `skills/design-polish/SKILL.md` line 55 and `references/01-interactive-states.md` line 60 put hover at 150ms (`--duration-fast`); FOUNDATIONS and design-motion SKILL.md line 42 set `--motion-hover` to `--duration-instant` (100ms).
3. **Hero entrance motion: three answers.** `skills/design-motion/references/03-choreography-transitions.md` line 49 ("Hero: no entrance animation") and design-motion SKILL.md line 84 (reveal only below the fold) against `kb/FOUNDATIONS.md` line 59 and `skills/design-playbook-landing/SKILL.md` line 19 (one 800ms hero reveal allowed).
4. **Stale `--duration-page`.** `skills/design-motion/references/07-motion-on-real-pages.md` lines 30, 45 and 70 say `--duration-page` is 600 ms "until the editor decides"; tokens.md sets 400ms. `motion-audit.mjs` accepts 600 and 800, so a builder cannot tell which value the token should hold.
5. **Typography output format is broken.** `skills/design-typography/SKILL.md` lines 114 and 115 are both numbered "6. Loading" (with different text) and there is no item 5.
6. **Display ramp numbers differ.** `skills/design-typography/references/07-type-led-pages.md` line 16 gives `--text-display-2` as 39 to 76px; tokens.md gives `clamp(39px, 5vw, 80px)`.
7. **Content box: 1280 or 1136.** `skills/design-layout/SKILL.md` line 60 and reference 01 line 29 say a 1280px content box; `references/06-pacing-signature-and-phone-editing.md` line 45 says "content box 1136 inside a 1232 max with 48 padding". FOUNDATIONS line 199 admits the disagreement is open. A builder has to pick.
8. **Fluid section padding fails the lint.** design-layout reference 02 line 37 recommends `--space-section: clamp(64px, 4rem + 4vw, 128px)`, but the lint's `spacing` check (tools/lint.mjs line 455 onward) fails any computed padding off the scale, which a clamp produces at 768 and 1024. I stepped it with media queries instead.
9. **Breakpoint units contradict.** `skills/design-frontend/SKILL.md` lines 59 and 72 say breakpoints are written in em (40em, 48em) and "media query in em"; tokens.md says rem is the default so media and container numbers read the same. css-audit then warns on `min-width` syntax and wants range syntax, which no skill mentions.
10. **Color role names drift.** `skills/design-color/references/ui-tokens-themes.md` line 7 lists the variants as `-hover, -pressed` and line 27 names `primary-pressed`; FOUNDATIONS names `--color-primary-active`. The role list there also leaves out `surface-sunken`, `text-muted-on-tint` and `border-strong`, which the lint and the checklist expect.
11. **Theme toggle is half specified.** ui-tokens-themes lines 64 to 66 and 90 and design-frontend line 74 give the `data-theme` override and the Light, Dark, System rule, but no skill says where the control lives, how it is stored (localStorage is fine per the platform rules), or that `theme-color` metas follow `prefers-color-scheme`, not `data-theme`. render.mjs and lint.mjs only emulate the media query, so the toggle path is never rendered or linted.
12. **Closed `<details>` content counts as visible in the lint.** `tools/lint.mjs` line 139 (`visible`) checks display, visibility, opacity and box size. In Chromium 141 the content of a closed `<details>` still returns a full bounding box, so the lint ran occlusion, measure and svg-overlap on hidden menu links and FAQ answers (14 false occlusion fails, 1 false measure fail on round 1). Workaround in the page: `details:not([open]) > :not(summary) { display: none; }`. The lint should skip `el.closest('details:not([open])')` content outside the summary.
13. **icon_audit and lint disagree on logos.** The lint skips SVG inside an element whose class names logo (tools/lint.mjs header), but `skills/design-graphic/assets/icon_audit.mjs` line 114 fails any icon with a token stroke color, including the logo mark, so the audit exits 1 on a page the lint passes. The director's step 6 does not mention `--selector`.
14. **font_kit cannot honour the Reserved Font Name rule it warns about.** `skills/design-typography/assets/font_kit.py` line 108: `--family` only changes the CSS family name; the name table inside the file still says "Source Serif 4". OFL FAQ 2.7 needs the internal name changed for an RFN font. I added a rename in `src/build-fonts.py`. Also, `LATIN_CORE` (line 35) leaves out the rupee sign, and the Fontsource latin files lack U+20B9 and U+202F (narrow no-break space), which FOUNDATIONS Content mechanics asks for before units. Typography reference 02's coverage check names the rupee; reference 06 does not say how to add a glyph from the latin-ext file (a second face on its own `unicode-range` works).
15. **measure-layout is hard-wired to the coffee page.** `kb/tests/design-layout/measure-layout.mjs` line 13 lists `#shop`, `#subscribe`, `#story` as the fold landmarks, so the landing playbook's check 4 ("next section peeks at 1440, measure with measure-layout.mjs", `skills/design-playbook-landing/SKILL.md` line 59) prints `{}` on any other page. The director's loop (section 5) never mentions measure-layout either.
16. **Hub links on a one-page test.** design-search reference 07 lines 16 and 49 require header and footer links to hub URLs, not `#fragments`. On a single-file benchmark page those URLs do not exist; the page passes search-check but every nav link 404s locally. A note on how to treat this in tests would help.
17. **Stale or mismatched references.** `skills/design-graphic/SKILL.md` line 12 says "Defaults follow FOUNDATIONS v0.3" (current v0.4.4). `skills/design-playbook-landing/references/signature-moves.md` line 3 still says "opinion, unmeasured" though the teardowns now exist. The director (line 88) and playbook (line 61) name Stripe, Linear, Vercel, Ramp; the benchmark brief names Mercury instead of Vercel.
18. **Lint and FOUNDATIONS on the state sheet's focus.** The director asks for focus shown on the state sheet, but there is no shared `.is-focus` convention (the lint knows `.is-hover`, `.is-active`, `.is-pressed` only, `tools/lint-tokens.mjs` line 45), so each builder invents one.
19. **Missing guidance I needed:** how a marketing hero should show a product card on a phone without doubling the page length (the phone edit list in layout reference 06 is about sections, not a long hero artifact); how to animate a `<details>` open state (design-motion says accordions use `grid-template-rows`, which does not apply to native `<details>` without `::details-content`); and how to keep a calculator's output honest in an invalid state (the truth contract covers sums and live updates, not inputs).
