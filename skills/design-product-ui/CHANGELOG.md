# Changelog: design-product-ui

## v0.1.3 (2026-10-13, editor-in-chief, benchmark round 1, `kb/tests/benchmark/round1/RANKED.md`)
- Selected state needs a number: a selected fill counts at 3:1 against its neighbor, else +200 weight, a 3:1 border or a 2px indicator (SKILL rule 14, reference 04 fundamental 2; lint `selected-state`).
- Phone type: line 2 of a collapsed row is 14px; 12px only for column headers and timestamps (SKILL rule 15 and core numbers no longer contradict; reference 01 phone list item; lint `reading-size`).
- Tables: the row link is stretched over the row (expert move 3, reference 01 signature move 3, replacing "feels large"); sticky header round 1 evidence; status in rows is glyph plus word, never a tinted row.
- Review-and-commit screens (reference 06, SKILL dashboards rules): committed amount the single largest figure, amount on the button, sticky commit on long pages, state changes after commit; KPI labels true in every state; KPIs 2x2 at 768.
- Reference 05: commit dialogs restate every open warning with its effect; time-boxed commitments show the end time and a countdown.

## v0.1.2 (2026-10-10, editor-in-chief)
- Notifications inbox and first-run rules added to the states decision rules, linking `kb/references/patterns/09-notifications.md` and `01-onboarding.md`; reference map links `kb/references/patterns/`.

## v0.1.1 (2026-10-09, editor-in-chief)
- Answer line and description text measure changed from about 32em to about 52ch (FOUNDATIONS v0.3). Safari table semantics and `/` `?` shortcuts added to the foundations accessibility file; the dashboard playbook now loads this skill.

## v0.1 (2026-10-09)
- First version. Six references: tables, find and command, forms and settings, shells and density, states and bulk actions, dashboards.
- Critic round 1 fixes applied (see `kb/reviews/design-product-ui.md`): native checkbox `indeterminate`, `/` and `?` under WCAG 2.1.4, shell breakpoints aligned with design-ux, long tables, truncation and time rules, `aria-disabled` for focusable unavailable controls.
- Tester round 1 gaps fixed: full value for abbreviated KPIs via sr-only text (not `aria-label` on a span); palette ranking order before typo tolerance. See `kb/tests/design-product-ui.md`.
