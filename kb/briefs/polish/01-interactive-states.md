# Brief: 01 Interactive states as designed screens

**Question:** What does every interactive element look like in each state (rest, hover, focus-visible, active or pressed, selected, disabled, loading), and how does it move between them?

**Audience:** Claude acting as art director through design-director, building a page or app screen in one HTML file.

**Decisions the reader must be able to make**
- The exact visual change per state per component (button, link, row, input, nav item, card), in tokens.
- Which property changes (background, border, shadow, text decoration, transform) and how fast.
- When a control should be disabled, aria-disabled, read-only or hidden, and how disabled looks.
- How a button shows loading without changing width.
- Which state transitions animate and which are instant (enter fast, leave slower for hover; never animate focus ring in).

**Fundamentals (gate)**
- Visible `:focus-visible` ring, 2px, 2px offset, 3:1 against the adjacent color (WCAG 2.4.7, 1.4.11; FOUNDATIONS item 9).
- Pressed state exists on every custom button (Apple HIG).
- Hover never carries the only cue; hover gated to `(hover: hover)` so touch does not get sticky hover.
- Disabled is exempt from contrast but must still be recognizable; never remove the reason.
- State changes do not shift layout (no border width change, no font weight jump that reflows).

**Expert layer**
- Hover in fast, out slower (or instant in, eased out). Press is instant. Focus ring does not animate in.
- Stepped state colors vs state-layer overlays (Material 8 / 10 / 10 / 16 percent), and when each is right.
- Loading button keeps its width: label kept with opacity 0 under the spinner, `aria-busy`.
- `aria-disabled` keeps the control focusable so the tooltip that explains why is reachable.
- Ring follows `border-radius` (outline does in current engines); inset ring on tightly packed rows.

**Must cover:** state matrix per component, token map, transitions, touch vs pointer, forced colors.

**Out of scope or reuse:** state copy (design-copy `02-ux-microcopy.md`), motion curves and durations (design-motion `04-micro-interactions.md`), state color ramps (design-color `ui-tokens-themes.md`), empty and error state content (design-ux `04-states-feedback.md`).

**Test briefs:** slice Brief A (coffee landing: CTA, nav, card, newsletter input with error) and Brief B (dashboard: nav, rows, buttons, search, date button, loading and empty states). See `slice-test-briefs.md`.

**Rubric:** FOUNDATIONS gate first (items 9, 11, 13, 15). Then: every interactive element in the screenshot set has a designed hover, focus and pressed state; no layout shift between states; disabled and loading states shown where the page needs them.
