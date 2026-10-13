---
name: design-playbook-brand
description: Job playbook for brand identity work at the level of Pentagram case studies and the work collected on the-brandidentity.com. Use for "brand identity", "design a logo", "visual identity", "rebrand", "brand guidelines", "brand system", "pick brand colors and fonts", "style guide for my company". Says which foundations and domain references to load in what order, what done looks like (a rendered guidelines page plus the mark in SVG), and the signature moves the brand exemplars share. Not for building the website itself (design-playbook-landing) or app UI (design-playbook-dashboard, design-playbook-mobile).
---

# design-playbook-brand

An identity is a system that has to work at 16px and on a billboard, in one color and in full color, used by people who never met the designer. Design the system, then the mark. Build only as much system as the brief's artifacts need.

## 0. Scope: the brief sets the deliverables
1. **Read the brief's deliverable list first and build that list.** If the brief asks for a poster and a site, the identity is what those two need: the wordmark (outlined SVG plus the small-size master), the color and type tokens, and the rules the poster and site actually use. No guidelines page, logo kit, photography brief or brand strategy document unless the brief asks for one. The held-out test built a brand page nobody asked for because this playbook demanded it (`kb/tests/heldout.md` section 6).
2. **Strategy depth follows the brief** (design-strategy section 1). For a campaign, event or one-off artifact, the three-line brief (audience, the one true fact the idea comes from, the competitor wall you checked) and move on. For a new brand, rebrand or "brand system" with positioning, audience or competitors missing, the full brief: website-strategy stages 2 to 5 as inputs, the one-page design-strategy brief as the summary. A rebrand starts with design-strategy's asset audit (fame and uniqueness) before any sketch.
3. **Name what you did not build** in one line of the hand-over ("Not built: guidelines page, logo kit; say if you want them"). Never pad the delivery to look complete (opinion).

## 1. Load in this order
1. **design-foundations** (always): tokens and the accessibility floor apply to every brand color and type choice used on screen.
2. **design-strategy** at the depth section 0 sets (it routes to website-strategy for full depth); `references/05-strategy-to-visual-identity.md` for the identity decision table, distinctive assets, category codes and the asset audit. No mark before the brief.
3. **design-graphic**: `references/01-logo-identity.md` (concept, competitor wall, mark types, clear space, minimum sizes).
4. **design-typography**: `references/02-selection-pairing.md`, `03-web-fonts-variable-licensing.md` (licensing for web, app and print), `07-type-led-pages.md` for the wordmark-scale display moments.
5. **design-color**: `references/psychology-brand.md`, then `palette-building.md` to turn the brand hue into contrast-locked ramps and `ui-tokens-themes.md` for screen roles.
6. **design-graphic**: `references/02-icon-systems.md`, `03-photography-direction.md`, `04-illustration.md`; then **design-art-direction**: SKILL.md, `references/01-concept-and-consistency.md` (concept sentence, reject test, one system for every image), `02-photography.md`, `05-requesting-photography.md` for the shoot brief.
7. **design-copy**: `references/03-voice-and-tone.md`.
8. **design-graphic**: `references/05-composition-social.md`, `06-export-formats.md` (logo kit, favicon, OG image). With a high-contrast face (Didone, fashion serif): design-typography `references/08-high-contrast-faces.md` before outlining the wordmark.
9. Self-critique loop in design-director, on the rendered guidelines page.

Copy for brand work is design-copy (voice), not direct response copywriting.

## 2. Non-negotiables for this job
1. The mark works in one flat color, in both polarities, and is recognizable at 16px.
2. Every brand color used for text or UI has a screen role that passes WCAG 2.2 AA; colors that cannot carry text are labelled fill or accent only.
3. Type choices are licensed for every place they will be used (web, app, print).
4. Clear space and minimum sizes are defined in units of the mark, not in pixels.
5. Rules are shown, not described: every rule in the guidelines has a do and a don't example (when guidelines are a deliverable).
6. **Concept legibility.** A visual idea that could read as an error (mirrored or reversed letters, an upside-down glyph, misregistration, a deliberate misspelling, a broken or cropped letter, a missing letter) passes a cold-viewer test before it ships, or it is dropped. Section 2a.

## 2a. Concept legibility check
The held-out skilled poster mirrored the S in "Stone" on the main title: the idea (a printing stone carries the reversed image of what it prints) was true, but on the title it read as a typo, and the self-critic flagged "the reversed S risks reading as a typo" (`kb/tests/heldout.md` section 5). An idea the viewer reads as a mistake costs more than having no idea: it makes the whole piece look unchecked (opinion).
1. **Flag the risk.** List every device a stranger could read as an error: anything reversed, flipped, rotated, misspelled, misregistered, cropped through a letter, or broken.
2. **Test it cold.** Show the rendered piece for 5 seconds, at the size it is seen (feed size for social, arm's length for print), to people who have not seen the brief, then ask two questions: "What does it say?" and "Is anything wrong with it?" (the five-second test, Christine Perfetti, "5-Second Tests: Measuring Your Site's Content Pages", UIE, https://articles.centercentre.com/five_second_test, accessed 2026-10-11: "users make important judgments in the first moments"; 3 to 5 viewers is opinion). With no people at hand, a fresh-context subagent shown only the image counts as one viewer; your own judgment never does, because you know the idea.
3. **Read the result.** If any viewer names the device as a typo, bug or printing error, or misreads the name, it fails. Then either drop it, or make it unmistakably intentional and test again:
   - **Never on the primary name.** Keep the device off the main title, the wordmark's master version, the URL, the handle and anything a viewer must read, remember or type. The name reads correctly first, every time.
   - **Show the cause beside the effect.** A reversed letter reads as intended when the correct version sits next to it as its print (stone and impression side by side), not when it stands alone.
   - **Make it a system, not a one-off.** One odd letter is a typo; the same move applied consistently across a whole secondary element (every letter of a stone block, every image in a series) reads as a decision (opinion).
   - **Push it past doubt.** A 5 percent tilt looks like a mistake; a 90 degree turn looks designed. A subtle flip of one glyph is the worst case (opinion).
4. **Record it.** The hand-over names each flagged device, the viewers' answers and what changed.

## 3. Done means
1. Deliverables: what the brief lists (section 0). For a full identity job: the mark as SVG (primary, reversed, one color, small-size version), a token file for color and type, and a guidelines page in HTML. For an artifact-led brief: the mark and tokens those artifacts use, and the artifacts.
2. Every page delivered passes `node tools/lint.mjs page.html` and renders light and dark with `node tools/render.mjs`; posters and social images run in canvas mode (`data-canvas="1080x1350"` on the page, or `--canvas`), which judges text at the size it is seen.
3. The concept legibility check (section 2a) is recorded for every flagged device.
4. The mark is rendered at 16, 32 and 512px and on light, dark and photo backgrounds; it reads at every size. The favicon reaches 3:1 on light, gray and dark tab strips or sits on its own field (design-graphic `assets/tab_contrast.py`; FOUNDATIONS accessibility findings). The logo itself is exempt from contrast; any version used as a link is not.
5. Compared with the closest exemplar (`references/signature-moves.md`), rated close on idea, system and presentation.
6. The hand-over names what is still short of the exemplar, and what the brief did not ask for and was not built.
7. The strategy brief passes `brief_lint.mjs`; its primary distinctive asset is a shape, not a color alone; new assets were tested by recognition with the name hidden (design-strategy `references/06-checking-a-strategy.md`), not by liking.

## 4. Reference map
| Need | Read |
|---|---|
| Closest exemplar by brand type, and the moves brand exemplars share | `references/signature-moves.md` |
