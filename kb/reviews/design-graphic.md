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

---

# Review round 2: design-graphic v0.2 (critic, 2026-10-10, wave 2)

**Verdict: approve after fixes (all applied below), then test.** Scope: the wave 2 additions (brief 07, research 07, draft 07), the trimmed references 03 and 04, the rewritten SKILL.md and the three assets.

## Citation spot check (run first)
Method: every unique URL in `kb/research/graphic/01` to `07` (64), seeded sample of 20 percent rounded up (13), mulberry32 seed 20261010 (`kb/research/graphic/scripts/pick.mjs` with `urls.txt`). Each URL re-fetched on 2026-10-10 and checked against the claim it supports.

| # | URL | Claim | Result |
|---|---|---|---|
| 1 | support.contently.com/article/822 | Shoot briefs specify objectives, shot list, subjects, location, lighting, style, deliverables **and usage rights** | **Overstated**: page covers releases, not usage rights. Claim narrowed in research 03 #10; usage rights now rest on Ocus (re-fetched: section "Licensing & Usage Rights", "clarify ownership and usage rights upfront") |
| 2 | web.dev/articles/optimize-lcp | Never lazy-load LCP; fetchpriority on one or two images; 2.5 s at 75% | Pass ("Never lazy-load your LCP image") |
| 3 | evilmartians.com how-to-favicon | SVG favicon can hold a dark-mode media query; file set | Pass |
| 4 | animade.tv/work/dropbox-smalls... | Dropbox spot library by one studio, one style | **URL redirects** (302 to archive.animade.tv); claim holds there ("expand their illustration library, whilst maintaining their existing style"). URL updated in research 04 and reference 04 |
| 5 | pentagram.com MIT Media Lab | Grid-generated identity system | Pass ("an interrelated system of glyphs", seven-by-seven grid) |
| 6 | oktopost.com instagram grid | 3:4 grid since early 2025; 1080 x 1350 | Pass |
| 7 | developer.android.com adaptive icons | 108 / 66 / 48 to 66 dp; monochrome layer | Pass |
| 8 | standards.site/examples/mailchimp | Mailchimp guidelines cover illustration | Pass |
| 9 | developer.mozilla.org prefers-color-scheme | SVG images inherit the scheme from the OS or the embedding element | Pass |
| 10 | 99percentinvisible.org Geismar | Listed as a practitioner source beside R2 | Pass for "very clear, very simple and that can be reduced to a small size"; the "shading and other graphic niceties" quote is from R2 (Print), re-fetched and confirmed |
| 11 | support.google.com/youtube/answer/72431 | 16:9, 3840 x 2160, min 640, 2 MB mobile | Pass |
| 12 | brand.wwu.edu name-svgs | role="img" plus aria-labelledby; decorative aria-hidden | **URL redirects** (302 to marcom.wwu.edu); content holds. URL updated in research 06 and reference 06 |
| 13 | createwithswift.com Icon Composer | 1024 grid, up to 4 groups, no mask, appearances | Pass; appearances are Default, Dark, Clear Light and Dark, Tinted Light and Dark. SKILL.md now says "Default, Dark, Clear and Tinted" |

By the agent rule the batch **failed** (two stale URLs, one overstated claim) and went back to the researcher. Researcher fixes applied the same day; the three items re-fetched at their new URLs or with the narrowed claim and pass. Batch passes on re-check.

## 1. Fundamentals gate
- Every number re-run: `stroke-snap.mjs` (placement table), `tab_contrast.py` (favicon ratios, reproduced: 3.04, 2.32, 5.29 for `#f26b21`; 14.92 and 5.28 on the warm 950 field), the fontTools cap-height check (1340 OS/2 vs 1430 measured H). All match the text.
- **Fail found and fixed (fix 1):** reference 02 "Stroke at small sizes" said a 1.5px stroke "renders crisp" on 2x screens. Measured: only when stems sit on .25 or .75; on whole or half pixels it blurs two columns. Rewritten with the measurement.
- **Fail found and fixed (fix 2):** the first draft of the favicon rule recommended one mid-lightness brand color with no media query, citing 3.1:1 on white and 3.9 to 5.3 on dark strips. The tester measured a gray inactive-tab strip: 2.32:1. Rule replaced by "measure every strip; own field when any fails" across SKILL.md, 01, 06, draft 07 and research 07 (M4).
- Accessibility rules agree with design-foundations `references/accessibility.md`: 3:1 non-text, `aria-hidden` decorative SVG, `role="img"` plus name for meaningful SVG, no `aria-label` on a generic element (the wordmark link carries its name on the `a`).

## 2. Claims vs research
- "OS/2 describes the default instance only": research M3 shows the instancer leaves 1340; the claim is about what fontTools' instancer writes, stated as such in 01. OK.
- Bringhurst 5.1.3 comes through a secondary (simplebits); tier labelled 3 via secondary. OK.
- Keylines circle 13, square 12 on a 16 grid are Material's 20 and 18 scaled, marked opinion. OK.

## 3. Contradictions
- `--size-icon-sm..2xl` in SKILL.md and 02 were not in the FOUNDATIONS token schema (fix 3): removed, sizes given in px, token proposed in pipeline notes.
- design-polish 03 pairs 14px 400 to 500 text with 1.33 to 1.5px rendered strokes; design-graphic pairs 14px 500 with 1.5px. Consistent.
- design-art-direction says line art is 2px "beside 2px icons"; Tally icons are 1.5px, and its sparklines (1.5 to 2px) are unchanged. No conflict.
- Description: still a domain reference, now names design-art-direction as owner of page imagery (fix 4).

## 4. Gaps
- No rule for the brand mark inside product chrome vs the UI set: added ("may sit one weight step above the UI set on its own field", 02).
- No guidance on sprites vs inline: added, with the lint blind spot.
- Still open: animated marks (design-motion), email signature and OG image built from the mark (05 has OG composition only).

## 5. Expert bar
Would the best person learn something? Yes on: device-pixel placement measured per stroke width; stroke bound to font-weight per state; the favicon ground measured against real strips; outlining from the optical-size instance with measured cap height; a numeric icon audit that caught what two other checks passed. Nods only on "draw the hard icons first" and "metaphor table" (kept: short, and now tied to code).

## 6. House style
Em dash scan (U+2014) on every file touched: none. Plain language. Opinion labelled.

## Fix list
| # | File | Change | Status |
|---|---|---|---|
| 1 | references/02-icon-systems.md | 1.5px crisp only on .25/.75; measured table | applied |
| 2 | SKILL.md, 01, 06, draft 07, research 07 | Favicon: own field when any strip fails; M4 numbers | applied |
| 3 | SKILL.md, 02 | Remove `--size-icon-*`; px sizes; proposal to editor | applied |
| 4 | SKILL.md description | Names design-art-direction as owner of page imagery | applied |
| 5 | research 03, 04, 06; references 04, 06 | Narrowed Contently claim; two redirected URLs updated | applied |
| 6 | SKILL.md section 4 | iOS appearances: Default, Dark, Clear and Tinted | applied |
