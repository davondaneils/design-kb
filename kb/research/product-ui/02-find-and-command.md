# Research 02: Find and command

Researcher, 2026-10-09. Access method and status codes as in research 01.

## Key findings
1. Every exemplar with a command menu opens it with Cmd+K on macOS and Ctrl+K elsewhere (Vercel docs; Superhuman; Linear docs mention Cmd/Ctrl K).
2. The palette teaches shortcuts: each command shows its own shortcut (Superhuman).
3. Matching must tolerate typos and synonyms, and commands are contextual (Superhuman).
4. `?` opens the shortcut list in the Stripe Dashboard.
5. Linear uses two-key sequences as namespaces (O then V, O then L) and X to select.
6. Things uses "Type Travel": start typing a list name anywhere and press Return.
7. Stripe search supports field filters, comparison operators, ranges, `is:` states and negation with `-`, and the query lives in the URL so it can be bookmarked.
8. WCAG 2.1.4: single-character shortcuts need a way to turn off, remap with a modifier, or only work on focus.
9. Apple HIG: do not repurpose standard shortcuts; Command is the main modifier; avoid Control on macOS; list modifiers in the order Control, Option, Shift, Command.
10. Palette semantics follow the APG combobox: DOM focus stays on the input; `aria-activedescendant` marks the active option; Escape closes and returns focus.
11. Superhuman's latency rule: 100ms maximum, aiming under 50ms.

## Conflicting views
None material. Practitioner sources agree; WCAG 2.1.4 constrains the Linear-style single-key layer, which Linear-style apps meet by scoping shortcuts to the app view and offering settings (unverified for Linear; treat as the requirement, not as Linear's behavior).

## Claim table
| ID | Claim | Quote (under 40 words) | URL | Tier | Status |
|---|---|---|---|---|---|
| F1 | Palette teaches shortcut | "Cmd+K brings up Superhuman Command, where you can instantly do any action [...] and also learn the shortcut for next time." (punctuation between the clauses elided) | https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/ | 2 | P |
| F2 | Same shortcut everywhere | "Wherever your user is in your app, they must be able to bring up the command palette by using the same keyboard shortcut." | https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/ | 2 | P |
| F3 | Typo tolerance | "Naturally typing "open" all lowercase should match "Open", but so should "opn" or "oepn"." | https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/ | 2 | P |
| F4 | Synonyms | "Whenever you define a new command, think of alternative words and phrases your users might use to action the command." | https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/ | 2 | P |
| F5 | Contextual commands | "Show and hide commands based on what's currently active." | https://blog.superhuman.com/how-to-build-a-remarkable-command-palette/ | 2 | P |
| F6 | 100ms rule, aim for 50 | "Superhuman Mail treats the 100ms rule as the maximum, and actually aims for latency less than 50ms whenever possible." | https://blog.superhuman.com/superhuman-is-built-for-speed/ | 2 | P |
| F7 | Minimal animation for speed | "Superhuman Mail uses minimal animations, so no time is wasted on loading them" | https://blog.superhuman.com/superhuman-is-built-for-speed/ | 2 | P |
| F8 | Vercel command menu shortcut | "You can access the menu using by pressing ⌘ + K on macOS or Ctrl + K on Windows and Linux." | https://vercel.com/docs/dashboard-features | 2 | P |
| F9 | Stripe `?` for shortcuts | "On your keyboard, press the question mark key (`?`) for a list of available keyboard shortcuts for common actions." | https://docs.stripe.com/dashboard/basics | 2 | P |
| F10 | Stripe field filters | "Use filters to limit your search terms so that they only apply to specific fields within applicable objects." | https://docs.stripe.com/dashboard/search | 2 | P |
| F11 | Stripe negation | "You can also negate any search filter with a hyphen (`-`) so that matches for it aren't included." | https://docs.stripe.com/dashboard/search | 2 | P |
| F12 | Search in URL | "As search terms are included in the URL, you can bookmark the search or share it with other team members" | https://docs.stripe.com/dashboard/search | 2 | P |
| F13 | Top results instantly, Enter for all | "When you perform a search, the top results appear immediately. View all of the matches by clicking View all results or pressing Enter." | https://docs.stripe.com/dashboard/search | 2 | P |
| F14 | Linear sequences | "search for views to open with O then V" | https://linear.app/docs/custom-views | 2 | P |
| F15 | Linear filters in URL | "The browser URL can also include temporary filters applied to the view." | https://linear.app/docs/custom-views | 2 | P |
| F16 | Linear save view shortcut | "save any filtered board or list as a custom view with the keyboard shortcut `Option/Alt` `V`" | https://linear.app/docs/custom-views | 2 | P |
| F17 | Things Type Travel | "Simply start typing the name of the list or tag you want to jump to, then hit Return." | https://culturedcode.com/things/support/articles/2785159/ | 2 | P |
| F18 | WCAG 2.1.4 options | "A mechanism is available to turn the shortcut off;" / "...remap the shortcut to include one or more non-printable keyboard keys" / "...only active when that component has focus." | https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html | 1 | S |
| F19 | Do not repurpose standard shortcuts | "In general, don't repurpose standard keyboard shortcuts for custom actions." | https://developer.apple.com/design/human-interface-guidelines/keyboards | 1 | S (platform) |
| F20 | Command is main modifier | "Prefer the Command key as the main modifier key in a custom keyboard shortcut." | https://developer.apple.com/design/human-interface-guidelines/keyboards | 1 | S |
| F21 | Modifier order | "always list them in this order: Control, Option, Shift, Command." | https://developer.apple.com/design/human-interface-guidelines/keyboards | 1 | S |
| F22 | Combobox focus model | "DOM Focus is maintained on the combobox and the assistive technology focus is moved within the listbox" | https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ | 1 | S |
| F23 | Escape returns focus | "Closes the popup and returns focus to the combobox." | https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ | 1 | S |
| F24 | URL as state | "Persist state in the URL so share, refresh, Back/Forward navigation work" | https://vercel.com/design/guidelines | 2 | P |
| F25 | Filters discoverable, active state visible | "Filters need to be discoverable, quick, and powerful," | https://www.nngroup.com/articles/data-tables/ | 3 | C |
| F26 | Tooltip delay grouping | "Delay the first tooltip in a group; subsequent peers have no delay." | https://vercel.com/design/guidelines | 2 | P |

Apple HIG pages fetched as JSON from `developer.apple.com/tutorials/data/design/human-interface-guidelines/keyboards.json`; the human URL is listed.

## Likely to change
Apple keyboard guidance shifts with each OS (iPadOS menu bar in 26). Recheck yearly.
