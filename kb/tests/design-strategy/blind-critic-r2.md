# Blind critic: Halden Hearing, entries K and L (round 2b)

| Rubric area | K | L |
|---|---|---|
| 1. Strategy rigor | 5 (capped: unsourced hero claims; 7 before cap) | 7 |
| 2. Strategy to design | 5 | 8 |
| 3. Voice | 7 | 7 |
| 4. Screen fundamentals | 5 (capped: lint FAIL, 42 fails; 6 before cap) | 8 |
| 5. Expert moves | 5 | 7 |
| **Total /50** | **27** | **37** |

**Verdict: L is clearly better, by about 10 points out of 50.** L turns its strategy into a page you can see: the audiogram plot, the ochre field and the owners in the H1 and lead, with a clean lint and a claims ledger. K has the better-argued strategy document. Its page, though, is a warm-cream-and-terracotta template with an empty photo box where the brand should be, a headline any competitor could run, and a failing lint.

Shots: `scratchpad/blind-strategy-r2b-shots/{K,L}/` (full pages at 390, 768, 1024 and 1440, light and dark), `.../{K,L}/first/` (first screens), `.../{K,L}/lint.json`, `.../viewers/` (raw five-second answers). K's second lint run wrote `home.lint.json` next to the page; I moved it to `shots/K/home.lint.json`.

---

## 1. Lint

| | Result |
|---|---|
| K | **FAIL, 42 fail, 6 warn** (`shots/K/lint.json`) |
| L | **PASS, 0 fail, 0 warn** (`shots/L/lint.json`) |

K's fails, in order of how much they matter:
- **axe `label-content-name-mismatch`** on `.brand` (WCAG 2.5.3, level A). The aria-label "Halden Hearing, home" does not contain the visible text "Halden / Hearing · Clifton" as one string (K/home.html:171). This is a real accessibility fail, not house style.
- **measure:** step text at 1440 runs 23 to 25 characters a line (minimum 45) in the four-column timeline (K/home.html:139, `shots/K/K-1440-light.png`, steps row). On a page for older readers this hurts readability.
- **type-scale:** 19, 26, 18, 20.9, 22, 32, 24, 28 and 17px are all off the shared scale. K built its own rem ladder (K/home.html:44, 60, 64, 88, 121, 146, 151, 156) and did not use the foundation tokens.
- **spacing:** 20, 28, 40, 9.6, 4.8, 5.6 and 6.4px are off the scale (K/home.html:50-51, 61, 89, 95, 114, 159).
- **focus-shape:** the skip link's radius changes on focus (K/home.html:49, 52).
- Warns: fluid display sizes, and "high-street" splitting across two lines in the 390 caption.

Contrast, computed by me: everything in both entries is at or above 7:1, except L's muted text on the page background at 6.63:1 (`#5d5750` on `#fcf6eb`). That is still AA for body text. K's AAA claim (K/strategy.md:91) holds: brick on paper is 7.11, ink-soft on sunk is 7.78, and the dark accent is 8.28.

Small text for a 68-year-old reader:
- K: "HEARING · CLIFTON" in the lockup is 12px uppercase (K/home.html:61). It carries the category word.
- L: chart labels, axis labels and the "EXAMPLE" tag are 14px (L/home.html:306, 311, 294). They carry the meaning of the hero picture ("Birdsong", "Quiet", "Loud"). The 16px figcaption restates the main point, so I count this as a near miss and dock a point, not a gate fail.

## 2. Screenshots: what I saw

**K**
- The 390 first screen (`shots/K/first/K-390-light.png`) is clean: eyebrow, a two-tone serif H1, lede, three bullet facts, then two full-width buttons (book and call). It fits inside the viewport. Neither owner's name and no price appear in it.
- At 768 (`shots/K/K-768-light.png`), a full-width "Photo to come" box with concentric arcs takes about 330px straight after the hero copy. This is the page's biggest visual and it is empty.
- At 1440 (`shots/K/K-1440-light.png`), the hero is a two-column layout with a 4:5 placeholder on the right. The "Four in ten" strip is the best typographic moment on the page. The four-step 90-minute timeline with dots on a rule is the one graphic device; its columns are too narrow (see the measure fail). The prices sit in three columns, followed by an "elsewhere" card.
- Dark (`K-1440-dark.png`, `first/K-390-dark.png`) is well handled: a salmon accent and a filled light button.
- Overall look: cream paper, terracotta accent and a serif heading is the default look of 2020s independent wellness and DTC brands. It reads as competent and generic.

