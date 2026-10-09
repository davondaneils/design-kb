# 02 Depth: borders, shadows, surface contrast and hairlines

Depth tells the eye what sits on what. Done well it is invisible: you feel the structure and never notice a line. Done badly it is the clearest sign of a template: a gray border and a drop shadow and a background change on the same card, shadows falling in three directions, dark mode cards floating in black smoke.

FOUNDATIONS fixes elevation at `--shadow-0` to `--shadow-4` with semantic `--elevation-{card,popover,modal}` and says dark themes lift with lighter surfaces. It leaves the recipes open; this chapter supplies them.

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **One separation method per boundary.** A boundary between two areas is drawn by one of: a border, an elevation token (`--elevation-*`, which bundles a ring with a shadow or highlight), or a surface step alone. An elevation token may sit on a surface step, because raised things are lighter as well as lifted. A border plus a separately declared shadow plus a background change at the same edge is the template look. [judged; lint proposal]
2. **One light source.** Every shadow on the page falls the same way: down, y offset positive, x offset 0. Elevation changes size and blur, never direction (Comeau: "every shadow on the page should share the same ratio"). [judged; lint proposal]
3. **Edges that identify a control reach 3:1** (input borders, checkbox and radio outlines, toggle tracks), WCAG 1.4.11. Decorative dividers and card edges do not need 3:1 and should not have it. [judged]
4. **Dark themes lift with lighter surfaces**, not darker or bigger shadows: `--color-bg` < `--color-surface` < `--color-surface-raised` in lightness (FOUNDATIONS; Apple HIG: elevated colors "are brighter, making foreground interfaces appear to advance"). [judged]
5. **Nothing depends on a shadow alone to exist.** Forced colors mode sets `box-shadow` to none (MDN). Buttons, inputs, cards that open something, popovers and dialogs keep a border, or a transparent border or outline that the OS can paint. [judged; lint proposal]
6. **Shadow tokens only.** No ad hoc `box-shadow` on components; focus rings are outlines, not shadows. [judged; lint proposal]

### Standards
| Rule | Source |
|---|---|
| Non-text contrast 3:1 for UI component boundaries that identify the control | WCAG 1.4.11 |
| A control identified by its text needs no visible boundary | WCAG 1.4.11 Understanding |
| `box-shadow` forced to none, non-url `background-image` forced to none in forced colors | MDN `forced-colors` |
| Dark mode base and elevated backgrounds, elevated brighter | Apple HIG Dark Mode |

### Decision rules: border, shadow or surface step?
| Situation | Use | Why |
|---|---|---|
| Static grouping inside a page (sections, panels in an app, table rows) | Surface step or 1px decorative border | Lowest noise; Linear softened and removed separators that "had quietly proliferated" |
| Many equal items in a grid that are links (product cards, docs cards) | Border at rest; shadow-2 on hover (pointer only) | Rest is calm; lift on hover says "this opens" |
| A single feature card, pricing card, the product stage | Ring plus shadow-1 or shadow-2 | Reads as a physical object |
| Things that float over content (menu, popover, tooltip, toast) | Ring plus shadow-3; lighter surface in dark | Must separate from any content underneath |
| Modal and sheet | Shadow-4 plus scrim; lighter surface in dark | Highest level |
| Inputs and controls | 1px border at `--color-border-strong` (3:1) | Required by 1.4.11 when the edge identifies the control |
| Sticky header over content | Translucent surface plus 1px border bottom; no shadow | Shadow under a header reads as a second light source |
| Two adjacent surfaces that already differ by a step | Nothing more | Adding a border too is the classic double separation |

**Border color**
- Decorative (cards, panels, dividers): `--color-border`, about 1.15 to 1.35:1 against its surface. Measured: black at 6 to 12% alpha on white composites to 1.14 to 1.32:1; white at 6 to 12% on `#101214` to 1.15 to 1.38:1.
- Interactive (inputs, outline buttons, checkboxes): `--color-border-strong`, at least 3:1. That takes black at about 45% on white (3.36:1) or white at about 40% on `#101214` (3.84:1). So a "hairline" alpha border can never be the edge of an input.
- Prefer solid tokens over alpha borders on surfaces that vary. Alpha borders change on every surface beneath; on a photo or tinted band they vanish or turn muddy. Use alpha only for rings on floating layers, where the point is to adapt.

