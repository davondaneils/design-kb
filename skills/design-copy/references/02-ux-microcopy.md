# UX microcopy: buttons, forms, errors, empty states, dialogs, onboarding

## Principles
1. **Microcopy is interface.** A wrong button label is a usability bug, not a style issue.
2. **Say what happens, then what to do.** Every message answers: what happened, why it matters (only if needed), what to do next.
3. **Never make the user translate.** No system words ("invalid", "null", "error 4012", "request failed") unless as a diagnostic code after the plain message (NN/g 2023).
4. **Words and accessibility are one job.** Visible label, accessible name, announced status and non-color cues are copy decisions.

## Fundamentals (gate)
- **Buttons:** start with a verb, name the result, sentence case. "Save changes", "Send $250", "Delete project". Never "OK", "Yes", "No", "Submit" for consequential actions (NN/g confirmation dialogs).
- **Labels:** always visible, outside the field. Placeholder text is only an example ("e.g. 4111 ..."), never the label (NN/g placeholders).
- **Errors:** next to the field, state the problem and the fix, never blame, no humor, never color alone (icon + text, `--color-danger` on text and border plus an icon), preserve input (NN/g 2023; WCAG 3.3.1, 3.3.3, 1.4.1).
- **Accessible names** contain the visible text, ideally starting with it (WCAG 2.5.3). Status and success messages that appear without focus change are announced (WCAG 4.1.3, `role="status"` or `aria-live="polite"`; errors that block use `role="alert"`).
- **Use "select" not "click"** in instructions (GOV.UK); not everyone clicks.
- **No confirmshaming.** Decline options are neutral: "No thanks", "Not now", "Skip" (deceptive.design).

## Decision rules

### Buttons and actions
- Label = verb + object when the object is not obvious from context: "Add card", "Export CSV". A lone verb is fine inside a titled dialog whose title names the object.
- Echo pattern for destructive dialogs: **title asks with the verb and object, body states the consequence, primary button repeats the verb.**
  - Title: "Delete 'Q3 plan'?"
  - Body: "This deletes the plan and its 14 tasks for everyone. You cannot undo this."
  - Buttons: "Delete plan" (danger style) / "Keep plan"
