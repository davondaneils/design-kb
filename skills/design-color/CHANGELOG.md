# Changelog: design-color

## 0.2.2 (2026-10-13, editor-in-chief, benchmark round 1, `kb/tests/benchmark/round1/RANKED.md`)
- Pressed vs disabled: on dark-ink fills pressed may go either way but stays delta E 15 or more from disabled; never disable with `opacity` on a brand fill (SKILL section 4, ui-tokens-themes States).
- Borders on raised and tinted dark surfaces measured at 3.3:1; the default `border-strong` mapping no longer teaches 3.02:1 on raised (neutral-500 there).
- Dark retune: white-alpha hairlines (Linear `.05` to `.12`), low chroma on large brand fields. Hover never lowers contrast. Selected state measured at 3:1 or +200 weight.
- Role names follow FOUNDATIONS: `-active` (not `-pressed`); role list adds `surface-sunken`, `text-muted-on-tint`, `border-strong`.

## 0.2.1 (2026-10-09, editor-in-chief)
- State overlays: focus and pressed 12% changed to 10% (Material 3 tokens; FOUNDATIONS v0.3, design-polish). Pressed names `--color-primary-active` and must differ from hover.
- Stale "(planned)" hand-offs removed.

## 0.2 (2026-10-09)
Fixes from the rendered vertical slice (`kb/tests/design-color.md`).
- Fundamentals fix: the ladder rule was off by one. Six positions apart passes body text (worst 4.64:1), five apart passes 3:1 (worst 3.01:1). 600 on 100 fails at 4.37 to 4.39:1. SKILL.md and `references/palette-building.md`.
- Dark `*-subtle` backgrounds: low-chroma tint at L .25 instead of the 950 step. SKILL.md and `references/ui-tokens-themes.md`.
- New decision rules: muted text on tinted surfaces, light brand color as the dark mode primary fill, dark mode brand bands, chart series against a gray benchmark.

## 0.1 (2026-10-09)
First release, built in the pilot run of the design-kb agent pipeline.
- SKILL.md: fundamentals gate, core numbers (OKLCH pass lines, contrast-locked 50 to 950 ladder), workflow, audit steps, decision rules, expert layer, two worked examples, reference map.
- References: fundamentals-models, palette-building, contrast-accessibility, ui-tokens-themes, psychology-brand, each with sources.
- Asset: `assets/oklch_scale.py` (ramp generator, WCAG and APCA checker, hex to OKLCH).
- Aligned with `kb/FOUNDATIONS.md` v0.1 (token names, roles, 50 to 950 ramps, WCAG 2.2 AA). Documented deviation: neutral 975 and 990 steps for dark surfaces.
- Critic fixes: G183 link rule corrected, fintech and yellow examples fixed, sources added to every reference, alpha color and email rules added (`kb/reviews/design-color.md`).
- Tester gaps fixed: brand lightness bands, dark labels on mid-light fills, audit procedure, contrast margin (`kb/tests/design-color.md`).
- Review interval: yearly; APCA, WCAG 3 and legal dates every 6 months.
