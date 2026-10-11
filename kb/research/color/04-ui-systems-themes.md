# Research: Color in UI systems

Accessed 2026-10-09. Status key as in 01.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Material 3 defines 49 color roles in light and dark schemes: primary, on-primary, primary-container, on-primary-container (and secondary, tertiary, error equivalents), fixed variants, surface, surface-dim, surface-bright, surface-container-lowest/low/(default)/high/highest, on-surface, on-surface-variant, outline, outline-variant, inverse-surface, inverse-on-surface, inverse-primary, scrim, shadow. Every fill role has an "on" role for content on it. | material-web tokens `_md-sys-color.scss` | C |
| 2 | Material state layer opacities: hover 0.08, focus 0.12, pressed 0.12, dragged 0.16 (overlay of the content color on the container). Disabled: container 0.12 opacity, label 0.38 opacity. | material-web tokens `_md-sys-state.scss`, `_md-comp-filled-button.scss` (v0_192) | C (for Material), O (as a general default) |
| 3 | Material now uses tonal surface colors instead of elevation overlays in dark theme; dark theme surfaces are dark gray, not black, so shadows stay visible and light text strains less. | material-components-android, Dark theme docs | C |
| 4 | Apple: semantic colors adapt automatically; avoid hard-coded values; do not redefine semantic meaning (do not use `separator` as text). Dark Mode uses base (dimmer, recedes) and elevated (brighter, advances) backgrounds. Dark colors "aren't necessarily inversions". Supply light, dark and increased contrast variants. | Apple HIG, Color and Dark Mode | C |
| 5 | Apple: "Avoid using the same color to mean different things." Example: brand color for both a borderless button and noninteractive text "is confusing." | Apple HIG, Color | C |
| 6 | Light mode outperforms dark mode on acuity and proofreading for people with normal vision (Piepenbrock et al. 2013); advantage grows as text gets smaller. Dark mode may help some low vision users (cataracts). Recommendation: do not default to dark for general audiences; offer it; use the OS setting. | NN/g, Budiu (2020) | C (summary of studies) |
| 7 | Radix step jobs (see 02): 3/4/5 for component background, hover, pressed; 9/10 solid and solid hover; 6/7/8 borders, 8 focus ring. | Radix docs | O |
| 8 | `color-scheme: light dark` plus `light-dark()`; forced-colors overrides author colors. | MDN | C |
| 9 | Linear: three theme inputs (base, accent, contrast) generate all surfaces and text in LCH; text and neutral icons darker in light mode, lighter in dark mode for contrast; blue "chrome" limited for a neutral look. | Linear (2024) | O |
| 10 | Refactoring UI: primary actions get solid high contrast backgrounds, secondary get outline or low contrast styles, tertiary look like links. Destructive red only when it is the primary action. | Wathan and Schoger | P |
| 11 | Charts: use the dataviz skill for chart palettes; ColorBrewer and Okabe-Ito for scheme types and color vision safety (see 02). | ColorBrewer; Okabe and Ito | C |

## Derived numbers (D)
- Dark surfaces tested: L 0.18, 0.22, 0.26 at chroma about 0.006 to 0.01 (hex `#101214`, `#181b1e`, `#212429`).
- Swept all hues (10 degree steps) and max chroma 0.08 to 0.26 with the ladder from 02. Worst case contrast of accent text on dark surfaces:
  - On L 0.18: 300 is 9.61, 400 is 6.69, 500 is 4.75.
  - On L 0.22: 300 is 8.86, 400 is 6.17, 500 is 4.38 (fails).
  - On L 0.26: 300 is 7.96, 400 is 5.54, 500 is 3.94 (fails).
  - Rule: in dark mode, accent text uses step 400 or lighter, never 500.
- Muted text L 0.72 on L 0.18 is 7.57:1 but only Lc 53; L 0.80 is Lc 67; use L 0.80 for secondary text, L 0.86 to 0.95 for body.

## Sources
- material-web tokens, color. https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-color.scss
- material-web tokens, state. https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-sys-state.scss
- material-web tokens, filled button. https://raw.githubusercontent.com/material-components/material-web/main/tokens/versions/v0_192/_md-comp-filled-button.scss
- material-components-android, Dark theme. https://github.com/material-components/material-components-android/blob/master/docs/theming/Dark.md
- Apple HIG, Color. https://developer.apple.com/design/human-interface-guidelines/color
- Apple HIG, Dark Mode. https://developer.apple.com/design/human-interface-guidelines/dark-mode
- Budiu, R. Dark Mode vs. Light Mode: Which Is Better? NN/g, 2020. https://www.nngroup.com/articles/dark-mode/
- Radix Colors. https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- Linear. https://linear.app/now/how-we-redesigned-the-linear-ui
- MDN, light-dark(). https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark
