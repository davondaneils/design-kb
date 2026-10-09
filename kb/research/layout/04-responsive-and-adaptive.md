# Research 04: Responsive and adaptive layout

Status key: C = consensus, X = contested, O = opinion.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | WCAG 1.4.10 Reflow (AA): no loss of content or function and no 2D scrolling at 320 CSS px wide (1280px at 400% zoom), or 256 CSS px tall for horizontal scrolling content. Exceptions: maps, diagrams, video, games, data tables as a whole, editing toolbars. Headings, search fields and pagination around a table must still reflow. Advisory C34: un-fix sticky headers and footers with media queries. | [W3C 1.4.10](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) | C |
| 2 | WCAG 2.5.8 Target Size Minimum (AA): 24 by 24 CSS px, or spacing such that a 24px circle centered on each small target does not hit another target. Exceptions: equivalent control, inline text, user agent default, essential. | [W3C 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) | C |
| 3 | WCAG 2.4.11 Focus Not Obscured (AA): focused component not entirely hidden by author content such as sticky headers, footers, cookie banners. Fix with `scroll-padding` (C43). F110 is the failure. | [W3C 2.4.11](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) | C |
| 4 | Apple HIG: hit region at least 44x44 pt (60x60 pt in visionOS); button sizes mini 28, small 32, regular 44, large 52, extra large 64 pt. Support Dynamic Type: horizontally adjacent views may need to stack, rows grow. | [HIG Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) | C |
| 5 | Material window size classes as in research 01, plus: width is usually the more useful class; a landscape phone can be medium width but compact height, where two panes are impractical. | [Android window size classes](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes) | C |
| 6 | Container queries: style components from the size of their container (`container-type: inline-size`), units `cqi` etc. Use for reusable components; media queries for the viewport. | [MDN Container queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries) | C |
| 7 | Intrinsic layout: let the browser compute layout from tolerances (`min()`, `minmax()`, `flex-basis`, `ch`) rather than fixed widths. | [Every Layout: Axioms](https://every-layout.dev/rudiments/axioms/), [Sidebar](https://every-layout.dev/layouts/sidebar/) | C (practitioner) |
| 8 | Groupings change on reflow: two related links side by side on desktop can end up far apart when stacked. | [NN/g Proximity](https://www.nngroup.com/articles/gestalt-proximity/) | C |
| 9 | Foundation breakpoints: sm 640, md 768, lg 1024, xl 1280, 2xl 1536, mobile first min-width; prefer container queries for components. | kb/FOUNDATIONS.md | house rule |
| 10 | Pricing tables on mobile: avoid horizontal scrolling "at all costs"; stack plans as cards or use sticky plan tabs; let users pick two plans to compare. | [Smashing, Designing better pricing pages](https://smashingmagazine.com/2022/07/designing-better-pricing-page) | C (practitioner research synthesis) |

## Conflicting views
- Device breakpoints vs content-out breakpoints. Foundation fixes the device-class set for the page shell; components follow content via container queries. This is a split of responsibility, not a conflict.
- Material classes (600, 840, 1200, 1600) do not match the web foundation set. Material is a cross-check for app navigation decisions only.
