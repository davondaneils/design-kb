# Brief 03: Forms and settings pages

## Question
How do you lay out settings and dense edit forms so people find a setting, know whether it saved, and cannot destroy something by accident?

## Audience
Claude building settings, admin and record-edit screens.

## Decisions the reader must be able to make
- Settings page structure: groups, annotated two-column layout, stacking.
- Save model: explicit save, autosave, or contextual save bar; which controls imply which.
- Inline edit in tables vs a detail panel.
- Danger zone placement and confirmation strength.
- How to show a control the user may not change (permission) or cannot use right now (outage).

## Fundamentals
Visible labels; one save model per form; saved and failed states announced; unsaved changes are never silently lost on navigation; a disabled control always says why in visible text; destructive settings are separated and need confirmation or undo.

## Expert layer
Annotated layout (description left, controls right) for scanability; a switch means "applies now", a checkbox means "applies on Save"; contextual save bar with Discard when a form is dirty; typed confirmation only for irreversible, high-blast-radius actions; never disable a control because a service is down (Primer).

## Must cover
Polaris app settings layout and contextual save bar, Primer saving and degraded experiences, design-ux forms reference for field rules.

## Out of scope or reuse
Field-level rules, validation timing, passwords, checkout: design-ux `references/03-forms.md`. Error wording: design-copy.

## Test briefs
1. "Workspace settings for Tally: name, timezone, data retention, members, delete workspace." Playbook: dashboard. Exemplar: Vercel Dashboard project settings, Stripe settings.
2. Landing slice brief A: the newsletter and subscription controls are the only product-like UI; check them against this chapter.

## Rubric
Gate: fundamentals checklist. Close to exemplar: every group has a one-line purpose; save state is never ambiguous; the dangerous action is visually and spatially apart; nothing is disabled without a reason.
