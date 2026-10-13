---
name: design-art-direction
description: Domain reference loaded by design-director or a design playbook (design-playbook-landing, -dashboard, -mobile, -brand); do not trigger on its own for a page, screen or brand job. Covers the visual plan every marketing page writes before code (a visual with a job on 70% of screens at 1440 and 390, one stated treatment, a set of three or more product fragments on a product page) and its check, the page-level visual concept, building product mock-ups in HTML, picking, cropping and grading photography, composition and focal point, accessible text over images, keeping an image set consistent, making photography-grade visuals from code when image hosts are blocked, and requesting photos with exact specs. Load it directly only for a narrow question inside this domain ("how do I put text on this photo", "how many mock-ups does this page need"). Logos, icons and social graphics are design-graphic; motion inside mock-ups is design-motion.
---

# design-art-direction

> **Layer: domain reference.** Loaded after `design-foundations` by `design-director` or a `design-playbook-*` skill. Accessibility floor: design-foundations `references/accessibility.md`. Builds on design-graphic `references/03-photography-direction.md` and `04-illustration.md`; does not repeat them. Owner of the FOUNDATIONS v0.5 **visual plan** standard.

Design arranges a page. Art direction decides what the page shows, on every screen, and makes all of it look like one hand made it. The benchmark builders followed the earlier version of this skill and shipped a correct page with **one product card on one screen in seven**, where Stripe shows the product on **14 of 17 screens with about 12 HTML mock-ups** and Linear on **10 of 12** (`kb/teardowns/motion-imagery.md` section 1; `kb/reviews/benchmark-round2-landing.md` gap 8, "product shown once, static"). This version makes that gap impossible to miss: fundamentals, then a written visual plan, then a check that fails the page.

## 1. Fundamentals (non-negotiable, check first)
One miss fails the page, however good the pictures are.
1. **Truthful imagery.** Never present a drawing, render, stock or AI image as a real photo, customer, place or product. Draw openly as drawing; caption a render as a render. [judged]
2. **No fake logos, no fake people as real.** No invented customer logos in a proof row, no stock or generated faces as customers, staff or testimonials (design-graphic 03). A sample customer is named as sample. [judged]
3. **Sample data is labelled and foots.** Every mock-up figure's caption says "Sample data" (or the page says it once, visibly, beside the first figure); every total adds up from the figures **as displayed, at their displayed precision**; weekdays match their dates. The benchmark's hero total was $0.69 off its own rows (`kb/reviews/benchmark-round2-landing.md` gate 16). [judged; `claims_inventory.mjs`]
4. **Text over any image, texture or gradient passes 4.5:1 (3:1 large) at the worst pixel** behind each letter, light and dark, 390 and 1440 (WCAG F83, G18). [lint `overlay`; `assets/overlay_contrast.py` where the lint cannot isolate the text]
5. **Every visual is named or hidden.** Informative `img`: alt that says what it shows in context. Meaningful SVG: `role="img"` plus a label. Mock-ups and texture: `aria-hidden="true"`, with their facts in live page text or a visible `figcaption`. [lint axe for img; `visual-plan-check` warns `naming`]
6. **Mock-up text is decoration; the content is in the page.** The facts a fragment shows (the total, the date, the feature) are also in the section's heading or copy, so nothing depends on 9px text. [judged]
7. **Overlays survive forced colors**: text on imagery sits on something opaque or on measured calm space; scrims and `text-shadow` are removed there. [judged]
8. **Slots are stable**: `width` and `height` or `aspect-ratio` on every image slot and every mock-up stage; hero image an `<img>`, never lazy. [judged]
9. **Imagery never outranks the primary action**: blur the screenshot, the headline and the action still win. A mock-up's fake button is a `div`, never a second filled control. [lint `primary`; judged]
10. **The visual plan is written and passes** (section 2): visual on 70% of counted slices at 1440 and at 390, three or more fragments on a product page, none dropped on the phone, one treatment. [`assets/visual-plan-check.mjs`, exit 0]

