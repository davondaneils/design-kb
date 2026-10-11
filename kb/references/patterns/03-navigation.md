# Navigation

Jobs: dashboard, mobile app. Sources observed 2026-10-10. Source type per entry: **live page** (fetched or rendered today) or **Mobbin** (none yet; the Mobbin connector needs a paid plan). Opinion is marked (opinion).
Floor rules live in [../../../skills/design-ux/references/02-navigation-ia.md](../../../skills/design-ux/references/02-navigation-ia.md) (pattern chooser by platform and item count, labels, filters) and [../../../skills/design-product-ui/references/04-shells-density.md](../../../skills/design-product-ui/references/04-shells-density.md) (shell, sidebar width, route tabs as links); this file is the ceiling: what the best shipped examples do.

## What the best examples do

1. **Sidebar in labeled groups, personal items first.** Linear (demo workspace, rendered): an unlabeled top group (Inbox, My issues, Agent), then "Workspace", "Favorites" and "Your teams" groups with 12px / 500 headings and a collapse caret; team sub-items indent one level (Triage, Issues, Cycles, then Current and Upcoming under Cycles). Counts sit right-aligned in 12px ("22", "13"). https://linear.app/demo [live page]
2. **Every nav item advertises its keyboard path.** Linear: hovering "My issues" shows a tooltip "Go to my issues  G then M". The mouse path teaches the faster path. https://linear.app/demo [live page]
3. **Let people shape the sidebar.** Linear: "You can reorder items, hide items you don't use often, and decide how unread notifications should be shown: with a count or dot"; hidden items go "behind a More menu"; right-click an item or choose "Customize sidebar". A collapsed sidebar opens "by moving the cursor close to the left edge". https://linear.app/changelog/2024-12-18-personalized-sidebar and https://linear.app/changelog/page/11 [live page]
4. **A section that fills itself from your history.** Stripe Dashboard: "Use the Shortcuts section to display your pinned and most recently visited pages. After you visit a page, it appears under this section, where you can pin it." Press "?" for the shortcut list. https://docs.stripe.com/dashboard/basics [live page]
5. **Route tabs are links with live counts.** GitHub repository nav (rendered, logged out): Code, Issues 1.1k, Pull requests 2.5k, Discussions, Actions, Security and quality 69, Insights; current tab has `aria-current="page"` and a 2px underline. Primer: "wait for all the data to be ready before displaying the counters, so you can avoid multiple layout shifts." https://github.com/vercel/next.js/issues and https://primer.style/product/components/underline-nav [live page]
6. **At phone width, tabs overflow into "More" and the side nav becomes a title menu.** GitHub at 390px: only Code and Issues stay visible, the rest go behind "More"; the issues sidebar (Assigned to me, Created by me, Mentioned) disappears and the page title becomes "Issues" with a dropdown caret. https://github.com/vercel/next.js/issues [live page]
7. **iOS tab bar: places only, always there, never greyed out.** Apple HIG: "Use a tab bar to support navigation, not to provide actions"; "Don't disable or hide tab bar buttons, even when their content is unavailable ... If a section is empty, explain why"; labels: "Use single words whenever possible"; "Avoid overflow tabs" (the More tab hides content). https://developer.apple.com/design/human-interface-guidelines/tab-bars [live page]
8. **iOS 26 tab bar floats, can minimize, and can carry search.** Apple HIG: the tab bar "floats above content at the bottom of the screen"; with an accessory (Music's MiniPlayer) it can minimize on scroll down and restore on tap or scroll to top; "A tab bar can include a dedicated search tab at the trailing end." On iPad it can convert to a sidebar; if tabs are customizable, "aim for a default list of five or fewer." https://developer.apple.com/design/human-interface-guidelines/tab-bars [live page]
9. **Sidebar depth: two levels, discoverable, hideable.** Apple HIG sidebars: "show no more than two levels of hierarchy"; deeper data moves to a split view with a content list; "Avoid hiding the sidebar by default"; "let people customize the contents"; on macOS avoid "critical information or actions at the bottom of a sidebar." https://developer.apple.com/design/human-interface-guidelines/sidebars [live page]
10. **Android: bar for 3 to 5, rail for 3 to 7, labels mandatory.** Material 3 (rendered): navigation bar "three to five destinations", "Don't remove the labels", label "1-2 words", filled icon when active, fixed positions, "Don't use navigation bars for desktop layouts". Rail: collapsed rail holds "3–7 navigation items" and "should not be hidden"; "Compact windows should always use a navigation bar." https://m3.material.io/components/navigation-bar/guidelines and https://m3.material.io/components/navigation-rail/guidelines [live page]
11. **Mobile bottom bar the user can rearrange.** Linear Mobile (Jan 2026): "Personalize the bottom toolbar to prioritize the features you use the most. Rearrange the main navigation items, or pin specific projects, initiatives, and documents for quick access." https://linear.app/changelog/2026-01-22-customize-your-navigation-in-linear-mobile [live page]
12. **Three tabs, core action in the middle.** Cash App iOS App Store screenshot: a 3-item bottom bar (bank, $, clock icons), the $ tab is the Pay keypad and is the active, darker item; no text labels. Estimated from App Store screenshot. (opinion: icon-only works here only because there are 3 tabs and the $ glyph is the product; Material forbids dropping labels.) https://apps.apple.com/us/app/cash-app/id711923939 [live page]
13. **Top category tabs inside one destination.** Airbnb iOS App Store screenshot: under the "Start your search" pill, three illustrated tabs Homes, Experiences, Services; selected = bold label plus underline; the two newer tabs carry a "NEW" badge. Category switching stays out of the bottom bar. Estimated from App Store screenshot. https://apps.apple.com/us/app/airbnb/id401626263 [live page]

## Common structure

Dashboard (web SaaS):
```
+ Sidebar (~244px) -----------+ Content pane ------------------------+
| Workspace switcher | Sign up |  Page title         [view tabs as links]
| Inbox (count)                |  Toolbar / filters
| My issues                    |
| -- Workspace -------------   |
|   Projects, Views, More      |
| -- Favorites / Shortcuts --  |  (pinned + recent, user curated)
| -- Your teams -------------  |
|   Team > Issues, Cycles      |  (2 levels max)
| Help / What's new (bottom)   |
+------------------------------+--------------------------------------+
Hover any item: tooltip with keyboard path. Phone: sidebar -> title dropdown or drawer, tabs -> priority+ "More".
```

Mobile app:
```
Top: title or search pill, optional category tabs (Airbnb) for content inside one place
Bottom: 3 to 5 labeled tabs, places only, filled icon when active, badge for critical counts
Never hide or disable a tab; overflow by customization (Linear Mobile, iPad) not a "More" tab
```

## Spacing and type conventions observed

| Product or system | Element | Value | How known | Link |
|---|---|---|---|---|
| Linear (demo) | Sidebar width | 244px | measured with getComputedStyle | https://linear.app/demo |
| Linear (demo) | Nav item | 28px tall, 29px pitch, radius 8px, 13px / 500 text | measured with getComputedStyle | https://linear.app/demo |
| Linear (demo) | Group heading / counts | 12px / 500 heading; 12px / 450 counts, right-aligned | measured with getComputedStyle | https://linear.app/demo |
| Linear (demo) | Selected item | surface lch 89.5 on canvas lch 97.9; text darkens from lch 37.8 to 9.4 | measured with getComputedStyle | https://linear.app/demo |
| GitHub | Repo underline nav item | 32px tall, 14px / 400, current marked by 2px underline | measured with getComputedStyle | https://github.com/vercel/next.js/issues |
| GitHub | Counter pill | 18px tall, 12px / 600, radius 20px | measured with getComputedStyle | https://github.com/vercel/next.js/issues |
| GitHub | Issues sidebar item | 208 x 32px, 14px, radius 6px, `aria-current="page"` on active | measured with getComputedStyle | https://github.com/vercel/next.js/issues |
| Apple HIG | iOS tab count | five or fewer default when customizable; avoid More overflow | stated in docs | https://developer.apple.com/design/human-interface-guidelines/tab-bars |
| Apple HIG | Sidebar depth | 2 levels max | stated in docs | https://developer.apple.com/design/human-interface-guidelines/sidebars |
| Material 3 | Navigation bar | 3 to 5 destinations, labels 1 to 2 words | stated in docs | https://m3.material.io/components/navigation-bar/guidelines |
| Material 3 | Navigation rail (collapsed) | 3 to 7 items, medium window and up | stated in docs | https://m3.material.io/components/navigation-rail/guidelines |
| Material 3 | State layers on nav items | hover 8%, focus 10%, pressed 10% | stated in docs | https://m3.material.io/components/navigation-bar/specs |

## Mistakes they avoid

- **Actions in the tab bar.** Apple: "If you need to provide controls that act on elements in the current view, use a toolbar instead." Cash App's center tab is a place (the Pay screen), not a one-shot action.
- **Disabled or disappearing tabs.** Apple keeps tabs enabled and explains empty sections inside.
- **A "More" tab on phones.** Apple calls it out; Linear Mobile and iPad tab bars use customization instead.
- **Counters that pop in one by one.** Primer waits for all counters before rendering.
- **Sidebars three levels deep.** Linear stops at Team > Cycles > Current/Upcoming; Apple caps at two and moves deeper data into a list column.
- **Icon-only bars with 4 or 5 tabs.** Material requires labels (opinion: Cash App gets away with 3 icons; most apps with 5 would not).
- **Desktop hamburger.** Linear and GitHub keep the sidebar visible on desktop; GitHub only collapses at phone width.
- **Hidden mouse-only paths.** Linear prints the keyboard route in every nav tooltip.

## Products to look at

- Linear: grouped sidebar, shortcut tooltips, customization. https://linear.app/demo and https://linear.app/changelog/2024-12-18-personalized-sidebar
- Linear Mobile: customizable bottom toolbar and pins. https://linear.app/changelog/2026-01-22-customize-your-navigation-in-linear-mobile
- Stripe Dashboard: self-filling Shortcuts section. https://docs.stripe.com/dashboard/basics
- GitHub: route tabs with counters, phone overflow to More, sidebar to title dropdown. https://github.com/vercel/next.js/issues
- Cash App iOS: 3-tab bar with the core screen centered. https://apps.apple.com/us/app/cash-app/id711923939
- Airbnb iOS: category tabs under the search pill, NEW badges. https://apps.apple.com/us/app/airbnb/id401626263
- Apple HIG tab bars and sidebars. https://developer.apple.com/design/human-interface-guidelines/tab-bars
- Material 3 navigation bar and rail. https://m3.material.io/components/navigation-bar/guidelines
- Mobbin links pending: connector needs a paid plan.

## Gap: average vs best in class

An average dashboard ships a flat list of 12 to 15 icon links in a dark sidebar, a hamburger on mobile, and route tabs built as `role="tablist"`; an average app puts Create in the tab bar and hides tabs by state. The best group the sidebar by who it is for (me, workspace, favorites, teams), keep it at 2 levels with live counts, teach keyboard paths on hover, let people reorder and pin, and degrade to priority+ tabs and a title dropdown on phones; on native they keep 3 to 5 labeled places that never disappear. Gap score: 3 of 5 (opinion: the structure is well known; personalization and keyboard teaching are where most products fall short).

## Screenshots

| Path | Shows | Source URL | Owner | Captured |
|---|---|---|---|---|
| shots/03-navigation/linear-sidebar-shortcut-tooltip.jpg | Linear grouped sidebar with counts, selected "My issues", hover tooltip "Go to my issues G then M" | https://linear.app/demo/my-issues/assigned | Linear | 2026-10-10 |
| shots/03-navigation/github-repo-underline-nav-and-sidebar.jpg | GitHub repo underline nav with counters plus issues sidebar at 1440px | https://github.com/vercel/next.js/issues | GitHub | 2026-10-10 |
| shots/03-navigation/github-repo-nav-mobile-overflow.jpg | Same page at 390px: tabs overflow to "More", sidebar becomes "Issues" title dropdown | https://github.com/vercel/next.js/issues | GitHub | 2026-10-10 |
| shots/03-navigation/cashapp-ios-tab-bar-appstore.jpg | Cash App App Store screenshot: Pay keypad with 3-icon bottom tab bar, $ tab active | https://apps.apple.com/us/app/cash-app/id711923939 | Block, Inc. (Cash App) | 2026-10-10 |
