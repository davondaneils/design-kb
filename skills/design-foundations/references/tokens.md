# Tokens and scales

Mirror of `kb/FOUNDATIONS.md` v0.2 (token sections). FOUNDATIONS is the source of truth: if this file and FOUNDATIONS differ, FOUNDATIONS wins and the librarian re-syncs this file. Only the editor-in-chief changes the values.

## Token naming
`--{category}-{role}-{variant}`, for example `--color-text-muted`, `--space-4`, `--text-lg`, `--radius-md`, `--duration-fast`. Semantic tokens reference primitive tokens; components only use semantic tokens.

## Spacing
4px base unit. Scale: 0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (tokens `--space-0` to `--space-11` in that order, or named by pixel value in examples). Layout gaps use 16 and up; component padding uses 4 to 24.

## Type
Root 16px. Default UI scale ratio 1.25 (major third): 12, 14, 16, 20, 25, 31, 39, 49, 61. Tokens `--text-xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl`. Body line-height 1.5, headings 1.1 to 1.25. Measure 45 to 75 characters, 66 ideal. Display sizes may use fluid `clamp()`.

Measure in CSS: `ch` is the width of the digit 0, which is wider than an average character in most sans faces, so `max-width: 66ch` renders about 75 to 85 characters (measured with `tools/lint.mjs` in Inter at 16px: 66ch gave 77 to 84, 58ch gave 80). Default to `max-width: 32em` (about 65 to 70 characters in Inter, 16px) and confirm with the lint.

## Color roles (semantic)
`bg`, `surface`, `surface-raised`, `text`, `text-muted`, `border`, `primary`, `on-primary`, `accent`, `success`, `warning`, `danger`, `info`, `focus-ring`. Primitives are 50 to 950 ramps per hue. Light and dark themes map the same roles. Minimums: WCAG 2.2 AA (4.5:1 body text, 3:1 large text and UI components and focus indicators).

## Breakpoints (mobile first, min-width)
sm 640, md 768, lg 1024, xl 1280, 2xl 1536. Prefer container queries for components.

## Radius and elevation
Radius: 0, 4, 8, 12, 16, full. Elevation: 0 to 4 shadow levels; dark themes express elevation with lighter surfaces, not darker shadows.

## Motion
Durations: instant 0 to 100ms, fast 150ms, base 200 to 250ms, slow 300 to 400ms, page 400 to 600ms. Easing: standard `cubic-bezier(0.2, 0, 0, 1)`, enter (decelerate) `cubic-bezier(0, 0, 0, 1)`, exit (accelerate) `cubic-bezier(0.3, 0, 1, 1)`. Always honor `prefers-reduced-motion`.

## Token schema
One schema for every domain. Primitives hold raw values; semantic tokens point at primitives; components use semantic tokens only.

| Category | Primitive tokens | Semantic tokens | Owner domain |
|---|---|---|---|
| Color | `--color-{hue}-{50..950}`, neutrals add `975`, `990`; `--color-brand` (exact brand value) | `--color-{role}` and `--color-{role}-{variant}` for the roles above, for example `--color-text-muted`, `--color-primary-hover`, `--color-danger-subtle` | design-color |
| Space | `--space-0` to `--space-11` (0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128) | `--space-gap-{sm,md,lg}`, `--space-section` (map to steps, never raw px) | design-layout |
| Type size | `--text-xs` to `--text-5xl` (12 to 61) | `--text-body`, `--text-label`, `--text-heading-{1..4}`, `--text-display` (fluid allowed) | design-typography |
| Type other | `--font-{sans,serif,mono}`, `--weight-{regular,medium,semibold,bold}`, `--leading-{tight,snug,normal}` (1.1, 1.25, 1.5) | | design-typography |
| Radius | `--radius-{none,sm,md,lg,xl,full}` (0, 4, 8, 12, 16, 9999px) | `--radius-control`, `--radius-card` | design-layout |
| Elevation | `--shadow-{0..4}` | `--elevation-{card,popover,modal}` | design-layout |
| Motion | `--duration-{instant,fast,base,slow,page}`, `--ease-{standard,enter,exit}` | `--motion-{hover,enter,exit}` | design-motion |
| Breakpoint | sm 640, md 768, lg 1024, xl 1280, 2xl 1536 (media and container queries cannot read custom properties, so use the numbers) | | design-layout |

Rules: light and dark themes remap the same semantic names; a component never names a primitive; a new token needs a role no existing token covers.

## Starter token file (non-color)
Paste into `@layer tokens`. Values are the contract above; color primitives and roles come from design-color (`references/ui-tokens-themes.md`), shadow recipes from design-layout.

```css
:root {
  --space-0: 0; --space-1: 2px; --space-2: 4px; --space-3: 8px; --space-4: 12px; --space-5: 16px;
  --space-6: 24px; --space-7: 32px; --space-8: 48px; --space-9: 64px; --space-10: 96px; --space-11: 128px;

  --text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1rem; --text-lg: 1.25rem; --text-xl: 1.5625rem;
  --text-2xl: 1.9375rem; --text-3xl: 2.4375rem; --text-4xl: 3.0625rem; --text-5xl: 3.8125rem;
  --leading-tight: 1.1; --leading-snug: 1.25; --leading-normal: 1.5;
  --weight-regular: 400; --weight-medium: 500; --weight-semibold: 600; --weight-bold: 700;

  --radius-none: 0; --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px; --radius-full: 9999px;

  --duration-instant: 100ms; --duration-fast: 150ms; --duration-base: 200ms; --duration-slow: 300ms; --duration-page: 400ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1); --ease-enter: cubic-bezier(0, 0, 0, 1); --ease-exit: cubic-bezier(0.3, 0, 1, 1);
}
```
