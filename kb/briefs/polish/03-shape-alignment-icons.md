# Brief: 03 Shape, optical alignment and icons

**Question:** How do radius, alignment and icon weight make a page look engineered rather than assembled?

**Decisions the reader must be able to make**
- Which radius each component gets, from one family; inner radius of nested shapes.
- When to correct geometry optically (icons in buttons, play glyphs, circles, text beside icons, numerals) and by how much.
- Icon size and stroke for each text size and weight, so icons and text read as one color.

**Fundamentals (gate)**
- One radius family (FOUNDATIONS 0, 4, 8, 12, 16, full); nested radius = outer minus padding, square it at 4 or less (design-layout).
- Icons from one style: one stroke width per size, one cap and join style.
- Icons that carry meaning have 3:1 contrast and a text alternative.
- Left edges align to one line per column.

**Expert layer**
- Measured stem widths of Inter (400: 0.088 x size; 500: 0.107; 600: 0.127): a 16px icon at 1.5px stroke matches 14px text at 500; 2px stroke matches 16px text at 600.
- SF Symbols scales icons relative to cap height and pairs weights with text weights (Apple).
- Icon-side padding reduced about 4px in buttons; trailing chevrons get one step less gap.
- Pill (`full`) for controls next to screen edges; concentric radius for nested surfaces (Apple, WWDC25).
- Numbers: tabular figures where they align, and `text-box` trim for cap-height centering.

**Out of scope or reuse:** grid and edge rules (design-layout `01`), icon drawing and illustration (design-graphic), type details (design-typography `05`).

**Test briefs:** slice A, slice B. **Rubric:** gate; then radius audit passes (every radius from the family, nested ones computed), icon stroke matches adjacent text, icons centered optically.
