# Research 05: Page composition and density

Status key: C = consensus, X = contested, O = opinion.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Dashboards: "collections of data visualizations, presented in a single-page view" for at-a-glance action; one task per dashboard; length and 2D position are the most accurate encodings; avoid pies, donuts, gauges (space hogs), treemaps, 3D. Color for category not magnitude. | [NN/g Dashboards: preattentive](https://www.nngroup.com/articles/dashboards-preattentive/) | C |
| 2 | Few: a dashboard is the most important information needed to achieve one or more objectives, consolidated on a single screen so it can be monitored at a glance; the top-left gets the most attention for the most important data. | Stephen Few, Information Dashboard Design (2006, 2nd ed. 2013) | C (canonical) |
| 3 | Cards are for browsing heterogeneous content; lists are for searching and comparing; cards hide ranking and fit fewer items; eyetracking showed users bouncing between cards when comparing. Homogeneous text items: vertical list; single-type visual items: regular grid. | [NN/g Cards component](https://www.nngroup.com/articles/cards-component/) | C |
| 4 | Tables: numbers right-aligned, text left-aligned, never center; tabular lining figures; headers aligned with their data and short; light horizontal rules only, rules become redundant if alignment is good; author's opinion: zebra striping is bad. | [Matt Strom, Design better data tables](https://mattstromawn.com/writing/tables/) | C for alignment, O for striping |
| 5 | Pricing: simple pricing beats complex; recommended plan in the middle with the strongest CTA; key differentiating features first, full matrix on demand in grouped accordions; sticky plan headers and CTA in comparison tables; billing toggle at top with savings shown; on mobile no horizontal scroll, stack cards or sticky tabs; FAQs below core pricing. | [Smashing, Designing better pricing pages (Vitaly Friedman)](https://smashingmagazine.com/2022/07/designing-better-pricing-page) | C (practitioner synthesis) |
| 6 | Enterprise density: a whitespace-heavy redesign of a call center control panel was retired after one month because it slowed productivity-measured users; reduce data first, tabular figures, muted color with meaningful accents, remove decorative furniture, keep touch targets. | [uxdesign.cc, How white space killed an enterprise app](https://uxdesign.cc/how-white-space-killed-an-enterprise-app-and-why-data-density-matters-b3afad6a5f2a) | O (anecdotal) |
| 7 | Linear: reduce visual noise, increase hierarchy and density of navigation; limit chrome color for a neutral, timeless app; stronger text contrast. | [Linear redesign](https://linear.app/now/how-we-redesigned-the-linear-ui) | O (top studio practice) |
| 8 | Fold and false floors (see research 03 #5): heroes that look complete stop scrolling. | [NN/g Scrolling and attention](https://www.nngroup.com/articles/scrolling-and-attention/) | C |
| 9 | Long-form reading: F-pattern avoided by standout subheadings and front-loaded headings (research 03). Measure 45 to 75, 66 ideal. Full-bleed grid for wide media. | NN/g, Bringhurst, Comeau (see research 01, 03) | C |
| 10 | Designjoy (Brett Williams, practitioner on X): single-offer subscription landing page built in Webflow; public feedback on his launch asked for process clarity, case studies, social proof higher, FAQ, fewer distracting popups and animations, lighter images. | [Indie Hackers launch thread](https://www.indiehackers.com/post/just-launched-the-new-designjoy-landing-page-roast-it-614e69f85d) | O (practitioner and crowd opinion) |
| 11 | Material density: three levels (default, comfortable, compact) applied to components such as lists and tables. Details of step size not retrievable (page needs JS); commonly 4dp per step. | [Material: Use density on the web](https://m3.material.io/blog/material-density-web) | C for concept, X for step size (unverified) |

## Note on the practitioner tier
X.com posts are robots-blocked for fetching. Practitioner material was taken from linked blogs and studio write-ups (Linear, Refactoring UI by Schoger and Wathan, Josh Comeau, Rauno Freiberg, Every Layout, Designjoy launch thread). All labeled opinion where not verified by a primary source.

## Conflicting views
- Density: enterprise practitioners push density; marketing practice pushes air. Resolution: density follows task frequency and expertise, not taste.
