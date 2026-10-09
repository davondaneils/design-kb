# Shared foundation contract (v0.3)

Every design-kb skill builds on this. Skills may teach when and how to deviate, but every default, example, token name and cross-reference uses these values so the skills never contradict each other.

**Owner: the editor-in-chief.** Changing any value, name or checklist item here is an editor-in-chief decision, recorded in the change log at the bottom. Domains propose changes; they never edit this file on their own branch. `tools/lint.mjs` reads its scales from this file's numbers, so a change here is also a change to the lint.

## Token naming
`--{category}-{role}-{variant}`, for example `--color-text-muted`, `--space-4`, `--text-lg`, `--radius-md`, `--duration-fast`. Semantic tokens reference primitive tokens; components only use semantic tokens.

## Spacing
4px base unit. Scale: 0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (tokens `--space-0` to `--space-11` in that order, or named by pixel value in examples). Layout gaps use 16 and up; component padding uses 4 to 24.

## Type
Root 16px. Default UI scale ratio 1.25 (major third): 12, 14, 16, 20, 25, 31, 39, 49, 61. Tokens `--text-xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl`. Body line-height 1.5, headings 1.1 to 1.25; display lines of 100px and up may go to 0.95. Measure 45 to 75 characters, 66 ideal. Display sizes may use fluid `clamp()`.

Display ramp above `--text-5xl`: `--text-display` and `--text-display-2` are fluid `clamp()` values that may exceed 61px. Rules: the maximum is no more than 2.5 times the minimum, the minimum sits on the scale (39, 49 or 61), and the lint accepts any fluid size of 39px and up. Typical pair: `--text-display: clamp(49px, 7vw, 112px)` for one hero line, `--text-display-2: clamp(39px, 5vw, 80px)` for a second display moment (design-typography reference 07).

Measure in CSS: `max-inline-size: 52ch` (63 to 68 characters in every one of the eight text faces measured); keep body between about `40ch` and `56ch`; never `66ch`, which renders 81 to 86 characters in every face. `em` does not track the face: `32em` gives 61 to 77 characters depending on the face (Inter 66, Times-width serifs 77). Source: `kb/research/typography/measure-cpl.mjs`, counted the same way as the lint; design-typography `references/01-scale-measure-leading.md`. Confirm with the lint. Optional token: `--size-measure: 52ch`.

## Color roles (semantic)
`bg`, `surface`, `surface-raised`, `text`, `text-muted`, `border`, `primary`, `on-primary`, `accent`, `success`, `warning`, `danger`, `info`, `focus-ring`. Primitives are 50 to 950 ramps per hue. Light and dark themes map the same roles. Minimums: WCAG 2.2 AA (4.5:1 body text, 3:1 large text and UI components and focus indicators).

## Breakpoints (mobile first, min-width)
sm 640, md 768, lg 1024, xl 1280, 2xl 1536. Prefer container queries for components.

## Radius and elevation
Radius: 0, 4, 8, 12, 16, full. Elevation: 0 to 4 shadow levels; dark themes express elevation with lighter surfaces, not darker shadows.

