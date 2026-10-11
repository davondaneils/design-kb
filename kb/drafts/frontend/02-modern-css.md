# 02 Modern CSS architecture and tokens

Sources: kb/research/frontend/02-modern-css.md and the design-kb foundation contract (kb/FOUNDATIONS.md). Opinion is marked (opinion).

## Principles
1. Tokens are the contract between design and code. Primitives hold raw values, semantic tokens hold meaning, components use only semantic tokens (foundation contract).
2. Control the cascade by architecture, not by specificity. `@layer` decides who wins; selectors stay flat (MDN `@layer`).
3. Components respond to their container, pages respond to the viewport. Media queries for page layout, container queries for components (foundation contract, MDN).
4. Write for every writing direction. Logical properties by default.
5. Users own their settings: font size, zoom, color scheme, contrast, motion. CSS adapts to them; it never overrides them.

## Token file (default, matches the foundation contract)
```css
@layer reset, vendor, tokens, base, layout, components, utilities;

@layer tokens {
  :root {
    color-scheme: light dark;

    /* Spacing: 4px base. Index tokens map to 0 2 4 8 12 16 24 32 48 64 96 128 px */
    --space-0: 0;        --space-1: 0.125rem; --space-2: 0.25rem;  --space-3: 0.5rem;
    --space-4: 0.75rem;  --space-5: 1rem;     --space-6: 1.5rem;   --space-7: 2rem;
    --space-8: 3rem;     --space-9: 4rem;     --space-10: 6rem;    --space-11: 8rem;

    /* Type: root 16px, ratio 1.25 => 12 14 16 20 25 31 39 49 61 px */
    --text-xs: 0.75rem;   --text-sm: 0.875rem;  --text-base: 1rem;
    --text-lg: 1.25rem;   --text-xl: 1.5625rem; --text-2xl: 1.9375rem;
    /* Display sizes are fluid from 360px to 1280px viewports. max / min <= 2.5 (WCAG 1.4.4) */
    --text-3xl: clamp(1.5625rem, 1.2201rem + 1.5217vw, 2.4375rem); /* 25 -> 39 */
    --text-4xl: clamp(1.9375rem, 1.4973rem + 1.9565vw, 3.0625rem); /* 31 -> 49 */
    --text-5xl: clamp(2.4375rem, 1.8995rem + 2.3913vw, 3.8125rem); /* 39 -> 61 */
    --leading-body: 1.5;  --leading-heading: 1.15;

    /* Radius */
    --radius-none: 0; --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
    --radius-xl: 16px; --radius-full: 9999px;

    /* Motion */
    --duration-instant: 100ms; --duration-fast: 150ms; --duration-base: 200ms;
    --duration-slow: 300ms;    --duration-page: 400ms;
    --ease-standard: cubic-bezier(0.2, 0, 0, 1);
    --ease-enter: cubic-bezier(0, 0, 0, 1);
    --ease-exit: cubic-bezier(0.3, 0, 1, 1);

    /* Color: semantic roles reference primitives (50 to 950 ramps, defined by design-color) */
    --color-bg:             light-dark(var(--neutral-50),  var(--neutral-950));
    --color-surface:        light-dark(#fff,               var(--neutral-900));
    --color-surface-raised: light-dark(#fff,               var(--neutral-800));
    --color-text:           light-dark(var(--neutral-900), var(--neutral-50));
    --color-text-muted:     light-dark(var(--neutral-600), var(--neutral-400));
    --color-border:         light-dark(var(--neutral-200), var(--neutral-700));
    --color-primary:        light-dark(var(--blue-600),    var(--blue-400));
    --color-on-primary:     light-dark(#fff,               var(--neutral-950));
    --color-focus-ring:     light-dark(var(--blue-700),    var(--blue-300));
    /* accent, success, warning, danger, info follow the same pattern */
  }
  :root[data-theme="light"] { color-scheme: light; }
  :root[data-theme="dark"]  { color-scheme: dark; }
}
```
Rules for this file:
- Primitive values (`--blue-600`) come from design-color. This skill only wires them. Every pair must pass WCAG 2.2 AA (4.5:1 body, 3:1 large text, UI parts and focus rings) in both themes.
- Dark theme elevation uses lighter surfaces (`surface` to `surface-raised`), not darker shadows (foundation contract).
- `light-dark()` only works when `color-scheme` is set. The `data-theme` attribute gives a manual override without duplicating any color (web.dev).
- Register tokens you animate or need typed: `@property --color-primary { syntax: '<color>'; inherits: true; initial-value: #2563eb; }`.
- Custom properties cannot be used inside media query conditions. Breakpoints are literal values.