**L**
- The 390 first screen (`shots/L/first/L-390-light.png`) is an ochre field. It runs: eyebrow "Free hearing tests in Clifton, Bristol"; H1 "A 90-minute hearing test. No commission."; a 47-word lead naming Priya and Tom; one button; "You do not have to buy anything"; the phone link; a hairline; the 4 in 10 line. The result card's heading is cut off at the bottom edge, which two viewers noticed.
- At 390, 768 and 1440 (`L-390-light.png`, `L-768-light.png`, `L-1440-light.png`), the audiogram card shows a sloping line of open rings, a tinted "missed" band, and everyday sounds placed on the chart. The audiology is correct: quiet is at the top, and sounds above the line are missed. Section 2 shows five ring-numbered steps beside a plain price table.
- At 1440 the H1 sits tight to the lead (16px after a 61px display, L/home.html:260), and the right column below the prices is empty for about 300px.
- In the 1440 header, "Call" and the number are underlined as two separate pieces.
- Dark (`L-1440-dark.png`, `first/L-390-dark.png`): the field becomes a deep brown (`#492b00`). It is legible (11.98:1) but muddy, and less warm than the light version.
- The mark is three open rings joined by lines. It is consistent across header, footer and step markers. At 22px it reads more like a "connected nodes" or analytics glyph than like something about hearing.

## 3. Five-second test (four fresh viewers, run by me)

The Agent tool was not available in my session. Each viewer was a separate `claude -p` process in a new empty temp folder holding only the 390 light first screen (`page.png`). The prompt was the persona line plus the five questions. Raw files are in `shots/viewers/`.

**K viewer 1**
1. **What is this?** It's a hearing clinic's page, Halden Hearing in Clifton, Bristol. They offer a free 90-minute hearing test.
2. **Who is it for?** Someone like me, who has put it off for years. "You've waited long enough" is aimed right at me. My daughter has clearly seen that line.
3. **What would I do next?** I'd ring the number. I don't trust booking things on a phone screen, and it says I'd get the clinic rather than a call centre. I'd probably ask my daughter to come along or at least sit with me while I do it.
4. **Does anything look wrong or odd?**
   - Ninety minutes is a long time for a "test". I'd want to know what fills it.
   - "Free" makes me wonder where the catch is. They say there's no commission and no pressure, but hearing aids cost a lot, so I'd still expect some selling.
   - There's no price anywhere, and no reviews or names of real people.
   - The phone number is easy to find, which I like. The text is big and readable, which is thoughtful.
5. **What does it remind me of?** It looks like the glossy "we're a friendly independent" pages for opticians and funeral planners. It also reminds me of the gentle but pushy hearing aid leaflets that come through the door. This one is calmer than those, though.

**K viewer 2**
1. It's a hearing clinic's web page. Halden Hearing, in Clifton, Bristol. They're offering a free 90-minute hearing test.
2. It's for people like me who've put it off. "You've waited long enough" is aimed squarely at me. My daughter clearly picked it for that.
3. I'd ring the number. I'd rather talk to a person than fill in a form, and they say I'll get the clinic, not a call centre. The big phone number at the top is easy to read, which helps. I might check where Clifton is first, in case it's a faff to get to.
4. Nothing looks wrong. The writing is large and clear, and there's no pop-up or countdown timer. A few things make me wary:
   - "Free" always makes me wonder what the catch is.
   - It doesn't say if I need a referral or what happens after the test.
   - There are no prices, no reviews, and no photos of the people or the place.
   - 90 minutes is a long time.
   - "We earn no commission" is a bit too eager. If it's true, fine.
5. It reminds me of my optician, or a nice independent shop. It's calm and doesn't pressure you, which is the opposite of the loud hearing-aid adverts in the Sunday papers. It also reminds me of my daughter nagging me, politely.

