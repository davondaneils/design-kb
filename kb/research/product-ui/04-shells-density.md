# Research 04: Navigation shells and density

Researcher, 2026-10-09. Access method and status codes as in research 01.

## Key findings
1. Apple HIG: sidebars show at most two levels, can be hidden by the person but are not hidden by default, and can be customised.
2. APG tabs switch panels in place; recommended automatic activation unless panels load slowly; arrow keys move between tabs and Tab moves into the panel. Tabs that change the URL are navigation, so a `nav` of links with `aria-current` fits better (derived: APG defines tabs as "layered sections of content", not routes; opinion).
3. NN/g breadcrumbs: hierarchy not history, supplement primary nav, last crumb not a link, skip on flat sites.
4. Vercel: a scope selector switches team or account and scopes everything below it.
5. Linear's redesign reduced noise in sidebar, tabs, headers and panels, and generates themes from three variables (base, accent, contrast), which gives high-contrast themes for free.
6. Density: Carbon five row sizes (24 to 64, default 40); Primer three (condensed, normal, spacious). Atlassian has no density guidance yet.
7. Stripe sidebar has a Shortcuts section of pinned and recent pages.

## Claim table
| ID | Claim | Quote (under 40 words) | URL | Tier | Status |
|---|---|---|---|---|---|
| N1 | Two levels max | "In general, show no more than two levels of hierarchy in a sidebar." | https://developer.apple.com/design/human-interface-guidelines/sidebars | 1 | S (platform) |
| N2 | Do not hide by default | "Avoid hiding the sidebar by default to ensure that it remains discoverable." | https://developer.apple.com/design/human-interface-guidelines/sidebars | 1 | S |
| N3 | Let people customise | "When possible, let people customize the contents of a sidebar." | https://developer.apple.com/design/human-interface-guidelines/sidebars | 1 | S |
| N4 | Tabs auto activation | "It is recommended that tabs activate automatically when they receive focus" | https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ | 1 | S |
| N5 | Tab key into panel | "moves focus to the next element in the page tab sequence outside the tablist, which is the tabpanel" | https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ | 1 | S |
| N6 | Breadcrumbs show hierarchy | "they are intended to show the hierarchical structure of the site." | https://www.nngroup.com/articles/breadcrumbs/ | 3 | C |
| N7 | Supplement, not replace | "augment but do not replace those main forms of navigation." | https://www.nngroup.com/articles/breadcrumbs/ | 3 | C |
| N8 | Last crumb not a link | "The last breadcrumb (denoting the current page) should not be a link." | https://www.nngroup.com/articles/breadcrumbs/ | 3 | C |
| N9 | Not needed on flat sites | "a breadcrumb isn't needed as a wayfinding device." | https://www.nngroup.com/articles/breadcrumbs/ | 3 | C |
| N10 | Vercel scope selector | "The scope selector allows you to switch between your Hobby team and any teams that you may be part of." | https://vercel.com/docs/dashboard-features | 2 | P |
| N11 | Linear reduced chrome noise | "We've adjusted the sidebar, tabs, headers, and panels to reduce visual noise" | https://linear.app/now/how-we-redesigned-the-linear-ui | 2 | P |
| N12 | Three theme variables | "instead of having to define 98 specific variables for each theme, we defined three: base color, accent color, and contrast." | https://linear.app/now/how-we-redesigned-the-linear-ui | 2 | P |
| N13 | High contrast themes for free | "This allows us to automatically include super high-contrast themes for users who need it for accessibility reasons." | https://linear.app/now/how-we-redesigned-the-linear-ui | 2 | P |
| N14 | Carbon sizes | 24, 32, 40 (default), 48, 64px rows (see research 01, T36) | https://carbondesignsystem.com/components/data-table/usage/ | 2 | P |
| N15 | Primer spacious | "Spacious: Enhances readability for dense or complex content." | https://primer.style/product/components/data-table/ | 2 | P |
| N16 | Stripe shortcuts section | "Use the Shortcuts section to display your pinned and most recently visited pages." | https://docs.stripe.com/dashboard/basics | 2 | P |
| N17 | Sidebar icon color purpose | "Make sure any sidebar icon colors you choose serve a clear purpose." | https://developer.apple.com/design/human-interface-guidelines/sidebars | 1 | S |
