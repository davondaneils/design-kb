# Filters and search

Jobs: dashboard, mobile app. Sources observed 2026-10-10. Source type per entry: **live page** (fetched or rendered today) or **Mobbin** (none yet; the Mobbin connector needs a paid plan). Opinion is marked (opinion).
Floor rules live in [../../../skills/design-product-ui/references/02-find-and-command.md](../../../skills/design-product-ui/references/02-find-and-command.md) (filter placement, live vs batch, URL state, chips) and [../../../skills/design-ux/references/02-navigation-ia.md](../../../skills/design-ux/references/02-navigation-ia.md) (faceted filters, mobile tray, counts); this file is the ceiling: what the best shipped examples do.

## What the best examples do

1. **Filters read as an editable sentence.** Linear chips are three parts: field, operator, value ("Assignee | is any of | 3 assignees", "Labels | include | Feature"), each with its own remove button. "Clicking on is will give you the option to change the operator"; the field itself is fixed. Operators adapt: "is or is not" for one value, "is either of" for several, "before or after" for dates. https://linear.app/docs/filters [live page]
2. **Filtered counts stay honest.** Linear group headers under a filter show filtered over total ("In Review 2 / 11", "In Progress 1 / 12"), and a right-aligned "Match all filters" toggle shows the logic. Seen in Linear's own docs image. https://linear.app/docs/filters [live page]
3. **Fast entry, then power.** Linear: press `F` to open the filter menu; typing a property value name directly offers it as a filter ("Quick search filters"); "Advanced filter" builds nested AND/OR groups; "Filter with AI" accepts phrases like "Show me issues assigned to me". Same page. [live page]
4. **A filtered view is one keystroke from saved.** Linear: save any filtered list "with the keyboard shortcut Option/Alt V", and the save icon only appears "after you've added at least one filter". https://linear.app/docs/custom-views [live page]
5. **Saved views as tabs with a lifecycle.** Shopify Polaris IndexFilters: tabs are saved views people can "create, rename, duplicate, or delete"; a search-and-filter button switches the table from View mode to Filter mode; editing a view offers Save or Save as new; "Include no more than 2 or 3 promoted filters". https://polaris-react.shopify.com/components/selection-and-input/index-filters (fetched through the Parallel extractor; the live URL now redirects to shopify.dev) [live page]
6. **Scope of a saved filter is explicit.** Notion: when adding a filter or sort, "Save for everyone" applies it to all viewers; leave it off and it applies only to you. Advanced filter groups combine AND and OR "nested up to three layers deep". https://www.notion.com/help/views-filters-and-sorts [live page]
7. **Structured search that teaches itself.** GitHub issues: the search field holds the query as text ("is:issue state:open"); "As you type your filter, GitHub will show available qualifiers, suggest values, and warn when there is a problem"; AND, OR and parentheses nest up to five levels; a space means AND. https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/filtering-and-searching-issues-and-pull-requests [live page]
8. **The URL is the saved state.** GitHub: "your browser's URL is automatically updated to match the new view", e.g. `/issues?q=state:open+is:issue+assignee:hubot+sort:created-asc`. Stripe Dashboard search accepts typed filters (`amount:149.99`, `country:GB`, `created:2020/07/12`) and `is:` for object type or state. https://docs.stripe.com/dashboard/search [live page]
9. **Search previews, then expands to a table.** Stripe Dashboard: "the top results appear immediately"; Enter or "View all results" opens groups, and "View all" in a group opens "an expanded display with column headings, some of which provide sorting options". Stripe iOS mirrors it: scope tabs (All, Customers, Payments, Invoices, Subscriptions), grouped sections, each with "View all". https://docs.stripe.com/dashboard/search and https://apps.apple.com/us/app/stripe-dashboard/id978516833 [live page]
10. **Mobile filter sheet with a live outcome button.** Airbnb mobile web, rendered at 390px: a "Filters" sheet with "Search all filters", "Recommended for you" tiles, a segmented "Type of place" control, sections for price, rooms, amenities. Footer: "Clear all" (muted until something is set) and a dark button reading "Show 1,000+ places", which changed to "Show 38 places" after tapping Hotel; the recommended tiles also changed. https://www.airbnb.com/s/Lisbon--Portugal/homes [live page]
11. **Quick filters stay outside the sheet.** Airbnb results page shows one-tap chips under the search pill (Washer, Instant Book, Free parking, Hot tub) next to a filter icon button labelled "Show filters"; Stripe iOS puts "Status" and "Created" chips directly above the payments list. Same URLs. [live page]
12. **Platform search grammar on mobile.** Apple HIG: scope bars "filter among clearly defined search categories" and should "Default to a broader scope"; tokens are selectable, editable search terms, best "paired with search suggestions" so people learn them. Material 3: results list sits below the bar and "scroll beneath the bar"; suggestions can carry category labels such as Recent and filter chips. https://developer.apple.com/design/human-interface-guidelines/search-fields and https://m3.material.io/components/search/guidelines [live page]

