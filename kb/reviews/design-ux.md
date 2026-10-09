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
