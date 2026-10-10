---
name: design-playbook-brand
description: Job playbook for brand identity work at the level of Pentagram case studies and the work collected on the-brandidentity.com. Use for "brand identity", "design a logo", "visual identity", "rebrand", "brand guidelines", "brand system", "pick brand colors and fonts", "style guide for my company". Says which foundations and domain references to load in what order, what done looks like (a rendered guidelines page plus the mark in SVG), and the signature moves the brand exemplars share. Not for building the website itself (design-playbook-landing) or app UI (design-playbook-dashboard, design-playbook-mobile).
---

# design-playbook-brand

An identity is a system that has to work at 16px and on a billboard, in one color and in full color, used by people who never met the designer. Design the system, then the mark.

## 1. Load in this order
1. **design-foundations** (always): tokens and the accessibility floor apply to every brand color and type choice used on screen.
2. **website-strategy**: positioning, audience, competitors. No mark before this.
3. **design-graphic**: `references/01-logo-identity.md` (concept, competitor wall, mark types, clear space, minimum sizes).
4. **design-typography**: `references/02-selection-pairing.md`, `03-web-fonts-variable-licensing.md` (licensing for web, app and print), `07-type-led-pages.md` for the wordmark-scale display moments.
5. **design-color**: `references/psychology-brand.md`, then `palette-building.md` to turn the brand hue into contrast-locked ramps and `ui-tokens-themes.md` for screen roles.
6. **design-graphic**: `references/02-icon-systems.md`, `03-photography-direction.md`, `04-illustration.md`; then **design-art-direction**: SKILL.md, `references/01-concept-and-consistency.md` (concept sentence, reject test, one system for every image), `02-photography.md`, `05-requesting-photography.md` for the shoot brief.
7. **design-copy**: `references/03-voice-and-tone.md`.
8. **design-graphic**: `references/05-composition-social.md`, `06-export-formats.md` (logo kit, favicon, OG image).
9. Self-critique loop in design-director, on the rendered guidelines page.

Copy for brand work is design-copy (voice), not direct response copywriting.

## 2. Non-negotiables for this job
1. The mark works in one flat color, in both polarities, and is recognizable at 16px.
2. Every brand color used for text or UI has a screen role that passes WCAG 2.2 AA; colors that cannot carry text are labelled fill or accent only.
3. Type choices are licensed for every place they will be used (web, app, print).
4. Clear space and minimum sizes are defined in units of the mark, not in pixels.
5. Rules are shown, not described: every rule in the guidelines has a do and a don't example.

## 3. Done means
1. Deliverables: the mark as SVG (primary, reversed, one color, small-size version), a token file for color and type, and a guidelines page in HTML.
2. `node tools/lint.mjs guidelines.html` exits 0; `node tools/render.mjs guidelines.html out/` renders light and dark.
3. The mark is rendered at 16, 32 and 512px and on light, dark and photo backgrounds; it reads at every size. The favicon reaches 3:1 on light, gray and dark tab strips or sits on its own field (design-graphic `assets/tab_contrast.py`; FOUNDATIONS accessibility findings). The logo itself is exempt from contrast; any version used as a link is not.
4. Compared with the closest exemplar (`references/signature-moves.md`), rated close on idea, system and presentation.
5. The hand-over names what is still short of the exemplar.

## 4. Reference map
| Need | Read |
|---|---|
| Closest exemplar by brand type, and the moves brand exemplars share | `references/signature-moves.md` |