**L viewer 1**
1. **What is this?** It's a hearing clinic's web page. Halden Hearing, in Clifton, Bristol. They offer a free hearing test that takes 90 minutes.
2. **Who is it for?** Someone like me, who's been meaning to get their ears checked and hasn't. It even says most people wait about ten years. That made me wince, because it's me.
3. **What would I do next?** I'd probably ring the number. I don't love booking things on a phone screen. The "you don't have to buy anything" line helps. I'd ask my daughter whether she thinks it's trustworthy before I went.
4. **Anything wrong or odd?** Nothing alarming. It's a bit sparse, and I can't see prices or opinions from other customers in this bit. "No commission" is a phrase I don't quite get, so I'd have to guess what it means. 90 minutes is longer than I expected. The "4 in 10 come from a GP or a friend" figure is "by our own records", so I'd take it with a pinch of salt. The "example" results box at the bottom is cut off, so I can't tell what it shows.
5. **What does it remind me of?** The local opticians, or a small independent shop with real people behind it. The owners' names are on it, which I like. It's much friendlier than the big hearing-aid chains that push you to buy.

**L viewer 2**
1. **What is this?** It's a hearing clinic's website, Halden Hearing in Clifton, Bristol. They offer a free hearing test that takes 90 minutes. They say they don't pay commission, so nobody is pushing me to buy.
2. **Who is it for?** Someone like me. I've put it off for years, and they say most people wait ten years. It's probably also for people near Bristol, since it names Clifton.
3. **What would I do next?** I'd ring the number. I'd rather talk to a person than fill in a form. Before that I'd ask my daughter whether she has been there or knows someone who has. The "you do not have to buy anything" line helps, because that's what I worry about.
4. **Anything odd?** Not really. The "4 in 10 come because a GP or a friend sent them" line is a bit vague, though they do say it's from their own records. I'd also want to know why a test takes 90 minutes. The page cuts off at "What your results look like – example", so I can't tell what comes next. The beige and brown colours look a bit dull, but the writing is easy to read.
5. **What does it remind me of?** An independent opticians or a family-run local business, not one of those big chain shops. It feels more personal than that. The two named owners, Priya and Tom, make it feel like I'd be seen by real people.

**Reading the results**
- Both entries pass on what it is, where it is, who it is for, and what to do next. All four viewers would ring first, which supports making the phone number prominent.
- K's first screen has no people: both K viewers noted no names or photos. One K viewer compared it to "gentle but pushy" leaflets and funeral-planner pages.
- L's named owners landed with both L viewers ("real people"). Its costs: "No commission" read as jargon (viewer 1), "by our own records" met doubt from both, the cut-off card was flagged by both, and one viewer called the colours "a bit dull".

## 4. Swap test (Specsavers, Boots Hearingcare, Amplifon), logo hidden

What the competitors say today (spot-checked):
- **Boots Hearingcare:** its own page says "Tests usually take 15-30 minutes", and a "quick, 15-minute check" elsewhere (fetched bootshearingcare.com/hearing-test).
- **Specsavers:** the UK hearing services guide (PDF, 2019) says tests "take about an hour". It also offers "a four-year guarantee" and aftercare "for as long as you need us".
- **Amplifon UK:** a local page says "around 30 minutes". A search excerpt of its UK FAQ says the full consultation "usually takes up to one and a half hours". I could not re-confirm that FAQ line by direct fetch because the page renders by script. Amplifon also offers "Free lifetime aftercare".

So **"90 minutes" is a weaker differentiator than either entry claims.** Neither entry checked competitors' published appointment lengths. Both swap tests are asserted, not tested.

**K**
- The headline "You've waited long enough. We won't rush you." swaps cleanly. Amplifon, which may already say up to 1.5 hours, could run it unchanged. **Fail on the hero.**
- The internal positioning statement (K/strategy.md:40) survives because of "left a high-street chain" and "no commission". But those sit in the bullets and the below-fold caption, not the hero.
- Hide the logo: cream, terracotta, a book serif and a "Photo to come" box could be any independent clinic, or a chain's "local" sub-brand. **Fail.**
- K/strategy.md:34 lists "Published price range including four years of aftercare" as a unique attribute. It is not: Specsavers has a four-year guarantee and Amplifon offers lifetime aftercare.

**L**
- The H1's first half ("A 90-minute hearing test") is exposed to Amplifon's FAQ claim. The second half ("No commission") is not something a chain would print. The lead's "Priya Nair or Tom Ashby will see you themselves. They own Halden" is the line that cannot be swapped.
- The internal onlyness line (L/strategy.md:19, "owners see every patient for 90 minutes, on no commission") holds against all three.
- Hide the logo: the ochre field, the plot notation and the named owners make it read as an independent, as L's own hidden-logo viewer and my viewers both found. The chart itself is generic category content. **Pass, mostly on words.**

