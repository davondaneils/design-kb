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
| Web app, desktop (lg 1024 and up) | 5 to 15 | Left sidebar, collapsible to icons | Group with section headings; pin search or Cmd+K at top |
| Web app, tablet (md 768 to 1023) | 3 to 7 primary | Icon rail with labels, or collapsible sidebar | Mirrors Android rail at 600 to 839 dp |
| Native iOS | 3 to 5 | Tab bar (floating in iOS 26) | Never hide or disable tabs; no "More" overflow if avoidable; sidebar-convertible on iPad |
| Native Android compact | 3 to 5 | Navigation bar | Rail at medium and up; drawer optional at expanded (840 dp+) |
| Deep content (docs, settings) | many | Sidebar tree plus in-page table of contents plus search | Breadcrumbs on deep pages |

## Decision rules
- **If there are more than 5 primary destinations on mobile:** cut or regroup to 5. Overflow goes to a "More" or profile tab, ranked by usage data. Never put actions (Create, Share) in the tab bar; use a toolbar or floating button.
- **If the brand wants a hamburger on desktop:** decline. Desktops have room; NN/g recommends showing top-level nav across the top or down the left.
- **If items exceed width:** priority+ (show most used, rest behind "More") rather than collapsing everything (Brad Frost).
- **If a section is temporarily empty:** keep its tab or link enabled and explain inside (Apple HIG).
- **If list browsing is goal-less and homogeneous (feed):** infinite scroll is acceptable, with position restored on Back.
- **If users search, compare, or need the footer (shops, docs, search results):** load more or pagination. Baymard ranges: categories 10 to 30 lazy-loaded to 50 to 100, then "Load more"; search 25 to 75; mobile 15 to 30 before "Load more". Restore position with `history.pushState()`.
- **If the app has more than about 20 destinations or power users:** add a command palette (Cmd/Ctrl+K) as an accelerator, never as the only path (Nielsen H7 flexibility; opinion on threshold).
- **If a page is deeper than 2 levels:** breadcrumbs, with the current page unlinked.

## Labels
- Nouns for places ("Invoices"), verbs for actions ("Create invoice").
- Single words where possible on tab bars (Apple HIG).
- Front-load the distinguishing word: "Billing settings" not "Settings for billing".
- Avoid clever names. "Inbox" beats "Hub".

## Numbers
| Thing | Value | Source |
|---|---|---|
| iOS tabs | 5 or fewer default | Apple HIG |
| Android width classes | compact under 600 dp, medium 600 to 839, expanded 840 to 1199, large 1200 to 1599, xl 1600+ | Android |
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
- **Navigation persistence per tab.** Each tab keeps its own stack; tapping the active tab pops to root, tapping again scrolls to top (iOS convention; Apple HIG "preserving navigation state").
- **Scroll position is part of navigation.** Restoring it on Back is the single most commonly broken behavior (Baymard: over 90% of "load more" sites failed).
- **Size the scrollbar to the full list** before items load so the footer is reachable without jumps (Baymard).
- **Don't trust thumb-zone heatmaps.** Hoober retracted his 2013 drawings; people prefer the screen center and adjust grip (Hoober 2017). Put primary content center, navigation on edges.
- **Prediction cones.** Submenus should tolerate diagonal mouse travel toward the open panel so they do not close (Vercel "forgiving interactions"; classic Amazon mega menu technique).

## Hand-offs
- Search UI and SEO of navigation: design-search.
- Grid and breakpoint layout: design-layout.
- Label wording: design-copy.
- Funnel navigation (removing nav on checkout or landing pages): sales-funnels.
