# Brief 01: Semantic HTML and native controls

Domain: front-end build (design-frontend). Owner hat: domain-specialist, front-end.

## Question it answers
Which element do I use, and when is ARIA allowed? How do I mark up a page so browsers, assistive tech, search engines and AI agents read it correctly with zero extra code?

## After reading, Claude must be able to decide
- Button vs link vs form submit, every time, with no `div` click handlers.
- Landmark structure, heading outline, and the `<head>` order for a page.
- When a native element (dialog, popover, details, select, input types) replaces a JS widget, and when ARIA is still needed.
- How every interactive element gets an accessible name that matches its visible label.

## Must cover
Landmarks, headings, lists, tables, forms (label, fieldset, autocomplete, inputmode, error wiring), dialog and popover, inert, details/summary, the rules of ARIA use, accessible name computation in practice, `<head>` order (capo.js), `lang`, document title pattern.

## Test briefs it should pass
- Mark up a pricing page header with nav, a plan toggle and a modal sign-up form.
- Review a React card component that uses `<div onClick>` and fix it.