## 5. Claims check against briefs.md

**K: unsourced claims on the page, not flagged in the hand-over**
- "No decision on the day. Go home and think it over." (K/home.html:205). The brief says "no obligation", not that Halden will not sell or fit on the day. This invents an operational policy, in the hero.
- "There's nothing to sign." (K/home.html:258). Invented.
- "You'll speak to the clinic, not a call centre." (K/home.html:211). This is a reasonable inference for a two-person clinic, but still a promise the brief does not make.
- "Whether or not you need a hearing test." (K/home.html:272). The hand-over does flag this one (K/handover.md:146).

These are why **K's strategy rigor is capped at 5**: the rubric asks whether every claim traces to the brief, and three hero and section-2 promises do not.

**K: outside sources**
- Dunford's *Obviously Awesome* (2019) is real, and the five components are used correctly.
- GOV.UK content design guidance exists and does recommend plain English for a low reading age.
- AAO "Presbyopia" exists; "near-universal after 50" is a fair paraphrase.
- Charter was designed by Matthew Carter for low-resolution printers, as K says.
- The brick-and-Pennant Bristol reason and the "chains use blue and green" claim are marked as opinion.

**L: claims ledger**
- L/strategy.md:28-36 and L/handover.md:87-98 hold a claims ledger. It cuts the founders' unsourced "chains sell a device in one go" line. It marks the five steps and the wax line "to confirm" and the chart positions "approximate", and labels the chart "Example" on the page.
- **Spot-check: "Rolfe et al., BJGP Open 2023" is real.** It is Rolfe, Ozmen and Maru, "Beginning your hearing health journey with the online hearing test", BJGP Open 7(3), doi 10.3399/BJGPO.2023.0021. It says "people wait an average of 10 years before they seek help for their hearing loss". Verified. NICE CKS also cites RNID 2020 for a 10-year average delay.
- Inferences, not invented facts: "They own Halden" (the brief says they opened it) and "will see you themselves" (the brief names only two audiologists).
- Hand-over integrity: L's hand-over describes files that are **not in the entry folder**: `shots/`, `mark.svg`, `favicon*`, `og.png`, `state-sheet.html`, `five-second/`, `src/`, and the `build.py`, `unslash.py` and `tab_contrast.py` scripts. Its tool-run results (claims_inventory, search-check, conversion-audit) cannot be verified from what was submitted. Its viewer log also jumps from Viewer 4 to Viewer 6 with no explanation (L/handover.md:165-196). The page itself matches what the hand-over describes. Its lint claim (PASS, 0 fail, 0 warn) matched my run.

## 6. Scores with evidence

### 1. Strategy rigor: K 5 (capped), L 7

**K** has the more complete and readable strategy.
- A real person and moment, including the adult child beside them and the GP or friend who nudged them (K/strategy.md:12).
- The referrer treated as an audience: "make the person who recommended Halden look good" (K/strategy.md:25). This is a genuinely good expert move.
- A proper Dunford table, and a "what we are deliberately not saying" list (K/strategy.md:44-47).
- It loses on traceability: unsourced hero promises (section 5), a false "unique" attribute (four years of aftercare), and an unverified 90-minute swap.

**L** is sharper but thin.
- The onlyness line is specific and defensible on the owners, and the claims ledger and verified citation are strong discipline.
- The strategy is a form, not an argument (L/strategy.md is 70 lines of field labels like "CEP", "Onlyness" and "Level C/O"). A Pentagram or COLLINS client would find it terse and full of jargon.
- The audience moment is one sentence (L/strategy.md:9). It is a demographic ("Bristol adults in their 60s and 70s") with a trigger attached.
- The adult-child researcher and the existing-wearer segment barely appear.
- The competitor wall is "from memory" (L/strategy.md:17), and the swap test is asserted.

### 2. Strategy to design: K 5, L 8

**K**
- Every visual decision has a stated reason: the serif as a letter from a practice, brick as Bristol, the 90-minute line as the device (K/strategy.md:81-109).
- But the imagery decision, which carries the most weight, is deferred to a placeholder. That leaves the hero visual as an empty box (`K-768-light.png`, `K-1440-light.png`). The 90-minute line only appears at 1024 and up (K/home.html:134-145) and is hidden at 390.
- Hide the logo and it fails (section 4).

