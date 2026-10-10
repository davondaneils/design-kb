# Research: 07 Motion on real pages: data, numbers and verification

Researcher, 2026-10-10, for brief `kb/briefs/motion/07-motion-on-real-pages.md`. Every quote below was fetched on 2026-10-10 (WebFetch; curl through the proxy was refused for these hosts, WebFetch was not). Tiers per `.claude/agents/researcher.md`. Status: C consensus, S single source, O opinion.

## Key findings
1. **Auto-updating numbers are a WCAG 2.2.2 matter, not only a style choice.** Content that updates on a timer and sits beside other content needs a way to pause, stop, hide or slow it, unless essential. A live dashboard KPI qualifies. (W3C, tier 1.)
2. **Animation helps people see a change and hurts analysis.** Animated transitions "can significantly improve graphical perception" of changes between chart states (Heer and Robertson), but animation is "the least effective form for analysis" of trends, while presentation audiences "find it enjoyable" and still make "many participant errors" (Robertson et al.). Reading: animate a change once for orientation; never make people watch data arrive on a screen they analyse daily. (Tier 3.)
3. **Every animation on a page is inspectable and seekable.** `document.getAnimations()` returns CSS animations, CSS transitions and script animations; `currentTime` "returns and sets" the time "whether running or paused"; `getKeyframes()` exposes each keyframe's easing. That is enough to freeze, film and audit motion in a headless browser. (MDN, tier 1.)
4. **A transition list entry without a curve gets `ease`.** The initial value of `transition-timing-function` is `ease`, and lists repeat or truncate to match `transition-property`. So `visibility 100ms` in a list silently runs on `ease`, off the token set. Measured on the coffee page by the audit (`kb/tests/design-motion.md`). (MDN, tier 1, plus measurement.)
5. **Exit transitions of things that leave the top layer need `display` and `overlay` with `allow-discrete`, and entrances need `@starting-style`.** Without `display` the exit "would not be visible"; without `@starting-style` "the entry animation would not occur". (MDN, tier 1.)
6. **Movement belongs on transform and opacity.** "Where possible, restrict animations to opacity and transform"; anything with a blur "like a shadow" costs more to paint. (web.dev, tier 1.)
7. **Durations:** "most animations should be in the range of 100 to 500 ms"; "the more frequent the animation, the more subtle and shorter"; 400 ms is "a very slow animation, to be used only for big movements across large screens". (NN/g, tier 4 research org, consensus.)
8. **Keyboard-initiated actions:** "These actions may be repeated hundreds of times a day"; "You should never animate them". Raycast's palette has "no animation at all. That's the optimal experience." (Kowalski, tier 4, opinion backed by shipped work at Vercel and Linear.)
9. **Reduced motion can be emulated** in Playwright: `reducedMotion` "Emulates 'prefers-reduced-motion' media feature, supported values are 'reduce', 'no-preference'." The repo's `tools/render.mjs` renders with `reduce`, so screenshots show end states only. (Playwright docs, tier 1.)
10. **Tabular figures** keep rolling digits from jittering: `tabular-nums` makes "numbers ... all of the same size". (MDN, tier 1.)

## Numbers and derived rules (measured here)
- Curve reveal: linear over `--duration-page` (600 ms); a marker at share `a` of the time axis lands at `a x 600 ms`. With a decelerating curve the pen position at time t is the curve's output, so a marker delay would need the inverse of the bezier; linear avoids it. Derived, opinion on the choice.
- Contour rise: 14 levels, step = min(40, 300 / 13) = 23 ms, so the last level starts at 300 ms and ends at 500 ms. Measured on the strip `kb/tests/design-motion/strips/coffee-2-contour-rise.png`.
- Frame times at 4x CPU throttle (headless Chromium, no GPU; relative only): curve wipe (two transforms) median 16.7 ms, 3 frames over 25 ms in 1.4 s, the worst being the scroll jump that triggers it; previous `clip-path` draw over 1800 ms: 10 frames over 25 ms; 37 SVG path opacity fades: 6 frames over 25 ms, p95 33.4 ms. `kb/tests/design-motion/perf.txt`.
- A lint pass that opens a dialog by URL measured the switch inside it at 23 px tall: the dialog was mid-entrance at scale 0.96 (24 x 0.96 = 23). Review hooks must open dialogs without their entrance, or the lint must wait for animations to finish.

## Conflicting views
- Count-up animations on KPIs are common in templates; nothing in tier 1 to 3 supports them, and finding 2 argues against them on analytic screens. Treated as an anti-pattern (opinion).
- Kowalski says never animate keyboard-initiated actions; Apple and Material animate dialogs regardless of input. Resolution used: input-modality-aware dialogs (instant from the keyboard, animated from a pointer). Opinion.

