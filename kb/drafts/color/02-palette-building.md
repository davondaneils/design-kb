# Palette building and harmony

From one brand color (or none) to a complete, tested palette. Sources: `kb/research/color/02-palette-building.md`. Tool: `skills/design-color/assets/oklch_scale.py`.

## Fundamentals (non-negotiable)
1. **Neutrals carry the interface.** Most pixels are background, surface, border and text. Build 11 neutral steps before you touch the brand color. Refactoring UI asks for 8 to 10 grays as a minimum.
2. **One primary, a few semantic hues.** Primary (brand and main action), plus danger, warning, success, and optionally info. Extra decorative hues need a job or they go.
3. **Define every step up front.** Do not generate shades on the fly with lighten/darken (Refactoring UI). A fixed scale is what makes a system consistent.
4. **Same step number means same lightness in every hue.** Then `red-600`, `green-600` and `blue-600` pass the same contrast tests and look like one family.
5. **Each step has a job** (backgrounds, borders, fills, text). A step with no job is noise.
6. **Every text and UI pairing is verified with a contrast checker** before hand-off (see 03).

## The lightness ladder (contrast-locked)
Derived and tested across every hue and chroma up to 0.26 (research 02). The hex values will differ by hue; the guarantees will not.

| Step | OKLCH L | Chroma share of max | Main job |
|---|---|---|---|
| 50 | 0.975 | 12% | app background tint, subtle section |
| 100 | 0.935 | 28% | subtle fills, selected row, badge bg |
| 200 | 0.88 | 50% | hover fill, subtle borders on tint |
| 300 | 0.81 | 75% | borders and dividers on white; dark mode accent and link text |
| 400 | 0.72 | 95% | dark mode icons, fills and large accent text |
| 500 | 0.635 | 100% | fills, icons, focus rings, large text on white |
| 600 | 0.53 | 100% | **solid buttons with white text; links and body accent text on white** |
| 700 | 0.46 | 92% | hover for 600; text on 100 tints |
| 800 | 0.39 | 80% | pressed; strong text |
| 900 | 0.32 | 65% | headings on tints; dark mode tinted surfaces |
| 950 | 0.25 | 50% | dark mode surfaces and deepest text |

**Guarantees (worst case, any hue):**
| Pair | Min ratio | Good for |
|---|---|---|
| 600 on white, white on 600 | 4.94:1 | body text, button labels |
| 600 on 50 | 4.64:1 | text on tinted sections |
| 700 on 100 | 5.58:1 | badge and alert text |
| 800 on 200 | 6.5:1 | strong text on hover fills |
| 500 on white | 3.19:1 | icons, borders, focus rings, large text only |
| 400 on 950, 300 on 900 | 5.93:1, 6.92:1 | dark mode text (WCAG). For small accent text in dark mode prefer 300 or lighter: APCA rates 400 on near-black only about Lc 53 |

Rule of thumb from the table: **five steps apart passes body text; four steps apart passes 3:1 for UI** (50 to 600, 100 to 700, 200 to 800, 400 to 950). Stripe reached the same "five levels apart" rule independently (2019).

**Chroma shape:** chroma peaks at 500 to 600 and falls toward both ends. Light tints with full chroma look neon; dark shades with full chroma fall out of gamut. Strom-Awn uses the same inverted curve.

**Max chroma by personality** (our opinion, starting points): calm or premium 0.08 to 0.13; standard product 0.14 to 0.20; loud consumer 0.20 to 0.26. Neutrals 0.005 to 0.02.

## Decision rules
- **If the client has a brand color:** convert it to OKLCH. Use its hue (and chroma as the max) to generate the scale. Then keep the exact brand color as its own `--color-brand` primitive for logo and marketing moments. Do not force it into the ladder, and do not move the ladder to fit it.
- **If the brand color's L is above 0.65:** it cannot be text or a white-label button on white. Use it as a fill with dark text (black or the 950 step), and use the 600 or 700 step for text and links.
- **If the brand color's L is between 0.56 and 0.65:** it is a fill and icon color. White text on it usually fails at body size (the pass line is L 0.55 to 0.595 depending on hue), so check. Either use dark text, set the label as large text (`--text-xl`, 25px, or `--text-lg`, 20px, bold; 3:1 applies), or use the 600 step for buttons and keep the brand color for larger moments.
- **If the brand color is between L 0.65 and 0.75 and you put dark labels on it:** WCAG passes (often 5 to 7:1), but APCA scores only about Lc 45 to 50, so the label reads weaker than the ratio suggests. Use 20px bold labels or larger on that fill, or the 600 step with white for small buttons. (Measured: near-black on `#F26B21` is 5.26:1 and Lc 45.)
- **Leave margin:** aim for 5:1 or more on text you control; 4.51:1 breaks under hover tints and thin weights.
- **If there is no brand color:** pick hue by category fit and ownability (see 05), then max chroma by personality.
- **If two semantic hues collide with the brand** (brand is red, danger is red): shift danger toward crimson or orange-red by at least 20 degrees of hue, add an icon, and never use brand red for errors. Apple: one color must not mean two things.
- **Neutrals:** tint toward the primary hue (same hue, chroma 0.005 to 0.015), or toward warm (hue 60 to 80) for an editorial, paper feel. Pure zero chroma gray reads as "unstyled" (our opinion).
- **Harmony schemes** are idea starters, not rules: monochrome (one hue, safest for UI), analogous (neighbors within about 30 to 60 degrees, calm), complementary (opposite, high energy, use one as a small accent), split complementary, triadic (hard to keep calm in UI). In product UI the scheme matters less than lightness structure (our opinion).
- **Proportion:** 60-30-10 (dominant, secondary, accent) is an interior design heuristic with no research behind it. In UI the honest version is: neutrals cover most of the screen, the primary marks interactive and key moments, accents are rare. If everything is colored, nothing is.

