# 01 Interactive states

Every control is a small machine with at least six faces: rest, hover, focus-visible, pressed, disabled and, for anything that talks to a server, loading. A page where only "rest" was designed looks fine in a screenshot and cheap in the hand. This chapter gives the exact face for each state and how it moves to the next.

Token names follow `kb/FOUNDATIONS.md`. State colors come from design-color `references/ui-tokens-themes.md`; durations and curves from design-motion. This chapter decides which property changes, by how much, and what must not change.

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **Focus is visible on every focusable element**: `outline: 2px solid var(--color-focus-ring); outline-offset: 2px` on `:focus-visible`, 3:1 against the color next to it. [lint presence, judged contrast] (FOUNDATIONS item 9; WCAG 2.4.7, 1.4.11)
2. **The focus rule never changes anything visible except the ring.** No `border-width`, `padding` or `font-weight` inside `:focus-visible`, and no `border-radius` on elements that paint a fill, border or shadow. The outline already follows the element's radius and takes no space (MDN outline). Giving a transparent text link a small radius on focus, so its ring has soft corners, is fine. The trap is a global `:focus-visible { border-radius: 4px }`: it has the same specificity as `.btn`, so whichever is declared later wins, and a pill or card declared earlier squares off when tabbed to. Write it as `:where(a:focus-visible) { border-radius: 4px }`, which has zero specificity, so every component radius wins. Scoping to `a:not([class])` is not enough: it still beats `.nav a` (0,2,1 vs 0,1,1) and squared the dashboard's 8px nav items in testing. [judged; `polish-audit.mjs` focus-shape]
3. **Every custom button has a pressed state** that differs from hover ("Always include a press state for a custom button", Apple HIG Buttons). [judged]
4. **No state changes the box size.** Hover, focus, pressed, selected, error and loading keep width and height to the pixel: change `background-color`, `color`, `box-shadow`, `outline`, `transform` or `opacity`; never `border-width`, `padding` or weight on text that sits in a row. Need a thicker error border? Add the second pixel as `box-shadow: inset 0 0 0 1px`. [judged; lint proposal]
5. **Hover is gated** to `@media (hover: hover) and (pointer: fine)` for anything beyond a color change, because touch devices emulate hover on long tap and leave it stuck (MDN hover). [judged; lint proposal]
6. **Hover is never the only way** to reveal an action or information. Anything shown on hover is also shown on focus and reachable on touch. [judged]
7. **Disabled says why, or is not disabled.** Prefer an enabled control that explains the problem on use. If it must be disabled for a reason the user can fix, use `aria-disabled="true"` (stays focusable, reachable explanation) and suppress the action in script (MDN aria-disabled). [judged]
8. **Loading keeps the control's width, label and name.** The label stays in the layout at `opacity: 0` (not `visibility: hidden`, which removes it from the accessibility tree and leaves the button with no name: axe `button-name` failed on exactly this in testing), a spinner sits on top, `aria-busy="true"` is set, and the result is announced through a live region. [judged]
9. **Reduced motion keeps the state, drops the movement**: press scale and hover lift go; color and shadow changes stay (design-motion fundamentals 7). [lint]

### Standards
| Rule | Source |
|---|---|
| Focus visible; indicator 3:1 against adjacent colors | WCAG 2.4.7 (AA), 1.4.11 (AA) |
| Good ring geometry reference: area of a 2 CSS px perimeter, 3:1 between focused and unfocused pixels; an inset ring must be thicker than 2px to meet it | WCAG 2.4.13 (AAA, used as our target, not our floor) |
| Disabled controls exempt from contrast | WCAG 1.4.11, 1.4.3 ("does not apply to inactive user interface components") |
| Hover visuals need not reach 3:1 | WCAG 1.4.11 Understanding ("The pointer itself ... is the indicator") |
| Focus not hidden by sticky content | WCAG 2.4.11 (AA), see chapter 05 |
| Targets 24x24 CSS px, 44x44 on touch | FOUNDATIONS item 4; Apple HIG 44x44 pt |

