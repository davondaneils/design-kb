# Command palettes and quick switchers

Jobs: dashboard, mobile app. Sources observed 2026-10-10. Source type per entry: **live page** (fetched or rendered today) or **Mobbin** (none yet; the Mobbin connector needs a paid plan). Opinion is marked (opinion).
Floor rules live in [../../../skills/design-product-ui/references/02-find-and-command.md](../../../skills/design-product-ui/references/02-find-and-command.md) (combobox semantics, WCAG 2.1.4 single keys, shortcut tiers, palette sizes); this file is the ceiling: what the best shipped examples do.

## What the best examples do

1. **Context first, then everything.** GitHub's palette "shows your location at the top left and uses it as the scope for suggestions"; Tab adds a highlighted repo to the scope, Backspace widens it. Issue and pull request commands "act on your current page". Linear's command menu, opened while looking at cycles, "will first display commands that are related to cycles", then groups by command type with icons. https://docs.github.com/en/get-started/accessibility/github-command-palette and https://linear.app/changelog/2019-12-18-new-command-menu [live page]
2. **Prefixes as an optional power layer, taught in the empty state.** GitHub: `>` command mode, `#` issues, PRs and projects, `@` users and repos, `/` files, `!` projects, `?` help. The empty palette prints the hint "Type # for issues, pull requests, and projects, / for files, and > for commands". Same GitHub page and screenshot. [live page]
3. **The highlighted row names its verb.** In GitHub's palette the active row shows "Jump to" for a place and "Run command" for a command, and matched letters are bold ("**Sw**itch theme to dark"). Cmd/Ctrl+Enter opens in a new tab; Cmd/Ctrl+C copies the result's URL. Same page. [live page]
4. **Enter runs the default, Cmd K reveals the rest.** Raycast: Enter "Triggers the primary action immediately (the first action in the list)"; Cmd/Ctrl K opens the Action Panel for the selected item; "Each action shows its keyboard shortcut on the right, so you can learn to trigger them directly over time"; destructive actions show in red; while searching actions, sections flatten into one fuzzy-matched list. https://manual.raycast.com/action-panel [live page]
5. **Ranking learns and can be reset.** Raycast stores "frecency data" per command and offers "Reset Ranking"; users can set an alias so "typing that alias in Root Search will prioritize the command". Same page. [live page]
6. **Useful before typing.** Vercel Geist Command Menu rules: "Show a recent or default item set when the input is empty"; group into pages "when a single flat list would exceed roughly 30 items"; "preserve the search query when navigating back from a sub-page"; "Backspace at an empty input pops the page stack"; result count in `aria-live="polite"`. Things Quick Find opens on "Recent" with the hint "Quickly switch lists, find to-dos, search for tags...". https://vercel.com/geist/command-menu and https://culturedcode.com/things/support/articles/2803584/ [live page]
7. **Copy rules for commands.** Geist: items are "Title Case verb phrases (Deploy Project, Invite Team Member)", not "Go to project page"; placeholders name the scope and end with an ellipsis ("Search projects…"), because "Bare Search… is wrong"; group headings 1 to 2 words. Same Geist page. [live page]
8. **Separate find from command when both are heavy.** Vercel Dashboard: a Find bar for teams, projects, deployments, pages and settings on `F`, and a Command Menu on Cmd/Ctrl K. Linear: `/` searches the workspace, Cmd/Ctrl F searches the current view, and typing "i" then space inside the command menu focuses it on issues. https://vercel.com/docs/dashboard-features and https://linear.app/docs/search [live page]
9. **One shortcut, same everywhere, remappable.** Cmd/Ctrl K opens the palette in GitHub, Vercel, Raycast's action panel, Figma's actions menu ("typing 'align' will show all alignment-related actions") and Slack's "Jump to a conversation". GitHub lets people remap it in Accessibility settings because it "may conflict with your default OS and browser keyboard shortcuts". https://help.figma.com/hc/en-us/articles/23570416033943-Use-the-actions-menu-in-Figma-Design , https://slack.com/help/articles/201374536-Slack-keyboard-shortcuts , GitHub page above [live page]
10. **Mobile: a gesture opens the same palette.** Superhuman Mail: on desktop Cmd/Ctrl K; on mobile "Two-finger tap" or "Pull down from the top of the inbox ... then swipe right, like you're making an L", then type the command name ("Split Inbox Library", "Add to Split"). https://help.superhuman.com/hc/en-us/articles/38458392810643-Superhuman-Command [live page]
11. **Mobile: pull down to switch and search in one field.** Things 3 iPhone: "Pull down in any list to reveal Quick Find"; it first matches only names of to-dos, projects, areas and tags "so suggestions can be shown as soon as you start typing"; lists rank above to-dos; "Continue Search" extends to notes, checklists and the Logbook. On Mac and iPad with a keyboard, "just start typing" (Type Travel). https://culturedcode.com/things/support/articles/2803584/ [live page]
12. **Esc closes, focus returns.** Geist: "Trap focus inside the overlay while it's open and return focus to the previously active element on close"; GitHub closes on Esc or the same shortcut that opened it. Same pages. [live page]

