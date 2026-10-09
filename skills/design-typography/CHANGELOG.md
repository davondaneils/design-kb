# Changelog: design-typography

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
