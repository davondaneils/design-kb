# Brief: Palette building and harmony

**Domain:** color. **Skill:** design-color. **Audience:** a designer building websites and apps for themselves and for clients.

## Question
How do you go from one brand color (or none) to a complete, usable palette?

## Decisions the reader must be able to make
- How many hues and how many steps a product palette needs.
- The lightness ladder for a 50 to 950 scale, and the chroma curve along it.
- Which harmony scheme fits the brief, and how much of the screen each color gets.
- What to do with a client brand color that fails contrast.

## Fundamentals (non-negotiable)
- Neutrals do most of the work; one primary, a few semantic hues.
- Scales are defined up front, not generated on the fly with lighten/darken.
- Each step has a job; same step number means same lightness across hues.

## Expert layer
- A contrast-locked lightness ladder: step distance predicts WCAG contrast.
- Chroma peaks mid-scale and falls at the ends; hue drift at the dark end; tinted neutrals.
- The brand color is a token, not necessarily a scale step.

## Must cover
Harmony schemes (monochrome, analogous, complementary, split, triadic) as starting points, 60-30-10 labelled as a heuristic, Refactoring UI shade counts, Radix step jobs, Tailwind v4 OKLCH scale as a reference point, data viz palettes (point to dataviz skill, ColorBrewer, Okabe-Ito).

## Test briefs
- "Build a palette for a calm fintech landing page."
- "My client's brand yellow is #FFC20E. Make it work for buttons and links."
