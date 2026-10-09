# 05 Scroll, overflow and edges

Polish is tested at the edges: the 60-character customer name, the table on a phone, the anchor link that lands under the sticky header, the dialog that makes the page jump sideways when its scrollbar disappears. None of these show in a hero screenshot; all of them show in the first week of use.

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **No horizontal page scroll at 390px.** [lint, FOUNDATIONS item 8]
2. **Focus is never fully hidden** by a sticky header, footer, cookie bar or toast (WCAG 2.4.11, AA). Use `scroll-padding-top` on the scroller equal to the sticky header height plus 16px (technique C43). [judged; lint proposal]
3. **Anchors land below the sticky header**: the same `scroll-padding-top`, or `scroll-margin-top` on the targets. [judged]
4. **Scrollable regions are keyboard reachable and named**: `tabindex="0"`, `role="region"`, `aria-label` or `aria-labelledby` (axe `scrollable-region-focusable` covers part). [lint partial]
5. **Truncated text has its full value available**: visible on focus or hover via `title` or a tooltip, or a details view. Never truncate a value the user must compare (prices, IDs in a reconciliation table). [judged]
6. **Long strings never break the layout**: `min-width: 0` on flex and grid children, `overflow-wrap: anywhere` on user content (URLs, emails, hashes). [judged; lint covers overflow at 390 only]

### Standards
| Rule | Source |
|---|---|
| Focus not obscured | WCAG 2.4.11 (AA); sufficient technique C43 `scroll-padding` |
| `scrollbar-gutter: stable` reserves space for classic scrollbars; overlay scrollbars get none | MDN |
| `overscroll-behavior: contain` stops scroll chaining and pull-to-refresh inside the element | MDN |
| Skeleton under 10 s, spinner 2 to 10 s, progress bar above 10 s; no frame-only skeletons | NN/g |
| `interpolate-size: allow-keywords` animates to `auto` sizes (one end must be a length) | MDN |

### Decision rules
- **If a label can be long and the column is fixed** (table cell, sidebar item, tab): single-line ellipsis (`overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0`) plus `title` with the full text. For two lines, `-webkit-line-clamp: 2` with `display: -webkit-box`.
- **If the value is a path or URL**: truncate in the middle, not the end (`/blog/retention…-2026`), because the end carries the identity. Opinion; done in script or server.
- **If a panel, menu, drawer or dialog scrolls**: `overscroll-behavior: contain`, so the page behind does not move when the panel hits its end.
- **If opening a dialog hides the page scrollbar**: `scrollbar-gutter: stable` keeps the page from shifting sideways. Put it on the scroll containers whose height changes (panels, lists, dialog bodies). On `html` it reserves an empty strip whenever the page does not scroll: in testing it left a 15px gap beside the full-bleed subscription band and cut the dashboard top bar's border short. Use it on `html` only for an app shell with no full-bleed edges, and check the render.
- **If a region scrolls horizontally** (wide table on phone, chip row): show it. Scroll shadows at the overflowing edges, a partly cut last item, or both. A table cut flush at a cell boundary looks complete.
- **If the header is sticky**: translucent surface plus border (chapter 02), `scroll-padding-top` on `html`, height on the 4px grid (56 or 64).
- **If content height animates** (accordion, disclosure): `interpolate-size: allow-keywords` with a transition on `height` as progressive enhancement; without support it opens instantly, which is fine.
- **If a list can be empty, one item, or 10,000**: design all three (design-ux 04). Polish adds: the empty state sits in the same frame and height band as the filled state, so the layout does not collapse.

### Numbers
| Item | Value |
|---|---|
| `scroll-padding-top` | sticky header height + `--space-5` (16) |
| Scroll shadow | 16 to 24px wide, from `--color-text` at 8 to 12% to transparent (opinion) |
| Ellipsis cell | `max-width` set, `min-width: 0` on the flex child |
| Skeleton | same box sizes as final content; bars at text cap height, radius `--radius-sm`; shimmer optional and off under reduced motion |

Pure CSS scroll shadows (only appear when content overflows):
```css
.scroll-x {
  overflow-x: auto; overscroll-behavior-x: contain;
  background:
    linear-gradient(to right, var(--color-surface) 30%, transparent) left / 32px 100% no-repeat local,
    linear-gradient(to left, var(--color-surface) 30%, transparent) right / 32px 100% no-repeat local,
    radial-gradient(farthest-side at 0 50%, rgb(var(--shadow-rgb) / .14), transparent) left / 12px 100% no-repeat scroll,
    radial-gradient(farthest-side at 100% 50%, rgb(var(--shadow-rgb) / .14), transparent) right / 12px 100% no-repeat scroll;
}
```
The `local` covers move with the content and hide the `scroll` shadows at each end; the shadows show only where there is more to scroll. Children must not paint their own opaque background over it (use transparent rows). The covers are square: inside a rounded panel they poke out of its corners (seen on the dashboard's table panel), so clip the panel with `overflow: clip`.

## Ceiling: exemplar patterns and signature moves

### Signature moves
1. **The 10,000 test.** Paste the longest real value into every text slot (a German company name, a 40-character email, a 7-digit number) and render at 390. Generalists design for "Acme".
2. **Middle truncation for paths and IDs.** The end of `/docs/guides/authentication/oauth-callback` is what tells it apart.
3. **Scroll shadows instead of scrollbars on phones** for horizontal regions, with the last column partly visible as the second cue.
4. **Stable gutter, scoped.** `scrollbar-gutter: stable` on the containers whose height changes removes the sideways jump; on the root it leaves a visible strip beside full-bleed bands, so not there.
5. **Contained overscroll** on every nested scroller. The page behind a menu never scrolls.
6. **Skeleton equals final layout**: same heights, same radii, same gaps; when content arrives nothing moves (design-ux 04; protects CLS).

### Do and don't
- Do `scroll-padding-top: 80px` with a 64px sticky header. Don't let anchor jumps hide the section title.
- Do ellipsis plus `title`. Don't clip text with `overflow: hidden` and no affordance.
- Do show the overflow edge. Don't hide a scrollbar on a region with no other cue.

### Hand-offs
- Responsive tables (reflow to cards or lists): design-layout `references/04-responsive-and-adaptive.md`.
- Loading and empty content: design-ux `references/04-states-feedback.md`.
- CLS and performance: design-frontend `references/04-performance.md`.

## Sources
MDN scrollbar-gutter, overscroll-behavior, interpolate-size; WCAG 2.2 Understanding 2.4.11; NN/g skeleton screens and empty states. Quotes: `kb/research/polish/05-scroll-overflow-edges.md`.
