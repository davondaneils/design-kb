# 04 Visuals without image hosts

Sources: `kb/research/art-direction/04-visuals-without-image-hosts.md` (V-numbers). Opinion is marked (opinion).

Claude often builds where image CDNs, font CDNs and stock libraries are blocked, and before the client has any photos. The failure mode is the placeholder that ships: a gray box, a gradient blob, a CSS rectangle standing in for a product. This chapter is how to make visuals that are finished, specific and true from code alone, and how to say honestly what is a stand-in.

## Floor: fundamentals (non-negotiable)
1. **Never fake a photo.** Do not imitate photography with CSS or SVG, and never present a drawing as a real place, product or person. Draw openly as drawing. (design-graphic 03 rule on fabricated imagery) [judged]
2. **Name meaningful art, hide decorative art.** Meaningful inline SVG: `role="img"` plus `aria-labelledby` (visible caption) or `aria-label` [V1][V2]. Decorative SVG, textures and patterns: `aria-hidden="true"` (the inline-SVG equivalent of `alt=""` [V4][V5]). [judged; axe checks some]
3. **Text stays live HTML.** Prices, labels, captions and annotations are HTML, not SVG paths or baked text (1.4.5). Where SVG text is unavoidable it renders at 12px or more at 390px. [lint: SVG text size]
4. **Meaningful strokes and fills meet 3:1** against their surface (1.4.11); decorative texture does not need to, and should not (see 03, textures). [judged]
5. **Theme through tokens.** Art uses `currentColor` or CSS custom properties, so dark mode remaps it. No hard-coded hex inside reusable art. [judged]
6. **Deterministic.** Generated art uses a seeded generator, so every render is identical and screenshots are comparable. [judged]
7. **Static by default.** If any of it moves, `prefers-reduced-motion: reduce` stops it (FOUNDATIONS item 10). [lint]
8. **Budget**: inline art for one page under about 150 KB of SVG markup in total; one hero piece under about 60 KB. Above that, move it to an external `.svg` file with `width` and `height`. (opinion; keeps HTML parse and LCP fast)

## Standards
WCAG 1.1.1, 1.4.3, 1.4.5, 1.4.11, 2.3.3; ARIA `img` role [V1]; W3C decorative images tutorial [V4]; Apple HIG recommends SVG or PDF for flat art that needs high-resolution scaling [V15].

## Decision rules: pick the medium
| You have | Make | Why |
|---|---|---|
| Numbers the brand owns (altitude, temperatures, counts, time series, distances) | **Data-driven graphic**: draw the data as art (contours, curves, sparklines, small multiples) | True and specific at once; users look at information [C10][V13] |
| A physical product with a known shape (bag, bottle, device, card) | **SVG object drawing at full fidelity**: correct proportions, real label text in HTML, one light source | The product is the hero (landing playbook move 1) |
| A software product | **The UI itself**, built in HTML with real data (Stripe, Linear) [V14][C5] | Proof beats illustration |
| A material or surface the brand is about (paper, wood, ceramic, fabric) | **Procedural texture**: feTurbulence grain, SVG pattern [V6][V10] | Adds tactility without a file |
| An abstract process | **Diagram** in the icon grid's stroke (design-graphic 02, 04) | Explains |
| A real photo is needed and not available | **An honest slot**: the right ratio, a quiet surface, a caption saying what goes there, and the request in the hand-over (05) | Do not fake the photo |
| Nothing informative | **Type** at display size | design-graphic: "No image; strong type instead" |
| An image generation tool in this session | **Concepts, moodboards and textures only**; never final people, products or places presented as real, and never text in the image. Redraw or replace before shipping; provenance rules in design-graphic 03 | Trust, rights and provenance (design-graphic 03) |

Rules:
- **If you can draw it from data, do that before anything else.** (opinion; the strongest move in this chapter)
- **SVG over CSS-drawn objects** for anything with curves, more than a few shapes, or that must be named for assistive tech. CSS objects are fine for simple geometric packaging and UI chrome. (opinion)
- **Draw at full fidelity or not at all.** A half-drawn product reads as a placeholder; the color pilot's CSS bag was rated this way (`kb/tests/design-color.md`). Proportions from the real object, a seam, a fold, a label with real content, one consistent light.
- **One drawing language**: same stroke width, same corner radius family, same palette subset as the icon set (design-graphic 02). Illustration and icons should feel like one family.

