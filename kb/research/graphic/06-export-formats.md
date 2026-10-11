# Research 06: File formats and export

Status key: **C** consensus, **X** contested, **O** opinion, **V** volatile.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Use SVG for icons, logos, diagrams and anything that must render accurately at many sizes; prefer AVIF or WebP for raster; JPEG is the photo fallback; PNG for lossless screenshots, line art and transparency when vectors are unavailable. | MDN, Image file type and format guide [E1] | C |
| 2 | Provide fallbacks with picture and source elements in order of preference; 2 or 3 sources are enough; img is the last resort. | MDN [E1] | C |
| 3 | AVIF generally compresses better than WebP (median savings about 50% vs about 30% against JPEG per the comparison MDN cites); AVIF lacks progressive rendering. JPEG XL support is arriving with fallbacks still needed. | MDN [E1] | C, V |
| 4 | Google Images supports BMP, GIF, JPEG, PNG, WebP, SVG and AVIF; CSS background images are not indexed; use descriptive file names and alt text; provide responsive images with an img fallback; for inline SVG use a title element. | Google Search Central [E2] | C |
| 5 | srcset with w descriptors plus sizes lets the browser choose; a 400 px wide slot on a 2x screen needs an 800 px source. | web.dev Learn Images, descriptive syntaxes [E3] | C |
| 6 | Never lazy-load the LCP image; give it fetchpriority="high" (on one or two images at most); target LCP at or under 2.5 s for 75% of visits. | web.dev Optimize LCP [E4] | C |
| 7 | Favicon set: favicon.ico 32x32 at /favicon.ico; icon.svg with dark mode media query; apple-touch-icon.png 180x180; 192 and 512 PNGs plus a maskable 512 (logo within 409x409) in the web manifest; ICO link uses sizes="32x32" to avoid a Chrome bug. | Evil Martians [E5] | C |
| 8 | Apple: export layers as SVG with text outlined; PNG only for what SVG cannot hold; no baked mask; full canvas. Android: 108dp layers, 66dp safe zone, monochrome layer. | WWDC25 361 notes [E6]; Android Developers [E7] | C |
| 9 | Print files: 300 ppi at final size for raster images, CMYK, bleed (commonly 0.125 in / 3 mm), and press-ready PDF are standard printer requirements. | Sir Speedy and PIP prepare-for-print guides [E8][E9]; Lund University media requirements [E10] | C |
| 10 | Inline SVG accessibility: meaningful SVG gets role="img" and an accessible name (title referenced by aria-labelledby, or aria-label); decorative SVG gets aria-hidden="true". | Orange accessibility guidelines [E11]; WWU accessibility guide [E12] | C |
| 11 | Icon SVG hygiene: viewBox 0 0 24 24, no transforms or filters, minify to 2 decimal places with SVGO/SVGOMG. | Lucide [E13] | C |

## Numbers
- Favicon: 32, 180, 192, 512 (maskable safe zone 409).
- og:image 1200x630; X 2:1 (research 05).
- Print: 300 ppi, 3 mm / 0.125 in bleed.
- LCP 2.5 s at p75.

## Conflicting views
- PDF/X-4 (keeps transparency, ICC based) vs PDF/X-1a (flattened CMYK): many modern printers prefer X-4; some still request X-1a. Ask the printer. (X)
- Rich black recipes vary by printer (a common one is C60 M40 Y40 K100 for large areas); small text should be 100K only to avoid registration blur. Total ink limits of about 300% are common on coated stock. (C on principle, X on exact recipe; confirm with printer)
- Lossy quality settings: no universal number; judge by eye at 1x and 2x. (O)

## Sources
- [E1] https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
- [E2] https://developers.google.com/search/docs/appearance/google-images
- [E3] https://web.dev/learn/images/descriptive
- [E4] https://web.dev/articles/optimize-lcp
- [E5] https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
- [E6] https://wwdcnotes.com/documentation/wwdc25-361-create-icons-with-icon-composer/
- [E7] https://developer.android.com/develop/ui/views/launch/icon_design_adaptive
- [E8] https://www.sirspeedy.com/getmedia/b6bab320-66f1-43ee-afe3-b34c998fa872/PrepareDocumentForPrinting_SS_1.pdf
- [E9] https://www.pip.com/FSIPMG.PIP/media/add/PrepareDocumentForPrinting_PIP_2026.pdf
- [E10] https://www.mediatryck.lu.se/en/material-requirements
- [E11] https://a11y-guidelines.orange.com/en/articles/accessible-svg/
- [E12] https://marcom.wwu.edu/accessibility/guide/name-svgs-proper-semantics
- [E13] https://lucide.dev/guide/design/icon-design-guide
