# Shared foundation contract (v0.2)

Every design-kb skill builds on this. Skills may teach when and how to deviate, but every default, example, token name and cross-reference uses these values so the skills never contradict each other.

**Owner: the editor-in-chief.** Changing any value, name or checklist item here is an editor-in-chief decision, recorded in the change log at the bottom. Domains propose changes; they never edit this file on their own branch. `tools/lint.mjs` reads its scales from this file's numbers, so a change here is also a change to the lint.

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

## Accessibility (cross-cutting)
WCAG 2.2 AA is the floor in every skill: contrast as above, visible focus, 24x24 CSS px minimum target (44x44 preferred for touch), keyboard operable, no information by color alone, reduced motion respected.

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

## Chapter template
Every domain chapter (draft and reference file) uses two layers, in this order.

**Floor: fundamentals and standards (non-negotiable)**
1. Fundamentals: numbered, testable rules. Mark each one `[lint]` if `tools/lint.mjs` checks it, `[judged]` if a person or the tester judges it.
2. Standards: the WCAG criteria, platform rules and numbers that apply, with sources.
3. Decision rules: "if X, do Y", using the token schema above.
4. Numbers: scales, ranges and defaults, matching this file.

**Ceiling: exemplar patterns and signature moves**
5. Exemplar patterns: what the sites in `kb/exemplars.md` share in this domain, with the measured value or a screenshot path for each pattern.
6. Signature moves: named, specific moves a top practitioner makes that a generalist misses, each with its reason and a shipped example.
7. Do and don't, worked examples (brief to finished choice), hand-offs to other domains.

Opinion is labelled opinion. Facts carry a source with a short quote, URL and access date (see the researcher's source policy).

## Fundamentals checklist
Every rendered test page must pass every item. One miss fails the page, however good the rest is. `[lint]` items are hard gates enforced by `node tools/lint.mjs <page.html>` (nonzero exit on any fail); `[judged]` items are checked by the tester on the screenshots from `node tools/render.mjs`.

| # | Item | How |
|---|---|---|
| 1 | WCAG 2.2 AA automated rules (axe-core tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa), light and dark scheme, 390 and 1440px | [lint] |
| 2 | Text contrast 4.5:1 body, 3:1 large; contrast cases axe cannot decide (text on images, gradients, overlaps) | [lint] for decidable pairs, [judged] for "needs review" warnings |
| 3 | Non-text contrast 3:1 for input borders, icons and focus indicators | [judged] (axe does not measure it); measure with `skills/design-color/assets/oklch_scale.py check` |
| 4 | Targets at least 24x24 CSS px (inline text links exempt); 44x44 preferred on touch | [lint] fail under 24, warn under 44 at 390px |
| 5 | Body line length 45 to 75 characters at 1440px, at most 75 at 390px | [lint] |
| 6 | Every font size on the type scale (fluid display sizes of 39px and up allowed with `clamp()`) | [lint] |
| 7 | Every margin, padding and gap on the spacing scale | [lint] |
| 8 | No horizontal scroll at 390px | [lint] |
| 9 | Visible focus on every element in the tab order (2px ring, 2px offset by default) | [lint] presence; [judged] 3:1 contrast of the ring |
| 10 | If anything moves, `prefers-reduced-motion: reduce` removes the movement | [lint] |
| 11 | No information by color alone (errors have icon plus text, links underlined in body copy, charts labelled) | [judged] |
| 12 | Hierarchy: one clear primary action per view, headings in order, scan path obvious | [judged] (heading order partly by axe) |
| 13 | Consistency: tokens from the schema, one radius family, one icon style, aligned edges | [judged] |
| 14 | Both themes designed (not inverted) when the brief asks for dark mode | [judged] |
| 15 | States: hover, focus, active, disabled, error, empty and loading exist where the page needs them | [judged] |

## Change log
- v0.2 (2026-10-09, editor-in-chief): added owner note, CSS measure default (`32em`), token schema, chapter template and fundamentals checklist. Values unchanged from v0.1.
- v0.1 (2026-10-09): first contract.
