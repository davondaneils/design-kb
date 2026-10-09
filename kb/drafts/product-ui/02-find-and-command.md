# Find and command: filters, search, command palette, keyboard layers

Tools are used for hours. The fastest people drive them by keyboard; everyone else needs the same power one click away. Sources are claim IDs in `kb/research/product-ui/02-find-and-command.md`. Opinion is marked (opinion).

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **Every shortcut has a clickable twin.** Shortcuts accelerate; they are never the only path (design-ux gate 4). [judged]
2. **Single-character shortcuts meet WCAG 2.1.4**: a setting turns them off, or remaps them to include a modifier, or they work only while the component has focus (F18). [judged]
3. **Shortcuts never fire while typing** in an input, textarea, select or contenteditable, except Escape and the palette shortcut. [judged]
4. **Do not repurpose platform shortcuts** (Cmd/Ctrl+C, V, Z, F, L, T, W, R, the browser's own) (F19). [judged]
5. **The palette is a modal dialog containing an APG combobox**: DOM focus stays on the input, `aria-activedescendant` marks the active option, Escape closes and returns focus to whatever opened it (F22, F23). [judged]
6. **Filter and search state lives in the URL** so refresh, Back, share and bookmark work (F12, F15, F24). [judged]
7. **Active filters are visible** as removable chips with a "Clear all", and results say how many match (F25; design-ux 02). [judged]

### Standards
| Standard | Applies to |
|---|---|
| WCAG 2.1.1, 2.1.2 | Everything works by keyboard; no traps in the palette |
| WCAG 2.1.4 | Single-key shortcuts (F18) |
| WCAG 2.4.3, 2.4.7 | Focus order into and out of the palette; visible focus on the active option |
| WCAG 4.1.3 | "12 results" and "Filter removed" announced politely |
| Apple HIG keyboards | Command main modifier, Shift secondary, Option rare, avoid Control on macOS; modifier order Control, Option, Shift, Command (F20, F21) |

### Decision rules
- **Where filters go.** Filters that scope the whole page (date range, environment, segment) sit once in the page toolbar under the page header. Filters that only refine one table sit on that table's header. Never both for the same field.
- **Live or batch.** Results in under 1 s: apply live. Slower: batch with an Apply button that states the count (design-ux 02).
- **Plain or structured search.** Default is plain text that searches the likely fields. Add a structured syntax (`status:failed amount:>100 -country:US`) when the audience is daily expert users and the data has typed fields; show the syntax as suggestions in the field, not as a help page (F10, F11; opinion on suggestions).
- **Search vs palette.** Search finds records; the palette runs commands and jumps to places. One input may do both if results are grouped ("Go to", "Actions", "Records") and the first group matches the most likely intent (opinion; Stripe search jumps straight to an object by ID, docs).
- **Shortcut tiers.**
  1. Platform and widget keys: Tab, Enter, Escape, arrows, Space (always).
  2. Global entry points with or without a modifier: Cmd/Ctrl+K palette (F8), `/` focuses search (opinion, widespread), `?` opens the shortcut sheet (F9).
  3. Expert single keys and sequences: `C` create, `X` select row, `G` then `D` go to dashboard (Linear style, F14; research 05 B23). Only when tier 1 and 2 exist and with the WCAG 2.1.4 setting.
- **Show the platform modifier.** "⌘K" on macOS, "Ctrl K" elsewhere; detect with `navigator.platform` or `userAgentData` and default to Ctrl when unknown (opinion).
- **Tooltips for icon buttons show name plus shortcut**, open on hover and focus, first in a group delayed and peers instant (F26).

### Numbers
| Thing | Value | Source |
|---|---|---|
| Palette response | under 100 ms per keystroke, aim under 50 ms | Superhuman F6 |
| Palette width | 560 to 640px, max `calc(100vw - 32px)` | opinion |
| Palette top offset | about 12 to 20 vh, not vertically centered, so results grow downward | opinion |
| Result rows | 40px default, 8 visible before scroll | opinion; FOUNDATIONS row heights |
| Shortcut hint | `--text-xs` 12, `--color-text-muted`, `kbd` with 1px border and `--radius-sm` | opinion |
| Tooltip delay | first about 500 ms, peers 0 | F26 (the 500 ms figure is opinion) |

## Ceiling: exemplar patterns and signature moves

### Exemplar patterns (public docs)
- **Superhuman**: palette everywhere with the same shortcut; teaches the shortcut beside each command; typo and synonym matching; contextual commands; minimal animation for speed (F1 to F7).
- **Linear**: two-key sequences as a namespace (O then V opens views, O then L labels); X selects; filters ride in the URL; Option/Alt+V saves a filtered view (F14 to F16, B23).
- **Stripe Dashboard**: `?` lists shortcuts; search jumps to objects by ID; typed filters, comparisons, ranges, `is:` states, negation; query in the URL (F9 to F13).
- **Vercel Dashboard**: Cmd/Ctrl+K command menu to navigate and act by keyboard (F8).
- **Things 3**: Type Travel, start typing a list name anywhere and press Return (F17).

### Signature moves
1. **The palette is the shortcut teacher.** Every command row shows its shortcut on the right in muted `kbd`; mouse users learn it by seeing it (F1). Generalists build a palette with no hints, so nobody graduates to shortcuts.
2. **Synonyms per command.** "Invite", "add member", "share" all find "Invite people". Write 2 to 4 aliases per command (F4).
3. **Context first.** On a selected row, the first group is actions on that row; on a page, actions on that page; then navigation (F5).
4. **Search field shows its shortcut** (`/`) inside the field at rest and hides it on focus, the cheapest discoverability there is (opinion, common in exemplars).
5. **`?` sheet grouped by task**, not by key, with the same labels as the menus (F9; opinion on grouping).
6. **Instant, not animated.** Palette opens without a transition or with an opacity fade at `--duration-instant`; keyboard-driven navigation never animates (F7; design-ux expert move 1).
7. **Filters as a sentence.** Chips read as "Status is Failed", "Amount over $100": field, operator, value. People can edit a chip in place (opinion; consistent with Stripe's typed filters).
8. **One input, typed prefixes.** In a palette, `>` for commands, `#` for records, or plain text for all is a power-user layer; never required (opinion).

### Do and don't
| Do | Don't |
|---|---|
| "Search pages /" with the hint in the field | A search icon with no label or hint |
| Shortcut in every menu item and tooltip | A shortcut list only on a docs page |
| Single-key shortcuts with a setting to turn them off | Single-key shortcuts that fire while a screen reader user types |
| Esc closes the palette and focus returns to the trigger | Esc closes and focus jumps to `body` |
| Filter chips with remove buttons and "Clear all" | A filter count badge with no way to see what is active |

### Worked examples
**Tally analytics dashboard (slice brief B).** Top bar: search field labelled "Search pages and events" with `/` hint; a "Commands" button showing "⌘K" or "Ctrl K" that opens the palette. Palette groups: Actions on this view (Share report, Export CSV, Change date range), Go to (Overview, Events, Funnels, Retention, Users, Settings) each with its `G` sequence, Settings (Compact density, Theme). `?` opens a dialog listing shortcuts with a toggle "Single-key shortcuts: on", meeting 2.1.4. Polite live region announces result counts.

**Engineering issue list.** Saved views in the sidebar; filters as chips under the page header ("Assignee is me", "Status is not Done"), all in the URL; `X` selects, Shift+X range, then the bulk bar or Cmd/Ctrl+K acts on the selection (B22 to B24).

## Hand-offs
- Faceted filter rules, mobile filter tray: design-ux `references/02-navigation-ia.md`.
- Dialog semantics and focus: design-frontend `references/01-semantic-html.md`; accessibility floor: design-foundations `references/accessibility.md`.
- Command naming and tooltip copy: design-copy `references/02-ux-microcopy.md`.
- Site search for SEO and AI answers: design-search (different job).
