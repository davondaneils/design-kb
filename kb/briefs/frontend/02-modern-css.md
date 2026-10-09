# Brief 02: Modern CSS architecture and tokens

## Question it answers
How do I structure CSS so a design system scales: tokens, cascade layers, logical properties, container queries, fluid type, theming?

## After reading, Claude must be able to decide
- The token tiers (primitive, semantic, component) and names, consistent with the design-kb foundation contract.
- The `@layer` order for a project and where third-party CSS goes.
- Media query vs container query for a given component.
- A fluid type clamp() that still passes WCAG 1.4.4 at 200% zoom.
- Light and dark theming with `color-scheme` and `light-dark()`.
- Which new features are safe today (Baseline status as of October 2026) and how to progressively enhance the rest.

## Must cover
Custom properties and `@property`, `@layer`, `@scope`, nesting, logical properties, container queries and `cq*` units, `:has()`, clamp() maths, `em` media queries, reset choices, `text-wrap`, `color-scheme`, `light-dark()`, forced colors.

## Test briefs it should pass
- Build the token layer and theme switch for a SaaS dashboard.
- A card that must work in a 3-column grid and a 280px sidebar.