## Common structure

Dashboard list page:
```
[View tabs / saved views: All | Unfulfilled | My view | +]          (Polaris, Notion)
[Search field "is:issue state:open"      ] [Filter (F)] [Sort] [Display]
[Assignee | is any of | 3 assignees  x] [Labels | include | Feature  x] [+]   Match all filters
[Save view (Alt V)]  appears once a filter differs from the saved view
[Group header  In Review  2 / 11]
[rows...]
```
1. Saved views on top as tabs or sidebar items; default view broad.
2. One search field that accepts plain text and typed qualifiers.
3. Filter chips as field, operator, value; each removable; global AND/OR toggle.
4. Save or Save as new appears only when state is dirty.
5. State mirrored in the URL.

Mobile:
```
[Search pill / title]                         [filter icon]
[Quick chips: Status  Created  ...]  (scrolls sideways)
[results]
--- tap filter icon ---
[Sheet: Filters                       x]
[Search all filters]
[Sections: segmented control, ranges, checklists]
[Clear all]              [Show 38 places]
```
Mobile search: scope tabs under the field, results grouped by type, "View all" per group, Cancel trailing the field (Stripe iOS).

## Spacing and type conventions observed

| Product or system | Element | Value | How known | Link |
|---|---|---|---|---|
| Airbnb mobile web | Quick filter chip | 34px tall, padding 8px 12px, 12px text, weight 400, radius 24px, 1px border rgb(221,221,221) | measured with getComputedStyle at 390px | https://www.airbnb.com/s/Lisbon--Portugal/homes |
| Airbnb mobile web | Sheet footer buttons | "Clear all" text button and "Show N places" filled button, both 40px tall, 14px weight 500, radius 12px, fill rgb(34,34,34) | measured with getComputedStyle at 390px | same |
| Airbnb mobile web | "Show N places" width | 168px at "1,000+" label | measured | same |
| GitHub | Issues search input | 30px tall, 14px Mona Sans, full width (1062px at 1440 viewport), prefilled "is:issue state:open" | measured with getComputedStyle | https://github.com/vercel/next.js/issues |
| GitHub | Open / Closed counts | "Open 1,091", "Closed 24,449" beside the list | observed in rendered page | same |
| Polaris | Promoted filters | 2 or 3 at most | stated in docs | https://polaris-react.shopify.com/components/selection-and-input/index-filters |
| Notion | Advanced filter nesting | up to 3 levels | stated in docs | https://www.notion.com/help/views-filters-and-sorts |
| GitHub | Query nesting | up to 5 levels | stated in docs | GitHub link above |
| Linear | Filter chip | segmented pill: icon plus field, muted operator, value with avatars, close button; about 28px tall | estimated from docs screenshot | https://linear.app/docs/filters |
| Stripe iOS | Filter chips | outlined pills about 32pt tall above list, under segment tabs | estimated from App Store screenshot | https://apps.apple.com/us/app/stripe-dashboard/id978516833 |

## Mistakes they avoid

