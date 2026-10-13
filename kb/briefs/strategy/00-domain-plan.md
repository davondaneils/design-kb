# Domain plan: strategy and brand (design-strategy)

Owner hat: editor-in-chief. Skill: `design-strategy`. Slug: `strategy`. Layer: domain reference, loaded by design-director after design-foundations and before the playbook for every page, screen or brand job. Written 2026-10-13.

## Why this domain exists
Until now strategy was a pointer: design-director and the playbooks sent positioning work to Davon's `website-strategy` skill, which is built for a freelance proposal (six stages, ending in a proposal or build brief). Two things went wrong with that:
1. **Depth did not follow the brief.** The held-out festival test built a brand page and strategy scope nobody asked for because the brand playbook demanded website-strategy before any mark (`kb/tests/heldout.md` section 6). The fix in design-playbook-brand section 0 (three lines for a campaign or one-off) lives in one playbook only; landing, dashboard and mobile jobs have no rule at all.
2. **Strategy did not reach the pixels in a traceable way.** website-strategy stage 5 gives "visual system direction" in prose ("dark, high-contrast palettes signal premium"). Nothing records which strategic attribute decided which type, color, shape or motion choice, or how strong the evidence for that link is. The art direction concept sentence (design-art-direction) needs a true fact; the brand playbook needs a competitor wall; design-copy 03 needs voice attributes; each skill asks for them separately.

This skill is the one place where a design brief becomes a one-page strategy brief that every playbook and reference reads: audience moment, positioning, one true fact, proof, voice, identity decisions with reasons and evidence levels, and the concept sentence for art direction.

## Scope
1. The strategy brief and how deep to go (three lines, one page, full), and when to hand off to website-strategy's six stages.
2. Audience as a person in a moment: jobs, triggers (category entry points), the four forces, anxieties, the words they use.
3. Positioning: Dunford's components in order, competitive alternatives, onlyness, the name-swap test against named competitors, one true fact, and the public claim it can carry.
4. Voice: an adapter, not a copy, to crafting-voice-identity and design-copy 03.
5. Strategy to visual identity: the traceable decision table (attribute to type, color, imagery, mark, layout, motion), evidence levels, distinctive assets (fame and uniqueness), category codes kept or broken, the asset audit for a rebrand.
6. Checking a strategy: competitor wall, hide-the-logo, five-second test, message test, swap test, claims traced to facts.

## Out of scope (link, do not duplicate)
- The full freelance discovery process, ICP document, Makepeace core complex, benefit ladder, Hormozi value equation, site narrative arc, proposal: **website-strategy** stages 1 to 6 (Davon's skill).
- The full brand voice style guide (Voice Identity Spectrum, Polarity Principle, scenario samples): **crafting-voice-identity** (Davon's skill). Voice chart, tone map, mechanics: **design-copy** `references/03-voice-and-tone.md`.
- Awareness and sophistication for direct response copy: **copywriting** (and website-strategy stage 3 for awareness).
- The concept sentence's method, motifs, reject test: **design-art-direction** 01. Hue choice and color evidence: **design-color** `psychology-brand.md`. Mark types, competitor wall of marks, stress tests: **design-graphic** 01. Faces: **design-typography** 02.

## Subtopics (one file name across briefs, research and drafts)
| # | File | Question |
|---|---|---|
| 1 | 01-strategy-brief-and-depth.md | What goes in the strategy brief, and how deep do I go for this job? |
| 2 | 02-audience-moment.md | Who is this for, in which moment, pushed by what, afraid of what, saying which words? |
| 3 | 03-positioning.md | What is this the only one of, against which named alternatives, proved by which fact? |
| 4 | 04-voice.md | How does it sound, as "this, not that" with sample lines, without rewriting the voice skills? |
| 5 | 05-strategy-to-visual-identity.md | Which strategic attribute decides which visual choice, on what evidence, and who builds it? |
| 6 | 06-checking-a-strategy.md | How do I prove the strategy and the identity are distinctive, clear and true before shipping? |

## Quality bar
Fundamentals gate (one miss fails): a brief at the right depth exists before any visual decision; the audience is a moment, not a demographic; competitive alternatives include the status quo; positioning passes a swap test against named competitors; every public claim traces to a fact held as evidence; every identity decision states its reason and evidence level; nothing in the strategy overrides the FOUNDATIONS accessibility floor or locale rule; scope follows the brief.

Expert test: would April Dunford, a COLLINS or Pentagram strategist, or Jenni Romaniuk learn something? Targets: positioning and distinctiveness as two different jobs on two different audiences (in-market and out-of-market); public "only" claims as objective claims that need evidence; color as the weakest distinctive asset; asset audit before any rebrand; testing identities by recognition, not liking; copy outranking shape in the evidence.

## Test plan
Test briefs exist in `kb/tests/design-strategy/` (written before the build, commit 35770aa). The builder of this skill did not read them; the tester runs them with a clean context.

## Network and tool notes
Parallel Search reached its free-tier rate limit partway through research on 2026-10-13; the rest used WebSearch and WebFetch. The Tom Roach compilation PDF of Binet and Field charts could not be parsed by WebFetch; its chart titles come from the search engine's text extraction and are marked as such.
