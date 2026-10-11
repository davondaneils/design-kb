# Brief: UX microcopy (buttons, forms, errors, empty states, dialogs, onboarding)

**Domain:** copy. **Skill:** design-copy.

## Question
What exact words go on each interface element so people can act without thinking, recover from errors, and trust the product?

## Decisions the reader must be able to make
- Button and link labels for any action, including destructive ones.
- Form labels, hints, and the full set of error messages per field.
- Empty state, loading, success and confirmation copy.
- Whether onboarding needs copy at all, and where it goes.

## Fundamentals (non-negotiable)
- Labels are visible, outside the field; placeholders never replace labels.
- Errors name the problem and the fix, sit next to the field, do not rely on color, do not blame.
- Buttons are verbs that name the result; dialog buttons never say Yes/No/OK for consequential actions.
- Accessible names contain the visible label (WCAG 2.5.3); status messages are announced (WCAG 4.1.3).

## Expert layer
- Adaptive error messages written from validation rules (4 to 7 per complex field), with the sign-in exception.
- The title, body, button echo pattern for confirmations.
- Empty state taxonomy (first use, no results, cleared, error) with different copy jobs.
- Contextual help over carousels; teach at the moment of need.

## Must cover
Buttons, links, labels, hints, errors, success, empty states, confirmations, destructive actions, onboarding, notifications, loading and progress, permission prompts, decline options (no confirmshaming).

## Out of scope or reuse
Interaction mechanics and flows: design-ux. Visual state styling: design-color, design-frontend.

## Test briefs
- "Write all the microcopy for a money transfer flow in a banking app."
- "Our signup form just says 'Invalid input' everywhere. Rewrite it."
