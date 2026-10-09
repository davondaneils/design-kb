# Brief 05: Images, video and fonts

## Question it answers
How do I ship media and web fonts that look exactly as designed without hurting LCP or CLS?

## After reading, Claude must be able to decide
- Format (AVIF, WebP, JPEG, SVG, video) per asset.
- srcset and sizes values that are correct, not guessed.
- Loading and priority per image position.
- Font loading strategy: hosting, subsetting, font-display, fallback metric overrides, variable fonts.

## Must cover
srcset w/x, sizes maths, sizes="auto", picture for art direction and formats, width/height and aspect-ratio, lazy loading rules, decoding, fetchpriority, GIF to video, SVG icon sprites, font-display trade-offs, size-adjust and overrides, preconnect/preload, unicode-range.

## Test briefs it should pass
- Hero plus 12-image product grid for an e-commerce category page.
- Brand with a custom display face and a variable body face.
