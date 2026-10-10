# Brief: 05 In-product upgrade and trial prompts

**Question:** When and how does a SaaS product ask a user to upgrade, buy after a trial, or unlock a feature, without breaking the work they came to do?

**Audience:** Claude through design-playbook-dashboard.

**Decisions the reader must be able to make**
- Which moments justify a prompt (approaching a limit, using a gated feature, trial ending) and which never do (on load, mid-task).
- Modal vs inline vs a quiet meter.
- What the prompt says: usage in numbers, what the next plan gives, price, what happens if they do nothing.
- Who sees it (an admin who can pay vs a member who cannot).
- Emphasis: never competing with the screen's primary action.

**Fundamentals (gate)**
- Do not interrupt with a modal for something not tied to the user's current goal (NN/g modal dialogs).
- Describe what the user gets for the price before asking (Apple App Store guideline 3.1.2(c)).
- The screen keeps one primary action; the upgrade is secondary unless the user is blocked.
- Status not by color alone; meters carry numbers in text.

**Expert layer**
- Meter before wall: show usage early and in numbers; warn at a threshold, never surprise at 100%.
- Degrade, do not hold hostage: data the user made stays readable when a limit is hit.
- Route members to the admin by name instead of a buy button they cannot use.
- Trial end: say the date and what changes, in the product, a few days ahead.

**Must cover:** trigger table, prompt anatomy, meter spec, role routing, trial countdown rules.

**Out of scope or reuse:** onboarding (design-ux 05), states (design-ux 04), billing settings pages (design-product-ui 03), lifecycle email (behavioral-email-sequencing, out of design scope).

**Test briefs**
1. Tally analytics dashboard: usage meter and a limit state. Playbook dashboard. Exemplar: Vercel Dashboard usage, Linear app.
2. Trial with 3 days left, member without billing rights. Playbook dashboard. Exemplar: Vercel Dashboard.

**Rubric:** gate first. Then: one primary per screen kept; prompt names usage, next plan, price and the do-nothing outcome; no modal on load; member state routes to a named admin.
