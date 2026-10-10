# States and feedback

## Principles
1. **Every view has at least seven states:** ideal, empty (first use), empty (no results), empty (cleared or done), loading, partial or sparse, error, plus overflow (very long content). Design them all before handoff (NN/g; Vercel "design empty, sparse, dense and error states").
2. **Show something fast.** A real or skeletal layout beats a blank screen (Apple HIG Loading).
3. **Never lie about state.** Loading must not say "No results"; "No results" must not appear while data is still arriving (NN/g empty states).
4. **Match the interruption to the stakes** (NN/g error guidelines; Apple HIG Alerts).

## Loading decision table
| Expected wait | Treatment | Source |
|---|---|---|
| Under 1 s | No indicator; pressed state; optimistic result | NN/g |
| Under 1 s but variable | Delay loader 150 to 300 ms; if shown, keep at least 300 to 500 ms (no flicker) | Vercel (practitioner) |
| 1 to 10 s, full page | Skeleton that mirrors the final layout exactly | NN/g; Vercel |
| 2 to 10 s, one module or action | Spinner in place (inside the button or card); button keeps its label | NN/g; Vercel |
| Over 10 s | Determinate progress bar plus time estimate plus "you can leave, we'll notify you" | NN/g; Apple HIG |
| Batch of known size | "Importing 3 of 50" even under 10 s | NN/g |

Rules: no static "Loading..." text alone (NN/g). Shimmer animation is optional and must stop under `prefers-reduced-motion`. Skeletons never for under-1 s loads.

## Empty states
| Type | Contains | Example |
|---|---|---|
| First use | What this area is for, one primary action, optional demo data or template | "No projects yet. Projects group your tasks and files. [Create project] [Use a template]" |
| No results | What was searched, why it may be empty, how to widen it | "No invoices match 'Acme' in March. [Clear filters] [Search all dates]" |
| Cleared / done | Positive confirmation, next step | "All caught up. Next review: Monday." |
| No permission | Who can grant access | "Only admins can see Billing. [Ask Dana for access]" |
| Error | See below | |

## Error presentation ladder (lowest to highest interruption)
1. **Inline** next to the field or component: validation, single widget failures.
2. **Section banner**: a panel failed to load; offer Retry; rest of page works.
3. **Page banner**: offline, degraded service, using cached data (Apple HIG: cached data plus nonintrusive label rather than a launch alert).
4. **Toast**: async results of actions the user took (saved, sent, failed to send with Retry).
5. **Dialog**: only when a decision is required before continuing.
6. **Full-page error**: route not found (404), no access, total failure. Includes way home, search, and support. Apology plus something memorable is fine here (NN/g), never in field errors.

## Toasts
- For results of user-initiated actions, not for errors that need a fix (those go inline).
- One at a time, or stacked max 3 (opinion). Position consistent; bottom on mobile above the tab bar.
- Auto-dismiss only if the content is non-critical; if it holds an action (Undo, Retry), give at least 5 s and pause on hover and focus, and make the action reachable another way (WCAG 2.2.1, 2.1.1). Opinion: 5 to 8 s base, plus about 1 s per 10 words.
- Announced with `aria-live="polite"`; errors that block work use `role="alert"` sparingly (WCAG 4.1.3).

## Notifications (permission, channels, inbox)
Floor rules; the shipped examples with links are in `kb/references/patterns/09-notifications.md`.
- **Ask after the first useful moment.** Never request push at first launch. Apple: request "after the person schedules a first task"; Android 13+ notifications are off by default, and good moments are a bell tap, a follow or an order. Use a pre-prompt ("Get notified?" with "I'm in" and "Skip") before the system dialog.
- **One channel per event.** Skip the email when the inbox item was read (Linear); hold mobile push while the desktop is active (Slack); never send two notifications for the same thing (Apple HIG).
- **Split the inbox.** "Needs you" (assigned, mentioned, review requested) apart from everything else, each tab with a count; every row names its reason. Triage with Done, snooze and save, each undoable (Linear, GitHub).
- **Honest urgency.** Time-sensitive only for events within the hour; never for marketing (Apple HIG interruption levels).
- **Badges** count unread notifications only and clear when read (Apple HIG).

## Success states
- Confirm in place when the change is visible (row updates, checkmark on the button for 1 to 2 s).
- Use a success page only for transactions (orders, applications): reference number, what happens next, when, and how to change it.

## Optimistic UI
Use when success rate is high and the action is reversible (like, archive, reorder, rename). Update instantly, reconcile with the server, on failure revert visibly with message and Retry (Vercel). Do not use for payments, sends to others, or anything irreversible.

## Long-running and AI tasks
- Screen readers: never put streaming text in a live region token by token; announce start ("Generating report") and completion ("Report ready") politely, then let people read the finished text (opinion grounded in WCAG 4.1.3; avoids flooding assistive tech).
- Before: preview the plan and the cost or time; ask only diagnostic questions when intent is vague (Nielsen "Intent by Discovery").
- During: stream partial results; show steps completed; allow cancel; let people leave and come back with a resumption summary.
- After: summary of what changed, sources used, what can be undone; flag low-confidence parts.
- Friction scales with stakes: drafts free, external actions (send, pay, delete) need explicit approval.

## Expert moves
- **Anti-flicker timing** (show delay plus minimum display) is what makes fast apps feel calm; React Suspense does it by default (Vercel).
- **Skeleton equals final layout to the pixel**, including image ratios, so nothing shifts (also protects CLS; see design-frontend).
- **Partial failure and stale data are states.** One failed panel shows its own Retry while the rest stays live; cached content shows "Updated 2 min ago" and refreshes in place. Panel-level detail for app screens: design-product-ui `references/05-states-bulk.md`.
- **Undo window as the save button.** For sending messages or emails, a 5 to 10 s delayed send with Undo turns an irreversible act into a reversible one (Gmail "Undo send"; opinion on window).
- **Ellipsis grammar:** in-progress labels and menu items that open a further step end in an ellipsis ("Saving...", "Rename...") (Vercel; Apple convention).

## Hand-offs
- State wording: design-copy. Loader motion: design-motion. Data viz empty and error states: dataviz.
