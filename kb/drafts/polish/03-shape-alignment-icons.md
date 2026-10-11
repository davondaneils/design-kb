# 03 Shape, optical alignment and icons

Shape consistency is the first thing a trained eye checks and the last thing a generalist thinks about. One radius family, nested radii that share a center, icons drawn at the weight of the words next to them, and edges that line up by eye rather than by bounding box. The geometry rules live in design-layout; this chapter is the audit and the measured numbers.

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **Every radius is a token**: 0, 4, 8, 12, 16 or full (`--radius-none` to `--radius-full`). [judged; lint proposal]
2. **Nested radius = outer radius minus the gap.** A 16px card with 8px padding holds an 8px image; if the result is 4 or less, square the inner corner (design-layout; Apple's concentric shapes compute "radius by subtracting padding from parent"). [judged; lint proposal]
3. **Radius by role, not by whim.** Controls share one radius (`--radius-control`), containers share one (`--radius-card`), and the two relate: controls equal to or smaller than the containers that hold them. [judged]
4. **One icon family per product**: one grid, one stroke width per rendered size, one cap and join style (round or square, not both). [judged]
5. **Icon stroke matches the text weight beside it**, within about 0.25px of the text's stem width (numbers below). [judged; lint proposal]
6. **Icons with meaning** reach 3:1 against their background and have a text alternative or visible label (WCAG 1.4.11, 1.1.1). Decorative icons are `aria-hidden="true"`. [lint for alt, judged for contrast]
7. **One left edge per column.** Icons, labels and headings in a column align to the same x; optical corrections are deliberate and noted. [judged]

### Standards
| Rule | Source |
|---|---|
| Radius scale 0, 4, 8, 12, 16, full | FOUNDATIONS |
| Concentric inner radius = outer minus padding, 0 when padding exceeds radius | Apple WWDC25 design system via WWDC Notes; Nil Coalescing; design-layout |
| Icon grid 24, 2px stroke, round caps and joins, 1px padding, 2px between elements | Lucide icon design guide |
| Symbol weights match text weights; symbol scales set relative to cap height | Apple HIG SF Symbols |

### Decision rules
- **If a control sits within 16px of a screen edge or inside a pill-shaped container**: use `--radius-full` (capsule). Apple uses capsules because they "support concentricity" in any container.
- **If an element is nested two levels** (image in a card in a panel): compute each level. 16 outer, 8 padding gives 8; 8 with 4 padding gives 4, which squares to 0 or stays 4 (choose 4 only if the gap is visible at 1x).
- **If the gap is zero** (image flush to the card edge): the image takes the card's radius on the touching corners only (`border-radius: 12px 12px 0 0`), or the card clips with `overflow: hidden` (cheaper, one source of truth).
- **If the icon set is 24-grid with 2px stroke** (Lucide, Feather, Heroicons outline) and is shown at 16px: it renders 1.33px. That matches Inter 14px at 500 (1.50) or 400 (1.23). At 20px it renders 1.67px, a match for 16px text at 500 (1.72).
- **If the stroke must be exact at any size**: set `vector-effect: non-scaling-stroke` on the paths and give `stroke-width` in CSS px. Then 1.5 means 1.5 on screen at 16, 20 or 24px.
- **If labels are bold (600) next to icons**: raise the stroke (16px text 600 has 2.03px stems: use 2px rendered) or keep labels at 500. Never 1px icons next to bold text.
- **If an icon sits in a button with a label**: padding on the icon side one step smaller than the text side (16 text side, 12 icon side), gap 8. The icon's visual weight fills the missing 4px.
- **If an icon sits next to one line of text**: center it on the cap height, not the line box. With `display: flex; align-items: center` on a 1.5 line-height line, a 16px icon next to 14px text lands about right; next to 20px text, nudge it or use `text-box: trim-both cap alphabetic` where supported (design-typography).
- **If an icon is asymmetric** (play, arrow, chevron): center it by mass; a play triangle shifts right about 1/12 of its width (design-layout opinion), a chevron in a round button moves 1px toward its point.

### Numbers: Inter stem width (measured, `kb/research/polish/scripts/measure.mjs`)
| Weight | Stem as share of size | 12px | 14px | 16px | 20px |
|---|---|---|---|---|---|
| 400 | 0.088 | 1.05 | 1.23 | 1.40 | 1.76 |
| 500 | 0.107 | 1.29 | 1.50 | 1.72 | 2.15 |
| 600 | 0.127 | 1.52 | 1.78 | 2.03 | 2.54 |
| 700 | 0.147 | 1.76 | 2.05 | 2.34 | 2.93 |
Inter Display runs about 5% lighter (400: 0.083, 600: 0.123). Other faces: measure with the script (change the family list).

Rendered stroke of a 24-grid icon = `stroke-width x size / 24`.
| Icon size | stroke-width 1.5 | 1.75 | 2 | 2.5 |
|---|---|---|---|---|
| 16px | 1.00 | 1.17 | 1.33 | 1.67 |
| 20px | 1.25 | 1.46 | 1.67 | 2.08 |
| 24px | 1.50 | 1.75 | 2.00 | 2.50 |

Default pairings (opinion built on the table):
| Text | Icon | Stroke in a 24 grid | Rendered |
|---|---|---|---|
| 12px 500 (badges, deltas) | 12 to 14px | 2.5 at 12px | 1.25 |
| 14px 400 to 500 (UI body, nav) | 16px | 2 | 1.33 |
| 16px 400 to 500 (body, buttons) | 20px | 1.75 to 2 | 1.46 to 1.67 |
| 16px 600 (bold buttons) | 20px | 2.5 | 2.08 |

## Ceiling: exemplar patterns and signature moves

### Exemplar patterns (published text)
- Linear's 2024 redesign spent its effort on "aligning labels, icons, and buttons, both vertically and horizontally in the sidebar and tabs"; the 2026 refresh "reduces icon usage, scales their sizes down". Top teams use fewer, smaller icons, aligned to the pixel.
- Apple pairs each of nine SF Symbol weights with a San Francisco text weight and sizes symbols from the cap height, so icon and word read as one line of type.
- Vercel Geist ties radius to material: 6px small surfaces, 12px raised, 16px fullscreen.

### Signature moves
1. **The radius census.** List every radius in the CSS. More than four distinct values (plus full) is a smell; any value off the family (6, 10, 14, 20) is a bug unless it is a computed nested radius. Generalists pick a radius per component; experts pick a family and derive.
2. **Measure the stem, then set the stroke.** Icon weight is a number you can compute from the font (table above), not a vibe. Most "this looks off" icon complaints are a 2px stroke beside 400-weight 14px text (rendered 2px vs 1.23px stems: the icons shout).
3. **Non-scaling strokes** for icons reused at several sizes: one SVG, one CSS stroke width per role.
4. **Round caps everywhere or nowhere.** Mixed caps (a round-capped check beside a butt-capped hamburger) is the most common icon inconsistency in hand-built pages.
5. **Pixel-snapped strokes at 1x.** A 1px horizontal SVG line at an integer y straddles two device pixels and renders as a 2px gray smear on 1x screens. Put 1px lines on half pixels (`y = 40.5`) or set `shape-rendering: crispEdges` on gridlines and dividers drawn in SVG.
6. **Capsules near edges, concentric inside.** Pill buttons for edge-adjacent controls; computed radii for anything nested.
7. **Tabular figures and fixed-width slots** wherever numbers sit in a column or change (design-typography F14), so the right edge of a number column is a straight line.

### Do and don't
- Do derive: card 12, padding 8, inner 4. Don't give the inner thumbnail 12 too (it looks pinched at the corners).
- Do `stroke-linecap: round; stroke-linejoin: round` on every icon. Don't mix.
- Do match a 1.33px icon stroke to 14px medium labels. Don't put 2px-rendered icons next to 14px regular text.
- Do shift a play glyph right by mass. Don't trust the bounding box.

### Worked example
**Dashboard sidebar.** Text 14px. Labels were 400 (1.23px stems) beside 16px icons drawn on a 16 grid at 1.5 stroke (1.5px rendered): icons a quarter pixel heavy, and the selected item at 600 (1.78px) a quarter light. Fix: labels to 500 (1.50px), icons stay 1.5px, round caps and joins on all. Selected weight 600 keeps the non-color cue; the icon is within 0.3px. Nav item radius 8 inside a 12px sidebar padding: not nested in a visible container, so radius 8 = `--radius-control`.

### Hand-offs
- Grid, edges and optical alignment theory: design-layout `references/01-grids-and-structure.md`, `02-spacing-and-rhythm.md`.
- Drawing icons and illustration: design-graphic.
- Numerals, `text-box`, OpenType: design-typography `references/05-typographic-detail.md`.

## Sources
Lucide icon design guide; Apple HIG SF Symbols; WWDC Notes for WWDC25 session 356; Nil Coalescing, Corner concentricity in SwiftUI; Linear blog 2024 and 2026; Vercel Geist; measured Inter stems in `kb/research/polish/scripts/`. Quotes: `kb/research/polish/03-shape-alignment-icons.md`.
