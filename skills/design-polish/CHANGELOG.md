# design-polish changelog

## v0.1.3 (2026-10-24, editor-in-chief, operated checks, `kb/tests/benchmark/operate/TALLY.md`)
- Reference 01 rule 3: pressed state is now linted on the live page (`press-state` in `tools/operate.mjs`: held looks like rest fails, like hover warns, under delta E 15 from disabled fails); the state sheet alone is not proof.

## v0.1.2 (2026-10-13, editor-in-chief, benchmark round 1, `kb/tests/benchmark/round1/RANKED.md`)
- Pressed vs disabled: delta E 15 or more, either direction on dark-ink fills; never `opacity` on a brand fill for disabled. Selected measured at 3:1 or +200 weight. Hover never lowers text contrast.
- Touch padding scoped to stand-alone links, never `min-block-size` on a class that can sit in a sentence (round 1's 33px line gap).
- Hover is `--motion-hover` 100ms (was 150ms, against FOUNDATIONS). `polish-tokens.css` no longer puts `none` in shadow tokens; dark popover and modal use `--highlight`.

## v0.1.1 (2026-10-09, editor-in-chief)
- Pressed state layer 12% changed to 10% to match FOUNDATIONS v0.3 and design-color. Shadow recipe, `--ring`, `--highlight` and `--color-primary-active` adopted into FOUNDATIONS. Hard checks ported into `tools/lint.mjs`.

## v0.1 (2026-10-09)
- First version: SKILL.md, six references (interactive states; depth, borders and shadows; shape, alignment and icons; surface, texture and text rendering; scroll, overflow and edges; the polish pass checklist).
- Assets: `polish-tokens.css` (shadow, ring, highlight, elevation and state tokens, focus, loading, scroll and truncation recipes) and `polish-audit.mjs` (advisory checks beside `tools/lint.mjs`).
- Fixes from rendered testing (G1 to G6, `kb/tests/design-polish.md`): scoped `scrollbar-gutter`; `:where(a:focus-visible)` focus radius; clipped scroll-shadow panels; loading label `opacity: 0`; pressed as a further step and band rings in band text color; heading wrap checked at 390.
