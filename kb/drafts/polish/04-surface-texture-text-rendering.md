# 04 Surface, texture and text rendering

Flat color in large areas reads as unfinished on modern screens; heavy gradients read as 2012. The craft is in between: surfaces with a light source you feel but cannot point at, gradients without bands, grain you only notice when it is gone, and text and native controls that match the theme down to the scrollbar.

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **Text on any gradient, texture or image meets 4.5:1 (3:1 large) at its worst point**, checked at the lightest and darkest pixel behind the text. axe marks these "needs review"; you measure them. [judged; FOUNDATIONS item 2]
2. **Texture and gradient are decoration.** Nothing is communicated only by them; forced colors removes non-url `background-image` (MDN), and the page must read the same. [judged]
3. **`color-scheme` is set on `:root`** (`light dark`, or the one scheme you ship), so scrollbars, native inputs and spellcheck underlines follow the theme (MDN color-scheme). A dark page with white scrollbars is a polish fail. [judged; lint proposal]
4. **No global font smoothing.** `-webkit-font-smoothing: antialiased` is macOS only and makes text lighter (MDN); apply it only to light text on dark surfaces, never to the whole page by habit (design-typography 05 agrees). [judged]
5. **No global `text-rendering: optimizeLegibility`**: MDN says it is "not recommended for typical articles due to potential performance impacts". Headlines only, if at all. [judged]
6. **Grain and gradients stay still under reduced motion**; no animated noise or shifting gradients without the reduced-motion rule. [lint]

### Standards
| Rule | Source |
|---|---|
| Text contrast on non-solid backgrounds | WCAG 1.4.3; FOUNDATIONS item 2 |
| `color-scheme` affects canvas, scrollbars, form controls, spellcheck | MDN color-scheme |
| `accent-color` styles checkbox, radio, range, progress | MDN accent-color |
| `font-optical-sizing: auto` is the default | MDN font-optical-sizing |
| `text-wrap: balance` limited to 6 lines in Chromium, 10 in Firefox | MDN text-wrap |

### Decision rules
- **If a large surface (hero stage, band, sidebar) looks flat**: give it a light source. A radial or linear gradient whose two ends differ by 2 to 4 percent OKLCH lightness, lighter toward the top (where the light is; matches shadows falling down). Above about 6 percent it reads as "a gradient" instead of "light". Opinion, with the reason: the eye reads small lightness ramps as illumination.
- **Interpolate in OKLCH** (`linear-gradient(in oklch, ...)`) so mid-tones do not pass through gray. Keep the hue fixed or within 10 degrees.
- **If a gradient spans more than about 600px with a small lightness change, especially in dark themes**: expect banding (8-bit steps become visible bands). Add grain: an SVG `feTurbulence` `fractalNoise` layer (Ana Tudor's demos use `baseFrequency` about .97 for fine grain and rarely go above 3 or 4 octaves for performance; we default to 0.85 and 2 octaves, opinion), blended at 2 to 5 percent opacity (opinion). Check at 1x and 2x.
- **If grain is a brand texture** (paper, kraft, print): put it on the object (a bag, a card stock) at 4 to 8 percent, not on the whole page.
- **If text sits on grain**: grain sits under the text layer, and contrast is measured on the grain's lightest pixel.
- **Native controls**: `accent-color: var(--color-primary)` so checkboxes, radios and range sliders join the palette; `::selection { background: var(--color-selected-bg); color: var(--color-selected-text) }` so selected text is on brand and keeps contrast.
- **Display type**: `font-optical-sizing: auto` stays on (default); with Inter, switch to Inter Display at 25px and up (Linear uses Inter Display for headings). With a static family, use the display cut for display sizes.
- **Headings**: `text-wrap: balance` on h1 to h3 and short centered blurbs; `text-wrap: pretty` on paragraphs.
- **Light text on dark surfaces** (macOS): `-webkit-font-smoothing: antialiased` scoped to the dark scheme, then check small muted text still clears the contrast floor by eye, since it renders thinner.

### Numbers
| Item | Default |
|---|---|
| Surface light gradient | 2 to 4% OKLCH lightness across the surface, top lighter |
| Grain overlay | `fractalNoise`, baseFrequency 0.8 to 0.9, numOctaves 2 to 3, opacity 0.02 to 0.05 (page), 0.04 to 0.08 (object) |
| Grain tile | 160 to 240px SVG data URI, `background-repeat: repeat` |
| Inner highlight on raised surfaces | `inset 0 1px 0 rgb(255 255 255 / 0.12)` on filled buttons; 0.05 on dark raised surfaces |
| Selection | `--color-selected-bg` / `--color-selected-text` (same pair as selected rows) |

Grain recipe (data URI, no network):
```css
--grain: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
.surface { background: var(--grain), linear-gradient(in oklch, var(--a), var(--b)); }
/* control strength with the SVG alpha row or a pseudo-element at opacity .03 */
```
`stitchTiles='stitch'` keeps tile seams invisible. A url-based image survives forced colors, so keep grain decorative and low.

## Ceiling: exemplar patterns and signature moves

### Exemplar patterns
- Linear builds themes in LCH because it is perceptually uniform (team blog); gradients and surfaces in a uniform space are what make their dark UI look smooth rather than banded. Our equivalent: OKLCH, as in design-color.
- Apple materials: chosen "based on semantic meaning", never for the color they impart (HIG Materials). Translucency is for things that float over content (navigation, sheets), not for content cards.

### Signature moves
1. **Light from one place, everywhere.** Surface gradients lighter at the top, shadows falling down, inner highlights on the top edge. A page where all three agree feels lit; one that mixes them feels collaged.
2. **Grain on the object, not the page.** The product stage gets a light gradient; the product (the coffee bag) gets matte paper grain. Texture where touch would feel it.
3. **The dark band trick.** A dark full-bleed band with a 3 percent radial lift behind the headline plus 3 percent grain: no bands, and the headline sits in a soft pool of light.
4. **Theme the browser's parts.** `color-scheme`, `accent-color`, `::selection`, `caret-color`, and `scrollbar-color` on custom scroll areas. Generalists theme the page and forget the chrome the browser draws.
5. **Inter Display at display sizes**, and Inter text at 14 to 20. The display cut has tighter spacing and finer detail meant for large sizes.

### Do and don't
- Do a 3% lightness lift. Don't a two-hue "aurora" gradient behind body text.
- Do grain at 3 to 5%. Don't visible TV static.
- Do `color-scheme: light dark`. Don't ship white native inputs on a dark page.

### Hand-offs
- Color spaces and ramps: design-color. Faces and features: design-typography. Illustration and photography: design-graphic.

## Sources
MDN color-scheme, accent-color, font-smooth, font-optical-sizing, text-rendering, text-wrap, feTurbulence, forced-colors; Ana Tudor, Grainy Gradients (Frontend Masters blog); Apple HIG Materials; Linear blog. Quotes: `kb/research/polish/04-surface-texture-text-rendering.md`.
