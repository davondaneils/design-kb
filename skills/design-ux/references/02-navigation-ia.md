# Navigation and information architecture

## Principles
1. **Visible beats hidden.** On desktop, hidden menus were used in 27% of cases vs 48% visible; tasks took at least 39% longer; discoverability fell over 20% (NN/g). On mobile, combo nav was used in 89% of tasks vs 44% to 56% for hidden menus (NN/g).
2. **Navigation is for places, not actions.** Tab bars, rails and sidebars move between sections; buttons and toolbars act on content (Apple HIG Tab bars).
3. **Location is always answerable.** Title plus active state on every screen; breadcrumbs when depth exceeds 2 levels (opinion, common practice).
4. **The URL is the navigation's memory.** Every meaningful state is linkable and Back restores it (Vercel; Baymard).
5. **Labels come from users, not the org chart.** Validate with card sorting (to group) and tree testing (to verify findability) before building (NN/g methods; opinion on order).

## Pattern chooser
| Context | Top-level items | Use | Notes |
|---|---|---|---|
| Marketing site, desktop | up to about 7 | Visible top bar | Mega menu only if sections have 10+ children each |
| Marketing site, mobile | any | Visible key links or priority+ plus menu | Pure hamburger is the weakest option |
| Small shop, phone | 4 to 6 | Shop and Cart visible, the rest behind a labelled "Menu" | Never drop links at a breakpoint without a route to them (found in the design-ux render test) |
| Web app shell | 5 to 15 | Sidebar at lg, rail at md, drawer below | Full rules: design-product-ui `references/04-shells-density.md` |
| Native iOS and Android | 3 to 5 | Tab bar / navigation bar | Full rules: design-playbook-mobile `references/platform-conventions.md` |
| Deep content (docs, settings) | many | Sidebar tree plus in-page table of contents plus search | Breadcrumbs on deep pages |

## Decision rules
- **If there are more than 5 primary destinations on mobile:** cut or regroup to 5, ranked by usage data; overflow to "More". Never put actions in navigation. Native details: design-playbook-mobile.
- **If the brand wants a hamburger on desktop:** decline. Desktops have room; NN/g recommends showing top-level nav across the top or down the left.
- **If items exceed width:** priority+ (show most used, rest behind "More") rather than collapsing everything (Brad Frost).
- **If a section is temporarily empty:** keep its tab or link enabled and explain inside (Apple HIG).
- **If list browsing is goal-less and homogeneous (feed):** infinite scroll is acceptable, with position restored on Back.
- **If users search, compare, or need the footer (shops, docs, search results):** load more or pagination. Baymard ranges: categories 10 to 30 lazy-loaded to 50 to 100, then "Load more"; search 25 to 75; mobile 15 to 30 before "Load more". Restore position with `history.pushState()`.
- **If the app has more than about 20 destinations or power users:** add a command palette as an accelerator, never the only path (Nielsen H7; opinion on threshold). How: design-product-ui `references/02-find-and-command.md`.
- **If a page is deeper than 2 levels:** breadcrumbs, with the current page unlinked.

## Filters (faceted navigation)
- **Live vs batch:** update results live when they return in under 1 s and users are exploring; use batch with an Apply button when results are slow or users set several filters at once, which is common on mobile (NN/g "Applying filters").
- **Mobile placement:** a tray that slides in from the right over dimmed results, not a separate screen, so results stay in view; entry labelled "Filter", not an icon alone (NN/g mobile faceted search).
- **Counts:** keep the total result count visible at all times; show counts per facet value so people avoid zero-result combinations (NN/g). Label the batch button with the outcome, "Show 128 results" (opinion, common practice).
- **While updating:** dim the results and show one progress indicator; do not let items flicker one by one (NN/g).
- **Applied filters:** removable chips above results plus "Clear all"; every filter state in the URL (opinion; Vercel deep links).
- **Zero results:** never a dead end. Name the filter that emptied the list and offer to remove it (see 04 empty states).

## Labels
- Nouns for places ("Invoices"), verbs for actions ("Create invoice").
- Single words where possible on tab bars (Apple HIG).
- Front-load the distinguishing word: "Billing settings" not "Settings for billing".
- Avoid clever names. "Inbox" beats "Hub".

## Numbers
| Thing | Value | Source |
|---|---|---|
| Native tabs and width classes | see design-playbook-mobile `references/platform-conventions.md` | Apple HIG; Android |
| Web breakpoints | sm 640, md 768, lg 1024, xl 1280, 2xl 1536 | FOUNDATIONS |
| Load more batch (e-commerce) | see decision rules | Baymard |

## Do and don't
- Do: bottom tab bar Home / Search / Library / Profile on iOS. Don't: a hamburger in the top-left corner hiding all four.
- Do: sidebar with "Projects, Reports, Team" headings and active highlight. Don't: 14 ungrouped icons without labels.
- Do: "Load more (showing 48 of 312)". Don't: infinite scroll on a store where shipping info sits in the footer.

## Worked example: B2B SaaS with 9 sections, web and mobile
1. Usage data says Dashboard, Projects, Inbox, Reports are daily; Billing, Team, Integrations, API keys, Audit log are monthly.
2. Desktop: left sidebar. Group 1 (no heading): Dashboard, Projects, Inbox, Reports. Group "Workspace": Team, Integrations, Billing. Group "Developer": API keys, Audit log. Search plus Cmd+K at top. Collapses to icon rail under 1024 px.
3. Mobile web or native: tab bar with 4 daily items plus "More" holding the 5 monthly items as a grouped list. Create action as a toolbar button, not a tab.
4. URLs: `/projects?status=active&owner=me`, every tab in Reports is a route.
5. Why: daily items get one tap; monthly ones are 2 taps and named; nothing hidden behind an unlabeled icon.

## Expert moves
- **Navigation persistence per tab.** Each tab keeps its own navigation stack (Apple HIG Tab bars: tabs preserve navigation state). Tapping the active tab pops to its root, and tapping again scrolls to top (observed convention in Apple system apps; opinion, not stated in HIG).
- **Scroll position is part of navigation.** Restoring it on Back is the single most commonly broken behavior (Baymard: over 90% of "load more" sites failed).
- **Size the scrollbar to the full list** before items load so the footer is reachable without jumps (Baymard).
- **Don't trust thumb-zone heatmaps.** Hoober retracted his 2013 drawings; people prefer the screen center and adjust grip (Hoober 2017). Put primary content center, navigation on edges.
- **Prediction cones.** Submenus should tolerate diagonal mouse travel toward the open panel so they do not close (Vercel "forgiving interactions"; classic Amazon mega menu technique).

## Hand-offs
- Search UI and SEO of navigation: design-search.
- Grid and breakpoint layout: design-layout.
- Label wording: design-copy.
- Funnel navigation (removing nav on checkout or landing pages): sales-funnels.
