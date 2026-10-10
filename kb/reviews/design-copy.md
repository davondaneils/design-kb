# Review: design-copy

## Round 2: v0.2 (render pass, sources), 2026-10-10

**Verdict: approve** after the fixes below (all applied). Reviewed: `kb/research/copy/06-copy-in-context.md`, `kb/drafts/copy/06-copy-in-context.md`, `skills/design-copy/references/06-copy-in-context.md`, the SKILL.md changes, `skills/design-copy/assets/claims_inventory.mjs`.

### Citation spot check (before step 1)
Method: 19 sourced claims in the research note (rows 1 to 19; measured rows M1 to M7 are re-derived instead). 20 percent rounds to 4, policy minimum is 5. Sample drawn with Python `random.seed(20261010); random.sample(range(1, 20), 5)` = rows **2, 6, 8, 9, 12**.

| Row | Source | Re-fetch | Quote found | Supports claim |
|---|---|---|---|---|
| 2 | Apple HIG Writing | curl, JSON endpoint, `grep` | yes ("it’s almost always best to use a verb", "Prioritize clarity and avoid the temptation to be too cute or clever with your labels") | yes |
| 6 | Apple HIG Writing | curl, JSON, `grep` | yes (curly apostrophes in source) | yes |
| 8 | Apple HIG Writing | curl, JSON, `grep` | yes | yes |
| 9 | Apple HIG Writing | curl, JSON, `grep` | yes | yes |
| 12 | Shopify Polaris, Grammar and mechanics | WebFetch, asked for the exact string | yes (curly apostrophes in source); row 11 confirmed in the same fetch | yes |

Also re-checked outside the sample: row 5 (the "we" quote) is in the JSON with "we" set as emphasis; quote text is accurate. Batch **passes**.

### Step 1: fundamentals gate
- Re-derived every measured number: +8.09% (44,600 to 48,210), eight consecutive rises (weeks 5 to 12), card savings 14.3, 5.3 and 0 percent, Oct 7 2026 = Wednesday, 14:05 to 16:58 = 2 h 53 min. All correct in the draft and reference.
- Ran `claims_inventory.mjs` on the before and after pages: before coffee flags "this Friday" (exit 1); after pages exit 0. Synthetic test (`Arrives Wed, Oct 10` plus mixed clocks) flags WEEKDAY and CLOCK. Script works as documented.
- The skill's own advice keeps accessibility right: caveats are words (1.4.1), announcements under 4.1.3, sr-only "Not included" for table dashes.

### Fix list
| # | File | Problem | Fix | Status |
|---|---|---|---|---|
| 1 | references/06, draft 06 | "Stripe's changelog states the exact version and date" is from memory, presented as a shipped example. | Labelled "from memory, not fetched". | fixed |
| 2 | references/06 | Intro sentence duplicated after packaging. | Removed. | fixed |
| 3 | SKILL.md | Gate said 14 rules; v0.2 adds truth and promise rules. Mechanics rule lacked clock, weekday and perspective. | Gate is 16 rules; rule 15 extended. | fixed |
| 4 | SKILL.md section 5 | Measure line said "66 ideal" with no CSS value; FOUNDATIONS v0.3 sets `max-inline-size: 52ch` and bans `66ch`. | Line aligned with v0.3. | fixed |
| 5 | assets/claims_inventory.mjs | First version flagged "every Tuesday and Friday" (a schedule) and "roasted Tuesday" (low-stakes recency) as relative dates in stakes copy. | Schedules stripped before the test; "roast" removed from the stakes words. Retested. | fixed |
| 6 | references/06 | Polaris "avoid shortening numbers" vs dashboards' "$184.2k". | Conflict resolved in research and a decision rule (compact only in tiles and axes, full value in the accessible name). | fixed |
| 7 | research 06 | Practitioner gap (Stratton, Shleyner, Yifrah) not closed: primary material is books, courses or a talk abstract. | Logged as leads only, no rule rests on them. Carried to v0.3. | open |
| 8 | All new files | Em dash grep (U+2014). | None found. | ok |

