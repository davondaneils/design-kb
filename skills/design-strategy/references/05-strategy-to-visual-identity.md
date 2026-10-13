# 05 Strategy to visual identity

> design-strategy reference. Loaded by design-director after design-foundations and before the playbook; read the file the SKILL.md map names. Builds on website-strategy and crafting-voice-identity (Davon's skills) and never restates them.

Research notes: `kb/research/strategy/05-strategy-to-visual-identity.md` (E-numbers). Opinion is marked (opinion). Evidence levels in every table: **E** evidence (peer reviewed or measured), **C** convention (what a category or culture expects), **O** opinion (studio judgment).

website-strategy stage 5 says visual direction "is strategy, not aesthetics" and gives it in prose. This file makes it traceable: every visual decision is a row with the attribute it serves, the reason, how strong the evidence is, and the skill that builds it. It also gives the identity its own job, separate from positioning: to be **distinctive**, so the brand is recognized and remembered by people who are not buying today (02, 03).

## Floor: fundamentals (non-negotiable)
1. **Every identity decision is a row**: attribute, decision, reason, evidence level (E, C or O), owner skill. No row, no decision. [lint: `brief_lint.mjs` checks every row has all five cells and a valid level]
2. **Folklore is never evidence.** Hue-emotion laws ("blue means trust") are C at best (design-color psychology-brand). [judged; `brief_lint.mjs` warns on "means trust" style phrases]
3. **At least one distinctive asset is not a color.** Color alone is the weakest asset type: 12 percent fame and 39 percent uniqueness on average, against 40 and 71 for shapes [E2]. [lint: `brief_lint.mjs` checks the primary asset row is not color]
4. **Brand never overrides the floor.** A brand color that fails 4.5:1 as text changes role (fill, accent, illustration), and every pairing is measured in both themes (FOUNDATIONS Color roles; design-color). "Bold" or "loud" is scale, color as a field and crop, never a contrast fail (design-playbook-landing 3b). [lint on the built page]
5. **Decisions name FOUNDATIONS tokens, not raw values**: `--color-brand` and the role it maps to, `--font-serif` or `--font-sans`, `--radius-*`, `--motion-enter`, `--space-section`. [judged]
6. **A rebrand starts with an asset audit** (fame and uniqueness, or the stand-in below) before any sketch. [judged]
7. **The concept sentence goes to design-art-direction** with a drawable noun and a reject test; this skill supplies the fact, art direction owns the sentence's method (design-art-direction 01). [lint: field present]

## Principles
1. **Distinctive, not descriptive.** The identity's job is to be recognized as this brand, not to explain the business (Rand via design-graphic 01). Buyers see little difference between brands [C11 in 03]; they do see and remember distinctive assets [E1].
2. **Shape first, color second.** Shape-based assets (logos, packaging forms) are the strongest asset type across 21 categories; color is the weakest and the most crowded [E2].
3. **Words beat shapes when they disagree.** Logo shape shifts attribute judgments (rounded reads soft and comfortable, angular reads hard and durable), but not when the headline states a different attribute [E4]. The identity supports the message; it cannot carry a message the copy contradicts.
4. **Fame is earned, uniqueness is designed.** "All new assets start with low uniqueness and fame" [E1]. Design for uniqueness now; consistency over years builds fame (Binet and Field's case for long-term brand work [E13]).
5. **Keep the codes that say what you are; break one that says who you are.** (opinion, developed below)

## Decision rules
### The attribute to identity table
Use the rows that match the brief's attributes (from positioning and voice). Each cell names its evidence level and owner. Values are starting points; the owner skill sets the final value.

| Attribute | Type (design-typography 02) | Color (design-color) | Shape and mark (design-graphic 01) | Imagery (design-art-direction) | Layout (design-layout) | Motion (design-motion 01) |
|---|---|---|---|---|---|---|
| Precise, engineered | Grotesque or neo-grotesque with tabular figures; mono for data (C) | Low chroma neutrals, one accent for state (O) | Angular, geometric; straight terminals; reads hard and durable (E weak, [E4]) | The product's own output, real data (O; art direction 01) | Strict grid, visible alignment, `--radius-sm` (O) | Short, `--ease-standard`, no overshoot (O) |
| Warm, human | Humanist sans or a soft serif, open apertures (C; persona perceived [D5]) | Warm neutrals; a warm brand hue as a field (O) | Rounded forms and terminals; reads soft and comfortable (E weak, [E4][E5]) | Candid people or hands at work, never stock (O; website-strategy stage 5) | Looser rhythm, `--radius-lg` cards (O) | `--motion-enter` reveals, gentle, no bounce in UI (O) |
| Calm, premium | Larger display contrast, fewer sizes; high-contrast serif only at display sizes (C; design-typography 08) | Low chroma, deep lightness (O; design-color) | Simple, one quirk only (O; design-graphic 01) | Fewer, larger images; one treatment (O) | More space: `--space-section` at the top of its range (O) | Slower and rarer, `--duration-slow` for one reveal (O; FOUNDATIONS reveal ceiling) |
| Challenger, against the category | One face the category does not use (O) | Own an empty sector of the category hue wheel (O; design-color rule 2) | One shape no competitor has; test on the wall (O) | Break the category's image code (C to break; Monzo [E10]) | Keep the category's layout grammar for trust (O) | As brand, never louder than the floor allows (FOUNDATIONS) |
| Trusted, regulated, established | Serif or sober sans, conservative sizes (C) | Conform to the category hue if trust is the job (C; design-color rule 2) | Keep existing famous assets (E; [E6][E8]) | Real people, real places, consent (C) | Conventional, proof near claims (C; design-conversion 02) | Minimal (O) |
| Playful | Display face with character for heads only; body stays plain (O) | Higher chroma, more hues, each with a role (O; design-color) | Rounded; a character or mascot, the least contested asset type (E for low competitive intensity [E2]; O for the choice) | Custom illustration with one style (O; design-graphic 04) | Broken grid in hero only (O) | Springier only where `prefers-reduced-motion` removes it (FOUNDATIONS) |

### Pick the distinctive assets
1. **One primary asset that is a shape**: the mark, a container shape, a cropping device, a character. It must survive 16px and one color (design-graphic 01).
2. **One or two supporting assets**: a color used in a fixed proportion, a face, an image treatment (Spotify's duotone [E11]).
3. **Never color alone.** "Reliance on color alone as a Distinctive Asset, therefore, carries substantial risk" [E2]. Pair it with the shape (Monzo's coral is a coral card, an object [E9]).
4. **Use them together, everywhere, for years** (opinion grounded in [E1]: fame comes from exposure). The small surfaces count: favicon, OG image, empty states (design-art-direction expert move 11).

### Category codes: keep or break
List the codes the category shares (the competitor wall shows them): hue, typeface genre, image subject, layout grammar, tone. For each, decide:

| Code type | Default | Why |
|---|---|---|
| **Semantic codes** (what it is: a bank looks safe to put money in; a menu looks like a menu; a checkout looks like a checkout) | Keep | They tell the in-market buyer they are in the right place (C; design-color rule 2 "conform when trust and familiarity are the job") |
| **Expressive codes** (who it is: the shared stock photography, the shared blue, the shared geometric sans) | Break exactly one, hard | That break becomes the distinctive asset. Monzo kept banking's UI conventions and broke its color and photography: "The banking market is flooded with generic people photography" [E10] (opinion on the rule; Monzo is the shipped example) |
| A famous-but-not-unique asset (the grid's "Avoid solo use" quadrant [E2h]) | Never use it alone | It cues the category, not you; "such elements will trigger competitors to copy" [E1b] |

Breaking more than one or two codes at once risks the buyer not recognizing the category at all (opinion). The semantic and expressive split is our working label (opinion); the sourced lens below adds time.

### Code states: residual, dominant, emergent
Commercial semiotics sorts codes by when they belong. Raymond Williams: the residual "has been effectively formed in the past, but it is still active in the cultural process"; the emergent is "new meanings and values, new practices, new relationships and kinds of relationship ... continually being created" [E23]. Malcolm Evans brought the "Residual, Dominant and Emergent mapping tool" into brand semiotics [E24]; Lawes (2002) is the standard method paper [E25].

| State | Where you find it | Use (opinion) |
|---|---|---|
| **Dominant** | What the competitor wall shares now | Keep the semantic ones; the expressive one you break comes from here |
| **Residual** | Codes the category used to share and still half-uses, now read as dated | Avoid, unless the brand has real heritage and makes it the one true fact |
| **Emergent** | Codes arriving from adjacent categories or the wider culture | The best source for the one expressive break: fresh without reading as an error |

Method (opinion): sort every shared code on the wall into the three columns, then look at two adjacent categories for emergent codes. A code arriving in several unrelated categories at once is a cultural shift, not a fad; a code in one competitor only is a competitor's asset, not a code.

### Brand behaviors: what the brand does
COLLINS put it this way: brand problems are now "more behavior-based than communications-based" [E26]. A position is believed when the brand does something its competitors would not, in the product, the service or the policy. Write one to three behaviors in the brief (opinion on the method; "central organizing idea" is practice vocabulary with no single primary source):
1. Each behavior proves the onlyness or the one true fact.
2. Test: could a competitor copy it next week at no cost? Then it proves nothing.
3. The best behaviors become assets: Ember and Oak logs every batch as a curve (behavior), and the curve becomes the image system (asset).
The identity table then serves the behavior, not the other way round.

### Across a portfolio
The architecture decision (branded house, subbrand, endorsed, house of brands) lives in 01. Here: carry the primary asset across every product. Products from visually cohesive portfolios were matched to their portfolio by 79 versus 35 percent of respondents and had 17 percent higher correct brand recall; "the best way for a brand portfolio to stand out on shelf, is to design products that clearly fit in with the brand's visual identity" [E22]. Cohesion is countable without a survey: for each asset, the share of products that use it, averaged across assets [E22]. Variant cues (flavor, tier) go on secondary assets, never on the primary shape (opinion).

### Rebrand: the asset audit
This is the distinctive asset audit. website-strategy stage 2 also has an "asset audit": a quarry of facts and proof for copy. Run that one for the one true fact; run this one before any sketch.

1. List every current asset: mark, symbol, color, face, shape, character, sound, slogan, image style.
2. Rate each on **fame** (share of category buyers who link it to the brand) and **uniqueness** (of all the brand links the asset prompts, the share that go to this brand). With a survey: Romaniuk's method, 50 percent thresholds [E2]. Without one (opinion, a stand-in): show each asset with the name removed to 8 or more category buyers and ask "which brand or brands does this make you think of?"; allow more than one answer and record every brand named. Fame = buyers naming us / buyers asked; uniqueness = mentions of us / all brand mentions. Fame lives in buyers' memories, so a fresh-context subagent cannot stand in here; it can only say whether an asset looks like a competitor's (06). Eight people find a direction, not a share.
3. Place each on the grid and act (quadrant names from Romaniuk 2018, as cited in the 2026 benchmark [E2h]):

| Quadrant | Fame, uniqueness | Action |
|---|---|---|
| Use or lose | high, high | Keep. Evolve detail only. Losing it costs recognition (Tropicana's orange with a straw [E6]) |
| Investment potential | low, high | Keep and use more, consistently |
| Avoid solo use | high, low | Use only with the name; do not build on it |
| Ignore or test | low, low | Free to replace |

4. **Simplify only after fame.** Mastercard dropped its name from the symbol only "with more than 80 percent of people spontaneously recognizing" it [E8] (opinion: use 80 percent recognition as the bar before removing a name).
5. **Accidents can be assets.** Monzo's coral began as "a happy accident" and became the brand's main code [E9][E10]. Audit what customers already recognize, not what the founders intended.

### After launch: tracking fame and uniqueness
The benchmark is "a cross-sectional snapshot rather than a longitudinal perspective" [E2i], so nobody has published how fast assets move; the cadence below is opinion built on the in-market arithmetic.
1. **Baseline at launch** among category buyers: fame near zero is expected; record misattribution (06 check 8) as the first uniqueness signal.
2. **Re-measure after about one purchase cycle**, held between 3 and 12 months (a week is too soon for a weekly category; a car buyer's cycle is too long to wait), then yearly, and always before a redesign. Compute the cycle from the category's interpurchase time: with two years between purchases, "50% are in the market over the course of a (whole) year, or around 13% in any quarter" [E21]. Fame cannot grow faster than buyers meet the asset.
3. **Read the movement.** Investment potential moves to Use or lose when fame passes 50 percent with uniqueness held. Uniqueness falling while fame holds means a competitor is encroaching: act on it first (Romaniuk's book sets up "a Distinctive Asset management system to provide an early warning system" [E19b]).
4. **No fame gain after a cycle**: check co-presentation before blaming the asset. Building fame is "widespread co-presentation of the asset with the brand name" [E17]; an asset shown without the name, or the name without the asset, teaches nothing.
5. **Portfolio**: recount cohesion at every product launch (Across a portfolio, above) [E22].

## Numbers
| Item | Value |
|---|---|
| Grid thresholds | 50 percent fame, 50 percent uniqueness [E2] |
| Average asset | 26 percent fame, 54 percent uniqueness [E2] |
| Shape assets | 40 percent fame, 71 percent uniqueness [E2] |
| Color assets | 12 percent fame, 39 percent uniqueness [E2] |
| Strong asset example | GEICO Gecko, 87 percent fame, 98 percent uniqueness (Romaniuk 2018, via [E2]) |
| Remove the name from a symbol | after about 80 percent spontaneous recognition (Mastercard [E8]; opinion as a rule) |
| Distinctive assets | 1 primary shape plus 1 or 2 supporting (opinion) |
| Category codes broken | 1, at most 2 (opinion) |
| Brand to activation budget context | 60:40 databank average; B2B 46:54 [E13][E14] |
| Benchmark sample | 12,249 category buyers, 1,162 assets, 128 brands [E2b] |
| Competitive intensity (HHI, 1 = owned) | characters 0.69, logos 0.61, fonts 0.60, color 0.31 [E2c] |
| Pack redesigns that used research (Caruso) | 86 percent of 227, no evidence of more overall success [E16] |
| Portfolio cohesion effect | 79 vs 35 percent matched to portfolio; 17 percent higher recall [E22] |
| Re-measure fame and uniqueness | about one purchase cycle after launch (3 to 12 months), then yearly, and before any redesign (opinion) |

## Ceiling: expert moves
1. **Give the identity and the words different jobs.** Words differentiate for the in-market comparer; the identity makes the brand recognizable for the out-of-market majority. Briefs that ask a logo to "say innovative and trustworthy" are asking it to do the copy's job, and the evidence says the copy wins anyway [E4] (opinion on the framing).
2. **Lead with shape, then let color ride on it.** Pick a mark or container shape that can run alone, then a color in fixed proportion; never a palette-led identity. Shape-based assets "consistently perform best" across the 21 categories, color weakest [E2]. The exception to know: "narrative-driven assets perform relatively better in service industries" (same study, abstract), so a service brand tests a character or story asset before leaning on a second color (opinion).
3. **Measure, then rebrand.** Run the asset audit before the first sketch; anything in "Use or lose" is a constraint, not an option. Tropicana's redesign removed its most recognized element and was reversed within weeks [E6].
4. **Test assets by recognition, not liking.** Of 227 pack redesigns, 86 percent used research, with no evidence that those that did had more overall success [E16]; focus groups and brand attitude measures are linked to worse results: that approach "has been associated with less successful outcomes", while distinctive asset research is "linked to more successful outcomes" [E2 citing Caruso et al. 2025]. An existing asset: hide the name, count correct and competitor links (the audit above). A brand-new asset has no fame yet, so a recognition count before launch is always near zero; test misattribution and learnability instead (06, check 8) (opinion on the method).
5. **Break one expressive code hard, keep the semantic codes.** A bank that looks unlike a bank loses trust; a bank with a coral card in a sea of navy is remembered (Monzo [E9][E10]; opinion as a rule).
6. **The louder the creative, the stronger the branding must be.** "The more attention-grabbing the creative, the harder the branding has to work to succeed" [E3]. A wild hero still carries the primary asset in the first screen.
7. **Shape cues travel further than color cues.** The bouba/kiki match of sounds to round and spiky shapes held across 25 languages and 10 writing systems [E5]; color meanings vary by culture (design-color psychology-brand). For a global brand, put the attribute in the shape (E for the sound-shape match, our inference for brand attributes, opinion for the rule).
8. **Name the evidence level out loud.** In the hand-over and to clients: "rounded forms read softer (lab evidence, weak effect); the coral is our judgment of ownability; the serif is category convention." Clients trust designers who separate taste from evidence (design-color psychology-brand).
9. **Pick a contender, not a meaning.** Choosing an asset because it "means" the attribute (green for sustainable, an upward slant for growth) leads every brand drawing on the same source to the same asset; "It's not about picking a winner, it's about picking a contender" [E17], and suggestive assets score lower fame and uniqueness than non-suggestive ones [E18]. Use the attribute table to choose among unique contenders, never to pick the asset (our reconciliation, opinion).
10. **Prove the position with a behavior, then draw the behavior.** The strongest identities picture something the brand does that a competitor would not (Ember and Oak's roast log drawn as its image system) [E26] (opinion on the method).
11. **Take the one break from an emergent code.** A residual code reads dated, a dominant one reads generic; an emergent code from an adjacent category reads new without reading as an error [E23][E24] (opinion on the rule).
12. **Show what the true fact buys.** When the one true fact is a quantity (90 minutes, four years of aftercare, 12 people per class), the page shows what that quantity contains, step by step, before it repeats the number. A number said four times and never explained reads as a slogan; the Halden baseline's "what happens in your 90 minutes" timeline beat the skilled page on exactly this (`kb/tests/design-strategy.md`) (opinion on the rule).
13. **The weakest field still gets the strongest fact.** When proof is the brief's weakest field (no reviews yet), the page uses the strongest verifiable fact available instead of leaving trust to the identity: a referral share, a named practitioner, a guarantee with its terms. Never invent the missing proof (opinion).
14. **After launch, watch uniqueness first.** Fame grows slowly with exposure; a fall in uniqueness is the early sign that a competitor has moved onto your asset [E19b] (opinion on the priority).

## Do and don't
| Do | Don't |
|---|---|
| Row: "Warm, not cute / humanist sans, open apertures / persona fit / C / design-typography 02" | "Font: something friendly" |
| Primary asset: the container shape; supporting: coral at a fixed share | "Our brand is orange" |
| Asset audit before the rebrand sketch | Redesign first, discover the lost asset after launch |
| "Test: 5 viewers, logo hidden, 4 named us" | "The team loved it" |
| Keep the checkout looking like a checkout | Break every category code at once |

## Worked examples
### 1. New brand: a precise B2B scheduling tool (one page)
Attributes from positioning and voice: precise, not cold; calm, not slow.
| Attribute | Decision | Reason | Level | Owner |
|---|---|---|---|---|
| Precise, not cold | Neo-grotesque, tabular figures; `--font-sans` with a mono for times | Category convention for tools; figures align in schedules | C | design-typography 02 |
| Precise, not cold | Mark: an angular block with one rounded corner | Angular reads durable; the one round corner is the "not cold" | E weak [E4] plus O | design-graphic 01 |
| Calm, not slow | Low chroma neutrals; one teal accent owned against three blue competitors | Ownable sector of the hue wheel | O | design-color psychology-brand |
| Calm, not slow | `--motion-enter` on panels, no motion on keyboard actions | Fast feels calm in tools | O | design-motion 01 |
| Distinctive asset | Primary: the block shape used as a time-slot container in UI and ads; supporting: teal at about 10 percent of any surface | Shape strongest asset type [E2] | E plus O | design-graphic 01, design-art-direction |
Codes kept: grid calendar, sans type. Code broken: every competitor's hero shows smiling stock teams; this one shows a real week of slots from product data.

### 2. Rebrand: a 40-year-old regional credit union (full)
Asset audit (stand-in method, 8 local category buyers shown each asset without the name, more than one brand allowed; numbers are this worked example's, not research):
| Asset | Named us | Other brand mentions | Fame, uniqueness | Quadrant (stand-in) | Action |
|---|---|---|---|---|---|
| Lighthouse symbol | 6 of 8 | 0 | 75, 100 | Use or lose | Keep; redraw for 16px |
| Navy and gold | 5 of 8 | 7 (two banks) | 62.5, 42 | Avoid solo use | Keep navy only with the symbol |
| Slogan "Your neighbor in banking" | 1 of 8 | 3 | 12.5, 25 | Ignore or test | Replace |
| Serif wordmark | 3 of 8 | 1 | 37.5, 75 | Investment potential | Keep the genre, redraw |
Result: the lighthouse is redrawn, not replaced; the new expressive break is photography of members in their real shops instead of stock families; checkout and account screens stay conventional (semantic code kept).

## Where this domain is usually wrong
1. **"Our color is our brand."** Color is the weakest and most contested distinctive asset type on average [E2]. Correction: lead with a shape; let color ride on it.
2. **"The logo should show what we do."** Literal marks date and look like competitors (design-graphic 01); the identity's job is recognition [E1].
3. **"Test the new identity with a focus group."** Liking-based redesigns are linked to worse outcomes than asset-based ones [E2 citing Caruso et al. 2025]. Correction: test recognition with the name hidden.
4. **"A rebrand should modernize everything."** Tropicana [E6]. Correction: asset audit first; keep "Use or lose".
5. **"Blue means trust, green means health."** Category convention, not cause (design-color psychology-brand, Elliot 2015).
6. **"60:40 is the rule."** It is an IPA databank average; B2B came out at 46:54 and it shifts by category and brand size [E13][E14] (kb/references/strategy-brand.md).
7. **"Tropicana lost 20 percent, according to Nielsen."** The figures are Information Resources Inc. (IRI) data reported by Ad Age: unit sales down 20 percent and dollar sales down 19 percent, about $33 million, between January 1 and February 22, 2009 [E7]. The lesson stands; cite IRI.
8. **"Pick the asset that says what we are."** Meaning-led selection reduces uniqueness, because competitors read the same meanings [E17][E18]. Correction: select for uniqueness against the wall; build meaning by co-presentation.

## Hand-offs
- design-typography 02 (faces, pairing, licensing), 07 (display), 08 (high-contrast faces).
- design-color psychology-brand (hue choice, category wheel), palette-building (ramps), ui-tokens-themes (roles, both themes). Brand color versus contrast: the color changes role, never the floor. The hex values website-strategy stage 5 asks for go into `--color-brand` (FOUNDATIONS token schema); decisions here name the token and its role.
- design-graphic 01 (mark types, competitor wall, stress tests), 02 (icons), 04 (illustration).
- design-art-direction 01 (concept sentence, motifs, reject test, one treatment).
- design-layout (grid, density, `--space-section`), design-motion 01 (purpose and personality; reduced motion always).
- design-playbook-brand 2a: any break that could read as an error passes the cold-viewer test.
- Conflict: "challenger" identity versus semantic codes in checkout and forms. Semantic codes win inside task flows (design-conversion, design-ux); the break lives in the hero, imagery and small surfaces.

## Sources
- Ehrenberg-Bass Institute (Romaniuk, J.), "Brands of Distinction", https://marketingscience.info/brands-of-distinction (accessed 2026-10-13).
- "Shape-based assets are strongest: benchmarking distinctive brand asset performance across industries", International Journal of Advertising (2026), https://www.tandfonline.com/doi/full/10.1080/02650487.2026.2637295 (accessed 2026-10-13).
- Romaniuk, J., "Brands need distinctive assets" (WARC Admap), http://www.jenniromaniuk.com/blog/2018/5/29/brands-need-distinctive-assets (accessed 2026-10-13).
- Jiang, Y., Gorn, G. J., Galli, M., Chattopadhyay, A. (2016), "Does Your Company Have the Right Logo?", Journal of Consumer Research 42(5), https://static.amitavac.com/2016/02/Jiang-Gorn-Galli-and-Chattopadhyay_2016_JCR.pdf (accessed 2026-10-13).
- Ćwiek, A. et al. (2022), "The bouba/kiki effect is robust across cultures and writing systems", Phil. Trans. R. Soc. B 377(1841), https://royalsocietypublishing.org/rstb/article/377/1841/20200390/108730/The-bouba-kiki-effect-is-robust-across-cultures (accessed 2026-10-13).
- Elliott, S., "Tropicana Discovers Some Buyers Are Passionate About Packaging", New York Times, 2009-02-22, https://www.nytimes.com/2009/02/23/business/media/23adcol.html (accessed 2026-10-13).
- Mastercard press release, 2019-01-07, https://www.mastercard.com/us/en/news-and-trends/press/2019/january/mastercard-evolves-its-brand-mark-by-dropping-its-name.html (accessed 2026-10-13).
- WIRED, "The inside story of Monzo's fluky bright coral bank cards", https://www.wired.com/story/monzo-card-design (accessed 2026-10-13); Monzo, "We've had a little makeover", https://monzo.com/blog/weve-had-a-little-makeover (accessed 2026-10-13).
- Design Week, Spotify brand refresh, https://www.designweek.co.uk/spotify-undergoes-colourful-brand-refresh/ (accessed 2026-10-09, art direction research).
- Phua, P., Bali, L., Anesbury, Z., Sharp, B. (2026), authors of the benchmark above, https://researchers.adelaide.edu.au/profile/peilin.phua (accessed 2026-10-13).
- Caruso, W., Romaniuk, J., Page, B., Anesbury, Z. W., Williams, J. (2025), "The role of market research in pack redesign performance", International Journal of Market Research 67(1), https://journals.sagepub.com/doi/10.1177/14707853241296656 (accessed 2026-10-13).
- Romaniuk, J. (2018), Building Distinctive Brand Assets, contents, https://www.gbv.de/dms/zbw/1019529245.pdf; Romaniuk, J., "Leaning on meaning could undermine your distinctive assets", Marketing Week, 2025-09-09, https://www.marketingweek.com/jenni-romaniuk-meaning-distinctive-assets/ (accessed 2026-10-13).
- Bali, L., Anesbury, Z., Phua, P., Sharp, B. (2024), International Journal of Market Research 66(5), https://journals.sagepub.com/doi/abs/10.1177/14707853241251954 (accessed 2026-10-13).
- Ward, E., Trinh, G., Beal, V., Dawes, J., Romaniuk, J. (2025), "Standing out while fitting in", International Journal of Market Research, https://journals.sagepub.com/doi/10.1177/14707853241291443 (accessed 2026-10-13).
- Dawes, J. (2021), "Advertising effectiveness and the 95-5 rule", https://marketingscience.info/news-and-insights/advertising-effectiveness-and-the-95-5-rule-most-b2b-buyers-are-not-in-the-market-right-now (accessed 2026-10-13).
- BusinessWeek (Bloomberg), "Tropicana Fiasco From Arnell Is Gift That Keeps Giving", 2009-04-02, relaying Ad Age and IRI, https://www.bloomberg.com/news/articles/2009-04-02/tropicana-fiasco-from-arnell-is-gift-that-keeps-giving (accessed 2026-10-13).
- Williams, R. (1977), Marxism and Literature, "Dominant, Residual, and Emergent", https://analepsis.org/wp-content/uploads/2013/01/wmsdre.pdf; Semiovox, "Making Sense" (Malcolm Evans), https://www.semiovox.com/articles/2022/12/20/malcolm-evans; Lawes, R. (2002), "Demystifying semiotics", International Journal of Market Research 44(3), cited at https://lawes-consulting.co.uk/media (accessed 2026-10-13).
- The Brand Identity, interview with Brian Collins, 2016-10-31, https://the-brandidentity.com/interviews/collins (accessed 2026-10-13).
- Binet, L. and Field, P., chart titles via Tom Roach's compilation, https://thetomroach.com/wp-content/uploads/2020/06/the_greatest_hits_of_binet_and_field.pdf (accessed 2026-10-13); The Drum on the B2B study, https://www.thedrum.com/opinion/exclusive-look-binet-and-field-s-new-b2b-marketing-research (accessed 2026-10-13); IPA, https://ipa.co.uk/knowledge/effectiveness-research-analysis/les-binet-peter-field (accessed 2026-10-13).
