# Brief: 05 Reduced motion, accessibility and performance

**Question it answers:** How does motion stay safe for people with vestibular disorders, epilepsy and attention disorders, and smooth on a mid-range phone?

**After reading, a designer can decide:** what to remove, replace or keep under `prefers-reduced-motion`; when a pause control is legally required; which properties can animate cheaply; how to animate height, shadows and blur without jank.

**Must cover:** WCAG 2.2.2 (A), 2.3.1 (A), 2.3.3 (AAA); Apple reduced motion criteria; triggers (scaling, spinning, parallax, multi-speed, large area); no-motion-first CSS; global-reset anti-pattern; SSR default; compositor-only properties; `will-change` discipline; INP; LCP and opacity 0.

**Test briefs:** audit an existing landing page; a hero with parallax and autoplay video.

**Hand-offs:** design-frontend (performance budgets, testing), design-ux (settings toggle).
