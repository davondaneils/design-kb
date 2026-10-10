# Empty states

Jobs: dashboard, mobile app. Sources observed 2026-10-10. Source type per entry: **live page** (fetched or rendered today) or **Mobbin** (none yet; the Mobbin connector needs a paid plan). Opinion is marked (opinion).
Floor rules live in [../../../skills/design-ux/references/04-states-feedback.md](../../../skills/design-ux/references/04-states-feedback.md) (the state types and their contents) and [../../../skills/design-product-ui/references/05-states-bulk.md](../../../skills/design-product-ui/references/05-states-bulk.md) (panel-level empty, permission and partial states on dashboards); this file is the ceiling: what the best shipped examples do.

## What the best examples do

1. **Pick the variant by cause, and name them.** Vercel Geist: "no-results for a filtered list that returned zero rows, blank slate or informational for a resource the user hasn't created, cleared for completed work, permission for role or tier denials, error for a failed load." Four first-use flavors: Blank Slate, Informational, Educational, Guide (starter content). https://vercel.com/geist/empty-state [live page]
2. **First use explains the object, teaches the shortcut, offers one action.** Linear Views (demo workspace, rendered): 66 x 80px line illustration, title "Views", two short paragraphs ("Create custom views using filters ...", "You can also save any existing view by ... pressing Alt V"), then "Create new view" (filled) and "Documentation" (outline). Left-aligned 340px block centered in the pane. https://linear.app/demo/views [live page]
3. **Starter templates instead of a blank page.** Linear Loops first use: "Create a new loop", a prompt box ("Ask Linear to build the loop for you"), "Start from scratch", and "or pick a template" with 6 cards (Autofix bugs, Triage agent, Slack Q&A assistant, Weekly wrap, Feature request report, Security alerts), each a title plus one-line outcome. Carbon names this "starter content" and warns: "If your starter content can be deleted by your user, you will need a basic empty state as a back up." https://linear.app/demo and https://carbondesignsystem.com/patterns/empty-states-pattern/ [live page]
4. **An empty container still shows its frame and real numbers.** Linear upcoming cycle with no issues: header stays ("Cycle 76", Oct 23 to Nov 5), side panel shows "Capacity 0%", "Days to start 13", "Scope 0", and the body explains cycles in two lines plus "Create new issue". https://linear.app/demo/team/ENG/cycle/upcoming [live page]
5. **No results keeps the query, the count and the controls.** GitHub issues search (logged out, rendered): query stays in the field with a clear (x) button, toolbar reads "0 results" with all filters still visible, and the panel body says "No results matched your search" plus "Try a different search query." and a docs link. https://github.com/vercel/next.js/issues?q=is%3Aissue%20zzqqxxnomatch123 [live page]
6. **Quote the query, suggest the widening move.** Vercel Geist content rule: "No logs match "${query}". Clear the filter to see all logs."; for multi-facet filters "No {Items} Match Your Filters". After an async filter change, wrap the region in `aria-live="polite"`. https://vercel.com/geist/empty-state [live page]
7. **One primary action, a second only when there are two real paths.** Vercel: "Cap at one primary CTA, plus one secondary when the first action could legitimately be one of two paths (Import Repository and Deploy Template). Three CTAs is a smell." CTA labels are Verb + Noun, "Never Get Started, Continue, or OK." Polaris: "Use only one primary call-to-action button." https://vercel.com/geist/empty-state and https://polaris-react.shopify.com/components/layout-and-structure/empty-state [live page]
8. **Titles say what to do, not what is missing.** Polaris: title "Create orders and send invoices", not "Orders and invoices". Carbon: "Start by adding data assets" feels more positive than "You don't have any data assets." https://polaris-react.shopify.com/components/layout-and-structure/empty-state and https://carbondesignsystem.com/patterns/empty-states-pattern/ [live page]
9. **Many empty tiles on one dashboard: drop the art and demote the buttons.** Carbon: with several empty states at once, "use a tertiary button for the call to action" to avoid multiple primaries, and "an empty state that uses just text may be preferable" when many widgets fail together; empty state replaces the table, so column headers and footer are not shown. https://carbondesignsystem.com/patterns/empty-states-pattern/ [live page]
10. **Cleared state is a reward, scaled to frequency.** Superhuman: finishing the split inbox task list rewards you "with our daily Inbox Zero image and a weekly streak"; on iOS you can long-press to save the image. Atlassian: frequent messages "should be more concise and less delightful ... we want to give flowers not puppies." https://help.superhuman.com/hc/en-us/articles/46005833597709-Achieve-Inbox-Zero , https://new.superhuman.com/today's-inbox-zero-forever-229340 and https://atlassian.design/foundations/content/designing-messages/empty-state [live page]
11. **Mobile: use the system view so search and empty match the OS.** Apple SwiftUI `ContentUnavailableView` covers "a network error, a list without items, a search that returns no results"; Apple's own example: label "No Mail" (tray icon), description "New mails you receive will appear here."; `ContentUnavailableView.search` is a built-in variant for search. https://developer.apple.com/documentation/swiftui/contentunavailableview [live page]
12. **Mobile: the image must not look tappable.** Material: the basic empty state is "a non-interactive image and a text tagline"; "Don't use a tagline worded like a call to action, as empty tags aren't interactive". Starter content: "Give users the ability to delete and replace starter content." https://m2.material.io/design/communication/empty-states.html [live page]
13. **Mobile: the same no-results block shrinks, not reflows.** GitHub at 390px wide: title drops from 20px to 16px (600), icon, body and link stay centered inside the bordered results box, filters collapse to "Author" plus an overflow "...". Measured. https://github.com/vercel/next.js/issues?q=is%3Aissue%20zzqqxxnomatch123 [live page]

