# Brief 02: Spacing and rhythm

## Question it answers
How much space goes where, and how do I make spacing a system rather than a series of guesses?

## After reading, a designer must be able to decide
- Which foundation token (`--space-0` to `--space-11`: 0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128) to use for a given gap.
- The ratio between inside-group and between-group spacing so grouping is never ambiguous.
- Who owns spacing (parent layout, not the component's outer margin).
- How to keep vertical rhythm with a 16px root and 1.5 body line height.
- When fluid spacing (`clamp()`) is worth it and how to derive it.
- How to correct for invisible line-height space above and below text.

## Must cover
- Spacing tiers: component internals, component-to-component, section.
- Proximity ratio rule with numbers.
- Nested radius rule (outer radius = inner radius + padding).
- `text-box-trim` and half-leading.
- WCAG 1.4.12 text spacing: layouts must survive user overrides.

## Test briefs it must pass
- "Spacing feels off on this settings form, fix it."
- "Define the spacing scale for a new design system."
