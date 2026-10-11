# Research: 05 Scroll, overflow, edges

Accessed 2026-10-09. Tiers and status as in 01.

## Key findings
1. `scrollbar-gutter` reserves space for the scrollbar, "preventing unwanted layout changes as the content grows"; `stable` reserves it for classic scrollbars even when not overflowing; overlay scrollbars get no gutter (MDN).
2. `overscroll-behavior: contain` stops scroll chaining to the page behind and disables pull-to-refresh and swipe navigation inside the element (MDN). Scroll chaining defined: once a dialog's scroll boundary is reached, "the underlying page will then start to scroll".
3. WCAG 2.4.11 Focus Not Obscured (Minimum), AA: "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content." Sticky headers and footers are the usual cause; technique C43 uses CSS `scroll-padding`.
4. `interpolate-size: allow-keywords` enables transitions to intrinsic sizes such as `auto` (one end must be a length), so accordions can animate height without JS (MDN; Chromium only at time of writing, progressive enhancement).
5. NN/g skeletons: spinners for 2 to 10 s loads; skeletons under 10 s; progress bars above 10 s; frame-only skeletons "should not be used as a progress indicator".
6. NN/g empty states: communicate status, "Help users discover unused features", "Provide direct pathways for getting started with key tasks".
7. design-ux `04` already sets loader timing and the seven states; design-layout `04` owns responsive tables. Polish adds the edge mechanics.

## Claim table
| # | Claim | Quote | URL | Tier | Status |
|---|---|---|---|---|---|
| E1 | scrollbar-gutter purpose | "preventing unwanted layout changes as the content grows while also avoiding unnecessary visuals when scrolling isn't needed" | https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter | 1 | C |
| E2 | overlay scrollbars | "When using overlay scrollbars, the gutter will not be present." | same | 1 | C |
| E3 | contain | "no scroll chaining occurs on neighboring scrolling areas; the underlying elements will not scroll" | https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior | 1 | C |
| E4 | contain disables navigation | "The contain value disables native browser navigation, including the vertical pull-to-refresh gesture and horizontal swipe navigation." | same | 1 | C |
| E5 | 2.4.11 | "When a user interface component receives keyboard focus, the component is not entirely hidden due to author-created content." | https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html | 1 | C |
| E6 | C43 | technique "Using CSS scroll-padding to un-obscure content" (listed as sufficient) | same | 1 | C |
| E7 | interpolate-size | "allows you to enable animations and transitions between a <length-percentage> value and an intrinsic size" | https://developer.mozilla.org/en-US/docs/Web/CSS/interpolate-size | 1 | C |
| E8 | Skeleton under 10 s | "skeleton screens should be used with a wait time that's under 10 seconds" | https://www.nngroup.com/articles/skeleton-screens/ | 3 | C |
| E9 | Frame-only skeletons | "should not be used as a progress indicator" | same | 3 | C |
| E10 | Empty states pathways | "Provide direct pathways for getting started with key tasks" | https://www.nngroup.com/articles/empty-state-interface-design/ | 3 | C |
| E11 | Spinner range | "they are best used when the page takes 2–10 seconds to load" (NN/g's en dash) | https://www.nngroup.com/articles/skeleton-screens/ | 3 | C |
