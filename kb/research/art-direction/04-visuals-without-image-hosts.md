# Research 04: Visuals without image hosts

Researcher, 2026-10-09. Brief: `kb/briefs/art-direction/04-visuals-without-image-hosts.md`.

## Key findings
1. **Inline SVG as one image for assistive tech.** MDN: "it is a good idea to set `role="img"` on the outer `<svg>` element and give it a label"; "use `aria-labelledby` if a visible label is present, otherwise use `aria-label`". For purely presentational images, "consider using the `presentation` role". [V1][V2][V3]
2. **Decorative = null alt.** W3C: decorative images "don't add information to the content of a page", including images used "only to add ambiance or visual interest"; give them `alt=""` so assistive tech ignores them. For inline SVG the equivalent is `aria-hidden="true"`. [V4][V5]
3. **Procedural texture is built into SVG.** `<feTurbulence>` "creates an image using the Perlin turbulence function. It allows the synthesis of artificial textures like clouds or marble." `baseFrequency` takes one value for both axes or two for x and y. [V6][V7]
4. **Grainy gradients** (Chion, CSS-Tricks): "use an SVG filter to create the noise, then apply that noise as a background", layered under a gradient with boosted contrast and brightness; Blink and WebKit "implement `mix-blend-mode` slightly differently". [V8][V9]
5. **Repeating patterns**: SVG `<pattern>` "defines a graphics object which can be redrawn at repeated x- and y-coordinate intervals ("tiled") to cover an area." [V10]
6. **Generative line work**: Tyler Hobbs (shipped generative work in museum collections, Fidenza at Toledo Museum of Art): a flow field is a grid where "At each point in the grid, you store an angle"; resolution "around 0.5% of the image width"; stop curves that come too close to "avoid collisions". [V11][V12]
7. **Data-driven graphics**: Tufte's sparklines are "data-intense, design-simple, word-sized graphics." A graphic made of real data is information, which NN/g shows users look at, unlike decoration. [V13][C10 in 01]
8. **Exemplars draw product in code.** Stripe's homepage contains a billing mockup with real-looking values ("Tokens $0.01 per 1,000 units", "Usage meter"); Linear's imagery is product UI. [V14][C5 in 01]
9. **Vector for scalable art**: Apple HIG recommends "PDF or SVG files" for flat artwork that needs high-resolution scaling, and in visionOS "Prefer vector-based art for 2D images." [V15]

## Numbers
- SVG text must render at 12px or more (lint rule in `tools/lint.mjs`).
- Flow field grid resolution about 0.5% of image width (Hobbs, practitioner).
- Grain: feTurbulence `baseFrequency` 0.6 to 0.9 with `numOctaves` 3 to 4 gives fine film-like grain at 1x (measured on our renders, opinion on taste).

## Conflicting views
- CSS-only illustration (drawing objects with divs and gradients) is popular as a craft demo, but is brittle and hard to keep accessible. SVG is the better default for anything with curves. (opinion)
- Generative art can read as "tech demo" when it is not tied to meaning. Tie it to data. (opinion)

## Claim table
| ID | Claim | Quote | URL | Date | Tier | Status |
|---|---|---|---|---|---|---|
| V1 | role="img" on SVG | "it is a good idea to set `role="img"` on the outer `<svg>` element and give it a label." | https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/img_role | 2026-10-09 | 1 | consensus |
| V2 | Naming with aria-labelledby or aria-label | "use `aria-labelledby` if a visible label is present, otherwise use `aria-label`." | https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/img_role | 2026-10-09 | 1 | consensus |
| V3 | Presentation role for decoration | "If an image is purely presentational, consider using the `presentation` role." | https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/img_role | 2026-10-09 | 1 | consensus |
| V4 | Decorative definition | "Decorative images don't add information to the content of a page." | https://www.w3.org/WAI/tutorials/images/decorative/ | 2026-10-09 | 1 | consensus |
| V5 | Ambiance images decorative | "This image is used only to add ambiance or visual interest to the page." | https://www.w3.org/WAI/tutorials/images/decorative/ | 2026-10-09 | 1 | consensus |
| V6 | feTurbulence | "creates an image using the Perlin turbulence function. It allows the synthesis of artificial textures like clouds or marble." | https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence | 2026-10-09 | 1 | consensus |
| V7 | baseFrequency two values | "If two numbers are provided, the first one represents the base frequency in the horizontal direction" | https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/baseFrequency | 2026-10-09 | 1 | consensus |
| V8 | Grain from SVG noise | "The trick is to use an SVG filter to create the noise, then apply that noise as a background." | https://css-tricks.com/grainy-gradients/ | 2026-10-09 | 4 | opinion with shipped demos |
| V9 | Blend modes differ by engine | "implement `mix-blend-mode` slightly differently, so please be sure to test across browsers." | https://css-tricks.com/grainy-gradients/ | 2026-10-09 | 4 | opinion |
| V10 | SVG pattern tiles | "defines a graphics object which can be redrawn at repeated x- and y-coordinate intervals ("tiled") to cover an area." | https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/pattern | 2026-10-09 | 1 | consensus |
| V11 | Flow field definition | "At each point in the grid, you store an angle." | https://www.tylerxhobbs.com/words/flow-fields | 2026-10-09 | 4 | opinion, shipped work |
| V12 | Flow field resolution | "I usually use around 0.5% of the image width for my resolution." | https://www.tylerxhobbs.com/words/flow-fields | 2026-10-09 | 4 | opinion |
| V13 | Sparklines | "data-intense, design-simple, word-sized graphics." | https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/ | 2026-10-09 | 3 | consensus |
| V14 | Stripe builds product mockups with real values | "Tokens $0.01 per 1,000 units" (WebFetch description of homepage markup) | https://stripe.com | 2026-10-09 | 2 | observed |
| V15 | Vector for scalable flat art | "Flat icons, interface icons, and other flat artwork that requires high-resolution scaling: PDF or SVG files" | https://developer.apple.com/tutorials/data/design/human-interface-guidelines/images.json | 2026-10-09 | 1 | consensus |

## Scripts
`skills/design-art-direction/assets/contours.mjs`: seeded contour-map generator (value noise plus marching squares) that prints inline SVG paths. Deterministic per seed. Run and checked by the specialist.
