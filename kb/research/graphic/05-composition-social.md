# Research 05: Composition, social and marketing graphics

Status key: **C** consensus, **X** contested, **O** opinion. **V** volatile (platform specs change; recheck every 3 months).

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Open Graph link image: 1200x630 or larger recommended; 600x315 minimum for large previews; 200x200 absolute floor; about 1.91:1; 8 MB max. | Meta for Developers, Images in Link Shares [S1] | C, V |
| 2 | X summary_large_image card: 2:1; min 300x157; max 4096x4096; under 5 MB; JPG, PNG, WEBP, GIF (first frame only); SVG not supported. | X developer docs, summary large image [S2] | C, V |
| 3 | og:image structured properties include width, height, type and alt; pages with og:image should include og:image:alt, "a description of what is in the image (not a caption)." | ogp.me [S3] | C |
| 4 | Google prefers a relevant high resolution page image and advises against generic logos, images with text, and extreme aspect ratios as the preferred image. | Google Search Central [S4] | C |
| 5 | Instagram switched its profile grid from 1:1 to a 3:4 crop in early 2025; 4:5 at 1080x1350 gives the most control across feed and grid; keep critical content in a centered area of about 1012x1350 to survive the grid crop; Reels and Stories are 9:16 at 1080x1920; keep text out of the top and bottom edges of Reel covers. | Oktopost guide (updated Sept 2026) [S5]; Buffer [S6] | C, V (secondary source; Meta help pages blocked fetching) |
| 6 | Composition principles of grouping (proximity, similarity, closure, continuation, figure and ground) govern how a viewer parses a graphic. | Gestalt principles as summarized by Logo Geek [S7] | C |
| 7 | Decorative filler images are ignored; images with information get attention. | NN/g [S8] | C |

## Numbers and derived math
- Phone feed width: a typical phone renders a full-width feed image at about 360 to 430 CSS px. A 1080 px wide canvas therefore displays at roughly 0.33 to 0.40 scale. Derived rule: canvas text size = target on-screen size / scale. For 14 to 16px on screen, use at least 42 to 48 px on a 1080 canvas; for a headline that reads at a glance (about 24px on screen), use about 72 px. (Derived arithmetic; on-screen targets from the foundation type scale.)
- OG 1200x630 cropped to 2:1 by X becomes 1200x600: keep critical content out of the top and bottom 15 px at minimum; practically keep text inside a centered safe area with at least 60 px margins (5% of width) (O, derived).

## Conflicting views
- Text-heavy social graphics: some practitioners push one bold claim per image; carousel educators run dense slides. Platform context decides. (X)
- Rule of thirds: useful starting point for photo crops, not a law; centered compositions dominate in square and vertical social formats. (O)

## Sources
- [S1] https://developers.facebook.com/docs/sharing/webmasters/images
- [S2] https://dev.twitter.com/cards/types/summary-large-image.html
- [S3] https://ogp.me/
- [S4] https://developers.google.com/search/docs/appearance/google-images
- [S5] https://www.oktopost.com/blog/instagram-grid-size-guide/
- [S6] https://buffer.com/resources/instagram-grid/
- [S7] https://logogeek.uk/?p=2617
- [S8] https://www.nngroup.com/articles/photos-as-web-content/
- [S9] YouTube Help, video thumbnails: 3840x2160 recommended, min width 640, 16:9, 2 MB on mobile and 50 MB on desktop, JPG or PNG. https://support.google.com/youtube/answer/72431 (added during critic review; C, V)
