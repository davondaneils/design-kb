# Research 03: Composition, focal point and text over images

Researcher, 2026-10-09. Brief: `kb/briefs/art-direction/03-composition-and-overlays.md`.

## Key findings
1. **Text over images fails WCAG when any background point under the text is too light or dark.** F83: "This failure occurs when people with low vision are not able to read text that is displayed over a background image." Its quick check compares the text with the area of the image that gives the least contrast. [O1][O2]
2. **Varying backgrounds are measured per letter.** G18: when the background varies, "Measure the relative luminance of the background pixels immediately next to the letter"; "there is no color that can run across the page and meet the contrast guidelines on both edges" of a strong gradient. [O3][O4]
3. **Halos and outlines count.** Understanding 1.4.3: "When there is a border around the letter, the border can add contrast". [O5]
4. **Images of text**: 1.4.5 requires live text when the technology can present it; "Logotypes (text that is part of a logo or brand name) are considered essential." [O6][O7]
5. **Forced colors mode strips gradient scrims and shadows.** MDN: `background-image` "is forced to 'none' for values that are not url-based", and `text-shadow` and `box-shadow` are forced to none; `background-color` is overridden to system colors. A gradient scrim and a text-shadow halo both vanish; url images stay. [O8][O9]
6. **Meaningful graphics need 3:1; decorative ones do not.** 1.4.11 covers "Parts of graphics required to understand the content"; decorative graphics are excluded; "Logos are exempted". [O10][O11]
7. **Gaze direction moves attention, even when people are told it is uninformative.** Friesen and Kingstone 1998: response time "was reliably faster when gaze was toward versus away from the target", evidence for "covert, reflexive orienting". [O12][O13]
8. **The rule of thirds barely predicts preference.** Amirshahi et al. 2014: "aesthetic rating scores correlated only weakly with subjective ROT scores and not at all with calculated ROT values." [O14]
9. **Hierarchy tools** per NN/g: "color and contrast, scale, and grouping"; "Bigger elements stand out more and attract users' attention". The squint test "highlights what is emphasized in the design". [O15][O16][O17]

10. **Opaque panels survive forced colors.** The CSS Color Adjustment spec forces `background-color` to the system color opposite the text, but "its alpha channel is taken from the original background-color value". An opaque panel stays an opaque system-color panel; a gradient scrim disappears. Edge and Chromium may also draw a text backplate, and `forced-color-adjust: none` disables it. [O18][O19]

## Numbers
- Text 4.5:1, large text 3:1 (24px, or 18.66px bold), at the least favorable point (F83, G18).
- Non-text meaningful graphics 3:1 (1.4.11).
- Gaze-cue effect: tens of milliseconds in lab response times (Friesen and Kingstone report reliable differences; we do not quote a value). Treat it as a nudge, not a guarantee.

## Conflicting views
- Rule of thirds is taught everywhere; evidence says weak. Use it as a starting grid, not a law. (contested)
- Some designers rely on text-shadow halos for text on photos. They pass 1.4.3 if the halo is wide enough (O5) but disappear in forced colors (O9). Prefer a solid panel or planned negative space.

## Claim table
| ID | Claim | Quote | URL | Date | Tier | Status |
|---|---|---|---|---|---|---|
| O1 | F83 failure description | "This failure occurs when people with low vision are not able to read text that is displayed over a background image." | https://www.w3.org/WAI/WCAG22/Techniques/failures/F83 | 2026-10-09 | 1 | consensus |
| O2 | F83 quick check uses the worst area | "First do a quick check to see if the contrast between the text and the area of the image that is darkest" | https://www.w3.org/WAI/WCAG22/Techniques/failures/F83 | 2026-10-09 | 1 | consensus |
| O3 | Measure pixels next to each letter | "Measure the relative luminance of the background pixels immediately next to the letter using same formula." | https://www.w3.org/WAI/WCAG22/Techniques/general/G18 | 2026-10-09 | 1 | consensus |
| O4 | No single color passes across a strong gradient | "there is no color that can run across the page and meet the contrast guidelines on both edges." | https://www.w3.org/WAI/WCAG22/Techniques/general/G18 | 2026-10-09 | 1 | consensus |
| O5 | Borders around letters add contrast | "When there is a border around the letter, the border can add contrast" | https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html | 2026-10-09 | 1 | consensus |
| O6 | Use text, not images of text | "If the technologies being used can achieve the visual presentation, text is used to convey information" | https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html | 2026-10-09 | 1 | consensus |
| O7 | Logotypes essential | "Logotypes (text that is part of a logo or brand name) are considered essential." | https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html | 2026-10-09 | 1 | consensus |
| O8 | Forced colors removes non-url backgrounds | "`background-image` is forced to 'none' for values that are not url-based" | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors | 2026-10-09 | 1 | consensus |
| O9 | Forced colors removes text-shadow | "`text-shadow` is forced to 'none'" | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors | 2026-10-09 | 1 | consensus |
| O18 | Forced colors keeps the alpha of background-color, so opaque panels stay opaque | "However, its alpha channel is taken from the original background-color value" | https://www.w3.org/TR/css-color-adjust-1/ | 2026-10-09 | 1 | consensus |
| O19 | Browsers may draw a text backplate in forced colors; forced-color-adjust: none disables it | "using forced-color-adjust: none will disable these." | https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors/ | 2026-10-09 | 4 | consensus (browser vendor) |
| O10 | 1.4.11 scope | "Parts of graphics required to understand the content" | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html | 2026-10-09 | 1 | consensus |
| O11 | Logos exempt from 1.4.11 | "Logos are exempted from contrast requirements" | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html | 2026-10-09 | 1 | consensus |
| O12 | Gaze cue speeds responses toward target | "response time in all three conditions was reliably faster when gaze was toward versus away from the target." | https://psych.unl.edu/mdodd/Psy498/FriesenKingstone.pdf | 2026-10-09 | 3 | consensus (replicated literature) |
| O13 | Reflexive orienting | "This study provides evidence for covert, reflexive orienting to peripheral locations" | https://psych.unl.edu/mdodd/Psy498/FriesenKingstone.pdf | 2026-10-09 | 3 | consensus |
| O14 | Rule of thirds weakly related to ratings | "aesthetic rating scores correlated only weakly with subjective ROT scores and not at all with calculated ROT values." | https://uniklinikum-jena.de/anatomie1_media/Inhalte/AmirshahiARTP2014-font-1.pdf | 2026-10-09 | 3 | contested in practice, supported by data |
| O15 | Hierarchy tools | "can be created through variations in color and contrast, scale, and grouping." | https://www.nngroup.com/articles/visual-hierarchy-ux-definition/ | 2026-10-09 | 3 | consensus |
| O16 | Size marks importance | "Bigger elements stand out more and attract users' attention" | https://www.nngroup.com/articles/visual-hierarchy-ux-definition/ | 2026-10-09 | 3 | consensus |
| O17 | Squint test | "This technique highlights what is emphasized in the design and uncovers the underlying hierarchy." | https://www.nngroup.com/articles/visual-hierarchy-ux-definition/ | 2026-10-09 | 3 | consensus |

## Derived: worst-pixel check
Script `skills/design-art-direction/assets/overlay_contrast.py` computes WCAG contrast of a text color against every pixel of a background crop and reports minimum and 1st percentile, per F83 and G18. Method: WCAG 2 relative luminance on sRGB.
