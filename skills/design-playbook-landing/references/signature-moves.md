# Landing pages: closest exemplars and signature moves

**Status of this file: opinion, unmeasured.** The moves below come from the judge's knowledge of the public sites, not from measured CSS: every exemplar host was blocked from this environment on 2026-10-09 (see `kb/exemplars.md`). Each move gets confirmed or corrected by a teardown in `kb/teardowns/`; until then, treat the token values as our recommended translation, not as the exemplar's own numbers.

## Pick the closest exemplar
| Site type | Compare against |
|---|---|
| Developer or SaaS product | linear.app, vercel.com, raycast.com |
| Fintech, payments, B2B trust | stripe.com, mercury.com, ramp.com |
| Consumer product or app | apple.com product pages, cash.app, family.co |
| Physical product, food and drink, warm consumer brand | apple.com product pages for product presentation; family.co and mercury.com for warmth and restraint |
| Studio, service or agency | designjoy.co, pitch.com, framer.com |
| Editorial or brand-led | teenage.engineering, nytimes.com feature stories |

Name two in the brief and compare against both.

## Moves the marketing exemplars share
1. **The product is the hero image.** Linear, Vercel, Raycast, Stripe and Apple lead with the real product (UI, device or object), shown large and sharp, not a stock photo or abstract blob. When photos are blocked or missing, use this fallback order (design-art-direction `references/04-visuals-without-image-hosts.md`): first, data-driven art made from the brand's own numbers (a roast curve, a contour map of the farm, a usage chart); second, the product drawn at full fidelity in HTML, CSS or SVG; never a gradient blob or a vague illustration. Then request real photography (design-art-direction `references/05-requesting-photography.md`).
2. **Display type set big and tight.** Headlines at the top of the scale (`--text-4xl` to `--text-5xl`, fluid with `clamp()`), line height near `--leading-tight` (1.1) or below for one or two lines, slight negative tracking at display sizes. When type carries the page: one display line at 49 to 112px with leading 0.95 and the optical margin corrected (design-typography `references/07-type-led-pages.md`); `--text-display` in FOUNDATIONS. Body stays at `--text-base` or `--text-lg`. The size jump between headline and body is large; middle sizes are rare.
3. **Short headline, specific subhead.** Headline under about eight words; the subhead carries the concrete what and for whom, set to a narrow measure (about 52ch or less) and centered or left aligned to the headline's edge.
4. **Neutrals carry the page; color is a moment.** A near-neutral page with one accent used for the primary action and one or two moments of emphasis (Linear, Vercel, Mercury). Color richness comes from the product imagery, not from the UI chrome.
5. **Hairlines over heavy shadows.** 1px borders at low contrast and subtle surface steps separate content; shadows are soft and rare. One radius family throughout.
6. **Generous, regular section rhythm.** Section padding at the top of the space scale (`--space-10` 96 or `--space-11` 128 on desktop, `--space-8` 48 to `--space-9` 64 on phones), identical between sections so the page breathes evenly.
7. **Proof right under the hero.** A quiet logo row or one hard number directly after the first screen (Stripe, Ramp, Vercel), then specific numbers inside feature sections instead of adjectives.
8. **One idea per section, alternating density.** A dense feature grid is followed by a single large statement or visual; the eye gets a rest every screen.
9. **Real data in every mockup.** Names, prices, dates and numbers that look true, with tabular numerals; no "Lorem" or "$XX".
10. **Motion that explains, not decorates.** Small, fast reveals tied to the product (a cursor, a state change), all removed under reduced motion.
11. **One section shape, repeated.** The same header pattern (label carrying a fact, H2, one short paragraph, one picture) in every section, so the eye learns the page once; vary the picture, not the frame (Scrolltide catalogue, captured 2026-10-23; `references/build-spec.md`).
12. **Build proof as a series, not a one-off.** A client story is one entry in a set: a tab row of faces and names, one story shape (cut-out client in front of a row of photos of their home, their words beside them), and the same slots every time, so the client can add the next story without a redesign. Size each cut-out by its own aspect (a custom property per story) so a seated video frame and a standing studio portrait sit at the same visual weight. Let the cut-out's column size to the image (`grid-template-columns: auto 1fr`) and give the image `max-inline-size: none`: a fixed column plus the usual `img { max-inline-size: 100% }` reset squeezes a height-sized cut-out sideways, and the lint does not catch it (Davon spotted it on the VGC page). In a tab pill with a round avatar, the inset beside the avatar must equal the inset above it, so the circle sits concentric in the pill's end. Source: Davon's correction on the VGC C page, Oct 2026.
13. **Fold the founder into the team, do not bolt them on.** A wide founder photo under a grid of headshots reads as a separate section. Make the founder the first card, spanning two columns at the same image height as the headshots, number the people in the order a client meets them, and close the grid with the first step as a call to action card. Source: Davon's correction on the VGC C page, Oct 2026.
14. **Borrow authority with the endorser's face, words and rules.** For a third-party endorsement (a TV host's approval program), show the endorser in a photo with the founder, quote the endorser's own words about why the program exists, list what the program actually checks from its published rules, and link to the public listing so anyone can verify it. Put it right after the hero, echo the seal once in the hero, and never imply the endorser inspected the work personally when a program did. Source: VGC C page, Oct 2026; baeumlerapproved.ca/about.
15. **Show the process as its stages, each with its owner.** In a how-it-works block for a made thing, picture each step as the work looks at that stage (drawn, rendered, built), name the person who owns the step with a face and one line in their words, and line the parts up across the columns with `grid-template-rows: subgrid` so the pictures, names and quotes sit on shared edges. This also absorbs a separate team section, so the people appear where the visitor asks "who does this?". Label every stand-in picture (a traced sketch, a render of another project). Source: VGC C page, 8-beat version, Oct 2026.

## Where pages fall short (from the color pilot)
The pilot's coffee page passed the gate and still rated clearly below the exemplars: no real imagery (a CSS bag stood in), a fallback serif instead of a chosen face, no signature layout move, no motion (`kb/tests/design-color.md`). Moves 1, 2 and 8 are the ones to check first.
