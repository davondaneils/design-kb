---
name: design-strategy
description: Domain reference loaded by design-director or a design playbook (design-playbook-landing, -dashboard, -mobile, -brand) after design-foundations and before the playbook's other references; do not trigger on its own for a page, screen or brand job. Turns a design brief into a one-page strategy brief at the depth the job needs (inherit, three lines, one page, full): the audience as a moment (category entry points, push, anxieties, their words), positioning (Dunford's components, status quo, onlyness and the name-swap test against named competitors), the one true fact and the public claims it can carry, voice as "this, not that" pairs, and a traceable table from strategic attribute to type, color, shape, imagery, layout and motion with evidence levels (distinctive assets, fame and uniqueness, category codes kept or broken, the asset audit before a rebrand), plus the checks (competitor wall, hide-the-logo, five-second test, message test, claims ledger). Load it directly only for a narrow strategy question ("is this positioning distinctive", "what should this identity be based on", "audit our brand assets before a rebrand"). Full discovery and client proposals: website-strategy. A full brand voice guide: crafting-voice-identity.
---

# design-strategy

> **Layer: domain reference.** Loaded after `design-foundations` and before the playbook's references by `design-director`. Builds on Davon's **website-strategy** (six-stage discovery and proposal) and **crafting-voice-identity** (full voice guide); links to them and never restates them.

Design without a strategy is decoration; a strategy nobody can trace to a pixel is an essay. This skill writes one page that every playbook and reference reads, at the depth the brief needs, and makes each visual decision answer to a stated reason.

## 1. Routing (read first)
**design-director loads this skill after design-foundations and before the playbook, for every page, screen or brand job, at the depth the brief needs.** Its output is the one-page brief (`assets/strategy-brief.md`) that the playbook and the references consume.

| The job | Depth | Write |
|---|---|---|
| Screen, flow or page inside an existing product or brand with guidelines | **Inherit** | Moment, brand source, what must not change. Never rebrand by accident |
| Campaign, event, poster, one-off artifact | **Three lines** | Audience moment, the one true fact, the competitor wall you checked (design-playbook-brand section 0), plus the concept sentence design-art-direction writes from the fact |
| New site or landing page, brand has no strategy on file | **One page** | The full template |
| New brand, rebrand, brand system, or audience, positioning or competitors missing | **Full** | website-strategy stages 2 to 5 as inputs, then the one-page template as the summary, plus the asset audit for a rebrand |
| Client proposal, job post, pitch | **Proposal** | website-strategy, all six stages; add this skill's identity table and checks only when design is in scope |

If two rows fit, take the shallower and say what you skipped. A deliverable the brief names (a voice guide, a strategy document) sets the depth. Name what was not built.

| Brief field | Read by |
|---|---|
| Audience moment, locale | design-copy, design-ux, design-conversion (anxieties), FOUNDATIONS locale (`<html lang>`) |
| Positioning, category word | design-copy hero, design-search, design-playbook-landing non-negotiable 2 |
| One true fact, concept sentence, reject test | design-art-direction |
| Proof, claims ledger | design-conversion 02, design-copy `claims_inventory.mjs` |
| Voice pairs | design-copy 03, design-motion |
| Identity decisions | design-typography 02, design-color, design-graphic 01, design-art-direction 01, design-layout, design-motion 01 |
| Competitors named | design-graphic 01 wall, design-color category map, the checks (06) |

