# Brief 01: Grids and structure

Domain: Layout (skill: design-layout). Owner hat: editor-in-chief.

## Question it answers
What underlying structure should a screen or page sit on, and how do I build it so it holds at every width?

## After reading, a designer must be able to decide
- Column grid vs intrinsic layout vs fixed-plus-fluid shell, for a given product type.
- Column count, gutter and margin per breakpoint, using the shared foundation breakpoints (640, 768, 1024, 1280, 1536).
- Max content width for the page shell and the reading measure for text.
- How to let one element break out (full bleed, popout) without breaking the grid.
- How nested components align to the parent grid (subgrid) instead of drifting.
- When to override math with optical alignment.

## Must cover
- Muller-Brockmann's grid idea in one paragraph, not a history lesson.
- Material and Carbon grid numbers as reference points, reconciled to the foundation contract.
- CSS patterns: named-line full-bleed grid, `auto-fit` + `minmax()`, subgrid, the Every Layout Sidebar.
- App shells: fixed sidebar plus fluid content beats a 12-column grid for product UI.
- Optical alignment rules that math gets wrong.

## Test briefs it must pass
- "Lay out a long-form article page with wide images and pull quotes."
- "Set up the grid for a B2B SaaS marketing site."
