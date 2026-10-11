# Brief 07: finish design-graphic and prove it on rendered pages (wave 2)

Editor-in-chief, 2026-10-10. Domain: graphic (`design-graphic`, domain reference). Supersedes the "Next step" in `kb/status/graphic.md`.

## Question
design-graphic passed a text review in wave 1 but was never rendered. Does it make the two slice pages measurably better where they are weakest in its own domain: the Tally dashboard has hand-drawn icons, and the Ember & Oak wordmark is a line of live text?

## Audience
Claude, building a page through design-director and a playbook, with no designer in the loop and no image or exemplar hosts (fonts do download: Google Fonts, github.com/google/fonts, npm Fontsource).

## Decisions the reader must be able to make
1. When a wordmark is live text and when it must be outlined artwork; which face, weight, optical size, ampersand and spacing.
2. The one ownable detail of a mark, and how it is drawn so it survives 16px, one color, both themes and a blur.
3. Which tier of the mark goes where (header, packaging, sign-off, favicon, app icon), and when inner detail drops out.
4. The icon grid, stroke and pixel placement for a product whose labels are 12 and 14px Inter, and how stroke follows label weight per state.
5. How status icons stay one color with no hard-coded white or black.
6. How to prove a set is consistent with numbers, not only by eye.

## Fundamentals (gate, checked first)
FOUNDATIONS v0.3 checklist, all 15 items, on both pages and every state; plus the design-graphic gate: logo works in one color both polarities and at 16px, separately drawn small tier, clear space and minimum size in units; icons in one family (one grid per size, one cap and join), 3:1 where meaning rides on the icon, accessible names on icon-only controls, decorative icons hidden, no hard-coded colors.

## Expert layer
Not "use SVG" or "keep icons consistent". The test: would the Linear or Vercel icon designers, or a Pentagram identity partner, learn something? Candidates: device-pixel placement of strokes measured in the browser; stroke treated as a type property; outlining a variable font at the right optical size and measuring cap height from the instance; one-color favicon chosen by tab-strip contrast; a numeric icon audit that catches what the lint and the polish audit miss.

## Must cover
- Trim overlap with design-art-direction (photography, illustration without image hosts, text over images): keep only the shot brief, stock and AI rules, the illustration style spec, and link out.
- Ship runnable assets: wordmark outliner, icon audit. Show usage in SKILL.md.

## Out of scope or reuse
Page-level visual concept, photo treatment and crops, drawn stand-ins: design-art-direction. Icon stroke vs stem tables: design-polish 03 (link, do not copy). Positioning and naming: website-strategy.

## Test briefs
| # | Page | Playbook | Closest exemplars | What design-graphic must change |
|---|---|---|---|---|
| A | Ember & Oak coffee landing page, light and dark, 390 and 1440 (start from `kb/tests/combined/coffee.src.html`) | design-playbook-landing | pentagram.com (identity work), apple.com product pages, family.co | A drawn wordmark with one ownable detail tied to the art direction concept, a symbol for packaging, a favicon and app icon, a sign-off moment; stress test sheet |
| B | Tally analytics overview, light and dark, every `?state=` (start from `kb/tests/combined/dashboard.src.html`) | design-playbook-dashboard | Linear app, Vercel dashboard | A coherent drawn icon set at the labels' weight, solid status icons, brand mark and favicon; icon sheet; numeric audit |

## Rubric
1. Gate: `node tools/lint.mjs` 0 fails on each page, each state and each state sheet; `[judged]` rows hold on the renders. Any miss fails the brief.
2. Domain gate: `node skills/design-graphic/assets/icon_audit.mjs` exits 0 on both pages (one cap and join, no hard-coded colors, padding at least 1px); the mark sheet shows 16px, one color, both polarities, blur and clear space.
3. Close to the exemplar means: the mark reads as drawn for this brand (hide the name: does the O still say hill and fire?), the icons read as one family at 1x and 2x with no outlier in weight, and nothing looks like a stock library dropped in.
4. Measurable gain over the combined pages: before and after icon audit numbers, lint before and after, side-by-side close-ups.
5. Max 3 critic or tester rounds; report what is still short.
