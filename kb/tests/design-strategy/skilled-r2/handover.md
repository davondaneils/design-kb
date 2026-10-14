# Hand-over: Halden Hearing homepage (skilled, round 2)

`brief_lint.mjs strategy.md`: PASS, depth one page, 597 words. Depth: one page. Weakest field: proof (no reviews yet). Swap test: pass.

## What I decided
- **Depth: one page**, not full. The brief gives the offer, the audience facts and five competitors, so a full website-strategy run would be over-scope. I took fields, not stages: the stage 2 gap list (below), the stage 3 language mirror ("hearing test Bristol") and three category frames from stage 4.
- **Audience moment:** adults in their 60s and 70s, pushed by family or a GP to check hearing they have doubted for years, held back by fear of a sales pitch. The hero answers that fear in its second sentence ("they earn nothing extra if you buy a hearing aid") and beside the button ("You do not have to buy anything").
- **One true fact:** every appointment is 90 minutes with Priya Nair or Tom Ashby, who own the clinic and earn no commission. The H1 says it: "A 90-minute hearing test. No commission." The next section shows what the 90 minutes hold, step by step, before any number repeats (design-strategy ref 05, expert move 12).
- **Weakest field gets the strongest fact** (expert move 13): no reviews exist, so the hero carries the referral share ("4 in 10 of our new patients come because their GP or a friend sent them, by our own records") and the named owners. No rating, no invented testimonial.
- **Category word in the first screen at 390:** "Free hearing tests in Clifton, Bristol" and "hearing test" in the H1; the button sits at 540px of 844.
- **Identity, with evidence levels:** body in Atkinson Hyperlegible Next at 20px (convention: drawn by the Braille Institute for low-vision readers); display in Literata (opinion: a book serif reads personal against the chains' sans); an ochre field, the 300 step, with ochre 800 buttons (opinion: no named competitor owns ochre); imagery is the audiogram drawn on a paper card and labelled in everyday sounds (opinion: the clinic's own output, and it breaks the stock-couple code). Primary distinctive asset: the plot, open rings joined by a line (the audiogram's own notation), used as the symbol, the chart and the numbered step markers.
- **Dark mode** (playbook-brand done item 4): the field remaps to ochre 900, a deep amber that keeps the hue; the button becomes an ochre 300 fill with ochre 950 text, so it stays inside the brand. Light and dark shots in `shots/`.
- **Type path: mixed, self-hosted.** Literata (OFL) pinned to opsz 72, wght 560, 20 KB; Atkinson Hyperlegible Next (OFL) as static 400 and 700, 11 KB each, inlined as base64 WOFF2; metric fallbacks on Liberation Serif and Liberation Sans. No font CDN. Production delivery: external hashed WOFF2 with `preload` for the two text files.
- **Modified font, disclosed:** Atkinson's zero is slashed by design. Viewer 1 said "The phone number's zeros have a slash through them, which looks a bit strange", so I dropped the device: `src/unslash.py` redraws the zero without the slash (OFL modified version, renamed "Halden Atkinson"). The retest viewers did not mention it.
- **Mark:** wordmark "Halden Hearing" outlined from Literata (no live text), with the plot symbol; nothing is altered inside a letter, so the name always reads correctly (playbook-brand 2a). Favicon: the plot in ochre on an ochre 900 tile. Tile on light strips 12.9:1 or better, ochre ink on dark strips 6.6:1 or better (`tab_contrast.py`): a two-tone mark on its own field.

## Claims, ticked against the brief
| On the page | Source | Held |
|---|---|---|
| 90-minute test; no commission ("earn nothing extra") | brief, founders | yes |
| "about ten years" before people get checked | Rolfe et al., BJGP Open 2023; RNID Check Your Hearing campaign | yes |
| 4 in 10 new patients from GP or friend | brief, 40 percent | yes |
| Free test, no obligation; £65 wax; £1,495 to £3,995 a pair; four years of aftercare; four manufacturers; aids bought elsewhere fitted and adjusted | brief | yes |
| Soundproof booth | brief | yes |
| Five steps (talk, look in ears, tones in the booth, chart explained, you decide) | standard UK hearing assessment; **founders to confirm wording and order**, and "if wax is in the way, we tell you before anything else" as their practice | to confirm |
| Example chart positions (birdsong, s f th, voices, dog barking) | approximate, after common "familiar sounds" audiograms; labelled "Example" | approximate |
| Phone 0117 496 0123 | **placeholder**: Ofcom's reserved drama range for Bristol; replace with the real number | placeholder |
| "Chains sell a device in one go" | founders' view only | cut, not on the page |

## Checks run
| Check | Result |
|---|---|
| `node tools/lint.mjs home.html` (390, 768, 1024, 1440, light and dark) | PASS, 0 fail, 0 warn |
| `node tools/lint.mjs state-sheet.html` | PASS, 0 fail, 3 warn (two 44px touch warnings on a demo focus link; a one-word heading line on the sheet title) |
| `claims_inventory.mjs --year 2026` | exit 0, no mechanical flags; 14 strings ticked as above |
| `search-check.mjs` | PASS, 0 fail, 2 warn ("hearing" twice in the title, kept for the search term; "today" read as a relative date, it is not one) |
| `conversion-audit.mjs` | no fails; 1 warn, "hurry" (it is "without hurrying", the opposite of urgency) |
| `icon_audit.mjs` | PASS, no icons |
| Layout | 390: CTA bottom at 540px, category word in first screen. 1440: section 2 heading at 851px, peeks above 900. Heights 2772, 2576, 1794, 1686 px |
| Word swap test | pass: with Specsavers, Boots Hearingcare or Amplifon, the named owners and "no commission" make the lines false |
| Hide-the-logo (fresh viewer, logo and name covered, `shots/hide-the-logo-1440.png`) | pass, partly on words: placed it as an independent, not a chain; cited the named owners, local number, "no commission", and "a golden-tan background, a serif headline and one big brown button. It doesn't have the polished corporate look"; said the chart "is common to any hearing test" |
| Covered competitor wall | not run: competitor first screens not captured; the wall in the brief is from memory |
| Five-second test | 6 fresh viewers in 3 rounds, below; no device read as an error in the final round |
| Fresh-context critic | not run by me; a separate blind critic scores this. Gate not claimed: self-review only |

**How the fresh viewers were run:** the Agent tool was not available in this session, so each viewer is a separate `claude -p` process with a new context, started in an empty folder holding only the 390 light first-screen PNG (390x844), told to read only that file, with the prompt "You are 68. You have put off a hearing test for years. Your daughter sent you a link..." and the five questions. No strategy or concept was given to any viewer.

## Five-second test, verbatim

### Round 1 (first build: slashed zeros, "No commission" unexplained, "free" said twice)
Viewer 1:

1. **What is this?** It's a hearing clinic's website. The clinic is called Halden Hearing, and it's in Clifton, Bristol. They offer a free hearing test that takes 90 minutes.

2. **Who is it for?** It's for people like me who have put off getting their hearing checked. It says most people wait about ten years, and I'm somewhere in that stretch. It's also for the people who nudge us, like my daughter, since it says a lot of patients come because a GP or a friend sent them.

3. **What would I do next?** I'd ring the number. I'd rather talk to a person than tap through a form, and it says "Prefer to talk?" right there. I might press the brown "Book a free hearing test" button first to see what it asks me. I'd also want to know whether 90 minutes is really the test or the whole appointment.

4. **Does anything look wrong or odd?** Not really. It's plain and easy to read, and the writing is big enough for me. I like that it says "no commission" and "you do not have to buy anything", because I've always worried a hearing clinic would try to sell me hearing aids. Two small things made me pause. The phone number's zeros have a slash through them, which looks a bit strange. And "free" makes me a little wary, though it did say outright that I don't have to buy anything. The page also cuts off at a box saying "What your results look like", so I can't tell what comes next.

5. **What does it remind me of?** A small, independent local business, more like my old family dentist than a big chain. The warm tan colour and the old-fashioned serif lettering feel friendly. They name the two owners, Priya and Tom, who'll see me themselves, so it doesn't feel like the shops on the high street that push you towards a sale.

Viewer 2:

1. **What is this?** It's the website for a small hearing clinic called Halden Hearing, in Clifton, Bristol. They offer a free hearing test that takes 90 minutes.

2. **Who is it for?** Someone like me, who's been putting off getting their ears checked. It says most people wait about ten years, and that's me. It also seems to be for people who worry they'll be pushed into buying a hearing aid.

3. **What would I do next?** I'd read the bit about the free test again. Then I'd probably ring the number, because I'd rather talk to a person than fill in a form. If I felt brave, I'd tap the big brown "Book a free hearing test" button. I'd also have a look at the box lower down about "what your results look like", to see what I'm in for.

4. **Does anything look wrong or odd?** Nothing looks wrong. It's clear, and the print is big enough to read. A few things made me stop and think:
   - "No commission" is a bit of jargon. I think it means the audiologists aren't paid for selling me things, but it doesn't say that.
   - 90 minutes is long. I'd want to know why it takes that long.
   - I like that it names the two owners and says they'll see me themselves. That feels more honest than a big chain.
   - The "4 in 10" line about GPs and friends is nice, though I can't check it.
   - It says "free" and "you don't have to buy anything" twice, which makes me wonder a little what the catch is.

5. **What does it remind me of?** A local, family-run business, like my old optician or the independent chemist. It's warm and plain, with no flashing offers. It's very unlike the shouty hearing aid adverts that come through the post.

**Changed after round 1:** zero redrawn without its slash (viewer 1 read it as strange); the lead now says what no commission means ("they earn nothing extra if you buy a hearing aid", viewer 2 called "No commission" jargon); the reassurance line drops the second "free" (viewer 2: "says free twice, which makes me wonder what the catch is").

### Round 2 (after those fixes)
Viewer 3:

1. **What is this?** It's the web page for a hearing clinic called Halden Hearing, in Clifton, Bristol. They offer a free hearing test that takes 90 minutes. They say they don't earn commission.

2. **Who is it for?** People like me who have been putting off a hearing check. It says most people wait about ten years, and that's me. It reads as if it was written for someone nervous about being sold something.

3. **What would I do next?** I'd probably ring the number. I like talking to a person more than filling in a form on a phone. The brown "Book a free hearing test" button is big and easy to press, so I might use that if I felt brave. I'd scroll down first to see what the "What your results look like" box shows. I'd also ask my daughter whether she knows this place.

4. **Does anything look wrong or odd?** Nothing looks broken. The text is large and easy to read, and the phone number appears twice. The odd thing is 90 minutes, which is longer than I expected, and I'd want to know why it takes that long. I'd also check the "no commission" claim. It says Priya Nair and Tom Ashby own the place and earn nothing extra if I buy a hearing aid. That sounds nice, but I'd want to hear it from them. "4 in 10 come because their GP or a friend sent them" is a bit vague. I can't tell if it's checked or just a nice number.

5. **What does it remind you of?** It reminds me of a small family business, like the old local opticians or a village chemist, rather than a big chain. The warm tan colour and the old-fashioned heading letters feel friendly and calm. It's quite different from the pushy "FREE TEST! BOOK NOW!" hearing aid adverts that come through the post.

Viewer 4:

1. **What is this?** It's a website for a hearing clinic called Halden Hearing, in Clifton, Bristol. They offer a free hearing test that takes 90 minutes.

2. **Who is it for?** It's for someone like me, who has put off getting their hearing checked. It says most people wait about ten years, and I've waited about that long. It's also for the family who nag us, like my daughter.

3. **What would I do next?** I'd read the bit about "you do not have to buy anything" again. Then I'd probably ring the number, because I like talking to a person more than tapping a form on my phone. If that felt all right, I might press the brown "Book a free hearing test" button. I'd probably ask my daughter first whether she knows the place.

4. **Does anything look wrong or odd?** Nothing looks wrong, but a few things make me want to check. Ninety minutes is a long time for a "free" test. It says they earn nothing extra if I buy a hearing aid, and I'd want to know how that's true. The "4 in 10 come because their GP or a friend sent them" line is nice, but I can't tell who counted. The page also cuts off at "What your results look like", so I can't see the rest. And I can't see any prices or reviews on this part of the page.

5. **What does it remind you of?** It reminds me of a small local firm, like an independent optician or a family solicitor, not a big chain. The warm tan colour and the old-fashioned serif lettering feel calm and not pushy. The big chains on the high street are the ones that make me nervous about being sold something.

**Changed after round 2:** "by our own records" added to the referral line (both asked who counted).

### Round 3 (shipped first screen)
Viewer 6:

1. **What is this?** It's a hearing clinic's web page. The clinic is called Halden Hearing, in Clifton, Bristol. They offer a free hearing test that takes 90 minutes. They say they take no commission.

2. **Who is it for?** It's for someone like me, who has put off getting their hearing checked. It even says most people wait about ten years. That's me, and it feels a bit like they know it.

3. **What would I do next?** I'd read the little bit under the button first, the "you don't have to buy anything" line. Then I'd probably ring the number. I'd rather talk to a person than fill in a form on my phone. If they sounded decent, I'd book. I'd also ask my daughter if she knows them, since she sent it.

4. **Does anything look wrong or odd?** Not really. The writing is clear and the print is big enough to read. Two things made me pause:
   - 90 minutes is a long time for a "test". I'd want to know what happens in all that time.
   - "They earn nothing extra if you buy a hearing aid" is a bold claim. I'd want to hear it from them on the phone. I'd also want to know how the clinic makes its money if the test is free.

   The "4 in 10 come because their GP or a friend sent them" line is a bit of a puzzle. It's followed by "by our own records", which makes it sound like they're marking their own homework. It doesn't put me off, though.

5. **What does it remind me of?** It reminds me of a small local practice, like an independent optician or a family dentist. It's a world away from the big hearing aid shops that send leaflets and push you to buy. The cream-and-brown colours and the old-fashioned lettering feel calm and trustworthy, a bit like a good bookshop. Having named people, Priya and Tom, helps too. It makes me think I'd see someone real, not just whoever is on shift.

Viewer 7:

1. **What is this?** It's a hearing clinic's web page. The clinic is called Halden Hearing and it's in Clifton, Bristol. They offer a free hearing test that takes 90 minutes.

2. **Who is it for?** Someone like me, who has put off getting their hearing checked. It even says most people wait about ten years, and I have.

3. **What would I do next?** I'd probably ring the number. I'm more of a phone person, and they make that easy. Or I'd press the big brown "Book a free hearing test" button. First I'd want to ask my daughter whether she knows the place. Then I'd ring and ask what to expect on the day.

4. **Does anything look wrong or odd?** Not really. It's calm and it doesn't shout at me. A few things made me raise an eyebrow:
   - "No commission" and "they earn nothing extra if you buy a hearing aid" is a bit of an odd thing to say. It does tell me they won't push me to buy. They also say outright that I don't have to buy anything.
   - The "4 in 10 came because their GP or a friend sent them" line makes me wonder how they know. It says "by our own records," so at least they're telling me where the figure comes from.
   - Ninety minutes is a long time for a "test".
   - I can't see any prices or reviews yet. There may be more further down, but the screen cuts off at "What your results look like."

5. **What does it remind me of?** It feels like a small local opticians or a family-run practice, not a big chain with shouting adverts. The tan colour and the old-fashioned serif lettering feel a bit like a newspaper or a bookshop. Having named people, Priya and Tom, who "will see you themselves" reminds me of the way the old village chemist used to be.

### Hide-the-logo viewer (1440 first screen, name and logo covered)
**1. Which company?**
I don't think it's Specsavers, Boots or Amplifon. My guess is a small independent practice in Clifton, Bristol, with one or two audiologists who own it.

**2. Why I say so**
- It names two people, Priya Nair and Tom Ashby. They say they "will see you themselves" and "own" the business (the name is hidden by the grey box). A big chain wouldn't promise that you'll see the owners.
- It's about one place, "Free hearing tests in Clifton, Bristol". It has a local phone number, not a national one.
- It says "No commission" and "they earn nothing extra if you buy a hearing aid". That's a pointed jab at the way chains pay their staff, so I think they're setting themselves apart from the chains.
- The statistic is "4 in 10 of our new patients… by our own records". That's a small practice counting its own patients.
- The look is warm and plain: a golden-tan background, a serif headline and one big brown button. It doesn't have the polished corporate look of the big brands.

**3. Does anything look like the big chains?**
Yes, a few things:
- A free hearing test, with "You do not have to buy anything".
- A big "Book a free hearing test" button and a phone number at the top.
- A chart showing what your results will look like. That's common to any hearing test.

But the 90-minute test is longer than the quick check I'd expect at a chain, and the personal tone is different. I'd say it's trying to be the friendly alternative to those chains.

One caution: I'm judging only from this screen. I can't tell you whether they're good, so I'd check reviews and that they're properly registered before booking.

## Reading the results
- No viewer in rounds 2 and 3 read any device as an error. Flagged devices (playbook-brand 2a): the slashed zero, which round 1 flagged and which is now gone; the plot symbol, which nobody remarked on; the "Example" chart, below the 390 first screen.
- Every viewer named the category (hearing clinic), the place (Clifton, Bristol), the audience (people who have put off a test) and an action (ring or book). Five of six said they would ring before tapping the button, so the phone number earns its place twice in the first screen.
- Repeated doubts are about the words, not the design: "90 minutes is long, why?" (answered by section 2, below the fold) and "how is no commission true?" (a founders' fact; the page cannot prove it). Viewer 6 read "by our own records" as "marking their own homework"; viewer 7 read it as honest.

## What I did not build
Booking page (the button goes to `/book`), the rest of the site, guidelines, logo kit beyond `mark.svg`, `mark-small.svg`, `favicon.svg` and `favicon-48.png`, photography. `og.png` is rendered from the page's own hero type and chart at 1200x630.

## Fact-sheet gaps for the founders (website-strategy stage 2)
1. The real phone number and street address (the page says only Clifton, Bristol).
2. HCPC registration numbers for Priya and Tom. The hide-the-logo viewer said they would check the clinic is "properly registered"; a registration line beside their names is the strongest proof the page could add.
3. Confirm the five steps and the wax line as written.
4. Written permission to quote patients, so the weakest field can close.
5. The four manufacturers' names, if they want them on the page.
6. Photos of Priya and Tom in the clinic (request: two portraits at 3000px on the long edge, natural light, looking into the frame toward the copy; one in the booth). Stand-in today: the drawn chart and their names in text, never drawn or stock faces.

## What I would test
1. **Phone against button.** Five of six viewers would ring first. Measure calls against bookings for the first month; if calls lead, make the number the larger link in the header at 390 and keep one filled button.
2. **"Why 90 minutes" in the first screen.** Test a short link under the lead ("See what the 90 minutes are for") against none, on scroll depth and bookings.
3. **"No commission" wording:** H1 as is, against "A 90-minute hearing test, with the owners", with five or more real 65-plus Bristol readers (message test, clarity and trust).
4. **The chart:** recognition, not liking. After launch, show the chart card unnamed to category buyers and count who links it to Halden (fame and uniqueness, about one purchase cycle on); the hide-the-logo viewer already called the chart "common to any hearing test", so the ochre field, the type and the plot notation must carry it.
5. **Covered competitor wall:** capture Specsavers, Boots Hearingcare and Amplifon first screens at 390 and 1440, cover the logos, and ask cold viewers to pick Halden.

## Still short of the exemplar (Stripe, Linear for craft; family.co for warmth)
1. No real photography; the named owners have no faces yet.
2. The chart is the clinic's own output but a generic subject; the distinctiveness rests on the ochre field, Literata and the plot notation.
3. The section after the hero is calm and correct but has no second visual moment; a full build would carry the plot into the steps and the footer at larger scale.

## Files
- `strategy.md`, `home.html` (self-contained, 104 KB, light and dark), `state-sheet.html`
- `mark.svg`, `mark-small.svg`, `favicon.svg`, `favicon-48.png`, `og.png`
- `shots/` (390, 768, 1024, 1440 light and dark, full page), `shots/first-screen/`, `shots/state-sheet/`, `shots/hide-the-logo-1440.png`
- `five-second/` (raw viewer answers), `src/` (page source, `build.py`, `unslash.py`)