## Claim table
| # | Claim | Quote (under 40 words) | URL | Accessed | Tier | Status |
|---|---|---|---|---|---|---|
| 1 | WCAG 2.2.2 covers auto-updating information | "For any auto-updating information that (1) starts automatically and (2) is presented in parallel with other content," ... "there is a mechanism for the user to pause, stop, or hide it or to control the frequency of the update" | https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html | 2026-10-10 | 1 | C |
| 2 | Definition of auto-updating | "'Auto-updating' refers to content that updates or disappears based on a preset time interval." | https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html | 2026-10-10 | 1 | C |
| 3 | Examples include stock prices | "Common time-based content includes automatically updated weather information, news, stock price updates," | https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html | 2026-10-10 | 1 | C |
| 4 | Animated transitions improve perception of change | "finding that animated transitions can significantly improve graphical perception." | https://idl.uw.edu/papers/animated-transitions | 2026-10-10 | 3 | S |
| 5 | Animation worst for analysis | "Animation is the least effective form for analysis" | https://www.microsoft.com/en-us/research/publication/effectiveness-of-animation-in-trend-visualization/ | 2026-10-10 | 3 | S |
| 6 | Animation is enjoyable but error-prone in presentation | "it is the fastest technique for presentation and participants find it enjoyable and exciting" ... "it does lead to many participant errors." | https://www.microsoft.com/en-us/research/publication/effectiveness-of-animation-in-trend-visualization/ | 2026-10-10 | 3 | S |
| 7 | getAnimations lists transitions too | "returns an array of all Animation objects currently in effect whose target elements are descendants of the document. This array includes CSS Animations, CSS Transitions, and Web Animations." | https://developer.mozilla.org/en-US/docs/Web/API/Document/getAnimations | 2026-10-10 | 1 | C |
| 8 | currentTime seeks, paused or running | "returns and sets the current time value of the animation in milliseconds, whether running or paused." | https://developer.mozilla.org/en-US/docs/Web/API/Animation/currentTime | 2026-10-10 | 1 | C |
| 9 | Keyframes expose their easing | "The easing function used from this keyframe until the next keyframe in the series." | https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/getKeyframes | 2026-10-10 | 1 | C |
| 10 | Missing curve defaults to ease | Initial value: "ease"; "If there are fewer easing functions specified than in the transition-property list, the user agent must calculate which value is used by repeating the list of values" | https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function | 2026-10-10 | 1 | C |
| 11 | display needed for exit from top layer | "Without this, the exit animation would not be visible; in effect, the popover would just disappear." | https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior | 2026-10-10 | 1 | C |
| 12 | @starting-style needed for entry | "Without this, the entry animation would not occur and the popover would just appear." | https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior | 2026-10-10 | 1 | C |
| 13 | Restrict to transform and opacity | "Where possible, restrict animations to opacity and transform." | https://web.dev/articles/animations-guide | 2026-10-10 | 1 | C |
| 14 | Shadows are expensive to paint | "anything that involves a blur (like a shadow, for example) takes longer to paint than drawing a red box." | https://web.dev/articles/animations-guide | 2026-10-10 | 1 | C |
| 15 | Duration band | "the duration of most animations should be in the range of 100–500 ms," | https://www.nngroup.com/articles/animation-duration/ | 2026-10-10 | 4 | C |
| 16 | Frequent means shorter | "the more frequent the animation, the more subtle and shorter you'll want it to be." | https://www.nngroup.com/articles/animation-duration/ | 2026-10-10 | 4 | C |
| 17 | Never animate keyboard-initiated actions | "These actions may be repeated hundreds of times a day" ... "You should never animate them." | https://emilkowal.ski/ui/you-dont-need-animations | 2026-10-10 | 4 | O |
| 18 | Raycast has no open animation | "But there's no animation at all. That's the optimal experience." | https://emilkowal.ski/ui/you-dont-need-animations | 2026-10-10 | 4 | O |
| 19 | Playwright reduced motion emulation | "Emulates 'prefers-reduced-motion' media feature, supported values are 'reduce', 'no-preference'." | https://playwright.dev/docs/api/class-browser | 2026-10-10 | 1 | C |
| 20 | Tabular figures | "tabular-nums activating the set of figures where numbers are all of the same size, allowing them to be easily aligned like in tables." | https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric | 2026-10-10 | 1 | C |
| 21 | Reduce means tone down, a dissolve is an accepted replacement | "the animation on the box will tone down to the dissolve animation, which is a more muted animation that is not a vestibular motion trigger." | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion | 2026-10-10 | 1 | C |
| 22 | Moving content into view is essential to scrolling; parallax is not | "Moving new content into the viewport is essential for scrolling" | https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html | 2026-10-10 | 1 | C |
| 23 | finished promise | "returns a Promise which resolves once the animation has finished playing." | https://developer.mozilla.org/en-US/docs/Web/API/Animation/finished | 2026-10-10 | 1 | C |

## Exemplar teardowns
None usable: every exemplar host is blocked from this environment (`kb/exemplars.md`), and no motion teardown exists in `kb/teardowns/`. Motion values of Linear, Vercel and Stripe could not be measured; nothing here claims them. Recheck when hosts open: measure `getAnimations()` timings on linear.app and vercel.com with `motion-audit.mjs` pointed at the live URL.

## Likely to change
- Browser support for `@starting-style`, `transition-behavior` and the `overlay` property was not re-fetched in this run (reference 06 records the August 2024 Baseline for the first two). Unverified here: check caniuse before relying on `overlay` outside Chromium; a browser that does not know it drops that list entry and the dialog simply leaves the top layer at once.
- `interpolate-size` and scroll-driven animations (see 03, 06).
