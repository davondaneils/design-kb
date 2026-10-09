# Research: 03 Shape, optical alignment, icons

Accessed 2026-10-09. Tiers and status as in 01.

## Key findings
1. Concentric corners: "rounded corners where the curved portions of the inner and outer shapes share the same center"; inner radius derived from container radius minus the distance between them; if the distance exceeds the container radius the inner radius becomes 0 (Nil Coalescing on SwiftUI ConcentricRectangle, tier 4, citing WWDC25). design-layout already states the rule (inner = outer minus padding, square at 4 or less).
2. WWDC25 "Get to know the new design system" notes: concentric shape radius "Calculated radius by subtracting padding from parent"; "Capsule is used a lot in system, because it supports concentricity"; "Check corner radii that feel off" (WWDC Notes community summary, tier 4; the Apple video itself was not fetched as text).
3. SF Symbols: nine weights each correspond to a San Francisco weight, for "precise weight matching between symbols and adjacent text"; three scales "defined relative to the cap height"; negative side margins aid "optical horizontal alignment" (Apple HIG, tier 1).
4. Lucide (the most used open icon set): 24 by 24 canvas, at least 1px padding, 2px stroke, round caps and joins, 2px spacing between elements, corner radius 2px on shapes 8px or larger, 1px under 8px (tier 1 for the set's own spec).
5. Measured (derived, `scripts/measure.mjs`): Inter stem width as a share of font size: 400 0.088, 500 0.107, 600 0.127, 700 0.147. Inter Display: 400 0.083, 500 0.103, 600 0.123, 700 0.144. So at 14px: 400 = 1.23px, 500 = 1.50px, 600 = 1.78px; at 16px: 400 = 1.40, 500 = 1.72, 600 = 2.03.
6. A 24px Lucide icon (2px stroke) shown at 16px renders a 1.33px stroke, at 20px 1.67px. So the common "Lucide at 16px next to 14px text" pairs a 1.33px stroke with 1.23px (400) or 1.50px (500) stems: a near match. Scaling a 24px icon to 16px with `stroke-width: 1.5` in the 24 grid renders 1px, which looks thinner than any Inter weight at 14px. Derived arithmetic.
7. Linear 2024 redesign: "aligning labels, icons, and buttons, both vertically and horizontally in the sidebar and tabs"; 2026 refresh "reduces icon usage, scales their sizes down" (team blog, tier 2 text).
8. design-layout `01` covers optical alignment rules (play triangle, circle vs square 5 to 10 percent, icon to cap height, hanging punctuation); polish adds measurement and the per-component recipe, not new theory.

## Claim table
| # | Claim | Quote | URL | Tier | Status |
|---|---|---|---|---|---|
| R1 | Concentric definition | "rounded corners where the curved portions of the inner and outer shapes share the same center" | https://nilcoalescing.com/blog/ConcentricRectangleInSwiftUI | 4 | C |
| R2 | Radius minus padding | "Calculated radius by subtracting padding from parent" | https://wwdcnotes.com/documentation/wwdc25-356-get-to-know-the-new-design-system/ | 4 | C |
| R3 | Capsule | "Capsule is used a lot in system, because it supports concentricity" | same | 4 | C |
| R4 | SF weight matching | "helping you achieve precise weight matching between symbols and adjacent text" | https://developer.apple.com/design/human-interface-guidelines/sf-symbols (JSON) | 1 | C |
| R5 | SF scales cap height | "The scales are defined relative to the cap height of the San Francisco system font." | same | 1 | C |
| R6 | SF optical margins | "negative side margins to aid optical horizontal alignment" | same | 1 | C |
| R7 | Lucide stroke | "Icons must have a stroke width of 2 pixels." | https://lucide.dev/guide/design/icon-design-guide | 1 (for Lucide) | C |
| R8 | Lucide canvas | "Icons must be designed on a 24 by 24 pixels canvas." | same | 1 | C |
| R9 | Lucide caps | "Icons must use round caps." | same | 1 | C |
| R10 | Lucide spacing | "Distinct elements must have 2 pixels of spacing between each other" | same | 1 | C |
| R11 | Linear alignment | "aligning labels, icons, and buttons, both vertically and horizontally in the sidebar and tabs" | https://linear.app/now/how-we-redesigned-the-linear-ui | 2 | C |
| R12 | Linear fewer icons | "The refresh reduces icon usage, scales their sizes down" | https://linear.app/blog/behind-the-latest-design-refresh | 2 | C |
| R13 | Inter stem ratios | measured | `kb/research/polish/scripts/measure.mjs`, output in `measure-output.txt` | derived | C |
| R14 | Linear Inter Display | "We started using Inter Display to add more expression to our headings while maintaining their readability" | https://linear.app/now/how-we-redesigned-the-linear-ui | 2 | C |
| R15 | A 1px SVG line at integer y renders as two 50% gray device rows at DPR 1; at y + 0.5 or with `shape-rendering: crispEdges` it renders one black row; at DPR 2 all three render two black rows | measured | `kb/research/polish/scripts/svg-line.mjs`, output in `svg-line-output.txt` | derived | C (Chromium) |
