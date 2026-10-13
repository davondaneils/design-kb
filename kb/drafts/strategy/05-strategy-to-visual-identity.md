# 05 Strategy to visual identity

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
| Playful | Display face with character for heads only; body stays plain (O) | Higher chroma, more hues, each with a role (O; design-color) | Rounded, a character or mascot is a strong asset type (E; characters show low competitive intensity [E2]) | Custom illustration with one style (O; design-graphic 04) | Broken grid in hero only (O) | Springier only where `prefers-reduced-motion` removes it (FOUNDATIONS) |

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
| A famous-but-not-unique asset (Romaniuk's "Avoid" quadrant) | Never use it alone | It cues the category, not you; "such elements will trigger competitors to copy" [E1] |

Breaking more than one or two codes at once risks the buyer not recognizing the category at all (opinion).

### Rebrand: the asset audit
1. List every current asset: mark, symbol, color, face, shape, character, sound, slogan, image style.
2. Rate each on **fame** (share of category buyers who link it to the brand) and **uniqueness** (share of those who link it only to this brand). With a survey: Romaniuk's method, 50 percent thresholds [E2]. Without one (opinion, a stand-in): show each asset with the name removed to 5 or more category buyers or fresh-context viewers and ask "which brand is this?"; record hits and wrong brands.
3. Place each on the grid and act:

| Quadrant | Fame, uniqueness | Action |
|---|---|---|
| Use or lose | high, high | Keep. Evolve detail only. Losing it costs recognition (Tropicana's orange with a straw [E6][E7]) |
| Invest | low, high | Keep and use more, consistently |
| Avoid solo use | high, low | Use only with the name; do not build on it |
| Ignore or test | low, low | Free to replace |

4. **Simplify only after fame.** Mastercard dropped its name from the symbol only "with more than 80 percent of people spontaneously recognizing" it [E8] (opinion: use 80 percent recognition as the bar before removing a name).
5. **Accidents can be assets.** Monzo's coral began as "a happy accident" and became the brand's main code [E9][E10]. Audit what customers already recognize, not what the founders intended.

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

## Ceiling: expert moves
1. **Give the identity and the words different jobs.** Words differentiate for the in-market comparer; the identity makes the brand recognizable for the out-of-market majority. Briefs that ask a logo to "say innovative and trustworthy" are asking it to do the copy's job, and the evidence says the copy wins anyway [E4] (opinion on the framing).
2. **Lead with shape, then let color ride on it.** Pick a mark or container shape that can run alone, then a color in fixed proportion; never a palette-led identity. Shapes beat colors on fame and uniqueness in every industry studied [E2].
3. **Measure, then rebrand.** Run the asset audit before the first sketch; anything in "Use or lose" is a constraint, not an option. Tropicana's redesign removed its most recognized element and was reversed within weeks [E6].
4. **Test new assets by recognition, not liking.** Focus groups on liking predict redesign outcomes worse than distinctive asset measures [E2 citing Caruso et al. 2025]. Show the asset without the name; count correct brand links.
5. **Break one expressive code hard, keep the semantic codes.** A bank that looks unlike a bank loses trust; a bank with a coral card in a sea of navy is remembered (Monzo [E9][E10]; opinion as a rule).
6. **The louder the creative, the stronger the branding must be.** "The more attention-grabbing the creative, the harder the branding has to work to succeed" [E3]. A wild hero still carries the primary asset in the first screen.
7. **Shape cues travel; color cues do not.** Round and angular cues hold across 25 languages and 10 writing systems [E5]; color meanings vary by culture (design-color psychology-brand). For a global brand, put the attribute in the shape (E for the cue, opinion for the brand rule).
8. **Name the evidence level out loud.** In the hand-over and to clients: "rounded forms read softer (lab evidence, weak effect); the coral is our judgment of ownability; the serif is category convention." Clients trust designers who separate taste from evidence (design-color psychology-brand).

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
Asset audit (stand-in method, 8 local category buyers shown each asset without the name; numbers are this worked example's, not research):
| Asset | Named correctly | Named another brand | Quadrant (stand-in) | Action |
|---|---|---|---|---|
| Lighthouse symbol | 6 of 8 | 0 | Use or lose | Keep; redraw for 16px |
| Navy and gold | 2 of 8 | 4 (two banks) | Avoid solo use | Keep navy only with the symbol |
| Slogan "Your neighbor in banking" | 1 of 8 | 3 | Ignore or test | Replace |
| Serif wordmark | 3 of 8 | 1 | Invest | Keep the genre, redraw |
Result: the lighthouse is redrawn, not replaced; the new expressive break is photography of members in their real shops instead of stock families; checkout and account screens stay conventional (semantic code kept).

## Where this domain is usually wrong
1. **"Our color is our brand."** Color is the weakest and most contested distinctive asset type on average [E2]. Correction: lead with a shape; let color ride on it.
2. **"The logo should show what we do."** Literal marks date and look like competitors (design-graphic 01); the identity's job is recognition [E1].
3. **"Test the new identity with a focus group."** Liking-based redesigns are linked to worse outcomes than asset-based ones [E2 citing Caruso et al. 2025]. Correction: test recognition with the name hidden.
4. **"A rebrand should modernize everything."** Tropicana [E6]. Correction: asset audit first; keep "Use or lose".
5. **"Blue means trust, green means health."** Category convention, not cause (design-color psychology-brand, Elliot 2015).
6. **"60:40 is the rule."** It is an IPA databank average; B2B came out at 46:54 and it shifts by category and brand size [E13][E14] (kb/references/strategy-brand.md).

## Hand-offs
- design-typography 02 (faces, pairing, licensing), 07 (display), 08 (high-contrast faces).
- design-color psychology-brand (hue choice, category wheel), palette-building (ramps), ui-tokens-themes (roles, both themes). Brand color versus contrast: the color changes role, never the floor.
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
- Binet, L. and Field, P., chart titles via Tom Roach's compilation, https://thetomroach.com/wp-content/uploads/2020/06/the_greatest_hits_of_binet_and_field.pdf (accessed 2026-10-13); The Drum on the B2B study, https://www.thedrum.com/opinion/exclusive-look-binet-and-field-s-new-b2b-marketing-research (accessed 2026-10-13); IPA, https://ipa.co.uk/knowledge/effectiveness-research-analysis/les-binet-peter-field (accessed 2026-10-13).