## 2. Fundamentals (non-negotiable, check first)
1. **No visual decision before the brief exists at the right depth.** [judged]
2. **Depth follows the brief; build only what it lists** and name what was not built (design-playbook-brand section 0). [judged]
3. **One page**: about 700 words or fewer, tables included. [lint `brief_lint.mjs`]
4. **Locale set from the audience**, then used as `<html lang>` (FOUNDATIONS "Locale first"). [lint]
5. **The audience is a moment**: "[who] when [trigger], wanting [progress], held back by [anxiety or habit]", in their words with the source named. Never demographics alone. [lint for the shape; judged for truth]
6. **The status quo is the first alternative**; three shortlisted competitors are named. [lint]
7. **Positioning passes the name-swap test** against each named competitor, on the onlyness sentence and the hero line. [lint that a result is recorded; judged]
8. **One true fact, with its source**: specific, checkable, owned, drawable. [lint]
9. **No public claim without evidence held before publishing.** "Only", "first", "fastest", numbers and comparisons are objective claims (FTC reasonable basis; CAP Code 3.7). Each has a ledger row: yes or cut. [lint the ledger; `claims_inventory.mjs` on the page]
10. **Voice is 3 or 4 "this, not that" pairs with a sample line each**, flat in errors, money and security. [lint]
11. **Every identity decision is a row**: attribute, decision, reason, evidence level (E evidence, C convention, O opinion), owner skill; in FOUNDATIONS tokens, never raw values. Folklore ("blue means trust") is never evidence. [lint]
12. **The primary distinctive asset is not a color alone.** [lint]
13. **Strategy never overrides the floor.** "Bold" is scale, color as a field and crop, never a contrast fail; a brand color that fails as text changes role (design-color). [lint on the page]
14. **A rebrand starts with an asset audit** before any sketch. [judged]
15. **Checks are run and recorded**; your own judgment never counts as a cold viewer. [judged]