## Cascade layers
- Order: `reset, vendor, tokens, base, layout, components, utilities`. Later wins, regardless of specificity (MDN).
- Import third-party CSS into a low layer: `@import url("vendor.css") layer(vendor);`. Now your component styles beat it without `!important`.
- Unlayered styles beat every layer. Keep nothing unlayered except deliberate emergency overrides, or a third-party widget you cannot control will win everything.
- `!important` inverts layer order. A `!important` in `reset` beats one in `utilities`. Use that for real invariants only (for example `[hidden] { display: none !important; }` in reset).
- Base styles in `:where()` so they carry zero specificity: `:where(ul[role="list"]) { list-style: none; }`.
- Tailwind v4 already emits `theme, base, components, utilities`; do not fight it, add your layers around it (Tailwind docs).

## Breakpoints and queries
- Foundation breakpoints, mobile first: sm 640, md 768, lg 1024, xl 1280, 2xl 1536.
- Write media queries in `em` so they move with the user's default font size: `@media (width >= 48em)` is 768px at default settings (opinion, common expert practice; `rem` and `em` in media queries both resolve against the browser default).
- Components: `container: card / inline-size;` then `@container card (width >= 30em) { ... }`.
- Container trap: an `inline-size` container cannot take its width from its content. Inside a shrink-to-fit parent (auto grid column, flex item with no basis, `inline-block`, absolutely positioned box) it collapses toward zero. Give the container a definite width from its parent (`width: 100%`, `flex: 1`, `minmax(0, 1fr)`).
- `cqi` units size type and spacing to the component: `font-size: clamp(var(--text-lg), 4cqi, var(--text-2xl));`. Without a container they silently fall back to viewport units.
- Container style queries are still an Interop 2026 focus area (V): enhancement only.
- Hover styles go behind `@media (hover: hover) and (pointer: fine)` so touch screens do not get sticky hover states.

## Fluid type that passes zoom
- vw does not grow with browser zoom. A clamp() with a vw-only middle or a low max can stop text reaching 200%, which fails WCAG 1.4.4 (Roselli).
- Rule: preferred value is `rem + vw`; `max <= 2.5 x min` (Barvian). All foundation display tokens above are about 1.56x.
- Use fluid sizes for display type only (3xl and up). Body and UI text stay fixed rem: users expect 16px body and fluid body text gains nothing (foundation contract; opinion).
- Formula, for min size `a` px at viewport `v1` and max `b` px at `v2`: slope = (b - a) / (v2 - v1); intercept = a - slope x v1; write `clamp(a/16 rem, intercept/16 rem + slope x 100 vw, b/16 rem)`.
- Test: zoom to 200% and 400% in Chrome and 300% in Firefox at 1280px wide; text must reach 2x its unzoomed size.
- Never set `html { font-size: 62.5% }` or any px root. Root stays 100% (16px default) so user preferences apply.

## Logical properties (default)
| Physical | Logical |
|---|---|
| `margin-left/right` | `margin-inline-start/end`, `margin-inline` |
| `padding-top/bottom` | `padding-block-start/end`, `padding-block` |
| `width / height` | `inline-size / block-size` (use where the axis matters for writing mode) |
| `left / right` | `inset-inline-start / end` |
| `border-top-left-radius` | `border-start-start-radius` |
| `text-align: left` | `text-align: start` |
Keep physical properties only for things that are physical (a shadow cast down-right, a drop of light from above).

