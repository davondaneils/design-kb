# design-polish changelog

## v0.1.1 (2026-10-09, editor-in-chief)
- Pressed state layer 12% changed to 10% to match FOUNDATIONS v0.3 and design-color. Shadow recipe, `--ring`, `--highlight` and `--color-primary-active` adopted into FOUNDATIONS. Hard checks ported into `tools/lint.mjs`.

## v0.1 (2026-10-09)
- First version: SKILL.md, six references (interactive states; depth, borders and shadows; shape, alignment and icons; surface, texture and text rendering; scroll, overflow and edges; the polish pass checklist).
- Assets: `polish-tokens.css` (shadow, ring, highlight, elevation and state tokens, focus, loading, scroll and truncation recipes) and `polish-audit.mjs` (advisory checks beside `tools/lint.mjs`).
- Fixes from rendered testing (G1 to G6, `kb/tests/design-polish.md`): scoped `scrollbar-gutter`; `:where(a:focus-visible)` focus radius; clipped scroll-shadow panels; loading label `opacity: 0`; pressed as a further step and band rings in band text color; heading wrap checked at 390.
