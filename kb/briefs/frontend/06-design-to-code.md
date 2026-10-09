# Brief 06: Design-to-code fidelity and frameworks

## Question it answers
How do I turn a design (Figma or brief) into production code that matches it pixel for pixel in intent, survives real content, and fits React/Next and Tailwind projects?

## After reading, Claude must be able to decide
- How to map design tokens and Figma variables to CSS and Tailwind `@theme`.
- Which states every component must ship (the state matrix).
- How to stress-test a build against real content, zoom, languages, and themes.
- React/Next and Tailwind specific choices (next/image, next/font, server components, class composition).

## Must cover
Token mapping, state matrix, content stress tests, visual regression, optical details (concentric radii, tabular numbers, text-wrap), Tailwind v4 CSS-first config, React accessibility pitfalls, Next.js image and font, QA checklist before ship.

## Test briefs it should pass
- Implement a Figma pricing card set in Next.js with Tailwind.
- Convert a static landing page mock into semantic, tokenized HTML/CSS.
