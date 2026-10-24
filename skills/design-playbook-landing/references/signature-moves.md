# Landing pages: closest exemplars and signature moves

**Status of this file: opinion, now checked against the teardowns.** The moves were first written from knowledge of the public sites while every exemplar host was blocked (2026-10-09, `kb/exemplars.md`); the measured values now live in `kb/teardowns/` (`INDEX.md`), which win where they differ. Token values here are our translation, not the exemplar's own numbers.

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

## The first-screen reject test (run it on the 1440 and 390 renders)
Hide the logo and the brand name. Can you still tell whose page it is from the first screen alone? Reject the hero unless the page's motif (the concept the art direction named) is **visible and drawn** in that first screen: a mark, a picture, a data drawing or the product carrying the idea, not only a word in the headline. Round 1's concept, "every picture is a crossing", lived in the copy and in a chart below the fold; with the logo hidden the hero was a generic serif fintech table, rated clearly below (`kb/reviews/benchmark-round1-landing.md` scorecard Imagery, item 11). Exemplars pass at a glance: Stripe's gradient carried into every card, Linear's full-width live product (`kb/teardowns/INDEX.md` section 3). On a phone the motif may crop or shrink, never disappear.

## Where pages fall short (from the color pilot)
The pilot's coffee page passed the gate and still rated clearly below the exemplars: no real imagery (a CSS bag stood in), a fallback serif instead of a chosen face, no signature layout move, no motion (`kb/tests/design-color.md`). Moves 1, 2 and 8 are the ones to check first.
