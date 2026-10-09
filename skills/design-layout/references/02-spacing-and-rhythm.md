# Spacing and rhythm

Sources: research/layout/02. Scale and tokens are the shared foundation contract.

## Principles
1. **Space is the primary grouping tool.** Proximity overpowers color and shape similarity (NN/g). Before adding a border, a card or a divider, try more space between groups and less within them.
2. **Spacing is a scale, not a number.** Every gap is a token. Off-scale values are bugs unless they are deliberate optical corrections.
3. **The parent owns the gap.** Components have no outer margin. Stacks, grids and clusters set the space between their children with `gap` or the owl selector (Every Layout).
4. **Start loose, then tighten.** It is easier to remove space from a generous layout than to find room in a cramped one (Refactoring UI, opinion).

## The scale (foundation contract)
| Token | px | Typical use |
|---|---|---|
| `--space-0` | 0 | reset |
| `--space-1` | 2 | hairline offsets, focus ring offset |
| `--space-2` | 4 | icon to text in dense UI, label to helper text |
| `--space-3` | 8 | icon to text, chip padding, label to input |
| `--space-4` | 12 | compact button and cell padding, items in a tight list |
| `--space-5` | 16 | default component padding, field to field in dense forms, mobile page margin |
| `--space-6` | 24 | card padding, field to field, gutter at md and lg |
| `--space-7` | 32 | between component groups, gutter at xl |
| `--space-8` | 48 | between sub-sections, form section to form section |
| `--space-9` | 64 | between page sections on mobile |
| `--space-10` | 96 | between page sections on desktop |
| `--space-11` | 128 | hero and major landing section breaks on large screens |

Foundation rule: component padding uses 4 to 24, layout gaps 16 and up. 40 and 80 (common in Carbon and Atlassian) are off-scale here.

## Decision rules
1. **Proximity ratio.** The gap between groups must be at least 2x the gap inside a group, and ideally two scale steps larger. Label to its input 8, field to next field 24, form section to next section 48. If two adjacent gaps are within one step of each other, the grouping is ambiguous: fix it.
2. **Three tiers per view, no more.** Pick one value for inside components, one for between components, one for between sections. Most views need only three spacing values plus the page margin (opinion; matches Carbon's small vs large increments).
3. **Nesting shrinks space inward.** Padding inside a card is smaller than the gap between cards' groups. A card with 24 padding sits in a grid with 24 or 32 gap and in a section with 64 or 96 around it.
4. **Nested radius.** Inner radius = outer radius minus padding. A 16 radius card with 8 padding holds an 8 radius image. If the result is 4 or less, square the inner corner or increase padding. Foundation radii: 0, 4, 8, 12, 16, full.
5. **Rhythm on a 4px baseline.** 16px body at 1.5 line height gives a 24px line. Keep component heights and section gaps on multiples of 4 so text and boxes stay in step. Common control heights: 32 (compact), 40 (default), 48 (comfortable, touch).
6. **Measure to the glyph, not the line box.** A line box includes half-leading above and below the text (4px each for 16/24 text). Visual padding therefore looks larger at the top of a text block than the token says. Use `text-box: trim-both cap alphabetic` (Baseline 2026, newly available) or subtract the half-leading by hand on buttons, badges and tightly padded cards.
7. **Optical over mathematical, sparingly.** Atlassian explicitly allows optical adjustment off the token. Allowed cases: icons with visual weight on one side, text next to round avatars, buttons with an icon (reduce padding on the icon side by about 4px, opinion).
8. **Fluid only at section level.** Component padding stays fixed. Section gaps may scale: `--space-section: clamp(64px, 4rem + 4vw, 128px)` steps from `--space-9` toward `--space-11`. Derive with the Utopia method (min viewport 320, max viewport around 1280 to 1500).
9. **Survive user spacing.** WCAG 1.4.12: text must survive 1.5x line height, 2x paragraph spacing, 0.12em letter spacing, 0.16em word spacing. Never fix the height of a container that holds text; use `min-block-size`.

## Do and don't
- Do `gap: var(--space-6)` on the grid. Don't `margin-bottom: 24px` on every card (the last one leaks).
- Do 8 between a label and its field, 24 between fields. Don't 16 and 16 (labels float between fields).
- Do let space separate the sidebar groups. Don't draw a line under every nav item.
- Do keep section padding equal top and bottom, then optically reduce the bottom by one step when a section ends in a button or image (opinion).

## Worked examples
**"Spacing feels off" settings form.** Audit: label-to-input 12, input-to-next-label 16, section gap 24, card padding 20 (off-scale). Fix: label to input 8, field to field 24, section to section 48 with a section heading 8 above its first field's group gap, card padding 24. Three tiers, every value a token, between-group gap now 3x inside gap. Result reads as groups with no dividers added.

**New design system scale.** Adopt the foundation scale as primitives. Add semantic aliases components consume: `--space-inset-sm` (8), `--space-inset-md` (16), `--space-inset-lg` (24), `--space-stack-sm` (8), `--space-stack-md` (16), `--space-stack-lg` (32), `--space-section` (fluid 64 to 128). Components only reference semantic tokens, per the contract.

## Hand-offs
- Line height, type scale and paragraph spacing values: design-typography.
- Density modes for product UI: see 05-page-composition-and-density.
- Token build and CSS architecture: design-frontend.

## Sources
- Carbon spacing: https://carbondesignsystem.com/elements/spacing/overview/
- Atlassian spacing: https://atlassian.design/foundations/spacing
- spec.fm 8-Point Grid (practitioner): https://spec.fm/specifics/8-pt-grid
- Every Layout, Stack: https://every-layout.dev/layouts/stack/
- Utopia fluid scales: https://utopia.fyi/blog/designing-with-fluid-type-scales/
- WCAG 1.4.12 Text Spacing: https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html
- MDN text-box-trim: https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim
- NN/g Proximity: https://www.nngroup.com/articles/gestalt-proximity/
- Wathan and Schoger, Refactoring UI (book, practitioner opinion)
