# Research 03: Web font loading, variable fonts, licensing

Status key: **C** consensus, **X** contested, **O** opinion.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | font-display periods: block 2 to 3s block / infinite swap; swap 0ms / infinite; fallback 100ms / 3s; optional 100ms / none. Chromium and Firefox block up to 3s by default; Safari blocks indefinitely. optional is best for performance; swap only if the font arrives early; you can mix swap for brand and optional for body. | web.dev Font best practices (updated 2022-10-04) | C |
| 2 | Preconnect to third-party font origins (with crossorigin for the file host). Preload sparingly: it ignores unicode-range and competes with other resources. Inline @font-face in the head rather than relying on preload. | web.dev | C |
| 3 | WOFF2 compresses about 30% better than WOFF; serve WOFF2 only. | web.dev | C |
| 4 | Self-hosting is not automatically faster; it loses the provider's per-script subsetting unless you subset yourself. Check the license before subsetting or self-hosting. | web.dev | C |
| 5 | size-adjust (Baseline widely available since September 2023) scales a fallback font to match the web font; combine with ascent-override, descent-override, line-gap-override to reduce layout shift. | MDN size-adjust | C |
| 6 | font-size-adjust (Baseline 2024) normalizes x-height (or cap-height, ch-width) across fonts; `from-font` reads the first font's ratio. | MDN font-size-adjust | C |
| 7 | Registered axes: wght (font-weight), wdth (font-stretch %), slnt (font-style oblique, sign inverted), ital, opsz (font-optical-sizing). Prefer the standard properties; font-variation-settings must redeclare every axis (use custom properties); custom axes are uppercase (GRAD). @font-face ranges: `font-weight: 100 900`. | MDN Variable fonts guide | C |
| 8 | font-optical-sizing: auto sets opsz from the used size. Browsers map opsz to CSS px while opsz was specified in points; a 12pt document gets opsz 16 in Safari. Spec discussion unresolved. | MDN; CSSWG issue #4430 thread (arrowtype, litherum, Crossland) | X |
| 9 | Variable fonts on about 33% of sites (92% via Google Fonts); WOFF2 on about 80%; font-display swap about 44%, optional under 1%; font preload on 11% of pages; 34% of mobile sites self-host exclusively. | Web Almanac 2024 Fonts | C (data) |
| 10 | OFL: commercial use allowed; web use via @font-face is fine and is not "embedding"; the font cannot be sold by itself; subsetting a webfont counts as modification, and modified versions normally cannot use Reserved Font Names unless functionally equivalent. | OFL FAQ (openfontlicense.org) sections 1.1, 1.5, 2.1, 2.6, 2.7, 2.10 | C |
| 11 | Commercial license types: desktop (metered by seats), web (pageviews or visitors), app (installs), ePub (titles), broadcast, digital ads and social (impressions or followers), logotype, corporate. EULAs are fragmented; check each use. | Alphabettes, "Font licensing mess" (survey of 171 entries) | C |
| 12 | Icon fonts handle loading strategies poorly; replace them with SVG. | web.dev | C |
| 13 | Apple's SF Pro license permits use only for mockups of interfaces for Apple platforms; on the web use `system-ui` to get SF on Apple devices. | Apple Fonts page and license | C (read the license for edge cases) |
| 14 | The grade axis (GRAD) changes stroke weight without changing width, so text does not reflow; useful on dark backgrounds and for interaction states. | Google Fonts Knowledge glossary, Grade axis; MDN example uses GRAD | C |

## Conflicting views
- Self-host vs Google Fonts CDN: browser cache partitioning removed the cross-site cache benefit, yet web.dev reports third-party fonts often render fast. Decide by measurement.
- swap vs optional: swap is most used, optional is best for CLS. Resolution in the draft: swap plus a metric-matched fallback by default, optional for body on performance-critical pages.

## Sources
- https://web.dev/articles/font-best-practices
- https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-size-adjust
- https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Fonts/Variable_fonts
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing
- https://lists.w3.org/Archives/Public/public-css-archive/2020May/0587.html
- https://almanac.httparchive.org/en/2024/fonts
- https://openfontlicense.org/ofl-faq/
- https://www.alphabettes.org/font-licensing-mess-2/
- https://developer.apple.com/fonts/
- https://fonts.google.com/knowledge/glossary/grade_axis
