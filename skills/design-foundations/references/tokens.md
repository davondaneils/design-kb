# Tokens and scales

Mirror of `kb/FOUNDATIONS.md` v0.4 (token sections, icons, sizes and content mechanics). FOUNDATIONS is the source of truth: if this file and FOUNDATIONS differ, FOUNDATIONS wins and the librarian re-syncs this file. Only the editor-in-chief changes the values.

## Token naming
`--{category}-{role}-{variant}`, for example `--color-text-muted`, `--space-4`, `--text-lg`, `--radius-md`, `--duration-fast`. Semantic tokens reference primitive tokens; components only use semantic tokens.

## Spacing
4px base unit. Scale: 0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (tokens `--space-0` to `--space-11` in that order, or named by pixel value in examples). Layout gaps use 16 and up; component padding uses 4 to 24.

## Type
Root 16px. Default UI scale ratio 1.25 (major third): 12, 14, 16, 20, 25, 31, 39, 49, 61. Tokens `--text-xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl`. Body line-height 1.5, headings 1.1 to 1.25; display lines of 100px and up may go to 0.95. Measure 45 to 75 characters, 66 ideal. Display sizes may use fluid `clamp()`.

Display ramp above `--text-5xl`: `--text-display` and `--text-display-2` are fluid `clamp()` values that may exceed 61px. Rules: the maximum is no more than 2.5 times the minimum, the minimum sits on the scale (39, 49 or 61), and the lint accepts any fluid size of 39px and up. Typical pair: `--text-display: clamp(49px, 7vw, 112px)` for one hero line, `--text-display-2: clamp(39px, 5vw, 80px)` for a second display moment (design-typography reference 07).

Measure in CSS: `max-inline-size: 52ch` (63 to 68 characters in every one of the eight text faces measured); keep body between about `40ch` and `56ch`; never `66ch`, which renders 81 to 86 characters in every face. `em` does not track the face: `32em` gives 61 to 77 characters depending on the face (Inter 66, Times-width serifs 77). Source: `kb/research/typography/measure-cpl.mjs`, counted the same way as the lint; design-typography `references/01-scale-measure-leading.md`. Confirm with the lint. Optional token: `--size-measure: 52ch`.

## Color roles (semantic)
`bg`, `surface`, `surface-raised`, `surface-sunken`, `text`, `text-muted`, `text-muted-on-tint`, `border`, `primary`, `on-primary`, `accent`, `success`, `warning`, `danger`, `info`, `focus-ring`. Primitives are 50 to 950 ramps per hue. Light and dark themes map the same roles. Minimums: WCAG 2.2 AA (4.5:1 body text, 3:1 large text and UI components and focus indicators).

- `surface-sunken`: a well below the page (inputs on a surface, code blocks, table zebra, disabled fills, the track of a meter). One step darker than `bg` in light, one step darker than `surface` in dark.
- `text-muted-on-tint`: muted text on any tinted or sunken surface (`surface-sunken`, every `*-subtle` status fill, feature bands). `text-muted` is tuned for `bg` and `surface` only and often fails on a tint: the combined pages measured 4.38:1 and 4.24:1 there (`kb/tests/design-conversion.md`). Rule: measure every muted-text and tint pair in both themes; it reaches 4.5:1, or the text uses `text-muted-on-tint` (one ramp step darker in light, lighter in dark) or `text`.

## Breakpoints (mobile first, min-width)
sm 640, md 768, lg 1024, xl 1280, 2xl 1536. Prefer container queries for components.

Container query conditions are written in `rem` (40rem = 640px at the 16px root), never `em`: the spec evaluates relative units in a container condition against the query container's own computed values (W3C css-contain-3), so `44em` inside a 14px dashboard content area fired at 616px, not 704px (`kb/research/frontend/07-measured-build-quality.md` finding 7). `px` is allowed; `rem` is the default so media and container numbers read the same.

## Radius and elevation
Radius: 0, 4, 8, 12, 16, full. Elevation: 0 to 4 shadow levels; dark themes express elevation with lighter surfaces, not darker shadows.

