# UI pattern references

What the best shipped dashboard and mobile products actually do, pattern by pattern. The skills hold the floor (rules and numbers); these files hold the ceiling (observed examples with links).

## How these were made
- **Source type** is marked on every entry: **live page** (a public page, doc, changelog or app store listing fetched or rendered on the capture date) or **Mobbin** (screens from mobbin.com).
- 2026-10-10: the Mobbin connector returned "requires a paid plan", so every entry so far is a live page. Mobbin links get layered in when access is upgraded.
- Nothing is written from memory. Values read from screenshots are marked as estimates; values read with `getComputedStyle` or stated in a design system's docs say so.
- Screenshots live in `shots/<NN>-<pattern>/`. They are (c) their owners, captured from public pages only, and kept for internal reference and critique.
- Follows the researcher's source policy (`.claude/agents/researcher.md`) and the house rules in `CLAUDE.md`.

## Patterns
| # | Pattern | Floor rules live in |
|---|---|---|
| 01 | [Onboarding](01-onboarding.md) | `skills/design-ux/references/05-onboarding.md` |
| 02 | [Empty states](02-empty-states.md) | `skills/design-ux/references/04-states-feedback.md`, `skills/design-product-ui/references/05-states-bulk.md` |
| 03 | [Navigation](03-navigation.md) | `skills/design-ux/references/02-navigation-ia.md`, `skills/design-product-ui/references/04-shells-density.md` |
| 04 | [Tables and lists](04-tables-and-lists.md) | `skills/design-product-ui/references/01-tables.md` |
| 05 | [Filters and search](05-filters-and-search.md) | `skills/design-product-ui/references/02-find-and-command.md` |
| 06 | [Forms and validation](06-forms-and-validation.md) | `skills/design-ux/references/03-forms.md`, `skills/design-product-ui/references/03-forms-settings.md` |
| 07 | [Settings](07-settings.md) | `skills/design-product-ui/references/03-forms-settings.md` |
| 08 | [Command palettes](08-command-palettes.md) | `skills/design-product-ui/references/02-find-and-command.md` |
| 09 | [Notifications](09-notifications.md) | `skills/design-ux/references/04-states-feedback.md` |
| 10 | [Permission and error states](10-permission-and-error-states.md) | `skills/design-ux/references/04-states-feedback.md`, `skills/design-product-ui/references/05-states-bulk.md` |
| 11 | [Checkout and upgrade](11-checkout-and-upgrade.md) | `anthropic-skills:sales-funnels` for offer logic; this file covers the UI |
