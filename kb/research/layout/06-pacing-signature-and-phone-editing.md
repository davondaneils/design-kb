# Research 06: Page pacing, signature layout moves, phone editing, dashboard grids

Brief: `kb/briefs/layout/06-pacing-signature-and-phone-editing.md`. Researcher pass, 2026-10-10. Status key: C = consensus, X = contested, O = opinion. Tiers per `.claude/agents/researcher.md`.

**Access note.** Exemplar hosts (stripe.com, linear.app, apple.com, pentagram.com and the rest of `kb/exemplars.md`) are still blocked from this environment, so no tier 2 teardown values are new in this note. Claims about exemplar layouts in the chapter are remembered, labelled opinion, and point at the teardown stream for confirmation. Google Fonts and npm are reachable (coordinator note, 2026-10-10); photo hosts are not. Layout does not need either.

## Key findings

1. **Phone editing is a real debate, and the standards body of the web's largest search engine settled the practical side: keep the content, change its presentation.** Nielsen (2011, 2012) argued for deferring or cutting secondary content on mobile; Josh Clark and others argued that cutting content treats mobile as "lite". Google's mobile-first indexing indexes the mobile page, tells sites to keep the same content and to move it into accordions or tabs rather than remove it. Resolution for this KB: on a phone, edit the presentation (reorder, crop, shrink art to a thumbnail, merge duplicates, collapse detail behind disclosure, defer to the next screen) and never withhold content the desktop page states only once. Removing a duplicate is editing; removing a unique fact is cutting. (Claims 1 to 5.)
2. **Progressive disclosure is the sanctioned tool, with known costs.** Apple HIG recommends it for cleaner layouts; NN/g finds accordions help on mobile but warns about disorientation and long expanded sections. (Claims 5, 6, 8.)
3. **Alternating image-left, image-right sections slow scanning.** NN/g eyetracking: zigzag layouts make decorative images harder to ignore; aligned layouts scan faster. So "rhythm" must not come from flipping media sides. It should come from scale, density and tone changes on a stable set of edges. (Claim 7.)
4. **Pacing is an editorial practice, documented by magazine makers.** A flatplan lets an editor see every spread at once and "pace the reading experience", with smaller features breaking up long ones. Web pages have the same problem in one dimension. No controlled study of web section pacing was found; the alternation rule in the chapter is opinion grounded in this editorial practice. (Claims 9, 10.)
5. **Supporting pane proportions are documented.** Android's canonical layouts give the primary pane about two thirds and the supporting pane the rest, 70/30 at expanded widths, 50/50 at medium; the supporting pane only makes sense next to its primary. That is the rule for a dashboard's chart-plus-explainer row. (Claims 11 to 13.)
6. **Priority by position is documented by Apple and NN/g.** Most important items near the top and leading side; attention leans left. (Claims 14, 15 here; research 03 for NN/g.)
7. **The measure default holds.** Re-ran `kb/research/typography/measure-cpl.mjs` on 2026-10-10: `52ch` renders 63 to 68 characters per line in all eight installed faces at 16 and 20px; `66ch` renders 81 to 86. Layout-specific consequence: `ch` resolves against the font of the element that carries the `max-inline-size`, so set the measure on the paragraph (or a wrapper with the same font), never on a grid track whose font differs. (Claims 16, 18.)
8. **Measured on the test pages** (derived, `kb/tests/design-layout/measure-layout.mjs`): see claim 17 and the tester report for the numbers.

## Numbers and formulas
| Number | Value | Source |
|---|---|---|
| Supporting pane split, expanded width | 70 / 30 (12-column: 8 + 4) | Claim 12 |
| Supporting pane split, medium width | 50 / 50, or stack | Claim 12 |
| Measure | `52ch` = 63 to 68 characters; `66ch` = 81 to 86 | Claim 16 (re-measured) |
| Fold for checks | 900px tall desktop viewport, 844px phone (iPhone 14/15 class CSS height); the render tool uses 900 for both | Tool default; phone height is a working assumption, opinion |

## Conflicting views
- **Cut versus keep on mobile.** Nielsen 2012 ("cut features") versus Clark 2012 ("mobile isn't the lite version") and Google (same content). Resolved above: defer and collapse, do not cut unique content. Nielsen's own 2011 article already frames it as deferral to secondary screens, which is compatible.
- **Accordions.** Google and Apple recommend disclosure to save space; NN/g documents disorientation. Resolution: collapse only secondary detail, keep headers visible, never hide the primary action or the answer.

## Claim table

