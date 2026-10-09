# File formats and export

Sources: research/graphic/06-export-formats.md (E-numbers). Opinion is marked (opinion).

## Principles
1. **Vector for anything drawn, raster for anything photographed** [E1].
2. **Export for the slot:** the right pixel size for the largest rendered size times device pixel ratio, no bigger [E3].
3. **A kit is a matrix:** every lockup in every color version in every format a client will need, named predictably. (opinion)
4. **Accessible by default:** every exported graphic has a text alternative plan [E2][E11].

## Fundamentals gate
- Logos and icons ship as **SVG**; never as JPEG [E1].
- Photos ship as **AVIF or WebP with JPEG fallback** via `<picture>` (2 or 3 sources) [E1].
- Raster exports in **sRGB** with the profile embedded. (opinion, standard web practice)
- Each image slot has a source at least **2x its CSS width** [E3].
- `<img>` has `width`, `height` and `alt`; the LCP image is never lazy-loaded and gets `fetchpriority="high"` [E4].
- Print files: **300 ppi** at final size, **CMYK** to the printer's profile, **3 mm / 0.125 in bleed**, fonts embedded or outlined, press PDF [E8][E9][E10].
- Inline SVG: meaningful = `role="img"` plus accessible name; decorative = `aria-hidden="true"` [E11][E12].

## Format chooser
| Content | Web | Print | Notes |
|---|---|---|---|
| Logo, icon, diagram | SVG | PDF (vector) | PNG fallback only for places that refuse SVG (email, some social, X cards) [E1][S2] |
| Photo | AVIF, WebP, JPEG fallback | TIFF or high quality JPEG, CMYK | [E1] |
| Screenshot, UI, flat art with text | PNG or lossless WebP | PDF or TIFF | Lossy blurs text edges [E1] |
| Transparency in raster | PNG, WebP, AVIF | PDF or TIFF with alpha | JPEG has no alpha [E1] |
| Animation | Video (MP4/WebM) or animated AVIF/WebP; avoid GIF | n/a | [E1] |
| Email | PNG or JPEG at 2x, width set in HTML | n/a | Many email clients do not render SVG (opinion, widely observed) |

## Logo kit matrix
Lockups: primary horizontal, stacked, symbol, wordmark. Colors: full color, one color dark, one color light (reversed artwork, see 01).
| Format | Use | Spec |
|---|---|---|
| SVG | Web, apps, UI | Text outlined, no editor metadata, viewBox set, colors as fills (or currentColor for one color versions) |
| PDF (vector) | Print, signage, partners | CMYK and spot (Pantone) versions; RGB version for screens |
| PNG | Office docs, email, social, places without SVG | Transparent, at 500, 1000 and 2000 px wide (opinion) |
| Favicon set | Browser, home screen | See below [E5] |
| App icon masters | iOS, Android | See 02 [E6][E7] |
Naming (opinion): `brand-logo-{lockup}-{color}-{colorspace}.{ext}`, for example `northbound-logo-horizontal-fullcolor-rgb.svg`, `northbound-logo-symbol-white-cmyk.pdf`.
Include a one page PDF spec: colors (HEX, RGB, CMYK, Pantone), clear space, minimum sizes, misuse.

## Favicon and web manifest set [E5]
```html
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"><!-- 180x180 -->
<link rel="manifest" href="/manifest.webmanifest">
```
Manifest icons: 192 PNG, 512 PNG, 512 maskable PNG with the logo inside the central 409x409. The SVG can switch colors with `@media (prefers-color-scheme: dark)` inside a `<style>` block. Use the Tier 4 small mark (see 01). apple-touch-icon: about 20 px padding and an opaque background.

