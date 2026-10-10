# design-graphic changelog

## v0.2 (2026-10-10, wave 2: render-tested)
- Tested on rendered pages for the first time (`kb/tests/design-graphic.md`): Ember & Oak wordmark, symbol tiers, favicon and app icon; Tally icon set and brand mark.
- New fundamentals: the wordmark on a page is outlined SVG, not live text; favicon ink reaches 3:1 on every tab strip (own field when the bare mark fails); icon family rules checked by an audit (one cap and join, no hard-coded colors, 1px padding).
- New measured rules: where strokes land on device pixels (1.5px stems on .25 or .75), cap height measured from the variable-font instance, favicon contrast against light, gray and dark strips.
- New expert moves: stroke as a type property (`--icon-stroke` set with font-weight), solid status icons with evenodd knockouts, inline icons from one source module (sprites hide shapes from the lint), outlining workflow with the italic ampersand, detail dropped per tier, full-width sign-off.
- Assets: `wordmark.py` (outline a word from a font with tracking, kerning, italic swap, slot), `icon_audit.mjs` (numeric blur review), `tab_contrast.py` (favicon vs tab strips).
- Trimmed overlap with design-art-direction: 03 keeps the shot brief, stock and AI rules; 04 keeps tiers and the style spec; both link out for crops, treatment, text over images and code-drawn visuals. Description now names art direction as the owner of page imagery.
- Removed `--size-icon-*` names (not in FOUNDATIONS); sizes are px, token proposal in `kb/reviews/design-graphic-pipeline-notes.md`.
- Citation re-fetch (critic, 13 of 64): two redirected URLs updated (Animade, WWU), one overstated claim narrowed (Contently shoot brief).

## v0.1 (2026-10-09)
- First version: SKILL.md and six references (logo and identity, icon systems, photography direction, illustration, composition and social, export). Critic: revise then approve, 9 fixes applied. Not tested.
