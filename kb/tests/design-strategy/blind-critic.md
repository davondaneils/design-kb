# Blind critic: Halden Hearing, entries P and Q

Brief and rubric: `/home/user/design-kb/kb/tests/design-strategy/briefs.md`. Screenshots: `scratchpad/blind-strategy-shots/` (`*-full-*` = full page, `*-first-*` = viewport-only first screen; lint JSON moved there as `P-lint.json`, `Q-lint.json`).

## Scores

| Rubric area | P | Q | Note |
|---|---|---|---|
| 1. Strategy rigor | 7 | 7 | P sharper and better policed (claims ledger); Q fuller and more readable but its hero line fails the swap test |
| 2. Strategy to design | 8 | 6 | P's type-as-image idea carries the page; Q's main visual decision (real photos) ships as a grey "Photo to come" box |
| 3. Voice | 7 | 6 | Both plain and warm; Q's H1 could be anyone's, and it adds promises that are not in the brief |
| 4. Screen fundamentals | 8 | 5 (capped) | P: lint PASS (0 fail, 1 warn). Q: lint FAIL (42 fail), including an axe accessibility fail |
| 5. Expert moves | 7 | 6 | P: heard/said sentence, claims ledger, structured data. Q: the 90-minute timeline is the best single idea in either entry |
| **Total /50** | **37** | **30** | |

**Verdict:** P is better, by a clear but not crushing margin (about 7 points out of 50). Most of the gap comes from fundamentals (Q fails the gate) and from design carrying the strategy (P's page works with no photography; Q's page needs a shoot it does not have). On strategy writing alone they are level. Q is easier to read and covers more audiences. P is more disciplined about what it is allowed to claim.