## Recipes (copy, then set the tokens)

### 1. Seeded contour lines (place, terrain, origin)
`node assets/contours.mjs --seed 412 --w 480 --h 600 --levels 14 --peaks "0.62,0.38,1;0.25,0.8,0.45" --noise 0.35 > contours.svg-fragment`
- Peaks are `x,y,height` in 0 to 1 of the canvas. Tie them to facts: height from altitude, one peak per farm. Use the lot number as the seed so each coffee always gets its own map.
- Output paths carry `class="c"` and every 5th level `class="c major"`; style: `.c { stroke: var(--color-illustration-line); stroke-width: 1; vector-effect: non-scaling-stroke; } .major { stroke-width: 1.5; }`.
- Size: about 45 KB for a 400 x 500 hero at `--cell 8 --smooth 2 --precision 0`; about 15 to 25 KB for a card tile at `--cell 10 --smooth 1`. Use fewer levels or a bigger cell for thumbnails.
- **Draw once, use twice.** To show one map as ground and again clipped inside an object (a map printed on the bag that continues off its edge), put the paths in `<defs><g id="map">` and place two `<use href="#map">`. Set `fill: none` and `stroke` on each `<use>`, not on the paths: stroke inherits into the copy, class rules on the paths would not differ between the two. This cut the tester's page from 308 KB to 121 KB.

### 2. Data curve with HTML labels (process, time series)
- Draw the line in an SVG with `viewBox="0 0 100 100" preserveAspectRatio="none"` and `vector-effect: non-scaling-stroke` so the line stretches to any width at a constant 2px.
- Position labels as HTML (`position: absolute; left: 62%; top: 18%`) at the data points. Labels stay real text on the type scale at every width.
- **Every label beside a line gets a solid backplate** (`background: var(--color-surface)`, 2px 4px padding). At some width the line will pass behind some label; in the tester's coffee page the roast curve ran behind two labels at 2.85:1 (light) and 1.74:1 (dark), which axe only flagged as "needs review".
- Place labels where the line is not: above-left of points on a rising curve, below the minimum of a dip. Drop a label the caption already states rather than stacking two near one corner.
- Give the figure `role="img"` with `aria-labelledby` pointing to a visible caption that states the data in words, or use a `<figure>` with `<figcaption>` and hide the SVG.
- Charts a user reads values from go through the dataviz skill.

### 3. Sparkline (word-sized data)
Tufte: "data-intense, design-simple, word-sized graphics" [V13]. 64 to 96 px wide, 24 to 32 tall, 1.5 to 2px line, end dot, no axes; the number it summarizes sits next to it in text. Line in the neutral muted color, end dot in the series color (or the danger color when up is bad). Hidden from assistive tech when the adjacent text already states the trend; otherwise `role="img"` with a one-line label ("12-week trend: up from 2.4% to 2.9%, which is worse").
**Overlap rule**: a sparkline beside a large number collides with it in narrow tiles, and the lint does not see SVG over text. Put `container-type: inline-size` on the tile and stack the sparkline under the number below the width where value plus gap plus sparkline fits (about 240px for a 31px value and a 96px sparkline). Found in the tester's dashboard at 390 and 1024 to 1279px.

### 4. Grain (paper, kraft, film)
Tested in `kb/tests/design-art-direction/coffee-after.html` (Chromium, light and dark):
```css
:root { --grain-opacity: 0.1; --grain-blend: multiply; }
@media (prefers-color-scheme: dark) { :root { --grain-opacity: 0.06; --grain-blend: screen; } }
.grain { position: relative; }
.grain::after { content: ""; position: absolute; inset: 0; pointer-events: none;
  opacity: var(--grain-opacity); mix-blend-mode: var(--grain-blend);
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
@media (forced-colors: active) { .grain::after { display: none; } }
```
Escape `#` as `%23` inside the data URI. Never put grain behind text; put text on a solid chip instead.
`feTurbulence` synthesizes "artificial textures like clouds or marble" [V6]; for grain use `fractalNoise`, `baseFrequency` 0.6 to 0.9, opacity 0.05 to 0.12 (opinion). In dark themes use `mix-blend-mode: screen` with lower opacity. Blink and WebKit blend slightly differently; check both (V9). A data URI background is a url-based image, so it survives forced colors (03, O8); keep it decorative.

