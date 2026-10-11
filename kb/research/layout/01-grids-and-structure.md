# Research 01: Grids and structure

Status key: C = consensus, X = contested, O = one expert's or practitioner opinion.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | IBM Carbon 2x Grid: sm 320px 4 cols, md 672px 8 cols, lg 1056px 16 cols, xlg 1312px 16 cols, max 1584px 16 cols. 16px padding each side of a column gives 32px gutters. Base geometry is an 8px "mini unit". Gutterless grids are allowed for closely related content. | [Carbon 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/) | C (one system's spec) |
| 2 | Material window size classes (width): compact under 600dp, medium 600 to 839, expanded 840 to 1199, large 1200 to 1599, extra-large 1600 and up. Height: compact under 480dp (99.78% of phones in landscape), medium 480 to 899, expanded 900 and up. Classes describe the window, not the device. | [Android: use window size classes](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes) | C |
| 3 | Material codelab examples: feed secondary cards with 24dp spacing, 16dp pane padding, 60 character max line length for body text. Canonical layouts: feed, list-detail, supporting pane. Bottom bar on compact, navigation rail on medium and expanded. Commonly cited margins 16dp compact, 24dp medium and up (codelab notes this as general knowledge, not stated). | [Material adaptive codelab](https://developer.android.com/codelabs/adaptive-material-guidance) | C for patterns, X for exact margins (unverified on page) |
| 4 | Apple HIG: place the most important items near the top and leading side; align to make scanning easier; indentation conveys subordination; group with negative space, containers or separators; respect safe areas and system margins; support Dynamic Type by stacking horizontally adjacent views and letting rows grow. | [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) | C |
| 5 | Measure axiom: "the measure should never exceed 60ch"; 45 to 75 characters is a reasonable range; use `ch` so measure scales with font size. Fixed widths and heights are "anathema to responsive design"; use tolerances such as `max-inline-size`. | [Every Layout: Axioms](https://every-layout.dev/rudiments/axioms/) | C (measure), O (60ch cap) |
| 6 | Line length 45 to 90 characters including spaces. | [Butterick, Practical Typography](https://practicaltypography.com/line-length.html) | C |
| 7 | Bringhurst: 45 to 75 characters is satisfactory for single-column text, 66 is widely regarded as ideal. Foundation contract adopts 45 to 75, 66 ideal. | Bringhurst, The Elements of Typographic Style, 2.1.2 | C |
| 8 | Full-bleed pattern: `grid-template-columns: 1fr min(42rem, 100%) 1fr`, children in column 2, full-bleed items span `1 / -1`. | [Josh Comeau, Full-bleed layout](https://www.joshwcomeau.com/css/full-bleed/) | C (practitioner, widely adopted) |
| 9 | Subgrid lets nested grids inherit parent tracks so card headers, bodies and footers align across siblings. Baseline widely available since September 2023. | [MDN Subgrid](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout/Subgrid) | C |
| 10 | Sidebar layout: sidebar `flex-basis: 20rem`, content `flex-basis: 0; flex-grow: 999; min-inline-size: 50%`, wraps when content would be 50% or less of the container. No media query; responds to the container. | [Every Layout: Sidebar](https://every-layout.dev/layouts/sidebar/) | C |
| 11 | Muller-Brockmann: the grid is a means to order, objectivity and rhythm; columns, gutters and modules derived from the type (line height) so text and images share one system. | Josef Muller-Brockmann, Grid Systems in Graphic Design (1981) | C (canonical) |
| 12 | Refactoring UI: "grids are overrated"; give sidebars a fixed width and let content flex; do not make every element fluid; max-width elements that should not grow. | Wathan and Schoger, Refactoring UI (2018), "Layout and spacing" chapter | O (influential practitioners) |
| 13 | Optical corrections: circles and triangles need to be slightly larger than squares to look equal; play icons centered by mass not bounding box; button labels centered on cap height. | [Design Bridges, Optical effects](https://medium.com/design-bridges/optical-effects-9fca82b4cd9a) | C (long typographic tradition), numbers O |
| 14 | Linear redesign: aligned labels, icons and buttons "both vertically and horizontally in the sidebar and tabs"; "inverted L" global chrome frames the main view; consistent view structure (header for filters, side panel for properties). | [Linear: How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui) | O (top product studio practice) |

## Conflicting views
- 12-column grid everywhere (bootstrap tradition) vs intrinsic and fixed-plus-fluid layouts (Every Layout, Refactoring UI). Resolution adopted: column grid for editorial and marketing composition, intrinsic algorithms for components, fixed-plus-fluid shells for apps.
- Measure cap: 60ch (Every Layout), 60 chars (Material), 66 ideal (Bringhurst, foundation). Foundation wins as default.

## Likely to change
- Material 3 large and extra-large classes are recent additions (opt-in flag in Compose). CSS `reading-flow` is experimental.