**The 3 biggest gaps still in P**
1. **The one true fact is asserted but never shown.** The page says "90 minutes" four times but never says what the time is for. Q's four-step "What happens in your 90 minutes" timeline answers the obvious next question; P's section 2 goes straight from the founder story to prices (P/home.html:350-388; P-full-1440-light.png).
2. **No people and no proof.** The brief asks for "trustworthy", and 40 percent of patients come from GP or friend referrals, yet P has no faces, no patient words and no referral proof anywhere. P's own strategy names proof as its "weakest field" (P/strategy.md:27). The primary distinctive asset, the ochre H crossbar, reads as a smudge on the H at phone size (P-first-390-light.png, top left), so the wordmark cannot do the trust work either.
3. **The identity breaks in dark mode and the strategy write-up is shorthand.** In dark mode the damson field nearly vanishes (#2a0f1d against #13110f) and the primary button turns candy pink (#eea9c9) (P-full-1440-dark.png, "Book a free hearing test" in the price column). That is off the damson-and-ochre system. The brief uses unexplained shorthand (CEP, level O/C/E), cites a competitor-wall capture in `wall/` and `shots/` that was not supplied (P/strategy.md:18, 68), and the hand-over has no "what we would test" list. Deliverable 3 is only half met.

---

## Process notes (honesty)

- **Five-second test NOT run as specified.** This session has no Agent/subagent tool, so I could not show the image to a fresh-context viewer. No verbatim answers exist and I have not invented any. Below is my own glance read as a proxy, clearly labelled. It is not blind to the rest of the page and should be rerun with real fresh viewers on `P-first-390-light.png` and `Q-first-390-light.png`.
- To find the `--viewport-only` flag I grepped the argument parser of `tools/render.mjs`, which goes slightly beyond the usage line. It revealed nothing about either entry.
- Running lint wrote `home.lint.json` into each entry folder. I moved those files to the shots folder, so the entries are back to the two files each had.

## 1. Lint and render

**P:** `Fundamentals lint: home.html -> PASS (0 fail, 1 warn)`; warning: `fluid display size 88px at 1440px (clamp() present) [#hero-title]`. 

**Q:** `FAIL (42 fail, 6 warn)`. The fails that matter:
- `axe: label-content-name-mismatch ... [.brand]`. Q/home.html:171 sets `aria-label="Halden Hearing, home"` on a link whose visible text is "Halden / Hearing · Clifton". That fails WCAG 2.5.3 Label in Name: a voice-control user saying "click Halden Hearing Clifton" gets no match. This is a real accessibility fail, not a token quibble.
- `focus-shape: focus changes radius 0px to 2px [a.skip]` (Q/home.html:49).
- `measure` fails: timeline step text runs 23 to 25 characters per line at 1440 (Q/home.html:139, four columns of 1fr).
- `type-scale` and `spacing`: 19, 26, 18, 20.9, 22, 17px type and 20, 28, 40, 4.8, 9.6px spacing are all off the shared scale (Q/home.html:21-22, 44, 50, 60, 95, 89). Q defines its own 7-step spacing and has no type tokens at all.

**Contrast (computed):** both entries pass, mostly at AAA. Q: brick on paper 7.11, white on brick 7.99, soft ink on paper 8.65, dark accent 8.28. Q's strategy states these numbers correctly. P: muted on damson 8.93, text on damson 12.23, muted on paper 8.91, dark button 8.68. The ochre logo bar on light paper is 3.26 (decorative, passes the 3:1 non-text minimum).

**Sizes for an older audience:** P body 20px at all widths, nothing under 16px. Q body 19px (20px at 1024 and up), header "Call us" label 14px (Q/home.html:63). The 14px label is minor, but it is under the 16px floor Q set for itself (Q/strategy.md:84).

**Screens looked at:** all 16 full renders plus 8 first-screen renders, light and dark.
- P is consistent at every width. At 1440 the H1 spans two columns and leaves an empty upper right, which is acceptable because of the strong measure. At 390 the call link sits under the button, and the heard/said sentence starts just above the fold, which invites a scroll.
- Q's first screen at 390 is strong: H1, three facts, both actions, all above the fold (Q-first-390-light.png). At 768 and 1440, however, the largest object on screen is a 4:5 grey placeholder reading "Photo to come ... No stock." (Q-first-1440-light.png; Q-full-768-light.png, where it takes about 500px). That is build scaffolding on a client-facing first screen. Q's nav links "About Priya and Tom" and "Find us" go to `#` (Q/home.html:185-186).

## 2. Five-second test (proxy, not a fresh viewer; see process notes)

As a 68-year-old glancing at the 390 light first screen:
- **P** (P-first-390-light.png): "A hearing clinic in Clifton, with two named people. It's free and they don't take commission. I'd tap Book or ring them." Possible snags: the dark plum feels more like a wine bar or a theatre than a clinic, which could cut either way; the "Halden" logo has an odd yellow mark on the H that looks like a glitch. Which chain does it remind me of: none.
- **Q** (Q-first-390-light.png): "A local hearing clinic that won't rush me. A free 90-minute test, no commission. Big red button or call." Nothing looks wrong at 390. The circle logo looks a bit like a power button. Which chain: none specifically, but it looks like a generic independent or wellness practice.

Expected real-viewer risk: Q's message lands faster at a glance (benefit-first H1 plus bullet facts). P's look is more memorable but its H1 is more abstract.

## 3. Swap test

| Line | Specsavers / Boots Hearingcare / Amplifon swapped in | Result |
|---|---|---|
| P onlyness (P/strategy.md:20) | "only hearing test in Clifton given 90 minutes by an audiologist on no commission" | Breaks on 90 min, no commission and Clifton. Pass. |
| P H1 "Ninety minutes to find the words you've been missing." | Reads false for a chain on the brief's facts (the 90 minutes is the point) | Pass, as far as the brief can tell (chain appointment lengths are not stated) |
| P lede "one of us, Priya Nair or Tom Ashby ... not paid commission" | Cannot be said by a chain | Pass |
| Q positioning statement (Q/strategy.md:40) | Breaks on 90 min, no commission, "left a high-street chain" | Pass |
| Q H1 "You've waited long enough. We won't rush you." | "Specsavers: You've waited long enough. We won't rush you." still reads as believable marketing | **Fail.** The hero headline is generic; only the lede rescues it |
| Q bullets | "four different makers" fits Amplifon or Boots; "no commission" breaks | Mixed |

**Hide the logo:**
- P: a damson field, a literary serif and the "as heard / as said" sentence. No Bristol chain uses that combination, and the sentence device is the most ownable element in either entry. It could still be copied, but it is not category wallpaper.
- Q: cream, a book serif, terracotta and a photo box. Against the chains it passes (not navy, green or blue). Against "two other independents" it does not: this warm-minimal look is the default for boutique clinics and wellness practices. With the logo hidden it could be either of them.

## 4. Claims check against briefs.md

**P, on the page:** all business facts trace to the brief: 90 minutes, free and no obligation, no commission, four manufacturers, £65, £1,495 to £3,995 with four years of aftercare, the bought-elsewhere service, left a national chain in 2024, one room and one booth.
- External claims are cited: MedlinePlus on high-frequency loss (P/home.html:344) and RNID Hearing Matters 2020 for the 10-year average (P/home.html:357). These go beyond the brief but are sourced, which is correct practice. The brief's founder quote ("about ten years") agrees.
- Invented specifics: the address "Clifton Village ... BS8" (P/home.html:47-48, 395), the phone number (a placeholder in a drama range, acceptable), and "Bring someone with you if you like" (P/home.html:385, a mild policy invention). The voice samples imply policies that do not exist ("Running late? Come anyway", "We'll write to [your GP] today", P/strategy.md:41-44). They are not on the page.
- Strategy evidence not supplied: the competitor wall `wall/` and `shots/` (P/strategy.md:18, 68).
- Good discipline: the ledger cuts "chains sell in one appointment" and "only" from public copy (P/strategy.md:36).

**Q, on the page:** the core facts are correct. Promises that are not in the brief:
- "No decision on the day. Go home and think it over." (Q/home.html:205)
- "There's nothing to sign." (Q/home.html:258)
- "Nothing hurts." (Q/home.html:250)
- "We show you your results on paper" (Q/home.html:254)
- "You'll speak to the clinic, not a call centre." (Q/home.html:211)
- earwax removal "Whether or not you need a hearing test" (Q/home.html:272)

Each one is a reasonable inference, but together they are six operational promises the client never made. "No decision on the day" may even contradict a patient who wants a same-day fitting.

**Q, in the strategy:** "see handover" appears twice (Q/strategy.md:42, 104), but there is no hand-over section, so deliverable 3 is missing. "North Bristol" (Q/strategy.md:12) is the wrong side of town for a Clifton clinic's core catchment (illustrative only). The "four in ten" referral stat is true, but it is an internal acquisition metric used as public proof.

I did not apply the gate cap for invented claims to either entry: neither invents numbers, credentials, reviews or competitor facts. Q loses points in areas 1 and 3 for its volume of unrequested promises.

## 5. Evidence by rubric area

### 1. Strategy rigor: P 7, Q 7
- **P +** The audience is a moment, not a demographic: "family lunches become nodding along ... held back by fear of being sold a device on the spot" (P/strategy.md:9). The alternatives include the status quo (line 16). It has a one-sentence onlyness and a passed swap test, with "independents unverified" stated honestly (line 21). It keeps a claims ledger. 
- **P -** Written in shorthand: CEP and the O/C/E levels are never defined, and a client could not read it. The 40 percent referral fact is ignored. The cited competitor evidence is missing. The hand-over is a "Not built" line and a checks table, with no test plan.
- **Q +** A full Dunford breakdown (Q/strategy.md:31-37). Four readers, including the adult child and the referrer ("make the person who recommended Halden look good", line 25), which is the sharpest audience insight in either entry. A "what we are deliberately not saying" list (44-47) and the brand idea "Time, not a sale."
- **Q -** The emotional moment is marked "assumption" but then drives the hero. The H1 fails the swap test. The hand-over is missing. Six on-page promises are not in the brief.

### 2. Strategy to design: P 8, Q 6
- **P +** Each identity decision maps to a voice attribute with a reason (P/strategy.md:48-54). Damson and a serif deliberately break the navy-or-green, rounded-sans category code. The concept sentence and its reject test (61-62) are art-direction-grade: "A face, device, ear or sound wave: cut it." The page runs entirely on type and works with no photography.
- **P -** No human presence for a referral-led, two-person practice. The ochre crossbar is too small to read as an asset at 26px tall (P/home.html:211; P-first-390-light.png). Dark mode drops the damson field and turns the CTA pink (P-full-1440-dark.png).
- **Q +** Brick red justified by Bristol's red brick and by sitting outside chain colors (Q/strategy.md:89). Prices on the home page as a trust act. "No pop-ups, no chat widget on load" because every interruption reads as a sales tactic (line 108). The 90-minute line turns the fact into a visual (lines 99-100; Q-full-1440-light.png).
- **Q -** The decisive decision (real photos of Priya and Tom) is not delivered: the first screen at 768 and up is a placeholder. The serif rationale is generic ("reads as considered", marked as opinion). The mark, a circle with an open quarter plus a dot, reads as a power or loading icon at 40px (Q-first-1440-light.png, top left). Hide-the-logo fails against the independents.

### 3. Voice: P 7, Q 6
- **P** Plain and warm: "If that is you, you are in good company" (P/home.html:356) refuses to shame, which is the right move for a 10-year avoider. "We are not paid commission, so the test is about your hearing, not a sale." The H1 is more literary than an anxious 68-year-old may need; "find the words" is a metaphor that takes a beat. Body text is 20px, reading level is fine, and copy follows its own "Straight, not salesy" line.
- **Q** Short and kind: "Nothing hurts", "You decide, later", "You'll speak to the clinic, not a call centre." Its own voice rule is "reassure with facts, not adjectives", but the H1 reassures with sentiment, and several reassurances are invented facts. The "Four in ten" strip sounds like a marketing metric, not Priya or Tom across the desk.

### 4. Screen fundamentals: P 8, Q 5 (cap)
- **P** Lint pass. Contrast at AAA. Clear hierarchy: one filled CTA per section, prices in tabular serif. Footer and links all have a 48px target height. Deductions: the crossbar artifact, the H1 at 88px with an empty upper right at 1440, no top navigation on any width (only footer links), and the "Call us" label and number underlined as two separate pieces (P-first-1440-light.png).
- **Q** Lint fail with 42 items, including a WCAG 2.5.3 fail. Placeholder copy on the first screen. Dead `#` nav links. Four 23-character columns in the timeline at 1440. Strong otherwise: a clean 390 first screen and full-width 56px buttons on mobile.

### 5. Expert moves: P 7, Q 6
- **P** A Pentagram or COLLINS strategist would sign off on the heard/said sentence: it shows the symptom in the reader's own experience, it is cited, and it is screen-reader aware (P/home.html:337). Also strong: the claims ledger that cuts unprovable lines, a self-hosted Literata subset with metric-matched fallback (lines 60-88), MedicalClinic JSON-LD for the "hearing test Bristol" search channel (lines 25-58), and OG alt text that carries the concept. April Dunford would object that the page never tells the patient what they get in those 90 minutes, and that the referral engine (40 percent) is absent.
- **Q** The 90-minute timeline is the best single move in either entry, because it makes the unique attribute concrete and checkable. The separate "Bought your hearing aids somewhere else? Book an adjustment" path serves a real second segment. Dunford would object to the H1. COLLINS would object that the identity has no ownable asset beyond a warm palette, and that the brand rests on a photo shoot that has not happened.
