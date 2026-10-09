# Research 05: Typographic detail

Status key: **C** consensus, **X** contested, **O** opinion.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Curly quotes; apostrophes point down (same glyph as a closing single quote); foot and inch marks are straight (use primes); proper ellipsis character; real trademark and copyright symbols; hyphens are not dashes; one space between sentences; kerning always on. | Butterick key rules | C |
| 2 | Add 5 to 12% letter spacing to all caps and small caps; never fake small caps. | Butterick | C |
| 3 | First-line indent (1 to 4x point size) or 4 to 10pt paragraph space, never both. Always hyphenate justified text. | Butterick | C (print-derived) |
| 4 | font-variant-numeric values: lining-nums (lnum), oldstyle-nums (onum), proportional-nums (pnum), tabular-nums (tnum), slashed-zero (zero), ordinal (ordn), diagonal-fractions (frac), stacked-fractions (afrc). | MDN font-variant-numeric | C |
| 5 | tabular-nums should be the default for any updating number (timers, counters, prices, scores, live data) and for right-aligned numeric columns. | MDN font-variant-numeric: tabular-nums is "the set of figures where numbers are all of the same size, allowing them to be easily aligned like in tables" (https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric, accessed 2026-10-09). X posts by Lee Robinson, Soren and Wes Bos are leads only: x.com refused the fetch (robots) on 2026-10-09 | O (practice); mechanism C (MDN) |
| 6 | WCAG 1.4.8 (AAA) asks that text is not justified. | WCAG 2.2 | C |
| 7 | hanging-punctuation is supported only in Safari. | caniuse css-hanging-punctuation; Chris Coyier 2023 | C |
| 8 | Characters: minus U+2212, multiplication U+00D7, en dash U+2013 for ranges, prime U+2032 and double prime U+2033, ellipsis U+2026, nonbreaking space U+00A0, narrow no-break space U+202F, thin space U+2009. | Unicode code charts | C |
| 9 | Prefer high-level font-variant-* properties over font-feature-settings; font-feature-settings must restate every feature and does not combine with inherited values. | MDN font-feature-settings | C |
| 10 | Avoid ambiguous glyphs in critical strings (passwords, codes). | Pimp my Type | O |

## Sources
- https://practicaltypography.com/summary-of-key-rules.html
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings
- https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation
- https://caniuse.com/css-hanging-punctuation
- https://chriscoyier.net/2023/11/27/the-hanging-punctuation-property-in-css/
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric (re-fetched 2026-10-09)
- https://x.com/sorenblank/status/2028520200417706017 (lead only, not fetchable)
- https://x.com/leerob/status/1612112318099492866
- https://x.com/wesbos/status/1380612489201717254
