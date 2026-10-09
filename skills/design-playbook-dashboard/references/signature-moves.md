# Dashboards and tool UI: closest exemplars and signature moves

**Status of this file: opinion, unmeasured.** These product UIs sit behind logins and their hosts were blocked from this environment on 2026-10-09 (`kb/exemplars.md`). The moves come from public screenshots the teams publish and the judge's knowledge, and get confirmed by teardowns in `kb/teardowns/` from public docs, changelogs or screenshots Davon supplies.

## Pick the closest exemplar
| App type | Compare against |
|---|---|
| Issue tracking, project tools, keyboard-heavy work | Linear (app), Superhuman |
| Money, analytics, KPI dashboards | Stripe Dashboard, Vercel Dashboard |
| Documents, settings, flexible workspaces | Notion, Things 3 |
| Navigation-heavy or multi-pane tools | Arc browser, Linear (app) |

## Moves the product exemplars share
1. **Quiet chrome, loud content.** Sidebar and top bar in near-neutral surfaces one small step from the background; no dark slab sidebar fighting the content. The brand color appears on the primary action and selection, almost nowhere else.
2. **Dense but not cramped.** UI text at `--text-sm` (14), row heights around 32 to 40px, padding on the 4px scale (`--space-3` 8 to `--space-4` 12 inside rows). Density comes from removing decoration, not from shrinking type below the scale.
3. **Separation by hairline and space, not by cards.** 1px borders at low contrast and consistent gaps instead of a shadowed card around every block. Cards only where an object is movable or selectable.
4. **Keyboard first.** A command palette (Cmd or Ctrl plus K), shortcuts shown inside menus and tooltips, and focus that never gets lost after an action (Linear, Superhuman, Vercel). How: design-product-ui `references/02-find-and-command.md`.
5. **One page header pattern.** Title left, primary action right, filters and view options directly below, identical on every screen.
6. **Numbers as typography.** Tabular numerals, right alignment, muted units, deltas with sign and arrow, and one benchmark line or comparison period rather than more chart colors (Stripe Dashboard).
7. **States are designed screens.** Empty states that teach the first action, skeletons that match the final layout, inline errors with a retry, optimistic updates with undo instead of confirm dialogs for frequent actions. How: design-product-ui `references/05-states-bulk.md`.
8. **Fast, small motion.** Hover and press at `--duration-fast` (150ms) or less, menus and popovers at base speed, nothing animated on keyboard-driven navigation.
9. **Answer first** (opinion, design-product-ui `references/06-dashboards.md`): one computed sentence above the KPIs that says what changed and what to look at, linked to the evidence.

## Where pages fall short (from the color pilot)
The pilot dashboard rated close on color and layout discipline and clearly below on craft depth: no real icon set, no density options, no empty or loading states, no keyboard shortcut layer, a table that scrolled on phones instead of reflowing (`kb/tests/design-color.md`). Moves 4, 7 and the table rule in the playbook are the ones to check first.
