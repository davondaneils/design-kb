# 01 Concept and consistency

Research notes: `kb/research/art-direction/01-concept-and-consistency.md` (C-numbers) and the other art-direction notes. Opinion is marked (opinion).

A page without an art direction concept is a stack of competent parts. The concept is the one idea that decides what every picture, texture and graphic is allowed to be. Clarke: art direction is "distilling an essential, precise meaning or purpose from a piece of content" [C1]. Design arranges; art direction decides what the arrangement means.

## Floor: fundamentals (non-negotiable)
1. **The concept never beats the floor.** No concept excuses a contrast fail, a missing alt, information by color alone, motion without a reduced-motion path, or text baked into an image. [judged; lint covers contrast and motion]
2. **Every image has a job** you can say in one sentence (proves, explains, shows, orients). Decoration is ignored by users [C10]. [judged]
3. **One treatment per set**: one grade or filter, one crop family, one line weight, one palette subset. [judged]
4. **Decorative imagery is hidden from assistive tech** (`alt=""`, or `aria-hidden="true"` on inline SVG); meaningful imagery is named (see 04). [lint via axe for img alt; judged for SVG]
5. **Both themes carry the concept.** Recolor through tokens; never dim a light-mode image to fake dark mode. [judged, FOUNDATIONS item 14]
6. **Imagery cannot outrank the primary action.** In a blurred screenshot the headline and the primary action still win (squint test [O17]). [judged]

## Standards
WCAG 2.2: 1.1.1 (text alternatives), 1.4.1 (use of color), 1.4.3 and 1.4.11 (contrast for text and meaningful graphics), 1.4.5 (images of text), 2.3.3 and FOUNDATIONS motion rule. Details per technique in 03 and 04.

## Decision rules
- **If the brief gives a mood word ("warm", "premium", "bold"), do not design yet.** Ask what is true and specific about the brand: what it makes, where, how, from what, measured how. Build the concept from that fact. (opinion; the method behind C1 and C4)
- **If the brand makes a physical thing**, the concept comes from its origin, material or process (a place, a tool, a measurement). **If it makes software**, the concept comes from the product's own output (the UI, the data, the artifact the user gets). Linear and Vercel lead with product UI; Stripe finds its logo's parallelogram in a real street crossing [C4][C5].
- **Write the concept as one sentence with a noun you can draw.** "Warm craft" fails. "Every bag shows the hill it grew on and the fire that finished it" passes: you can draw a hill and a curve.
- **Then write the reject test**: one line a stranger could use to throw out an image ("Does it show a place, a material or a measurement from this coffee? If not, cut it.").
- **Pick 3 to 5 motifs** (recurring visual elements), each tied to a fact. Fewer than 3 looks thin; more than 5 dilutes. (opinion)
- **Choose where imagery is banned.** Forms, pricing tables, legal and checkout get none. On a marketing page the remaining slices carry a visual with a named job: at least 70% of screen-height slices at 1440 and 390, with the empty ones named as type-only beats (FOUNDATIONS v0.5 visual plan; Stripe 14 of 17, Linear 10 of 12; method and check in 06). The earlier "about every other section" rule planned half that and is withdrawn.
- **Map the concept to tokens** before drawing: `--color-illustration-line`, `--color-illustration-accent`, `--color-illustration-surface`, plus a stroke width and radius. Components use these; dark mode remaps them (design-graphic 04 uses the same token pattern).
- **If the user supplies photos later**, the concept must already say how they will be treated (crop family, grade, where text never sits), so the photo lands in the system instead of breaking it (see 02 and 05).

