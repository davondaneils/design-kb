# Research 05: Requesting real photography

Researcher, 2026-10-09. Brief: `kb/briefs/art-direction/05-requesting-photography.md`.

## Key findings
1. **Scale factors.** Apple HIG: "A 2:1 density (called @2x) has a scale factor of 2, and a 3:1 density (called @3x) has a scale factor of 3"; iOS ships @2x and @3x. Web equivalent: source pixels = CSS px x device pixel ratio. [R1][R2]
2. **Color profile.** Apple HIG: "Include a color profile with each image." [R3]
3. **Test on devices.** "Always test images on a range of actual devices. An image that looks great at design time may appear pixelated, stretched, or compressed" [R4]
4. **Square product shots**: 2048 x 2048, one consistent ratio across a collection (Shopify). [Ph10][Ph11 in 02]
5. **Reserve the slot**: width and height attributes give the browser the ratio before load. [Ph7 in 02]. `aspect-ratio` "allows you to define the desired width-to-height ratio of an element's box." [R5]
6. **LCP**: "Never lazy-load your LCP image"; set `fetchpriority="high"` on the likely LCP `<img>`; a CSS background image as the LCP element is discovered late. [R6][R7][R8]
7. **Brief fields** (subject, moment, light, lens, negative space, grade, ratios) are already in design-graphic 03 [P9][P10][P11 there]; reuse.

## Derived numbers (computed, method shown)
| Slot | CSS width at its largest | x DPR | Minimum source |
|---|---|---|---|
| Full-bleed hero, desktop | 1536 (2xl) | 2 | 3072 px wide; ask for 3000+ long edge |
| Half-width hero image | 720 | 2 | 1440 wide |
| Phone hero, 4:5 | 390 | 3 | 1170 x 1463 |
| Product card square | 360 | 2 | 720 square; ask 2048 square (platform norm) |
| Portrait thumbnail 1:1 | 96 | 3 | 288 square; ask 1080 square |
Rule: ask for the larger of (3x the largest CSS width on phones, 2x on desktop) and the platform norm.

## Claim table
| ID | Claim | Quote | URL | Date | Tier | Status |
|---|---|---|---|---|---|---|
| R1 | @2x and @3x scale factors | "A 2:1 density (called @2x) has a scale factor of 2, and a 3:1 density (called @3x) has a scale factor of 3." | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/images.json | 2026-10-09 | 1 | consensus |
| R2 | iOS ships @2x and @3x | "iOS: @2x and @3x" (table row) | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/images.json | 2026-10-09 | 1 | consensus |
| R3 | Include a color profile | "Include a color profile with each image." | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/images.json | 2026-10-09 | 1 | consensus |
| R4 | Test on devices | "Always test images on a range of actual devices." | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/images.json | 2026-10-09 | 1 | consensus |
| R5 | aspect-ratio | "allows you to define the desired width-to-height ratio of an element's box." | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio | 2026-10-09 | 1 | consensus |
| R6 | Never lazy-load LCP | "Never lazy-load your LCP image" | https://web.dev/articles/optimize-lcp | 2026-10-09 | 1 | consensus |
| R7 | fetchpriority high | "It's a good idea to set `fetchpriority="high"` on an `<img>` element if you think it's likely to be your page's LCP element." | https://web.dev/articles/optimize-lcp | 2026-10-09 | 1 | consensus |
| R8 | CSS background LCP discovered late | "The LCP element requires a CSS background image." (listed as a cause of resource load delay) | https://web.dev/articles/optimize-lcp | 2026-10-09 | 1 | consensus |
