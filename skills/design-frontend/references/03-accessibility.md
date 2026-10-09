# 03 Accessibility implementation (WCAG 2.2 AA)

Sources: kb/research/frontend/03-accessibility.md. Opinion is marked (opinion).

## Principles
1. WCAG 2.2 AA is the floor, not the goal (foundation contract). It is also the law-adjacent baseline: EN 301 549 under the European Accessibility Act (from 28 June 2025) and the ADA Title II rule both reference WCAG 2.1 AA, which 2.2 AA contains (V: check current legal dates).
2. Most real failures are boring and preventable. On the 2026 WebAIM Million the six failures that appear on the most home pages are low contrast (83.9%), missing alt (53.1%), missing labels (51%), empty links (46.3%), empty buttons (30.6%) and missing lang (13.5%). Get those to zero before anything clever.
3. Build it in; do not bolt it on. Semantic HTML (chapter 01) delivers most of 4.1.2, 2.1.1 and 1.3.1 for free.
4. Automated tools catch only part of the problems. Keyboard, zoom, screen reader and forced-colors passes are mandatory (consensus; see research).

## The AA checklist that code controls
| SC | What the code must do | Numbers |
|---|---|---|
| 1.1.1 | Meaningful `alt`; decorative `alt=""`; icon SVGs `aria-hidden="true"` with a name on the control | |
| 1.3.1 | Structure in markup: headings, lists, tables, labels, fieldsets | |
| 1.3.5 | `autocomplete` on personal-data inputs | |
| 1.4.1 | Never color alone: links in body text get underline; errors get icon and text | |
| 1.4.3 | Text contrast | 4.5:1; 3:1 at 24px or 18.66px bold and up |
| 1.4.4 | Text resizes to 200% without loss | see fluid type rule in 02 |
| 1.4.10 | Reflow with no 2D scroll at 320 CSS px wide (1280px at 400%) | tables and code may scroll in their own box |
| 1.4.11 | UI component boundaries, states and focus indicators | 3:1 against adjacent colors |
| 1.4.12 | No loss with line-height 1.5, paragraph spacing 2em, letter spacing 0.12em, word spacing 0.16em | never fix heights on text boxes |
| 1.4.13 | Tooltips and hover cards: dismissible with Esc, hoverable, persistent | |
| 2.1.1 / 2.1.2 | Everything works by keyboard; no traps | |
| 2.2.2 | Auto-moving content over 5s has pause, stop or hide | |
| 2.4.1 | Skip link to `main` | |
| 2.4.3 | DOM order equals visual order (watch `order`, `flex-direction: row-reverse`, grid placement) | |
| 2.4.7 + 2.4.11 | Focus visible, and not fully hidden by sticky headers, cookie bars or chat widgets | |
| 2.5.3 | Visible label text is inside the accessible name | |
| 2.5.7 | Every drag has a single-pointer alternative (buttons to reorder, click to place) | |
| 2.5.8 | Targets at least 24 by 24 CSS px, or spaced so 24px circles do not overlap | 44 by 44 preferred on touch (foundation contract) |
| 3.2.6 | Help links and contact appear in the same relative order on every page | |
| 3.3.1 / 3.3.3 | Errors identified in text, with how to fix | |
| 3.3.7 | Do not ask for the same info twice in one process (prefill, "same as shipping") | |
| 3.3.8 | Login: no puzzles or transcription; allow paste and password managers; offer passkeys, magic links or OAuth | |
| 4.1.2 | Name, role, value for every control (native elements do this) | |
| 4.1.3 | Status messages announced without focus: `role="status"` (polite) or `role="alert"` (urgent) | |

## Focus indicators (expert default)
```css
:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
/* Two-tone ring for components that sit on both light and dark backgrounds */
.on-media :focus-visible {
  outline: 3px solid var(--color-focus-ring);
  box-shadow: 0 0 0 6px var(--color-bg);
}
```
- Use `outline`, not `box-shadow`, as the primary indicator: outlines survive forced colors mode, shadows do not (Soueidan).
- A solid 2px outline drawn outside the component meets 2.4.13 Focus Appearance (AAA) as long as it has 3:1 change against the unfocused state. Meet it by default; it costs nothing (opinion).
- A 2px dashed outline fails 2.4.13; 4px dashed passes (Soueidan).
- Never `outline: none` without a replacement. Remove only the mouse ring, by styling `:focus-visible` instead of `:focus`.
- Sticky header plus in-page focus: add `scroll-padding-block-start` equal to header height on `html`, so focused elements never hide under it (2.4.11). Use `scroll-margin-block-start` on anchor targets too.

