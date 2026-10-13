---
name: design-art-direction
description: Domain reference loaded by design-director or a design playbook (design-playbook-landing, -dashboard, -mobile, -brand); do not trigger on its own for a page, screen or brand job. Covers the page-level visual concept that runs through a whole site, picking, cropping and treating photography, composition and focal point, accessible text over images, keeping an image set consistent, making real visuals from code when image hosts are blocked (inline SVG, CSS objects, generative patterns and textures, data-driven graphics), and requesting photos from the user with exact specs. Load it directly only for a narrow question inside this domain ("how do I put text on this photo", "what photos should I ask the client for"). Logos, icons and social graphics are design-graphic.
---

# design-art-direction

> **Layer: domain reference.** Loaded after `design-foundations` by `design-director` or a `design-playbook-*` skill. Accessibility floor: design-foundations `references/accessibility.md`. Builds on design-graphic `references/03-photography-direction.md` and `04-illustration.md`; does not repeat them.

Design arranges a page. Art direction decides what the page is about visually: one idea, drawn from a true fact about the brand, that every picture, texture and graphic obeys. The color pilot's coffee page passed every gate and still looked like a template because it had no such idea (`kb/tests/design-color.md`). This skill is the fix.

## 1. Fundamentals (non-negotiable, check first)
1. **The concept never beats the floor.** No visual idea excuses a contrast fail, missing alt, color-only meaning, motion without a reduced-motion path, or readable text baked into an image.
2. **Every image has a job** you can state in one sentence (proves, explains, shows, orients). Users ignore decoration and generic stock people, and skip photos that do not help the task (NN/g eyetracking).
3. **Text over any image, texture or gradient passes 4.5:1 (3:1 large) at the worst pixel** behind each letter, in both themes and at 390 and 1440 (WCAG F83, G18). Measure with `assets/overlay_contrast.py`.
4. **Overlays survive forced colors**: gradient scrims and `text-shadow` are removed there; an opaque `background-color` panel is kept. Text on imagery sits on something solid or on measured calm space.
5. **Meaningful art is named, decorative art is hidden.** Inline SVG that carries meaning: `role="img"` plus `aria-labelledby` or `aria-label`. Textures, patterns and ornament: `aria-hidden="true"`. Meaningful strokes meet 3:1 (1.4.11).
6. **Words stay live HTML.** Labels, prices and annotations are HTML; SVG text, if any, renders at 12px or more on phones.
7. **One treatment per set** (one crop family, grade, stroke, palette subset), and **both themes carry it** through tokens, never a dimmed copy.
8. **Never fake a photo** or present stock, AI or drawn people as real customers. Draw openly as drawing.
9. **Slots are stable**: `width` and `height` or `aspect-ratio` on every image slot; `object-position` set from the focal point; the hero image is an `<img>`, not lazy loaded.
10. **Imagery cannot outrank the primary action.** Blur the screenshot: the headline and the action still win.

## 2. The method (in order)
1. **Find the fact.** What is true, specific and drawable about this brand: origin, material, process, a measurement, the product's own output? Mood words ("warm", "premium") are not a concept. Positioning comes from website-strategy.
2. **Write the concept as one sentence with a drawable noun.** "Every bag shows the hill it grew on and the fire that finished it." Then the **reject test**: one line a stranger could use to throw an image out.
3. **Pick 3 to 5 motifs**, each tied to a fact, and **one loud element** in the brand accent; everything else in neutral line work.
4. **Map to tokens** before drawing: `--color-illustration-line`, `--color-illustration-accent`, `--color-illustration-surface`, one stroke width, the radius family. Dark mode remaps them.
5. **Place it**: hero, at least one mid-page section, and one small surface (footer, empty state, 404, OG image). Ban imagery from forms, pricing and checkout. The hero placement is a drawn thing in the first screen at 1440 and 390, not the concept named in the headline: hide the logo and reject the hero if the page could be anyone's (design-playbook-landing `references/signature-moves.md`, reject test; round 1's crossing motif lived only in copy and a below-fold chart, `kb/reviews/benchmark-round1-landing.md` item 11).
6. **Choose the medium per slot** (table below), build, then run the consistency audit and the worst-pixel check.
7. **Hand over** the list of drawn stand-ins and the photo request with exact specs (`references/05`).