### Numbers: the shadow recipes
Built on two principles (contact plus ambient, negative spread to tuck the ambient layer under the element) from Comeau and the Tailwind v4 scale, tuned to the FOUNDATIONS 4px grid. Values are our recommendation (opinion), not an exemplar's measured CSS.

```css
:root {
  /* Tint shadows with the darkest neutral, not pure black: black desaturates the surface under it (Comeau). */
  --shadow-rgb: 31 34 36;          /* set to your neutral 950 as an rgb triplet */
  --ring: 0 0 0 1px rgb(var(--shadow-rgb) / 0.08);
  --shadow-0: none;
  --shadow-1: 0 1px 2px rgb(var(--shadow-rgb) / 0.06);
  --shadow-2: 0 1px 2px rgb(var(--shadow-rgb) / 0.06), 0 4px 12px -2px rgb(var(--shadow-rgb) / 0.08);
  --shadow-3: 0 2px 4px -1px rgb(var(--shadow-rgb) / 0.08), 0 12px 24px -6px rgb(var(--shadow-rgb) / 0.16);
  --shadow-4: 0 4px 8px -2px rgb(var(--shadow-rgb) / 0.10), 0 24px 48px -12px rgb(var(--shadow-rgb) / 0.24);
  --elevation-card: var(--ring), var(--shadow-1);
  --elevation-popover: var(--ring), var(--shadow-3);
  --elevation-modal: var(--ring), var(--shadow-4);
}
@media (prefers-color-scheme: dark) {
  :root {
    /* Elevation = lighter surface. Shadows go; a white ring and a top highlight draw the edge. */
    --ring: 0 0 0 1px rgb(255 255 255 / 0.08);
    --highlight: inset 0 1px 0 rgb(255 255 255 / 0.05);
    --shadow-1: none; --shadow-2: none;
    --shadow-3: none; --shadow-4: none;
    --elevation-card: var(--ring);
    --elevation-popover: var(--ring), var(--highlight);
    --elevation-modal: var(--ring), var(--highlight);
  }
}
```
Rules for the recipe:
- Offsets y only, growing with level: 1, 4, 12, 24. Blur about 2x the y offset; spread negative and about half the y offset on the ambient layer.
- Alpha stays under 0.25. Darkness is not elevation; size is.
- In dark themes, if a floating layer still needs separation from busy content beneath, raise its surface one more step before adding any shadow. If you must add one, keep the same geometry and do not exceed 0.4 alpha (opinion).
- Forced colors: `@media (forced-colors: active) { .card, .popover, .dialog { border: 1px solid CanvasText } }` or ship `border: 1px solid transparent` on those elements from the start.

**Hairlines (measured, Chromium, `kb/research/polish/scripts/hairline.mjs`)**
| Technique | DPR 1 | DPR 2 | DPR 3 |
|---|---|---|---|
| `border: 1px` | 1 device px | 2 | 3 |
| `border: 0.5px` | 1 | 2 (rounds to 1 CSS px) | 3 |
| `height: 1px; transform: scaleY(0.5)` | 1 px at 50% gray | 1 | 2 |
| `box-shadow: 0 0 0 0.5px` | 1 px at 50% gray | 1 | 2 (rounds up) |
So `border: 0.5px` is not a hairline in Chromium. A true one-device-pixel line needs `transform: scaleY(0.5)` on a pseudo-element or a 0.5px shadow spread, scoped to `@media (min-resolution: 2dppx)`. Framework7 ships the pseudo-element approach for iOS (0.5px and 0.33px).

Decision: on the web, default to solid 1px `--color-border`. Lower contrast does the "hairline" job on every screen. Use a true device-pixel hairline only for dense dividers on high-DPI (table rows, list separators in product UI) where 2 device px look heavy. Opinion.

