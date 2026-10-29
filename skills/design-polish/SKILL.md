---
name: design-polish
description: Domain reference loaded by design-director or a design playbook (design-playbook-landing, -dashboard, -mobile, -brand) as the last design pass before the self-critique loop; do not trigger on its own for a page, screen or brand job. Covers the craft details that separate fine from world class: interactive states (hover, focus, pressed, disabled, loading, empty, error) and their transitions, borders vs shadows vs surface steps, layered shadow recipes, hairlines on high-DPI screens, radius family and nested radius math, optical alignment, icon stroke matched to text weight, subtle gradients and grain, text rendering, scroll and overflow behavior, plus a 30-item polish checklist and an audit script. Load it directly only when the user names it or asks a narrow polish question ("why does this look cheap", "fix the shadows", "audit the states").
---

# design-polish

> **Layer: domain reference.** Loaded after `design-foundations` by `design-director` or a `design-playbook-*` skill, after layout, type and color are set. Accessibility floor for every rule here: design-foundations `references/accessibility.md`. Token names and values: `kb/FOUNDATIONS.md`.

Polish is not decoration added at the end. It is the system made consistent down to the pixel: one radius family, one light source, one ring, icons at the weight of the words beside them, and every control designed in every state. The color pilot passed every lint check and still read as "not super special" (Davon's blind ranking, `kb/tests/design-color.md`); this skill is the pass that closes that gap.

## 1. Fundamentals (non-negotiable, check first)
Polish never trades against the FOUNDATIONS gate. Then these hold on every page, or the page fails the polish pass:

1. **Focus ring on everything focusable**: `outline: 2px solid var(--color-focus-ring); outline-offset: 2px` on `:focus-visible`, 3:1 against its neighbor (WCAG 2.4.7, 1.4.11). The focus rule changes nothing else visible: no border width, padding or weight, and no radius on anything that paints. Do not transition the ring in (opinion: a fading ring is a ring a keyboard user waits for).
2. **No state changes the box.** Hover, focus, pressed, selected, error and loading keep width and height. A thicker border is `box-shadow: inset 0 0 0 1px`, never `border-width: 2px`.
3. **Every custom button has a pressed state** (Apple HIG), declared after `:hover` so it wins while held (LVHA order, MDN), and it replaces the mobile tap highlight if you remove that. Every interactive element has distinct rest, hover (pointer), focus and pressed faces, and selected differs from hover.
4. **Hover that moves or lifts is gated** to `@media (hover: hover) and (pointer: fine)`; touch emulates hover on long tap (MDN). Hover is never the only way to reveal an action.
5. **Loading keeps the label's width and name** (label at `opacity: 0`, never `visibility: hidden`, which deletes the accessible name; spinner on top; `aria-busy`), after a 150 to 300ms delay and shown for at least 300 to 500ms (design-ux 04). Disabled says why or is not disabled (`aria-disabled` keeps it focusable).
6. **One separation per boundary**: a border, or an elevation token, or a surface step. Never a border plus a separate shadow plus a fill change.
7. **One light source**: every shadow falls down (x 0, y positive); surface gradients lighter at the top. Dark themes lift with lighter surfaces, rings and top highlights, not shadows (FOUNDATIONS).
8. **Two border tokens**: `--color-border` decorative (about 1.2:1), `--color-border-strong` for control edges (3:1, WCAG 1.4.11). Alpha "hairline" borders can never be an input's edge (black needs about 45% alpha on white to reach 3:1).
9. **Nothing exists only as a shadow**: forced colors removes `box-shadow` (MDN). Lifted controls and surfaces keep a real or transparent border.
10. **Radius from the family** (0, 4, 8, 12, 16, full); nested radius = outer minus gap, squared at 4 or less.
11. **One icon family**: one cap and join style, stroke within about 0.25px of the adjacent text's stem width (table in section 3).
12. **Theme the browser's parts**: `color-scheme` on `:root`, `accent-color`, `::selection`. A dark page with light scrollbars or white native inputs fails.
13. **Text on gradients or texture** meets 4.5:1 at its worst pixel. Texture never carries meaning.
14. **Edges hold**: sticky headers never cover focus or anchor targets (`scroll-padding-top`, WCAG 2.4.11); nested scrollers contain overscroll; truncated text keeps its full value reachable; the longest real string fits at 390px.
15. **States exist as screens**: where a page has data, empty, loading and error are designed (design-ux 04), in the same frame as the filled state.

## 2. Principles
- **Consistency beats intensity.** A page with one 12px radius, one ring and one shadow family looks more expensive than one with beautiful, unrelated parts.
- **Measure, then set.** Stroke weights, border contrast and hairline rendering are numbers you can compute (section 3), not a feel.
- **Light has one source.** Shadows, gradients and highlights all agree that light comes from above.
- **Subtract.** The last move on every screen is removing a line, an icon, a color or a weight (Linear's 2026 refresh removed separators that "had quietly proliferated" and dimmed the sidebar).
- **Design the faces nobody screenshots.** Pressed, disabled, loading, empty, error, overflow and forced colors are where craft shows.

## 3. Decision rules and numbers

**Separation**
| Situation | Use |
|---|---|
| Static grouping (sections, app panels, table rows) | Surface step or `--color-border`, no shadow |
| Grid of link cards | `--elevation-card` at rest, `--elevation-card-hover` on hover (pointer only) |
| Floating layers (menu, popover, tooltip, toast) | `--elevation-popover`; dark: lighter surface plus ring plus top highlight |
| Modal, sheet | `--elevation-modal` plus scrim |
| Inputs, outline buttons, checkboxes | 1px `--color-border-strong` |
| Sticky header | translucent surface plus `backdrop-filter` plus 1px border; no shadow |

**Shadow recipes** (opinion, built on Comeau and Tailwind v4; full file `assets/polish-tokens.css`): tint with the darkest neutral (`--shadow-rgb`); y offsets 1, 4, 12, 24 by level; blur about 2x y; negative spread about half y on the ambient layer; alpha under 0.25; ring `0 0 0 1px` at 8%; dark mode: shadows none, ring white 8%, highlight `inset 0 1px 0` white 5%.

**States** (colors from design-color, timing from design-motion)
| State | Filled button | Neutral control (row, nav, ghost) | Input |
|---|---|---|---|
| Hover (pointer) | `--color-primary-hover`, 150ms | text color at 8%; rows and menus 0ms in, 150ms out (opinion) | border one step stronger |
| Focus-visible | 2px ring, 2px offset | ring; inset (`outline-offset: -2px`) in dense lists | 2px ring outside the border |
| Pressed | 800 step plus `scale(0.97)` (0.98 above about 200px wide), 100ms | text color at 10% | n/a |
| Selected | n/a | selected bg and text plus a non-color mark (weight 600, bar, check) | n/a |
| Disabled | sunken fill, muted label, no hover or press | muted label | sunken fill |
| Loading | label `opacity: 0` in place, 16px spinner, `aria-busy` | same | trailing spinner |
| Error | n/a | n/a | `inset 0 0 0 1px` danger plus icon plus message |

**Soft glow focus rings fail.** A 25% teal-600 ring on white composites near 1.4:1 (WCAG 1.4.11 needs 3:1). Keep the solid 2px ring.

**Icon stroke vs text** (Inter stems measured, `kb/research/polish/scripts/measure.mjs`): stem = size x 0.088 (400), 0.107 (500), 0.127 (600), 0.147 (700). Rendered stroke of a 24-grid icon = `stroke-width x size / 24`, or exact px with `vector-effect: non-scaling-stroke`.
| Text | Icon | Rendered stroke |
|---|---|---|
| 12px 500 | 12 to 14px | 1.25 to 1.3 |
| 14px 400 to 500 | 16px | 1.33 to 1.5 |
| 16px 400 to 500 | 20px | 1.5 to 1.7 |
| 16px 600 | 20px | 2.0 |

**Hairlines** (measured in Chromium, `scripts/hairline.mjs`): `border: 0.5px` renders as 1 CSS px at DPR 1, 2 and 3. For one device pixel at 2x, use `transform: scaleY(0.5)` on a 1px pseudo-element or `box-shadow: 0 0 0 0.5px`, inside `@media (min-resolution: 2dppx)`. Default: solid 1px at low contrast; true hairlines only for dense dividers.

**SVG lines at 1x**: a 1px line at integer y renders as two 50% gray rows; put it on `y + 0.5` or set `shape-rendering: crispEdges` (measured, `scripts/svg-line.mjs`).

**Surfaces**: light gradients of 2 to 4% OKLCH lightness, top lighter, `in oklch` (opinion); grain from `feTurbulence` at 2 to 5% on pages, 4 to 8% on objects (opinion); `stitchTiles='stitch'`.

**Edges**: `scroll-padding-top` = sticky header + 16; `scrollbar-gutter: stable` on containers whose height changes (not the root of a page with full-bleed bands); `overscroll-behavior: contain` on panels, menus, dialogs; scroll shadows on horizontal regions; `min-width: 0` for ellipsis; middle-truncate paths and IDs (opinion).

## 4. Expert moves (what a strong generalist misses)
1. **The state sheet.** Render every control in every state side by side before handing over. Collisions (hover equals selected, disabled looks secondary) only show together.
2. **Global focus radius trap.** `:focus-visible { border-radius: 4px }` ties `.btn` on specificity; source order decides, and earlier-declared pills square off on Tab. Write `:where(a:focus-visible)` (zero specificity). `a:not([class])` still beat `.nav a` in testing.
3. **Second pixel as inset shadow** for error, selected and hover borders: zero shift, text never jumps.
4. **Ring plus shadow as one token**: crisp edge on any background, lift from the shadow, and they never drift apart.
5. **Tinted shadows** from the palette's darkest neutral; black shadows gray out warm surfaces (Comeau).
6. **Top highlight replaces shadow in dark mode**: `inset 0 1px 0` white at 5%, the catch light of an object lit from above.
7. **Measure the stem, set the stroke.** A 2px-rendered icon beside 14px regular text (1.23px stems) shouts; most "icons look off" is this.
8. **Asymmetric hover on lists**: instant in, eased out, so a sweeping cursor leaves no smear (opinion).
9. **Shadow on the object, not the frame**: the product casts a floor shadow inside a flat stage; the stage itself has none.
10. **Grain on the object, light on the stage.** Texture where touch would feel it; the surface only gets light.
11. **Pixel-snap SVG rules** (`y + 0.5`, `crispEdges`) so chart gridlines are crisp on 1x monitors.
12. **Scroll shadows in pure CSS** (`background-attachment: local` covers over `scroll` shadows) show overflow only when there is more to see; clip the rounded parent (`overflow: clip`) or the square covers poke out of its corners.
13. **Inter Display at 25px and up**, Inter at text sizes (Linear uses Inter Display for headings).
14. **Remove one thing per screen** before calling it done.
15. **Ring color on colored bands** is the band's text color, never `currentColor` (the pilot's band CTA ring measured 1.02:1 in dark).
16. **Scope `scrollbar-gutter: stable`** to containers that change height; on the root it leaves an empty strip beside full-bleed bands.
17. **Boxes read as cheap; marks, rules and raised paper read as made.** A grid of square tiles with hard 1 to 3px dark borders and 3px corners, outlined pay buttons and a dashed panel around every block make a premium page look like a form (Davon on Stand Firm, 2026-10-28: "it looks cheap, it looks amateur, and it ruins the spell"). Before you box something, try in this order: open space, a hairline rule at 12 to 20% ink, a round or brand-shaped mark (beads, arches, a pen ring around a numeral), then a raised card with 12 to 16px radius and a soft two-layer shadow. Never box at the same weight everywhere. Payment buttons use the platform's own style (black, 12px radius), never an outlined box with the words typed in. Removing the box does not remove the 3:1 rule: a soft filled field still needs one edge at 3:1 against its ground (WCAG 1.4.11), so give it a 1.5px floor rule in the muted text colour, and a placeholder that sits on a dark card takes the dark theme's muted colour, not the light one (critic round 3 on Stand Firm caught both). Sweep the leftovers too: a dashed stand-in note, a bordered tag, a stroked quiz answer and square tick boxes on the printable all count as boxes.

## 5. The polish pass (run inside design-director's loop)
1. Lint gate passes (`node tools/lint.mjs page.html`).
2. `node skills/design-polish/assets/polish-audit.mjs page.html`: radius census, nested radius, shadow direction and count, focus shape, hover layout shift, hover gating, icon stroke vs stem, SVG hairlines, `color-scheme`, tabular figures, heading wrap, forced-colors edges. Fails are bugs.
3. Render the page and a state sheet; walk the 30-item checklist in `references/06-polish-checklist.md` (system audits, states, surfaces and type, edges, the last look).
4. Fix in checklist order; max 3 rounds; report what is left.

## 6. Reference map
| Need | Read |
|---|---|
| State matrix, tokens and timing per state, disabled vs aria-disabled vs read-only, loading buttons, the state sheet | `references/01-interactive-states.md` |
| Border vs shadow vs surface step, shadow recipes, border tokens, hairline methods and measurements, dark elevation, forced colors | `references/02-depth-borders-shadows.md` |
| Radius family and nested radius, optical alignment, icon stroke vs text weight tables, SVG pixel snapping | `references/03-shape-alignment-icons.md` |
| Light gradients, banding and grain, `color-scheme`, `accent-color`, selection, font smoothing, optical sizing, text-wrap | `references/04-surface-texture-text-rendering.md` |
| Truncation, scroll containers, sticky headers, scroll shadows, scrollbar gutter, long-string testing, skeleton fit | `references/05-scroll-overflow-edges.md` |
| The 30-item checklist, how to run the pass, automation status | `references/06-polish-checklist.md` |
| Starter tokens (elevation, state layers, grain, focus, edges) | `assets/polish-tokens.css` |
| Advisory audit script (run after `npm ci` in `tools/`) | `assets/polish-audit.mjs` |

Related skills: design-color (state colors, border and surface tokens), design-layout (grid, nested radius rule, optical alignment theory), design-typography (numerals, text-box, OpenType), design-motion (durations, curves, reduced motion), design-ux (state content, loader timing), design-frontend (forced colors, performance).
