# 01 The strategy brief and how deep to go

Research notes: `kb/research/strategy/01-strategy-brief-and-depth.md` (A-numbers). Opinion is marked (opinion). Template: `skills/design-strategy/assets/strategy-brief.md`; checker: `assets/brief_lint.mjs`.

Strategy in a design job is a short, decisive step that the rest of the work reads. Wheeler's five phases put it second, between research and identity design, and her advice for that phase is to narrow: "Brands get stronger as you narrow the focus" [A1][A3]. The output here is one page. Davon's website-strategy skill is the full discovery process for a client proposal; this skill decides how much of it a job needs and turns the result into the fields every playbook reads.

## Floor: fundamentals (non-negotiable)
1. **No visual decision before the brief exists at the right depth.** No type, color, layout or concept before the depth row below is filled. [judged]
2. **Depth follows the brief, never the skill.** Use the depth table. Build only the deliverables the brief lists; name what was not built (design-playbook-brand section 0) [A4][A5]. [judged]
3. **One page.** "One page" names the discipline, not the paper: about 700 words or fewer, tables included (opinion; the linter warns above 700 and fails above 900). Measured: the 680-word example brief fills about 1.3 A4 sides at 10pt with 15mm margins, so a printed copy takes two sides. A longer document is the website-strategy output, summarized here. [lint: `brief_lint.mjs` word count]
4. **Every field a downstream skill reads is filled** or marked "not needed at this depth" with the reason. No placeholder text ships. [lint: `brief_lint.mjs`]
5. **The audience's locale is set in the brief** and becomes `<html lang>` (FOUNDATIONS Content mechanics, "Locale first"). A Glasgow festival is en-GB. [lint: `brief_lint.mjs` checks the field; the page lint checks `lang`]
6. **Opinion is labelled** wherever the brief rests on judgment instead of a fact. [judged]

## Standards
No external standard governs a strategy brief. Claims that leave the brief and reach a page fall under advertising law (FTC reasonable basis, CAP Code 3.7; see 03) and FOUNDATIONS checklist row 16 (copy is true).

## Principles
1. **The brief is a contract, not an essay.** Each field exists because a named skill reads it (table below). A field nobody reads is cut.
2. **Narrow before you design.** A strategy that tries to say three things gives every downstream skill three directions (Wheeler, opinion on the application) [A3].
3. **Reuse the depth the brand already has.** An existing brand with guidelines is inherited, not re-strategized. Never rebrand by accident inside a screen job (opinion).
4. **The three-line brief is the default for most work.** Full strategy is for new brands, rebrands and missing positioning (design-playbook-brand section 0) [A4].

## Decision rules
### Pick the depth
| The job | Depth | What you write | Hand-off |
|---|---|---|---|
| A screen, flow or page inside an existing product or brand with guidelines (settings page, new dashboard view, a feature page) | **Inherit** | Three lines: the user's moment for this screen, the brand source you inherit (guidelines file, live site, tokens), what this screen must not change | None. Use the existing tokens and voice |
| Campaign, event, poster, one-off artifact, a microsite for a known brand | **Three lines** | Audience moment, the one true fact the idea comes from, the competitor wall you checked; plus the concept sentence for art direction | design-art-direction writes the concept from the fact |
| New site or landing page for a brand with no strategy on file but a clear offer | **One page** | The full template (`assets/strategy-brief.md`) | website-strategy stage 2 (fact sheet) only if facts are thin |
| New brand, rebrand, "brand system", or audience, positioning or competitors missing | **Full** | website-strategy stages 2 to 5 as inputs, then the one-page template as the summary, plus the asset audit for a rebrand (05) | website-strategy; crafting-voice-identity when a voice guide is a deliverable |
| A client proposal, job post or pitch | **Full, proposal form** | website-strategy all six stages; stage 6 is the deliverable | website-strategy owns it; this skill adds the identity table (05) and the checks (06) only if design is in scope |

If two rows fit, take the shallower one and say what you skipped (opinion). If the brief names a deliverable (a strategy document, a voice guide), that deliverable sets the depth.

### What each field feeds
| Field | Read by |
|---|---|
| Audience moment, locale | design-copy (structure, hero), design-ux, design-conversion (anxieties), FOUNDATIONS locale |
| Positioning and category word | design-copy hero, design-search (the words people search), design-playbook-landing non-negotiable 2 (category word in the first screen) |
| One true fact | design-art-direction (concept sentence), design-copy (proof) |
| Proof and claims ledger | design-conversion 02 (proof beside the claim), design-copy `claims_inventory.mjs` |
| Voice | design-copy 03, design-motion (tone), the identity table |
| Identity decisions | design-typography 02, design-color psychology-brand and palette-building, design-graphic 01, design-art-direction 01, design-layout, design-motion 01 |
| Concept sentence and reject test | design-art-direction |
| Competitors named | design-graphic 01 competitor wall, design-color category map, the swap tests (06) |

### Fill order
1. Locale and depth. 2. Audience moment (02). 3. Competitive alternatives, then positioning (03). 4. One true fact and proof. 5. Claims ledger (03, 06). 6. Voice (04). 7. Identity decisions (05). 8. Concept sentence. 9. Checks (06). 10. Run `node skills/design-strategy/assets/brief_lint.mjs brief.md`.

