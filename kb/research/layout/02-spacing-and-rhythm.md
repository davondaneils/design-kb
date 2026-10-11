# Research 02: Spacing and rhythm

Status key: C = consensus, X = contested, O = opinion.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Carbon spacing scale: 2, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 160. Small steps for component detail, large steps "set the overall density". More surrounding space reads as more important. Space can group without dividers. | [Carbon spacing](https://carbondesignsystem.com/elements/spacing/overview/) | C |
| 2 | Atlassian: 8px base; 0 to 8 for compact internals (icon-to-text, badge, cell padding), 12 to 24 for larger component internals, 32 to 80 for page and layout spacing. Related elements closer, unrelated further. Apply optical adjustments even if they depart from tokens. Negative space tokens for bleed. | [Atlassian spacing](https://atlassian.design/foundations/spacing) | C |
| 3 | 8pt grid: multiples of 8 for dimensions, padding, margin; 4pt baseline for type; hard grid (snap) vs soft grid (measure between elements). Fewer choices speed work and improve consistency. | [spec.fm 8-Point Grid](https://spec.fm/specifics/8-pt-grid) | C (practitioner standard) |
| 4 | Foundation contract: 4px base; scale 0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 as `--space-0` to `--space-11`; layout gaps 16 and up; component padding 4 to 24. | kb/FOUNDATIONS.md | house rule |
| 5 | Refactoring UI: start with too much white space then remove; use a constrained non-linear scale where no two adjacent values are closer than about 25%; "avoid ambiguous spacing": more space around a group than within it. | Wathan and Schoger, Refactoring UI, "Layout and spacing" | O (influential) |
| 6 | Stack: spacing belongs to the parent context (`.stack > * + * { margin-block-start }`), not to individual elements; avoids stray margins on first and last children. | [Every Layout: Stack](https://every-layout.dev/layouts/stack/) | C (practitioner) |
| 7 | Utopia: define a scale at a min viewport (example 320px) and a max viewport (example 1500px), interpolate between them; example type ratios 1.2 to 1.333. Space is generated from the same step system. | [Utopia fluid type scales](https://utopia.fyi/blog/designing-with-fluid-type-scales/) | C (practitioner method) |
| 8 | WCAG 1.4.12 Text Spacing (AA): no loss of content when users set line height 1.5x, paragraph spacing 2x, letter spacing 0.12x, word spacing 0.16x font size. Fixed-height containers that clip fail (F104). | [W3C Understanding 1.4.12](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) | C (standard) |
| 9 | `text-box-trim` with `text-box-edge: cap alphabetic` trims the half-leading above cap height and below the baseline so padding measures to the glyphs. MDN lists Baseline 2026, newly available. | [MDN text-box-trim](https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim) | C (new) |
| 10 | NN/g: proximity "can overpower competing visual cues such as similarity of color or shape"; unrelated controls placed together get overlooked; distant items get missed; groupings change when layouts reflow. | [NN/g Proximity](https://www.nngroup.com/articles/gestalt-proximity/) | C |
| 11 | Nested corner radius: inner radius = outer radius minus padding so curves stay concentric. | Common practitioner rule, widely shared on X by product designers; geometry of concentric arcs | O (geometrically sound) |

## Conflicting views
- 8px base (Atlassian, spec.fm, Carbon mini unit) vs 4px base (Material, foundation). Both agree on 4 as the half step. Foundation wins: 4px base, scale above.
- Carbon and Atlassian include 40 and 80; the foundation scale omits them. Treat 40 and 80 as off-scale; use 32/48 and 64/96.

## Likely to change
- `text-box-trim` support is new; treat as progressive enhancement through 2027.