## Viewport units
- `100vh` on mobile includes the area under the browser toolbar. Use `100svh` for hero sections (stable, never covered) and `100dvh` only for app shells that must track the toolbar (it relayouts as the toolbar moves) (opinion, based on unit definitions).

## Reset (default, adapted from Josh W. Comeau)
```css
@layer reset {
  *, *::before, *::after { box-sizing: border-box; }
  *:not(dialog) { margin: 0; }
  @media (prefers-reduced-motion: no-preference) {
    html { interpolate-size: allow-keywords; } /* Chromium only; harmless elsewhere */
  }
  body { line-height: var(--leading-body, 1.5); -webkit-font-smoothing: antialiased; }
  img, picture, video, canvas, svg { display: block; max-width: 100%; }
  img, video { height: auto; }
  input, button, textarea, select { font: inherit; }
  p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
  p { text-wrap: pretty; }
  h1, h2, h3, h4, h5, h6 { text-wrap: balance; line-height: var(--leading-heading, 1.15); }
  [hidden] { display: none !important; }
}
```
`img { height: auto }` keeps the aspect ratio when `width` and `height` attributes are set and CSS changes the width.

## Modern features: use now vs enhance (status October 2026)
| Use freely (Baseline widely available) | Use with fallback (Baseline newly available or partial) | Enhancement only |
|---|---|---|
| custom properties, `@layer`, nesting, `:has()`, `:is()` / `:where()`, size container queries, logical properties, `clamp()`, `aspect-ratio`, `gap` in flex, `:focus-visible`, `dialog`, `inert` | `@scope` (Dec 2025), anchor positioning (Jan 2026), same-document view transitions (Oct 2025), `popover`, `light-dark()`, `text-wrap: balance / pretty`, `sizes="auto"` | container style queries, scroll-driven animations, `interpolate-size`, `appearance: base-select`, `field-sizing`, `contrast-color()`, `@starting-style` where unsupported |
Check MDN or webstatus.dev before shipping anything in the middle and right columns; this table is dated.

## Forced colors (Windows contrast themes)
- Outlines and borders survive; backgrounds, box-shadows and most colors are replaced by system colors.
- Any control whose boundary is only a background or shadow disappears. Add `outline: 2px solid transparent` or a transparent border: it becomes visible in forced colors.
- Test with `@media (forced-colors: active)` emulation in DevTools. Use system colors (`CanvasText`, `LinkText`, `Highlight`, `ButtonText`) inside that query when you must restore meaning, for example a selected state.

## Do and don't
| Do | Don't |
|---|---|
| `padding-inline: var(--space-5)` | `padding: 0 17px` |
| `@import url(lib.css) layer(vendor)` | raising specificity with `#app .x .y` to beat a library |
| `clamp(2.4375rem, 1.8995rem + 2.3913vw, 3.8125rem)` | `font-size: 5vw` |
| `transition: transform var(--duration-fast) var(--ease-standard)` | `transition: all .3s` |
| one container query per component | media queries inside a reusable card |

## Worked examples
1. Card in a 3-column grid and a 280px sidebar. `.card-wrap { container: card / inline-size; }`. Default layout stacks (image above text). `@container card (width >= 30em)` switches to a side-by-side grid. Grid columns use `repeat(auto-fill, minmax(min(100%, 18rem), 1fr))`, so the wrapper always has a definite width. Result: one component, two contexts, no breakpoint coupling.
2. Theme switch with system default. Three-option control (System, Light, Dark). System removes `data-theme`; the others set it. A 3-line inline script in `<head>` reads the stored choice before first paint to avoid a flash. All colors already flip through `light-dark()`, so the switch touches one attribute.
3. Overriding a date-picker library that ships `.dp .dp-day.selected { ... }`. Import it into `layer(vendor)`; write `.dp-day[aria-selected="true"] { background: var(--color-primary); }` in `components`. It wins at lower specificity. No `!important`.

## Hand-offs
- Primitive palette values and contrast pairs: design-color.
- Type scale choice, pairing and measure (45 to 75 characters, 66 ideal): design-typography.
- Grid, spacing rhythm and breakpoints by page type: design-layout.
- Durations, easing and choreography: design-motion.
