# Research 04: Hierarchy in UI and editorial

Status key: **C** consensus, **X** contested, **O** opinion.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Material 3 organizes type into five roles (display, headline, title, body, label) in three sizes each; labels and small titles use medium weight, body regular. | M3 TypeScaleTokens | C |
| 2 | Apple separates Headline (17pt semibold) from Body (17pt regular): same size, hierarchy by weight. Emphasized variants step up one weight. | Apple HIG | C |
| 3 | Keep weights, sizes and styles consistent to signal hierarchy; add space before headings; compact headings; optimize the most critical use case for skimming; make links, buttons and prices distinct. | Pimp my Type CPR 2026 | O (practitioner) |
| 4 | Use bold or italic as little as possible and never together; all caps fine for under one line with 5 to 12% extra letter spacing; centered text sparingly. | Butterick | O |
| 5 | Glanceable reading: larger is faster; condensed slower; uppercase faster for single words only. | NN/g glanceable fonts | C (one study) |
| 6 | text-wrap: balance for headings and captions (6 lines max in Chromium, 10 in Firefox); pretty for body; widely available since March 2024. | MDN text-wrap | C |
| 7 | WebKit pretty evaluates the whole paragraph (rag, short last lines, fewer hyphens); Chromium adjusts only the last 4 lines. balance can narrow the block; use pretty when text must fill the width beside another element. Do not use balance on long passages. | WebKit blog, Better typography with text-wrap pretty (2025) | C |
| 8 | text-box: trim-both cap alphabetic removes half-leading so text centers optically in buttons and aligns to grids. | MDN text-box-trim | C |
| 9 | Make numeric tables scan vertically with tabular figures. | MDN font-variant-numeric: tabular-nums is "the set of figures where numbers are all of the same size, allowing them to be easily aligned like in tables" (https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric, accessed 2026-10-09). X posts by Lee Robinson, Soren and Wes Bos are leads only: x.com refused the fetch (robots) on 2026-10-09 | C (mechanism, MDN); practitioner posts unverified |
| 10 | WCAG 1.3.1: headings must be real heading elements in a logical order; visual style and semantic level are separate decisions. | WCAG 2.2 Understanding 1.3.1 | C |

## Sources
- https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TypeScaleTokens.kt
- https://developer.apple.com/design/human-interface-guidelines/typography
- https://pimpmytype.com/wp-content/uploads/2026/05/Typography-CPR-Workshop-webexpo-2026.pdf
- https://practicaltypography.com/summary-of-key-rules.html
- https://www.nngroup.com/articles/glanceable-fonts/
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap
- https://webkit.org/blog/16547/better-typography-with-text-wrap-pretty/
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim
- https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships
- https://x.com/leerob/status/1612112318099492866
