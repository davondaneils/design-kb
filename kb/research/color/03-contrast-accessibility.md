# Research: Contrast and accessibility

Accessed 2026-10-09. Status key as in 01.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | SC 1.4.3 (AA): text 4.5:1; large text 3:1. Applies to placeholder text and hover text. Background images without enough contrast fail (F83). Large = 18pt (about 24px) or 14pt bold (about 18.5px). Exempt: inactive components, pure decoration, invisible text, text in pictures with significant other content, logotypes. | W3C, Understanding 1.4.3 | C |
| 2 | Relative luminance L = 0.2126R + 0.7152G + 0.0722B with channel linearization (threshold 0.04045, was 0.03928, no practical effect). Ratio = (L1 + 0.05)/(L2 + 0.05), range 1 to 21. No rounding: 4.499:1 fails. | W3C, Understanding 1.4.3 | C |
| 3 | SC 1.4.6 (AAA): 7:1 text, 4.5:1 large text. | WCAG 2.2 | C |
| 4 | SC 1.4.11 (AA): 3:1 against adjacent colors for visual information needed to identify UI components and their states, focus indicators, and graphical objects needed to understand content. Exempt: inactive (disabled) components, unmodified user agent styling, non-essential graphics, essential presentations (logos, flags, photos). 2.999:1 fails. | W3C, Understanding 1.4.11 | C |
| 5 | Hover effects need not meet 3:1 but must not reduce the contrast of the component or of focus/selection indicators. A visible boundary is required only when nothing else (text, contrasting icon) identifies the control. | W3C, Understanding 1.4.11 | C |
| 6 | SC 1.4.1 (A): color is not the only visual means of conveying information. Inline links distinguished only by color pass if 3:1 against surrounding text (G183); failure F73. Visited vs unvisited by color alone is not a failure. | W3C, Understanding 1.4.1 | C |
| 7 | SC 2.4.13 Focus Appearance (AAA): indicator area at least a 2 CSS px perimeter, and 3:1 between focused and unfocused states of the same pixels. SC 2.4.11 Focus Not Obscured (Minimum) is AA. | WCAG 2.2 | C |
| 8 | WCAG 2.2 Recommendation; current version dated 12 Dec 2024. | W3C TR WCAG22 | C |
| 9 | APCA Lc levels: 90 preferred body text (18px/300, 14px/400); 75 minimum body text (24px/300, 18px/400, 16px/500, 14px/700); 60 other content text; 45 large headlines (36px normal, 24px bold) and fine icons; 30 absolute minimum for placeholder, disabled, copyright text; 15 minimum for discernible non-text. APCA says WCAG 2 overstates contrast for dark colors. | APCA in a Nutshell (Myndex) | O (proposed method) |
| 10 | WCAG 3 draft: "The contrast algorithm used in WCAG 3 is yet to be determined." APCA was removed from the WCAG 3 draft in July 2023. WCAG 3 unlikely final before 2030. | Adrian Roselli, "WCAG3 contrast as of April 2026" | C (status), O (2030 estimate) |
| 11 | US ADA Title II rule adopts WCAG 2.1 AA; an interim final rule (20 Apr 2026) moved compliance to 26 Apr 2027 (50,000+ population) and 26 Apr 2028 (smaller). | ada.gov fact sheet | C |
| 12 | EU Accessibility Act applies from 28 June 2025; EN 301 549 references WCAG 2.1 AA. | Acquia and other compliance summaries (secondary) | C (verify for a specific client) |
| 13 | Color blindness: about 1 in 12 men (8%), 1 in 200 women, about 300 million people; red/green forms most common. | Colour Blind Awareness | C |
| 14 | `forced-colors: active` (Windows contrast themes) overrides color, background-color, border-color, outline-color, SVG fill and stroke; removes box-shadow; draws text backplates. Keep borders so shapes survive; use system colors (Canvas, CanvasText, ButtonText). Do not build a separate design. | MDN, forced-colors | C |
| 15 | Apple: contrast "no lower than 4.5:1"; for custom colors "strive for 7:1, especially in small text". Supply light, dark and increased contrast variants of each custom color. | Apple HIG, Dark Mode and Color | C |
| 16 | Radix steps 11 and 12 meet Lc 60 and Lc 90 on step 2. | Radix docs | O |
| 17 | SC 2.4.7 Focus Visible (AA): keyboard focus indicator visible; it may not disappear after a timeout. Focus indicators also fall under 1.4.11. | W3C, Understanding 2.4.7 | C |
| 18 | G183 requires only 3:1 between link text and surrounding text; underline or bold is optional. | W3C, Technique G183 | C |
| 19 | `prefers-contrast`: no-preference, more, less, custom (custom matches forced-colors palettes). Baseline widely available since May 2022. | MDN, prefers-contrast | C |

## Derived numbers (D) (method: `assets/oklch_scale.py`, APCA-W3 0.0.98G constants)
- OKLCH lightness pass lines on white: 3:1 at L 0.65 or less; 4.5:1 at 0.55 or less; 7:1 at 0.45 or less. On black: 4.5:1 at 0.59 or more; 7:1 at 0.70 or more.
- WCAG 2 vs APCA disagreements:
  - `#3b85ff` on `#101214` (dark mode link): WCAG 5.35:1 (passes AA) but APCA Lc 39 (below the Lc 60 content text line).
  - White on `#3b85ff`: WCAG 3.51:1 (fails AA body) but APCA Lc 67.6.
  - So WCAG 2 is lenient on light text over very dark backgrounds and strict on white over saturated mid blues. Ship to WCAG 2 (legal baseline) and use APCA as a second check in dark mode.
- Dark mode body text on L 0.18 surface: L 0.86 gives Lc 78, L 0.92 gives Lc 90 (WCAG 12.3:1 and 14.9:1).
- Light mode body text on white: L 0.45 gives 7.48:1 and Lc 86; L 0.40 gives 9.18:1 and Lc 91.
- Placeholder grays: L 0.72 on white is 2.47:1 (fails 1.4.3); L 0.635 is 3.43:1 (fails for normal text). Placeholder text is not exempt; aim for 4.5:1 or use a visible label so the placeholder is not the only cue.

## Conflicting views
- APCA advocates call WCAG 2 contrast broken for dark mode; Roselli and others warn against treating APCA as a standard. Both can be right: WCAG 2 is the legal test, APCA is a useful design check.
- Placeholder contrast: some argue placeholders are hints, not content. The Understanding document says 1.4.3 "applies to ... placeholder text", so it is settled for conformance.

## Sources
- W3C, Understanding SC 1.4.3. https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- W3C, Understanding SC 1.4.11. https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- W3C, Understanding SC 1.4.1. https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- W3C, Understanding SC 2.4.13. https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- W3C, WCAG 2.2. https://www.w3.org/TR/WCAG22/
- Myndex, APCA in a Nutshell. https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html
- Roselli, A. WCAG3 contrast as of April 2026. https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html
- US DOJ, Title II web rule fact sheet. https://www.ada.gov/resources/2024-03-08-web-rule/
- Acquia, European Accessibility Act and EN 301 549. https://www.acquia.com/blog/european-accessibility-act-and-en-301-549-your-complete-compliance-guide
- Colour Blind Awareness. https://www.colourblindawareness.org/colour-blindness/
- W3C, Understanding SC 2.4.7. https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- W3C, Technique G183. https://www.w3.org/WAI/WCAG22/Techniques/general/G183
- MDN, prefers-contrast. https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast
- MDN, forced-colors. https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
- Apple HIG, Dark Mode. https://developer.apple.com/design/human-interface-guidelines/dark-mode
