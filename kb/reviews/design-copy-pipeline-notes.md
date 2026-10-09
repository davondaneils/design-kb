# Pipeline notes from the design-copy run

## Suggested agent improvements
1. **researcher:** shared WebSearch budget (200 per turn across all parallel agents) ran out mid-run. Give each domain worker a search quota (about 15 to 20) and tell it to spend WebFetch on known canonical URLs first; searching is the scarce resource, fetching is not.
2. **researcher:** add a status column convention to the agent file (C consensus, R research, P practitioner, X contested). It made the critic's job mechanical.
3. **researcher:** X.com pages rarely fetch. Add a rule: find practitioner material through their own sites (marketingexamples.com, julian.com, copyhackers.com, wynter.com) and cite the X post URL only for direct quotes.
4. **critic:** add a required check "measure any number you wrote yourself" (word counts, reading grades). The draft's guessed grade levels were wrong.
5. **tester:** make "gate fail caps the score" part of the agent file rubric; it separates competent from shippable cleanly.
6. **skill-architect:** require a "deliverable format" section in every SKILL.md (here: slot tables), so outputs drop straight into a design.
7. **design-director (future):** "landing page" triggers both design-copy and copywriting. Routing rule proposal: design-copy for structure, slots, microcopy and review; copywriting for long-form persuasion; both when writing a sales landing page from scratch.

## Foundation contract conflicts
- None blocking. The contract sets measure (45 to 75, 66 ideal), `--color-danger`, target sizes and WCAG 2.2 AA; copy defaults match.
- Note: the contract has no content tokens. Suggest adding mechanics defaults to FOUNDATIONS so every skill's examples agree: sentence case for UI, numerals for numbers, absolute dates for money and deadlines, no em dashes, US vs UK spelling choice (this skill used US spelling in examples and UK-style GOV.UK quotes verbatim).
- Slot budgets in this skill assume the contract's type scale; if design-typography changes display sizes, revisit the H1 character budget (20 to 60).
