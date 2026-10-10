# Onboarding

Jobs: dashboard, mobile app. Sources observed 2026-10-10. Source type per entry: **live page** (fetched or rendered today) or **Mobbin** (none yet; the Mobbin connector needs a paid plan). Opinion is marked (opinion).
Floor rules live in [../../../skills/design-ux/references/05-onboarding.md](../../../skills/design-ux/references/05-onboarding.md) (pattern chooser, permission timing, sample data, checklist size); this file is the ceiling: what the best shipped examples do.

## What the best examples do

1. **Value before account, with a visible finish line.** Duolingo web (rendered at iPhone 13 size): pick a course, then 10 single-question screens (source, reason, level, course overview, daily goal, start point, two motivation screens), then straight into `/lesson` with no account created. A green progress bar sits at the top of every step. https://www.duolingo.com/register [live page]
2. **Every answer gets an instant, specific reaction.** Duolingo: choosing "10 min / day" changes the mascot's bubble to "That's 50 words in your first week!"; choosing "Just for fun" gives "Yay! Fun is my specialty!"; "I'm new to Spanish" gives "Okay, we'll start fresh!". The question earns its place by visibly changing something. https://www.duolingo.com/welcome [live page]
3. **A demo workspace you can explore before signing up.** Linear: "explore our demo workspace to see how issues, projects, and workflows fit together. Note: Changes are local to your browser and reset on refresh." Rendered: a full sidebar with Inbox (22), Triage (13), real-looking issues, and a persistent "Sign up" button top left. https://linear.app/demo and https://linear.app/docs/start-guide [live page]
4. **The sample workspace teaches itself in one pinned doc.** Linear demo: "Welcome to Linear! [README]" is the first item in Favorites. It explains the object model in one line each (Workspace, Teams, Issues, Projects, Initiatives, Cycles) and lists 7 keyboard shortcuts ("Open the command menu: Cmd/Ctrl + K"). Content as tutorial, no tour overlay. https://linear.app/demo [live page]
5. **Sign-up is folded into the first real action.** Vercel `/new` (logged out): three ways to start on one screen (prompt box, "Import Git Repository" with Continue with GitHub, GitLab or Bitbucket, and template cards). Small print: "If you don't have a Vercel account, by proceeding, you agree to creating a Vercel account". https://vercel.com/new [live page]
6. **A safe sandbox the minute the account exists.** Stripe: "Immediately after you create a Stripe account, you can use your account in testing environments ... simulate transactions and use all Stripe features without moving any money. To accept real payments, you must set up your account." Activation is a separate, later checklist. https://docs.stripe.com/get-started/account [live page]
7. **Setup checklist: few steps, auto-checked, dismissible, collapsible.** Shopify app guidelines: "Avoid more than five steps"; "discrete steps that are automatically marked as complete"; "Request information from merchants only if it's necessary"; non-essential onboarding is dismissible with an X. The Setup guide composition shows "0 out of 3 steps completed", one expanded step at a time with heading, description, 80px max illustration and one primary button. https://shopify.dev/docs/apps/design/user-experience/onboarding and https://shopify.dev/docs/api/app-home/patterns/compositions/setup-guide [live page]
8. **Tours: 3 to 4 steps and always dismissible.** Atlassian spotlight: "Aim for 3-4 steps maximum. People only need enough information to get them started." First impressions "should be dismissible, so we get out of people's way." https://atlassian.design/patterns/first-impressions [live page]
9. **Tutorial is real content, skippable, and recreatable.** Things 3 offers a tutorial project "when you launch Things for the very first time"; to see it again: "Help → Create Tutorial Project" (Mac) or "Settings → Help → Create Tutorial Project" (iOS). This matches Apple HIG: if skipped, "don't present it again on subsequent launches, but make sure it's easy for people to find". https://culturedcode.com/things/support/articles/2803553 and https://developer.apple.com/design/human-interface-guidelines/onboarding [live page]
10. **Permission priming on iOS: one button, no exit.** Apple HIG pre-alert screens: "Include only one button and make it clear that it opens the system alert"; title it "Continue" or "Next", not "Allow"; "don't provide a way for people to leave the screen ... without viewing the system alert". Incentives, images of the alert, or annotating behind it lead to App Review rejection. https://developer.apple.com/design/human-interface-guidelines/privacy [live page]
11. **Permission priming on Android: the opposite exit rule.** Android: "Always provide the option to cancel an educational UI flow"; ask "when the user starts to interact with the feature"; e.g. "only prompt for microphone access when a user clicks on the microphone button." So a cross-platform primer needs a per-platform button set. https://developer.android.com/training/permissions/requesting and https://developer.android.com/training/permissions/usage-notes [live page]
12. **Purpose strings say what and why in one active sentence.** Apple's good example: "The app records during the night to detect snoring sounds." Bad: "Microphone access is needed for a better experience." Bad: "Turn on microphone access." https://developer.apple.com/design/human-interface-guidelines/privacy [live page]
13. **Use the work email to make the team find you.** Notion sign-up: "Use an organization email to easily collaborate with teammates." Slack: "make sure to use an email address from your company's domain to create your workspace"; creation is 4 steps (email or Apple/Google, code from email, Create a Workspace, prompts). https://www.notion.so/signup and https://slack.com/help/articles/206845317-Create-a-Slack-workspace [live page]

## Common structure

Dashboard (web SaaS):
```
Sign-up (SSO first, work-email hint)            1 screen
  -> first real action doubles as setup          (Vercel: import repo / template)
  -> product shell with sample or sandbox data   (Linear demo, Stripe sandbox)
       + one pinned "start here" doc or card
       + setup checklist, 3 to 5 steps, "N of M complete", dismiss X
  -> "go live" / activation checklist later      (Stripe account checklist)
```

