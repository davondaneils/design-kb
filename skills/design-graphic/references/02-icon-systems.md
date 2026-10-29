# Icon systems

Sources: research/graphic/02-icon-systems.md (I-numbers) and 07-marks-icons-rendered.md (G and M numbers). Stem widths: design-polish 03. Opinion is marked (opinion).

## Principles
1. **Icons are vocabulary, not decoration.** Only a few are universal (home, print, search); the rest need labels [I6].
2. **A set is consistent or it is broken.** One grid, one stroke, one corner, one cap style, one level of detail across every icon [I1][I2].
3. **Optical sameness beats numerical sameness.** Icons should share optical volume and visual center, judged by blur tests against a circle and square [I1].
4. **Size changes the drawing.** Strokes and detail must adapt to render size; that is why Material Symbols ships an optical size axis from 20 to 48 [I5].

## Fundamentals gate
- **Labels:** every icon that triggers an action has a visible text label unless it is one of the universal few or a standard control with an accessible name (close, search, menu) in a familiar position [I6]. Hover-only tooltips do not count on touch [I6].
- **Contrast:** icons that convey meaning without a text equivalent meet **3:1** against adjacent colors (WCAG 1.4.11) [I7].
- **Targets:** interactive icons have a hit area of at least **24x24 CSS px**, 44x44 preferred for touch, even when the glyph is 16 or 20 px.
- **Accessible name:** icon-only buttons have an accessible name; decorative icons beside text are `aria-hidden="true"` (see 06).
- **One set:** never mix libraries in one interface.
- **Pixel clean:** straight stems land on device pixels at the primary size and density (placement table below) [I1][M1].
- **No hard-coded colors:** shapes use `currentColor` and CSS; nothing white or black inside a status icon. `assets/icon_audit.mjs` fails the set otherwise [M2].
- **Not color alone:** state changes (selected, error) are carried by shape or fill as well as color.

## Default spec (use unless a brand reason overrides)
| Property | Default | Source |
|---|---|---|
| Canvas | 24 x 24 | [I1][I2] |
| Live area | 20 x 20 (2 px padding); 1 px minimum padding for overshooting shapes | [I2][I1] |
| Stroke | 2 px, centered | [I1][I2] |
| Caps and joins | Round (friendly) or square and miter (technical); pick one | [I1] |
| Corner radius on shapes | 2 px for shapes 8 px or larger, 1 px below | [I1] |
| Gap between parts | 2 px minimum | [I1] |
| Keyline shapes | Circle 20 diameter, square 18, portrait 16x20, landscape 20x16 | Material keylines [I2] |
| Color | `currentColor`, inheriting `--color-text` or `--color-text-muted` | foundation contract |
| Delivery | SVG components or a sprite; viewBox `0 0 24 24`; paths at 2 decimals | [I1] |

## Size, grid and stroke paired with text
| Text | Icon box, drawn on | Stroke (Inter stems, design-polish 03) | Gap to label |
|---|---|---|---|
| `--text-xs` 12px, 500 / 600 | 12, 12 grid | 1.25 / 1.5px | 4 |
| `--text-sm` 14px, 500 / 600 | 16, 16 grid | 1.5 / 1.75px | 8 inline, 12 in nav rows |
| `--text-base` 16px, 400 to 500 | 20, 20 grid | 1.5 to 1.75px | 8 |
| `--text-lg` 20px, or a standalone toolbar | 24, 24 grid | 2px | 8 |
| Feature or empty state | 32 or 48 | design-art-direction line weight | n/a |
Rules: the icon is about 1.15 to 1.25 times the text size and never taller than the line height (14 x 1.5 = 21). Sizes and gaps sit on the spacing scale. Icon sizes are plain px here: FOUNDATIONS has no icon size token yet (proposal in `kb/reviews/design-graphic-pipeline-notes.md`). Labels at 400 beside 1.5px icons are a quarter pixel light: move UI labels to 500 or drop the stroke to 1.25 (design-polish 03). (pairing is opinion built on measured stems)

## Where strokes land (measured)
A straight stem is crisp when both edges, centre plus and minus half the stroke, fall on device-pixel boundaries. Measured in Chromium (`kb/research/graphic/scripts/stroke-snap.mjs`) [M1]:
| Stroke | Centre on .0 | .25 or .75 | .5 |
|---|---|---|---|
| 1px | soft at 1x, crisp at 2x | soft | crisp at 1x and 2x |
| 1.5px | 2 soft columns at 1x and 2x | crisp at 2x, 1 soft column at 1x | 2 soft columns |
| 2px | crisp at 1x and 2x | soft | soft at 1x, crisp at 2x |
So a 16-grid set at 1.5px puts every straight stem on .25 or .75 (`M2.25 8h11.5`, a rect at `x="2.25" width="4"`). Diagonals and curves always antialias; budget for that. A 24-grid icon shown at 16px lands on 0.67px steps and no stem is crisp at any density: draw the small grid.