## Common structure

Full-pane first use (dashboard):
```
[illustration or icon, 32 to 80px, decorative alt=""]
Title (what this is, or what to do)        15 to 20px semibold
Body: 1 to 2 sentences, why it is useful, how to fill it, optional shortcut
[Primary Verb + Noun]  [Secondary: Docs or second real path]
(optional) starter templates / sample data below
```

Inside a panel or table (dashboard):
```
Toolbar stays: query, "0 results", filters
Body replaces rows: icon, "No X match 'query'", widen or clear action
```

Mobile:
```
Navigation and search field stay
Centered: SF Symbol or small icon, title, 1 line, optional button
Cleared state: celebratory image or line, next step or nothing
```

## Spacing and type conventions observed

| Product or system | Element | Value | How known | Link |
|---|---|---|---|---|
| Linear (demo) | Views empty block | 340px wide, left-aligned, centered in pane | measured with getComputedStyle | https://linear.app/demo/views |
| Linear (demo) | Illustration | 66 x 80px, 24px gap to title | measured with getComputedStyle | https://linear.app/demo/views |
| Linear (demo) | Title / body | 15px / 600, line height 23px; 13px / 450, line height 18.2px | measured with getComputedStyle | https://linear.app/demo/views |
| Linear (demo) | Buttons | 28px tall, fully rounded, 12px / 500 | measured with getComputedStyle | https://linear.app/demo/views |
| GitHub (desktop 1440px) | No-results title / body | 20px / 600 centered; 16px / 400 | measured with getComputedStyle | https://github.com/vercel/next.js/issues |
| GitHub (mobile 390px) | No-results title | 16px / 600 centered | measured with getComputedStyle | https://github.com/vercel/next.js/issues |
| Vercel Geist | Empty state icon | 32px (`size={32}` in examples) | stated in docs (code sample) | https://vercel.com/geist/empty-state |
| Shopify Polaris | Image spacing | ~40px white space above the image inside a card, modal or navigation | stated in docs | https://polaris-react.shopify.com/components/layout-and-structure/empty-state |
| Atlassian | Body / CTA length | body 1 to 2 sentences; CTA 1 to 2 words | stated in docs | https://atlassian.design/foundations/content/designing-messages/empty-state |
| Primer | Blankslate sizes | small, medium (default), large; narrow and spacious variants | stated in docs | https://primer.style/product/components/blankslate/ |

