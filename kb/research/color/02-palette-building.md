# Research: Palette building and harmony

Accessed 2026-10-09. Status key as in 01.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | A UI needs 8 to 10 grays, 1 to 2 primaries with 5 to 10 shades each, and accent/semantic colors (destructive, warning, positive) with several shades each; complex UIs may need up to ten colors. | Wathan and Schoger, Refactoring UI, "Building your color palette" | P (widely adopted) |
| 2 | Define shades up front; do not generate them with lighten/darken functions. Pick base (500, "would work as a button background"), then darkest and lightest, then fill gaps. Trust your eyes. | Refactoring UI | P |
| 3 | Radix 12 step scale with a job per step: 1 app background, 2 subtle background, 3 component background, 4 hover, 5 pressed/selected, 6 subtle border, 7 interactive border, 8 strong border and focus ring, 9 solid (purest color), 10 solid hover, 11 low contrast text, 12 high contrast text. 11 and 12 meet APCA Lc 60 and Lc 90 on step 2. | Radix Colors docs | O (one team, widely used) |
| 4 | Tailwind v4 defines its palette in OKLCH, 11 steps 50 to 950. Blue: 50 `oklch(97% 0.014 254.604)`, 500 `oklch(62.3% 0.214 259.815)`, 600 `oklch(54.6% 0.245 262.881)`, 950 `oklch(28.2% 0.091 267.935)`. Gray 50 L 98.5%, 950 L 13%. Hue drifts about 13 degrees from 50 to 950 in blue. | Tailwind CSS docs, Colors | C (fact of the published palette) |
| 5 | Stripe rebuilt its palette in a perceptually uniform space so that every color passes against white and the lightest tint of any hue, and "any two colors are guaranteed to have sufficient contrast for small text if they are at least five levels apart"; four levels for icons and large text. | Stripe (2019) | O (one team) |
| 6 | Strom-Awn method: lightness computed from target contrast, r(x) = e^(3.04x), so equal step distance gives equal contrast; chroma as an inverted parabola peaking mid-scale; hue shift of about 5 degrees across the scale (Bezold-Brucke compensation); neutrals with max saturation about 20%. | Matt Strom-Awn, "Generating color palettes" | O |
| 7 | Linear generates whole themes from three inputs (base color, accent color, contrast) in LCH, replacing 98 hand set variables; the contrast input yields high contrast themes automatically. | Linear, "How we redesigned the Linear UI (part II)", 2024 | O (one team) |
| 8 | Adobe Leonardo generates colors from target contrast ratios and supports adaptive light/dark themes. | leonardocolor.io | C (tool exists) |
| 9 | Data viz: sequential (lightness does the work), diverging (meaningful midpoint, light middle), qualitative (hue differences, little lightness change). | ColorBrewer, Brewer | C |
| 10 | Okabe-Ito palette: #E69F00, #56B4E9, #009E73, #F0E442, #0072B2, #D55E00, #CC79A7, #000000. Principles: alternate warm and cool, avoid yellow-green between yellow and green, prefer reddish purple to violet, add shape or pattern. | Okabe and Ito (jfly); hex via conceptviz reference | C |
| 11 | 60-30-10 (dominant, secondary, accent) comes from interior design. No research basis found. | Apartment Therapy and other decor sources | P (heuristic) |
| 12 | Text on a colored background reads better tinted toward the background hue than as gray or pure black. | Refactoring UI tip 2; Anthony Hobday, Visual Techniques | P |
| 13 | Harmony schemes (complementary, analogous, triadic, split complementary) come from the color wheel tradition (Itten). | Itten, *The Art of Color* (1961) | C (as convention, not as evidence of appeal) |

## Derived numbers (D)
Ladder tested with `assets/oklch_scale.py`: L = 0.975, 0.935, 0.88, 0.81, 0.72, 0.635, 0.53, 0.46, 0.39, 0.32, 0.25 for steps 50 to 950; chroma shape 0.12, 0.28, 0.5, 0.75, 0.95, 1, 1, 0.92, 0.8, 0.65, 0.5 times max chroma. Swept hue 0 to 350 (10 degree steps) and max chroma 0 to 0.26. Worst cases:
- 600 on white 4.94:1; 600 on 50 4.64:1; white on 600 4.94:1.
- 700 on 100 5.58:1. 800 on 200 6.5:1. 200 on 900 8.68:1. 300 on 900 6.92:1.
- 500 on white 3.19:1 (UI and large text only). 500 on 950 4.21:1.
- 400 on 950 5.93:1.
- Tailwind blue 500 (`#3b82f6` family) on white 3.71:1: white text on Tailwind 500 fails AA body text. 600 passes (5.24:1).
- First pass ladder with 600 at L 0.55 failed: gray 600 on gray 50 was 4.46:1. Hence 0.53.
- Brand yellow `#FFC20E` = oklch(84.6% 0.172 85.3); on white 1.62:1; black on it 12.98:1.

## Practitioner sources (P)
Searched X.com for color threads from working designers. Threads did not fetch; the most useful practitioner material was the published long form from the same people: Refactoring UI (Schoger and Wathan), Anthony Hobday's Visual Techniques, and studio blogs (Stripe, Linear). Labelled P or O above.

## Sources
- Refactoring UI, Building your color palette. https://www.refactoringui.com/previews/building-your-color-palette
- Wathan and Schoger, 7 practical tips for cheating at design. https://readmedium.com/7-practical-tips-for-cheating-at-design-40c736799886
- Radix Colors, Understanding the scale. https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- Tailwind CSS, Colors. https://tailwindcss.com/docs/colors
- Stripe, Designing accessible color systems. https://stripe.com/blog/accessible-color-systems
- Strom-Awn, M. How to generate color palettes for design systems. https://mattstromawn.com/writing/generating-color-palettes/
- Linear, How we redesigned the Linear UI. https://linear.app/now/how-we-redesigned-the-linear-ui
- Adobe Leonardo. https://leonardocolor.io/
- ColorBrewer, schemes. https://colorbrewer2.org/learnmore/schemes_full.html
- Okabe, M. and Ito, K. Color Universal Design. https://jfly.uni-koeln.de/color/ ; hex reference https://conceptviz.app/blog/okabe-ito-palette-hex-codes-complete-reference
- Hobday, A. Coloured text against coloured background. https://anthonyhobday.com/sideprojects/visualtechniques/techniques/colour/coloured-text-against-coloured-background
- Apartment Therapy, 60-30-10 rule. https://www.apartmenttherapy.com/interior-design-rule-60-30-10-explained-37504313