Shadow recipe (design-polish `assets/polish-tokens.css`, adopted here; the values are design-polish's recommendation, opinion built on layered shadows and the Tailwind v4 scale): shadows are tinted with the darkest neutral through `--shadow-rgb` (never pure black), stack a tight contact layer and a soft ambient layer, fall straight down (x = 0, y >= 0; a negative spread is fine), and keep every layer's alpha at 0.25 or under. Elevation tokens are a ring plus a shadow. In dark themes elevation is a lighter surface step, the ring and a top highlight, with no drop shadow.

| Token | Light | Dark |
|---|---|---|
| `--shadow-rgb` | the neutral 950 as an RGB triplet, for example `31 34 36` | same |
| `--shadow-0` | `none` | `none` |
| `--shadow-1` | `0 1px 2px rgb(var(--shadow-rgb) / 0.06)` | `none` |
| `--shadow-2` | `0 1px 2px rgb(var(--shadow-rgb) / 0.06), 0 4px 12px -2px rgb(var(--shadow-rgb) / 0.08)` | `none` |
| `--shadow-3` | `0 2px 4px -1px rgb(var(--shadow-rgb) / 0.08), 0 12px 24px -6px rgb(var(--shadow-rgb) / 0.16)` | `none` |
| `--shadow-4` | `0 4px 8px -2px rgb(var(--shadow-rgb) / 0.10), 0 24px 48px -12px rgb(var(--shadow-rgb) / 0.24)` | `none` |
| `--ring` | `0 0 0 1px rgb(var(--shadow-rgb) / 0.08)` | `0 0 0 1px rgb(255 255 255 / 0.08)` |
| `--highlight` | `inset 0 1px 0 rgb(255 255 255 / 0.12)` (filled buttons) | `inset 0 1px 0 rgb(255 255 255 / 0.06)` |
| `--elevation-card` | `var(--ring), var(--shadow-1)` | `var(--ring)` |
| `--elevation-popover` | `var(--ring), var(--shadow-3)` | `var(--ring), var(--highlight)` |
| `--elevation-modal` | `var(--ring), var(--shadow-4)` | `var(--ring), var(--highlight)` |

State layers on neutral surfaces (Material 3, m3.material.io "States", accessed 2026-10-09): hover 8 percent, focus 10 percent, pressed 10 percent, dragged 16 percent of the content color. Pressed must still differ from hover: on filled controls use `--color-primary-active`, one ramp step past hover.

## Motion
Durations: instant 0 to 100ms, fast 150ms, base 200 to 250ms, slow 300 to 400ms, page 400 to 600ms. Easing: standard `cubic-bezier(0.2, 0, 0, 1)`, enter (decelerate) `cubic-bezier(0, 0, 0, 1)`, exit (accelerate) `cubic-bezier(0.3, 0, 1, 1)`. Always honor `prefers-reduced-motion`.

## Accessibility (cross-cutting)
WCAG 2.2 AA is the floor in every skill: contrast as above, visible focus, 24x24 CSS px minimum target (44x44 preferred for touch), keyboard operable, no information by color alone, reduced motion respected.

Findings every domain must know (details in design-foundations `references/accessibility.md`):
- Safari drops table semantics when a table's `display` changes (for example to `grid` or `block` for a phone reflow): restate `role="table"`, `row`, `columnheader` and `cell` (design-product-ui `references/01-tables.md`).
- Single-key shortcuts include `/` and `?`, not only letters: WCAG 2.1.4 needs a way to turn them off or remap them (design-product-ui `references/02-find-and-command.md`).
- `aria-label` on a generic `span` or `div` is prohibited; use visible `aria-hidden` text plus an sr-only full value.
- Text over images, textures and art: judge the worst pixel on a render with the text hidden, not the average (design-art-direction `references/03-composition-and-overlays.md`; `tools/lint.mjs` overlay check).
- Pages with a dark theme set `color-scheme` on `:root` so native controls and scrollbars follow.

## Token schema
One schema for every domain. Primitives hold raw values; semantic tokens point at primitives; components use semantic tokens only.

| Category | Primitive tokens | Semantic tokens | Owner domain |
|---|---|---|---|
| Color | `--color-{hue}-{50..950}`, neutrals add `975`, `990`; `--color-brand` (exact brand value) | `--color-{role}` and `--color-{role}-{variant}` for the roles above, for example `--color-text-muted`, `--color-primary-hover`, `--color-primary-active` (pressed: one step past hover, never equal to it), `--color-danger-subtle` | design-color |
| Illustration | (uses the color primitives) | `--color-illustration-surface`, `--color-illustration-line`, `--color-illustration-accent`, `--color-illustration-accent-fill`; remapped per theme like any role | design-art-direction with design-color |
| Space | `--space-0` to `--space-11` (0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128) | `--space-gap-{sm,md,lg}`, `--space-section` (map to steps, never raw px) | design-layout |
| Type size | `--text-xs` to `--text-5xl` (12 to 61) | `--text-body`, `--text-label`, `--text-heading-{1..4}`, `--text-display`, `--text-display-2` (fluid, may exceed 61, max at most 2.5x min) | design-typography |
| Measure | | `--size-measure` (52ch) | design-typography |
| Type other | `--font-{sans,serif,mono}`, `--weight-{regular,medium,semibold,bold}`, `--leading-{tight,snug,normal}` (1.1, 1.25, 1.5) | | design-typography |
| Radius | `--radius-{none,sm,md,lg,xl,full}` (0, 4, 8, 12, 16, 9999px) | `--radius-control`, `--radius-card` | design-layout |
| Elevation | `--shadow-{0..4}`, `--shadow-rgb` (tint, as space-separated RGB) | `--elevation-{card,popover,modal}` (ring plus shadow), `--ring` (1px edge), `--highlight` (dark-theme top edge) | design-layout with design-polish (recipe above) |
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
| 2 | Text contrast 4.5:1 body, 3:1 large; contrast cases axe cannot decide (text on images, gradients, overlaps) | [lint] for decidable pairs and, for axe "needs review" nodes, the worst pixel measured on a render with the text hidden (`overlay` check); [judged] only where the overlay check cannot isolate the text |
| 3 | Non-text contrast 3:1 for input borders, icons and focus indicators | [judged] (axe does not measure it); measure with `skills/design-color/assets/oklch_scale.py check` |
| 4 | Targets at least 24x24 CSS px (inline text links exempt); 44x44 preferred on touch | [lint] fail under 24, warn under 44 at 390px |
| 5 | Body line length 45 to 75 characters at 1440px, at most 75 at 390px | [lint] |
| 6 | Every font size on the type scale (fluid display sizes of 39px and up allowed with `clamp()`) | [lint] |
| 7 | Every margin, padding and gap on the spacing scale | [lint] |
| 8 | No horizontal scroll at 390px | [lint] |
| 9 | Visible focus on every element in the tab order (2px ring, 2px offset by default); focus never changes an element's shape or size | [lint] presence and shape (`focus`, `focus-shape`); [judged] 3:1 contrast of the ring, on the state sheet |
| 10 | If anything moves, `prefers-reduced-motion: reduce` removes the movement | [lint] |
| 11 | No information by color alone (errors have icon plus text, links underlined in body copy, charts labelled) | [judged] |
| 12 | Hierarchy: one clear primary action per view, headings in order, scan path obvious | [judged] (heading order partly by axe) |
| 13 | Consistency: tokens from the schema, one radius family, one icon style, aligned edges | [lint] radius family (`radius`); [judged] the rest |
| 14 | Both themes designed (not inverted) when the brief asks for dark mode; `color-scheme` set | [lint] `color-scheme`; [judged] the design |
| 15 | States: hover, focus, active, disabled, error, empty and loading exist where the page needs them; no state shifts layout | [lint] layout shift (`state-shift`) and every `?state=` URL linted; [judged] on a state sheet (every control in every state) |

## Change log
- v0.3 (2026-10-09, editor-in-chief, from the typography, product UI, art direction and polish waves' pipeline notes):
  - Measure default `32em` replaced by `max-inline-size: 52ch` (typography measured eight faces: 66ch gives 81 to 86 characters, 32em gives 61 to 77, 52ch gives 63 to 68). Optional `--size-measure`.
  - Display ramp named above `--text-5xl`: `--text-display`, `--text-display-2`, fluid, max at most 2.5x min; display lines of 100px and up may use leading 0.95.
  - State layers: hover 8, focus 10, pressed 10, dragged 16 percent (design-color said 12 for focus and pressed; aligned to Material 3 and design-polish).
  - Tokens added: `--color-primary-active`, `--color-illustration-{surface,line,accent,accent-fill}`, `--ring`, `--highlight`, `--shadow-rgb`; shadow recipe and `--shadow-0..4` values adopted from design-polish.
  - Accessibility: Safari table semantics, `/` and `?` shortcuts under 2.1.4, `aria-label` on generic elements, worst-pixel rule for text over art, `color-scheme`.
  - Checklist: item 2 gains the lint overlay check; items 9, 13, 14 and 15 gain lint rows (focus shape, radius family, `color-scheme`, state layout shift); item 15 requires a state sheet.
- v0.2 (2026-10-09, editor-in-chief): added owner note, CSS measure default (`32em`), token schema, chapter template and fundamentals checklist. Values unchanged from v0.1.
- v0.1 (2026-10-09): first contract.
