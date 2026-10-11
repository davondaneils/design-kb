# Notifications

Jobs: dashboard, mobile app. Sources observed 2026-10-10. Source type per entry: **live page** (fetched or rendered today) or **Mobbin** (none yet; the Mobbin connector needs a paid plan). Opinion is marked (opinion).
Floor rules live in [design-ux 04-states-feedback](../../../skills/design-ux/references/04-states-feedback.md) (error ladder, toast timing and live regions) and [design-product-ui 03-forms-settings](../../../skills/design-product-ui/references/03-forms-settings.md) (preference toggles autosave); this file is the ceiling: what the best shipped examples do.

## What the best examples do
1. **Linear splits the inbox into Priority and Other, with counts.** "The Priority tab separates notifications that need your attention from other updates." Its published screenshot shows "Priority 4" and "Other 12" as pill tabs; each row has an avatar with an event glyph, issue ID and title, a one-line reason ("Didier assigned the issue to you"), status icon and relative time ("1h"); unread rows carry a blue dot. [linear.app/docs/inbox](https://linear.app/docs/inbox) [live page]
2. **Linear triage is keyboard-first.** `G` then `I` opens Inbox; `U` read/unread; `Option/Alt U` mark all read; `H` snooze (the item returns at the chosen time); `Backspace` delete; `Shift Backspace` delete all read; `Cmd/Ctrl F` quick search. Inbox keeps up to 2,000 open notifications, then archives automatically. [linear.app/docs/inbox](https://linear.app/docs/inbox), [linear.app/docs/notifications](https://linear.app/docs/notifications) [live page]
3. **GitHub: Done, not delete; reason labels; saved filters.** Triage options: "Remove a notification from the inbox with Done", mark read or unread, "Save a notification for later review." Each row shows "the reason you're receiving a notification as a label, such as, mention, subscribed, or review requested," filterable with `reason:review-requested`; custom filters and group by repository or date. [docs.github.com about notifications](https://docs.github.com/en/subscriptions-and-notifications/concepts/about-notifications), [configuring notifications](https://docs.github.com/en/subscriptions-and-notifications/get-started/configuring-notifications) [live page]
4. **GitHub shows unread as a dot, not a count, in the header.** The docs screenshot is captioned "An inbox icon has a blue dot, indicating unread notifications." [docs.github.com managing notifications from your inbox](https://docs.github.com/en/subscriptions-and-notifications/how-tos/viewing-and-triaging-notifications/managing-notifications-from-your-inbox) [live page]
5. **Linear email digests wait and skip what you already read.** "Email digests send with time delays based on urgency, and are only sent if you haven't already read the Linear inbox notification." Channels (Desktop, Mobile, Email, Slack) each have a master toggle and per-type toggles (Assignments, Status changes, Comments and replies, Mentions), plus "Send test notification". [linear.app/docs/notifications](https://linear.app/docs/notifications) [live page]
6. **Slack holds mobile push while you are at your desk.** "By default, you'll receive mobile notifications one minute after locking your desktop screen or 10 minutes after Slack stops detecting cursor activity." Choice per device: Everything, or Mentions and direct messages. [slack.com/help configure notifications](https://slack.com/help/articles/201355156-Configure-your-Slack-notifications) [live page]
7. **GitHub Mobile: four push types and working hours.** Push can be enabled for "Direct mentions, Assignments to issues or pull requests, Requests to review a pull request, Requests to approve a deployment," and a Working Hours schedule limits when pushes arrive. The mobile inbox syncs with the web inbox. [docs.github.com configuring notifications](https://docs.github.com/en/subscriptions-and-notifications/get-started/configuring-notifications) [live page]
8. **Ask for push permission in context, after a pre-prompt.** Android: notifications are "off by default" on Android 13+; good moments are when "The user taps an 'alert bell' button," follows someone, or submits a food order; or wait "until the third or fourth time the user launches your app." Its recommended flow: sign in, a "Get notified!" screen with "I'm in" and "Skip", then the system dialog. Apple: request "after the person schedules a first task" rather than "on first launch." [developer.android.com notification permission](https://developer.android.com/develop/ui/views/notifications/notification-permission), [developer.apple.com asking permission](https://developer.apple.com/documentation/usernotifications/asking-permission-to-use-notifications) [live page]
9. **Apple provisional authorization: deliver quietly, let people decide later.** Provisional notifications "don't interrupt the person with a sound or banner, or appear on the lock screen," appear only in Notification Center, and include buttons to keep or turn off. [developer.apple.com asking permission](https://developer.apple.com/documentation/usernotifications/asking-permission-to-use-notifications) [live page]
10. **Honest urgency levels on iOS.** Passive, Active, Time Sensitive, Critical; Time Sensitive is for events "happening now or will happen within an hour," and "Never use the Time Sensitive interruption level to send a marketing notification." [HIG managing notifications](https://developer.apple.com/design/human-interface-guidelines/managing-notifications) [live page]
11. **Duolingo rotates reminder copy so no single message wears out.** From about 200 million practice reminders over 34 days, Duolingo found it "had to ensure that the same notification was not used too often" and picks a template per learner per day. [blog.duolingo.com](https://blog.duolingo.com/hi-its-duo-the-ai-behind-the-meme/) [live page]
12. **Toasts: short, one action, and longer when they carry an action.** Polaris: "Not go over 3 words," noun plus verb ("Product updated"), action toasts last "at least 10,000 milliseconds." Material: auto-dismiss after "4 to 10 seconds," one at a time, action snackbars stay until acted on. Carbon: action toasts "persist until dismissed," text no more than 3 lines. [Polaris toast](https://polaris-react.shopify.com/components/feedback-indicators/toast), [M3 snackbar](https://m3.material.io/components/snackbar/guidelines), [Carbon notifications](https://carbondesignsystem.com/patterns/notification-pattern/) [live page]
13. **Sonner (open-source React toast) stacks and fans out on hover.** Measured at 1280x800: bottom-right, 24px from the edges, 356px wide, 13px text, 8px radius, 16px padding, `aria-live="polite"`. Three toasts collapse into a deck (older ones scale to 338 and 320px and peek about 13px); hover expands them with a 14px gap. All three, including one with "Undo", were gone within about 5.5 s of appearing, which falls short of Polaris's 10s floor for action toasts. [sonner.emilkowal.ski](https://sonner.emilkowal.ski/) [live page]

## Common structure
Dashboard inbox (Linear, GitHub):
```
Sidebar: Inbox  (dot or count badge)
+----------------------------------+----------------------------+
| [Priority 4] [Other 12]  filter  | Preview of the issue/PR    |
| o Avatar+glyph  ID Title     1h  | (open without leaving)     |
|   Reason: "Lena mentioned you"   |                            |
| ...                              |                            |
| Keys: U read, H snooze, Done/Del |                            |
+----------------------------------+----------------------------+
Preferences: channel (Desktop | Mobile | Email | Slack) x event type toggles,
digest timing, test notification.
```
Toasts (web): bottom corner, 1 to 3 visible, newest on top, text-only ones auto-dismiss 4 to 10 s, ones with an action stay 10 s or more or until dismissed, and every action also exists elsewhere.
Mobile:
```
First value moment -> pre-prompt ("Get notified!" I'm in / Skip) -> system dialog
Push: short title, plain sentence body, no private data, 1 action verb
Badge: unread count only, cleared when read; dot for "something new"
Settings: per-type switches, quiet hours / working hours, desktop-active hold
```

## Spacing and type conventions observed
| Product or system | Element | Value | How known | Link |
|---|---|---|---|---|
| Sonner | Toast width / padding / radius / text | 356px / 16px / 8px / 13px | measured with getComputedStyle | [sonner.emilkowal.ski](https://sonner.emilkowal.ski/) |
| Sonner | Edge offset; gap when expanded | 24px; 14px | measured (CSS vars) | same |
| Sonner | Default lifetime | about 4 to 5 s (all gone within 5.5 s) | measured with a timer | same |
| Polaris | Toast length; action toast lifetime | 3 words; at least 10,000 ms | stated in docs | [toast](https://polaris-react.shopify.com/components/feedback-indicators/toast) |
| Material 3 | Snackbar lifetime; visible at once | 4 to 10 s; 1 | stated in docs | [snackbar](https://m3.material.io/components/snackbar/guidelines) |
| Material 3 | Ideal snackbar line length | 40 to 60 characters | stated in docs | same |
| Carbon | Toast text | max 3 lines; newest on top | stated in docs | [notifications](https://carbondesignsystem.com/patterns/notification-pattern/) |
| Atlassian | Flag message; actions | scrolls past 5 lines; max 2 actions; bottom left | stated in docs | [flag](https://atlassian.design/components/flag/usage) |
| Material 3 | Badge sizes | dot 6dp; count 16dp tall; max 4 characters ("999+") at 16x34dp | stated in docs | [badge specs](https://m3.material.io/components/badges/specs) |
| Linear | Inbox row | avatar about as tall as the two text lines, time right-aligned | estimated from screenshot | [inbox](https://linear.app/docs/inbox) |
| Slack | Mobile push hold | 1 min after desktop lock, 10 min after inactivity | stated in docs | [configure notifications](https://slack.com/help/articles/201355156-Configure-your-Slack-notifications) |
| Linear | Inbox cap | 2,000 open notifications | stated in docs | [notifications](https://linear.app/docs/notifications) |

## Mistakes they avoid
- **Asking for push on first launch.** Apple and Android both recommend asking in context; Android adds a pre-prompt so a "no" does not burn the system dialog.
- **Duplicate notifications across channels.** Linear skips the email if you already read it in the inbox; Slack holds push while you are active on desktop. Apple: "Avoid sending multiple notifications for the same thing."
- **Badges for non-notification numbers or stale badges.** Apple: badge only unread notifications and "Update your app's badge as soon as people open the corresponding notifications." [HIG notifications](https://developer.apple.com/design/human-interface-guidelines/notifications)
- **Errors in toasts.** Polaris: "Avoid using toast for error messages"; use a banner. Atlassian: never auto-dismiss critical warnings or errors.
- **Mixing dismissible and non-dismissible toasts in one stack.** Atlassian forbids it.
- **Stacking snackbars.** Material: one at a time; an updated one replaces the old.
- **Delete-only triage.** GitHub's Done and Saved, and Linear's snooze, keep a way back (opinion: delete without undo is the weaker pattern).
- **Short-lived action toasts.** Sonner's default (about 4 s) removed an Undo toast; Polaris asks for 10 s and Material and Carbon keep action toasts until dismissed (opinion: set a longer duration when a toast carries Undo).

## Products to look at
- Linear Inbox: Priority vs Other, keyboard triage, snooze. https://linear.app/docs/inbox
- Linear notification settings: channel by event-type toggles, digest skip-if-read. https://linear.app/docs/notifications
- GitHub notifications inbox: Done, Saved, reason labels, custom filters. https://docs.github.com/en/subscriptions-and-notifications/concepts/about-notifications
- GitHub Mobile: four push types, working hours. https://docs.github.com/en/subscriptions-and-notifications/get-started/configuring-notifications
- Slack: mobile push hold while active on desktop. https://slack.com/help/articles/201355156-Configure-your-Slack-notifications
- Duolingo: per-learner reminder copy rotation. https://blog.duolingo.com/hi-its-duo-the-ai-behind-the-meme/
- Android notification permission: in-context pre-prompt flow. https://developer.android.com/develop/ui/views/notifications/notification-permission
- Apple: provisional authorization, interruption levels, badging rules. https://developer.apple.com/documentation/usernotifications/asking-permission-to-use-notifications and https://developer.apple.com/design/human-interface-guidelines/managing-notifications
- Toast rules: Polaris, Material snackbar, Carbon, Atlassian flag; Sonner for stacking behavior. https://polaris-react.shopify.com/components/feedback-indicators/toast and https://sonner.emilkowal.ski/
- Mobbin links pending: connector needs a paid plan.

## Gap: average vs best in class
An average product asks for push at first launch, sends the same event by email, push and in-app, shows a red count that never clears, uses toasts for errors and has one "Email notifications on/off" switch. The best ask after the first value moment with a pre-prompt, send each event to one channel at a time (skip email if read, hold push while on desktop), split the inbox into what needs you and the rest with reasons on every row, offer Done, snooze and save rather than delete, use dots for "new" and counts only for real unread items, and give each channel per-event toggles plus quiet hours. Gap score 5 of 5 (opinion): this is where average products most often annoy people into turning everything off.

## Screenshots
| Path | Shows | Source URL | Owner | Captured |
|---|---|---|---|---|
| shots/09-notifications/linear-inbox-priority-tabs.jpg | Inbox with Priority 4 / Other 12 tabs, rows with avatar, reason, status, time, unread dot | https://linear.app/docs/inbox | Linear | 2026-10-10 |
| shots/09-notifications/linear-notification-channel-toggles.jpg | Desktop channel master toggle, test notification, per-event-type toggles | https://linear.app/docs/notifications | Linear | 2026-10-10 |
| shots/09-notifications/sonner-toast-stack-expanded.jpg | Three toasts expanded on hover, one with Undo, 14px gap | https://sonner.emilkowal.ski/ | Emil Kowalski (Sonner) | 2026-10-10 |
| shots/09-notifications/android-notification-permission-in-context-flow.jpg | Recommended flow: sign in, "Get notified!" pre-prompt, system Allow dialog | https://developer.android.com/develop/ui/views/notifications/notification-permission | Google (Android) | 2026-10-10 |
