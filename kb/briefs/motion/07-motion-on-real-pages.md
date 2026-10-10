# Brief: 07 Motion on real pages: data, numbers and verification

**Question it answers:** How does motion behave on a shipped page that carries data (charts, prices, live numbers), and how do you prove it is right when screenshots cannot show it?

**Audience:** Claude building a landing page or dashboard through design-director; the tester judging it.

**Decisions the reader must be able to make:**
- Whether a chart or number animates at all, on which trigger (first view, change, never on load), and with what curve so the motion does not misstate the data.
- How to reveal a drawing (line, area, contour field) on the compositor, and how to sync annotations to it.
- How to roll changed digits, and what WCAG asks of auto-updating values.
- How the same dialog behaves from a pointer and from the keyboard.
- How to film, time and check every animation on a page, in both motion settings, before hand-over.

**Fundamentals:** tokens only, read by scripts from CSS; reduced motion designed per element; first paint never animated; keyboard paths instant; no box-shadow, layout or blur animation; every transition list entry carries a token curve (an entry without one falls back to `ease`).

**Expert layer:** linear for reveals whose x axis is time; the two-transform wipe; digits roll by direction of change; animate the change, not the arrival; fade-through instead of crossfade in one box, in reduced motion too; modality-aware dialogs; seeking frozen animations with the Web Animations API to film them; the lint measuring mid-entrance.

**Must cover:** WCAG 2.2.2 auto-updating content; Robertson et al. on animation for analysis versus presentation; Heer and Robertson on animated transitions; MDN `getAnimations`, `currentTime`, `getKeyframes`, `transition-behavior`, `@starting-style`, `font-variant-numeric`; Playwright `reducedMotion`; web.dev animation guide; NN/g durations; Kowalski on keyboard-initiated motion.

**Out of scope or reuse:** chart design itself (dataviz skill); KPI layout (design-product-ui 06); copy for status text (design-copy).

**Test briefs:** the two slice pages in `slice-test-briefs.md` (coffee roast curve and contour reveal, add to cart; dashboard live numbers, palette, menus, drawer, retry).

**Rubric:** the motion rubric in `slice-test-briefs.md`, gate first.