### Step 3: contradictions
- design-director copy rule respected: no `copywriting` on either page; the worked examples route plan naming to `sales-funnels`.
- FOUNDATIONS v0.3: no token or scale changed; the one CSS addition (`.kpi .caveat`) uses `--space-2` and `--text-xs`.
- v0.1 relative-date rule ("relative is fine for low-stakes recency") kept and now implemented the same way in the script.

### Step 5: the expert bar
Would a top practitioner learn something? Yes on: reconcile copy against data, not against itself (three false numbers survived every earlier review, including Davon's blind pick); the promise ledger; price-paired CTAs that replace a savings claim; caveat at the point of reading; one verb per action applied to the newsletter; announcements written as copy; no-break spaces inside dates and ranges found only on the render. A strong generalist proofreads; the moves here audit.

---

## Round 1: v0.1 (pre-ship)

**Verdict:** revise, then approve. Fundamentals gate is sound and sourced. Six factual or consistency defects and four gaps found; all fixed in `skills/design-copy/` (status column). The drafts in `kb/drafts/copy/` are kept as the pre-review record.

## Checks run
- Every numeric claim traced to `kb/research/copy/` (NN/g, Baymard, GOV.UK, W3C, Unbounce, Microsoft, Mailchimp). Practitioner claims (Shapiro, Dry, Wynter, Copyhackers, Brett/Designjoy) are labelled as practitioner or opinion.
- Shared foundation contract: measure 45 to 75 / 66, body line-height 1.5, `--color-danger` role, 24 x 24 px target (44 preferred), WCAG 2.2 AA floor. All consistent.
- Overlap with `copywriting`: no awareness-level, lead-type, big-idea or offer content duplicated; skill routes to it.
- Em dash grep: run before commit.

## Fix list
| # | File | Problem | Fix | Status |
|---|---|---|---|---|
| 1 | references/04-readability-scannability.md | FAQ example word counts and grades were guessed (52 words, grade 16; 23 words, grade 4 to 5). Measured: 49 words, about grade 12; 22 words, about grade 3 (Flesch-Kincaid, heuristic syllable count). | Replace with measured values and name the method. | fixed |
| 2 | references/02-ux-microcopy.md | Transfer example called "[Yes, continue]" acceptable, contradicting fundamental 5 (no Yes/No for consequential actions). | Use [Send to M. Okafor] [Change account] only. | fixed |
| 3 | references/05-content-design-process.md | "Japanese needs larger line height" unsourced. "blind spot" listed as ableist is contested. | Mark the Japanese point as opinion and hand to design-typography; drop "blind spot". | fixed |
| 4 | SKILL.md section 5, references/04 | "Headings say something, not label" would wrongly turn app navigation and screen titles into sentences. Top practitioners split these: marketing and help headings are statements; app screen titles and nav are short nouns that name the place. | Add the split rule. | fixed |
| 5 | references/02 | Toast guidance did not mention WCAG 2.2.1 Timing Adjustable for toasts with actions. | Add: actionable toasts persist until dismissed or the action is reachable elsewhere. | fixed |
| 6 | SKILL.md | Gap: no rules for AI feature microcopy, now common in briefs (2026). | Add short rule set (label AI output, set expectations, give edit and undo, frame by user goal per NN/g 2025), marked partly opinion. | fixed |
| 7 | SKILL.md | Gap: pricing page copy not routed. | Add routing: plan names and price framing to `sales-funnels`; this skill covers plan feature lists and FAQ mechanics. | fixed |
| 8 | references/01 | Message-match example claims a lift implicitly. | Kept as a rule (consensus in CRO practice) but labelled practitioner consensus, no number claimed. | fixed |
| 9 | SKILL.md | Gap: proof placeholders. Generic assistants invent testimonials and stats; a top studio never does. | Already fundamental 12. Tester to verify it fires. | ok |
| 10 | All | Filler check: no essays, every section is rules, tables or examples. | None. | ok |

## Would a top practitioner learn something?
Yes, on at least these: layer-order diagnosis (fix earliest failed layer), the destructive echo pattern with the "never a bare Cancel" corollary, adaptive errors with the sign-in enumeration exception, the contractions conflict resolution, tone dials per moment, the IBM short-string expansion table applied to button budgets, and the split between statement headings and nav titles. A strong generalist typically knows none of the exceptions.