## Targets
- Default control height 44px on touch, 40px allowed for dense desktop UI, never below 24px (foundation contract, WCAG 2.5.8).
- Expand small visual targets with padding or a pseudo-element: `.icon-btn { position: relative } .icon-btn::after { content: ""; position: absolute; inset: -8px; }` (opinion, common technique).
- Inline links in a sentence are exempt from 2.5.8; stacked link lists are not.

## Motion and reduced motion
- Default motion is opt-in: wrap animations in `@media (prefers-reduced-motion: no-preference)`. Reduced does not mean none: keep opacity fades at `--duration-fast`, remove movement, parallax, zoom and autoplay (opinion, aligned with design-motion and foundation contract).
- Autoplaying video or carousels over 5 seconds need a visible pause control (2.2.2).

## Live regions and dynamic UI
- The live region must exist in the DOM before its text changes. Inject the text, not the container.
- Use `role="status"` for "Saved", "3 results"; `role="alert"` only for errors that block.
- SPA route change: move focus to the new page `h1` (with `tabindex="-1"`) or to `main`, and update `document.title`. Without this, screen reader users hear nothing after navigation (opinion, common practice in React/Next apps).
- Toasts: never the only place an error appears; never auto-dismiss errors.

## Forms
- Visible label, `autocomplete`, `aria-describedby` for hint and error, `aria-invalid` on error, focus the first invalid field on submit, error summary at top for long forms linking to each field.
- Validate on blur or submit, not on every keystroke (opinion; avoids error flashes while typing).
- Required: native `required` plus a visible "Required" or marking optional fields; an asterisk alone needs a legend explaining it.

## Testing protocol (do all six before ship)
1. Automated: axe DevTools or Lighthouse a11y on every template. Zero violations.
2. Keyboard: Tab through every page. Visible focus everywhere, logical order, no traps, Esc closes overlays, focus returns to the trigger.
3. Zoom and reflow: 200% and 400% at 1280px wide; 320px viewport; text-spacing bookmarklet (1.4.12).
4. Screen reader: VoiceOver with Safari, NVDA with Firefox or Chrome. Read headings list, landmarks list, forms list.
5. Forced colors: Windows High Contrast or DevTools emulation. Every control boundary and focus visible.
6. Reduced motion and dark mode emulation.

## Do and don't
| Do | Don't |
|---|---|
| `outline` on `:focus-visible` | `*:focus { outline: none }` |
| `role="status"` region in the initial HTML | create the region at the moment you announce |
| error text plus icon plus red border | red border only |
| allow paste in password and code fields | block paste "for security" |
| `scroll-padding-top` matching the sticky header | let focused links hide under the header |

## Worked examples
1. Checkout form. Labels above fields, `autocomplete="shipping street-address"` etc., "Billing same as shipping" checkbox checked by default (3.3.7), card number `inputmode="numeric" autocomplete="cc-number"`, errors on blur and on submit with focus to the first invalid field and a `role="alert"` summary listing links to each error. Submit button stays enabled until submit, then shows a spinner while keeping its label.
2. Marketing page with sticky header and cookie bar. `html { scroll-padding-block: 5rem 6rem; }` (header 80px, cookie bar 96px tall) so focused elements are never fully covered (2.4.11). Cookie bar is a non-modal region with its own buttons first in DOM order or reachable via a skip link; it is not a modal dialog trapping focus.
3. Kanban board with drag to reorder. Each card gets a "Move" menu button with "Move up / down / to column" options (2.5.7), and keyboard reordering with live region announcements ("Card moved to Done, position 2 of 5").

## Hand-offs
- Contrast values and palettes: design-color. Focus ring color comes from the `focus-ring` role.
- Error message wording, alt text writing: design-copy.
- Motion durations and reduced-motion alternatives: design-motion.
- Interaction choice (should this even be a drag, a modal, a carousel?): design-ux.
