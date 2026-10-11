# Icon systems

Sources: research/graphic/02-icon-systems.md (I-numbers). Opinion is marked (opinion).

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
- **Pixel clean at 1x:** strokes land on the pixel grid at the primary size [I1].
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

## Size pairing with text (foundation type scale)
| Text token | Text size | Icon size token | Icon size | Gap to label |
|---|---|---|---|---|
| `--text-xs` / `--text-sm` | 12 / 14 | `--size-icon-sm` | 16 | 4 |
| `--text-base` | 16 | `--size-icon-md` | 20 | 8 |
| `--text-lg` | 20 | `--size-icon-lg` | 24 | 8 |
| standalone, toolbar | n/a | `--size-icon-lg` | 24 | n/a |
| feature or empty state | n/a | `--size-icon-xl` | 32 or 48 | n/a |
Rule: the icon is about 1.25 times the text size, and never taller than the line height (16 x 1.5 = 24). Icon sizes and gaps sit on the 4 px scale. Token names follow the `--{category}-{role}-{variant}` contract. (pairing ratio is opinion)

## Decision rules
- **Library vs custom.** If the product is not icon-led and the brand is not distinctive through iconography, use a mature library (Lucide, Phosphor, Material Symbols, SF Symbols on Apple platforms). Go custom only when you can draw at least the full needed set plus 20 percent headroom in one style, or when the brand needs owned metaphors. (opinion)
- **Extending a library.** Draw new icons on that library's grid with its exact stroke, caps and radius; blur-compare against 3 existing icons before shipping [I1].
- **Outline vs filled.** Default outline in navigation and toolbars; filled for the selected state of the same icon (tab bars), and for 16 px use where outlines fill in (platform practice; opinion as a rule).
- **Stroke at small sizes.** If you scale a 24 px, 2 px stroke icon down to 16 px, the stroke becomes 1.33 px and blurs. Either draw a 16 px variant with 1.5 px stroke on a 16 grid, or keep absolute stroke width (Lucide offers an absoluteStrokeWidth option) and simplify detail. (derived arithmetic; opinion on fix)
- **Metaphor choice.** If you cannot think of an icon in 5 seconds, use a text label instead [I6]. Test new metaphors: show the icon alone and ask what it does; then check recall a couple of weeks later [I6].
- **Directional icons** (arrows, chevrons, send, undo) mirror in right-to-left layouts; clocks, media play and checkmarks do not. (opinion, platform convention)

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
1. Product personality is sporty and bold: round caps, 2 px stroke on 24 grid, but text is 14 and 16 px so navigation uses 20 px icons with 1.75 px stroke drawn on a 20 grid (opinion: scaling stroke by size keeps optical weight).
2. Hard icons first: trade, waiver, standings, live game, injury. Metaphor table: "trade" = two opposing arrows (universal exchange) not a handshake.
3. Selected tab state = filled glyph plus `--color-primary`; unselected = outline in `--color-text-muted` (3:1 checked against `--color-bg`).
4. Ship as SVG components using currentColor; labels under tab icons at `--text-xs` (12 px).

### B. App icon for a wordmark-only brand
1. Wordmark is 9 letters: unusable at 60 pt. Take the first letter, redraw it heavier, add the brand's one quirk.
2. iOS: background layer = brand color gradient set in Icon Composer, foreground = letter as SVG; check Mono has a near-white element. Android: same letter at 60 dp inside the 66 dp safe zone, monochrome layer from the letter.

## Hand-offs
- design-ux: when icons need labels in navigation patterns.
- design-frontend: SVG component delivery, sprite vs inline, RTL mirroring.
- design-color: icon colors via semantic roles and contrast.
- design-motion: animated icons and state transitions.