**L**
- The concept is "every picture is the chart drawn in the booth" (L/strategy.md:60), with a reject test. It produces an asset the clinic actually makes: the audiogram, carried into the mark, the step rings and the favicon.
- Atkinson Hyperlegible for low-vision readers ties straight to the audience.
- The ochre field is chosen against a stated competitor colour wall.
- Docked because the chart is generic category content (its own hidden-logo viewer said so), and the ochre reads "dull" to a fresh viewer and muddy brown in dark (`L-1440-dark.png`).

### 3. Voice: K 7, L 7

**K**
- Warm, short sentences, real numbers, and "we" to "you". The voice table (K/strategy.md:61-68) is good, and the page follows it.
- "You've waited long enough" risks the blame its own rule forbids (K/strategy.md:68), though my viewers read it as recognition, not a scold.
- "to work the way we think hearing care should work" (K/home.html:225) is filler.

**L**
- Plain and flat about money. "Including nothing at all." is the best line in either entry (L/home.html:444). The voice samples about running late and "you do not need hearing aids yet" are specific to a clinic.
- The H1 leans on "No commission", which a fresh viewer did not understand, and the first-screen lead is 47 words.
- "by our own records" reads as defensive; its own viewer 6 said "marking their own homework".

### 4. Screen fundamentals: K 5 (capped), L 8

**K:** lint FAIL, including WCAG 2.5.3 and the narrow measure at 1440. It earns credit for strong contrast (all text pairs 7:1 or better), 19-20px body text, 56px targets and two equal buttons at 390.

**L:** lint PASS, all text pairs AA or better, 20px body text and a 56px button. Docked for:
- 14px chart labels for a 68-year-old reader;
- the 390 first screen cutting the card heading at the fold;
- the tight H1-to-lead gap at 1440;
- a dead right column under the prices at 1440 (`L-1440-light.png`).

### 5. Expert moves: K 5, L 7

**K: what a top practitioner would credit**
- The referrer as an audience.
- Prices as a trust act that matches "no commission".
- Phone as an equal action, "not a call centre".
- No naming of competitors.
- A test plan that asks the right questions (K/handover.md:149-154).

**K: what they would object to**
- An emotional headline with no positioning in it.
- The hero visual left empty.
- Its own token system, ignoring the shared foundation scale.

**L: what a top practitioner would credit**
- "Weakest field gets the strongest fact": with no reviews, it uses the referral share and the named owners instead.
- The category search term in the eyebrow and title for the roughly 60 percent who arrive by search.
- A font changed because a fresh viewer read the slashed zero as odd.
- MedicalClinic schema, OG tags and metric-matched font fallbacks.

**L: what Dunford would object to**
- Leading with what Halden is not ("No commission"), a negative frame against chains the buyer may not know.
- Framing the category as "hearing test", which puts Halden in the free-test commodity race that Boots and Amplifon own.

**L: what Pentagram or COLLINS would object to**
- The mark reads as a generic node-link glyph.
- The dark field is muddy.

## 7. The 3 biggest gaps remaining in L (the better entry)

1. **The headline rests on the weakest-defended facts.** Amplifon publicly claims consultations of up to 1.5 hours, and Specsavers about an hour. "No commission" cannot be proven and read as jargon to a fresh 68-year-old. The fact no chain can copy is the owners: "Priya or Tom, who own the clinic, see you themselves." That is in the lead, not the H1. The fix is to verify competitor appointment lengths, then make the owners and independence the H1. "90 minutes" and "nothing extra if you buy" then become the proof under it.
2. **No human proof, and distinctiveness carried by a generic chart and a colour viewers call dull.** There are no faces, no HCPC registration numbers and no reviews. The audiogram is "common to any hearing test". The ochre turns into flat brown in dark mode. This needs a photo shoot of Priya and Tom, HCPC numbers beside their names, and a mark that reads as Halden rather than an analytics icon.
3. **The strategy is too thin to hand to a client, and the secondary audiences are not designed for.** The audience is a one-line demographic plus a trigger. The adult-child researcher, the existing-wearer search ("hearing aid adjustment Bristol") and the GP referrer get a single sentence on the page. Smaller fixes: 14px chart labels, the 390 first screen cutting the card, and a hand-over that points to files that were not submitted, with a missing viewer in its log.
