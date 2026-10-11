# 05 Images, video and fonts

Sources: kb/research/frontend/05-images-fonts.md. Opinion is marked (opinion).

## Principles
1. Media is usually the LCP element and the biggest share of bytes. Get it right and most of performance follows.
2. The browser picks the right file only if you describe the layout truthfully. A wrong `sizes` silently ships images 2 to 4 times too large (opinion; follows from how srcset selection works, MDN).
3. Fonts are a CLS and LCP problem disguised as a brand decision. Match fallback metrics and the swap becomes invisible.

## Format choice
| Asset | Format |
|---|---|
| Photo, gradient-heavy image | AVIF first, WebP fallback, JPEG only if a legacy target needs it, via `<picture><source type>` |
| Logo, icon, illustration with flat shapes | SVG (optimised with SVGO); inline for icons that inherit `currentColor` |
| Screenshot with text | WebP or PNG; test AVIF for text sharpness (opinion) |
| Animation | `<video autoplay muted loop playsinline>` (MP4 H.264, plus WebM or AV1 if you have it). Never animated GIF. |
| Icon set | SVG sprite with `<use href="#id">` or inline SVG components. Never icon fonts. |

## srcset and sizes
- `srcset` with `w` descriptors lists the real pixel widths of the files. `sizes` tells the browser how wide the slot is at each breakpoint. First matching condition wins, last entry is the default (MDN).
- Compute `sizes` from the CSS, not by guessing. Example: grid of 1 column below 640px, 2 columns from 640px, 3 columns from 1024px, container max 1200px, 24px gaps and 16px page gutters:
```html
<img
  src="/p/shoe-640.avif"
  srcset="/p/shoe-320.avif 320w, /p/shoe-480.avif 480w, /p/shoe-640.avif 640w,
          /p/shoe-960.avif 960w, /p/shoe-1280.avif 1280w"
  sizes="(width >= 1280px) 384px,
         (width >= 1024px) calc((100vw - 32px - 48px) / 3),
         (width >= 640px) calc((100vw - 32px - 24px) / 2),
         calc(100vw - 32px)"
  width="640" height="800" alt="Trail runner in moss green, side view"
  loading="lazy" decoding="async">
```
  At 1280px and up the container is capped, so the slot is (1200 - 48) / 3 = 384px.
- Widths to generate: 320, 480, 640, 960, 1280, 1920 covers 1x to 2x on common slots (opinion). Beyond 2x density the visual gain is small and the bytes are not (opinion).
- Lazy images can let the browser measure the slot: `sizes="auto, (width >= 1024px) 384px, calc(100vw - 32px)"`. `auto` must come first, is only valid with `loading="lazy"`, and browsers without support use the list that follows it (MDN). Baseline newly available since Safari 27, September 2026 (V). Never use it on the LCP image, which must not be lazy.
- `<picture><source media>` only for art direction (different crop on mobile). Do not repeat media conditions in `sizes` when using `media`.

## Loading and priority by position
| Position | Attributes |
|---|---|
| LCP hero | `fetchpriority="high"`, no `loading`, in HTML, not CSS |
| Other above the fold | default loading, default priority |
| Hidden carousel slides, below the fold | `loading="lazy"`; carousel slides 2+ also `fetchpriority="low"` |
| Decorative background in CSS | fine, never for the LCP element |
- Always set `width` and `height` (any pair in the right ratio) so the browser reserves space. With `img { height: auto }` in the reset the CSS width still controls the size.
- Chrome starts fetching lazy images about 1250px before they enter the viewport on 4G; you cannot tune it (web.dev).

## Fonts
Strategy decision:
| Situation | font-display | Extra |
|---|---|---|
| Body text | `optional` if the font is not essential to brand recognition; `swap` with matched fallback metrics if it is | metric overrides always |
| Display or brand headline face | `swap` with matched metrics, and preload the one file used above the fold | |
| Icon font (legacy) | migrate to SVG | |
- WOFF2 only for modern targets. Subset to the languages you ship; split Latin and Latin Extended with `unicode-range` (check the license allows subsetting).
- Variable font when you use 3 or more weights or styles from one family; otherwise static files are usually smaller (web.dev, opinion on the cut-off).
- Preload at most 1 or 2 font files, the ones used above the fold, with `crossorigin` even for same origin (preload ignores `unicode-range`).
- Self-host or use a provider: self-hosting is not automatically faster; it wins when the font sits on the same origin and CDN as the HTML (web.dev).
- Matched fallback (removes the swap shift):
```css
@font-face {
  font-family: "Brand Sans";
  src: url("/fonts/brand-sans-var.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}
@font-face {
  font-family: "Brand Sans Fallback";
  src: local("Arial");
  size-adjust: 104.5%;      /* computed, see formula */
  ascent-override: 92%;
  descent-override: 24%;
  line-gap-override: 0%;
}
body { font-family: "Brand Sans", "Brand Sans Fallback", system-ui, sans-serif; }
```
  Values above are placeholders: compute them from the font metrics (size-adjust = avg char width web / avg char width fallback; ascent-override = ascent / (UPM x size-adjust), same for descent and line gap), or let Fontaine or next/font generate them (Chrome for Developers). Android has no Arial; add a second fallback face using `local("Roboto")`.
- Use `font-variant-numeric: tabular-nums` for numbers in tables, prices that update and timers (opinion, Vercel guidelines).
- `font-synthesis: none` when a family lacks a true italic or bold you do not want faked (opinion).

## Do and don't
| Do | Don't |
|---|---|
| compute `sizes` from the grid CSS | `sizes="100vw"` on a 3-column grid |
| `width` and `height` on every `<img>` | rely on CSS alone to reserve space |
| MP4 loop for a 3s animation | 4 MB GIF |
| one preloaded font file | preload every weight |
| metric-matched fallback | `font-display: block` |

## Worked examples
1. E-commerce category page: hero plus 12-item grid. Hero: `<picture>` with AVIF and WebP sources, `fetchpriority="high"`, explicit `sizes="100vw"` because it is full-bleed, widths 640 to 1920. Grid: as the example above, `loading="lazy"` from item 5 on (items 1 to 4 are above the fold on desktop), `fetchpriority` default. Product images 4:5 with `aspect-ratio` reserved.
2. Brand with a custom display serif and a variable sans for body. Display: one WOFF2 at weight 700, Latin subset, preloaded, `swap`, matched fallback against Georgia. Body: variable sans, axes limited to weight 400 to 700, `swap` plus matched fallback against Arial and Roboto. Total font budget about 90 KB (opinion: target under 100 KB for first view).
3. SaaS app icons: 60 icons as an SVG sprite inlined once at the top of `body`, each used via `<svg aria-hidden="true"><use href="#icon-search"/></svg>` inside named buttons. No icon font, no per-icon requests.

## Hand-offs
- Typeface choice and pairing: design-typography.
- Image content, art direction and illustration style: design-graphic.
- Next.js `next/image` and `next/font` specifics: chapter 06.
