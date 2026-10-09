# Brief 04: Responsive and adaptive layout

## Question it answers
How does a layout change from 320px to 2560px, and which layer (page, section, component) decides each change?

## After reading, a designer must be able to decide
- Which foundation breakpoint (sm 640, md 768, lg 1024, xl 1280, 2xl 1536) a page-level change belongs to, and when a component should use a container query instead.
- Navigation pattern per width class (bottom bar, rail, sidebar), with Material window classes as a cross-check.
- What happens to grouping when columns stack (proximity breaks on reflow).
- Minimums that are law: 320 CSS px reflow, 24px targets, 44pt preferred touch, safe areas, sticky elements that do not hide focus.
- What to do on very wide screens.

## Must cover
- WCAG 1.4.10, 2.5.8, 2.4.11, 1.4.12. Apple HIG 44x44 pt and Dynamic Type.
- Intrinsic layout (Every Layout) as the default for components.
- Content-out breakpoints vs device breakpoints.
- Height classes (landscape phone).

## Test briefs it must pass
- "Make this three-column feature grid work on mobile."
- "Our app has a sidebar; what happens on tablet and phone?"
