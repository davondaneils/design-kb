# Shared foundation contract (v0.1)

Every design-kb skill builds on this. Skills may teach when and how to deviate, but every default, example, token name and cross-reference uses these values so the skills never contradict each other.

## Token naming
`--{category}-{role}-{variant}`, for example `--color-text-muted`, `--space-4`, `--text-lg`, `--radius-md`, `--duration-fast`. Semantic tokens reference primitive tokens; components only use semantic tokens.

## Spacing
4px base unit. Scale: 0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (tokens `--space-0` to `--space-11` in that order, or named by pixel value in examples). Layout gaps use 16 and up; component padding uses 4 to 24.

## Type
Root 16px. Default UI scale ratio 1.25 (major third): 12, 14, 16, 20, 25, 31, 39, 49, 61. Tokens `--text-xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl`. Body line-height 1.5, headings 1.1 to 1.25. Measure 45 to 75 characters, 66 ideal. Display sizes may use fluid `clamp()`.

## Color roles (semantic)
`bg`, `surface`, `surface-raised`, `text`, `text-muted`, `border`, `primary`, `on-primary`, `accent`, `success`, `warning`, `danger`, `info`, `focus-ring`. Primitives are 50 to 950 ramps per hue. Light and dark themes map the same roles. Minimums: WCAG 2.2 AA (4.5:1 body text, 3:1 large text and UI components and focus indicators).

## Breakpoints (mobile first, min-width)
sm 640, md 768, lg 1024, xl 1280, 2xl 1536. Prefer container queries for components.

## Radius and elevation
Radius: 0, 4, 8, 12, 16, full. Elevation: 0 to 4 shadow levels; dark themes express elevation with lighter surfaces, not darker shadows.

## Motion
Durations: instant 0 to 100ms, fast 150ms, base 200 to 250ms, slow 300 to 400ms, page 400 to 600ms. Easing: standard `cubic-bezier(0.2, 0, 0, 1)`, enter (decelerate) `cubic-bezier(0, 0, 0, 1)`, exit (accelerate) `cubic-bezier(0.3, 0, 1, 1)`. Always honor `prefers-reduced-motion`.

## Accessibility (cross-cutting)
WCAG 2.2 AA is the floor in every skill: contrast as above, visible focus, 24x24 CSS px minimum target (44x44 preferred for touch), keyboard operable, no information by color alone, reduced motion respected.
