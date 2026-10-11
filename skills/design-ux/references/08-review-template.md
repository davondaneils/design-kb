# UX review template and worked example

Use for "review this screen/flow", "UX audit", "what's wrong with this".

## Output format
1. **Context line:** user, goal, device, frequency, stakes. State assumptions.
2. **Gate result:** PASS or FAIL. List every miss as: `[severity] G# check: what is wrong -> exact fix`. Severity uses Nielsen's scale (4 catastrophe, 3 major, 2 minor, 1 cosmetic).
3. **Pattern issues:** wrong component or pattern for the job, with the rule and source.
4. **States not designed:** list missing empty, loading, error, partial, overflow states with a spec for each.
5. **Expert upgrades:** at most 5, ranked by impact. Mark opinion.
6. **Hand-offs:** what goes to design-copy, design-frontend, design-motion and others.

Keep it to findings and fixes. No praise padding.

## Worked example: account settings screen (web app)

Brief as given: a settings page with a left list of sections, a form for profile (name, email, avatar), a "Danger zone" with Delete account, Save button at the bottom disabled until something changes, success shown as a green banner that fades after 2 s.

**Context:** existing user, desktop and mobile web, infrequent use, one very high-stakes action (delete account).

**Gate: FAIL**
- [3] G8/G9 Errors and Save: Save disabled until changes means keyboard users cannot reach it and get no reason. -> Keep Save enabled; if nothing changed, saving is a no-op with "No changes to save" inline (Silver; Vercel).
- [3] G10 Destructive safety: Delete account uses the same dialog as everything else with "OK / Cancel". -> Dialog title "Delete account for dana@acme.com?", body states what is lost and that it cannot be undone after 30 days, button "Delete account" (red), "Cancel" with initial focus; require typing the email because this is rare and irreversible (NN/g; APG).
- [2] G1 Status: fading success banner (2 s) is missed and is not announced. -> Inline "Saved" next to the button for at least 2 s, announced with `aria-live="polite"`, and the form shows saved values (NN/g; WCAG 4.1.3).
- [2] G5 Focus: sticky footer with Save covers focused fields at the bottom on mobile. -> `scroll-padding-bottom` equal to the footer height (WCAG 2.4.11).
- [2] G11 Semantics: section list items are `div`s with click handlers; sections are not in the URL. -> `<a href="/settings/profile">` etc., so refresh and share work.

**Pattern issues**
- Email change in the same form as name: email changes need verification. -> Separate "Change email" flow that sends a confirmation link and keeps the old email until confirmed.

**States not designed**
- Avatar upload: progress, file too large ("Choose an image under 5 MB"), wrong type, success preview.
- Save failure: inline error banner at the top of the form with Retry, values kept.
- Unsaved changes on navigation: prompt "Leave without saving?" with "Save and leave" / "Discard" / "Stay".

**Expert upgrades**
1. Soft delete: account deletion is scheduled for 30 days with a "Restore account" link in the email (turns irreversible into reversible; Raskin).
2. Autosave low-risk toggles (notifications) instantly with an inline "Saved", keep explicit Save only for the profile form (opinion: mixing is fine when grouped clearly).
3. Danger zone visually separated and placed last, never next to Save.

**Hand-offs:** dialog copy to design-copy; `<dialog>` and live region implementation to design-frontend; settings layout and save models to design-product-ui `references/03-forms-settings.md`.

A second worked review, of a shop's purchase flow, is in `kb/tests/design-ux.md` (run 2, the baseline audit).