## Decision rules
- **Library vs custom.** If the product is not icon-led and the brand is not distinctive through iconography, use a mature library (Lucide, Phosphor, Material Symbols, SF Symbols on Apple platforms). Go custom only when you can draw at least the full needed set plus 20 percent headroom in one style, or when the brand needs owned metaphors. (opinion)
- **Extending a library.** Draw new icons on that library's grid with its exact stroke, caps and radius; blur-compare against 3 existing icons before shipping [I1].
- **Outline vs filled.** Default outline in navigation and toolbars; filled for the selected state of the same icon (tab bars), and for 16 px use where outlines fill in (platform practice; opinion as a rule).
- **Stroke at small sizes.** If you scale a 24 px, 2 px stroke icon down to 16 px, the stroke becomes 1.33 px and blurs. Either draw 16 and 20 px variants on their own grids with 1.5 px strokes, or keep absolute stroke width (Lucide offers an absoluteStrokeWidth option) and simplify detail. A 1.5 px stroke is 3 device pixels on 2x screens and renders crisp only when its straight stems sit on .25 or .75 (measured, table below); if the product targets 1x desktop screens, use 1px on .5 or 2px on whole pixels instead. (measured [M1]; opinion on the fix)
- **Metaphor choice.** If you cannot think of an icon in 5 seconds, use a text label instead [I6]. Test new metaphors: show the icon alone and ask what it does; then check recall a couple of weeks later [I6].
- **Borrowed UI meanings.** Look at a new pictogram at its real size beside its label and name what else it could be. Boxes and dots carry interface meanings: small squares on a shape's corners read as selection handles or anchor points, and dots joined by lines read as a network graph. On a Stand Firm results page a fort plan with corner towers read both ways; one square cut into four mitred walls, the named wall in the accent, read as walls. (opinion, one job)
- **Directional icons** (arrows, chevrons, send, undo) mirror in right-to-left layouts; clocks, media play and checkmarks do not. (opinion, platform convention)

## Building a product icon set (code)
- **One source module.** Each icon defined once (shapes only, no stroke-width, no colors), expanded inline at build (`{{i:name}}`). Inline beats a `<use>` sprite while you rely on DOM checks: sprite shapes sit in a shadow tree that `tools/lint.mjs` and `icon_audit.mjs` cannot read [M2].
- **One CSS rule draws the whole set:** `.i { fill: none; stroke: currentColor; stroke-width: var(--icon-stroke, 1.5px); stroke-linecap: round; stroke-linejoin: round }` and `.i .solid { fill: currentColor; stroke: none }`.
- **Stroke follows label weight per state:** set `--icon-stroke` where font-weight is set (`.nav a[aria-current] { font-weight: 600; --icon-stroke: 1.75px }`, sortable header 500 at 1.25px and 600 at 1.5px).
- **Status icons are solid with the mark knocked out**: one evenodd path, e.g. a circle plus an exclamation bar and dot as inner subpaths. One color, mass at 16px, both themes and forced colors work, nothing hard-coded.
- **Brand mark** (the product logo in the shell) may sit one weight step above the UI set (1.75 vs 1.5px) on its own field.
- **Audit**: `node skills/design-graphic/assets/icon_audit.mjs page.html` must exit 0; read every "volume" flag (ink share more than 35 percent off the median for that size) and decide.

## App icons and favicons are derivations
- Never shrink the full lockup into an app icon. Use the symbol or monogram, larger, centered, on a brand color field. (opinion grounded in [I8][I10])
- **iOS (2025+ Icon Composer):** 1024x1024 master; flat opaque layers (background plus 1 to 3 foreground groups, up to 4 groups); no baked rounded mask; text outlined; check Default, Dark and Mono (Clear, Tinted) appearances; Mono needs at least one nearly white element [I8].
- **Android adaptive:** 108x108 dp layers; keep the logo 48 to 66 dp inside the 66 dp safe zone; supply a monochrome layer for themed icons [I10].
- **Favicon:** use the Tier 4 small version of the mark (see 01) in SVG with a dark mode media query; full file set in 06 [I11].