### Decision rules
- **If the fill is a solid brand or primary color**: step the color (600 to 700 hover, 800 pressed) per design-color. Do not overlay; overlays on saturated fills shift hue.
- **If the element sits on a neutral surface** (ghost button, list row, nav item, menu item): use a state layer of the text color, hover 8%, pressed 10 to 12% (Material 3 tokens: hover 0.08, focus 0.10, pressed 0.10, dragged 0.16). On light themes compose it as `color-mix(in oklch, var(--color-text) 8%, transparent)`. Check the result against the text on top.
- **If a control is unavailable because of something the user can fix** (empty required field): keep it enabled, validate on submit, and show the message. Opinion, backed by design-ux forms guidance.
- **If it is unavailable for a reason outside the user's control right now** (plan limit, offline): `aria-disabled="true"` plus visible reason text next to it or in a tooltip reachable by focus.
- **If the user has no permission**: hide it (Carbon disabled-states pattern), unless knowing it exists matters (an upgrade path), then aria-disabled with the reason.
- **If content must be readable but not editable**: read-only, not disabled (Carbon). Read-only keeps full text contrast.
- **If it is a text input**: rest border at `--color-border-strong` (3:1), hover border one step stronger, focus adds the 2px ring outside (not a recolored border alone), error adds `inset 0 0 0 1px var(--color-danger)` plus icon and message.
- **If the soft "glow" focus ring is requested** (primary at 20 to 30% alpha, 3 to 4px spread): it usually fails 1.4.11. Measure. A 25% teal ring on white composites near 1.4:1. Pair it with a solid 2px ring or drop it.
- **If you write hover and pressed rules with equal specificity**: put `:active` after `:hover` (MDN: `:active` is "overridden by any subsequent link-related pseudo-class ... that has at least equal specificity", the LVHA order). Otherwise the hover color wins while the button is held and the pressed state never shows.
- **If you remove the mobile tap highlight** (`-webkit-tap-highlight-color: transparent`): replace it with a real pressed state. The highlight is what "indicates to the user that their tap is being successfully recognized" (MDN). Removing it without a replacement leaves touch users with no feedback.
- **If a filled button sits on a colored band**: set the ring to the band's text color (`outline-color: var(--color-feature-text)`), never `currentColor`. On a filled button `currentColor` is the label color, which is close to the button's own surroundings: the coffee pilot's band CTA ring measured 1.02:1 in dark and 2.83:1 in light (found on the state sheet).
- **If a secondary button's hover is a fill step**: pressed must be a further step (`color-mix(in oklch, var(--color-surface-hover), var(--color-text) 9%)`), not the same token. The dashboard pilot shipped hover and pressed identical; only the state sheet showed it.
- **If rows are dense and touch each other** (tables, lists, sidebar): use an inset ring (`outline-offset: -2px`) so neighbors do not clip it, and thicken to 3px if you want to meet 2.4.13's area rule with an inset indicator.

### Numbers
| State | Filled button | Neutral control (ghost, row, nav) | Input |
|---|---|---|---|
| Rest | `--color-primary` | transparent | border `--color-border-strong` 1px |
| Hover (pointer only) | `--color-primary-hover` | text color at 8% | border `--color-text-muted` |
| Focus-visible | 2px ring, 2px offset | 2px ring, offset 2px, or inset -2px in dense lists | 2px ring outside the border |
| Pressed | `--color-primary-active` (800 step) and `scale(0.97)`; 0.98 for buttons wider than about 200px (opinion: same perceived travel) | text color at 12% | n/a |
| Selected | n/a | `--color-selected-bg`, `--color-selected-text`, plus a non-color mark (weight, bar or check) | n/a |
| Disabled | `--color-surface-sunken` fill, `--color-text-muted` label, no shadow, no hover, no press | label `--color-text-muted`, no hover | sunken fill, dashed or muted border |
| Loading | label at `opacity: 0` in place, 16px spinner centered, `aria-busy` | same | spinner inside the trailing edge |
| Error | n/a | n/a | inset second pixel in `--color-danger`, icon and message |

Timing (tokens from FOUNDATIONS and design-motion):
| Change | Duration | Note |
|---|---|---|
| Hover color, background | `--duration-fast` 150ms, `--ease-standard` | Opinion: lists traversed fast (rows, menus, sidebars) get 0ms in and 150ms out, so a cursor sweeping 20 rows does not leave a smear |
| Press scale | `--duration-instant` 100ms in; release eases back at fast | Press must feel immediate (0.1 s limit, Nielsen) |
| Focus ring | none | Opinion: never transition the outline in; a fading ring is a ring a keyboard user waits for |
| Shadow lift on hover | fast to base | transition `box-shadow` only on few elements (cards), it repaints |
| Loading spinner appears | after 150 to 300ms delay, stays at least 300 to 500ms | design-ux 04 anti-flicker rule |

## Ceiling: exemplar patterns and signature moves