## 3. Principles
1. **The brief is a contract, not an essay.** Every field has a named reader (table above); a field nobody reads is cut.
2. **Two jobs, two audiences.** Positioning gives the in-market comparer a reason to choose, in words. The identity makes the brand recognizable to the out-of-market majority (about 95 percent of B2B buyers in a quarter, Dawes), in assets. Buyers perceive little difference between brands (Romaniuk, Sharp and Ehrenberg 2007); they do recognize distinctive assets.
3. **Situations, not people, bring someone to a category** (Romaniuk's category entry points). No push, no switch; remove anxiety before adding pull (Moesta).
4. **Alternatives define difference; the category is a frame you choose** (Dunford).
5. **Shape first, color second; words beat shapes when they disagree** (2026 distinctive asset benchmark; Jiang et al. 2016).
6. **Every claim is a fact you can show.**

## 4. Decision rules
- **Fill order**: depth and locale, moment (ref 02), alternatives then positioning (03), fact and proof, ledger, voice (04), identity table (05), concept sentence, checks (06), then `brief_lint.mjs`.
- **Hero from the primary CEP**, in the buyer's words; up to three more CEPs for sections. Each anxiety gets a design answer beside the action or the claim (design-conversion 02).
- **Positioning short path** (Dunford's order): alternatives (status quo first), unique attributes, value, best-fit customers, market category (try three frames, keep the one whose assumptions favor you), onlyness, swap test, one true fact. The positioning statement, if wanted, is written last (website-strategy stage 4 template).
- **Position to public line**: say the fact, not the boast ("Every bag shows its roast curve", not "the only roaster that..."), unless a dated market scan is in the ledger.
- **Voice tool**: inherit or three lines, name the source; one page, four lines; voice guide as deliverable, crafting-voice-identity in full; UI and page copy, design-copy 03.
- **Distinctive assets**: one primary shape (mark, container, character, crop) that survives 16px and one color, plus one or two supporting assets (color at a fixed share, a face, an image treatment). Never color alone.
- **Category codes**: keep the semantic codes (what it is: a bank looks safe, a checkout looks like a checkout); break exactly one expressive code hard (who it is: the shared stock photo, the shared blue). Never use a famous-but-not-unique asset alone.
- **Rebrand audit**: fame and uniqueness per asset (50 percent thresholds); Use or lose: keep; Invest: use more; Avoid solo use: only with the name; Ignore or test: free to replace. Remove a name from a symbol only after about 80 percent spontaneous recognition (Mastercard 2019; opinion as a rule).
- **Checks by depth**: inherit, swap test and ledger; three lines, add the covered competitor wall, hide-the-logo and a five-second test; one page, add the onlyness swap test and a fresh critic on the hero; full, add the mark wall, asset audit and a real message or recognition test.

### Attribute to identity, starting rows (ref 05 has the full table)
| Attribute | Type | Color | Shape | Motion | Level |
|---|---|---|---|---|---|
| Precise | grotesque, tabular figures (`--font-sans`, mono for data) | low chroma, one accent | angular, straight terminals | short, `--ease-standard` | C, O; shape E weak |
| Warm | humanist sans or soft serif | warm neutrals, brand hue as a field | rounded, `--radius-lg` | `--motion-enter`, no bounce in UI | C, O; shape E weak |
| Calm, premium | fewer sizes, display contrast (`--text-display`) | low chroma, deep lightness | simple, one quirk | rarer, one `--duration-slow` reveal | O |
| Challenger | a face the category does not use | an empty sector of the hue wheel | one shape no competitor has | as brand, floor first | O |
| Trusted, regulated | serif or sober sans | conform to the category hue | keep famous assets | minimal | C; keeping assets E |

## 5. Expert moves (what a top strategist does that a generalist misses)
1. **Give the words and the look different jobs.** Words differentiate for the 5 percent comparing today; the identity is distinctive for the 95 percent who must remember later. A brief that asks a logo to "say innovative and trustworthy" is asking it to do the copy's job, and a headline that states another attribute cancels the shape's effect anyway (Jiang et al. 2016).
2. **Onlyness stays internal until the ledger says yes.** Public "only" is an objective claim (the ASA even treated "the perfect network" as objective in context). Publish the underlying fact: more specific, legally safe, and drawable for art direction.
3. **Position against the status quo before the market leader.** The first alternative to beat is doing nothing (Dunford); a hero that beats the spreadsheet beats more deals.
4. **Choose the category for its default assumptions.** "Invoicing software" imports the leader's feature checklist; "getting paid on time" imports a comparison you win. The category word in the hero is a positioning decision.
5. **Spend design on the anxiety, not the pull.** The one-line reassurance beside the button and proof at the moment of doubt often outwork another feature: "More features can increase anxiety" (Moesta).
6. **Lead with a shape; let color ride on it.** Across 1,162 assets in 21 categories, shapes average 40 percent fame and 71 percent uniqueness, colors 12 and 39; color is also the most contested (2026 benchmark). Monzo's coral works because it is a coral card, an object.
7. **Measure before you rebrand.** Anything in "Use or lose" is a constraint, not an option. Tropicana removed its orange with a straw in January 2009 and brought it back within weeks (NYT).
8. **Test identities by recognition, not liking.** Liking-based redesigns are linked to worse outcomes than distinctive-asset research (Caruso et al. 2025, cited in the 2026 benchmark). Hide the name; count correct brand links.
9. **Keep the semantic codes, break one expressive code hard.** Monzo kept banking's interface grammar and broke its color and its "generic people photography". Breaking everything costs category recognition (opinion).
10. **The louder the creative, the stronger the branding.** "The more attention-grabbing the creative, the harder the branding has to work" (Romaniuk): a wild hero still carries the primary asset in its first screen.
11. **For global brands, put the attribute in the shape.** Round and angular cues hold across 25 languages and 10 writing systems (Ćwiek et al. 2022); color meanings vary by culture.
12. **Cover the logos and ask the viewer to pick yours.** A distinctiveness check with a right answer is harder to fool than "does it look different?". Brief the fresh viewer with the audience moment, never the strategy.
13. **Name the weakest field.** "Weakest: proof; no reviews yet" lets the playbook design around the gap instead of faking proof.
14. **Name the evidence level out loud** in the hand-over: lab evidence (weak), convention, or our judgment. Clients and critics trust a strategist who separates taste from evidence.

## 6. Numbers
| Item | Value |
|---|---|
| Depth tiers | inherit, three lines, one page, full (plus proposal via website-strategy) |
| Brief length | about 700 words, tables included (lint warns above 700, fails above 900; opinion) |
| Named competitors | 3 for swap tests (opinion); 8 to 12 for the hue map (design-color); 12 to 20 marks at 48px for the wall (design-graphic) |
| CEPs | 5 to 10 listed, 1 for the hero, up to 3 for sections (opinion) |
| In market at once (B2B) | about 5 percent a quarter (Dawes), sector-dependent |
| Voice pairs | 3 or 4, one sample line each |
| Distinctive asset grid | 50 percent thresholds; average asset 26 percent fame, 54 uniqueness; shapes 40 and 71; colors 12 and 39 |
| Name off the symbol | about 80 percent spontaneous recognition (Mastercard; opinion as a rule) |
| Expressive codes broken | 1, at most 2 (opinion) |
| Five-second test | 5 s, 3 to 5 cold viewers; a fresh-context subagent counts as one |
| Message test | about 12 to 13 responses to saturation (Wynter) |
| Budget context | brand to activation 60:40 (IPA databank average), B2B 46:54 (Binet and Field); averages, not laws |

## 7. Deliverable format
One file, `strategy-brief.md`, copied from `assets/strategy-brief.md`, at the depth from section 1:
1. Header: depth (and why), locale, deliverables, not built.
2. Audience moment, primary CEP, anxiety and design answer, their words with source.
3. Positioning: alternatives (status quo first), competitors named, competitor wall, category frame, onlyness (internal), swap test result.
4. One true fact (with source), proof on the page, weakest field.
5. Claims ledger: claim, fact, source, evidence held (yes or cut).
6. Voice pairs with sample lines; flat moments.
7. Identity decisions table (attribute, decision, reason, E/C/O, owner), primary and supporting assets, codes kept and broken, asset audit.
8. Concept sentence and reject test for design-art-direction.
9. Checks and results.
It passes `brief_lint.mjs`, and its one-line summary leads the hand-over: "Depth: one page. Weakest field: proof. Swap test: pass."

## 8. Assets
| File | Use |
|---|---|
| `assets/strategy-brief.md` | The template. Delete the sections your depth does not need |
| `assets/example-brief-ember-oak.md` | A filled one-page brief (the design-kb test roaster); passes the linter at 700 words |
| `node skills/design-strategy/assets/brief_lint.mjs brief.md [--json]` | Checks depth, locale, moment shape, status quo, 3 competitors, swap result, fact source, ledger (yes or cut), voice pairs and samples, identity rows with E/C/O, non-color primary asset, codes, checks, length, placeholders and em dashes. Exit 1 on any FAIL |
| `node skills/design-strategy/assets/brief_lint.mjs --self-test` | Runs its six built-in cases |

## 9. Reference map
| Read | When |
|---|---|
| `references/01-strategy-brief-and-depth.md` | Picking the depth, what each field feeds, hand-off to website-strategy, worked examples per depth |
| `references/02-audience-moment.md` | CEPs, the four forces mapped to page slots, anxieties and their design answers, awareness and sophistication hand-offs |
| `references/03-positioning.md` | Dunford's order, category frames, onlyness and the swap test, the one true fact, which public claims evidence allows |
| `references/04-voice.md` | The four voice lines, which voice skill to run, visual twins for each pair |
| `references/05-strategy-to-visual-identity.md` | The full attribute table, distinctive assets, category codes, the rebrand asset audit, evidence levels |
| `references/06-checking-a-strategy.md` | Swap tests, covered competitor wall, hide-the-logo, five-second and message tests, claims ledger, reading results |

## 10. Related skills
website-strategy (full discovery: fact sheet, ICP, positioning, brand strategy, proposal), crafting-voice-identity (full voice guide), copywriting (awareness and market sophistication for direct response), design-copy (voice chart, tone map, `claims_inventory.mjs`), design-art-direction (concept sentence, reject test, motifs), design-color (`psychology-brand.md`, palette roles), design-typography (`02-selection-pairing.md`), design-graphic (`01-logo-identity.md`: mark types, wall, stress tests), design-conversion (proof and reassurance placement), design-playbook-brand (section 0 scope, 2a concept legibility).
