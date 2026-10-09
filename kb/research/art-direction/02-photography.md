# Research 02: Photography: picking, cropping, treating

Researcher, 2026-10-09. Brief: `kb/briefs/art-direction/02-photography.md`. Builds on `kb/research/graphic/03-photography-direction.md` (P-numbers there); does not repeat it.

## Key findings
1. **Generic people photos are ignored; real ones are looked at; task-irrelevant ones are skipped.** NN/g: "users ignore stock photos of generic people". On the FreshBooks staff page, "the user spent 10% more time viewing the portrait photos than reading the biographies, even though the bios consumed 316% more space". On an Amazon category page where TV photos did not help users compare products, "only 18% of the viewing time was spent on the photos, while 82% was spent on the text." Photos earn attention when they help the task. [Ph1][Ph2][Ph3] (Corrected in critic round 1: an earlier version wrongly attached the 18 percent figure to the staff page.)
2. **Cropping per layout is "the art direction problem".** MDN: serving different crops per layout "is commonly known as the art direction problem"; on narrow screens, "show a smaller, portrait image on mobile, which zooms in on the person." Solved with `<picture>` and `<source media>`. [Ph4][Ph5]
3. **`object-position` sets the focal point of a cover crop**, default `50% 50%` (center). A single CSS crop with the default cuts off-center subjects. [Ph6]
4. **Reserve the box.** web.dev: "Always include width and height size attributes on your images and video elements"; browsers derive a default aspect ratio from them. [Ph7]
5. **Duotone unifies.** Collins applied duotone to Spotify photography for a distinctive look [C7 in 01]. A duotone can be built in SVG with `feColorMatrix` (values can be hard coded when the two colors are known). [Ph8]
6. **Blend modes give CSS treatments without editing files**: `mix-blend-mode` "sets how an element's content should blend with its backdrop" with values including multiply, screen, luminosity, color. [Ph9]
7. **Product imagery consistency.** Shopify: "For square product images, a size of 2048 x 2048 px usually displays best" and featured images "need to use a consistent aspect ratio". [Ph10][Ph11]
8. **Dropbox:** photography is "Best for real-world examples." [Ph12]

## Numbers
- `object-position` default 50% 50% [Ph6].
- Product square 2048 x 2048 [Ph10].
- Source at least 2x display width (design-graphic 03, P1).

## Conflicting views
- Heavy treatments (duotone, monochrome) unify but strip product color, which matters for food and fashion. (opinion) Use them for people and place, not for the product itself.
- Tight crops lose context that proves "real place". (opinion) Keep one wide establishing frame per set.

## Claim table
| ID | Claim | Quote | URL | Date | Tier | Status |
|---|---|---|---|---|---|---|
| Ph1 | Generic stock people ignored | "users ignore stock photos of generic people" | https://www.nngroup.com/articles/photos-as-web-content/ | 2026-10-09 | 3 | consensus |
| Ph2 | Real staff photos get more time than bios 316% larger (FreshBooks staff page) | "the user spent 10% more time viewing the portrait photos than reading the biographies, even though the bios consumed 316% more space" | https://www.nngroup.com/articles/photos-as-web-content/ | 2026-10-09 | 3 | consensus |
| Ph3 | Photos that do not help the task are skipped (Amazon category page, TV photos) | "only 18% of the viewing time was spent on the photos, while 82% was spent on the text." | https://www.nngroup.com/articles/photos-as-web-content/ | 2026-10-09 | 3 | consensus |
| Ph4 | Art direction problem defined | "is commonly known as the **art direction problem**." | https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images | 2026-10-09 | 1 | consensus |
| Ph5 | Portrait crop on mobile | "show a smaller, portrait image on mobile, which zooms in on the person." | https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images | 2026-10-09 | 1 | consensus |
| Ph6 | object-position default | "specifies the alignment of the selected replaced element's contents within the element's box." Default `50% 50%` | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-position | 2026-10-09 | 1 | consensus |
| Ph7 | Width and height on images | "Always include `width` and `height` size attributes on your images and video elements." | https://web.dev/articles/optimize-cls | 2026-10-09 | 1 | consensus |
| Ph8 | Duotone with feColorMatrix | "The filter uses a `feColorMatrix`, and its values are calculated using JS" | https://jmperezperez.com/duotone-using-fecolormatrix/ | 2026-10-09 | 5 | lead, backed by the shipped Spotify identity |
| Ph9 | mix-blend-mode definition | "sets how an element's content should blend with its backdrop" | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mix-blend-mode | 2026-10-09 | 1 | consensus |
| Ph10 | Square product size | "For square product images, a size of 2048 x 2048 px usually displays best." | https://help.shopify.com/en/manual/products/product-media/product-media-types | 2026-10-09 | 1 | consensus (platform doc) |
| Ph11 | Consistent ratio for collections | "need to use a consistent aspect ratio" | https://help.shopify.com/en/manual/products/product-media/product-media-types | 2026-10-09 | 1 | consensus |
| Ph12 | Photography for real-world examples | "Best for real-world examples." | https://brand.dropbox.com/imagery | 2026-10-09 | 4 | consensus |

## Derived: duotone matrix
For a duotone from a shadow color S and highlight color H (sRGB 0 to 1), with luminance weights (0.2126, 0.7152, 0.0722): each output channel c = S_c + (H_c - S_c) x L. Matrix row c is `[(H_c-S_c)*0.2126, (H_c-S_c)*0.7152, (H_c-S_c)*0.0722, 0, S_c]`. Computed, not quoted; script in `skills/design-art-direction/assets/duotone_matrix.py`.
