# Review: design-copy v0.1 (pre-ship)

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
