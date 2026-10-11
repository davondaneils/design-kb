# Research: Navigation and IA

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Desktop: hidden nav used in 27% of cases vs 48% visible and 50% combo; 5 to 7 s longer to reach; tasks at least 39% longer; content discoverability down over 20%; difficulty 21% higher than visible. NN/g recommends against hamburger on desktop. | NN/g [1] | R (large, multi-site) |
| 2 | Mobile: combo nav (visible "Browse" plus icons) used in 89% of tasks vs 56% and 44% for hidden menus; hiding nav hurt less on mobile than desktop. | NN/g [2] | R |
| 3 | Tab bar is for navigation not actions; keep it visible across sections (except under a modal); avoid overflow "More" tabs; never disable or hide tabs, explain empty sections instead; single-word labels; badges only for critical info; default five or fewer tabs. iOS 26: tab bar floats over content, can minimize on scroll, may carry a trailing search tab. | Apple HIG Tab bars [3] | S (platform) |
| 4 | Android adaptive default: navigation bar when width or height is compact (or tabletop posture), navigation rail otherwise; drawer is an override for expanded widths. | Android developers [4] | S (platform) |
| 5 | Window size classes (width): compact under 600 dp, medium 600 to 839, expanded 840 to 1199, large 1200 to 1599, extra large 1600 and up. Height: compact under 480, medium 480 to 899, expanded 900 and up. | Android developers [5] | S |
| 6 | Priority+ pattern: show the most used links, tuck the rest behind "More"; reveal more as width grows. Visible labels give scent; ranking is political, so base it on data. | Brad Frost [6] | P |
| 7 | Infinite scroll: fine for goal-less feeds of homogeneous items; avoid when users look for something specific, compare items, mostly use top results, need the footer, or SEO matters. Preserve position on return. | NN/g [7] | C |
| 8 | E-commerce lists: load 10 to 30, lazy-load to 50 to 100 then a "Load more" button; search 25 to 75 results; mobile 15 to 30 before "Load more". Restore position on Back with `history.pushState()` (over 90% of benchmarked sites got this wrong). Pagination reduced browsing; users mostly used Next/Previous. | Baymard via Smashing [8] | R (Baymard testing) |
| 9 | Deep link every view state: filters, tabs, pagination, expanded panels. | Vercel [9] | P |
| 10 | Users prefer to view and tap the center of the screen; secondary actions on top and bottom edges; tertiary in menus from corners. | Hoober, UXmatters 2017 [10] | R |
| 11 | Interactive (live) filters suit exploration and only work if results return in under 1 s; batch filters suit users setting several criteria; on mobile prefer batch with an Apply button. Dim results with one progress indicator while updating. | NN/g Applying filters [11] | C |
| 12 | Mobile facets: tray over results sliding from the right, translucent overlay, results visible behind, text label "Filter", total count always visible, familiar controls. Article favors live updates. | NN/g mobile faceted search [12] | C |

## Conflicting views
- "Hamburger is fine on mobile" vs NN/g: NN/g shows the cost is smaller on mobile, not zero. Combo nav beat hidden nav even on mobile.
- NN/g mobile faceted search favors live updates; NN/g applying filters favors batch on mobile when loads are slow. Resolution: the 1 s rule decides.
- Hoober's own 2013 thumb-zone drawings were retracted by him in 2017 in favor of the center finding. Many blog "thumb zone" heatmaps still cite the old drawings.

## Sources
1. https://www.nngroup.com/articles/hamburger-menus/
2. https://www.nngroup.com/articles/find-navigation-mobile-even-hamburger/
3. https://developer.apple.com/design/human-interface-guidelines/tab-bars
4. https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation
5. https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes
6. https://bradfrost.com/blog/post/revisiting-the-priority-pattern/
7. https://www.nngroup.com/articles/infinite-scrolling-tips/
8. https://www.smashingmagazine.com/2016/03/pagination-infinite-scrolling-load-more-buttons/
9. https://vercel.com/design/guidelines
10. https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php
11. https://www.nngroup.com/articles/applying-filters/
12. https://www.nngroup.com/articles/mobile-faceted-search/
