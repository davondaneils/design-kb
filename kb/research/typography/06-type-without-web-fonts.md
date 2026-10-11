# Research 06: Type without a font CDN (system stacks, self-hosted and variable fonts), and the measure

Status key: **C** consensus, **X** contested, **O** opinion, **M** measured here (method and script named).
Accessed 2026-10-09 unless noted. Context: font CDNs (fonts.googleapis.com, use.typekit.net) and exemplar hosts are blocked from this environment; the npm registry is not. The design-color pilot named type as a reason the coffee page "was not special".

## Key findings

| # | Claim | Quote (under 40 words) | Source | Tier | Status |
|---|---|---|---|---|---|
| 1 | Named system stacks by classification give a designed look with zero downloads. | "The fastest fonts available. No downloading, no layout shifts, no flashes" (quote cut before the source's dash) | https://github.com/system-fonts/modern-font-stacks | 4 | C (widely used) |
| 2 | Transitional stack | "font-family: Charter, 'Bitstream Charter', 'Sitka Text', Cambria, serif;" | same | 4 | C |
| 3 | Old Style stack | "font-family: 'Iowan Old Style', 'Palatino Linotype', 'URW Palladio L', P052, serif;" | same | 4 | C |
| 4 | Neo-Grotesque stack | "font-family: Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif;" | same | 4 | C |
| 5 | Industrial stack, and Bahnschrift is variable | "Bahnschrift is one of the first variable font added to Windows." | same | 4 | C |
| 6 | Monospace Code stack | "font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;" | same | 4 | C |
| 7 | Didone and Antique stacks exist for display | "font-family: Didot, 'Bodoni MT', 'Noto Serif Display', 'URW Palladio L', P052, Sylfaen, serif;" | same | 4 | C |
| 8 | `system-ui` is the platform UI font, by definition not one face | "Glyphs are taken from the default user interface font on a given platform." | https://developer.mozilla.org/en-US/docs/Web/CSS/font-family | 1 | C |
| 9 | `ui-serif`, `ui-sans-serif`, `ui-monospace`, `ui-rounded` work only in Safari | Supported: "Safari (desktop): 13.1 through 27.1"; Chrome, Edge, Firefox listed as not supported | https://caniuse.com/extended-system-fonts | 1 | C |
| 10 | Apple's system fonts are variable with continuous optical sizes and automatic tracking | "the system fonts support dynamic optical sizes, which merge discrete optical sizes (like Text and Display) and weights into a single, continuous design" | https://developer.apple.com/design/human-interface-guidelines/typography | 1 | C |
| 11 | Same | "In a running app, the system font dynamically adjusts tracking at every point size." | same | 1 | C |
| 12 | Windows 11 system font is variable (wght, opsz), and the web must name it | "When using HTML, optical scaling is also automatic, but you will need to specify the Segoe UI Variable font in CSS." | https://learn.microsoft.com/en-us/windows/apps/design/signature-experiences/typography | 1 | C |
| 13 | Segoe UI Variable axes | "The optical size axis (opsz) is automatic and on by default ... (for optical scaling from 8pt to 36pt)." | same | 1 | C |
| 14 | `local()` matches the full or PostScript name; list both | "you should include both of these names to assure proper matching across platforms" | https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src | 1 | C |
| 15 | Browsers may ignore user-installed fonts in `local()` (anti-fingerprinting), so only preinstalled fonts are reliable | "To prevent this, user agents may ignore user-installed fonts when using local()." | same | 1 | C |
| 16 | Fontsource packages open-source fonts as npm packages, for self-hosting | "Fontsource is a collection of open-source fonts that are packaged into individual NPM packages" | https://fontsource.org/docs/getting-started/introduction | 4 | C |
| 17 | Weight fallback: a target under 400 takes the next lighter weight first | "If a weight less than 400 is given, look for available weights less than the target, in descending order." | https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight | 1 | C |
| 18 | `font-size-adjust` with `from-font` | "Uses the <number> value for the specified <font-metric> from the first available font." Computed value listed "as specified", inherited "yes". | https://developer.mozilla.org/en-US/docs/Web/CSS/font-size-adjust | 1 | C (see M4 for Chromium behaviour) |
| 19 | Use the best available ampersand in display | Bringhurst 5.1.3: "In heads and titles, use the best available ampersand." (italic ampersands are often the better form) | Bringhurst, The Elements of Typographic Style, 5.1.3, quoted at https://retro.simplebits.com/posts/ampersands-2 | 3 | C |
| 20 | OFL: subset or instance = Modified Version; RFN rules apply | (see research 03, claim 10) | https://openfontlicense.org/ofl-faq/ | 1 | C |

## Measured here (M)

**M1. Characters per line by CSS unit and face.** Script: `kb/research/typography/measure-cpl.mjs` (same word-per-line counting as `tools/lint.mjs`; a 600-character English paragraph; Chromium; 16 and 20px gave identical counts). Liberation Serif, Liberation Sans, Carlito and Caladea are metric clones of Times New Roman, Arial, Calibri and Cambria, so their rows stand for those faces. Bitstream Charter is installed only as Type 1 and Chromium fell back, so it is excluded.

| Face | ch / em | average char / em | 28em | 32em | 34em | 48ch | 50ch | 52ch | 54ch | 60ch | 66ch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Inter | 0.631 | 0.471 | 56 | 66 | 70 | 61 | 66 | 68 | 70 | 79 | 86 |
| Inter Display | 0.613 | 0.428 | 65 | 73 | 77 | 67 | 70 | 73 | 76 | 83 | 95 |
| Times (Liberation Serif) | 0.500 | 0.400 | 68 | 77 | 83 | 56 | 60 | 63 | 66 | 74 | 81 |
| Arial (Liberation Sans) | 0.557 | 0.440 | 61 | 70 | 75 | 58 | 61 | 65 | 66 | 74 | 81 |
| DejaVu Sans (Verdana-like width) | 0.637 | 0.503 | 53 | 61 | 66 | 58 | 61 | 65 | 66 | 74 | 81 |
| DejaVu Serif | 0.637 | 0.508 | 53 | 61 | 66 | 56 | 61 | 63 | 66 | 74 | 81 |
| Calibri (Carlito) | 0.507 | 0.403 | 67 | 77 | 82 | 58 | 61 | 63 | 66 | 74 | 81 |
| Cambria (Caladea) | 0.518 | 0.400 | 68 | 77 | 82 | 60 | 63 | 66 | 68 | 76 | 83 |
| FreeSans (Helvetica-like) | 0.557 | 0.423 | 65 | 74 | 79 | 61 | 65 | 66 | 69 | 77 | 85 |

Findings:
- `66ch` gives 81 to 86 characters in every text face: over the 75 target and the 80 ceiling. The layout skill's `66ch` default is wrong in all of them.
- `em` is not face-independent: `32em` gives 61 (DejaVu) to 77 (Times, Calibri, Cambria). FOUNDATIONS' `32em` is right for Inter and fails the 75 limit in a Times-width serif. Bringhurst's "33em is about 66 characters" assumes a 0.5em average character; measured averages run 0.40 to 0.51em.
- `ch` is the steadiest unit, because the zero's width rises and falls with the face's overall width: characters per `ch` ran 1.21 to 1.31 across text faces. `52ch` gave 63 to 68 in all eight text faces. Display cuts are narrower per ch (Inter Display 1.40) and are not body faces.
- Rule derived: default `max-inline-size: 52ch`; keep body between about `40ch` and `56ch`; confirm with the lint.

**M2. Variable font size versus axes kept.** Tool: `skills/design-typography/assets/font_kit.py subset`. Newsreader (OFL) Latin from Fontsource, roman: full file 132 KB; wght narrowed to 300 to 600: 117 KB; opsz pinned to 60 and wght 350 to 550: 47 KB; opsz pinned and wght pinned (one static instance): 21 KB. Italic, pinned: 23 KB. Inter (Fontsource variable, wght only): 48 KB; wght narrowed to 400 to 600 plus Latin core subset: 27 KB.

**M3. Feature loss in CDN-style builds.** fontTools GSUB feature list. Fontsource `inter-latin-wght-normal.woff2`: 7 features (calt, dnom, frac, locl, numr, pnum, tnum). Designer release Inter 4.000 (Debian `fonts-inter`): 40 features, including case, zero, ss01 to ss08, cv01 to cv13, smcp, c2sc, sups, ordn. Newsreader on Fontsource: liga, pnum, tnum only (no onum, smcp). Subset static cuts from the full release cost 38 to 41 KB per weight.

**M4. `font-size-adjust: ex-height from-font` in Chromium.** Script: `kb/research/typography/test-fsa-from-font.mjs`. Body Inter 16px, inline code in Liberation Mono. Set on the code itself: computed 0.528 (the mono's own ratio), width unchanged (172.8px), a no-op. Set on the parent: computed 0.546 (Inter's ratio) and inherited, code width 178.4px, same as an explicit `0.546`. So `from-font` resolves on the element where it is declared; declare it on the parent or `:root`, never on the code. MDN lists the computed value as "as specified"; Chromium's computed style shows a number. Treat cross-browser behaviour as unverified (Safari and Firefox not available here).

**M5. Metric-matched fallback, swap shift.** Script: `kb/tests/design-typography/fonts/swap-shift.mjs`. Coffee test page with Newsreader versus the same page with fonts removed. With `font_kit.py fallback` overrides on Times New Roman or Liberation Serif (size-adjust 105.37%): 0px shift in every section at 390 and 1440. Without the overrides: one heading rewrapped at 1440 and everything below moved 75px. Without a separate italic fallback face, italics rendered upright under `font-synthesis: none` (judged on the screenshot).

**M6. Side bearings scale with size.** fontTools `hmtx` left side bearings: Newsreader E 0.043em, P 0.043em, italic T 0.111em; Inter E 0.088em. At 112px the Newsreader E starts 5px inside the text edge while a 12px Inter label above it starts 1px in, so a display headline looks indented. Correction: shift the display line by minus the first glyph's side bearing (`translate: -0.04em 0`).

**M7. Inter fallback against Arial**: size-adjust 107.59%, ascent 90.04%, descent 22.42%, line gap 0 (`font_kit.py fallback`, average width over an English sample, hhea metrics).

## Conflicting views
- em versus ch for measure: Bringhurst (em, 0.5em average), the layout skill (66ch), FOUNDATIONS v0.2 (32em). M1 resolves it: ch with a lower count (52ch), because it tracks face width; em needs a per-face average.
- Inline base64 fonts versus external files: inlining removes a request and works in a self-contained file but cannot be cached separately and bloats HTML. Opinion: inline only small subsets (under about 30 KB each) for single-page deliverables; ship files with `preload` in a real build.
- System stack versus shipped font for data UI: web.dev favours system fonts for performance; the skill's fintech example favours one shipped face for identical figure widths. Both stand; pick by whether cross-platform column alignment matters.

## Likely to change
- `ui-serif` and `ui-rounded` support outside Safari (open Chromium and Firefox bugs per caniuse).
- `text-box` trim support; `font-size-adjust: from-font` inheritance behaviour across engines.
- Which fonts ship with Windows and macOS releases.
