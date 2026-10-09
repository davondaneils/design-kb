# 06 The polish pass

The pass the director runs after the fundamentals gate holds and before comparing to the exemplars. It is ordered so the cheap, system-wide fixes come first: fixing the radius family repairs twenty components at once; fixing one icon fixes one icon.

## How to run it (inside design-director's self-critique loop)
1. Gate first: `node tools/lint.mjs page.html` exits 0, and the `[judged]` FOUNDATIONS rows hold. Polish never trades against the gate.
2. Run the audit: `node skills/design-polish/assets/polish-audit.mjs page.html`. It prints the radius census, shadow inventory and direction, state layout shifts, focus shape changes, hover gating, icon stroke vs text stems, blurry SVG hairlines, `color-scheme`, tabular figures and heading wrap. Fails are bugs; warnings are prompts to look.
3. Render the page and its state sheet: `node tools/render.mjs page.html out/` and the same for the state sheet (a panel showing every control in every state, chapter 01).
4. Walk the checklist below on the screenshots at 1440 light, 390 dark, then 1440 dark and 390 light. Zoom to 200% on one control row and one card.
5. Fix in checklist order. At most 3 rounds (director rule). Report what is left.

## The checklist
Each item: what to look for, then the fix. A tick needs evidence: a screenshot region or a CSS line.

### A. System audits (fix once, fixes everywhere)
1. **Radius census.** Every radius is 0, 4, 8, 12, 16 or full; nested radii computed (outer minus gap). Fix: map strays to the family; compute nested.
2. **Shadow inventory.** At most five distinct shadows (the tokens), all falling down, alpha under 0.25 in light; none on large dark surfaces. Fix: replace with `--elevation-*`.
3. **Border roles.** Two border tokens only: decorative (about 1.2:1) and interactive (3:1). Inputs use the strong one. Fix: retoken.
4. **One separation per boundary.** No card with border plus separate shadow plus fill change. Fix: pick one or an elevation token.
5. **Icon census.** One family, one cap and join style, stroke within 0.25px of the adjacent text stem (chapter 03 table). Fix: adjust stroke or label weight.
6. **Light source agrees.** Surface gradients lighter at top, shadows down, highlights on top edges. Fix: flip or remove the outlier.

### B. Interactive states (render the state sheet)
7. **Every interactive element** has rest, hover (pointer), focus-visible and pressed that differ from each other and from selected.
8. **Focus keeps the shape**: ring follows the element's radius; nothing in the focus rule changes radius, border width, padding or weight; any link radius rule is `:where(a:focus-visible)`. Rings on colored bands use the band's text color, not `currentColor`.
9. **No layout shift on state change**: hover, focus, error, selected and loading keep the box size (second pixel as inset shadow).
10. **Hover gated** to `(hover: hover) and (pointer: fine)` for anything beyond color.
11. **Disabled reads as unavailable**, not as secondary; reason given or control left enabled.
12. **Loading keeps width, label and accessible name** (label at `opacity: 0`, not `visibility: hidden`), spinner delayed and held (anti-flicker), `aria-busy`, result announced.
13. **Empty, loading and error states** exist as designed screens where the page has data (dashboard: all three; landing: form error and success).
14. **Transitions**: color and background at fast; press at instant; focus ring not animated; rows instant in; reduced motion removes movement only.

### C. Surfaces and type rendering
15. **Dark mode surfaces step up** with elevation; rings and top highlights instead of shadows.
16. **No banding** on large gradients at 1440 dark; grain present where needed and invisible at a glance.
17. **Text on textures or gradients** measured at the worst point.
18. **Theme the browser's parts**: `color-scheme`, `accent-color`, `::selection`, scrollbar colors on custom scrollers.
19. **Headings balanced**, no one-word last line in h1 to h3; paragraphs `pretty`.
20. **Numbers tabular** in tables, KPIs, prices in lists; units muted; true minus sign where values go negative.
21. **Display sizes** use the display cut or optical sizing; text sizes the text cut.
22. **SVG hairlines crisp** at 1x: 1px lines on half pixels or `crispEdges`.

### D. Edges
23. **Sticky header** never covers focus or anchor targets (`scroll-padding-top`).
24. **Nested scrollers** contain overscroll; horizontal regions show their overflow (scroll shadows or a cut item).
25. **Long strings**: the longest real value in every slot at 390 and 1440 does not break or overflow; truncation has the full value available.
26. **Scrollbar gutter stable** on the containers whose height changes, not on the root of a page with full-bleed bands (check the right edge of the render).

### E. The last look (opinion, the exemplar test)
27. **Remove one thing per screen**: a line, an icon, a color, a weight. Linear's 2026 refresh removed separators and dimmed the sidebar.
28. **Squint test**: at 25% zoom, the primary action and headline are the two darkest or most saturated things on screen.
29. **Edge test**: draw the left edges you can see in the 1440 screenshot; each column should show one.
30. **"Would they ship this control?"**: pick the one control that looks most default (often the input or the secondary button) and bring it to the level of the primary.

## Automation (proposals for `tools/lint.mjs`, details in `kb/reviews/design-polish-pipeline-notes.md`)
Implemented now as a separate advisory script, `skills/design-polish/assets/polish-audit.mjs`, so the gate in `tools/lint.mjs` stays unchanged until the editor-in-chief adopts checks. Candidates for promotion to hard gate: focus shape change (item 8), state layout shift (item 9), radius off family (item 1), `color-scheme` missing on a dark-capable page (item 18). Candidates to stay as warnings: shadow count, icon stroke match, heading balance, tabular figures, hover gating.

## Hand-offs
- The 15-item gate: design-foundations `references/fundamentals-checklist.md`.
- The loop and its 3-round cap: design-director.
- Exemplar comparison: the playbook's `references/signature-moves.md`.