- **A filter count badge with no detail.** Linear shows every condition as a readable sentence chip; better than "Filters (3)".
- **Apply buttons that hide the outcome.** Airbnb labels the button with the live result count ("Show 38 places"), so a zero-result combination is visible before committing.
- **Clear all that looks active when nothing is set.** Airbnb renders it muted until a filter exists.
- **Burying common filters in the sheet.** Airbnb and Stripe iOS keep 2 to 5 quick chips outside; Polaris caps promoted filters at 2 or 3.
- **Ambiguous save scope.** Notion asks "Save for everyone" explicitly; Linear separates personal display options from "Set as default".
- **Syntax with no help.** GitHub suggests qualifiers and warns on errors as you type; Apple pairs tokens with suggestions.
- **Narrow default scope.** Apple: default broad and let people narrow; Stripe search starts at "All".
- **Losing state on refresh or share.** GitHub and Stripe write the query to the URL.
- **Nested AND/OR as the default UI.** Linear, Notion and GitHub all lead with simple chips or text and keep nesting behind "Advanced" (opinion: the default should never show a logic tree).

## Products to look at

- Linear: sentence chips, `F`, Alt V save, advanced and AI filters. https://linear.app/docs/filters , https://linear.app/docs/custom-views
- GitHub Issues: structured query in one field, URL sharing. https://github.com/vercel/next.js/issues , docs link in item 7
- Stripe Dashboard: typed search filters, preview then table. https://docs.stripe.com/dashboard/search
- Stripe Dashboard iOS: scope tabs, grouped results, chips over lists. https://apps.apple.com/us/app/stripe-dashboard/id978516833
- Shopify Polaris IndexFilters: saved-view tabs and View vs Filter mode. https://polaris-react.shopify.com/components/selection-and-input/index-filters
- Notion: per-filter save scope, advanced groups. https://www.notion.com/help/views-filters-and-sorts
- Airbnb mobile web: filter sheet with live count. https://www.airbnb.com/s/Lisbon--Portugal/homes
- Apple HIG search fields, Material 3 search. Links in item 12.
- Mobbin links pending: connector needs a paid plan.

## Gap: average vs best in class

An average product gives a search box that only matches names, a "Filters" button opening a form with an "Apply" button, a badge saying "3", and state lost on refresh; on mobile, a full-screen filter page that hides results and gives no count until you apply. The best make each filter a readable, editable sentence, show filtered over total counts, let a filtered state become a saved view in one keystroke with an explicit personal or shared scope, accept typed qualifiers with suggestions and write everything to the URL; on mobile they keep quick chips outside and put the live result count on the sheet's button. Gap score: 4 of 5 (opinion): saved views, operator-editable chips and live-count buttons are still uncommon outside the leaders.

## Screenshots

| Path | Shows | Source URL | Owner | Captured |
|---|---|---|---|---|
| shots/05-filters-and-search/linear-filters-applied.jpg | Linear list with two sentence filter chips, "Match all filters", group counts "2 / 11" | https://linear.app/docs/filters | Linear | 2026-10-10 |
| shots/05-filters-and-search/airbnb-mobile-filter-sheet.jpg | Airbnb mobile filter sheet after choosing Hotel: "Clear all" active, "Show 38 places" button, rendered at 390px | https://www.airbnb.com/s/Lisbon--Portugal/homes | Airbnb | 2026-10-10 |
| shots/05-filters-and-search/stripe-ios-search-results.jpg | Stripe Dashboard iOS search: query "ja", scope tabs, grouped Customers, Payments, Invoices with "View all" | https://apps.apple.com/us/app/stripe-dashboard/id978516833 | Stripe | 2026-10-10 |
| shots/05-filters-and-search/stripe-ios-payments-filter-chips.jpg | Stripe Dashboard iOS payments list with segment tabs and "Status" and "Created" filter chips | https://apps.apple.com/us/app/stripe-dashboard/id978516833 | Stripe | 2026-10-10 |

Images are (c) their owners, kept for internal reference and critique.