Shadow recipe (design-polish `assets/polish-tokens.css`, adopted here; the values are design-polish's recommendation, opinion built on layered shadows and the Tailwind v4 scale): shadows are tinted with the darkest neutral through `--shadow-rgb` (never pure black), stack a tight contact layer and a soft ambient layer, fall straight down (x = 0, y >= 0; a negative spread is fine), and keep every layer's alpha at 0.25 or under. Elevation tokens are a ring plus a shadow. In dark themes elevation is a lighter surface step, the ring and a top highlight, with no drop shadow.

| Token | Light | Dark |
|---|---|---|
| `--shadow-rgb` | the neutral 950 as an RGB triplet, for example `31 34 36` | same |
| `--shadow-0` | `0 0 0 0 transparent` | `0 0 0 0 transparent` |
| `--shadow-1` | `0 1px 2px rgb(var(--shadow-rgb) / 0.06)` | `0 0 0 0 transparent` |
| `--shadow-2` | `0 1px 2px rgb(var(--shadow-rgb) / 0.06), 0 4px 12px -2px rgb(var(--shadow-rgb) / 0.08)` | `0 0 0 0 transparent` |
| `--shadow-3` | `0 2px 4px -1px rgb(var(--shadow-rgb) / 0.08), 0 12px 24px -6px rgb(var(--shadow-rgb) / 0.16)` | `0 0 0 0 transparent` |
| `--shadow-4` | `0 4px 8px -2px rgb(var(--shadow-rgb) / 0.10), 0 24px 48px -12px rgb(var(--shadow-rgb) / 0.24)` | `0 0 0 0 transparent` |
| `--ring` | `0 0 0 1px rgb(var(--shadow-rgb) / 0.08)` | `0 0 0 1px rgb(255 255 255 / 0.08)` |
| `--highlight` | `inset 0 1px 0 rgb(255 255 255 / 0.12)` (filled buttons) | `inset 0 1px 0 rgb(255 255 255 / 0.06)` |
| `--elevation-card` | `var(--ring), var(--shadow-1)` | `var(--ring)` |
| `--elevation-popover` | `var(--ring), var(--shadow-3)` | `var(--ring), var(--highlight)` |
| `--elevation-modal` | `var(--ring), var(--shadow-4)` | `var(--ring), var(--highlight)` |

Never `none` inside a shadow token: tokens get composed into lists (`box-shadow: var(--highlight), var(--shadow-1)`), a list that contains `none` is invalid, so the whole declaration computes to `none` and the dark-theme highlight never renders (measured with getComputedStyle on both combined pages; `kb/research/frontend/07-measured-build-quality.md` finding 5). A transparent zero layer composes and paints nothing; the lint ignores it.

State layers on neutral surfaces (Material 3, m3.material.io "States", accessed 2026-10-09): hover 8 percent, focus 10 percent, pressed 10 percent, dragged 16 percent of the content color. Pressed must still differ from hover: on filled controls use `--color-primary-active`, one ramp step past hover.

## Motion
Durations: instant 0 to 100ms, fast 150ms, base 200 to 250ms, slow 300 to 400ms, page 400 to 600ms. Easing: standard `cubic-bezier(0.2, 0, 0, 1)`, enter (decelerate) `cubic-bezier(0, 0, 0, 1)`, exit (accelerate) `cubic-bezier(0.3, 0, 1, 1)`. Always honor `prefers-reduced-motion`.

- **Semantic pairs** (a duration plus a curve, for transition shorthands; design-motion `assets/motion-tokens.css`): `--motion-hover: var(--duration-instant) var(--ease-standard)`, `--motion-enter: var(--duration-base) var(--ease-enter)`, `--motion-exit: var(--duration-fast) var(--ease-exit)`. Use: `transition: background-color var(--motion-hover)`.
- **`linear` is allowed** for loops (spinners, marquees), scroll-linked motion (the scroll is the easing) and reveals whose x axis is time (a chart drawing on along a date axis). Never on an object that starts and stops (design-motion SKILL.md fundamental 6 and signature move 17).
- **Marketing reveal ceiling (opinion).** Anything a person triggers stays at 600ms or less. A marketing page may give **one hero reveal per page** up to **800ms**, on `--ease-enter` or a strong ease-out, played once on load and removed under reduced motion. Measured exemplars do this: Stripe reveal transforms `.8s cubic-bezier(.165,.84,.44,1)` (`kb/teardowns/stripe-home.md`) and Raycast extension cards `.7s cubic-bezier(.215,.61,.355,1)` (`kb/teardowns/raycast-home.md`). NN/g puts most UI animation at 100 to 500ms and says about 500ms starts to "feel like a drag" (`kb/research/motion/02-timing-easing.md`), which is why the exception covers one unprompted entrance only. Everywhere else, 600ms is the ceiling.
- **Reduced motion** (`prefers-reduced-motion: reduce`): nothing moves, scales, rotates or resizes. Opacity and color changes may stay at `--duration-fast` (150ms) or less, played once; loops stop. The lint fails any animation whose keyframes change position, size or transform under reduce, and warns on opacity or color animations over 150ms or looping. This replaces the v0.3 lint's flat 100ms threshold, which failed the 150ms fades that `accessibility.md` allows.
- Scripts read motion tokens from CSS (`getComputedStyle`); no millisecond literals in JS (design-motion).

## Icons
Owner: design-graphic with design-polish. One icon set per product: one grid, one stroke width, one cap, one join, `currentColor` for ink.

| Token | Value | Use |
|---|---|---|
| `--size-icon-sm` | 12px | inline with `--text-xs` meta text |
| `--size-icon-md` | 16px | default, beside 14 and 16px text |
| `--size-icon-lg` | 20px | beside 20px text, list leading icons |
| `--size-icon-xl` | 24px | toolbars, tab bars, touch-first screens |
| `--icon-stroke` | 1.5px | set beside font weight: heavier text gets a heavier stroke; keep it constant across sizes with `vector-effect: non-scaling-stroke` or redraw per size (design-graphic `references/02-icon-systems.md`) |

Rules: one `stroke-linecap` and one `stroke-linejoin` per page; no hard-coded `fill` or `stroke` colors inside icons (use `currentColor` or a token); ink stays at least 1px inside a 16px box. The lint checks caps, joins and colors (`icons`); `skills/design-graphic/assets/icon_audit.mjs` adds ink volume and pixel blur as prompts to look. Measured case for the rule: the combined dashboard passed the v0.3 lint with round and butt caps, round and miter joins, and `#ffffff` inside status icons (design-graphic pipeline notes).

## Sizes
Control and row heights (design-layout, design-product-ui): `--size-control-sm` 32px, `--size-control-md` 40px, `--size-control-lg` 48px. 40 is a size, not a spacing step; padding and gaps still come from the spacing scale. Touch: 44px minimum on iOS and the web, 48dp on native Android (Material).

## Content mechanics
One sheet for every skill's examples and every test page (design-copy `references/06-copy-in-context.md`; quotes and dates in `kb/research/copy/06-copy-in-context.md`):
- **Clock:** US English uses the 12-hour clock, "2:05 pm", "3 pm" (no ":00"). Polaris: "Use the 12-hour clock, followed by am or pm"; Mailchimp: "Use numerals and am or pm, with a space in between." One clock per page.
- **Dates:** "Tue, Oct 13" in UI; absolute dates for money, shipping and deadlines, never "this Friday". Check every weekday against the year (`claims_inventory.mjs` flags a wrong one).
- **No line breaks inside** a date, a time, a price, a range or a number and its unit: no-break spaces inside "Tue,&nbsp;Oct&nbsp;13", "2:05&nbsp;pm", "1,100&nbsp;to&nbsp;2,100"; a narrow no-break space before units ("340&#8239;g").
- **Numbers:** numerals, commas from 1,000, spelled out only at the start of a sentence (Polaris, Mailchimp); a true minus for negatives in data.
- **Case and spelling:** sentence case for headings, buttons, menus and tabs (Microsoft, GOV.UK); US spelling for US brands ("meters").
- **Truth:** every number in copy matches the data or source it summarises; each promise has one wording; one verb per action across the page. The combined pages carried three false numbers past the critic, the tester and a blind rank (design-copy pipeline notes); only a claim-by-claim check catches them.

## Token schema
One schema for every domain. Primitives hold raw values; semantic tokens point at primitives; components use semantic tokens only.

| Category | Primitive tokens | Semantic tokens | Owner domain |
|---|---|---|---|
| Color | `--color-{hue}-{50..950}`, neutrals add `975`, `990`; `--color-brand` (exact brand value) | `--color-{role}` and `--color-{role}-{variant}` for the roles above, for example `--color-text-muted`, `--color-text-muted-on-tint`, `--color-surface-sunken`, `--color-primary-hover`, `--color-primary-active` (pressed: one step past hover, never equal to it), `--color-danger-subtle` | design-color |
| Illustration | (uses the color primitives) | `--color-illustration-surface`, `--color-illustration-line`, `--color-illustration-accent`, `--color-illustration-accent-fill`; remapped per theme like any role | design-art-direction with design-color |
| Space | `--space-0` to `--space-11` (0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128) | `--space-gap-{sm,md,lg}`, `--space-section` (map to steps, never raw px) | design-layout |
| Type size | `--text-xs` to `--text-5xl` (12 to 61) | `--text-body`, `--text-label`, `--text-heading-{1..4}`, `--text-display`, `--text-display-2` (fluid, may exceed 61, max at most 2.5x min) | design-typography |
| Type other | `--font-{sans,serif,mono}`, `--weight-{regular,medium,semibold,bold}`, `--leading-{tight,snug,normal}` (1.1, 1.25, 1.5) | | design-typography |
| Radius | `--radius-{none,sm,md,lg,xl,full}` (0, 4, 8, 12, 16, 9999px) | `--radius-control`, `--radius-card` | design-layout |
| Elevation | `--shadow-{0..4}`, `--shadow-rgb` (tint, as space-separated RGB) | `--elevation-{card,popover,modal}` (ring plus shadow), `--ring` (1px edge), `--highlight` (dark-theme top edge) | design-layout with design-polish (recipe above) |
| Motion | `--duration-{instant,fast,base,slow,page}`, `--ease-{standard,enter,exit}`; the `linear` keyword for loops, scroll-linked and time-axis motion | `--motion-{hover,enter,exit}` (values in Motion above) | design-motion |
| Icon | `--size-icon-{sm,md,lg,xl}` (12, 16, 20, 24) | `--icon-stroke` (1.5px) | design-graphic with design-polish |
| Size | `--size-control-{sm,md,lg}` (32, 40, 48) | `--size-measure` (52ch) | design-layout; measure: design-typography |
| Breakpoint | sm 640, md 768, lg 1024, xl 1280, 2xl 1536 (media and container queries cannot read custom properties, so use the numbers; container conditions in `rem`: 40rem, 48rem, 64rem, 80rem, 96rem) | | design-layout |

Rules: light and dark themes remap the same semantic names; a component never names a primitive; a new token needs a role no existing token covers.

## Starter token file (non-color)
Paste into `@layer tokens`. Values are the contract above; color primitives and roles come from design-color (`references/ui-tokens-themes.md`), the shadow recipe is in Radius and elevation above (dark levels are `0 0 0 0 transparent`, never `none`).

```css
:root {
  --space-0: 0; --space-1: 2px; --space-2: 4px; --space-3: 8px; --space-4: 12px; --space-5: 16px;
  --space-6: 24px; --space-7: 32px; --space-8: 48px; --space-9: 64px; --space-10: 96px; --space-11: 128px;

  --text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1rem; --text-lg: 1.25rem; --text-xl: 1.5625rem;
  --text-2xl: 1.9375rem; --text-3xl: 2.4375rem; --text-4xl: 3.0625rem; --text-5xl: 3.8125rem;
  --leading-tight: 1.1; --leading-snug: 1.25; --leading-normal: 1.5;
  --weight-regular: 400; --weight-medium: 500; --weight-semibold: 600; --weight-bold: 700;
  --size-measure: 52ch;

  --radius-none: 0; --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px; --radius-full: 9999px;

  --size-control-sm: 32px; --size-control-md: 40px; --size-control-lg: 48px;
  --size-icon-sm: 12px; --size-icon-md: 16px; --size-icon-lg: 20px; --size-icon-xl: 24px; --icon-stroke: 1.5px;

  --duration-instant: 100ms; --duration-fast: 150ms; --duration-base: 200ms; --duration-slow: 300ms; --duration-page: 400ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1); --ease-enter: cubic-bezier(0, 0, 0, 1); --ease-exit: cubic-bezier(0.3, 0, 1, 1);
  --motion-hover: var(--duration-instant) var(--ease-standard);
  --motion-enter: var(--duration-base) var(--ease-enter);
  --motion-exit: var(--duration-fast) var(--ease-exit);
}
```