## Mistakes they avoid

- **"Get Started" buttons.** Vercel bans Get Started, Continue and OK on empty-state CTAs; Linear says "Create new view".
- **Hiding the query on no results.** GitHub keeps the query, the clear button and the filter bar; the fix is one click away.
- **Table headers over nothing.** Carbon replaces the table, headers and footer included, so a screen reader does not read empty columns first.
- **Five illustrated empty tiles on one dashboard.** Carbon: text only and tertiary buttons when several are empty at once.
- **Critical warnings inside an empty state.** Vercel: "Empty states vanish when the list populates; persistent warnings belong in Note or the page header."
- **Auto-starting a tour from an empty state.** Vercel: "Don't auto-launch a tour ... pair Start Tour with Skip."
- **Guilt copy.** Polaris: "never make merchants feel unsuccessful or guilty because they haven't used a product or feature."
- **Same party every time.** Atlassian scales delight down for frequent cleared states; Superhuman rotates a daily image (opinion: that rotation is what keeps the reward from going stale).

## Products to look at

- Linear: first-use views, starter templates for Loops, empty cycle with live numbers. https://linear.app/demo
- GitHub: no-results inside a list with toolbar intact, desktop and mobile. https://github.com/vercel/next.js/issues?q=is%3Aissue%20zzqqxxnomatch123
- Vercel Geist: variant chooser and copy templates. https://vercel.com/geist/empty-state
- IBM Carbon: layouts for small tiles, side panels, tables and full pages. https://carbondesignsystem.com/patterns/empty-states-pattern/
- Shopify Polaris: action-oriented titles, one primary. https://polaris-react.shopify.com/components/layout-and-structure/empty-state
- Superhuman: Inbox Zero reward, desktop and iOS. https://help.superhuman.com/hc/en-us/articles/46005833597709-Achieve-Inbox-Zero
- Apple SwiftUI: `ContentUnavailableView` for empty, error and search. https://developer.apple.com/documentation/swiftui/contentunavailableview
- Mobbin links pending: connector needs a paid plan.

## Gap: average vs best in class

An average product shows one generic illustration and "No data" for every cause, sometimes with a "Get Started" button, and blanks the filters on no results. The best tell the cause apart (first use, no results, cleared, error, permission), keep the frame and controls visible, quote the query, give one Verb + Noun action, offer starter templates where a blank page would stall people, and scale down art and buttons when many panels are empty at once. Gap score: 3 of 5 (opinion: most teams know the pattern, few design every variant).

## Screenshots

| Path | Shows | Source URL | Owner | Captured |
|---|---|---|---|---|
| shots/02-empty-states/linear-views-first-use.jpg | Linear first-use empty state for Views: illustration, title, explanation with shortcut, primary and docs buttons | https://linear.app/demo/views | Linear | 2026-10-10 |
| shots/02-empty-states/linear-loops-starter-templates.jpg | Linear Loops empty page as starter content: prompt, Start from scratch, 6 template cards | https://linear.app/demo/loops/my-loops | Linear | 2026-10-10 |
| shots/02-empty-states/github-issues-no-results.jpg | GitHub issues no-results at 1440px: query kept, "0 results" toolbar, centered message and docs link | https://github.com/vercel/next.js/issues?q=is%3Aissue%20zzqqxxnomatch123 | GitHub | 2026-10-10 |
| shots/02-empty-states/github-issues-no-results-mobile.jpg | Same no-results state at 390px: smaller title, filters collapsed to overflow | https://github.com/vercel/next.js/issues?q=is%3Aissue%20zzqqxxnomatch123 | GitHub | 2026-10-10 |
