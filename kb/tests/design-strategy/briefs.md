# design-strategy test brief (fresh, written 2026-10-13 before any build)

Never used in an earlier test. All names and facts are fictional.

## Brief: Halden Hearing, an independent hearing clinic in Bristol
Two audiologists, Priya Nair and Tom Ashby, left a national high-street chain in 2024 and opened Halden Hearing in Clifton, Bristol. They have one clinic room, a soundproof booth and a small shop front.

What they told us:
- "Most people wait about ten years between noticing hearing loss and doing anything about it. When they finally come in, the chains sell them a device in one appointment."
- Their appointments are 90 minutes. They do not earn commission. They sell hearing aids from four manufacturers and also see people who already bought elsewhere (fittings, adjustments, earwax removal).
- Prices: hearing test free with no obligation; earwax removal 65 GBP; hearing aids from 1,495 to 3,995 GBP a pair, including four years of aftercare.
- Their current site is a template with a stock photo of an older couple laughing on a beach. 40 percent of new patients come from GP or friend referrals; most of the rest search "hearing test Bristol".
- Competitors in Bristol: Specsavers, Boots Hearingcare, Amplifon, and two other independents.
- They want to look "trustworthy, not clinical, not like a chain".

## Deliverables
1. A strategy and brand brief: audience, positioning, the one true fact the brand is built on, voice, and the visual identity decisions (type, color, imagery, a mark direction) with the reason for each.
2. The homepage first screen and the section after it, as one self-contained HTML file at 390 and 1440 wide, light and dark, built from those decisions.
3. A short hand-over: what you decided, what you did not build, what you would test.

## Rubric (critic, blind to which version is which)
1. **Strategy rigor**: is the positioning specific, true and defensible against the five named competitors (would it still make sense with Halden's name swapped for Specsavers)? Is the audience a real person with a real moment, not a demographic? Does every claim trace to a fact in the brief?
2. **Strategy to design**: can each visual decision (type, color, imagery, mark, layout) be traced to a strategic reason? Hide the logo: could this page belong to a competitor?
3. **Voice**: does the copy sound like a specific clinic, follow the voice it defined, and stay readable for an older audience?
4. **Screen fundamentals**: `node tools/lint.mjs` result and the design fundamentals gate (contrast, hierarchy, spacing, readable sizes for an older audience).
5. **Expert moves**: what would a Pentagram or COLLINS strategist, and an April Dunford, learn or object to?
Scores 1 to 10 per area; any gate fail caps the area at 5.