### 5. Pattern (repeat motif)
SVG `<pattern>` tiles a motif "to cover an area" [V10]. Use the brand's own motif (a tally mark, a bean outline, a grid tick), not dots and waves from a pattern library. Pattern contrast against its surface about 1.1 to 1.3:1 (03).

### 6. Flow field or generative line work (energy, motion, abstract brand moments)
Hobbs: a grid that stores an angle at each point; resolution about 0.5 percent of image width; stop lines before they collide [V11][V12]. Use for one brand moment (OG image, section divider), seeded, and only when the angles come from something (wind data, a signal, the brand's own curve). Otherwise it reads as a tech demo. (opinion)

### 7. CSS-drawn object (simple packaging, cards, devices)
Allowed when the object is mostly rectangles: use `aspect-ratio` from the real product, layered gradients for one consistent light, `border-radius` from the radius scale, real HTML text on the label. Keep the object `aria-hidden` and name it once on the wrapping `figure`.

### 8. Honest photo slot
`<figure class="slot" style="aspect-ratio: 4 / 5">` with a quiet surface, the concept's motif at low contrast, and a visible caption ("Photo: the 1962 Probat, door open, coming soon") only on internal previews. On a public page, prefer drawing to an empty slot. The hand-over carries the request (05).

## Numbers
| Item | Default |
|---|---|
| Line art stroke | 1 to 1.5px at 1x; 2px when it sits with 2px icons |
| Index (major) contour every | 5 levels (survey map convention, opinion) |
| Grain | `fractalNoise`, baseFrequency 0.6 to 0.9, numOctaves 3, opacity 0.05 to 0.12 |
| Texture contrast | about 1.1 to 1.3:1 against its surface |
| Sparkline | 64 to 96 x 24 to 32 px, 1.5 to 2px line |
| SVG text | at least 12px rendered (lint) |
| Inline SVG budget | about 150 KB per page, 60 KB per piece (opinion) |

## Ceiling: signature moves
1. **The data is the illustration.** Contours from altitude, a curve from the roast log, sparklines from the metric itself. Nobody else can draw your numbers. (opinion)
2. **Seed with an ID the brand already uses** (lot number, order ID, user ID). Every coffee, invoice or profile gets its own deterministic art for free, and support can reproduce it.
3. **SVG for the drawing, HTML for the words.** Non-scaling strokes plus percentage-positioned HTML labels keep both crisp and accessible at every width.
4. **Texture moves away from the text color** (03), so it never costs contrast.
5. **One loud stroke.** Draw everything in the neutral line color except the single element that carries the main fact, in the brand accent.
6. **Annotate like a map or a lab notebook.** Small tabular figures, units, a hairline leader to the point: annotation turns a drawing into evidence. (opinion)
7. **Name the stand-in.** In the hand-over, list each drawn element that a real photo should replace later and the exact request (05). Never let a stand-in pass as final silently.

## Do and don't
| Do | Don't |
|---|---|
| Contours generated from the farm's altitude | A random blob gradient |
| A bag drawn to the real 3:4.2 pouch shape with a live HTML label | A rectangle with a sticker |
| Sparkline beside the number it summarizes | Sparkline instead of the number |
| `aria-hidden` texture, named figure | Unlabeled SVG read out node by node |
| Seeded, identical every render | `Math.random()` art that changes per load |

## Worked example: Ember and Oak with no photos
1. Hero: an SVG bag at the real pouch ratio in brand orange, printed with the Guji contour map (lot 412 as seed, 2,100 m as peak height) in orange 700 lines, a paper label in HTML with origin, process, weight and a 1.5px roast-curve sparkline. The stage behind it carries the same contours continuing off the bag at texture contrast, plus 8 percent grain.
2. Cards: each coffee's own contour tile (seed = its lot number, peak = its altitude), 4:3, neutral lines, altitude as an HTML annotation.
3. Story: the full roast curve of batch 412 (charge, turning point, first crack, drop) as the section image, line in orange, labels in HTML.
4. Footer: the roastery's own coordinates, 45.51 N, 122.66 W, in the same annotation style.
5. Hand-over: list of stand-ins and the photo request for the roaster (05).

## Hand-offs
design-graphic 02 and 04 (icon grid, illustration spec), dataviz (any chart users read), design-color (illustration tokens), design-motion (if anything animates), design-frontend (inline vs external SVG, performance).
