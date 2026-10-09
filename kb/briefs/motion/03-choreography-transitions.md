# Brief: 03 Choreography, page and scroll transitions

**Question it answers:** When several things move, in what order, from where, and how do views hand off to each other?

**After reading, a designer can decide:** which transition pattern fits a navigation (container transform, shared axis, fade through, fade); stagger step and cap; transform origin; scroll reveal rules; whether to use View Transitions or scroll-driven CSS and with what fallback.

**Must cover:** Material motion system patterns with real numbers (fade through 0.92 scale, 35 percent threshold); one-hero rule; direction maps to hierarchy; stagger limits; no scroll-jacking; reveal never hides LCP content; View Transitions (same-document Baseline Oct 2025); scroll-driven animations support; WCAG on parallax.

**Test briefs:** product grid to product detail transition; marketing landing page scroll reveals.

**Hand-offs:** design-layout (spatial model), design-frontend (routing, SSR), design-search (LCP and Core Web Vitals).
