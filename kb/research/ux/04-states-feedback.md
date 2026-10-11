# Research: States and feedback

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Progress indicators for anything over about 1 s; looped spinner for 2 to 10 s; percent-done for 10 s or more, with a time estimate; never static "Loading..." text. Users with a looped indicator waited about 3 times longer than with none. | NN/g [1] | C |
| 2 | Skeletons only for full-page loads under about 10 s; spinners for single modules; skip both under 1 s; avoid frame-only skeletons; animated shimmer may distract and needs care. | NN/g [2] | C |
| 3 | Anti-flicker: delay showing a loader about 150 to 300 ms, and once shown keep it at least 300 to 500 ms. Skeletons must mirror final layout exactly (no shift). Loading buttons keep their label and add an indicator. Use ellipsis for in-progress labels ("Saving..."). | Vercel [3] | P |
| 4 | Optimistic updates: update immediately, reconcile with server; on failure show an error and roll back or offer Undo. Mutations should finish under 500 ms. | Vercel [3] | P |
| 5 | Empty states: never blank; say whether nothing exists or it is still loading (loading shows progress, not "no records"); teach what the area is for; give a direct action (Create, Learn more, demo data). | NN/g [4] | C |
| 6 | Design empty, sparse, dense and error states; no dead ends; handle short, average, very long content. | Vercel [3] | P |
| 7 | Apple: show something as soon as possible; determinate indicator when duration known; let people do other things while loading. Avoid alerts at launch; show cached data plus a nonintrusive label when offline. | Apple HIG Loading, Alerts [5][6] | S (platform) |
| 8 | Error message rules: near the cause, severity-matched prominence (modal only for serious), plain language, specific, constructive, keep input, no blame. | NN/g [7] | C |
| 9 | Toasts and inline validation announce via polite `aria-live`. | Vercel [3]; WCAG 4.1.3 Status Messages | S |
| 10 | WCAG 2.2.1 Timing Adjustable (A): time limits must be adjustable, extendable or long (20 hours), with exceptions; applies to auto-dismissing content that requires action. | W3C WCAG 2.2 | S |
| 11 | AI and long tasks: preview plans; consent before high-stakes actions; post-action summary of what changed and what can be undone; run contract (time, cost cap, definition of done); interim findings; resumption summaries; show uncertainty; calibrate friction by stakes; expand autonomy progressively. | Jakob Nielsen, "Intent by Discovery" [8] | P (eminent, current) |

## Sources
1. https://www.nngroup.com/articles/progress-indicators/
2. https://www.nngroup.com/articles/skeleton-screens/
3. https://vercel.com/design/guidelines
4. https://www.nngroup.com/articles/empty-state-interface-design/
5. https://developer.apple.com/design/human-interface-guidelines/loading
6. https://developer.apple.com/design/human-interface-guidelines/alerts
7. https://www.nngroup.com/articles/error-message-guidelines/
8. https://jakobnielsenphd.substack.com/p/intent-ux
