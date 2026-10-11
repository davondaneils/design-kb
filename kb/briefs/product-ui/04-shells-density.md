# Brief 04: Navigation shells and density

## Question
What is the frame every screen of a tool sits in (sidebar, top bar, page header, tabs, breadcrumbs), and how dense should it be?

## Audience
Claude building multi-screen apps.

## Decisions the reader must be able to make
- Shell anatomy and widths; what lives in the sidebar vs the page header.
- Tabs (ARIA tablist) vs route links that look like tabs.
- When breadcrumbs earn a place.
- Default density, whether to offer a switch, and what the switch changes.
- How the shell collapses at 390px.

## Fundamentals
Current location marked with `aria-current`; sidebar at most two levels (Apple HIG); same page header pattern on every screen (title left, one primary action right); density changes spacing and row height, never type below 14px or targets below 24px; skip link to main.

## Expert layer
Route "tabs" are a `nav` with links, not `role=tablist`; breadcrumbs show hierarchy not history and the last crumb is not a link; scope switcher top-left (Vercel); quiet chrome one surface step from the canvas; density as one attribute that remaps a few tokens; coarse pointers fall back to default density.

## Must cover
Apple HIG sidebars, W3C APG tabs, NN/g breadcrumbs, Vercel docs (scope selector), Carbon and Primer density sizes, Linear UI redesign post (chrome noise).

## Out of scope or reuse
Navigation pattern chooser and mobile nav: design-ux `references/02-navigation-ia.md`. Density table: design-layout `references/05-page-composition-and-density.md`.

## Test briefs
1. Slice brief B shell, with a density switch and a phone shell. Exemplar: Linear app, Vercel Dashboard.
2. "Admin console with 14 sections and per-project settings." Exemplar: Vercel Dashboard, Stripe Dashboard.

## Rubric
Gate: fundamentals checklist. Close to exemplar: chrome recedes; the page header reads identically across screens; compact mode looks deliberate, not squeezed; phone shell keeps title and primary action visible.