## Common structure

Desktop palette:
```
             15% of viewport from top, 640px wide
+-------------------------------------------------+
| [scope chip] What do you need?            [Esc] |  18px input
|-------------------------------------------------|
| Type # for issues, / for files, > for commands  |  (empty state hint)
| Recent                                          |  13px group heading
| [icon] Today                            Jump to |  36px rows, active tint
| [icon] Switch Theme to Dark        Run command  |
| [icon] Invite Team Member            ⌘ I        |  shortcut right, muted kbd
+-------------------------------------------------+
| Enter run   ⌘K more actions   ⌘Enter new tab    |  (Raycast-style footer)
```
1. Input with scope and an Esc hint.
2. Empty state: recent items plus a one-line hint on prefixes.
3. Results grouped (Top result, Pages, Commands, Recent), context group first.
4. Each row: icon, label with matched letters bold, right slot for verb or shortcut.
5. Secondary actions on the selected row via Cmd K (Raycast) or sub-pages (Geist).

Mobile equivalent:
```
[pull down on a list]  or  [two-finger tap]
+-------------------------------+
| (Q) Quick Find          ( X ) |
| Recent                        |
|  * Today                      |
|  Lists first, then items      |
|  (Q) Continue Search          |
+-------------------------------+
```
Card overlay under the status bar, dimmed list behind, close button, lists before items, an explicit "search everything" row at the end (Things).

## Spacing and type conventions observed

| Product or system | Element | Value | How known | Link |
|---|---|---|---|---|
| Vercel Geist Command Menu | Dialog | 640px wide, top edge at 135px in a 900px viewport (15%), radius 12px | measured with getComputedStyle | https://vercel.com/geist/command-menu |
| Vercel Geist Command Menu | Input | 18px text, 28px tall field, placeholder "What do you need?", Esc kbd at right, `role="combobox"` | measured | same |
| Vercel Geist Command Menu | Result row | 36px tall, padding 0 8px, 14px text, radius 6px, active background rgba(0,0,0,0.05) | measured | same |
| Vercel Geist Command Menu | Group heading | 13px, weight 400, gray rgb(77,77,77) | measured | same |
| Vercel Geist | Paging threshold | group into pages above roughly 30 items | stated in docs | same |
| GitHub Command Palette | Row | full-width rows, verb label ("Jump to", "Run command") right aligned on the active row, matched characters bold, group labels "Top result", "Pages", "Commands" | estimated from docs screenshots | https://docs.github.com/en/get-started/accessibility/github-command-palette |
| Raycast | Action Panel | shortcut shown at right of every action; destructive in red | stated in docs | https://manual.raycast.com/action-panel |
| Things 3 iPhone | Quick Find card | floating card under the status bar with about 16pt margins, search pill plus circular close button, rows about 28pt, list results above to-do results with a divider | estimated from support video frames | https://culturedcode.com/things/support/articles/2803584/ |

