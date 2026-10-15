# 02 Photography: picking, cropping, treating

Research notes: `kb/research/art-direction/02-photography.md` (Ph-numbers). Builds on design-graphic `references/03-photography-direction.md` (shot brief fields, stock clichés, AI imagery rules), which this chapter does not repeat. Opinion is marked (opinion).

## Floor: fundamentals (non-negotiable)
1. **Job test.** Keep a photo only if it proves something: the product, the place, the people, the result. Users "ignore stock photos of generic people" and decoration [Ph1]. [judged]
2. **Photos earn attention only when they help the task.** On the FreshBooks staff page, real portraits drew 10 percent more viewing time than bios that took 316 percent more space [Ph2]; on an Amazon category page, TV photos that did not help comparison drew 18 percent of viewing time against 82 percent for text [Ph3]. Never move meaning from copy into a photo; choose photos that help the reader decide. [judged]
3. **Alt per the W3C decision tree** (design-graphic 03): informative gets a short meaning in context, decorative gets `alt=""`. [lint for presence, judged for quality]
4. **Reserve the box**: `width` and `height` on every `img`, or an `aspect-ratio` on its slot, so nothing shifts when it loads [Ph7]. [judged]
5. **Resolution**: source at least 2x the largest CSS width the slot reaches (exact numbers in 05). [judged]
6. **Focal point survives every crop.** No face cut at the eyes or chin, no product cut through its label, at 390 and 1440. [judged on renders]
7. **No fabricated customers.** Stock or AI people are never presented as real customers, staff or testimonials (design-graphic 03). [judged]

## Standards
- MDN: different crops per layout is "the art direction problem", solved with `<picture>` and `<source media>` [Ph4][Ph5].
- `object-position` aligns a cover-cropped image inside its box; default `50% 50%` [Ph6].
- WCAG 1.1.1, 1.4.3 (text over photos, see 03), 1.4.5.

## Decision rules
### Accept or reject
| Question | If no |
|---|---|
| Does it show something specific to this brand (its product, place, people, result)? | Reject |
| Could a competitor use it unchanged? | If yes, reject (opinion) |
| Does it pass the concept's reject test (01)? | Reject or re-crop until it does |
| Is the subject doing something (a verb), not posing? | Prefer another frame (design-graphic 03) |
| Is it sharp at 2x the slot width? | Ask for a bigger file (05) |

### Crop
- **Crop per breakpoint, not one cover crop.** Desktop hero 16:9 or 3:2, phone 4:5, card 1:1 or 4:3. Use `<picture>` sources when the crop changes the subject's scale; use `object-position` when only the window moves [Ph4][Ph6].
- **Set `object-position` from the focal point**, not the default center. A face at 70 percent across and 35 percent down gets `object-position: 70% 35%`.
- **Crop to the verb.** Keep the hands and the object being worked on; cut empty room. (opinion)
- **Crop tighter than feels safe on phones.** MDN's own example: on mobile, "zooms in on the person" [Ph5]. A 390px-wide hero cannot show a room.
- **Keep one wide establishing frame per set** so tight crops still read as a real place. (opinion)

### Treat
| Situation | Treatment |
|---|---|
| One shoot, one light | Light grade only: white balance, contrast, one LUT |
| Mixed sources (phones, old shoots, stock) | Monochrome or duotone unifies fastest [Ph8]; Spotify's identity used duotone for this effect (research 01, C7) |
| Food, fashion, product color matters | Never duotone the product; grade the environment only (opinion) |
| Photo behind text | See 03: planned negative space or a solid panel first |
| Photo in dark theme | Same file; lower the surrounding surface, not the photo. Only if a photo is mostly white, add a 1px `--color-border` frame so it does not glow (opinion) |

### State the treatment in the visual plan
When photos are in the set, the plan's treatment line names **one grade, one light direction and one background tone per section** (Apple: one lighting setup and one background tone per section; Mercury: one warm desaturated grade across 16 photos; `kb/teardowns/motion-imagery.md` section 3). Photos share the stage radius and the figure caption with every other visual (06 section 5).

### Sequence a set
- Alternate scale: wide, close, detail. Never two close-ups of faces side by side looking away from each other. (opinion)
- Faces and gaze point into the page, toward the copy they support (gaze cueing, see 03).
- Same subject-to-frame scale for anything shown in a grid (product shots, team portraits): same eye line height, same margin above heads.

