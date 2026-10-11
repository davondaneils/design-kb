# Brief: Color fundamentals and models (incl. OKLCH)

**Domain:** color. **Skill:** design-color. **Audience:** a designer building websites and apps for themselves and for clients.

## Question
How does color actually work on screens, and which color model should a designer think and write in?

## Decisions the reader must be able to make
- Which model to author colors in (hex, HSL, OKLCH) and why.
- How to read an OKLCH value and predict its lightness and contrast before checking.
- When a color is out of gamut, and how to ship wide gamut (Display P3) safely.

## Fundamentals (non-negotiable)
- Hue, lightness (value), chroma (saturation) as separate levers; lightness carries contrast and hierarchy.
- Color is relative: the same swatch reads differently on different grounds (Albers).
- Every shipped color has an sRGB fallback.

## Expert layer
- HSL lightness lies (yellow vs blue at the same L). OKLCH L is close to perceived lightness, so it predicts contrast.
- OKLCH lightness thresholds that pass WCAG on white and black, regardless of hue.
- Gamut limits vary by hue and lightness; chroma ceilings; how browsers clip.

## Must cover
OKLCH syntax and ranges, relative color syntax, light-dark(), Display P3 and fallbacks, Oklab origin and limits.

## Out of scope or reuse
Print and CMYK (later, design-graphic).

## Test briefs
- "Convert my hex palette to OKLCH and tell me what I gain."
- "Why does my yellow button look lighter than my blue one at the same HSL lightness?"