## 3. Decision rules
### Which medium
| You have | Make |
|---|---|
| Numbers the brand owns (altitude, temperature, counts, time series) | Data-driven art: contours, curves, sparklines (`assets/contours.mjs`, recipes in `references/04`) |
| A physical product of known shape | SVG drawing at full fidelity, real proportions, live HTML label |
| Software | The UI itself in HTML with real data (Stripe, Linear) |
| A material (paper, wood, fabric) | Procedural texture: `feTurbulence` grain, SVG `<pattern>` |
| An abstract process | A diagram in the icon set's stroke |
| A real photo is needed, none available | An honest slot plus a photo request; never a fake photo |
| Nothing informative | Display type, no image |
| An image generation tool | Concepts, moodboards, textures only; never final people, product or place shown as real (design-graphic 03) |

### Text over images, in order of preference
1. Beside the image (split layout). 2. On planned, measured calm space. 3. On an opaque panel (16 to 24px padding). 4. Scrim (60 to 75 percent to 0) with a forced-colors `background-color: Canvas` fallback. 5. Halo or shadow, last resort.
**Texture under text moves away from the text color**: lighter lines under dark text, darker under light text, at about 1.1 to 1.3:1 against the surface. Then it can only raise contrast.

### Photos
- Reject anything a competitor could use unchanged, or that fails the reject test.
- Crop per breakpoint (16:9 or 3:2 desktop, 4:5 phone, 1:1 or 4:3 cards); `<picture>` when the subject's scale changes, `object-position` when only the window moves.
- Mixed sources: unify with monochrome or duotone (`assets/duotone_matrix.py`); never duotone the product itself when its color matters.
- Faces and lines point into the page, toward the copy (gaze cueing is measured; the rule of thirds barely predicts preference).

### Product UI (dashboards and apps)
Imagery only where it carries a number or a state: sparklines beside KPIs, empty states drawn from chart parts, skeletons that mirror the real layout. No characters, stock or decorative gradients inside a working screen (Atlassian: decorative illustration does not belong in product).

## 4. Expert moves (what a top studio does that a generalist misses)
1. **Concept from a true fact, not a mood.** A fact is ownable because competitors do not share it.
2. **The data is the illustration.** Draw the brand's own numbers: nobody else can.
3. **Seed generated art with an ID the brand already has** (lot number, order ID). Every product gets its own deterministic art, identical on every render.
4. **Motif, not picture.** Repeat a drawable element across sizes (hero, 64px thumbnail, favicon), not the same image.
5. **SVG for the drawing, HTML for the words.** `preserveAspectRatio="none"` plus `vector-effect: non-scaling-stroke` for lines; labels positioned in percentages as HTML stay on the type scale at every width. Every label beside a line gets a solid backplate: at some width the line passes behind it (the test page measured 1.74:1 before the fix, and axe only said "needs review").
6. **One loud stroke.** The single element carrying the main fact is in the brand accent; all else is neutral line work.
7. **Annotate like a survey map or a lab notebook**: tabular figures, units, hairline leaders. Annotation turns a drawing into evidence.
8. **Compose the image for the type.** Decide where the headline sits, then crop or draw so that area is calm.
9. **Design the set, then the image.** Thumbnail every slot side by side, light and dark, before refining one.
10. **Unify with treatment, then break it once.** One full-color element in a quiet set becomes the site's focal point.
11. **The concept reaches the small surfaces**: footer, empty state, 404, OG image. That is where template sites go generic.
12. **Write the alt text when you write the photo request**, and name the empty third where the headline will sit.
13. **Draw once, use twice.** One map in `<defs>`, placed as ground and again clipped inside the object (`<use>` with stroke set on the use), so the picture runs across the object's edge at half the weight.
14. **Word-sized graphics get a container query.** A sparkline beside a big number collides in narrow tiles, and lint cannot see SVG over text; stack it below about 240px of tile width.
15. **Print the live label onto the product photo.** Shoot (or generate) the package with a blank label, measure the label's box in the master, record where it lands in each crop in percent, and position live HTML (name, lot number, roast date, a data curve) over it. The words on the product stay real data that cannot go stale, translate and stay selectable, and one photo serves every lot. The round 3 critic, from a clean context, named it the single most non-obvious move on either test page (`kb/reviews/round3-critic.md` section 4; recipe in the `kb/tests/round3/photos.py` docstring, label box x 725 to 918, y 364 to 618 of a 1264x848 master). Limits: set the label in the frame's own aspect ratio (no `object-fit` crop, or the percentages drift); a flat label on a curved pouch reads at a glance but not at a zoom, so add the pouch's curve and shading or keep the crop small (the builder's own named gap, `kb/tests/round3.md`); and the real photo shoot still replaces the stand-in.

