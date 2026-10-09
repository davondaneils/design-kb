# Brief: 05 Scroll, overflow and edge cases

**Question:** How does the page behave at its edges: long content, scroll containers, sticky elements, truncation, and the layout shifts users feel?

**Decisions the reader must be able to make**
- Truncate, wrap, or fade for long labels, and how the full text stays available.
- Scroll container behavior: `overscroll-behavior`, `scrollbar-gutter`, scroll shadows, `scroll-padding` under sticky headers, `scroll-margin` on anchors.
- Sticky header treatment (border or shadow appears only when scrolled).

**Fundamentals (gate)**
- No horizontal page scroll at 390 (FOUNDATIONS item 8).
- Focused element never hidden by a sticky header or footer (WCAG 2.4.11, AA).
- Scrollable regions are keyboard reachable (`tabindex="0"` plus a label).
- Truncated text has its full value reachable (title, tooltip, or expand).

**Expert layer**
- `scrollbar-gutter: stable` so dialogs and filters do not jump the layout.
- `overscroll-behavior: contain` on panels, menus and modals to stop scroll chaining.
- Scroll shadows with pure CSS background attachment, only when content overflows.
- `min-width: 0` on flex and grid children so ellipsis works.
- `text-wrap: balance` on headings, `pretty` on paragraphs.

**Out of scope or reuse:** responsive tables (design-layout `04`), performance and CLS (design-frontend `04`).

**Test briefs:** slice B (table region, sidebar, header) and slice A (header, anchor jumps). **Rubric:** gate; then no jump when a scrollbar appears, anchors land below sticky header, long strings do not break layout.
