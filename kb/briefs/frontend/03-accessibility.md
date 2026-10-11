# Brief 03: Accessibility implementation to WCAG 2.2 AA

## Question it answers
What exactly must the code do to meet WCAG 2.2 AA, which failures are most common, and how do I test it?

## After reading, Claude must be able to decide
- Focus indicator design that survives forced colors and meets 2.4.11 and (by default) 2.4.13.
- Target sizes, spacing exceptions, and drag alternatives.
- Form error handling and accessible authentication (no paste blocking).
- Motion and reduced motion handling, consistent with design-motion.
- A test plan: automated, keyboard, screen reader, zoom/reflow, forced colors.

## Must cover
WCAG 2.2 new SCs, the top WebAIM Million failures, 1.4.10 reflow, 1.4.12 text spacing, 1.4.13 hover content, 2.5.3 label in name, live regions, skip links, focus management in SPAs, legal context (EAA, ADA Title II).

## Test briefs it should pass
- Accessible checkout form with inline validation.
- Audit a sticky-header marketing page for focus and target issues.
