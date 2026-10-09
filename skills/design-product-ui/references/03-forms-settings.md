# Forms and settings pages

Settings pages fail in three ways: people cannot find the setting, cannot tell if it saved, or destroy something by accident. Field rules (labels, validation timing, passwords) are in design-ux `references/03-forms.md`; this chapter is the product layer on top. Sources are claim IDs in `kb/research/product-ui/03-forms-settings.md`. Opinion is marked (opinion).

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **One save model per form** (S5). A form either saves explicitly or saves each change; never a mix where some fields save and some wait. [judged]
2. **Save state is always visible**: "Saving..." then "Saved" (or the error) next to the control or in the save bar, announced politely (WCAG 4.1.3). [judged]
3. **Unsaved changes are never lost silently**: a dirty form shows a save bar with Save and Discard (S8, S9), and leaving the page asks first. [judged]
4. **A control people cannot use says why in visible text**: "Only owners can change billing. Ask Dana Kim." A tooltip on a disabled control is not enough: natively `disabled` controls cannot take focus, so keyboard and screen reader users never meet the tooltip. If the control must stay in the tab order, use `aria-disabled="true"` and block the action in script. Never disable a control because a service is down (S10). [judged]
5. **Destructive settings are separate**: at the end of the page, in their own group, with a confirmation that names what will be lost, or with undo (design-ux gate 10). [judged]
6. Field fundamentals from design-ux 03 apply unchanged: visible labels, `autocomplete`, errors in text next to the field.

### Standards
| Standard | Applies to |
|---|---|
| WCAG 3.3.1, 3.3.3 | Error identified in text with how to fix |
| WCAG 3.3.4 (AA) | Legal, financial or data-deleting submissions are reversible, checked, or confirmed |
| WCAG 4.1.3 | "Saved" and "Couldn't save" announced without moving focus |
| WCAG 1.3.1 | Each settings group is a `fieldset` with `legend`, or a `section` with a heading |
| APG switch | `role="switch"` (or a checkbox styled as one) for on/off that applies immediately |

### Decision rules
- **Explicit or automatic save?** Start explicit (S4). Use automatic saving for imperative controls and when people expect instant effect: theme, notification toggles, density (S6, S7).
- **Switch or checkbox?** A switch applies now and saves itself; a checkbox is part of a form that needs Save (follows S6; opinion on the visual mapping, consistent with Apple and Material usage).
- **Layout.** Annotated two columns at md (768) and up: group title and one-line description on the left (about 1/3), controls in a card on the right (about 2/3); one column below md (S1 to S3). Groups stack vertically.
- **Scope decides structure.** Separate personal, workspace and project settings into their own sections or pages, named by scope (S11, S12).
- **Inline edit or detail panel?** Inline edit in a table only for one short field edited often (name, status, owner). Enter commits, Escape cancels, Tab moves on. Anything longer edits in a side panel or detail page (opinion).
- **Confirmation strength.** Frequent and reversible: no confirm, offer undo. Rare and irreversible: a dialog naming the object and consequence with a verb button ("Delete workspace"). Rare, irreversible and wide blast radius (a workspace, a production database): also type the object's name (opinion; common in developer tools, no fetched source).
- **Long settings pages.** Over about 6 groups: a sticky in-page section nav on the left at lg and up, or split into sub-pages (opinion).

### Numbers
| Thing | Value | Source |
|---|---|---|
| Two-column ratio | about 1:2 (Polaris example code uses 2fr 5fr) | S1 to S3 research notes |
| Breakpoint to stack | below 768 (md) | FOUNDATIONS |
| Description text | `--text-sm` 14, `--color-text-muted`, max about 32em | FOUNDATIONS |
| Gap between groups | 32 to 48 (`--space-7` to `--space-8`) | design-layout density table |
| Field vertical gap | 16 to 24 | FOUNDATIONS |
| "Saved" confirmation | visible 2 to 4 s, then fades to "All changes saved" timestamp (opinion) | design-ux 04 |

## Ceiling: exemplar patterns and signature moves

### Exemplar patterns (public docs)
- **Stripe Dashboard**: settings in three categories (Personal, Account, Product), each a hub of links (S11).
- **Vercel Dashboard**: account or team settings vs project settings, chosen by the scope selector (S12).
- **Polaris and Primer** (Shopify and GitHub product UI): annotated layout, contextual save bar, explicit save by default, autosave for imperative controls (S1 to S9).

### Signature moves
1. **The control's shape tells the save model.** Switch means "already applied"; checkbox and text field mean "press Save". People never have to guess (opinion grounded in S6).
2. **The save bar only appears when there is something to save** and carries Discard, so a clean page has no permanent "Save" button inviting doubt (S8, S9).
3. **Say who can change it.** A read-only setting shows the value, a lock icon, and "Only owners can change this. Ask Dana Kim" with a request link. Hiding it makes people think it does not exist; disabling it silently makes people think it is broken (S10; design-ux 04 permission empty state).
4. **The danger zone is spatially and visually apart**: last group, a hairline in `--color-danger` at 3:1, one outline danger button. Never a red filled button sitting next to Save (opinion).
5. **Consequence in the button, not the dialog title**: "Delete workspace and 3 projects", so the irreversible fact is on the thing people click (opinion; design-copy).
6. **Default values shown as real values**, not placeholder text, so people see what will happen if they touch nothing (opinion).

### Do and don't
| Do | Don't |
|---|---|
| Theme switch that applies instantly | Theme radio that waits for Save at the bottom of a long page |
| Save bar with Save and Discard on a dirty form | A Save button always visible and always enabled |
| "Only owners can change billing. Ask Dana Kim." | A greyed field with no reason |
| Danger zone last, outline danger button | Red "Delete" beside "Save changes" |

### Worked examples
**Tally workspace settings.** Groups: General (name, URL slug, timezone), Data (retention 12 months, IP anonymisation switch), Members (table, invite), Danger zone (transfer, delete). General and Data are explicit-save fields with a contextual save bar; the IP switch autosaves with an inline "Saved". The timezone select states its effect: "Dashboards and exports use this timezone." Delete workspace: dialog naming what goes ("All events for 48,210 tracked users and 3 projects"), type the workspace name, button "Delete workspace". A viewer-role user sees every value read-only with "Only admins can change workspace settings. Ask Priya Shah."

**Coffee landing page newsletter (slice brief A).** One field and one button: explicit submit. Button keeps its label with a spinner while sending, then the form is replaced by "You're on the list. First letter on Oct 22." in a polite live region; errors inline under the field with icon and text.

## Hand-offs
- Field rules, validation timing, passwords, checkout: design-ux `references/03-forms.md`.
- Wording of confirmations, errors, save states: design-copy `references/02-ux-microcopy.md`.
- Danger color and focus ring: design-color `references/ui-tokens-themes.md`.
