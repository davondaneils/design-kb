# Brief: 02 Depth: borders, shadows, surface contrast and hairlines

**Question:** How do you separate and lift surfaces so a page reads as crafted: when a border, when a shadow, when a surface step, and with what exact values?

**Decisions the reader must be able to make**
- Border vs shadow vs surface step for a given element (card, panel, popover, input, table row, sticky header).
- The five shadow levels `--shadow-0` to `--shadow-4` as layered recipes, and their dark theme mapping.
- Border color for decorative dividers vs interactive edges, with contrast numbers.
- Whether a true sub-pixel hairline is worth it, and how to draw one that actually renders.

**Fundamentals (gate)**
- One light source; shadow offset always down (y positive), never mixed directions.
- Input and control boundaries that identify the control meet 3:1 (WCAG 1.4.11); decorative dividers need not.
- Dark theme elevation by lighter surfaces, not darker shadows (FOUNDATIONS).
- Forced colors removes `box-shadow`: anything whose edge is only a shadow needs a transparent border.

**Expert layer**
- Layered shadow: a tight contact shadow plus a soft ambient shadow, tinted with the background hue, not pure black.
- Ring shadow (`0 0 0 1px`) as the border on raised surfaces so edges stay crisp over any background.
- Border alpha vs solid: alpha borders change on every surface; solid tokens keep contrast fixed.
- Measured: `border: 0.5px` renders as 1 CSS px in Chromium at DPR 1, 2 and 3; techniques that do paint a single device pixel.
- Inner top highlight on dark raised surfaces (1px white at low alpha) as the dark mode substitute for shadow.

**Must cover:** decision table, recipes, hairline methods, dark mode, forced colors, the "one separator per boundary" rule.

**Out of scope or reuse:** color ramps (design-color), spacing between surfaces (design-layout `02-spacing-and-rhythm.md`).

**Test briefs:** slice A (cards, subscription band, header), slice B (panels, KPI strip, popover tooltip, table). **Rubric:** gate; then one separation method per boundary, no double borders, shadows from one light source, dark surfaces step up.
