# Changelog: design-typography

## 0.3.1 (2026-10-13, editor-in-chief, benchmark round 1, `kb/tests/benchmark/round1/RANKED.md`)
- F2: 16px is the most common size on a marketing page, 14px for app UI and phone row line 2 (lint `reading-size`). Reference 01: measure floor 35 at 390.
- Output format: the two items numbered 6 merged into one Loading item (5). Reference 07: `--text-display-2` max 80px, as in FOUNDATIONS (was 76).
- `font_kit.py` keeps the rupee (U+20B9) in `LATIN_CORE` and says `--family` does not rename the name table; reference 06 says how to add a missing glyph from latin-ext with `unicode-range`.

## 0.3.0 (2026-10-11, editor-in-chief, from the held-out test)
- New `references/08-high-contrast-faces.md` and `assets/hairline.py`: Didone and high-contrast rule (hairline at the seen size; 0.5 CSS px screen and 0.25 pt print floors, doubled reversed; opsz by viewing size; Bodoni Moda measured at opsz 6 to 96; outlined wordmarks freeze opsz). The held-out poster's Bodoni Moda wordmark at opsz 48 rendered a 0.36 CSS px hairline in a 390 feed (`kb/tests/heldout.md`).
- SKILL section 4 gains the high-contrast decision rule; section 5 gains move 23 (weight does not save a hairline).

## 0.2.1 (2026-10-09, editor-in-chief)
- FOUNDATIONS v0.3 adopts `52ch`, the display ramp and leading 0.95 for display lines; stale "(planned)" hand-offs to design-product-ui removed. Lint now checks straight quotes, number-range hyphens, uppercased units, faked styles, doubled list markers and fallback reflow.

## 0.2 (2026-10-09)
- New reference 06, type without a font CDN: three paths (system, self-hosted, mixed), named system stacks by classification, variable system fonts (SF, Segoe UI Variable, Bahnschrift) and their traps, axis pinning with measured sizes, inlining, metric fallbacks per style including italics, testing with the font blocked.
- New reference 07, type-led pages: making the type carry a landing or brand page with no photography (display ramp, leading 0.95, roman and italic headline, optical margins, numerals as graphics, best available ampersand, editorial set pieces).
- New `assets/font_kit.py`: `subset` (subset, pin axes, WOFF2, `@font-face`, optional base64) and `fallback` (size-adjust and metric overrides from local files).
- Measure rule corrected after measurement: `max-inline-size: 52ch` (63 to 68 characters in every text face tested); `66ch` gives 81 to 86; em widths drift with the face (SKILL F6, move 2; references 01, 04).
- `font-size-adjust: ex-height from-font` corrected: declare it on the parent, not on the code element (measured; SKILL move 8; references 02, 04).
- New expert moves 18 to 22: axis pinning, CDN builds strip OpenType features, side bearings at display size, static weight snapping, units under caps labels.
- Research: tabular-figures claims now rest on MDN; X posts demoted to leads (unfetchable).
- Tested on rendered pages (kb/tests/design-typography.md): lint pass on both; type rated close to the exemplars on the landing and dashboard briefs.

## 0.1 (2026-10-09)
- First version: SKILL.md and references 01 to 05; critic approved, never tested.

Review interval: yearly (foundation domain). Next review due 2027-10. Recheck sooner (every 3 months): `ui-serif` and `ui-rounded` support outside Safari, `text-box` trim support, `font-size-adjust: from-font` inheritance across engines, and which fonts ship with Windows and macOS.
Related skills: design-color, design-layout, design-graphic, design-frontend, design-copy, design-ux; website-strategy, copywriting.