## Numbers
| Item | Value |
|---|---|
| `object-position` default | 50% 50% [Ph6] |
| Product grid | one ratio for the whole collection [Ph11]; square 2048 x 2048 source [Ph10] |
| Team grid | 1:1 or 4:5, eyes on the same line, about 1/3 down the frame (opinion) |
| Hero crops | 16:9 or 3:2 desktop, 4:5 phone (design-graphic 03) |
| Duotone | shadow from the darkest neutral (950 to 990), highlight from the lightest (50); accent color only in highlights if at all (opinion) |

## Recipes
- **Focal point**: `img { width: 100%; height: 100%; object-fit: cover; object-position: var(--focus, 50% 50%); }`, set `style="--focus: 70% 35%"` per image.
- **Art-directed crop**: `<picture><source media="(min-width: 768px)" srcset="hero-16x9.avif"><img src="hero-4x5.avif" width="1170" height="1463" alt="..."></picture>` (delivery details: design-frontend 05).
- **Duotone, file untouched**: SVG `feColorMatrix` built by `assets/duotone_matrix.py SHADOW HIGHLIGHT`, applied with `filter: url(#duotone)`. Prints exact brand colors in sRGB.
- **Monochrome plus brand tint in CSS**: `filter: grayscale(1) contrast(1.05)` on the image, with a brand-color layer set to `mix-blend-mode: multiply` or `color` above it [Ph9]. Test in Blink and WebKit: blend modes render slightly differently (research 04, V9).

## Ceiling: signature moves
1. **The crop is the art direction.** Two studios with the same photo differ mostly in the crop. Decide crops before color. (opinion)
2. **Comparison grids are information.** Product photos on one axis, one background, one scale get studied; lifestyle thumbnails get skipped (design-graphic 03, P1). Treat the grid like a chart.
3. **Grade toward the brand in shadows, protect skin and product.** (design-graphic 03; restated here only as the rule for mixed sets)
4. **Unify with treatment, then break it once.** A duotone set with one full-color hero image makes that one image the focal point of the site. (opinion)
5. **Tie the photo to the concept motif.** Stripe chose a street crossing that draws its own logo shape (research 01, C4). Hunt for that frame in the user's photos before reaching for a filter.

## Do and don't
| Do | Don't |
|---|---|
| `object-position` set from the focal point | Default center crop that cuts the face on phones |
| One ratio across a product grid | Mixed ratios with letterboxing |
| Duotone to unify phone snapshots | Five different filters from five sources |
| Product in true color | Duotoned food |
| A wide frame plus tight details | Every shot at the same middle distance |

## Worked example: Ember and Oak receives six photos later
Photos: two phone shots of the roaster, one of green beans in a sack, one of a cupping table, a farm photo from the importer, a staff portrait.
1. Jobs: roaster (proves the 1962 Probat), beans (material), cupping (process), farm (place), portrait (people). The sixth, a latte art shot, fails the reject test (shows neither hill nor fire) and is cut.
2. Crops: roaster 3:2 desktop with `object-position: 40% 55%` on the drum door, 4:5 phone tight on the door and flame window; beans 1:1 detail; farm 16:9 wide establishing frame.
3. Treatment: mixed sources, so warm monochrome (shadow warm 990, highlight warm 50) for people and places; the beans stay in true color because the material is the product. The roast curve stays the one orange element.
4. Sequence: farm (wide) then beans (detail) then roaster (medium), matching the hill-to-fire story.

## Hand-offs
- design-graphic 03: shot briefs, stock selection, AI imagery and provenance.
- design-frontend 05: srcset, formats, LCP.
- 03 (this skill): text over photos. 05: requesting the files.


## Sources
Claim IDs refer to the research notes in `kb/research/art-direction/` (quotes, tiers, access date 2026-10-09).
- [C4] https://stripe.com
- [C7] https://www.designweek.co.uk/spotify-undergoes-colourful-brand-refresh/
- [Ph1] https://www.nngroup.com/articles/photos-as-web-content/
- [Ph2] https://www.nngroup.com/articles/photos-as-web-content/
- [Ph3] https://www.nngroup.com/articles/photos-as-web-content/
- [Ph4] https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
- [Ph5] https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
- [Ph6] https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/object-position
- [Ph7] https://web.dev/articles/optimize-cls
- [Ph8] https://jmperezperez.com/duotone-using-fecolormatrix/
- [Ph9] https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/mix-blend-mode
- [Ph10] https://help.shopify.com/en/manual/products/product-media/product-media-types
- [Ph11] https://help.shopify.com/en/manual/products/product-media/product-media-types
- [V9] https://css-tricks.com/grainy-gradients/
