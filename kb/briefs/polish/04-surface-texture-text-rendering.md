# Brief: 04 Surface, texture and text rendering

**Question:** When do gradients, noise and texture add richness, and what rendering details make text and edges look sharp?

**Decisions the reader must be able to make**
- Whether a surface gets a gradient, and how subtle (lightness delta, angle, interpolation space).
- How to stop gradient banding (noise, dithering) without visible grain.
- Font smoothing, optical sizing, `text-rendering`, `text-wrap`, `color-scheme`, `accent-color` and selection color settings.

**Fundamentals (gate)**
- Text on gradients or textures still meets 4.5:1 at its worst point (FOUNDATIONS item 2, judged).
- Gradients and textures are decoration: never the only carrier of meaning, removed by forced colors without loss.
- `color-scheme` set so native controls and scrollbars match the theme.

**Expert layer**
- Gradient in OKLCH to avoid gray dead zones; lightness delta of 2 to 4 percent reads as light, not as a gradient.
- SVG `feTurbulence` grain at 2 to 4 percent opacity breaks banding on large dark gradients.
- `-webkit-font-smoothing: antialiased` only on light-on-dark text (MDN).
- `font-optical-sizing: auto` and Inter Display at 25px and up.
- `::selection` in brand tint; `accent-color` for native checkboxes.

**Out of scope or reuse:** color science (design-color), typeface choice (design-typography), illustration (design-graphic).

**Test briefs:** slice A (hero stage, subscription band), slice B (chart surface, chrome). **Rubric:** gate; then no visible banding at 1440 dark, text sharp in both themes, texture invisible at a glance and missing it would be noticed.
