# Research 01: Scale, measure and leading

Status key: **C** consensus, **X** contested, **O** one expert's opinion or practitioner opinion.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Content must survive user overrides of line height 1.5x, paragraph spacing 2x, letter spacing 0.12x, word spacing 0.16x font size, with no clipping or overlap. Fixed-height text containers are the usual failure (F104). | W3C Understanding SC 1.4.12 | C (normative, AA) |
| 2 | Text must resize to 200% without loss of content or function. | WCAG 2.2 SC 1.4.4 (AA) | C |
| 3 | AAA visual presentation: width no more than 80 characters, not justified, line spacing at least 1.5 in paragraphs, paragraph spacing at least 1.5x line spacing. | WCAG 2.2 SC 1.4.8 (AAA) | C (AAA, advisory) |
| 4 | 45 to 75 characters is satisfactory for a single column; 66 is ideal; 40 to 50 for multi-column. Set width in em (33em is about 66 characters at an average 0.5em per character). | Bringhurst via webtypography.net 2.1.2 | C |
| 5 | Body text 15 to 25px on the web; line spacing 120 to 145%; line length 45 to 90 characters. | Butterick, Practical Typography, Summary of key rules | O (respected) |
| 6 | Line height is proportional: about 1.5 for normal body; up to 2 for wide text; small text needs more; large headlines can go to 1. | Refactoring UI (Wathan, Schoger) | O |
| 7 | Body at least 16px (1rem); do not go below 12px; scale with viewing distance; 60 to 80 characters; start line height at 1.5 and adjust; short lines looked good at 1.3; regular weight for body. | Oliver Schoendorfer (Pimp my Type), Typography CPR workshop 2026 | O (practitioner) |
| 8 | iOS/iPadOS Dynamic Type default (Large): Large Title 34/41, Title1 28/34, Title2 22/28, Title3 20/25, Headline 17/22 semibold, Body 17/22, Callout 16/21, Subhead 15/20, Footnote 13/18, Caption1 12/16, Caption2 11/13. Default/min size: iOS 17/11 pt, macOS 13/10, watchOS 16/12, visionOS 17/12, tvOS 29/23. | Apple HIG, Typography | C (platform standard) |
| 9 | Material 3 baseline scale (sp, size/line height/tracking): Display L 57/64/-0.2; M 45/52/0; S 36/44/0. Headline L 32/40, M 28/36, S 24/32. Title L 22/28/0; M 16/24/+0.2 medium; S 14/20/+0.1 medium. Body L 16/24/+0.5; M 14/20/+0.2; S 12/16/+0.4. Label L 14/20/+0.1 medium; M 12/16/+0.5; S 11/16/+0.5. Every line height falls on a 4dp grid; tracking goes negative at display sizes and positive at small sizes. | androidx Compose TypeScaleTokens.kt (source of the M3 tokens) | C |
| 10 | Fluid type passes 1.4.4 in modern browsers if max size is no more than 2.5x min size; use rem for min and max; test at 500% zoom. A 16 to 48px clamp (3x) failed between about 1050 and 2100px viewports. | Smashing Magazine, "Addressing Accessibility Concerns With Using Fluid Type" (2023) | C (well tested, one source) |
| 11 | Inter's designer publishes size-dependent tracking: tracking (em) = -0.0223 + 0.185 x e^(-0.1745 x size in px). About 0 at 12px, -0.006em at 14px, -0.011em at 16px, -0.017em at 20px, -0.0195em at 24px, -0.022em at 40px and above. | rsms, Inter Dynamic Metrics | O (font-specific, but shows the general shape) |
| 12 | iOS Safari zooms into inputs whose font-size is 15px or smaller; 16px or larger avoids it. Disabling zoom in the viewport meta harms accessibility and iOS ignores it. | CSS-Tricks (Josh Comeau TIL) | C |
| 13 | text-box-trim / text-box (`trim-both cap alphabetic`) trims the half-leading so boxes align to cap height and baseline. Baseline 2026, newly available. | MDN text-box-trim | C (new, check support) |

## Numbers and formulas
- Fluid clamp: slope = (maxPx - minPx) / (maxVw - minVw); intercept = minPx - slope x minVw; `clamp(minRem, interceptRem + slope*100vw, maxRem)` (Utopia method).
- WCAG large text for contrast: 18pt (24px) regular or 14pt (about 18.66px) bold.
- 1rem = 16px by default; 1px = 0.75pt.
- The `ch` unit is the advance width of "0", which in most proportional text faces is wider than the average character, so `66ch` usually holds more than 66 characters. (Derived from the CSS definition of ch and Bringhurst's 0.5em average; verify per font by counting.)

## Conflicting views
- Line length upper bound: Bringhurst 75, WCAG AAA 80, Pimp my Type 80, Butterick 90. Treat 75 as the design target, 80 as a hard ceiling.
- Line height: Butterick 1.2 to 1.45 vs WCAG AAA and most UI systems 1.5. The shared foundation contract sets 1.5 for body. Butterick is print-trained; on screens 1.5 is the safer default.
- Unitless line height (inherits well) vs absolute line height per token (Material, Apple: grid snapped). Both are valid; see the draft for the rule.

## Likely to change
- text-box-trim support (2026); fluid type tooling; browser zoom behavior with vw.

## Sources
- https://www.w3.org/WAI/WCAG22/Understanding/text-spacing
- https://www.w3.org/WAI/WCAG22/Understanding/resize-text
- https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation
- https://webtypography.net/2.1.2
- https://practicaltypography.com/summary-of-key-rules.html
- https://www.refactoringui.com/previews/line-height-is-proportional
- https://pimpmytype.com/wp-content/uploads/2026/05/Typography-CPR-Workshop-webexpo-2026.pdf
- https://developer.apple.com/design/human-interface-guidelines/typography
- https://raw.githubusercontent.com/androidx/androidx/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TypeScaleTokens.kt
- https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/
- https://utopia.fyi/blog/clamp/
- https://d.rsms.me/inter-website/v3/dynmetrics/
- https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim
