# Tables and lists

Jobs: dashboard, mobile app. Sources observed 2026-10-10. Source type per entry: **live page** (fetched or rendered today) or **Mobbin** (none yet; the Mobbin connector needs a paid plan). Opinion is marked (opinion).
Floor rules live in [../../../skills/design-product-ui/references/01-tables.md](../../../skills/design-product-ui/references/01-tables.md) (alignment, tabular figures, sort semantics, responsive order) and [../../../skills/design-product-ui/references/05-states-bulk.md](../../../skills/design-product-ui/references/05-states-bulk.md) (bulk and empty states); this file is the ceiling: what the best shipped examples do.

## What the best examples do

1. **Selection is a keyboard verb, not only a checkbox.** Linear: highlight a row and press `X`; Shift plus arrow grows a range; the checkbox only appears when you "hover near the left edge of an issue"; `Esc` clears. Then `Cmd/Ctrl K` or right-click acts on the whole selection. https://linear.app/docs/select-issues [live page]
2. **One view setting, two scopes.** Linear display options persist per person by default; "Set as default" pushes the same grouping, ordering and visible properties to "every other user in your workspace", and "Reset to default" undoes your own. Group headers "remain sticky as you scroll". https://linear.app/docs/display-options [live page]
3. **Ordering that surfaces live work.** Linear's list ordered by status shows "closest to done → farthest from done, followed by completed and canceled issues", so the backlog never pushes active rows off screen. Same page. [live page]
4. **Row actions: one door, one pulled-out action at most.** Primer DataTable puts row actions in the last column with a visually hidden "Actions" header; with several actions "start by pulling them into a dropdown menu ... Do not pull out more than 1 action". Danger items sit below a divider in that menu. https://primer.style/product/components/data-table/ and /guidelines/ [live page]
5. **Fewer columns, numbers right.** Primer: "It's easier to scan many rows than it is to scan many columns"; "Right-align numeric values and use the tabular-num font variant". Skeleton rows match column width, alignment and leading visual. https://primer.style/product/components/data-table/guidelines/ [live page]
6. **Explicit unknowns and fixed copy.** Vercel Geist: render a dash where a value is unknown, "Don't substitute N/A, null, or an empty string"; headers are Title Case nouns ("Requests (7d)"); relative time ("2m ago") until 7 days, then "Mar 14, 2026"; pagination reads "21–40 of 142". Rendered table measured: header row 36px, body row 40px. https://vercel.com/geist/table [live page]
7. **Density is a named system, header always matches.** IBM Carbon: five row heights, 24, 32, 40, 48, 64px; "The column header row should always match the row size of the table"; 64px only for two-line rows; toolbar 48px pairs with 48 and 64 rows, 32px toolbar with 24 and 32 rows. https://carbondesignsystem.com/components/data-table/style/ [live page]
8. **Batch mode replaces row actions.** Carbon: on first selection the batch action bar appears at the top of the table; "When batch mode is active, single action icons and overflow menus on the row should be disabled"; exit by Cancel or deselecting all. Overflow menus may show only on hover and focus, but on touch devices they persist. https://carbondesignsystem.com/components/data-table/usage/ [live page]
9. **Long lists paginate at 50, selection survives pages.** Shopify Polaris IndexTable: "Paginate when the current list contains more than 50 items"; Shift selects a range; an option selects "All" across pages; bulk actions hide only under 490px and only if not essential. https://polaris-react.shopify.com/components/tables/index-table (fetched through the Parallel extractor; the live URL now redirects to shopify.dev) [live page]
10. **Mobile list row: figure first, context second, chevron last.** Stripe Dashboard iOS: payouts rows show amount bold on line 1 ("$7,200.00"), "Deposited Tue, Jul 16" muted on line 2, bank glyph and "•• 4242" plus chevron trailing; payments rows lead with "$12.00 succeeded", then email, ID and time. Estimated from App Store screenshots. https://apps.apple.com/us/app/stripe-dashboard/id978516833 [live page]
11. **Swipe reveals a labeled, colored action.** Linear Mobile iOS inbox: a swipe exposes a large pill labeled "Unread" with icon; marketing copy: "Tap to take action, swipe to delete, snooze to deal with it later." https://linear.app/mobile and https://apps.apple.com/us/app/linear-mobile/id1645587184 [live page]
12. **Full swipe runs the first action; edges carry meaning.** Apple SwiftUI `swipeActions`: trailing edge by default; "a full swipe automatically performs the first action"; actions order from the originating edge; destructive role renders red; Mail's example puts toggle unread on leading, delete and flag on trailing. Material 3: "The primary action must be the final end-aligned option. A full swipe triggers this action", and swipeable items "should include alternative ways to access hidden actions, such as a more icon". https://developer.apple.com/documentation/swiftui/view/swipeactions(edge:allowsfullswipe:content:) and https://m3.material.io/components/lists/guidelines [live page]
13. **Let people pick the swipe.** Superhuman defaults left to Done and right to Reminder and lets users add or remove actions per direction; Gmail Android swipes can be archive, delete, mark read, move or snooze, with optional "Action confirmations"; Todoist offers Complete, Schedule, Delete, Reminders; iPhone Mail has Settings > Apps > Mail > Swipe Options. https://help.superhuman.com/hc/en-us/articles/46005742942861-Customizing-Swipes-and-Triage-Bar , https://support.google.com/mail/answer/6562?co=GENIE.Platform%3DAndroid&hl=en , https://www.todoist.com/help/articles/how-to-change-your-swipe-actions-D5DQOQz6 , https://support.apple.com/guide/iphone/iph376ef8aa3/ios [live page]

## Common structure

Dashboard table:
```
[Title + count]                        [Table actions]   (Primer, Carbon anatomy)
[Search/filter] [Display options: group, order, columns, density]
[ ] Name (row header, link) | Text | Status | Number (right) | ...  [hidden "Actions"]
[ ] ...rows 32 to 40px, header same height, sticky group headers
[Batch bar replaces toolbar while selected: "3 selected  Action  Action  Cancel"]
[Pagination: "21–40 of 142"  Previous  Next]
```
1. Title, optional subtitle, table-level actions and filter (Primer anatomy).
2. Column headers that sort; row header first; numeric columns right aligned.
3. Rows: one link, last-column actions (inline icon or menu).
4. Selection: checkbox column revealed on hover or always shown; keyboard `X` and Shift-range in expert tools.
5. Batch bar at the top on selection (Carbon); pagination at the bottom.

Mobile list:
```
[Large title]                                   [+]
[Segment tabs]            (Stripe: Payments | Invoices | ...)
[Filter chips: Status  Created]
( icon )  $12.00 succeeded                     >
          jenny.rosen@example.com
          Jul 15 at 12:48 PM
------- inset divider from text start -------
```
1. Leading status icon or avatar, bold primary figure or title, 1 to 3 muted lines, trailing chevron or meta.
2. Swipe: trailing for destructive or primary triage, leading for toggle (Apple); always mirrored in a menu (Material).
3. Long press or "Select" enters multi-select (Apple Mail, Todoist).

## Spacing and type conventions observed

| Product or system | Element | Value | How known | Link |
|---|---|---|---|---|
| Vercel Geist | Header cell | 36px tall, padding 0 8px, 14px/20px, weight 500 | measured with getComputedStyle | https://vercel.com/geist/table |
| Vercel Geist | Body cell | 40px tall, padding 10px 8px, 14px/20px, weight 400 | measured with getComputedStyle | https://vercel.com/geist/table |
| GitHub Primer | Header cell (normal) | 38px, padding 8px 12px 8px 16px, 12px, weight 600, gray background rgb(246,248,250) | measured with getComputedStyle | https://primer.style/product/components/data-table/ |
| GitHub Primer | Body row normal / spacious | 37px (padding 8px 12px 8px 16px) / 45px (padding 12px 16px); 49px when a row holds an icon button | measured with getComputedStyle | https://primer.style/product/components/data-table/ |
| IBM Carbon | Row heights | 24, 32, 40, 48, 64px | stated in docs | https://carbondesignsystem.com/components/data-table/style/ |
| IBM Carbon | Column header / row text | 14px semibold 600 / 14px regular 400 | stated in docs | same |
| IBM Carbon | Column padding, checkbox | 16px between columns; checkbox 20px with 16px side padding | stated in docs | same |
| IBM Carbon | Toolbar and batch bar | 48px (with lg, xl rows) or 32px (with xs, sm rows) | stated in docs | same |
| Material 3 | List item | label and leading padding 16dp, trailing right padding 24dp, targets 48dp; content top-aligns at 88dp+ | stated in docs | https://m3.material.io/components/lists/specs |
| Material 3 | Divider inset | 16dp left, 24dp right | stated in docs | same |
| Shopify Polaris | Pagination threshold | over 50 items | stated in docs | https://polaris-react.shopify.com/components/tables/index-table |
| Stripe Dashboard iOS | Payment row | 3 to 4 text lines, bold amount, about 44px status tile, chevron trailing, inset divider | estimated from screenshot | https://apps.apple.com/us/app/stripe-dashboard/id978516833 |
| Linear Mobile iOS | Inbox row | avatar about 40pt, title plus 1 to 2 muted lines, age right aligned ("1d", "1w") | estimated from screenshot | https://apps.apple.com/us/app/linear-mobile/id1645587184 |

