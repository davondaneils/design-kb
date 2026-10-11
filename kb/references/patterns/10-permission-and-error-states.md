# Permission and error states

Jobs: dashboard, mobile app. Sources observed 2026-10-10. Source type per entry: **live page** (fetched or rendered today) or **Mobbin** (none yet; the Mobbin connector needs a paid plan). Opinion is marked (opinion).
Floor rules live in [../../../skills/design-ux/references/04-states-feedback.md](../../../skills/design-ux/references/04-states-feedback.md) (error ladder, no-permission empty state, full-page 404) and [../../../skills/design-product-ui/references/05-states-bulk.md](../../../skills/design-product-ui/references/05-states-bulk.md) (product UI states). OS permission timing lives in [../../../skills/design-ux/references/05-onboarding.md](../../../skills/design-ux/references/05-onboarding.md). This file is the ceiling: what the best shipped examples do.

## What the best examples do

1. **Degrade the section, not the page, when only secondary data fails.** GitHub (Primer) splits a page into primary and secondary experiences: "If there's an outage that doesn't affect the primary experiences of the page, it's best to render a degraded page." Issue title and body are primary; notification dot and nav counters are secondary. [Primer: Degraded experiences](https://primer.style/product/ui-patterns/degraded-experiences/) [live page]
2. **Never let a failed load look like an empty list.** Primer: "If we know a user created something, don't show a generic 'empty state'." The org page shows "Repositories cannot be loaded" with a reload hint, support link and GitHub status link in place of the list (screenshot below). Cap: "limiting pages to 5 or less outage messages." [Primer](https://primer.style/product/ui-patterns/degraded-experiences/) [live page]
3. **Muted, not alarming, for degraded blocks.** Primer's Blankslate for unavailable data uses the alert icon in `fgColor-muted`, because `fgColor-attention` "could be too harsh and over-emphasize the error." A page-wide outage gets one warning Banner above the global nav that links to the status page. [Primer](https://primer.style/product/ui-patterns/degraded-experiences/) [live page]
4. **Remove, inactive, or disabled: a decision tree, not a habit.** Primer: default to removing a non-functional button; if removing it would disorient, use an inactive button that explains on click; use disabled only when it cannot respond at all. HashiCorp Helios goes further for roles: "When a user does not have permissions, hide the related actions, navigation items, and views." [Primer](https://primer.style/product/ui-patterns/degraded-experiences/), [Helios: Show, hide, and disable](https://helios.hashicorp.design/patterns/disabled-patterns) [live page]
5. **One message for "missing" and "forbidden" so nothing leaks.** GitHub "uses a 404 Not Found response instead of a 403 Forbidden response to avoid confirming the existence of private repositories." Notion's web 404 does the same in copy: "This page couldn't be found. You may not have access, or it might have been deleted or moved. Check the link and try again." [GitHub Docs](https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api), [Notion 404 rendered](https://www.notion.so/this-does-not-exist-xyz123) [live page]
6. **When existence is not secret, turn the wall into a request button.** Vercel's protected deployment shows "Access Required", "You are signed in as <name>", one "Request Access" button and "Log in with a different Vercel Account". The request "triggers an email and Vercel notification to the branch authors." [Vercel Authentication docs](https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication) [live page]
7. **Close the request loop, including the "no".** Figma's request flow: "Start editing", optional note, "Send request"; the requester gets an email and a file browser notification on approve or deny, and "The email address of the admin who declined your request is included in the notification." Notion routes requests to the owner's Inbox and says "try refreshing the page" once accepted. [Figma: Make a seat request](https://help.figma.com/hc/en-us/articles/360040453433-Request-to-edit-a-file), [Notion: Sharing and permissions](https://www.notion.com/help/sharing-and-permissions) [live page]
8. **Tell people who can grant access.** Linear lets any member open "View workspace admins" from the command menu or `linear.app/settings/view-admins`. Guests on a multi-team project "still see the project shell, but only with their allowed team's issues visible" (role-gated content, not a blank page). [Linear: Members and roles](https://linear.app/docs/members-roles) [live page]
9. **Offline is a mode with an inventory, not an error.** Notion (desktop and mobile): Settings, Offline lists downloaded pages; offline-incapable blocks (embeds, forms, buttons, AI) show as unavailable in the slash menu; search shows offline pages first and "unavailable ones are greyed out"; sharing and permission edits are blocked offline. [Notion: Use pages offline](https://www.notion.com/help/use-pages-offline), [Notion offline guide](https://www.notion.com/help/guides/working-offline-in-notion-everything-you-need-to-know) [live page]
10. **Show sync state in place, keep edits safe.** Figma shows a toolbar icon while "attempting to save your changes" and another when it "considers you offline", with a tooltip; unsynced files are listed later in a "Sync offline changes" modal with Open to sync per file. [Figma: What can I do offline](https://help.figma.com/hc/en-us/articles/360040328553-What-can-I-do-offline-in-Figma) [live page]
11. **Mobile offline: grey out what will not work, say exactly what is lost.** Spotify Offline Mode: "Anything you haven't downloaded is now grayed out and unavailable"; downloads are removed if you do not go online "at least once in 30 days". Google Maps: offline maps guide you "as long as the entire route is within the offline map"; transit, cycling and walking directions are unavailable. [Spotify: Listen offline](https://support.spotify.com/us/article/listen-offline/), [Google Maps Help](https://support.google.com/maps/answer/6291838) [live page]
12. **No launch alert for a dead network.** Apple HIG: "If your app detects a problem at startup, like no network connection... show cached or placeholder data and a nonintrusive label." Mail's example: a server-unavailable indicator people can choose to learn more from. [HIG: Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts) [live page]
13. **OS permission denied: degrade the feature, show the gap where the result would be, stop asking.** Android: "Show a message where the feature's results or data would have appeared", "Don't display a full-screen warning", and two Deny taps mean the system dialog never shows again ("considered a permanent denial"). iOS: after a choice "the system remembers... and won't prompt them again"; apps send people to their own Settings page with `UIApplication.openSettingsURLString`; for Photos, offer an in-app affordance that reopens the limited-library picker. [Android: Request runtime permissions](https://developer.android.com/training/permissions/requesting), [Apple: openSettingsURLString](https://developer.apple.com/documentation/uikit/uiapplication/opensettingsurlstring), [Apple: Limited Photos library](https://developer.apple.com/documentation/photokit/delivering-an-enhanced-privacy-experience-in-your-photos-app) [live page]
14. **Pre-permission screen: one button, and it opens the system alert.** Apple HIG: "Include only one button and make it clear that it opens the system alert"; do not title it "Allow". Purpose string example: "The app records during the night to detect snoring sounds." [HIG: Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy) [live page]

## Common structure

Full-page states (404, no access, total failure), dashboard:
```
[normal app chrome stays: nav, account menu]
        [small mark or illustration, optional]
        Title: what happened, 3 to 6 words
        Body: why (or "may not have access, or moved"), 1 to 2 sentences
        [Primary: Request access | Return home]   [Secondary: switch account | search]
        Footer links: status page . support
```
Partial failure, dashboard:
1. Page-wide problem: one warning banner above global nav, links to status page.
2. Section failed: Blankslate in place of the section (muted icon, title, what to try, support link). Never an empty state.
3. Cell or counter failed: inline warning icon plus short text, or drop the counter.
4. Max 5 such messages per page (Primer).

Mobile:
1. Offline: content stays, unusable items greyed, a small status label or icon (no alert).
2. OS permission denied: feature screen still opens; the slot where results would be shows one line of why plus "Open Settings" (or the limited picker for Photos). Rest of app unaffected.
3. No access to shared content: same copy as not-found, with a request action when the link came from a teammate.

## Spacing and type conventions observed

| Product or system | Element | Value | How known | Link |
|---|---|---|---|---|
| Notion web 404 (1440px) | Title | 17px / 22px, weight 600, rgb(44,44,43) | measured with getComputedStyle | https://www.notion.so/this-does-not-exist-xyz123 |
| Notion web 404 (1440px) | Body | 14px / 20px, weight 400, rgb(125,122,117), 340px wide | measured with getComputedStyle | same |
| Notion web 404 (390px, mobile UA) | Body | 16px / 22px (body grows 2px on mobile), title unchanged 17px | measured with getComputedStyle | same |
| Notion web 404 | Title to body gap | about 8px (title bottom y=392, body top y=400) | measured with getComputedStyle | same |
| Vercel docs 404 (390px) | "404" heading | 48px / 56px, weight 600 | measured with getComputedStyle | https://vercel.com/docs/this-does-not-exist-xyz |
| Vercel docs 404 (390px) | Body "This page doesn't exist." | 16px / 24px | measured with getComputedStyle | same |
| Vercel docs 404 (390px) | Buttons "Return Home", "Ask your agent for help" | 36px tall, 14px weight 500, 12px side padding, full pill radius | measured with getComputedStyle | same |
| GitHub 404 | Search button in page body | 32px tall, 14px / 20px, padding 5px 16px | measured with getComputedStyle | https://github.com/this-page-does-not-exist-xyz123/abc |
| Primer | Outage messages per page | 5 or fewer | stated in docs | https://primer.style/product/ui-patterns/degraded-experiences/ |
| Atlassian | Error message length; CTA length | 1 to 2 sentences; 1 to 2 words | stated in docs | https://atlassian.design/foundations/content/designing-messages/error-messages |
| Android | Denials before the OS stops showing the dialog | 2 | stated in docs | https://developer.android.com/training/permissions/requesting |
| Spotify | Offline downloads expire without going online | 30 days | stated in docs | https://support.spotify.com/us/article/listen-offline/ |

## Mistakes they avoid

- **Empty state for a failed load** (user thinks data was deleted). Avoided by GitHub: "Repositories cannot be loaded" in place of the list. [Primer](https://primer.style/product/ui-patterns/degraded-experiences/)
- **"undefined of undefined" or zeros in place of data.** Primer shows this as a Don't; render an error message in the cell instead. [Primer](https://primer.style/product/ui-patterns/degraded-experiences/)
- **403 page that confirms a private thing exists.** GitHub returns 404; Notion's copy covers both cases. [GitHub Docs](https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api)
- **Dead-end "You don't have access" with no next step.** Vercel and Figma put a request button on the wall and notify the owner; Carbon's rule for a permissions issue: "Suggest steps or process to request access." [Carbon: Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- **Request sent into the void.** Figma notifies on approve and on deny, and names who declined. [Figma](https://help.figma.com/hc/en-us/articles/360040453433-Request-to-edit-a-file)
- **Disabled buttons with hover-only tooltips to explain roles.** Primer: tooltips "may only be used on focusable elements"; Helios recommends hiding. [Primer](https://primer.style/product/ui-patterns/degraded-experiences/), [Helios](https://helios.hashicorp.design/patterns/disabled-patterns)
- **Alert on launch when offline.** Apple HIG says use cached data and a nonintrusive label. [HIG: Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)
- **Nagging after a permission denial.** Android: "persistent nagging to reconsider is not respectful of their choice." [Android](https://developer.android.com/training/permissions/requesting)
- **A wall of red.** Primer warns many `fg.warning` messages make a page "feel broken instead of degraded"; Carbon suggests text-only states when many dashboard widgets fail at once. [Carbon](https://carbondesignsystem.com/patterns/empty-states-pattern/)
- **Cute 404 with no way forward** (opinion). Vercel's docs 404 has Return Home, an "Ask your agent for help" copy button and Docs / Knowledge Base / Blog links; GitHub's has site search plus support and status links.

## Products to look at

- GitHub (Primer): degraded pages, Blankslate for failed sections, button decision tree. https://primer.style/product/ui-patterns/degraded-experiences/
- Vercel: access-required page with request button and account switch. https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication
- Figma: request to edit, seat request, decline notice naming the admin; offline toolbar icon and sync modal. https://help.figma.com/hc/en-us/articles/360040453433-Request-to-edit-a-file and https://help.figma.com/hc/en-us/articles/360040328553-What-can-I-do-offline-in-Figma
- Notion: ambiguous not-found copy, request access, offline settings tab. https://www.notion.com/help/sharing-and-permissions and https://www.notion.com/help/use-pages-offline
- Linear: role model, guest project shell, "View workspace admins". https://linear.app/docs/members-roles
- Spotify mobile: offline mode greying and expiry rules. https://support.spotify.com/us/article/listen-offline/
- Google Maps mobile: offline maps with explicit limits. https://support.google.com/maps/answer/6291838
- Android and iOS platform docs for denied permissions. https://developer.android.com/training/permissions/requesting and https://developer.apple.com/design/human-interface-guidelines/privacy
- Carbon: error-management empty state table (permissions, systems, configuration, unsupported). https://carbondesignsystem.com/patterns/empty-states-pattern/
- Mobbin links pending: connector needs a paid plan.

## Gap: average vs best in class

An average product shows a generic "Something went wrong" page for any failure, a 403 wall with no action, an empty list when a query fails, disabled buttons nobody can explain, and an alert when the phone is offline. The best decide per section whether the page is still useful, keep the rest working, word "missing" and "forbidden" identically unless a request button makes sense, route the request to a named person and report the outcome, and treat offline and denied OS permissions as normal modes with clear inventories. Gap score: 4 of 5 (opinion): the floor is easy, but partial failure and the request loop take product and backend work most teams skip.

## Screenshots

| Path | Shows | Source URL | Owner | Captured |
|---|---|---|---|---|
| shots/10-permission-and-error-states/github-primer-degraded-repo-list.jpg | Org page with the repo list replaced by "Repositories cannot be loaded", reload hint, support and status links | https://primer.style/product/ui-patterns/degraded-experiences/ | GitHub | 2026-10-10 |
| shots/10-permission-and-error-states/vercel-request-access.jpg | "Access Required" wall: signed-in identity, Request Access button, switch account link | https://vercel.com/docs/deployment-protection/methods-to-protect-deployments/vercel-authentication | Vercel | 2026-10-10 |
| shots/10-permission-and-error-states/notion-404-no-access-mobile.jpg | Notion not-found page at 390px: one message covering no access, deleted or moved | https://www.notion.so/this-does-not-exist-xyz123 | Notion Labs | 2026-10-10 |
| shots/10-permission-and-error-states/vercel-docs-404.jpg | Vercel docs 404 at 1440px: Return Home, Ask your agent for help, section links | https://vercel.com/docs/this-does-not-exist-xyz | Vercel | 2026-10-10 |

Images are (c) their owners, kept for internal reference and critique.
