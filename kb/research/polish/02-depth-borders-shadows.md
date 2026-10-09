# Research: 02 Depth, borders, shadows, hairlines

Accessed 2026-10-09. Tiers and status as in 01.

## Key findings
1. One light source for the whole page; "every shadow on the page should share the same ratio"; layered shadows mimic real soft shadows; pure black shadows desaturate the surface under them (Comeau, practitioner with inspectable work, tier 4).
2. Comeau's layered example: five layers `0 1px 1px`, `0 2px 2px`, `0 4px 4px`, `0 8px 8px`, `0 16px 16px` each at alpha 0.075. Bigger shadow means higher elevation.
3. Tailwind v4 shadow scale (widely shipped defaults, tier 1 for what Tailwind ships): `shadow-xs 0 1px 2px 0 rgb(0 0 0 / 0.05)`; `shadow-sm 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`; `md 0 4px 6px -1px / 0.1, 0 2px 4px -2px / 0.1`; `lg 0 10px 15px -3px, 0 4px 6px -4px`; `xl 0 20px 25px -5px, 0 8px 10px -6px`; `2xl 0 25px 50px -12px / 0.25`. Negative spread keeps the shadow tucked under the element.
4. Vercel Geist materials pair radius with elevation: base and small 6px, medium and large 12px, menu and modal 12px, fullscreen 16px; tooltip "Lightest shadow"; "Tooltips will be the only floating element with a triangular stem."
5. Radix Colors scale: step 6 "subtle borders on components which are not interactive", step 7 "subtle borders on interactive components", step 8 "stronger borders on interactive components and focus rings"; steps 3, 4, 5 are component background normal, hover, pressed or selected.
6. Apple dark mode: base and elevated backgrounds; "the elevated colors are brighter, making foreground interfaces appear to advance."
7. Forced colors mode: `box-shadow` is forced to none, so a control whose edge is only a shadow disappears; MDN's example adds a border inside `@media (forced-colors: active)`.
8. Linear's 2026 refresh: separators "had quietly proliferated across the platform"; fix was "rounding out their edges and softening the contrast"; sidebar "a few notches dimmer" (tier 2 text, from the team's own blog, not measured CSS).
9. Measured (derived, script `scripts/hairline.mjs`, output `scripts/hairline-output.txt`, Chromium from Playwright 1.56): `border: 0.5px` paints the same as `1px` at DPR 1, 2 and 3 (computed value rounds to 1px). Techniques that paint one device pixel at DPR 2: `transform: scaleY(0.5)` on a 1px element, and `box-shadow: 0 0 0 0.5px`. At DPR 1 both paint a 50% gray 1px line, so they degrade to a lighter line, not to nothing.
10. Framework7 ships "true 0.5px (for iOS Retina) and 0.33px (for iPhone X/Plus) hairlines" using pseudo-elements (tier 4, shipped framework).
11. `devicePixelRatio`: "a value of 2 is expected for HiDPI/Retina displays"; one CSS px is 2 device px per axis there (MDN, inference from definition).
12. Measured hairline colors (`scripts/measure.mjs`): black at 6, 8, 10, 12, 16% on white composites to 1.14, 1.19, 1.25, 1.32, 1.45:1; white at 6 to 16% on `#101214` gives 1.15 to 1.59:1. Interactive edges need 3:1: black about 45% on white (3.36:1), white about 40% on `#101214` (3.84:1). So "hairline" alpha borders are decorative only.

## Conflicting views
- Layered 5-step shadow (Comeau) vs 2-layer (Tailwind). Both ship; 2 layers (contact plus ambient) are cheaper to paint and enough for UI. Opinion: two layers for levels 1 and 2, three for 3 and 4.
- Sub-pixel hairlines: Framework7 uses them on iOS; Chromium rounds `0.5px` borders. Our rule: use solid 1px token borders by default; true hairlines only for dense dividers, behind `(min-resolution: 2dppx)`.

## Claim table
| # | Claim | Quote | URL | Tier | Status |
|---|---|---|---|---|---|
| D1 | One light source | "we should decide on a single light source for all elements on the page" | https://www.joshwcomeau.com/css/designing-shadows/ | 4 | O, widely shared |
| D2 | Same ratio | "every shadow on the page should share the same ratio" | same | 4 | O |
| D3 | Layering | "By layering multiple shadows, we create a bit of the subtlety present in real-life shadows." | same | 4 | O |
| D4 | Black desaturates | "it doesn't just make it darker; it also desaturates it quite a bit" | same | 4 | O |
| D5 | Bigger means higher | "Shadows imply elevation, and bigger shadows imply more elevation." | same | 4 | C |
| D6 | Tailwind sm | "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)" | https://tailwindcss.com/docs/box-shadow | 1 | C |
| D7 | Tailwind lg | "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" | same | 1 | C |
| D8 | Geist tooltip | "Tooltips will be the only floating element with a triangular stem." | https://vercel.com/geist/materials | 2 | C |
| D9 | Geist menu | "material-menu [dash] Lift from page. Radius 12px." (Vercel's em dash replaced with [dash] per house rule) | same | 2 | C |
| D10 | Radix step 6 | "Step 6 is designed for subtle borders on components which are not interactive." | https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale | 1 | C |
| D11 | Radix step 7 | "Step 7 is designed for subtle borders on interactive components." | same | 1 | C |
| D12 | Radix step 8 | "Step 8 is designed for stronger borders on interactive components and focus rings." | same | 1 | C |
| D13 | Radix 3 to 5 | "Step 4 is for hover states." / "Step 5 is for pressed or selected states." | same | 1 | C |
| D14 | Apple elevated brighter | "the elevated colors are brighter, making foreground interfaces appear to advance" | https://developer.apple.com/design/human-interface-guidelines/dark-mode (JSON) | 1 | C |
| D15 | Forced colors shadow | "box-shadow is forced to 'none'" | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors | 1 | C |
| D16 | Linear separators | "they had quietly proliferated across the platform, sometimes appearing without clear reason" | https://linear.app/blog/behind-the-latest-design-refresh | 2 | C (team's own account) |
| D17 | Linear softening | "By rounding out their edges and softening the contrast" | same | 2 | C |
| D18 | Linear sidebar | "it's a few notches dimmer" | same | 2 | C |
| D19 | Framework7 hairlines | "true 0.5px (for iOS Retina) and 0.33px (for iPhone X/Plus) hairlines" | https://v5.framework7.io/docs/hairlines | 4 | C |
| D20 | DPR 2 | "a value of 2 is expected for HiDPI/Retina displays" | https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio | 1 | C |
| D21 | Chromium 0.5px border rounds to 1px; scaleY and spread 0.5px paint 1 device px at DPR 2 | measured | `kb/research/polish/scripts/hairline.mjs` | derived | C (this engine) |
| D22 | Alpha hairline contrast values | measured | `kb/research/polish/scripts/measure.mjs` | derived | C |