## Mistakes they avoid

- **Every action inline on every row.** Primer caps pulled-out actions at one and puts the rest in a menu; Carbon disables row actions during batch mode so two action surfaces never compete.
- **Header and body at different heights.** Carbon forbids it explicitly ("Don't mix row heights for the table and header rows").
- **Blank or "null" cells.** Geist mandates a dash.
- **Swipe as the only path.** Material requires an alternative (more icon); Apple Mail also offers Select plus a toolbar Delete (https://support.apple.com/guide/iphone/delete-and-recover-emails-iphb02be90ba/ios).
- **Hover-only menus on touch.** Carbon keeps overflow menus visible when the device has no hover.
- **Swipe direction imposed.** Superhuman, Gmail, Todoist and iPhone Mail all let people choose; muscle memory differs across apps (opinion that this matters most for triage-heavy lists).
- **Too many columns.** Primer: swap rows and columns when columns would outnumber rows.
- **Backlog drowning active work.** Linear's status ordering puts in-progress rows first (opinion that this beats alphabetical status order for issue lists).

## Products to look at

- Linear: keyboard selection, sticky group headers, saved display options. https://linear.app/docs/select-issues , https://linear.app/docs/display-options
- Linear Mobile: swipe triage in the inbox. https://apps.apple.com/us/app/linear-mobile/id1645587184
- Stripe Dashboard iOS: dense money lists, segment tabs plus filter chips. https://apps.apple.com/us/app/stripe-dashboard/id978516833
- GitHub Primer DataTable: row actions, densities, column width modes. https://primer.style/product/components/data-table/
- IBM Carbon data table: row size system, batch bar. https://carbondesignsystem.com/components/data-table/usage/
- Vercel Geist table: content rules and measured row metrics. https://vercel.com/geist/table
- Shopify Polaris IndexTable: selection across pages, small-screen rules. https://polaris-react.shopify.com/components/tables/index-table
- Notion table view: wrap text per property, show or hide vertical lines, drag to resize columns. https://www.notion.com/help/tables
- Superhuman, Gmail, Todoist: configurable swipes. Links in item 13.
- Mobbin links pending: connector needs a paid plan.

## Gap: average vs best in class

An average product ships a static table with every action as an icon on every row, blank cells for missing data, one fixed density, and on phones either sideways scroll or a stack of label and value pairs; swipe, if present, is undiscoverable and has no menu twin. The best treat selection as a keyboard verb, collapse actions into one menu with one pulled-out action, size header and rows as one density system, let a view's grouping and ordering be saved per person or per workspace, and on phones lead each row with the figure people compare, with swipes that are labeled, mirrored in a menu and configurable. Gap score: 3 of 5 (opinion): the floor rules are well documented, but saved views, keyboard selection and configurable swipes are rare outside the leaders.

## Screenshots

| Path | Shows | Source URL | Owner | Captured |
|---|---|---|---|---|
| shots/04-tables-and-lists/vercel-geist-table.jpg | Geist interactive and full featured tables: 40px rows, right-aligned Charge column, striped rows | https://vercel.com/geist/table | Vercel | 2026-10-10 |
| shots/04-tables-and-lists/linear-multi-select-list.jpg | Linear issue list with sticky "In Review 12" group header and three rows selected by checkbox | https://linear.app/docs/select-issues | Linear | 2026-10-10 |
| shots/04-tables-and-lists/linear-ios-inbox.jpg | Linear Mobile inbox, one row mid-swipe revealing an "Unread" action | https://apps.apple.com/us/app/linear-mobile/id1645587184 | Linear | 2026-10-10 |
| shots/04-tables-and-lists/stripe-ios-payouts-list.jpg | Stripe Dashboard iOS balances key-value list and payouts list (amount, date, bank, chevron) | https://apps.apple.com/us/app/stripe-dashboard/id978516833 | Stripe | 2026-10-10 |

Images are (c) their owners, kept for internal reference and critique.
