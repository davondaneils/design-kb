# Composition, social and marketing graphics

Sources: research/graphic/05-composition-social.md (S-numbers). Platform specs are volatile; each carries its source. Opinion is marked (opinion).

## Principles
1. **One focal point.** Every graphic has one thing seen first. If two things compete, the graphic says nothing. (opinion, foundational composition practice)
2. **Design for the size it is seen at,** not the canvas size. A 1080 px post is seen at about 360 to 430 px wide on a phone.
3. **Hierarchy through contrast of scale, weight and color,** organized by Gestalt grouping: proximity, similarity, figure and ground [S7].
4. **The image must carry information** or a single idea; decorative filler is ignored [S8].

## Fundamentals gate
- One focal point; at most **3 levels** of hierarchy (headline, support, sign-off or logo). (opinion)
- Text legible at the real viewing size (see thumbnail math); text contrast 4.5:1, or 3:1 for large text.
- Everything aligned to a grid with consistent margins; no element within the platform's crop or UI overlay zones.
- Correct dimensions and aspect ratio for the placement (tables below).
- `og:image:alt` set for link images [S3]; social posts get alt text where the platform allows.
- Logo at the approved minimum size and clear space (see 01), small and in a consistent corner.

## Thumbnail math (use every time)
On-screen scale = display width / canvas width. A 1080 px canvas shown at about 390 px wide displays at about 0.36.
Canvas text size = desired on-screen size / scale.
| Desired on-screen | On a 1080 canvas | On a 1200 OG canvas shown at about 500 px |
|---|---|---|
| 14 px (minimum readable, `--text-sm`) | 39 to 42 px | about 34 px |
| 16 px (body, `--text-base`) | 44 to 48 px | about 39 px |
| 25 px (headline, `--text-xl`) | about 70 px | about 60 px |
| 39 px (display, `--text-3xl`) | about 108 px | about 94 px |
Derived arithmetic; on-screen targets come from the foundation type scale. Default floor: nothing below 40 px on a 1080 canvas. Word budget for a static post: 12 words or fewer in the main message (opinion).

## Placement specs
| Placement | Canvas | Ratio | Safe area and notes | Source |
|---|---|---|---|---|
| Open Graph link (Facebook, LinkedIn, Slack, iMessage and most others) | 1200 x 630 | about 1.91:1 | Min 600x315 for large previews; 8 MB max; set og:image:width, height, alt | [S1][S3] |
| X large image card | same 1200 x 630 works; crops to 2:1 (1200 x 600) | 2:1 | 5 MB; no SVG [S2]. Keep text at least 60 px in from every edge (opinion, derived from the crop) | [S2] |
| YouTube thumbnail | 3840 x 2160 recommended (1280 x 720 still fine) | 16:9 | Min width 640; 2 MB limit on mobile upload, 50 MB desktop; JPG or PNG; avoid the bottom right where the duration badge sits (opinion) | [S9] |
| Instagram feed | 1080 x 1350 | 4:5 | Profile grid crops to 3:4: keep key content in the centered 1012 x 1350 band | [S5] (secondary, early 2025 change) |
| Instagram carousel | 1080 x 1350 per slide | 4:5 | Same ratio for all slides; continuity across slide edges allowed | [S5] |
| Stories and Reels | 1080 x 1920 | 9:16 | Keep text and logos in the center 70%; avoid top and bottom bands where UI overlays | [S5] |
Platform specs change; recheck every 3 months (fast moving per librarian rules).

## Composition decision rules
- **Choose the focal point first:** a product, a face, a number, or a headline. Make it at least 3x the area of anything else. (opinion)
- **Contrast of scale:** headline to supporting text ratio at least 2:1 in size; if everything is big, nothing is. (opinion)
- **Margins:** at least 5 percent of the short side on all edges (54 px on 1080 wide), larger for X crops. (opinion)
- **Grid:** use a 12 column grid or a simple 4 column grid with margins on the 4 px scale; align text left by default; center only for a single short line. (opinion; see design-layout)
- **Faces and eyes:** a face looking toward the headline leads the eye to it. (opinion, common art direction practice)
- **Color:** one dominant color, one accent, neutrals; brand colors from design-color tokens.
- **OG images as a system:** template with fixed logo position, title area and one variable visual; generate per page with real titles. Google advises against generic logo-only images as the preferred page image [S4].
- **Carousels:** slide 1 is the hook and must work alone in the feed; last slide carries the call to action; keep a persistent element (progress, edge, color band) so slides read as one. (opinion; see copywriting for the hook)

## Expert moves
- **Squint test at 25 percent zoom** on a phone mockup in the actual feed, between real posts, not on a blank artboard. (opinion)
- **Design the series, not the post:** a template with fixed grid, type sizes and logo slot, plus 2 or 3 layout variants, keeps a feed recognizable without repeating. (opinion)
- **Treat the OG image as the most viewed graphic you make:** it appears every time a link is shared; give it the product or a crisp claim, not the logo alone [S4].
- **Grade every photo in a series identically** (see 03) and use one type system (see design-typography).
- **Reserve contrast for the message:** keep the background quieter than the headline in value; check by converting to grayscale. (opinion)

## Do and don't
| Do | Don't |
|---|---|
| One idea, 12 words or fewer | Paragraphs on a static post |
| 48 px plus text on 1080 canvas | 24 px fine print that reads as 9 px |
| Logo small, same corner every time | Logo as the focal point |
| Template per series | Fresh layout every post |
| Check crops in X and Instagram grid | Trust the canvas preview |

## Worked example: product launch set
1. OG image 1200x630: left 60 percent headline "Forecasts your board will trust" at about 64 px, product UI crop on right, logo 32 px tall bottom left, 60 px margins; og:image:alt "Product dashboard showing a quarterly cash forecast."
2. X post: same artwork, verified in the 1200x600 crop.
3. Instagram carousel 1080x1350: slide 1 hook headline at 96 px with product visual; slides 2 to 5 one point each at 64 px headline and 44 px support; final slide call to action; persistent progress dots at the bottom inside the safe band.

## Hand-offs
- design-layout: grids and spacing.
- design-typography: type choice and scale.
- design-copy and copywriting: hooks, headlines, word budget.
- sales-funnels: ad variants and testing.
- design-search: og tags and preferred images.

## Sources
- [S1] Meta for Developers, Images in Link Shares: https://developers.facebook.com/docs/sharing/webmasters/images
- [S2] X, Summary Card with Large Image: https://dev.twitter.com/cards/types/summary-large-image.html
- [S3] The Open Graph protocol: https://ogp.me/
- [S4] Google Search Central, image SEO: https://developers.google.com/search/docs/appearance/google-images
- [S5] Oktopost, Instagram grid size guide (updated Sept 2026): https://www.oktopost.com/blog/instagram-grid-size-guide/
- [S7] Logo Geek, Gestalt and optical corrections: https://logogeek.uk/?p=2617
- [S8] NN/g, Photos as Web Content: https://www.nngroup.com/articles/photos-as-web-content/
- [S9] YouTube Help, video thumbnails: https://support.google.com/youtube/answer/72431
