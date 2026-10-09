# Research: Color fundamentals and models

Accessed 2026-10-09. Status key: **C** consensus, **X** contested, **O** one expert's or one team's opinion, **P** practitioner opinion, **D** derived by us (method recorded).

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | HSL lightness does not match perceived lightness; yellow looks lighter than blue at the same HSL L. | Stripe, "Designing accessible color systems" (Koopersmith and Miner, 2019); Ottosson (2020) says HSV yellow, magenta, cyan "appear much lighter than red and blue" | C |
| 2 | Oklab was published by Bjorn Ottosson on 23 Dec 2020 to predict lightness, chroma and hue better than CIELAB, which predicts blue hues badly. OKLCH is its polar form. | Ottosson, "A perceptual color space for image processing" | C |
| 3 | Oklab limits: fitted to CAM16 generated data, not new human experiments; hue prediction good but not best (IPT, JzAzBz scored slightly higher). | Ottosson (2020) | C |
| 4 | CIE LCH shifts blues toward purple when L or C changes (hue range about 270 to 330); OKLCH keeps them blue. | Evil Martians, "OKLCH in CSS" | O (widely repeated, consistent with #2) |
| 5 | `oklch(L C H / A)`: L 0 to 1 (or %), C from 0, 100% = 0.4, "in practice does not exceed 0.5"; H 0 to 360. Relative syntax: `oklch(from var(--x) calc(l - 0.1) c h)`. Baseline widely available since May 2023. | MDN, oklch() | C |
| 6 | In practice C stays below about 0.37 for sRGB and P3. | Evil Martians | O |
| 7 | sRGB covers about 35% of visible colors; P3 adds about 30% more; hex, rgb() and hsl() cannot express P3. Browsers map out of gamut colors; Chrome and Safari clip rather than use the spec's OKLCH chroma reduction. Fallback: sRGB value first, P3 inside `@media (color-gamut: p3)`. | Evil Martians | O (gamut %), C (fallback pattern) |
| 8 | Out of gamut colors "would need to be CSS gamut mapped for display, producing a similar-looking but lower chroma (less saturated) color." CSS Color 4 is a Candidate Recommendation Draft (8 Oct 2026). | W3C CSS Color 4 | C |
| 9 | Backgrounds with OKLCH L at or above 87% read well with black text. | Evil Martians | O |
| 10 | `light-dark(a, b)` returns a for light, b for dark; needs `color-scheme: light dark`. Baseline 2024 (May 2024). | MDN, light-dark() | C |
| 11 | Color is relative and deceptive: the same color changes with its neighbors. | Albers, *Interaction of Color* (Yale, 1963) | C (canonical) |
| 12 | Apple: P3 "can produce richer, more saturated colors than sRGB"; use Display P3 at 16 bits per channel, PNG; P3 gradients can clip on sRGB displays; provide per color space assets. | Apple HIG, Color | C |
| 13 | Colors look darker and more muted in bright light, brighter and more saturated in dim light; test under varied lighting. | Apple HIG, Color | C |
| 14 | Gradients accept an interpolation space: `linear-gradient(in oklab to right, blue, red)`; polar spaces take a hue method (shorter, longer, increasing, decreasing). MDN states Oklab is the default color interpolation space. | MDN, color-interpolation-method | C |

## Derived numbers (D)
Method: script `skills/design-color/assets/oklch_scale.py` (Oklab matrices from Ottosson; WCAG 2 luminance; chroma reduced at fixed L and H until in sRGB). Swept hue 0 to 345 in 15 degree steps and C 0 to 0.20.
- Text with OKLCH L at or below 0.55 reaches 4.5:1 on white for every hue and chroma tested (thresholds ranged 0.552 to 0.595).
- L at or below 0.45 reaches 7:1 on white; L at or below 0.65 reaches 3:1 on white.
- On black: L at or above 0.59 reaches 4.5:1; L at or above 0.70 reaches 7:1.
- Neutral gray thresholds: 4.5:1 on white at L 0.567; on L 0.97 surface at L 0.546; on L 0.93 surface at L 0.519.
- Checked: `#767676` on white is 4.54:1.

## Conflicting views
- Some practitioners say "trust your eyes, not the numbers" (Refactoring UI). Not a conflict: OKLCH numbers set the ladder; eyes tune chroma and hue.

## Sources
- Ottosson, B. A perceptual color space for image processing. https://bottosson.github.io/posts/oklab/
- MDN, oklch(). https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
- MDN, light-dark(). https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
- Sitnik, A. and Turner, T. OKLCH in CSS: why we moved from RGB and HSL (Evil Martians). https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl
- W3C, CSS Color Module Level 4. https://www.w3.org/TR/css-color-4/
- MDN, color-interpolation-method. https://developer.mozilla.org/en-US/docs/Web/CSS/color-interpolation-method
- Apple HIG, Color. https://developer.apple.com/design/human-interface-guidelines/color
- Koopersmith, D. and Miner, W. Designing accessible color systems (Stripe, 2019). https://stripe.com/blog/accessible-color-systems
- Albers, J. Interaction of Color. Yale University Press, 1963.
