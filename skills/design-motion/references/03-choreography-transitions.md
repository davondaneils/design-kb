# 03 Choreography, page and scroll transitions

## Principles
1. One hero per transition. The element the person acted on leads; everything else supports or gets out of the way (opinion; consistent with NN/g warning that simultaneous animations compete).
2. Motion encodes the spatial model. Forward and back slide along one axis; deeper and shallower scale or grow from the source; peers fade through (Material motion system; NN/g navigation metaphor).
3. Outgoing content leaves before incoming content arrives, so two full-opacity layers never overlap (Material fade through: outgoing done by 35 percent of the duration).
4. Scrolling belongs to the person. Content may react to scroll; scroll may never be taken over (WCAG 2.3.3 Understanding; Val Head on scroll-jacking).

## Decision rules
**Pick the transition pattern** (Material motion system)
| Relationship between the two views | Pattern | Spec on the shared tokens |
|---|---|---|
| One element becomes the next view (card to detail, FAB to sheet, row to page) | Container transform (shared element) | Bounds morph at `--duration-slow`, `--ease-standard`; content inside crossfades in the middle third |
| Sibling or sequential steps (wizard step 2 to 3, tabs with order, back and forward) | Shared axis | Outgoing slides 30 px and fades out, incoming slides 30 px in from the opposite side; X for lateral, Y for vertical stacks, Z (scale 0.92 to 1) for parent to child; `--duration-slow` (Material default is 450 ms; opinion: 300 ms on web) |
| Unrelated peers (bottom nav, top-level destinations, swapping a list) | Fade through | Outgoing fades out in the first 35 percent; incoming fades in and scales 0.92 to 1 over the remaining 65 percent; `--duration-base` |
| An element appears or leaves inside the current view (dialog, menu, snackbar) | Fade (plus small scale) | See 04 component specs |

The 30 px slide distance is an opinion consistent with Material's small-offset approach; keep it under 10 percent of the viewport so it reads as direction, not travel.

**Choreography and stagger**
- Container first, content second: a panel arrives, then its content fades in starting at about 30 to 50 percent of the container's duration (opinion; matches Material's sequencing).
- Stagger step 30 to 50 ms (Kowalski range 30 to 80 ms). Cap the whole cascade so the last item starts within `--duration-slow` (300 ms): with a 40 ms step, stagger at most 8 items and show the rest together (opinion).
- Stagger only on first appearance of a set, never on re-sort, filter or pagination of the same set (opinion; frequency ladder).
- Never block interaction during a stagger (Kowalski).
- Transform origin follows causality: popovers, menus and tooltips grow from their trigger (use the library's origin variable, for example `--radix-tooltip-content-transform-origin`); centered modals grow from center (Kowalski; Radix).
- Direction stays consistent: if "next" slides left, "back" slides right everywhere, and an element dismisses in the direction it came from (Freiberg; Apple HIG "follows people's gestures and expectations").

**Page transitions on the web**
- Same-document (SPA): use the View Transitions API, Baseline newly available since 14 Oct 2025 (web.dev). Wrap with a feature check so unsupported browsers update instantly.
- Cross-document (MPA): `@view-transition { navigation: auto; }` on both pages. Supported in Chromium and Safari, not Firefox stable at the time of research (verify on caniuse). It degrades to a normal navigation, so it is safe to ship.
- Default root crossfade is enough for most sites; add `view-transition-name` only to the one hero element per navigation. Names must be unique on the page at the moment of capture.
- Keep page transitions at `--duration-page` (400 ms) or shorter in apps. Use the full 600 ms only for marketing storytelling pages.

**Scroll**
- Never scroll-jack (change scroll speed, direction or snapping the person did not ask for). Val Head: "highly likely to be triggering."
- Scroll reveals: opacity 0 to 1 and translateY 8 to 16 px, once per element, at `--duration-slow` or bound to `animation-timeline: view()` with `animation-range: entry 0% cover 30%` (opinion on values; MDN for syntax).
- Never apply an opacity reveal to the LCP element or other above-the-fold text. The one exception is the hero reveal FOUNDATIONS allows (up to 800ms, once), on the supporting artifact by transform or clip-path. Chromium does not count opacity 0 elements as LCP candidates (web.dev), so a fade-in hero delays LCP. Content must also be visible if JS or the animation never runs: hide only inside `@supports (animation-timeline: view())` or after JS adds a class.
- Parallax is non-essential motion (WCAG 2.3.3 Understanding); remove it under reduced motion and keep the layer offset small (opinion: background moves under 20 percent of scroll distance).
- Scroll-driven CSS animations: Chrome 115+, Safari 26+, Firefox behind a flag (research date). They run off the main thread for transform and opacity. Use `@supports (animation-timeline: view())` and treat them as progressive enhancement.

## Do and don't
- Do: product card expands into the product page with the image as the shared element. Don't: slide the whole page left and also zoom the image.
- Do: bottom nav tabs fade through. Don't: slide bottom nav tabs left and right; they are peers without order (Material).
- Do: stagger 6 dashboard cards at 40 ms on first load. Don't: stagger 40 rows at 80 ms (3.2 s before the last row appears).
- Do: reveal mid-page feature blocks on scroll once, and give the hero's artifact the page's one reveal (up to 800ms, FOUNDATIONS). Don't: animate the hero headline in from opacity 0.

## Worked examples
1. **E-commerce grid to product detail (Next.js app router).** Pattern: container transform. The tapped card image gets `view-transition-name: product-hero` just before navigation (set by click handler, then removed), the root crossfades at `--duration-base`, and the image group animates bounds at `--duration-slow` with `--ease-standard`. Back navigation reverses through the same name. Reduced motion: drop the named element so only the root crossfade runs, and shorten it to `--duration-fast`.
2. **Marketing landing page.** Hero: headline and action fully visible at first paint (protects LCP); the one hero reveal FOUNDATIONS allows on a marketing page (up to 800ms on `--ease-enter`, played once on load, removed under reduced motion; Stripe reveals `.8s`, `kb/teardowns/stripe-home.md`) plays on the artifact beside it, by transform or clip-path. A page with no motion at all reads as no voice: round 1 measured 1 duration and 1 curve against the exemplars' 5 to 8 and 4 to 9 (`kb/reviews/benchmark-round1-landing.md` scorecard Motion). Sections below the fold: one reveal each (opacity plus 12 px rise) via `view()` timeline with `@supports` guard. Logo marquee: `linear`, pauses on hover and focus, has a visible pause button because it runs more than 5 seconds next to other content (WCAG 2.2.2). Reduced motion: no reveals, marquee becomes a static wrapped row.

## Hand-offs
- design-layout owns the spatial model (what is a child, a peer, a step); this chapter maps it to motion.
- design-search and design-frontend own Core Web Vitals; the LCP rule here is non-negotiable input to them.
- design-ux owns navigation structure.
