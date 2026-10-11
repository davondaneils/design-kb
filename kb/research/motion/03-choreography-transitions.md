# Research: 03 Choreography, page and scroll transitions

Status key: C = consensus, P = practitioner opinion, S = single source.

| Claim | Source | Status |
|---|---|---|
| Four patterns: container transform ("one thing turns into another"), shared axis (spatial or navigational relationship), fade through (no strong relationship: top-level destinations, bottom nav), fade (elements entering or exiting within screen bounds, such as dialogs and menus). | Material motion with MDC (Android Developers) and MDC Motion.md | C |
| Fade through: incoming element starts at scale 0.92; outgoing finishes fading at 35 percent of the duration, incoming fades in over the remaining 65 percent. | MDC Android source: MaterialFadeThrough (DEFAULT_START_SCALE = 0.92f), FadeThroughProvider (FADE_THROUGH_THRESHOLD = 0.35) | C (code) |
| Shared axis defaults to the Long1 duration token (450 ms) with emphasized easing; X axis slides horizontally, Y vertically, Z scales. | MDC Android MaterialSharedAxis | C (code) |
| Container transform: paired Hold or ElevationScale on the outgoing screen must use the same duration. | MDC Motion.md | C |
| Spatial consistency: motion shows where things live and come from; matching enter and exit direction makes swipe-to-dismiss intuitive. | Rauno Freiberg; Kowalski (Sonner) | P |
| Popovers scale from their trigger; modals stay centered. Radix exposes `--radix-tooltip-content-transform-origin` and equivalents. | Kowalski skill; Radix docs | P + C |
| Stagger delays 30 to 80 ms between items; never block interaction during a stagger. | Kowalski skill | P |
| Movement of new content into view during scrolling is essential; extra scroll animation and parallax are non-essential and should be controllable. | WCAG 2.3.3 Understanding | C |
| Exaggerated parallax and scroll-jacking are "highly likely to be triggering"; large-area and direction-mismatched motion are worst. | Val Head, A List Apart | C |
| Same-document View Transitions Baseline newly available 14 Oct 2025 (Firefox 144 completed it). | web.dev blog | C |
| Cross-document view transitions (`@view-transition { navigation: auto }`) shipped in Chromium 126 and Safari 18.2; not in Firefox stable at research time. | MDN plus prior knowledge; web search budget ran out before re-verification | S, verify on caniuse before relying |
| Scroll-driven animations: Chrome 115 (Jul 2023), Safari 26 (Sep 2025); Firefox behind a flag as of 152. Transform and opacity run off the main thread. | developer.chrome.com; buildmvpfast.com 2026 post (tier 5, a lead only: Safari and Firefox status rest on it alone, so verify on MDN compatibility data before relying on them) | C (Chrome) + unverified (Safari, Firefox) |
| Chromium excludes elements with opacity 0 from LCP candidates. | web.dev LCP | C |

## Sources
- https://medium.com/androiddevelopers/material-motion-with-mdc-c1f09bb90bf9
- https://github.com/material-components/material-components-android/blob/master/lib/java/com/google/android/material/transition/MaterialFadeThrough.java ("private static final float DEFAULT_START_SCALE = 0.92f;")
- https://github.com/material-components/material-components-android/blob/master/lib/java/com/google/android/material/transition/FadeThroughProvider.java ("static final float FADE_THROUGH_THRESHOLD = 0.35F;"); both re-fetched 2026-10-10, replacing the repository root URL
- https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/
- https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations
- https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- https://www.buildmvpfast.com/blog/css-scroll-driven-animations-replace-js-2026
- https://web.dev/articles/lcp
- https://www.radix-ui.com/primitives/docs/components/tooltip
