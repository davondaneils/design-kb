# Brief 05: States and bulk actions in product UI

## Question
What does each panel of a tool show when it is empty, loading, partly failed, stale or off-limits to this user, and how do people act on many rows at once?

## Audience
Claude building app screens; knows states exist but designs only the happy path.

## Decisions the reader must be able to make
- The state matrix for a view and which states a panel needs.
- Skeleton geometry and when to show none.
- Partial failure presentation and what never to disable.
- Permission states: hide, explain, or request access.
- Bulk selection model (checkbox column, range select, select all matching) and the bulk action bar.
- Undo vs confirm for bulk operations.

## Fundamentals
Every panel has designed empty, loading and error states that keep its size; loading never says "No results"; status changes announced by a live region that exists before it changes; bulk selection count announced; no control disabled without visible reason.

## Expert layer
Load in parts and most important first (Primer); stale-while-revalidate with "Updated 2 min ago"; error only in the failing card; permission state names who can grant access; header checkbox has an indeterminate state; "Select all 1,240 matching" after page select; batch mode disables row-level actions (Carbon); verb plus noun bulk labels (Polaris).

## Must cover
Primer loading, empty states, degraded experiences; Vercel Geist empty state; NN/g empty states; Carbon batch actions; Polaris bulk actions; Linear select issues.

## Out of scope or reuse
Loading timing table, error ladder, toasts, optimistic UI: design-ux `references/04-states-feedback.md`. State wording: design-copy.

## Test briefs
1. Slice brief B with a state switcher that shows loading, empty (new workspace), partial failure and permission states. Exemplar: Vercel Dashboard, Linear app.
2. "Bulk archive 300 issues with undo." Exemplar: Linear app.

## Rubric
Gate: fundamentals checklist (item 15 is the focus). Close to exemplar: states look designed, not like error pages; no layout jump between states; bulk bar is calm and keyboard reachable.
