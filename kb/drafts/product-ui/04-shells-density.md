# Navigation shells and density

The shell is the frame every screen sits in. People see it thousands of times, so it must recede and never move. Navigation pattern choice (bottom bar, rail, drawer) is in design-ux `references/02-navigation-ia.md`; density bands are in design-layout `references/05-page-composition-and-density.md`. Sources are claim IDs in `kb/research/product-ui/04-shells-density.md`. Opinion is marked (opinion).

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **One page header pattern on every screen**: title left, one primary action right, view options and filters directly below (design-playbook-dashboard non-negotiable 1). [judged]
2. **Current location marked** with `aria-current="page"` plus a non-color cue (weight or a selected surface), and the `<title>` matches the view. [lint partly, judged]
3. **Sidebar at most two levels**; deeper hierarchies move into the content area as a list or split view (N1). [judged]
4. **Do not hide the sidebar by default** on desktop; let people collapse it (N2). [judged]
5. **Skip link to `main`** before the shell. [judged]
6. **Density changes spacing and row height only**: type stays at 14px or more for UI text, targets stay 24px or more, focus rings unchanged (design-layout 05; FOUNDATIONS). [lint]
7. **No hover-only navigation**; menus open on click and keyboard. [judged]

### Standards
| Standard | Applies to |
|---|---|
| WCAG 2.4.1 | Skip link |
| WCAG 2.4.8 (AAA, recommended) | Location within a set of pages: breadcrumbs or a marked sidebar item |
| WCAG 3.2.3 | Navigation in the same order on every page |
| APG tabs | Arrow keys between tabs, Tab into the panel, automatic activation when panels are already loaded (N4, N5) |
| Apple HIG sidebars | Two levels, hideable, customisable (N1 to N3) |

### Decision rules
- **Tabs or links?** If switching changes the URL and loads a different page (Overview, Deployments, Settings of a project), it is navigation: a `nav` with links and `aria-current="page"`, styled as tabs. If it swaps panels of one view in place, use the APG tab pattern (N4). Generalists put `role="tablist"` on route links, which breaks expected link behavior (open in new tab, Back).
- **Breadcrumbs?** Only when the hierarchy is 3 or more levels deep (Workspace / Project / Deployment). Show the hierarchy, not history; the last crumb is the current page and not a link (N6 to N9).
- **Scope switcher.** Multi-team or multi-workspace tools put the scope switcher at the top of the sidebar or the start of the top bar; everything below is scoped by it (N10).
- **Sidebar width.** 240px default at lg (1024) and up (opinion; inside the 220 to 280 range common in exemplars, unmeasured). Collapsed rail 56px with icon plus tooltip. Below lg: a menu button opens the sidebar as a modal drawer.
- **Pinned and recent.** For tools with many objects, add a "Shortcuts" or "Favorites" group of pinned and recent items (N16; N3).
- **Density default.** Default (40px rows) for mixed audiences; compact (32px) as the default only for daily expert tools (trading, support queues, issue trackers). Offer a switch only in tools used daily (design-layout 05). Coarse pointers (`@media (pointer: coarse)`) never get compact.
- **Phone shell (under 640).** Top bar keeps the title and the one primary action; navigation goes to a menu button or a bottom bar per design-ux 02; filters collapse to one "Filter" button with a count.

### Numbers
| Thing | Value | Source |
|---|---|---|
| Sidebar | 240px expanded, 56px rail | opinion |
| Top bar height | 56px (48px compact) | opinion; on the 4px grid via padding 8 or 12 plus 40px controls |
| Nav item | 32px tall compact, 36 to 40 default, `--text-sm`, icon 16px, gap 8 or 12 | opinion; FOUNDATIONS spacing |
| Page header | title `--text-lg` 20 or `--text-xl` 25, weight 600 | design-typography 04 |
| Content padding | 16 under 640, 24 at md, 32 at lg and up | FOUNDATIONS layout gaps |
| Density rows | 32 compact, 40 default, 48 comfortable | design-layout 05; Carbon N14 |

## Ceiling: exemplar patterns and signature moves

### Exemplar patterns (public docs and teams' own writing)
- **Linear**: sidebar, tabs, headers and panels redesigned "to reduce visual noise"; themes generated from base, accent and contrast, which yields high-contrast themes automatically (N11 to N13).
- **Vercel Dashboard**: scope selector switches team and scopes every tab beneath it (N10).
- **Stripe Dashboard**: sidebar sections for core objects, a Shortcuts section of pinned and recent pages, product areas below (N16).
- **Apple (macOS, iPadOS)**: two-level sidebars that people can hide and customise (N1 to N3).

### Signature moves
1. **Chrome one step from the canvas.** Sidebar and top bar use `--color-bg`; the working area uses `--color-surface`; they differ by one small lightness step plus a 1px `--color-border` hairline. No dark slab sidebar (N11; design-playbook-dashboard move 1).
2. **Selected item: surface plus weight, not color alone.** Selected nav item gets a subtle selected surface and weight 600; the icon does not change color unless the theme accent is the only cue (N17).
3. **Density as one attribute.** `[data-density="compact"]` on the root remaps three tokens (row height, cell padding, control height); components read the tokens, so the switch never needs per-component code (opinion; same idea as Linear's three-variable themes N12).
4. **The shell never moves.** Page changes swap the content area only; the header, sidebar and scroll position of the sidebar stay put. No page-level fade on navigation (design-ux expert move 1).
5. **Route tabs are links.** Project tabs are a `nav` of links that can be opened in a new tab and work with Back (APG scope, opinion on application).
6. **Contrast as a theme input.** Offer an "Increase contrast" setting that strengthens borders and muted text instead of a separate theme (N12, N13).

### Do and don't
| Do | Don't |
|---|---|
| Sidebar on the same neutral as the top bar | Dark brand-colored sidebar on a light app |
| `nav` links styled as tabs for routes | `role="tablist"` on route links |
| Compact mode that keeps 14px text | Compact mode that drops to 12px body text |
| Breadcrumbs at 3+ levels, last crumb plain text | Breadcrumbs on a two-level app |

### Worked examples
**Tally (slice brief B).** Sidebar 240px: workspace switcher at top ("Tally, Acme Inc."), Analytics group (Overview, Events, Funnels, Retention, Users), Workspace group (Settings), footer with "Commands ⌘K" and help. Page header: "Overview" title, date range and "Share report" primary on the right, then a toolbar row with segment filter and density toggle. Compact density: rows 32, panel padding 12, control height 32 (desktop only). Phone: menu button, title, primary action as an icon-plus-label button; KPIs and table follow.

**Admin console with 14 sections.** Group into 3 sidebar groups of 4 to 5 by task frequency; rarely used sections under "More". Per-project settings reachable through project route tabs (`nav` links) and breadcrumbs "Acme / Billing API / Settings".

## Hand-offs
- Navigation pattern chooser and mobile nav: design-ux `references/02-navigation-ia.md`.
- Grids, container widths and breakpoints: design-layout `references/01-grids-and-structure.md`, `04-responsive-and-adaptive.md`.
- Theme tokens and contrast: design-color `references/ui-tokens-themes.md`.