## Responsive image essentials [E3][E4]
```html
<img src="hero-1600.jpg"
     srcset="hero-800.avif 800w, hero-1600.avif 1600w, hero-2400.avif 2400w"
     sizes="(min-width: 1024px) 50vw, 100vw"
     width="1600" height="900" alt="..." fetchpriority="high">
```
Use `<picture>` with `type` sources when you need format fallbacks or art-directed crops. Breakpoints in `sizes` follow the foundation breakpoints (640, 768, 1024, 1280, 1536). Hand delivery details to design-frontend.

## SVG hygiene
- Outline text; flatten transforms; remove hidden layers, editor metadata and empty groups; run SVGO or SVGOMG [E13].
- Keep `viewBox`; let CSS set size.
- Icons: `viewBox="0 0 24 24"`, stroke and fill via `currentColor`, coordinates at 2 decimals [E13].
- Logos: keep enough precision that curves do not visibly change at 2000 px (opinion: 2 to 3 decimals; check visually).
- Accessible inline SVG:
```html
<svg role="img" aria-labelledby="logo-title" viewBox="0 0 120 32"><title id="logo-title">Northbound Coffee</title>...</svg>
```

## Print specifics
- 300 ppi at final printed size for raster; large format viewed from distance can go lower (ask the printer) [E8].
- Bleed 3 mm (0.125 in) on every edge that touches the trim; keep text 3 to 5 mm inside trim (safe zone) [E8][E9].
- Ask the printer for profile and PDF standard; PDF/X-4 is the modern default, some require PDF/X-1a [E8].
- Black: small text in 100K only; large solid areas in a rich black the printer specifies (a common recipe is C60 M40 Y40 K100); respect the total ink limit (often about 300%) [E8].
- Spot colors: define Pantone in the kit; check CMYK builds on a proof before a large run.

## Expert moves
- **Export the reversed logo from its own artwork,** never by recoloring the positive (see 01).
- **Ship one color logo SVGs with `fill="currentColor"`** so developers recolor via tokens without new files. (opinion)
- **Bake dark mode into the favicon SVG** with a prefers-color-scheme style block [E5].
- **Test every export where it lands:** share the link in Slack, X and iMessage; open the PDF in Acrobat Output Preview for separations; open the SVG in a browser at 400 percent. (opinion)
- **Never upscale.** If a source is too small for the slot, change the slot or get a new source. (opinion)

## Hand-offs
- design-frontend: delivery, CDNs, lazy loading, picture markup.
- design-search: image SEO, og tags.
- design-color: CMYK and Pantone conversions of brand colors.

## Sources
- [E1] MDN, image file type and format guide: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
- [E2] Google Search Central, image SEO: https://developers.google.com/search/docs/appearance/google-images
- [E3] web.dev, descriptive image syntaxes: https://web.dev/learn/images/descriptive
- [E4] web.dev, Optimize LCP: https://web.dev/articles/optimize-lcp
- [E5] Evil Martians, How to Favicon: https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
- [E6] WWDC25 session 361 notes: https://wwdcnotes.com/documentation/wwdc25-361-create-icons-with-icon-composer/
- [E7] Android adaptive icons: https://developer.android.com/develop/ui/views/launch/icon_design_adaptive
- [E8] Sir Speedy, preparing documents for print: https://www.sirspeedy.com/getmedia/b6bab320-66f1-43ee-afe3-b34c998fa872/PrepareDocumentForPrinting_SS_1.pdf
- [E9] PIP, preparing documents for print (2026): https://www.pip.com/FSIPMG.PIP/media/add/PrepareDocumentForPrinting_PIP_2026.pdf
- [E10] Lund University, print material requirements: https://www.mediatryck.lu.se/en/material-requirements
- [E11] Orange, accessible SVG: https://a11y-guidelines.orange.com/en/articles/accessible-svg/
- [E12] WWU, name SVGs with proper semantics: https://brand.wwu.edu/accessibility/guide/name-svgs-proper-semantics
- [E13] Lucide guide (SVG rules): https://lucide.dev/guide/design/icon-design-guide
- [S2] X card image rules: https://dev.twitter.com/cards/types/summary-large-image.html
