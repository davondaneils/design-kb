# Critic review: design-ux v0.1 (pre-release)

Reviewed: `skills/design-ux/SKILL.md`, `references/01` to `07`, against `kb/research/ux/*` and the shared foundations contract.

## Round 1 verdict: REVISE

### Fundamentals gate checks on the skill itself
- Correctness: two claims stated without a source in research (Nielsen severity scale; tab re-tap behavior). One wrong value in draft (severity scale numbered 0 to 3 instead of 0 to 4), caught and fixed in the draft before packaging.
- Accessibility: consistent with WCAG 2.2 AA floor in FOUNDATIONS. Good.
- Consistency with FOUNDATIONS: breakpoints, `--text-base` 16 px, durations, semantic token names, spacing tokens (`--space-3` 8 px, `--space-4` 12 px) all match.
- Em dashes: none (grep for U+2014 returned nothing).

### Fix list (all applied)
1. `references/01-fundamentals.md`: severity scale was unsourced. Added NN/g severity ratings to research 01 (#16) and cited by name.
2. `references/01-fundamentals.md`, G3: "44x44 px touch web" lacked its standard. Now cites WCAG 2.5.5 (AAA) and FOUNDATIONS default.
3. `references/02-navigation-ia.md`: "tap active tab pops to root, again scrolls to top" is not in HIG. Re-labelled as observed convention, opinion; kept the HIG-sourced part (tabs preserve navigation state).
4. `references/05-onboarding.md`: removed unverified practitioner lore ("roughly doubles" opt-in; "completion drops beyond 5 steps"). Kept 3 to 5 steps as opinion.
5. `references/03-forms.md`: password advice cited NIST loosely. Fetched NIST SP 800-63B Rev 4 (Aug 2025) and replaced with exact numbers (15 chars single-factor, 8 with MFA, 64 max support, no composition, no rotation, blocklist with reason). Research 03 #14.
6. `references/03-forms.md`: name-field rule cited "W3C i18n" without fetching. Fetched; now specific ("Given names" / "Family name", family name not required). Research 03 #16.
7. `references/03-forms.md`: field width rule now cites GOV.UK fixed-width classes and adds the `type="number"` warning. Research 03 #15.
8. Gap: no guidance on deceptive patterns, a decision top studios face daily. Added an expert move in 01 grounded in EU DSA Article 25 and Baymard's 40% extra-cost abandonment. Research 01 #17.
9. Gap: right-to-left locales absent. Added an RTL rule to 06 from Apple HIG Right to left. Research 06 #13.
10. `references/06`: predictive back is version-dependent and was not fetched. Softened to "recent Android versions; check current docs".

## Round 2 verdict: APPROVE

### Expert-learning test
Would a top practitioner learn something? Items most likely to be new even to strong designers:
- Asymmetric validation timing (errors appear on blur, disappear on keystroke) and length-triggered validation for fixed-length fields (Baymard).
- Anti-flicker loader timing: 150 to 300 ms show delay plus 300 to 500 ms minimum display (Vercel).
- Gesture commit timing: destructive on release, reversible mid-gesture (Freiberg).
- Hoober retracted his own 2013 thumb-zone drawings; center preference with 7 mm vs 12 mm targets (Hoober 2017).
- NIST Rev 4 15-character single-factor minimum and no composition rules, which most designers still get wrong.
- Redundant entry and accessible authentication are now WCAG failures (3.3.7, 3.3.8).
- Apple's rule that red destructive style is for destruction the user did not deliberately choose.

Lines a top practitioner would merely nod at (acceptable because they are gate items): visible labels, single column, no hamburger on desktop.

### Residual risks
- Several practitioner numbers (Vercel timings, Kowalski 300 ms) are opinion; labelled as such.
- Etre inline validation study is small (22 users); labelled.
- Drafts in `kb/drafts/ux/` are the pre-review specialist snapshot; the skill references are the corrected version.

---

# Critic review: design-ux v0.2 (wave 2, 2026-10-10)

Reviewed: `SKILL.md` (rewritten), new `references/07-commerce-flows.md`, the first-run section added to `05-onboarding.md`, overlap trims in `02`, `04`, `06`, `08-review-template.md` (renamed from 07), against `kb/research/ux/*`, FOUNDATIONS v0.3, design-foundations accessibility, design-product-ui and design-playbook-mobile.

## Citation spot check (before step 1)
Method: every citation in `kb/research/ux/*.md` (92: numbered sources in notes 01 to 06, claim rows C1 to C21 in note 07), Python `random.seed(20261010)`, `random.sample(items, round(0.2 * 92))` = 18. Each URL re-fetched on 2026-10-10 (WebFetch; Apple HIG through its JSON endpoint).

| # | Note, ref | URL | Claim checked | Result |
|---|---|---|---|---|
| 1 | 04 [3] | vercel.com/design/guidelines | loader 150 to 300 ms delay, 300 to 500 ms minimum; skeleton mirrors final | pass ("add a short show-delay (~150–300 ms) & a minimum visible time (~300–500 ms)") |
| 2 | 03 [3] | alistapart.com inline validation | +22% success, -22% errors, +31% satisfaction, -42% time, -47% fixations, 22 users | pass |
| 3 | 07 C14 | w3.org APG radio | Tab moves into and out of the group | pass (quote matches) |
| 4 | 01 [6] | Apple HIG Buttons | 44x44 pt, visionOS 60x60 | pass ("a hit region of at least 44x44 pt [dash], in visionOS, 60x60 pt", quoted from the JSON; Apple uses a dash where [dash] stands) |
| 5 | 03 [6] | baymard.com inline labels | problems in every test; 1 to 2 field exception; floating labels untested | pass |
| 6 | 04 [1] | nngroup progress indicators | 1 s, 2 to 10 s looped, 10 s+ percent done; 3 times longer wait | pass |
| 7 | 05 [2] | Apple HIG Onboarding | optional tutorial, not shown again if skipped | pass |
| 8 | 03 [15] | w3.org personal names | one field where possible; do not require a family name | pass |
| 9 | 04 [4] | nngroup empty states | status, learning cues, pathways | pass |
| 10 | 07 C10 | baymard.com cart abandonment | extra costs 40%, account 18%, total not visible 12% | pass |
| 11 | 02 [8] | smashingmagazine pagination | 10 to 30, 50 to 100, 25 to 75, mobile 15 to 30, over 90% fail Back | pass |
| 12 | 02 [7] | nngroup infinite scrolling | feeds yes; goal-oriented and footer no | pass |
| 13 | 05 [1] | nngroup mobile tutorials | 70 users, 91% vs 94%, harder rating | pass |
| 14 | 06 [2] | mobiforge touch | 49 / 36 / 15%, 75% thumb | pass with note: the 780-user sample is in the primary Hoober source [1], not on the mobiforge summary; the claim cites both, so it stands |
| 15 | 01 [1] | nngroup ten heuristics | the ten heuristics | pass |
| 16 | 07 C2 | baymard.com size buttons | "relic of early web design" | pass |
| 17 | 06 [9] | Apple HIG Alerts | "Cancel" exactly; no Yes/No; OK only informational | pass |
| 18 | 03 [11] | vercel.com/design/guidelines | submit enabled until submission; 16px inputs; trim whitespace | pass |

Batch result: **pass** (18 of 18). Earlier notes 01 to 06 store claims without verbatim quotes, which the source policy now requires; logged as fix 6 (owner: researcher, next round), not blocking because every sampled claim was confirmed against the live page.

## Round 1 verdict: REVISE (fixes applied in place, then approve)

### Step 1, fundamentals gate on the skill's own advice
- `07` fundamental 4 told the builder to set `aria-invalid` on each radio of an unanswered group. That marks every option as wrong and is announced on each arrow press. **Fix 1 (applied):** link the error to the `fieldset` with `aria-describedby`, add a non-color cue on the group, move focus to the first radio.
- `07` had no rule for the drawer's dialog semantics, so a builder could ship a `div` drawer with no focus handling (gate G4). **Fix 2 (applied):** decision rule "the cart drawer is a modal dialog" with focus, Escape, return focus.
- Numbers match FOUNDATIONS (24 px floor, 44 px touch, `--text-base` 16, motion tokens). Accessibility rules agree with design-foundations `references/accessibility.md` (3.3.4, 3.3.7, 4.1.3, live region exists before it changes).

### Step 2, claims stronger than the source
- **Fix 3 (applied):** "cart drawer after add" stated as a rule; no study supports either way (research, conflicting views). Now marked opinion with the condition (open it when the next needed information is in it).
- The cups-a-day figure is arithmetic on an assumed 15 g dose: labelled derived and opinion. Pass.
- California ARL is cited through a law firm summary (tier 4). Stated as legal context, "check with counsel". Pass.

### Step 3, contradictions and overlap
- SKILL.md v0.1 duplicated design-product-ui (palette threshold, sidebar breakpoints, partial failure and stale data) and the mobile playbook (tab counts, Android classes, iOS 26 safe areas). **Fix 4 (applied):** a "what lives elsewhere" table at the top; sections trimmed to one line plus a link; `02` chooser rows for app shells and native nav point to the owners; `04` stale and partial merged into one move with a link; `06` safe-area move de-platformed.
- design-playbook-landing does not load design-ux at all, so `07` would never load for the coffee job through the playbook. Not ours to edit. **Fix 5 (logged):** pipeline note to the editor-in-chief.

### Step 4, gaps
- The skill had no first-run states for data products beyond "sample data plus checklist". Added the four-state table in `05` (first run, listening, check failed, first data) and the "not enough data yet is not zero" rule. Pass after addition.

### Step 5, expert bar (expert-learning test)
Lines a strong product designer is least likely to know already:
- One-time purchase as the default where both exist (Shopify guidance), and preselect-only-the-buyer's-own-answer for options that change what ships.
- "How do you brew?" and cups-a-day as the translation of system fields into answerable questions.
- Endowed progress used honestly: start at "1 of 4" only when step 1 is real.
- "Not enough data yet is not zero."
- Remove leaves an in-place undo row so the list does not jump.
Lines a top practitioner would nod at: guest checkout, shipping before checkout. Kept as fundamentals, not moves.

### Step 6, filler and dashes
U+2014 grep on every changed file: 0 hits (Apple's own dash in the quoted HIG text is shown as [dash]). No filler sections.

### Fix list
1. `references/07-commerce-flows.md` fundamental 4: error semantics. Done.
2. `references/07-commerce-flows.md`: cart drawer dialog rule. Done.
3. `references/07-commerce-flows.md`: drawer after add marked opinion with its condition. Done.
4. `SKILL.md`, `02`, `04`, `06`: overlap with design-product-ui and design-playbook-mobile trimmed to links. Done.
5. Pipeline note: design-playbook-landing should load design-ux `07` when the page sells. Logged in `kb/reviews/design-ux-pipeline-notes.md`.
6. Researcher: add verbatim quotes to the claim tables of notes 01 to 06 (source policy). Open, next review.

## Round 2 verdict: APPROVE for rendered testing
