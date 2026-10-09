# Review: design-graphic v0.1 (critic)

**Verdict: revise, then approve.** Fundamentals coverage is strong and leads the skill as required. Nine fixes below; all applied by the skill-architect before testing (status column).

## Fundamentals gate check
- Contrast: 4.5:1 / 3:1 text, 3:1 non-text, logo exemption stated with its limits. Pass.
- Accessibility: alt decision tree, aria-hidden for decorative SVG, targets 24 and 44, color-not-alone. Pass.
- Correctness of specs: OG, X, favicon, iOS, Android, LCP, print checked against research. One fabricated number found (fix 1).
- Consistency with foundation contract: icon sizes on the 4 px scale, type scale tokens, color roles, radius scale. One mismatch (fix 3).

## Expert test: would a top practitioner learn something?
Yes on: the competitor wall and blur tests, separately drawn reversed artwork for irradiation, responsive logo tier 4 drawn by hand, keylines (circle 20 vs square 18), thumbnail math, briefing the moment as a verb, shooting three ratios at the same moment, writing the illustration spec from finished work. Nods only on: generic "one focal point" and "use SVG for logos." Added moves in fix 8 to raise the ceiling.

## Fix list
| # | File | Problem | Change | Status |
|---|---|---|---|---|
| 1 | references/01-logo-identity.md | "70 percent of recognition comes from the wordmark's letterforms" has no source | Remove the number; keep the move as opinion | applied |
| 2 | references/02-icon-systems.md | Worked example uses a 1.75 px stroke on a 20 grid, which cannot snap at 1x and conflicts with the 1.5 px rule elsewhere | Use 1.5 px strokes for 16 and 20 px variants and explain they are crisp on 2x screens; at 1x prefer integer strokes | applied |
| 3 | references/02-icon-systems.md | `--size-icon-xl` given as "32 or 48"; SKILL.md uses xl 32 and 2xl 48 | Align to xl 32, 2xl 48 | applied |
| 4 | all references | Citations point to R/I/P numbers in research files that a reader of the skill cannot see | Add a Sources section with links to each reference file | applied |
| 5 | references/05-composition-social.md | "Keep text 60 px in from every edge" for X crops reads as a platform rule | Mark as opinion derived from the 2:1 crop | applied |
| 6 | references/01-logo-identity.md | Gap: AI generated marks and copyright | Add rule: US Copyright Office requires human authorship; AI generated marks may not be protectable, so use AI for exploration only and redraw | applied |
| 7 | references/05-composition-social.md, SKILL.md | Gap: video thumbnails, a common request | Add YouTube thumbnail spec. Verification showed the old 1280 x 720 figure is outdated: YouTube Help now says 16:9, 3840 x 2160 recommended, min width 640, 2 MB on mobile and 50 MB on desktop | applied |
| 8 | references/01, 03 | Ceiling: missing dark mode logo version, avatar circle crop, ink spread at small print sizes, lockup proportion, tethered shooting with layout overlay | Add these as expert moves, marked opinion where not sourced | applied |
| 9 | all files | Em dash scan | None found (grep U+2014) | checked |

## Contradictions with other skills
No other design-kb skills shipped at review time. Foundation tension recorded in kb/reviews/design-graphic-pipeline-notes.md (logo contrast exemption vs the "WCAG floor everywhere" line).

## Sources added during review
- US Copyright Office, Part 2 report announcement (Jan 2025): https://www.copyright.gov/newsnet/2025/1060.html
- YouTube Help, add video thumbnails: https://support.google.com/youtube/answer/72431
