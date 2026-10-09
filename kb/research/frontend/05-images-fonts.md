# Research 05: Images, video and fonts

Researched 2026-10-09. Status key: C = consensus or standard, P = practitioner opinion, V = verify (fast moving).

## Key findings
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | `srcset` with `w` descriptors lists real file widths; `sizes` gives the slot width per media condition, first match wins, no percentages allowed; the browser picks a candidate from slot width and pixel density. `x` descriptors suit fixed-size images. `<picture><source media>` is for art direction only. JS source swapping wastes bandwidth because the preload scanner fetches before scripts run. | MDN Responsive images | C |
| 2 | `sizes="auto"` must lead the list, is valid only with `loading="lazy"`, and unsupported browsers fall back to the sizes list after it (MDN `<img>`). Support: Chrome and Edge 126, Firefox 150, Safari 27 (September 2026); now Baseline newly available. | caniuse; web.dev, September 2026 | V |
| 3 | Lazy-load only offscreen images; never above the fold or the LCP image; always set width and height; the browser controls the distance threshold (Chrome uses 1250px on 4G since 2020). | web.dev, Browser-level image lazy loading | C |
| 4 | Use `<video autoplay muted loop playsinline>` instead of animated GIF. | Vercel Web Interface Guidelines | P (widely agreed) |
| 5 | Next.js 16: `priority` deprecated in favour of `preload`; docs say in most cases use `loading="eager"` or `fetchPriority="high"` instead; do not use `preload` when different images could be LCP at different viewports; default `qualities` is `[75]`. | Next.js Image docs (v16.4, updated 2026-09-28) | V |
| 6 | font-display: `optional` about 100ms block and no swap (best for body text and CLS); `swap` zero block and infinite swap (brand faces that load early); `fallback` about 100ms block and a 3s swap window; replace icon fonts with SVG. | web.dev, Font best practices | C |
| 7 | WOFF2 only for modern targets; subset and use `unicode-range` (check the license); self-hosting is not automatically faster; preconnect with `crossorigin` to font origins; preload sparingly. | web.dev, Font best practices | C |
| 8 | Metric overrides `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` make a local fallback match the web font. Formulas use UPM and average character width. Tools: Fontaine; next/font applies overrides automatically. Arial is not on Android (Roboto is). | Chrome for Developers, Improved font fallbacks | C |
| 9 | Limit variable font axes to the ones used; subset with `unicode-range`. | Vercel Web Interface Guidelines | P |

## Sources
- https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
- https://caniuse.com/mdn-html_elements_img_sizes_auto
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/img
- https://web.dev/blog/web-platform-09-2026
- https://web.dev/articles/browser-level-image-lazy-loading
- https://nextjs.org/docs/app/api-reference/components/image
- https://web.dev/articles/font-best-practices
- https://developer.chrome.com/blog/font-fallbacks
- https://vercel.com/design/guidelines