- Prefer undo over confirmation for reversible actions: "Plan archived. Undo" (NN/g: routine confirmations train users to click through).
- Typed confirmation ("Type the project name to delete") only for irreversible, high-blast-radius actions.
- Money buttons show the amount: "Pay $48.00", "Send $250 to Maya", "Approve $265,195.92". The confirm button in a commit dialog too, not only the page button (round 1's dialog said "Approve run", `kb/reviews/benchmark-round1-app.md` item 10).
- KPI and column labels are true in every state: name what the number counts, not the outcome you hope for. "People in this run", not "People paid" before payment; round 1 showed "People paid 38" under "Nobody has been paid" (`kb/reviews/benchmark-round1-app.md` gate 16). Read every label against the empty, error and post-action states.
- Absolute dates (with weekday) for money, deadlines and legal timing: "Arrives by Fri, Oct 10". Relative dates ("by Friday", "tomorrow") are ambiguous across time zones and after midnight. Relative is fine for low-stakes recency ("Edited 2 hours ago"). (Added after testing; opinion consistent with NN/g "precise" error and status guidance.)
- Toggles and checkboxes: label names the setting positively; the control carries the state. "Email me receipts", not "Disable receipt emails".
- Loading button text states the action in progress: "Saving..." then "Saved". Keep width stable (hand-off: design-frontend).

### Forms
- Label: noun phrase, sentence case, no colon. "Email address".
- Hint (below label, above field): format or why you ask. "We'll only use this for receipts." Put format rules up front, not only in the error.
- Optional vs required: mark the minority. If most fields are required, mark "(optional)" on the few that are not.
- Password rules shown before typing, as a live checklist.
- Validate on blur (when the user leaves the field), not on every keystroke; once an error shows, re-check live so it clears the moment it is fixed (NN/g: avoid premature errors).

### Error messages: adaptive by default
Write one message per validation rule, not one per field. Baymard found 98% of ecommerce sites use generic messages and recommends 4 to 7 per complex field.

| Field | Rule broken | Message |
|---|---|---|
| Email | Empty | "Enter your email address" |
| Email | No @ | "Email address needs an @, like name@example.com" |
| Email | No domain ending | "This email is missing the end, such as .com" |
| Card | Too short | "Card number is too short. Check you have all 16 digits" |
| Card | Fails checksum | "Card number does not look right. Check for a typo" |
| Card | Expired | "This card expired in 03/26. Use a different card" |
| Phone | Letters | "Phone number can only include numbers, spaces and +" |
**Exception:** sign-in and password reset stay generic ("Email or password is not right") to avoid revealing which accounts exist (Baymard caveat); pair with rate limiting.

Error structure: **[What is wrong] + [how to fix]**, as one sentence when possible. Avoid "invalid", "illegal", "failed", "error" as the lead word.

Form-level summary (long forms): at top, "There are 2 problems on this page" with links to each field (GOV.UK pattern), focus moved to it on submit.

### System and server errors
- Say what happened in user terms, what is safe, and what to do: "We could not save your changes. Your draft is safe on this device. Try again in a minute." 
- Give a reference code after the message for support: "(Ref: 7F3A)".
- Total failure pages (404, 500): apology + a way forward (search, home, status page). A memorable touch is allowed here only (NN/g "mitigate total failure with novelty").

### Empty states
| Type | Copy job | Example |
|---|---|---|
| First use | Explain value + one action | "No invoices yet. Connect your bank to import them automatically." [Connect bank] |
| User cleared | Confirm success, light tone | "All caught up. New requests will show up here." |
| No results | Say what was searched, suggest a fix | "No results for 'recievable'. Check the spelling or try 'receivable'." [Clear filters] |
| Not permitted | Say why and who can help | "Only admins can see billing. Ask Sam Lee for access." |
| Error | Treat as an error message, not an empty state | |
Never show "No data" while loading; show progress (NN/g 2021).

### Success and confirmation
- Confirm the specific outcome plus next step: "Payment sent. Maya will get $250 by Fri, Oct 10."
- Toasts that disappear: under about 10 words, never the only record of something important, and no action inside a toast that auto-dismisses unless it is also reachable elsewhere or the toast stays until dismissed (WCAG 2.2.1 Timing Adjustable; hand-off: design-ux).

### AI features (2026 practice; partly opinion)
- Lead with the user goal, not the technology: "Draft a reply" beats "Ask AI" (NN/g 2025: "Powered by AI" is not a value proposition).
- Label generated content where a user could mistake it for their own or a human's: "Suggested by AI. Review before sending."
- Set expectations once, near the input, not as a wall of disclaimers: "Works best with invoices in English or French."
- Always pair generation with edit, retry and undo: [Use this] [Try again] [Edit].
- Errors say what to change: "I could not find a total on this invoice. Add it, or upload a clearer scan." Avoid fake humility ("As an AI...").

### Onboarding
- Default: no tutorial carousel. NN/g found deck-of-cards tutorials did not improve performance. Teach in context, at the moment of need.
- Onboarding copy is justified only to collect needed info, set preferences, or explain a genuinely unfamiliar feature (NN/g 2020).
- If you must use cards: Skip always visible, 3 cards or fewer (opinion), one idea each, headline is a benefit not a feature name.
- Permission prompts: pre-explain the benefit before the system dialog: "Turn on notifications to hear when your transfer lands." Buttons: "Turn on" / "Not now".

### Notifications
- Lead with the news, not the app: "Maya paid you $40 for dinner", not "Brightpay: You have a new notification".
- Front-load within the first 40 characters; lock screens truncate (opinion, varies by OS).

## Numbers
- Buttons: 1 to 4 words; under 25 characters in English to leave room for translation (reference 05).
- Error messages: 1 sentence, under about 15 words where possible (opinion consistent with NN/g "concise").
- Toasts: under 10 words (opinion).
- Complex fields: 4 to 7 error variants (Baymard).
- Touch targets for any text button or link: at least 24 x 24 CSS px, 44 x 44 preferred (shared foundation contract).

## Do and don't
| Don't | Do |
|---|---|
| "Invalid input" | "Enter a date after today, like 12/05/2026" |
| "Are you sure?" [Yes] [No] | "Cancel your scheduled payment of $120?" [Cancel payment] [Keep payment] |
| "No items found." | "No saved searches yet. Select the star on any search to save it here." |
| "Oops! Something went wrong :(" | "We could not load your statements. Check your connection and try again." |
| "No, I don't want to save money" | "No thanks" |
| Label inside field that vanishes | Visible label + optional example placeholder |

## Worked example: bank transfer flow
1. Amount screen. Label "Amount". Hint "Available: $1,240.18". Error (over balance): "That is more than your available $1,240.18. Enter a smaller amount." Button "Continue".
2. Recipient. Label "Account number". Hint "8 to 12 digits, on their cheque or banking app". Errors per rule: "Account number is too short. It needs at least 8 digits" / "Account numbers only use digits 0 to 9". Name check result: "This account belongs to M. Okafor." Buttons: [Send to M. Okafor] [Change account]. Not [Yes] [No]: the buttons themselves say what happens.
3. Review. Title "Send $250 to M. Okafor?" Body "Arrives by Fri, Oct 10. You cannot cancel after 5 pm today." Button "Send $250".
4. Success. "Sent. M. Okafor will get $250 by Fri, Oct 10." Secondary "Share receipt".
5. Cancel scheduled payment dialog: "Cancel your $120 payment to Hydro One on Oct 15?" / "It will not be sent. You can set it up again anytime." / [Cancel payment] [Keep payment]. Note the button never says "Cancel" alone, because "Cancel" would be ambiguous between cancelling the dialog and cancelling the payment.

## Hand-offs
- design-ux: flow design, when to confirm vs undo, toast behavior.
- design-frontend: aria-live, error focus management, button width stability.
- design-color: `--color-danger`, `--color-success` roles; never color alone.
- design-motion: how messages enter; respect reduced motion.
