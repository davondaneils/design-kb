# Settings

Jobs: dashboard, mobile app. Sources observed 2026-10-10. Source type per entry: **live page** (fetched or rendered today) or **Mobbin** (none yet; the Mobbin connector needs a paid plan). Opinion is marked (opinion).
Floor rules live in [design-product-ui 03-forms-settings](../../../skills/design-product-ui/references/03-forms-settings.md) (one save model per form, save bar, disabled-with-reason, danger zone basics) and [design-playbook-mobile platform-conventions](../../../skills/design-playbook-mobile/references/platform-conventions.md); this file is the ceiling: what the best shipped examples do.

## What the best examples do
1. **Settings split by scope, named by scope.** Stripe: "The Dashboard's settings are broken into three categories: Personal, Account, and Product." Vercel separates Team Settings from Project Settings, picked through the team switcher. Linear: "Members will see settings related to their own work, while admins and owners also see workspace administration settings." [docs.stripe.com/dashboard/basics](https://docs.stripe.com/dashboard/basics), [vercel.com/docs/project-configuration/project-settings](https://vercel.com/docs/project-configuration/project-settings), [linear.app/docs/workspaces](https://linear.app/docs/workspaces) [live page]
2. **Linear Preferences: one column of rows, label and one-line description left, control right, no Save button.** Rows are grouped in bordered cards under plain headings ("General", "Interface and theme"); controls are switches and single-select dropdowns that show the current value ("My issues", "Sunday", "Dark"). Observed in Linear's own published screenshot. [linear.app/docs/account-preferences](https://linear.app/docs/account-preferences) [live page]
3. **Autosave only for imperative controls; explicit Save for anything typed.** Primer: use automatic saving for ToggleSwitches, SegmentedControls and non-native single-select dropdowns; use explicit saving for text inputs, checkbox groups, radio groups and native selects. "Never mix save patterns in a single form." [primer.style/product/ui-patterns/saving](https://primer.style/product/ui-patterns/saving/) [live page]
4. **One Save per page, labeled with the thing saved, never disabled.** Primer: "There should only be one save button on a page"; Do: "Save public profile", Don't: "Done"; "Do not disable or hide a form's save button even if the form is invalid or has not been changed." [primer.style/product/ui-patterns/saving](https://primer.style/product/ui-patterns/saving/) [live page]
5. **Shopify: a save bar that appears only when something changed.** "The save bar appears whenever any form input value changes from its initial state" and hides on submit or reset. Shopify also says "Continuous data validation or auto-save for forms is incongruous with the standard Shopify admin save UX." [shopify.dev save bar](https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar), [shopify.dev forms](https://shopify.dev/docs/apps/design/user-experience/forms) [live page]
6. **Vercel puts reversible before irreversible in the danger zone.** "On the General page, find the Pause Project section above Delete Project." Pause and Delete both ask you to type the project name. The Delete section names what goes: "The project will be permanently deleted, including its deployments and domains." Observed in Vercel's docs screenshot. [vercel.com/docs/projects/managing-projects](https://vercel.com/docs/projects/managing-projects) [live page]
7. **GitHub uses three deliberate steps for repository deletion.** In the "Danger Zone" at the bottom of General settings: click Delete, click "I want to delete this repository", click "I have read and understand these effects", type the repository name, then "Delete this repository". [docs.github.com deleting a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/deleting-a-repository) [live page]
8. **Linear and Duolingo add a cooling-off window instead of only a dialog.** Linear workspace deletion: an emailed confirmation code, then "scheduled for deletion in 48 hours", and "Any admin can cancel during the 48-hour window." Duolingo (iOS: Profile, Settings gear, bottom, "Delete account"): confirm by email, then "you'll have 7 days to cancel." [linear.app/docs/workspaces](https://linear.app/docs/workspaces), [duolingo.com/help/delete-my-account-and-data](https://www.duolingo.com/help/delete-my-account-and-data) [live page]
9. **Revolut offers the lesser option before closure.** Help page opens with "Switch to our Standard plan instead and keep your account," then lists closure requirements (zero balances, no pending transactions) before the in-app path: profile icon, Account, Close account. [help.revolut.com closing account](https://help.revolut.com/help/profile-and-plan/closing-account) [live page]
10. **Mobile settings show the current value in the row.** Android: "Below the title, show the status to highlight the value of the setting." Its example rows read "Storage: 1.37 GB used, 10 GB free", "Video playback: Medium quality, auto-play on, PiP", "Quality: High". [source.android.com settings guidelines](https://source.android.com/docs/core/settings/settings-guidelines), [developer.android.com settings pattern](https://developer.android.com/design/ui/mobile/guides/patterns/settings) [live page]
11. **Mobile limits per screen.** Android: "Showing more than 10-15 items can be overwhelming"; "For 15 or more settings, group related settings under a subscreen"; the row label that opens a subscreen must match its title; add search for deep hierarchies. On large screens, settings become list-detail. [developer.android.com settings pattern](https://developer.android.com/design/ui/mobile/guides/patterns/settings) [live page]
12. **Apple: keep task options in the task, global options out of the app.** "Prefer letting people modify task-specific options without going to your settings area" and "Respect people's systemwide settings and avoid including redundant versions of them." On iOS, "Use the switch toggle style only in a list row." [developer.apple.com HIG settings](https://developer.apple.com/design/human-interface-guidelines/settings), [HIG toggles](https://developer.apple.com/design/human-interface-guidelines/toggles) [live page]
13. **A main switch that governs a whole screen.** Android "main setting": a switch at the top turns the whole feature off and disables the dependent settings below it, with a reason. [source.android.com settings guidelines](https://source.android.com/docs/core/settings/settings-guidelines) [live page]

## Common structure
Dashboard (Stripe, Vercel, Linear, GitHub):
```
Scope switcher (personal | workspace/team | project)
+----------------+------------------------------------------+
| Settings nav   | Page title                               |
| grouped by     | Group heading                            |
| scope          | [card] label + 1-line description | ctrl |
|                |        label + description        | ctrl |
|                | Group heading ...                        |
|                | Danger zone (last): Pause/Transfer, then |
|                |   Delete with typed name                 |
+----------------+------------------------------------------+
Save model: rows with switches and dropdowns autosave (Linear);
text forms get one labeled Save or a save bar on change (Primer, Shopify).
```
Mobile (Android, iOS, Duolingo, Revolut):
```
Profile/avatar -> Settings (gear)
Large title "Settings"
Group heading
  Row: title / current value (secondary text) / switch or chevron
  ... <= 10 to 15 rows per screen, else subscreen
Account, then sign out, then delete account at the very bottom
Delete -> confirmation by email or code -> grace window (48 h to 7 days)
```

## Spacing and type conventions observed
| Product or system | Element | Value | How known | Link |
|---|---|---|---|---|
| Material 3 | List item side padding; trailing element right padding | 16dp; 24dp | stated in docs | [lists specs](https://m3.material.io/components/lists/specs) |
| Material 3 | List item target | 48dp | stated in docs | same |
| Android | Items per settings screen | 10 to 15 max; subscreen at 15+ | stated in docs | [settings pattern](https://developer.android.com/design/ui/mobile/guides/patterns/settings) |
| Android | Small-screen margin | 16dp | stated in docs | [10 steps to Android](https://developer.android.com/design/ui/mobile/guides/foundations/translate-designs) |
| Apple HIG | Radio set size before switching to a pop-up | about 5 options | stated in docs (macOS toggles) | [toggles](https://developer.apple.com/design/human-interface-guidelines/toggles) |
| Linear | Settings row height | about 60px, title 14 to 15px over muted description | estimated from screenshot | [preferences](https://linear.app/docs/account-preferences) |
| Linear | Content column | about 640px, centered, one column | estimated from screenshot | same |
| Linear | Gap between groups | about 2x the row height above each heading | estimated from screenshot | same |
| Carbon | Field gap on a page; before buttons | 32px; 48px | stated in docs | [forms pattern](https://carbondesignsystem.com/patterns/forms-pattern/) |
| Vercel | Deletion confirmation | type project name plus a prompt | stated in docs | [managing projects](https://vercel.com/docs/projects/managing-projects) |
| Linear / Duolingo | Grace window after delete request | 48 hours / 7 days | stated in docs | [workspaces](https://linear.app/docs/workspaces), [Duolingo](https://www.duolingo.com/help/delete-my-account-and-data) |

## Mistakes they avoid
- **Mixing save models in one form.** Primer forbids it; Linear avoids it by making every preference row imperative (switch or dropdown).
- **One Save button per section.** Primer: it "can cause confusion about which save button saves which group."
- **Vague setting titles.** Android: avoid "General settings" and verbs like set, change, manage; show the value instead. [settings guidelines](https://source.android.com/docs/core/settings/settings-guidelines)
- **Copying system settings into the app** (text size, accessibility). Apple says it implies the system setting may not apply.
- **Deleting instantly.** Linear (48 h), Duolingo (7 days) and GitHub (3 steps plus typed name) all slow it down in proportion to blast radius.
- **Hiding account closure inside Support.** Cash App's documented path is profile, Support, Something Else, Account Settings, Close Account. [cash.app/help/3139-close-account](https://cash.app/help/3139-close-account). Revolut and Duolingo put it under Account or at the bottom of Settings instead (opinion: findable deletion builds trust; buried deletion is a dark pattern).
- **Grey "Other" or "Miscellaneous" groups.** Material: section titles "should be specific, avoiding ambiguous names." [m1.material.io settings](https://m1.material.io/patterns/settings.html)

## Products to look at
- Linear Preferences: the row anatomy and autosave-only controls. https://linear.app/docs/account-preferences
- Linear workspace deletion: emailed code and 48-hour cancel window. https://linear.app/docs/workspaces
- Vercel project settings: scope split, Pause above Delete, typed confirmation. https://vercel.com/docs/projects/managing-projects
- GitHub repository Danger Zone: three-step delete. https://docs.github.com/en/repositories/creating-and-managing-repositories/deleting-a-repository
- Primer Saving pattern: the most precise written rules for save models. https://primer.style/product/ui-patterns/saving/
- Shopify save bar: appears on change, hides on save or discard. https://shopify.dev/docs/api/app-home/app-bridge-web-components/save-bar
- Stripe Dashboard settings categories: Personal, Account, Product. https://docs.stripe.com/dashboard/basics
- Android settings pattern and AOSP guidelines: values in rows, limits per screen, main switch, list-detail. https://developer.android.com/design/ui/mobile/guides/patterns/settings and https://source.android.com/docs/core/settings/settings-guidelines
- Duolingo account deletion (iOS): bottom of Settings, 7-day grace. https://www.duolingo.com/help/delete-my-account-and-data
- Revolut account closure: downgrade offer first, then requirements. https://help.revolut.com/help/profile-and-plan/closing-account
- Mobbin links pending: connector needs a paid plan.

## Gap: average vs best in class
An average settings area is one long form with a permanent Save at the bottom, switches that secretly wait for Save, titles like "General", values hidden until you open each row, and a red Delete next to Save that works in one click. The best split by scope, show each value in its row, autosave switches and dropdowns while typed fields get one labeled Save or a save bar, put reversible actions above irreversible ones, and scale friction to blast radius (typed name, emailed code, grace window). Gap score 4 of 5 (opinion): most products get layout right but miss save-model consistency and graded deletion.

## Screenshots
| Path | Shows | Source URL | Owner | Captured |
|---|---|---|---|---|
| shots/07-settings/linear-preferences-rows.jpg | Preferences rows: label, description, switch or dropdown; grouped cards; no Save | https://linear.app/docs/account-preferences | Linear | 2026-10-10 |
| shots/07-settings/vercel-delete-project-section.jpg | Delete Project section naming what is lost, red Delete in footer | https://vercel.com/docs/projects/managing-projects | Vercel | 2026-10-10 |
| shots/07-settings/android-settings-list-mobile.jpg | Mobile settings list with values in rows and grouped cards | https://developer.android.com/design/ui/mobile/guides/patterns/settings | Google (Android) | 2026-10-10 |
| shots/07-settings/android-settings-list-detail-tablet.jpg | Same settings as list-detail on a large screen | https://developer.android.com/design/ui/mobile/guides/patterns/settings | Google (Android) | 2026-10-10 |