## Mistakes they avoid

- **Empty palette that waits for typing.** Geist and Things show recent items; GitHub shows a prefix hint.
- **Shortcut list hidden on a docs page.** Raycast prints the shortcut beside every action; Geist requires a Kbd slot per item.
- **One giant flat list.** Geist pages above about 30 items; Linear and GitHub group by type with context first.
- **Losing the query on back.** Geist preserves it when leaving a sub-page.
- **Mandatory syntax.** GitHub prefixes are optional and announced in the empty state; plain typing still works.
- **Fixed binding that collides.** GitHub lets people remap Cmd/Ctrl K; Geist forbids reusing it for an in-page filter.
- **No mobile path.** Superhuman maps the palette to a gesture; Things makes it a pull-down (opinion: an always-visible search button is still needed alongside a hidden gesture, which Things provides on iPad's sidebar).
- **Navigation verbs as commands.** Geist: commands act ("Deploy Project"), they do not "Go to".
- **Opaque ranking.** Raycast exposes "Reset Ranking" and aliases so people can fix a bad top result.

## Products to look at

- GitHub Command Palette: scope chip, prefixes, verb on active row. https://docs.github.com/en/get-started/accessibility/github-command-palette
- Raycast Action Panel: primary action on Enter, Cmd K for the rest, frecency. https://manual.raycast.com/action-panel
- Vercel Geist Command Menu: measured layout and copy rules. https://vercel.com/geist/command-menu
- Vercel Dashboard: Find on `F` vs Command Menu on Cmd K. https://vercel.com/docs/dashboard-features
- Linear: context-first command menu and search shortcuts. https://linear.app/changelog/2019-12-18-new-command-menu , https://linear.app/docs/search
- Superhuman: same palette on desktop and phone (steps shown in its Split Inbox help article). https://help.superhuman.com/hc/en-us/articles/38458392810643-Superhuman-Command
- Things 3: Quick Find and Type Travel. https://culturedcode.com/things/support/articles/2803584/
- Figma actions menu, Slack quick switcher. Links in item 9.
- Mobbin links pending: connector needs a paid plan.

## Gap: average vs best in class

An average product ships Cmd K as a search box over page names: empty until you type, one flat list, no shortcuts shown, no context, no mobile path. The best open scoped to where you are with recent items and a one-line prefix hint, group results with the context group first, show the verb and the shortcut on every row, offer secondary actions on the selected row, learn ranking from use and let people reset it, keep focus and query intact, and give phones the same power through a pull-down or gesture. Gap score: 4 of 5 (opinion): many dashboards now have a Cmd K box, but very few do context, action panels and a mobile equivalent.

## Screenshots

| Path | Shows | Source URL | Owner | Captured |
|---|---|---|---|---|
| shots/08-command-palettes/vercel-geist-command-menu.jpg | Geist Command Menu open: 640px dialog, "What do you need?" input with Esc, grouped 36px rows with right-side meta | https://vercel.com/geist/command-menu | Vercel | 2026-10-10 |
| shots/08-command-palettes/github-command-palette-scoped-navigation.jpg | GitHub palette scoped to a repo, prefix hint line, "Jump to" on the active row | https://docs.github.com/en/get-started/accessibility/github-command-palette | GitHub | 2026-10-10 |
| shots/08-command-palettes/github-command-palette-command-mode.jpg | GitHub palette in `>` command mode: "Top result", matched letters bold, "Run command" | https://docs.github.com/en/get-started/accessibility/github-command-palette | GitHub | 2026-10-10 |
| shots/08-command-palettes/things-ios-quick-find.jpg | Things 3 iPhone Quick Find: empty state with Recent, then "day" query with lists above to-dos and "Continue Search" (two frames from Cultured Code's support video) | https://culturedcode.com/things/support/articles/2803584/ | Cultured Code | 2026-10-10 |

Images are (c) their owners, kept for internal reference and critique.
