# 03 Composition, focal point and text over images

Sources: `kb/research/art-direction/03-composition-and-overlays.md` (O-numbers). Opinion is marked (opinion).

## Floor: fundamentals (non-negotiable)
1. **Text over any image, texture or gradient meets 4.5:1 (3:1 at 24px, or 18.66px bold) at the worst pixel behind each letter**, not on average. F83 makes low-contrast background images a failure; G18 says to measure "the background pixels immediately next to the letter" [O1][O3]. [lint where axe can decide; judged with `assets/overlay_contrast.py` where axe reports "needs review"]
2. **Measure in both themes and at both widths.** A crop that moves at 390px moves the bright part of the image under the text. [judged]
3. **No readable text baked into images.** Use live text (1.4.5) [O6]. Logotypes are the exception [O7]. [judged]
4. **Meaningful graphic parts meet 3:1** against their background (1.4.11); decorative ones do not need to [O10]. [judged]
5. **Overlays survive forced colors.** Gradient scrims and text shadows are removed in forced-colors mode [O8][O9]; text must still sit on something solid. [judged]
6. **One focal point per frame and per view.** [judged]

## Standards
WCAG 1.4.3, 1.4.5, 1.4.11; techniques F83 and G18; MDN forced-colors behavior.

## Decision rules
### Text over images: choose in this order
1. **Do not overlay.** Put text beside the image (split hero). Safest, and usually better composed. (opinion)
2. **Planned negative space.** The image has a calm area (sky, wall, table) where the text sits; check the worst pixel with the script.
3. **Solid panel** behind the text block: `--color-surface` or `--color-bg` at full opacity, padding 16 to 24. Robust in forced colors: `background-color` is forced to the system color opposite the text, and its alpha is kept, so an opaque panel stays opaque [O18]. Never set `forced-color-adjust: none` on overlay text; it also removes the browser's text backplate [O19].
4. **Scrim**: a gradient from the text side, about 60 to 75 percent of `--color-bg` or near-black down to 0, sized to the text block (design-graphic 03). Add a forced-colors fallback: `@media (forced-colors: active) { .overlay-text { background-color: Canvas; } }`, because the gradient is forced to none [O8] while an opaque background color is kept [O18].
5. **Text halo or shadow**: last resort. A wide border around letters counts toward contrast [O5], but `text-shadow` is removed in forced colors [O9].

### Textures under text
- **Move texture away from the text color.** Under dark text, texture lines must be lighter than the surface; under light text, darker. Then texture can only raise contrast, never lower it. (opinion; follows from G18's per-letter measurement)
- Keep texture contrast low (about 1.1:1 to 1.3:1 against its surface) so it reads as material, not pattern. (opinion)

### Composition
- **Pick the focal point first**: the one thing the frame is about. Give it the most contrast, the most isolation, or the largest size in the view [O15][O16].
- **Size**: the focal element at clearly more area than anything else; design-graphic 05 uses about 3x as the default for single graphics. (opinion)
- **Gaze and direction**: faces, eyes, arrows, lines and slopes pull attention in the direction they point, even when viewers are told the cue is meaningless [O12][O13]. Point them at the headline or the action, never off the page.
- **Rule of thirds is a starting grid, not a law.** Ratings of photos correlated "only weakly" with subjective thirds scores and "not at all" with measured ones [O14]. Center a symmetric product; place a directional subject off-center with its lead room facing the copy.
- **Lead room**: a subject facing or moving right gets empty space on the right. (opinion, standard photographic practice)
- **Edges**: keep focal objects at least 8 percent of the frame away from crop edges, or let them break the edge decisively. Half-touching tangents look like mistakes. (opinion)
- **Squint test** before shipping: blur the screenshot; what remains visible is the real hierarchy [O17].

## Numbers
| Item | Value |
|---|---|
| Text on image | 4.5:1 body, 3:1 large (24px, or 18.66px bold), at the worst pixel |
| Meaningful graphic parts | 3:1 |
| Solid panel padding | 16 to 24 (`--space-5` to `--space-6`) |
| Scrim | 60 to 75 percent opacity at the text edge to 0, about 1.5x the text block height (opinion) |
| Texture contrast against its surface | about 1.1 to 1.3:1 (opinion) |

## The worst-pixel check
1. Render the page with the overlaid text set to `color: transparent` (or crop the source image to the text box).
2. `python3 assets/overlay_contrast.py shot.png --box X Y W H --text "#1b1917" --min 4.5` (box in screenshot pixels).
3. It prints the worst pixel, 1st percentile and failing share. Any failing pixel fails the page: darken the area, add a panel, or move the text.
4. `--exclude-near 2.0` on a screenshot that still has the text in it is a rough screen only: anti-aliased glyph edges produce in-between pixels that read as false fails (the tester measured 2.00:1 "worst" on a band whose clean background was 5.28:1 everywhere). Always confirm on a clean render.
5. In the design-kb repo, `node kb/tests/design-art-direction/overlay-check.mjs page.html ".selector" 1440 light` does steps 1 to 3 for every text box inside a selector, skipping text on its own opaque fill. Run it at 390 and 1440, light and dark, on every section where text meets art.

## Ceiling: signature moves
1. **Compose the image for the type, not the type for the image.** Decide where the headline sits, then crop or draw so that area is calm. Studios lay out before the shoot (design-graphic 03). (opinion)
2. **Texture that can only help.** Lines lighter than the surface under dark text. A grain or contour layer then never needs a contrast exception. (opinion)
3. **Backplate over scrim** for anything that must survive forced colors and theme switches. Gradients are a light-mode luxury. [O8]
4. **Gaze into the copy.** The cheapest focal move there is, and backed by lab evidence [O12].
5. **One full-color element in a quiet frame.** Value contrast and isolation beat size: a small orange curve on a neutral contour map is the first thing anyone sees. (opinion)
6. **HTML labels over SVG art.** For annotated illustrations and diagrams, draw lines in SVG (`vector-effect: non-scaling-stroke`, `preserveAspectRatio="none"` when the art stretches) and position labels as HTML in percentages. Labels stay at the type scale and stay real text at every width; SVG text in a scaled viewBox shrinks below 12px on phones (the color pilot found 6px axis labels this way). (opinion, measured in the pilot)

## Do and don't
| Do | Don't |
|---|---|
| Text beside the image, or on a measured calm area | White text on a busy sky |
| Solid backplate with a forced-colors fallback | Gradient scrim only |
| Gaze and lines pointing at the headline | Model looking off the page edge |
| Contour lines lighter than the surface under dark text | Dark texture lines crossing dark text |
| Focal point clearly larger or more contrasting | Three things competing at the same size |

## Worked example: Ember and Oak hero
1. Focal point: the orange bag, the only saturated object above the fold.
2. The headline sits left, on plain surface, not on the art (option 1).
3. The bag's label carries live HTML text on a near-white paper panel: warm 950 on warm 50, 14.9:1; contour lines printed on the bag stop under the label.
4. Contour lines on the stage are darker than the stage, which is allowed because no text crosses them: every stage label sits on a solid chip of `--color-surface`. In the subscription band, where text does cross a map, the lines are lighter than the band in light mode and darker in dark mode. Measured worst pixel under the band text: 5.28:1 light and 13.44:1 dark, exactly the plain band values, so the texture costs nothing.
5. The roast curve on the label rises left to right toward the headline side. The slope reads as direction (opinion).

## Hand-offs
design-color (contrast math, `oklch_scale.py check`), design-layout (split hero grid), design-graphic 05 (social and thumbnail composition), design-frontend (forced-colors CSS), design-motion (parallax and scroll effects stay off by default).