### Exemplar patterns (from published docs and team writing; exemplar CSS could not be measured from this environment)
- Linear's 2026 refresh: feedback and structure "without cluttering"; separators softened; sidebar dimmed so selection reads (Linear blog, team account, not measured).
- Radix Colors, used under many product UIs, assigns component backgrounds by state: step 3 normal, 4 hover, 5 pressed or selected; borders 7 rest, 8 hover and focus. The pattern is the point: each state is one step, not an arbitrary new color.
- Apple: one or two prominent buttons per view; "Use style, not size, to visually distinguish the preferred choice" (HIG Buttons, punctuation normalized).

### Signature moves
1. **The state sheet.** Before you call a page done, render one panel that shows every control in every state side by side (rest, hover, focus, pressed, selected, disabled, loading, error). Generalists check states one at a time in a browser and miss that hover and selected are the same color, or that disabled looks like secondary. Reason: states are a system; you only see collisions when they sit together.
2. **Focus that survives the shape.** Never restyle `border-radius` on focus for anything that paints. A common reset sets `border-radius: 4px` on `:focus-visible`; with equal specificity, source order decides, so any pill button or card declared before that rule squares off the moment it is tabbed to. The outline follows the element's own radius already.
3. **Second pixel as a shadow.** Error, selected and hover borders get thicker with `box-shadow: inset 0 0 0 1px`, never by changing `border-width`. Zero layout shift, and the input text does not jump 1px.
4. **Loading keeps the label's width.** Label `opacity: 0` (keeps the accessible name), spinner absolutely centered, same button. The row of buttons never reflows, and the spinner sits exactly where the eye already is.
5. **Asymmetric hover** (opinion, common in fast product UIs): instant in, eased out. The UI answers the pointer immediately and settles gently when it leaves.
6. **Press is physical, hover is not.** Hover changes color only; press adds a 2 to 3 percent scale. Hover that also moves (lift on every button) makes a page twitchy; save lift for cards that open something.
7. **Selected carries a non-color mark.** Weight to 600, a 2px bar, or a check. Teal background alone fails "not color alone" for some users and disappears in forced colors.
8. **Forced colors keeps every edge.** Controls with no border get `border: 1px solid transparent` (or a transparent outline on non-focusable surfaces), which becomes visible when the OS forces colors, because `box-shadow` is forced to none (MDN forced-colors).

### Do and don't
- Do `.btn:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px }`. Don't add `border-radius` to that rule.
- Do `input[aria-invalid=true] { box-shadow: inset 0 0 0 1px var(--color-danger); border-color: var(--color-danger) }`. Don't switch to `border: 2px`.
- Do gate `.card:hover { box-shadow: var(--shadow-2) }` inside `@media (hover: hover) and (pointer: fine)`. Don't let the lift stick on a phone after a tap.
- Do keep disabled buttons readable (muted label on a sunken fill). Don't drop them to 40% opacity on top of a colored band, which turns them into a smudge.

### Worked examples
**Subscribe button, coffee landing.** Rest: orange 600 fill, white label 5.64:1, inset top highlight `inset 0 1px 0 rgb(255 255 255 / 0.12)`. Hover (pointer): orange 700, 150ms. Pressed: orange 800, `scale(0.98)` (wide button), 100ms. Focus: 2px orange 600 ring, 2px offset; the pill shape is kept. Loading (after submit): label at opacity 0 in place, 16px spinner in white, `aria-busy`, live region says "Starting your subscription". Reduced motion: no scale; colors still change.

**Sidebar nav item, dashboard.** Rest: muted text, transparent. Hover: 8% text-color layer, 0ms in, 150ms out. Selected: teal 50 background, teal 800 text, weight 600, `aria-current="page"`. Focus: inset ring (`outline-offset: -2px`) so the item above does not clip it. Pressed: 12% layer.

### Hand-offs
- State colors and contrast: design-color `references/ui-tokens-themes.md` (its overlay row lists focus and pressed at 12%; Material 3 tokens are 10%; see pipeline notes).
- Motion curves, durations, reduced motion: design-motion `references/04-micro-interactions.md`.
- What the state says: design-copy `references/02-ux-microcopy.md`.
- Empty, loading and error screens as content: design-ux `references/04-states-feedback.md`.

## Sources
MDN `:focus-visible`, `outline`, `aria-disabled`, `@media (hover)`, `transition-behavior`, `forced-colors`; WCAG 2.2 Understanding 1.4.11, 2.4.13; Apple HIG Buttons; Material 3 state tokens (Flutter gen_defaults `state.json`); Carbon disabled states; Nielsen response time limits; Rauno Freiberg, Interaction Design. Quotes, URLs and dates: `kb/research/polish/01-interactive-states.md`.
