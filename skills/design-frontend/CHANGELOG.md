# Changelog: design-frontend

## 0.2.1 (2026-10-13, editor-in-chief, from the benchmark round 1 builder notes)
- Breakpoints in `rem` with range syntax in media and container queries (SKILL defaults and decision rules, references 02, 06, 07), matching FOUNDATIONS; `em` said otherwise (`kb/tests/benchmark/round1/landing/BUILD_NOTES.md` skill problem 9).

## 0.2 (2026-10-10)
Render test on the two combined pages (`kb/tests/design-frontend.md`). Both pages refactored to the skill's standard and proven pixel-identical, except for listed intended changes.
- New reference `references/07-measured-build-quality.md`: pixel-diff proof, lab vitals method (Lighthouse mobile profile, INP proxy), page weight and critical path, the font delivery trade-off with measured numbers, and measured traps (`none` shadows in lists, container query em, `:is()` specificity, UA button padding, pointer UI shift, viewport breakpoints inverted by a rail).
- New tools in `assets/`: `pixel-diff.mjs`, `vitals.mjs`, `weight.mjs`, `css-audit.mjs`, `pw.mjs`.
- Fundamentals gate: every item now says how it is checked ([lint], [audit], [vitals], [read]); new item 24 (pixel-diff proof); item 16 bans primitives in components; item 18 narrowed to inline-axis asymmetric values (opinion, measured cost); item 22 keeps a head script only for state that changes layout (measured: CLS 0 against up to 0.074, for about 40 ms of first paint).
- Defaults: `!important` preference overrides go in the first layer.
- Decision rules added: container queries in rem, container vs viewport query in a collapsible shell, non-color theme values, "no shadow" as a transparent shadow, pointer-following UI with `translate`, font delivery by audience, `:is()` vs plain list, layout-changing saved state in the head, paint-only state at the end of body.
- Expert moves 14 to 18 added.
- Reference 02: container query examples in rem, logical properties scoped, reduced-motion override in the reset layer.

## 0.1 (2026-10-09)
First release: SKILL.md (23-item gate, defaults, decision rules, 13 expert moves) and references 01, 02, 04, 05, 06. Accessibility reference later moved to design-foundations. Text-tested only.