## 2. The visual plan (write it before any code)
A table in the build notes, filled before the first line of HTML. Rows are screen-height slices: 900px tall at 1440, 844px at 390 (the probe's slices).

| Slice | 1440: visual | Job (proves, shows, explains, orients) | Kind | 390: crop |
|---|---|---|---|---|
| 1 | App window, invoice INV-0142, payment card overlapping its sidebar | proves the core promise | product | scale 0.6, crop to the invoice column; sidebar falls out |
| ... | | | product, photo, illustration, chart, or **type beat: name** | |

Then three lines under the table:
- **Treatment** (one, stated as tokens): which fill, chrome, grade or line weight every visual shares, for example `--visual-treatment: echo-fill` with `--visual-fill` (the hero fill), one shell (`--radius-lg`, `--elevation-fragment`) and one caption style.
- **Fragment set** (product pages): at least three distinct fragments at different scales or crops, each showing the feature its section names, all cut from **one dataset** that foots across them.
- **Type-only beats**: which slices carry no picture, by name ("pricing", "quote"). Mark the section `data-beat="type" data-beat-name="pricing"`. Beats past 30% of the slices are not excused: a page that type-led follows design-typography reference 07 instead.

Label every visual in the HTML: `data-visual="product|photo|illustration|chart"` on the window that crops it (the stage), not on the shell inside it. Run the check at 1440 and 390:
`node skills/design-art-direction/assets/visual-plan-check.mjs page.html [--product]`
It fails under 70% coverage at either width, under three product fragments on `<body data-page="product">`, and when the phone shows fewer fragments than the desktop minus one. Benchmark Ferry fails it (17% and 13% coverage, 0 labelled fragments); the fixture `assets/fixtures/visual-plan-good.html` passes (100% at both widths, 7 fragments at both). Worked plan and code: `references/06-product-fragments-and-visual-plans.md`.

## 3. Decision rules
### Which medium per slice
| You have | Make |
|---|---|
| Software | **Fragments** of the real UI in HTML with plausible data (Stripe, Linear, Framer); one per feature section (reference 06) |
| A physical product of known shape | Photography (02); with no photos, a rendered object at full fidelity with one light (06 section 6, 04 recipe 7) |
| Numbers the brand owns | Data-driven art: contours, curves, sparklines (`assets/contours.mjs`, 04); a chart a user reads goes through dataviz |
| A material | Procedural texture: `feTurbulence` grain, SVG pattern (04) |
| An abstract idea (principles, values) | Line figures in one stroke weight with mono figure captions (Linear's FIG 0.1 to 0.3 wireframes) |
| A real photo needed, none available | An honest slot plus a photo request (05); never a fake photo |
| Nothing to show on purpose | A named type-only beat |

### Fragments
- **If a section names a verb, its fragment shows that verb mid-action**, not the product's home screen: "Quote with options" shows the selected option, "Match deposits" shows the matched row.
- **If a section has two facts, layer two fragments**: the back one gives context, the front one carries the number, and it covers only the back one's chrome or secondary column.
- **If the fragment is wider than the phone, crop and scale, never drop**: scale 0.6 to 0.8 with `transform`, then position so the meaningful region stays inside the stage (section 4, move 4).
- **If a fragment needs more than 12 rows to read, it is a screenshot, not a fragment**: cut to the 3 to 6 rows the section is about.

### Photography (when photos are used)
- **One grade, one light direction, one background tone per set.** Apple: one lighting setup and one background tone per section; Mercury: one warm desaturated grade across 16 photos (`kb/teardowns/motion-imagery.md` section 3). Write the three into the treatment line.
- Crop per breakpoint (16:9 or 3:2 desktop, 4:5 phone, 1:1 or 4:3 cards); `object-position` from the focal point. Mixed sources: monochrome or duotone (`assets/duotone_matrix.py`), never on the product itself (02).
- Faces and lines point into the page, toward the copy (03).

### Text over images, in order
Beside the image; on measured calm space; on an opaque panel (`--space-5` to `--space-6` padding); a scrim with a forced-colors fallback; a halo last (03).

### Product UI (dashboards and apps)
Imagery only where it carries a number or a state: sparklines beside KPIs, empty states drawn from chart parts, skeletons that mirror the layout. The visual plan applies to marketing pages, not working screens.

## 4. Expert moves (from the measurements; what a strong generalist misses)
1. **Echo the hero fill behind every fragment.** Stripe spends its whole color budget on one gradient and reuses it as the stage of every product card, entering from a corner, so twelve different mock-ups read as one family (`kb/teardowns/stripe-home.md`, Color; shot `stripe-home-1440-light.jpg`). Define it once (`--visual-fill`), never redraw it per card.
2. **One shell, one shadow, one caption.** Same radius, same ring, same below-only stacked shadow on every fragment: each layer's negative spread equals its y offset, so the shadow shows only underneath (Stripe `0 30px 45px -30px` plus `0 18px 36px -18px`, `stripe-home.md`). As tokens: `--elevation-fragment: var(--ring), 0 32px 48px -32px rgb(var(--shadow-rgb) / 0.25), 0 16px 32px -16px rgb(var(--shadow-rgb) / 0.10)`; dark themes swap it for `var(--ring), var(--highlight)` (FOUNDATIONS elevation rule).
3. **Mock-up text is set small and stays on the scale.** Exemplars render it at 9 to 12px (Stripe), 10 to 13px (Framer) as `aria-hidden` decoration. Set it at `--text-xs` (12px) and let the fragment's `transform: scale()` take it to about 7 to 9px on the phone (0.6 to 0.72): the lint reads the computed 12px, the eye sees a product, and the facts live in the section copy.
4. **Crop, do not drop, at 390.** Stripe's phone page has **more** mock-ups (14) than its desktop (12) and a higher median cover (81%); the bento stacks to one column and every card keeps its fragment (`motion-imagery.md` section 1; shot `stripe-home-390-light.jpg`). Keep the fragment at its desktop width, scale it 0.6 to 0.8 from the top left, and move it so the totals, the selected row or the matched line sit inside the stage; chrome and secondary columns fall off the edge.
5. **Layer two fragments; the front one covers chrome, never data.** Stripe's "Daybreak Yoga" order card overlaps the Connected Accounts window by about 150px at 1440 and covers only its sidebar; the table stays whole (measured on `stripe-home-1440-light.jpg` for this skill). Linear's agent panel sits over the issue view's right rail (`linear-home-1440-light.jpg`). Overlap by at least `--space-6` (24px) so it reads as deliberate, and at most the width of the back fragment's chrome (opinion).
6. **Let the back fragment bleed; the front one carries the number.** Stripe's checkout window runs off its card's right edge with its order-summary amounts cut ("$150."), because the terminal in front shows a complete, footing total ($5.50 minus $0.55 plus $0.51 tax is $5.46, same shot). A cut number is acceptable only when another fragment in the frame states it whole (opinion from that shot).
7. **One dataset runs through every fragment.** The quote accepted in one card is the invoice in the next and the deposit matched in the last; a reader who checks one number finds it again, adding up, three screens later. Stripe's figures are specific and plausible ("Daybreak Yoga", "$999.00 /year"; `stripe-home.md`); the benchmark's were true per card and false across the page.
8. **The fragment shows the section's verb.** Stripe's bento titles are verbs ("Accept and optimize payments", "Enable any billing model", "Embed payments in your platform") and each fragment acts that verb out (checkout, usage meter, connected accounts). A generic dashboard repeated under every heading is one fragment shown five times.
9. **One figure-caption system.** Linear numbers its figures in mono ("FIG 0.1", "FIG 0.2", "FIG 0.3") above wireframe figures (`linear-home.md`, Layout). A numbered mono caption makes mock-ups read as evidence, carries the "Sample data" label at no extra cost, and gives an `aria-hidden` fragment its accessible description.
10. **Different scales, same family.** The fragment set mixes one full window (hero), mid crops (bento) and one small object (a notification, a card): scale variety is what makes twelve mock-ups feel designed rather than tiled (opinion, from Stripe's terminal, checkout, card and table mix).
11. **Photography-grade without a photo host: render, do not imitate.** A rendered object (card, device, package) gets one light direction stated once (`--light-angle`), a contact plus ambient below-only shadow, a 1px top highlight, 5 to 12% grain, and one background tone per section; captioned as a render. Stripe's issuing card is a gradient render, not a photograph (`stripe-home-1440-light.jpg`). Recipe in 06 section 6.
12. **Name the type-only beat.** Pricing, a pull quote or a manifesto line may carry no picture, on purpose: write it in the plan, mark it `data-beat="type"`, and make the type the picture (`--text-display`). Vercel's 5 of 7 is the floor among the exemplars (`motion-imagery.md`).
13. **Concept from a true fact, not a mood**, reaching the small surfaces (footer, 404, OG image); the data is the illustration when the brand owns numbers; seed generated art with an ID the brand already has (01, 04).
14. **Print the live label onto the product photo**: measure the label box in the master and position live HTML over it in percent, so one photo serves every lot (`kb/reviews/round3-critic.md` section 4; recipe in 04 and the `kb/tests/round3/photos.py` docstring).
15. **Compose the image for the type** and **texture moves away from the text color** (lighter lines under dark text), so art never costs contrast (03).

## 5. Numbers
| Item | Default | Source |
|---|---|---|
| Screens with a visual (15%+ cover) | 70% of counted slices at 1440 and 390 | FOUNDATIONS v0.5; Stripe 14 of 17, Linear 10 of 12, Framer 12 of 12, Vercel 5 of 7 |
| Product fragments, product page | 3 or more, different scales or crops; phone keeps all but at most 1 | FOUNDATIONS v0.5; Stripe 12 (14 at 390), Linear 5 (4 at 390) |
| Type-only beats excused | named, at most 30% of slices | this skill (opinion) |
| Mock-up text | set at `--text-xs` 12px; rendered 9 to 12px | Stripe 9 to 12px, Framer 10 to 13px |
| Phone fragment scale | 0.6 to 0.8 via `transform` | this skill (opinion); fixture uses 0.72 and 0.6 |
| Fragment overlap | `--space-6` (24px) up to the back fragment's chrome width | Stripe about 150px over a sidebar (opinion on the floor) |
| Fragment shadow | below-only: negative spread equals y offset, alpha 0.25 or under, `--shadow-rgb` tint | Stripe; FOUNDATIONS shadow recipe |
| Fragment rows | 3 to 6 meaningful rows | opinion |
| Text on image | 4.5:1 body, 3:1 large, worst pixel | WCAG F83, G18 |
| Grain | `fractalNoise` 0.6 to 0.9, 3 octaves, opacity 0.05 to 0.12 | 04 (opinion) |
| Motifs | 3 to 5, one loud element | 01 (opinion) |
| Inline SVG | about 150 KB per page, 60 KB per piece | 04 (opinion) |

## 6. Assets (all run and checked)
| Script | Use |
|---|---|
| `node assets/visual-plan-check.mjs page.html [--product] [--keep dir] [--json out]` | Runs `kb/teardowns/choreo-probe.mjs` at 1440 and 390 plus a page read; fails coverage under 70%, fragments under 3 on a product page, fragments dropped at 390; warns on mixed treatment, unnamed visuals, unnamed beats. Needs the design-kb repo and `cd tools && npm ci`. About 20 seconds. |
| `assets/fixtures/visual-plan-good.html` | A passing sample product page: plan, treatment tokens, seven fragments from one dataset, 390 crops, one chart, one type beat. Passes `tools/lint.mjs`. |
| `node assets/contours.mjs --seed 412 ...` | Seeded topographic contour paths (04). |
| `python3 assets/overlay_contrast.py shot.png --box X Y W H --text "#1b1917" --min 4.5` | Worst-pixel contrast for text over imagery. |
| `python3 assets/duotone_matrix.py "#27201a" "#f9f6f4"` | SVG duotone between two brand colors. |

## 7. Reference map
| Read | When |
|---|---|
| `references/06-product-fragments-and-visual-plans.md` | **Every marketing page.** The plan table worked end to end, the fragment family in HTML and CSS, the 390 crops, layering, captions, renders without a photo host |
| `references/01-concept-and-consistency.md` | Finding the concept, motifs, the consistency audit |
| `references/02-photography.md` | Accepting, cropping, grading and sequencing photos |
| `references/03-composition-and-overlays.md` | Focal point, gaze, text over images, forced colors, the worst-pixel check |
| `references/04-visuals-without-image-hosts.md` | Contours, data curves, sparklines, grain, patterns, CSS objects, honest slots |
| `references/05-requesting-photography.md` | Exact photo specs, the request, the slot contract |

## 8. Hand-offs
- **design-motion**: a fragment that acts out a state change is a product scene (FOUNDATIONS v0.5: beats 1.2 to 4.5s, holds of 1s, loop of 12s or less, still frame under reduced motion). The still frame must be the plan's frame: pick the frame that shows the section's verb, and make that the reduced-motion state.
- **design-copy**: fragment data foots and matches the section copy; captions follow content mechanics (dates, no breaks inside "Oct&nbsp;13").
- **design-layout**: stage heights, bento grid and column starts; the fragment never sets the grid.
- **design-color**: the echoed fill and illustration tokens in both themes; bars and meaningful marks at 3:1.
- **design-graphic**: logos, icons, social graphics, illustration spec. **dataviz**: any chart a user reads values from. **website-strategy**: the facts the concept is built on.
