# Illustration

Sources: research/graphic/04-illustration.md (L-numbers). Opinion is marked (opinion).

**Scope.** This file holds illustration tiers and the style spec for commissioned or drawn illustration systems. Choosing between photo, illustration, data art and type for a page, and drawing visuals in code when image hosts are blocked (contours, data curves, sparklines, grain, CSS objects), is design-art-direction (SKILL.md section 3 and `references/04-visuals-without-image-hosts.md`). Illustration tokens: `--color-illustration-{surface,line,accent,accent-fill}` (FOUNDATIONS v0.3).

## Principles
1. **Illustration explains what a camera cannot.** Use it for abstract, complex or dry concepts and to soften errors; use photography for proof [L2].
2. **It supports the message, never replaces it.** The words carry the meaning; the illustration adds clarity or warmth [L1].
3. **Less is more in product.** Overuse raises cognitive load; consider an icon, copy or a pattern first [L1].
4. **A style is a specification, not a vibe.** If two illustrators (or an illustrator and an AI tool) cannot produce matching work from the spec, it is not a spec. (opinion, observed across Atlassian, Dropbox and Mailchimp systems [L1][L2][L6])

## Fundamentals gate
- Each illustration answers "what does this make clearer?" in one sentence, or it is cut [L1].
- **Accessibility:** decorative illustrations get `alt=""` (or `aria-hidden` for inline SVG); meaningful ones get a short alt; parts required for understanding meet 3:1 non-text contrast [L4][L5].
- **Consistency:** one style across the product; tiers differ in detail, not in style.
- **Dark mode:** a remapped palette variant exists for each illustration shown on `--color-bg` in dark themes; never auto-invert.
- **No screenshots inside product illustrations** [L1].
- **No text baked into illustrations** that needs translation or must be read (use live text).

## Choose the visual
Use the medium table in design-art-direction SKILL.md. Two rules it does not repeat: a low-fidelity UI illustration (basic shapes, mostly gray) shows how a UI works without real data; a routine task with no emotion gets nothing, or a neutral spot [L1].

## Tiers and detail budget
Tier names from Dropbox and Atlassian [L1][L2]; sizes and budgets are opinion, set on the 4 px scale.
| Tier | Typical render size | Detail budget | Use |
|---|---|---|---|
| Hero | 320 to 640 px | Scene, up to 1 character group, background | Marketing heroes, onboarding first screen |
| Spot | 96 to 160 px | One object or one simple scene, no background | Empty states, errors, success |
| Mini | 32 to 64 px | One object, icon-like but in illustration style | Inline feature lists, small callouts |

## The style spec (fill all fields)
| Field | Decide | Example default (opinion) |
|---|---|---|
| Palette | Subset of brand ramps; count of hues | 3 hues from brand ramps (one 500 level accent, two supporting at 200 and 700) plus neutrals |
| Line | Outline or none; weight relative to size | No outlines at Spot and Mini; 2 px line at Hero only |
| Shape language | Geometric, organic, hand drawn | Geometric with radius from the foundation scale (4, 8, 12) |
| Light | Direction and shading method | Light from top left; one flat shadow tone, no gradients |
| Perspective | Flat, isometric (30 degree), 3/4 | Flat front views; isometric only for systems diagrams |
| Texture | None, grain, halftone | Subtle grain on Hero only |
| Characters | Proportions, faces, skin tone range, hands | 1:6 head to body, simple faces, full skin tone range, no hand gestures that can offend |
| Metaphor library | Recurring objects and their meanings | Paper plane = send, seed = growth |
| Negative space | Where it sits relative to copy | Illustration right, copy left, 32 px gap |
| Do and don't board | 6 to 10 approved examples, 6 rejected | Required |

## Decision rules
- **If the brand voice is calm or premium, cut detail and saturation;** if playful, allow more color and character, but still one style. (opinion)
- **Neutral vs colorful spots:** colorful for wins and key moments, neutral for routine states [L1].
- **Character-led or object-led:** object-led ages better and avoids representation pitfalls; characters add warmth but need a diversity and gesture policy. (opinion)
- **Commissioning:** one lead illustrator or studio sets the first 10 to 15 pieces, then the spec is written from them, not before. Dropbox's spot library was built this way by one studio [L3]. (process is opinion)
- **AI assisted illustration:** generate only from the written spec plus approved references, then redraw or vector-trace to the spec's shapes and palette; never ship raw generations in a system. (opinion)

## Expert moves
- **Write the spec from finished work,** not before; the first pieces teach you the rules. (opinion)
- **Design the empty state with the illustration as the smallest element**: headline and action first, spot second, so the illustration never competes. (opinion, consistent with [L1])
- **Avoid the interchangeable flat people style** (large limbs, tiny heads, purple skin) unless you can push it somewhere ownable; it signals "template." (opinion, broad practitioner consensus)
- **Build illustrations from the icon grid at Mini tier** so icons and minis feel like one family. (opinion)
- **Ship dark mode palettes as tokens** (`--color-illustration-accent` and the other FOUNDATIONS illustration roles), so illustrations recolor with the theme.

## Worked example: B2B product empty, error and onboarding states
1. Empty projects list: neutral Spot (stack of folders with a seed), 120 px, above "No projects yet" and a primary button. alt="" because the heading carries the meaning.
2. Error 500: neutral Spot (unplugged cable), copy explains and offers retry; no humor if data may be lost.
3. Onboarding step 1: Hero, low-fi UI illustration of the dashboard in grays with one brand accent highlighting the next action.
4. Palette from brand ramps, no outlines at Spot size, dark mode variant via tokens.

## Hand-offs
- design-ux: empty, error, onboarding patterns.
- design-color: ramps, dark mode mapping.
- design-copy: the message the illustration supports.
- design-motion: animated illustrations (Lottie or Rive), reduced motion fallbacks.

## Sources
- [L1] Atlassian Design, Illustrations: https://atlassian.design/foundations/illustrations
- [L2] Dropbox brand imagery: https://brand.dropbox.com/imagery
- [L3] Animade, Dropbox spot illustration library: https://archive.animade.tv/work/dropbox-smalls-illustration-library
- [L4] W3C WAI, alt decision tree: https://www.w3.org/WAI/tutorials/images/decision-tree/
- [L5] W3C, Understanding 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- [L6] Standards.site, Mailchimp guidelines: https://standards.site/examples/mailchimp