## Ceiling: exemplar patterns and signature moves

### Exemplar patterns (published text, not measured CSS)
- Vercel Geist names its materials by elevation and pairs each with a radius: base and small surfaces 6px, medium and large 12px, menu and modal 12px, fullscreen 16px, tooltip "Lightest shadow" and "the only floating element with a triangular stem". Elevation and radius move together.
- Linear's 2026 refresh rounded and softened separators and dimmed the sidebar a few notches: less line, more surface (Linear blog).
- Radix: non-interactive borders one step lighter than interactive ones (step 6 vs 7), hover border one step stronger (8). Two border tokens, never one.

### Signature moves
1. **Ring plus shadow as one token.** `0 0 0 1px` at low alpha plus a soft drop shadow. The ring gives a crisp edge on any background (white card on white page still reads), the shadow gives lift. A border and a shadow set separately drift apart; one token cannot.
2. **Tinted shadows.** Shadow color is the darkest neutral of the palette (warm brown for the roaster, blue-gray for the SaaS), not black. Black shadows gray out warm surfaces.
3. **Two border tokens.** `--color-border` (decorative, about 1.2:1) and `--color-border-strong` (interactive, 3:1). A generalist uses one gray for both and either fails 1.4.11 on inputs or makes every card look like a form.
4. **Top highlight in dark mode.** `inset 0 1px 0 rgb(255 255 255 / 0.05)` on raised dark surfaces is what light from above looks like on a dark object. It replaces the shadow.
5. **Shadow on the object, not the frame.** The product stage on a landing page gets no shadow; the product inside it gets the shadow, with a soft floor shadow (an ellipse blurred under it) in the same light direction. Only the thing that is "physical" casts.
6. **Sticky header: border appears, shadow never.** A translucent surface (`color-mix(in oklch, var(--color-bg) 85%, transparent)` plus `backdrop-filter: blur(12px)`) and a 1px border. Check that text under it cannot be read through it at the edges.
7. **Remove one line.** On every screen, find a border whose job is already done by space or a surface step and delete it (Linear's separator cleanup is the shipped example).

### Do and don't
- Do `box-shadow: var(--elevation-card)`. Don't `border: 1px solid #eee; box-shadow: 0 2px 8px rgba(0,0,0,.15)` on the same card.
- Do keep every shadow pointing down. Don't add `-2px` x offsets on some cards for "variety".
- Do step dark surfaces up for menus. Don't put a big black shadow under a menu on a near-black page.
- Do give inputs `--color-border-strong`. Don't use the card border on inputs.

### Worked examples
**Coffee product cards.** Rest: `--color-surface` card on `--color-bg` page, `--elevation-card` (ring 8% plus shadow-1); no border. Hover (pointer only): shadow-2 and `translateY(-2px)`, base duration; reduced motion keeps the shadow, drops the move. Dark: ring white 8%, surface one step up from bg, no shadow.

**Dashboard panels.** Panels are static groupings: 1px `--color-border`, no shadow, radius 12. KPI cells inside one panel are split by 1px dividers, not separate cards. The chart tooltip floats: `--elevation-popover`, radius 8, dark mode raised surface plus ring plus highlight.

### Hand-offs
- Color tokens for borders and surfaces: design-color `references/ui-tokens-themes.md`.
- Spacing that replaces lines: design-layout `references/02-spacing-and-rhythm.md`, `03-hierarchy-and-gestalt.md`.
- Forced colors in code: design-frontend `references/02-modern-css.md`.
- FOUNDATIONS names design-layout as owner of shadow recipes; these recipes are proposed for adoption there or in FOUNDATIONS (pipeline notes).

## Sources
Comeau, Designing Beautiful Shadows; Tailwind v4 box-shadow; Vercel Geist Materials; Radix Colors scale; Apple HIG Dark Mode; MDN forced-colors, devicePixelRatio; Framework7 hairlines; Linear blog 2026; measured scripts in `kb/research/polish/scripts/`. Quotes: `kb/research/polish/02-depth-borders-shadows.md`.