## Expert moves
- **Blur and squint review of the whole set at once,** at 1x on a low DPI screen, in light and dark. Outliers in weight jump out immediately [I1].
- **Keylines prevent the classic error:** a circle icon and a square icon drawn to the same 20 px bounding box look different sizes; use circle 20, square 18 [I2].
- **Match icon weight to text weight.** A 2 px stroke at 24 px matches regular to medium text at 16; with light or thin brand type, switch to 1.5 px strokes across the set rather than letting icons shout. (opinion)
- **Design the hard icons first:** settings, filter, sync, share, analytics. They define how much detail the set allows. (opinion)
- **Write a metaphor table:** each concept, its chosen metaphor, rejected alternatives and why. It stops drift when the set grows. (opinion)
- **Draw the small grid; never trust a 24 library at 16.** Lucide's own rule is a 2px stroke on its 24 canvas, aiming to be "pixel perfect so that they will be sharp on low DPI displays" [G8]. That promise holds at 24px only [M1].
- **The lint is not an icon review.** On the combined Tally page `tools/lint.mjs` and the polish audit both passed a set with round and butt caps, round and miter joins, and `#ffffff` and `#000000` inside status icons; `icon_audit.mjs` failed it [M2].
- **Avoid icons that encode old objects nobody uses unless universal** (floppy save is fine because it is learned; a clock for "history" was never clicked in NN/g testing [I6]).

## Do and don't
| Do | Don't |
|---|---|
| Label icons in navigation | Rely on tooltips |
| `fill="none" stroke="currentColor"` | Hard-coded hex colors in SVG |
| 44x44 touch target around a 24 glyph | 24 glyph with 24 hit area on mobile |
| Draw a 16 px variant | Scale 24 to 16 and accept blur |
| One library | Material icons beside Font Awesome |

## Worked examples

### A. Hockey pool app, 30 custom icons beside 14 and 16 px text
1. Product personality is sporty and bold: round caps, 2 px stroke on a 24 grid for toolbars. Text is 14 and 16 px, so the tab bar uses 20 px icons drawn on a 20 grid with 1.5 px strokes (a phone app, so 2x and 3x screens keep them crisp), and inline icons beside 14 px text are 16 px variants with 1.5 px strokes. (opinion: scaling stroke with size keeps optical weight)
2. Hard icons first: trade, waiver, standings, live game, injury. Metaphor table: "trade" = two opposing arrows (universal exchange) not a handshake.
3. Selected tab state = filled glyph plus `--color-primary`; unselected = outline in `--color-text-muted` (3:1 checked against `--color-bg`).
4. Ship as SVG components using currentColor; labels under tab icons at `--text-xs` (12 px).

### B. App icon for a wordmark-only brand
1. Wordmark is 9 letters: unusable at 60 pt. Take the first letter, redraw it heavier, add the brand's one quirk.
2. iOS: background layer = brand color gradient set in Icon Composer, foreground = letter as SVG; check Mono has a near-white element. Android: same letter at 60 dp inside the 66 dp safe zone, monochrome layer from the letter.

### C. Tally analytics, rendered (wave 2 test, `kb/tests/design-graphic/icons.mjs`)
1. Labels are Inter 14px; moved from 400 to 500 so a 1.5px stroke matches the 1.50px stem; selected nav 600 with 1.75px; sort headers 12px on a 12 grid at 1.25 and 1.5px.
2. 16 icons on a 16 grid plus 2 arrows on a 12 grid and the tally brand mark: overview tiles, activity trace, funnel, return arrow, person, 6-tooth gear (the most a 16px gear survives, opinion), command key, keyboard, menu, search, calendar, plus, close, lock, more, solid error and warning.
3. Metaphor table in the module header (funnels: outline, rejected stepped bars which read as "align center"; retention: return arrow, rejected calendar which is the date picker).
4. Result: audit 0 fails (before: mixed caps and joins, 3 hard-coded colors, 3 icons touching the box edge); partial pixels at 2x fell from 39 to 51 percent of ink to 10 to 42 percent.

## Hand-offs
- design-ux: when icons need labels in navigation patterns.
- design-frontend: SVG component delivery, sprite vs inline, RTL mirroring.
- design-color: icon colors via semantic roles and contrast.
- design-motion: animated icons and state transitions.

## Sources
- [I1] Lucide icon design guide: https://lucide.dev/guide/design/icon-design-guide
- [I2] Material Design system icons: https://material.io/design/iconography/system-icons.html
- [I5] Material Symbols axes: https://9to5google.com/2022/04/21/google-fonts-material-symbols/
- [I6] NN/g, Icon Usability: https://www.nngroup.com/articles/icon-usability/
- [I7] W3C, Understanding 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- [I8] WWDC25 session 361, Create icons with Icon Composer: https://developer.apple.com/videos/play/wwdc2025/361 (notes: https://wwdcnotes.com/documentation/wwdc25-361-create-icons-with-icon-composer/)
- [I10] Android adaptive icons: https://developer.android.com/develop/ui/views/launch/icon_design_adaptive
- [G8] Lucide icon design guide (stroke, pixel perfect): https://lucide.dev/guide/design/icon-design-guide
- [M1][M2] Measured, `kb/research/graphic/07-marks-icons-rendered.md`
- [I11] Evil Martians, How to Favicon: https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