## Numbers
| Item | Default |
|---|---|
| Depth tiers | 4: inherit, three lines, one page, full |
| Brief length | about 700 words or fewer, tables included (opinion); about 1.3 A4 sides at 10pt (measured on the example) |
| Named competitors | 3 for the swap tests (opinion); 8 to 12 for the color map (design-color); 12 to 20 marks for the wall (design-graphic) |
| Wheeler phases | 5 [A1] |

## Ceiling: expert moves
1. **Write the depth decision into the hand-over.** "Depth: three lines; this is a festival poster and site, the brief asked for no brand document." It makes the scope auditable and stops padding (opinion; the held-out over-scope [A5]).
2. **Inherit means inherit the assets, not the mistakes.** When inheriting, still run the accessibility floor on the brand's colors and the swap test on the new screen's hero line; flag, do not silently fix, a brand color that fails as text (design-color rule: it changes role) (opinion).
3. **Take fields, not stages, from website-strategy at one-page depth.** Stage 2's gap list and Schwartz's five questions are the fastest way to find the one true fact; stage 3's language mirror gives the hero words. Running all six stages for a landing page is the over-scope the held-out test punished (opinion) [A5][A6].
4. **The brief names its own weakest field.** One line: "Weakest: proof; no named customers yet." The playbook then designs around the gap (for example a specific number instead of logos) instead of faking it (opinion).

## Do and don't
| Do | Don't |
|---|---|
| "Depth: inherit. Brand source: tokens in `brand.css`, voice in guidelines p. 4. This screen must not change the nav or type." | Re-pick fonts for a settings screen |
| Three lines for a festival poster | A 12-page brand book for a poster |
| "Weakest: proof" written in the brief | A hero that implies proof you do not have |
| Locale field "en-GB (Glasgow audience)" | US dates on a Glasgow page |

## Worked examples
### 1. Festival poster and one-page site (three lines)
Brief: two-day type and print festival in Glasgow, poster and event site. Depth: three lines (campaign or event). Written (taken from the held-out re-run, `kb/tests/heldout.md`):
- Audience moment: people who make or love letters and print in and around Glasgow, deciding which weekend in April to give to it. Locale en-GB.
- One true fact: Glasgow is built of red sandstone laid in courses, and type is "set" the way stone is.
- Competitor wall checked: festival posters lean on a Didone or a misregistration effect.
- Concept for art direction: "Type is set the way Glasgow's red sandstone is set: in courses, each stone cut to its word."
Not built: guidelines page, logo kit, strategy document. That build won 3 of 3 blind pairs against a baseline Davon had picked (`kb/tests/heldout.md`).

### 2. New settings screen in an existing app (inherit)
Moment: a workspace admin changing billing contact after a finance hire, in a hurry and worried about breaking invoices. Brand source: the product's tokens and voice chart. Must not change: shell, nav, type scale. The brief's only new decision is tone: billing moments go flat (design-copy tone map). No identity table.

### 3. Rebrand of a regional institution (full)
Run website-strategy stages 2 to 5, then the one-page brief, then the asset audit (05) before any sketch: which existing assets are famous and unique enough to keep. Hand-over says which stages ran and which assets were kept and why.

## Where this domain is usually wrong
1. **"Strategy first" means a long strategy document first.** Wheeler's strategy phase is the short, narrowing step of five [A1][A3]; the house test showed over-scoped strategy cost a brand brief [A5]. Correction: depth by job, one page out.
2. **Every project runs the full discovery.** website-strategy itself is framed for "freelance proposals and client projects" [A6]. Correction: full depth for new brands, rebrands and proposals only.
3. **The brief is for the client.** Here it is for the next skill. Correction: each field names its reader (table above); client-facing strategy is website-strategy stage 6.

## Hand-offs
- website-strategy: full depth and proposals (stages 2 to 6). This skill never restates its frameworks.
- design-playbook-brand section 0: same depth rule; this file is the shared version for every playbook.
- design-foundations: locale, accessibility floor, claims truth (row 16).
- design-art-direction: receives the one true fact and the concept sentence.
- Conflict: a client asks for "a brand strategy" on a poster job. The deliverable list wins; offer the full brief in one line in the hand-over (opinion).

## Sources
- Wheeler, A., Designing Brand Identity, 3rd edition table of contents, https://www.gbv.de/dms/zbw/599133775.pdf (accessed 2026-10-13); Google Books record, 4th edition, https://books.google.com.qa/books?id=uSNHAAAAQBAJ (accessed 2026-10-13).
- AIGA Raleigh, "Recap: Alina Wheeler, Designing Brand Identity", https://raleigh.aiga.org/recap-alina-wheeler-designing-brand-identity (accessed 2026-10-13).
- design-kb internal: `skills/design-playbook-brand/SKILL.md` section 0; `kb/tests/heldout.md` sections 6 and festival re-run; website-strategy SKILL.md (Davon's skill); `kb/FOUNDATIONS.md` Content mechanics (accessed 2026-10-13).
