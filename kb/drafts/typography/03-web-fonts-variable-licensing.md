# Web font loading, variable fonts and licensing

Read this when shipping fonts to a website or app, fixing layout shift or invisible text, choosing static vs variable files, or checking a license.

## Principles
1. **Text must be readable immediately.** The browser default for most font loads is to hide text for up to 3 seconds (Chromium, Firefox) or indefinitely (Safari) (web.dev). Never accept that for body text.
2. **The swap must be invisible.** A fallback that matches the web font's size and metrics makes the swap a non-event. That is how elite sites get fast text and near-zero CLS together.
3. **Fewer bytes beat clever loading.** Fewer families, fewer styles, WOFF2 only, subset to the scripts you use.
4. **A license is a feature requirement.** Check it before design sign-off, not after launch.

## Fundamentals (non-negotiable)
- WOFF2 only for modern targets (about 30% smaller than WOFF, web.dev).
- `font-display` set explicitly on every `@font-face`. Never rely on the default.
- `@font-face` rules inline in the `<head>` (or in the first CSS file), not behind `@import`.
- A metric-matched fallback for each text face (below), so swap shift is near zero.
- Preload at most one or two files: the regular text face actually used above the fold. Preload ignores `unicode-range` and competes with other resources (web.dev).
- Every style you use has a real file. In QA, set `font-synthesis: none` so a missing bold or italic shows up instead of being faked by the browser.
- No icon fonts. Use SVG (web.dev).
- License covers this use, host and traffic.

## font-display decision rules
| Value | Block | Swap window | Use for |
|---|---|---|---|
| `swap` | 0ms | infinite | Default for text faces, only with a metric-matched fallback |
| `optional` | 100ms | none | Body text on performance-critical pages and slow-network audiences; the font shows on later views once cached |
| `fallback` | 100ms | 3s | A compromise when you cannot build matched fallbacks |
| `block` | 2 to 3s | infinite | Never for text; only for tiny decorative assets where fallback glyphs would be wrong |

Numbers from web.dev. You can mix: `swap` for the brand display face, `optional` for body (web.dev).

## Metric-matched fallback
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
  size-adjust: 107%;        /* example values: generate, never guess */
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
body { font-family: "Brand Sans", "Brand Sans Fallback", system-ui, sans-serif; }
```
Generate the four values with a tool that reads both fonts' metrics: next/font (automatic), Fontaine, or Capsize. `size-adjust` is Baseline widely available since September 2023 (MDN). `font-size-adjust: ex-height from-font` (Baseline 2024) is the simpler tool when you just need x-heights to match across mixed fonts, for example inline code inside body text.

## Self-host or service
- Google Fonts: easiest, auto-subset per script, variable axes via the css2 API (`family=Inter:opsz,wght@14..32,400..700&display=swap`). Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com` with `crossorigin`.
- Self-host: one fewer connection, full control, works with metric fallbacks and preload. You must subset yourself with `unicode-range` and tools such as glyphhanger or subfont (web.dev).
- Decide by measuring, not belief (web.dev). Web Almanac 2024: 34% of mobile sites now self-host exclusively.
- Adobe Fonts and most commercial subscription services do not allow self-hosting; the kit must load from their CDN.

## Variable fonts
- **When:** you use three or more weights or styles of one family, or you need an axis that static files cannot give (optical size, grade, width). For one or two weights, static files are usually smaller (web.dev: a variable file can be larger than one static file). Measure both.
- **Use standard properties** for registered axes: `font-weight` (wght), `font-stretch` (wdth), `font-style: oblique 10deg` (slnt, sign inverted), `font-style: italic` (ital), `font-optical-sizing` (opsz). Use `font-variation-settings` only for custom axes such as `GRAD`, `SOFT`, `WONK`, and drive it with custom properties because it must restate every axis (MDN).
- Declare ranges: `font-weight: 100 900;` in `@font-face`, or the browser treats the file as one weight.
- **Optical size:** `font-optical-sizing: auto` is on by default. Browsers map `opsz` to CSS px, while the axis was specified in points, so on the web a face may render at a slightly larger optical size than its designer intended (CSSWG #4430, unresolved). If text looks too light and spindly at body size in the browser compared with the design tool, set the role explicitly, for example `font-variation-settings: "opsz" 14` on body.
- **Grade for dark mode (expert move):** light text on dark backgrounds looks heavier (irradiation; practitioner opinion). If the face has a `GRAD` axis, lower grade on dark themes; grade changes stroke weight without changing width, so nothing reflows (Google Fonts Knowledge). Without GRAD, drop weight by about 50 units (400 to 350) on variable fonts (opinion; check the result still passes contrast).
- Weight animation on hover is possible with variable fonts, but if the face lacks GRAD, weight changes width and the layout shifts. Animate GRAD, not wght.

## Subsetting
- Split by script with `unicode-range` so pages download only what they render (web.dev). For the Latin block, copy the current `/* latin */` `unicode-range` from a Google Fonts CSS response for your family; it changes over time. It starts `U+0000-00FF` and includes general punctuation `U+2000-206F`, the euro sign and the minus.
- Keep the characters your typography uses: curly quotes and dashes (U+2000-206F), minus U+2212, the euro sign U+20AC. Subsetting them out silently falls back to another font mid-word.
- **License trap:** under the OFL, subsetting counts as modification, and a modified font normally cannot keep a Reserved Font Name unless it is functionally equivalent (OFL FAQ 2.6, 2.7). Check whether the family declares an RFN; if so, rename the subset family or confirm equivalence. Commercial EULAs often forbid modification entirely.

## Licensing basics
| Use | License needed | Usually metered by |
|---|---|---|
| Designers making mockups, print, PDFs | Desktop | Seats or users |
| Website `@font-face` | Web | Pageviews or visitors |
| Native app bundling the font | App | Apps or installs |
| E-books | ePub | Titles |
| Video, broadcast | Broadcast or screen | Audience, budget |
| Paid social and display ads | Digital ads or social | Impressions, followers |
| Logo | Logotype or desktop (check) | Per mark |

Source: Alphabettes licensing survey. Rules:
- OFL fonts (Google Fonts, most of the table in 02): free for commercial use, web and apps; cannot be sold on their own (OFL FAQ 1.1, 1.5, 2.1).
- Never use SF Pro, New York or other Apple system fonts as web fonts or in non-Apple products; Apple licenses them for mockups of Apple platform UIs. On the web, `system-ui` gives SF on Apple devices legally.
- Desktop licenses do not cover web use, and web licenses do not cover apps. Ask the foundry when traffic will exceed the tier.
- Keep the license file and invoice in the repo or brand folder.

## Do and don't
- Do: one variable WOFF2 with `font-weight: 100 900` and a matched fallback. Don't: six static weights from Google Fonts with `display=block`.
- Do: preload the regular text face. Don't: preload italic, bold and display "just in case".
- Do: `system-ui` for admin tools. Don't: download a brand face for a back-office table.

## Worked example: fix a slow marketing site
Before: Poppins in six static weights (300 to 800) plus italic from Google Fonts with `@import`, icon font, CLS 0.18. After: two weights (400, 600) or the variable file if available for the family; `<link>` with preconnect replacing `@import`; `display=swap` plus metric fallback generated by Fontaine; icon font replaced by inline SVG; `font-synthesis: none` in QA caught a faux italic in the footer. Expected result: fewer requests, no invisible text, CLS from fonts near zero. Re-measure in the field (Core Web Vitals report), not just in the lab.

## Hand-offs
- Build pipeline, preload tags, Core Web Vitals: design-frontend.
- Dark theme surfaces and text color: design-color.
