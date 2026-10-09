# Changelog: design-product-ui

## v0.1.1 (2026-10-09, editor-in-chief)
- Answer line and description text measure changed from about 32em to about 52ch (FOUNDATIONS v0.3). Safari table semantics and `/` `?` shortcuts added to the foundations accessibility file; the dashboard playbook now loads this skill.

## v0.1 (2026-10-09)
- First version. Six references: tables, find and command, forms and settings, shells and density, states and bulk actions, dashboards.
- Critic round 1 fixes applied (see `kb/reviews/design-product-ui.md`): native checkbox `indeterminate`, `/` and `?` under WCAG 2.1.4, shell breakpoints aligned with design-ux, long tables, truncation and time rules, `aria-disabled` for focusable unavailable controls.
- Tester round 1 gaps fixed: full value for abbreviated KPIs via sr-only text (not `aria-label` on a span); palette ranking order before typo tolerance. See `kb/tests/design-product-ui.md`.