## Expert moves
- **The 500 is not your button.** Tailwind's blue-500 with white text is about 3.7:1 (3.68:1 for v3's `#3b82f6`) and fails body text. Most scales put the "pure" brand color at 500; button fills that carry 14 to 16px white labels belong at 600.
- **Hue drift at the ends.** Rotate dark shades a few degrees toward a neighbor so they do not go muddy: yellows toward orange (lower hue) as they darken, so dark yellow reads as gold or bronze rather than olive; blues toward violet (Tailwind's blue drifts about 13 degrees from 50 to 950). Strom-Awn uses 5 degrees across the scale. Use `--shift` in the script.
- **Tinted text on tinted backgrounds.** On a blue-100 alert, use blue-800 text, not gray-700. Text tinted toward its background reads as one designed unit (Refactoring UI; Hobday).
- **Brand color is a token, not a step.** A brand yellow at L 0.85 lives outside the ladder. Mapping it to "300" because it is close breaks the ladder's guarantees.
- **Generate, then tune by eye, then re-verify.** Refactoring UI's "trust your eyes" is right for chroma and hue. Lightness changes need a re-check.
- **Three inputs, whole theme.** Linear generates themes from base, accent and contrast. With a fixed ladder, a client rebrand is a hue change, not a redesign.

## Data visualization
Use the dataviz skill for charts. Background facts: sequential scales vary lightness; diverging scales put a light neutral at a meaningful midpoint; qualitative palettes vary hue at similar lightness (ColorBrewer). For color vision safety start from Okabe-Ito (`#E69F00 #56B4E9 #009E73 #F0E442 #0072B2 #D55E00 #CC79A7 #000000`) and add shape, pattern or direct labels.

## Do and don't
- Do: 11 neutral steps tinted toward the brand. Don't: `#ccc`, `#999`, `#666` picked ad hoc.
- Do: `--color-brand` exact plus a generated `--color-blue-50` to `--color-blue-950`. Don't: stretch the brand color to be every step.
- Do: alert = 50 or 100 background, 300 border, 800 text, 600 icon. Don't: gray text on a colored alert.

## Worked example 1: brand yellow #FFC20E for buttons and links
1. Convert: `oklch(84.6% 0.172 85.3)`. L 0.85 is far above 0.55.
2. Check: on white 1.62:1. White text on it 1.62:1. Black on it 12.98:1.
3. Decision: yellow is a **fill**, never text. Primary button: yellow fill, near-black label (`#1f1d1a`, 10.39:1); hover moves to the 300 step (`#e2bc55`, 8.88:1 with the 950 label), which stays recognisably yellow, where the 400 step would turn bronze. The yellow fill itself is only 1.62:1 against the white page, and that is allowed: SC 1.4.11 needs no visible boundary when the label identifies the control. Add a 1px amber-500 border only if the button must read as a shape on white (opinion). Links: near-black text with a 2px yellow underline. The underline is decoration, so it carries no contrast duty; the text itself passes.
4. Scale: `oklch_scale.py scale --hue 85 --chroma 0.172 --shift -20` rotates dark steps toward orange, so 600 is `#8a6500` (gold, 5.33:1 on white) instead of olive. Use 600 and 700 for small yellow-family text such as "Pending" labels.
5. Focus ring on a yellow button: yellow on white fails 3:1, so use a 2px near-black ring with 2px offset.
6. What a generic answer misses: it darkens the yellow until it passes for buttons, and the brand turns brown. The fix is to change the role, not the color.

## Worked example 2: calm fintech landing page
Brief: savings app, wants "calm and trustworthy, not another loud blue".
1. Hue: deep blue-teal, H 235, sitting between generic fintech blue and wellness green (our opinion on positioning; check competitors with website-strategy).
2. Personality: calm, so max chroma 0.13. Neutrals H 235 at chroma 0.012.
3. Scale (from the script): 50 `#eef9ff`, 100 `#d3eeff`, 500 `#1696ce`, 600 `#0275a3` (5.15:1 on white), 700 `#006086`, 900 `#013850`. Neutrals: 50 `#f6f7f7`, 200 `#d4d8db`, 600 `#656d72` (5.27:1), 900 `#2f3436`.
4. Mapping: page background neutral-50; cards white; body text neutral-900; secondary text neutral-600; CTA primary-600 with white label, hover 700; section tint primary-50 with headings in primary-900; success green H 160 at 600 (`#038053`, 4.98:1) so it shares L with the primary.
5. Proportion: about 85 to 90% neutrals, primary only on CTAs, links, one hero tint. One warm accent reserved for a single "rate" highlight: amber-400 fill with amber-950 text (6.38:1). Not amber-500: on the ladder, 500 against 950 can fall to 4.21:1.
6. Expert touch: the hero uses primary-950 as a dark band with neutral-50 text, giving depth without adding a hue.

## Hand-offs
- Contrast details and APCA: 03. Turning the scale into tokens and dark mode: 04. Choosing the hue for a brand: 05. Positioning: website-strategy skill.
