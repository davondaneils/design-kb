# Changelog: design-color

## 0.1 (2026-10-09)
First release, built in the pilot run of the design-kb agent pipeline.
- SKILL.md: fundamentals gate, core numbers (OKLCH pass lines, contrast-locked 50 to 950 ladder), workflow, audit steps, decision rules, expert layer, two worked examples, reference map.
- References: fundamentals-models, palette-building, contrast-accessibility, ui-tokens-themes, psychology-brand, each with sources.
- Asset: `assets/oklch_scale.py` (ramp generator, WCAG and APCA checker, hex to OKLCH).
- Aligned with `kb/FOUNDATIONS.md` v0.1 (token names, roles, 50 to 950 ramps, WCAG 2.2 AA). Documented deviation: neutral 975 and 990 steps for dark surfaces.
- Critic fixes: G183 link rule corrected, fintech and yellow examples fixed, sources added to every reference, alpha color and email rules added (`kb/reviews/design-color.md`).
- Tester gaps fixed: brand lightness bands, dark labels on mid-light fills, audit procedure, contrast margin (`kb/tests/design-color.md`).
- Review interval: yearly; APCA, WCAG 3 and legal dates every 6 months.
