# Review: design-conversion (critic)

Date: 2026-10-10. Draft: `skills/design-conversion/` (SKILL.md, references 01 to 06, `assets/conversion-audit.mjs`) from `kb/drafts/conversion/`. Research: `kb/research/conversion/` (51 claims, C1 to C50 plus C37b).

**Honesty note.** This session had no subagent tool; the same agent wrote research, chapters and this review. The citation re-fetch below is independent of memory (every quote was re-requested verbatim from the live page), but the judgement sections are a self-review. Treat them as such.

## Round 1

### Citation spot check (before step 1)
Method: Python `random.seed(20261010)`, `random.sample` of 11 IDs from the 51 (21.6%). Each URL re-fetched with WebFetch on 2026-10-10 and asked for a verbatim yes or no.

| ID | URL | Result |
|---|---|---|
| C3 | baymard.com/lists/cart-abandonment-rate | Pass: "18% The site wanted me to create an account" |
| C15 | nngroup.com/articles/web-form-design/ | Pass: both sentences verbatim ("But placeholder text causes...") |
| C17 | nngroup.com/articles/get-started/ | Pass with fix: the sentence continues after "users"; quote had a closing period. Fixed in note 01 |
| C21 | baymard.com/blog/user-ratings-distribution-summary | Pass: both phrases verbatim |
| C22 | baymard.com/research-articles/user-perception-of-product-ratings | Pass: verbatim |
| C23 | baymard.com/blog/perceived-security-of-payment-form | Pass with fix: source reads "the homemade seal...", quote capitalized "The". Fixed in note 02 |
| C26 | arxiv.org/abs/1907.07032 | Pass: both phrases verbatim |
| C37b | developer.apple.com/app-store/review/guidelines/ | Pass: verbatim, section 3.1.1 (noted: applies to non-subscription trials; the chapter cites it as an analog, correctly) |
| C43 | hbr.org/2017/09/the-surprising-power-of-online-experiments | Pass: "increased revenue by an astonishing 12%" |
| C46 | vercel.com/pricing | Pass: all four strings verbatim |
| C47 | stripe.com/pricing | Pass: all three strings verbatim |

Batch result: **pass** (no wrong or missing quote or URL; two punctuation and case corrections).

Not in the sample but checked while reading: C14 has no direct quote, only "figures as reported"; acceptable as a tier 4 small study, flagged for the next research pass.

### Step 1: fundamentals gate
- Numbers re-run: `node kb/research/conversion/scripts/price-math.mjs` gives 14.29% for $18 vs $21, $0.90 a cup, Oct 16 and Oct 30 are Fridays (checked with Python `datetime`). Pass.
- Accessibility advice agrees with design-foundations `references/accessibility.md`: labels, 1.3.5, 3.3.7, 3.3.8, 1.4.11, focus not obscured (2.4.11) for sticky bars. One gap: the usage meter spec had no non-text contrast rule. **Fixed** (05: fill 3:1 against track, `role="meter"` with `aria-valuetext`).
- Hierarchy rule (one filled primary) consistent with FOUNDATIONS item 12 and playbook-landing. Pass.

### Step 2: claims stronger than the source
1. 01 said the landing-page repeat count was "opinion from the exemplar reads (C45 to C47)"; those pages say nothing about repeat counts. **Fixed**: plain "Opinion."
2. 06 stated the 22% false positive risk without its conditions. **Fixed**: "p < 0.05 two-tailed and 80% power", plus the 20% power case.
3. C8 (35.26%) is a Baymard estimate, not an experiment; the research note says so and the skill never cites it as a measured lift. Pass.
4. C44 (Stripe +22.3%) is vendor data; tagged "vendor" everywhere it appears. Pass.

### Step 3: contradictions
1. design-ux `references/03-forms.md` cites Baymard's older US average of 14.88 fields; this skill uses the 2024 figure 11.3 (C9). Not a contradiction in advice (both say cut to 7 or 8) but a stale number. Chapter 04 now names both. **Sent to pipeline notes** for design-ux.
2. FOUNDATIONS tokens: `--color-warning`, `--color-danger`, `--color-surface-sunken` (the last is used by the combined page, not in the FOUNDATIONS role list). Chapter 04 names `--color-surface-sunken` for the card block. **Sent to pipeline notes**: add `surface-sunken` as a role or say "a surface step".
3. Description starts "Domain reference loaded by design-director or a design playbook" and is not a broad trigger. Pass.

### Step 4: gaps
1. Email capture popups and exit intent were not covered. **Fixed** (01 decision row: inline, never on load, C36).
2. Free trial disclosure (card or no card) missing. **Fixed** (03 decision row).
3. B2B "Contact sales" form length: covered only by "sign-up is one field". Left open; low priority for the two test pages.
4. Cookie consent banners and their interaction with sticky CTAs: out of scope (legal and privacy); noted.

### Step 5: the expert bar
Would a top conversion designer (a Baymard researcher, Stripe's checkout team) learn something? Lines most of them would nod at: one primary, guest checkout, fewer fields. Lines that carry weight beyond the generalist: the term line as both law and conversion move; same label with a live summary; proof with a denominator and the featured 3-star review; first-party proof beside the CTA; currency over percent for small savings; defaults over decoys with the Frederick et al. limit; meter before wall with projection and what is kept; evidence tags in the hand-over; false positive risk numbers. The audit script also checks things lint does not (term lines near subscribe buttons, pay buttons with amounts, rating counts). Pass, with the note that the in-product chapter's timing rules are opinion (stated in the chapter).

### Step 6: filler, vagueness, em dashes
- grep for U+2014 over the domain: 0 hits.
- "What reads as cheap" is opinion and labelled. Kept: it is the question Davon's brief asks ("without looking cheap").

## Verdict
**Approve** after the fixes above (all applied). Larger items sent to `kb/reviews/design-conversion-pipeline-notes.md`.

## Addendum (after the review, 2026-10-10)
- Measured exemplar claims C51 to C55 (Apple, Stripe, Vercel, Raycast, Linear teardowns from branch `claude/exemplar-library-xfa3bl` at 40d89cf) were added to note 01, chapter 01 and SKILL.md after the spot check above, so they were not in its sample. Each quote was copied from the teardown file with `git show`, not recalled. New SKILL.md move 2 ("The buy panel") rests on C51.
- The tester found a math error in chapter 03 ("two cups a day" for a 340 g bag over 2 weeks; it is about a cup and a half). Fixed. Step 1 should have caught it; future number checks cover every derived figure, not only prices and dates.