## 5. Numbers
| Item | Default |
|---|---|
| Motifs | 3 to 5; one loud element (opinion) |
| Text on image | 4.5:1 body, 3:1 large, worst pixel |
| Texture contrast vs its surface | about 1.1 to 1.3:1 (opinion) |
| Line art | 1 to 1.5px at 1x; 2px beside 2px icons |
| Grain | `fractalNoise`, baseFrequency 0.6 to 0.9, numOctaves 3, opacity 0.05 to 0.12 |
| Sparkline | 64 to 96 x 24 to 32px, 1.5 to 2px line, end dot |
| Inline SVG budget | about 150 KB per page, 60 KB per piece (opinion) |
| Photo minimums | CSS width x 2 desktop, x 3 phone; product 2048 square; hero 3000+ px long edge |
| `object-position` default | 50% 50% (set it from the focal point) |

## 6. Assets (all run and checked)
| Script | Use |
|---|---|
| `node assets/contours.mjs --seed 412 --w 480 --h 600 --levels 14 --peaks "0.62,0.38,1" --noise 0.35 [--full]` | Seeded topographic contour paths (value noise plus marching squares, Chaikin smoothed). Same args, same SVG. Peaks are x,y,height in 0 to 1. |
| `python3 assets/overlay_contrast.py shot.png --box X Y W H --text "#1b1917" --min 4.5` | Worst-pixel, 1st percentile and failing share for text over imagery (F83, G18). Exit 1 on fail. Render with the text transparent, or pass `--exclude-near 2.0`. |
| `python3 assets/duotone_matrix.py "#27201a" "#f9f6f4"` | SVG `feColorMatrix` duotone between two brand colors, for unifying mixed photos. |
| `node kb/tests/design-art-direction/overlay-check.mjs page.html ".section" 1440 light` (design-kb repo) | Renders the page, hides the text inside the selector, and runs the worst-pixel check on every text box. Run at 390 and 1440, light and dark. |

## 7. Reference map
| Read | When |
|---|---|
| `references/01-concept-and-consistency.md` | Finding the concept, motifs, tokens, the consistency audit, worked examples for a product brand and a SaaS app |
| `references/02-photography.md` | Accepting, cropping, treating and sequencing photos; duotone and focal-point recipes |
| `references/03-composition-and-overlays.md` | Focal point, gaze, rule-of-thirds evidence, text over images, forced colors, the worst-pixel check |
| `references/04-visuals-without-image-hosts.md` | Contours, data curves, sparklines, grain, patterns, flow fields, CSS objects, honest slots, budgets |
| `references/05-requesting-photography.md` | Exact photo specs, the copy-paste request, the slot contract code |

## 8. Related skills
design-graphic (logos, icons, illustration style spec, shot briefs, social graphics, export), design-color (illustration tokens, contrast math), design-layout (hero and section composition), design-typography (annotation type, display type when there is no image), design-motion (if motifs move), design-frontend (image delivery, LCP, inline vs external SVG), dataviz (any chart a user reads values from), website-strategy (the facts and positioning the concept is built on).