| # | Claim | Quote (under 40 words) | URL | Accessed | Tier | Status |
|---|---|---|---|---|---|---|
| 1 | Mobile page should carry the desktop content | "Make sure that your mobile site contains the same content as your desktop site." | https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing | 2026-10-10 | 1 | C |
| 2 | Collapse rather than remove | "Instead of removing content, consider moving content into accordions or tabs to save space." | https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing | 2026-10-10 | 1 | C |
| 3 | Defer secondary information on mobile; a dense first screen fails | "if you make the first screen too dense, then nobody will read anything." (Nielsen, 2011) | https://www.nngroup.com/articles/defer-secondary-content-for-mobile/ | 2026-10-10 | 3 | C (deferral), X (deletion of tertiary detail) |
| 4 | Nielsen's 2012 advice to cut for mobile, as quoted by Clark | "Cut features to eliminate things that are not core to the mobile use case." | https://bigmedium.com/ideas/mobile-not-lite-jakob-nielsen.html | 2026-10-10 | 4 | X |
| 5 | Counter-position: cutting mobile content is cutting chapters | "Stripping out content from a mobile website is like a book author stripping out chapters from a paperback just because it’s smaller." (Josh Clark, 2012; quote completed after the critic re-fetch, round 1 had cut the sentence short) | https://bigmedium.com/ideas/mobile-not-lite-jakob-nielsen.html | 2026-10-10 | 4 | O |
| 6 | Accordions help on mobile, with a disorientation cost | "often solve the problem of displaying too much content in too little screen space." and "Accordions can also increase user disorientation." (Budiu, 2015) | https://www.nngroup.com/articles/mobile-accordions/ | 2026-10-10 | 3 | C |
| 7 | Zigzag image-text layouts slow scanning; align instead | "Zigzag layouts made it more difficult to ignore decorative imagery." (Flaherty, 2017) | https://www.nngroup.com/articles/zigzag-page-layout/ | 2026-10-10 | 3 | C |
| 8 | Progressive disclosure for cleaner layouts | "Use progressive disclosure to make layouts cleaner and easier to interact with." | https://developer.apple.com/design/human-interface-guidelines/layout | 2026-10-10 | 1 | C |
| 9 | Editors pace an issue from the flatplan | "It allows you to pace the reading experience by placing and moving around story ideas" (Offscreen, 2015) | https://offscreenmag.com/blog/how-to-plan-a-magazine | 2026-10-10 | 4 | O (practitioner, inspectable magazine) |
| 10 | Smaller pieces between long ones break the read into chunks | "Changing smaller features in between break up the reading experience into digestible chunks." | https://offscreenmag.com/blog/how-to-plan-a-magazine | 2026-10-10 | 4 | O |
| 11 | Supporting pane: primary about two thirds | "The primary display area occupies the majority of the app window (typically about two thirds) and contains the main content." | https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts | 2026-10-10 | 1 | C |
| 12 | Split by width class | "For expanded width, give 70% of the space to the main content, 30% to the supporting content." | https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts | 2026-10-10 | 1 | C |
| 13 | A supporting pane depends on its primary | "Secondary pane content is meaningful only in relation to the primary content" | https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts | 2026-10-10 | 1 | C |
| 14 | Priority by position | "place the most important items near the top and leading side of the window or display." | https://developer.apple.com/design/human-interface-guidelines/layout | 2026-10-10 | 1 | C |
| 15 | Layout follows available space, not device | "Determine layout based on size classes, not device type or orientation." | https://developer.apple.com/design/human-interface-guidelines/layout | 2026-10-10 | 1 | C |
| 16 | `52ch` renders 63 to 68 characters in eight faces; `66ch` 81 to 86 | Derived: `node kb/research/typography/measure-cpl.mjs`, re-run 2026-10-10, same table as the typography research | `kb/research/typography/measure-cpl.mjs` | 2026-10-10 | derived | C (measured) |
| 18 | `ch` is measured in the font of the element that uses it | "the advance measure of the glyph `0` (zero, the Unicode character U+0030) in the element's font." | https://developer.mozilla.org/en-US/docs/Web/CSS/length | 2026-10-10 | 1 | C |
| 17 | Layout metrics of the before and after test pages | Derived: `node kb/tests/design-layout/measure-layout.mjs` | `kb/tests/design-layout/measure-layout.mjs` | 2026-10-10 | derived | measured |

Reused from earlier layout research (not re-fetched here): NN/g cards versus lists (research 05 #3), NN/g scrolling and attention and the false floor (05 #8, 03 #5), WCAG 1.3.2 meaningful sequence and 1.4.10 reflow (04), MDN subgrid (01), Josh Comeau full-bleed grid (01).

## Likely to change
- Android canonical layout guidance moves with Material 3 Adaptive releases; recheck the 70/30 split yearly.
- Google's mobile-first indexing page is stable but owned by Search; recheck when the layout skill is reviewed.