Mobile app:
```
Launch -> 1 question per screen, top progress bar, sticky full-width CTA
       -> each answer gets an immediate reaction
       -> first core task (lesson, first to-do) BEFORE account
       -> "save your progress" account prompt
       -> permission asked at the feature that needs it, primer only if context is unclear
```

## Spacing and type conventions observed

| Product or system | Element | Value | How known | Link |
|---|---|---|---|---|
| Duolingo web (390px viewport) | Sticky CONTINUE button | 358 x 50px (16px side gutters), radius 16px, 15px / 700, uppercase | measured with getComputedStyle | https://www.duolingo.com/welcome |
| Duolingo web | Steps before first lesson | 1 course pick + 10 screens, 1 question each | counted while rendering | https://www.duolingo.com/register |
| Vercel `/new` | Page title "Let's build something new" | 32px / 600, Geist Sans | measured with getComputedStyle | https://vercel.com/new |
| Vercel `/new` | "Continue with GitHub" button | 320 x 36px, 14px / 500, radius 6px | measured with getComputedStyle | https://vercel.com/new |
| Vercel `/new` | Template suggestion chips | 32px tall, 14px / 500, fully rounded | measured with getComputedStyle | https://vercel.com/new |
| Shopify Polaris | Setup guide step illustration | max 80 x 80px | stated in docs (code sample) | https://shopify.dev/docs/api/app-home/patterns/compositions/setup-guide |
| Shopify app guidelines | Onboarding steps | 5 max | stated in docs | https://shopify.dev/docs/apps/design/user-experience/onboarding |
| Atlassian | Spotlight tour | 3 to 4 steps max | stated in docs | https://atlassian.design/patterns/first-impressions |
| Material Design 2 (legacy) | Self-select onboarding | fewer than 10 choices per screen, one screen preferred | stated in docs | https://m2.material.io/design/communication/onboarding.html |

## Mistakes they avoid

- **Account wall before value.** Duolingo runs a full lesson before asking for an account; Linear lets you explore a demo workspace with no sign-up at all.
- **Feature-tour slides at first launch.** NN/g: "Avoid feature-promotion onboarding at first launch"; Linear teaches with a README doc inside real sample data instead. https://www.nngroup.com/articles/mobile-app-onboarding/
- **Questions that change nothing.** Duolingo reacts to every answer and uses daily goal to set an expectation ("50 words in your first week"). (opinion: a question with no visible effect is a form, not onboarding.)
- **Checklists that never end.** Shopify caps steps at five, auto-completes them and lets merchants dismiss the guide.
- **Primer with a fake "Allow" button.** Apple requires a single "Continue" or "Next" style button; Android requires a cancel option. Shipping one design on both platforms breaks one rule.
- **Vague purpose strings.** Apple's rejected-style example: "Microphone access is needed for a better experience."
- **Tutorial gone forever once skipped.** Things keeps "Create Tutorial Project" in Help.

## Products to look at

- Duolingo: question-per-screen flow with reactions, lesson before account. https://www.duolingo.com/register
- Linear: public demo workspace and README-as-tutorial. https://linear.app/demo
- Vercel: sign-up folded into "import repo" and templates. https://vercel.com/new
- Stripe: sandbox on day one, activation later. https://docs.stripe.com/get-started/account
- Shopify: setup guide composition and onboarding rules. https://shopify.dev/docs/api/app-home/patterns/compositions/setup-guide
- Things 3: recreatable tutorial project. https://culturedcode.com/things/support/articles/2803553
- Slack: 4-step workspace creation. https://slack.com/help/articles/206845317-Create-a-Slack-workspace
- Apple HIG and Android docs: permission priming rules per platform. https://developer.apple.com/design/human-interface-guidelines/privacy and https://developer.android.com/training/permissions/requesting
- Mobbin links pending: connector needs a paid plan.

## Gap: average vs best in class

An average product shows a 3 to 5 slide carousel, forces sign-up and every permission prompt at launch, then drops people into an empty dashboard. The best let people touch the real product first (a demo workspace, a sandbox, a first lesson), fold sign-up into the first real action, keep any checklist to 5 auto-completing steps, and ask for permissions only at the moment of use with platform-correct primers. Gap score: 4 of 5 (opinion).

## Screenshots

| Path | Shows | Source URL | Owner | Captured |
|---|---|---|---|---|
| shots/01-onboarding/duolingo-daily-goal-mobile.jpg | Duolingo daily goal step at iPhone 13 size: top progress bar, mascot reaction "That's 50 words in your first week!", 4 options, sticky CONTINUE | https://www.duolingo.com/welcome?welcomeStep=dailyGoal | Duolingo | 2026-10-10 |
| shots/01-onboarding/linear-demo-workspace-readme.jpg | Linear public demo workspace: sample sidebar and the pinned "Welcome to Linear! [README]" doc | https://linear.app/demo | Linear | 2026-10-10 |
| shots/01-onboarding/vercel-new-project.jpg | Vercel new project page logged out: prompt, import from Git (creates account), templates | https://vercel.com/new | Vercel | 2026-10-10 |
| shots/01-onboarding/shopify-setup-guide.jpg | Shopify's published example of an app setup guide: "2 of 4 tasks complete" with progress bar and checked steps | https://shopify.dev/docs/apps/design/user-experience/onboarding | Shopify | 2026-10-10 |