## Numbers
| Item | Default |
|---|---|
| Motifs in the vocabulary | 3 to 5 (opinion) |
| Treatments per set | 1 |
| Brand accent share of any illustration | one element, roughly 10 percent of the drawn area or less (opinion, matches design-color's "one orange moment" rule) |
| Line weight in illustration | one stroke, 1 or 1.5px at 1x for line art; 2px only when it sits beside the 2px icon set (design-graphic 02) |
| Places the concept appears | every visual in the visual plan (70% of slices, 06), plus at least one small surface such as footer, empty state or OG image |

## Ceiling: exemplar patterns
Measured from page text (WebFetch, 2026-10-09), not pixels; exemplar hosts block screenshots from this environment.
1. **Small vocabulary, repeated.** Mercury: founder portraits, flat abstract illustration with a stated meaning ("overlapping circles, suggesting a unified view of incoming and outgoing funds"), a stylized card close-up [C6]. Three motifs, each repeated.
2. **The brand's geometry found in the world.** Stripe's customer photo of crosswalks that form its slanted parallelogram [C4]. The concept is in the photo choice, not a filter.
3. **The product is the picture.** Linear's homepage imagery is product UI [C5]; Stripe builds a billing mockup with real-looking values [V14].
4. **A treatment as identity.** Spotify by Collins: duotone photography to "give the images a distinctive 'Spotify' look", tied to a positioning shift [C7].
5. **A system with per-story variation.** Santa Maria: "a system for the way content gets handled, but every layout and story can take on a look of their own within that system" [C3].

## Signature moves
1. **Concept from a true fact, not a mood.** The single biggest difference between a "nice" page and a page a studio would sign. A fact is ownable because competitors do not share it. (opinion)
2. **Motif, not picture.** Repeat a drawable element (a contour line, a curve, a crop shape) across sizes, not the same image. It survives a hero, a 64px card thumbnail and a favicon. (opinion)
3. **Design the set, then the image.** Lay out every image slot on the page at thumbnail size side by side before refining any one. Outliers in weight, color or scale show immediately. (opinion; same logic as design-graphic's icon blur review)
4. **Let data draw.** When the brand has numbers (altitude, temperatures, counts, time series), draw them. The image becomes true and specific at once, and users look at information, not decoration [C10][V13].
5. **The concept reaches the small surfaces.** Empty states, the 404, the newsletter footer and the OG image carry one motif. This is where template sites go generic. (opinion)
6. **One element is allowed to be loud.** Everything in the vocabulary is quiet (neutral line work) except one accent element tied to the main fact. (opinion; pairs with design-color's restraint rule)

## Consistency audit (run on every page with imagery)
1. Thumbnail every image slot to 120px wide, side by side, light then dark.
2. Check: same treatment, same line weight, same palette subset, same subject-to-frame scale, same light direction.
3. Check each slot against the reject test.
4. Blur the full-page screenshot (squint test): the headline and primary action must still dominate.
5. Fix outliers by changing the outlier, not the system.

## Do and don't
| Do | Don't |
|---|---|
| "Each bag shows its farm's contour map and its roast curve" | "Warm, premium, crafted feel" |
| Draw the brand's own numbers | Generic blobs, gradients and abstract 3D shapes |
| 3 to 5 motifs used at every size | A new idea in every section |
| Imagery absent from forms and pricing | Illustration behind a checkout form |
| Dark theme with remapped illustration tokens | `filter: brightness(.8)` on light-mode art |

## Worked example 1: Ember and Oak (physical product)
Brief: specialty roaster, Portland, brand orange `#F26B21`, "premium and warm, not a template". No photos available.
1. Facts: single origins from named farms; each lot has an altitude (Guji 2,100 m); each batch has a logged roast curve (bean temperature over time, first crack); roasted on a 1962 drum roaster in Portland.
2. Concept: **"The hill and the fire": every coffee is drawn as the contour map of the hill it grew on and the roast curve that finished it.**
3. Reject test: does the visual show a place, a measurement or the roast? If not, cut it.
4. Motifs: (a) contour lines generated from each origin's altitude, (b) the roast curve, a single line with first crack marked, (c) survey-style annotations (altitude, lot number, coordinates) in small tabular caps, (d) the bag as the object that carries (a) to (c).
5. Accent: the brand orange is the fire. It draws the roast curve and fills the bag; contour lines stay warm neutral.
6. Where: hero (bag printed with the Guji contours, label with a mini curve), shop cards (each origin's own contour tile), story (the full roast curve as the section's image), footer (the roastery's own coordinates). Banned: form fields, prices.
7. Dark: contour lines step to the warm 800 neutral, the curve to orange 300, the bag keeps the brand orange as an object.

## Worked example 2: Tally analytics (software)
1. Facts: Tally counts events; its output is numbers over time.
2. Concept: **"Only counts are pictures": every image in the product is a count, drawn with the chart's own 2px line.**
3. Reject test: does the image show a number or the state of a number? If not, cut it.
4. Motifs: sparklines in KPI tiles; the logo as a tally mark (four strokes and a bar); the empty state drawn from chart parts (baseline, dashed outline bars) instead of a character; skeleton loading that mirrors the real layout.
5. Banned: characters, stock photos, decorative gradients.

## Hand-offs
- website-strategy: positioning and the true facts the concept is built on.
- design-graphic 01, 02, 04: logo, icon grid and illustration style spec; the concept supplies the motifs, graphic supplies the spec format.
- design-color: illustration tokens and their dark remap.
- design-layout: where imagery sits in the section rhythm.
- 06 (this skill): the visual plan that places the concept on every slice, and the product fragment set for software.
- design-motion: whether motifs move (default: they do not).
- dataviz: any graphic that a user reads values from.


## Sources
Claim IDs refer to the research notes in `kb/research/art-direction/` (quotes, tiers, access date 2026-10-09).
- [C1] https://conffab.com/presentation/art-directing-web-design/
- [C3] https://zeldman.com/2008/06/19/art-direction-on-the-web/
- [C4] https://stripe.com
- [C5] https://linear.app
- [C6] https://mercury.com
- [C7] https://www.designweek.co.uk/spotify-undergoes-colourful-brand-refresh/
- [C10] https://www.nngroup.com/articles/photos-as-web-content/
- [O17] https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- [V13] https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/
- [V14] https://stripe.com
