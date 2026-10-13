# 02 Audience as a person in a moment

> design-strategy reference. Loaded by design-director after design-foundations and before the playbook; read the file the SKILL.md map names. Builds on website-strategy and crafting-voice-identity (Davon's skills) and never restates them.

Research notes: `kb/research/strategy/02-audience-moment.md` (B-numbers). Opinion is marked (opinion).

A demographic tells a designer nothing to draw. A moment does: who, in what situation, after what trigger, wanting what progress, held back by what, saying which words. Romaniuk's category entry points name the situations that bring a category to mind [B1]; Moesta's four forces name what pushes a switch and what stops it [B3]. Together they turn "freelancers aged 25 to 40" into a hero line, a proof slot and a reassurance next to the button.

The full buyer psychology profile (core complex, 2am thought, benefit ladder, objection map, awareness level) is website-strategy stage 3. This file is the one-line version the brief carries, and the rules that link it to design.

## Floor: fundamentals (non-negotiable)
1. **The audience is written as a moment, never demographics alone.** Formula: *[who] when [trigger or situation], wanting [progress], held back by [anxiety or habit].* [lint: `brief_lint.mjs` checks for the "when" clause; judged for quality]
2. **The status quo is named.** What do they do today without this (spreadsheet, nothing, the incumbent)? It is the first alternative (03). [judged]
3. **At least one anxiety has a named design answer** (where the proof sits, the guarantee, the price shown up front, sample data, the cancel line). [lint: `brief_lint.mjs` checks the field is filled; judged for fit]
4. **The words are theirs.** The category word and the hero's key phrase come from customer language (reviews, tickets, search terms, interviews), with the source named. [judged]
5. **Locale follows the audience** (FOUNDATIONS "Locale first"). [lint: field present]

## Principles
1. **Situations, not people, trigger a category.** CEPs "are not about the brand, they're about the buyer" [B2]. A page that names the situation is recognized by everyone in it.
2. **No push, no switch** [B3]. If the brief cannot name the push, the page will describe features to people with no reason to change.
3. **Remove fear before adding pull.** "More features can increase anxiety" [B5]; guarantees, trials and expert opinions worked "by removing anxiety rather than adding pull" [B5].
4. **Most viewers are not buying today.** In B2B "something like 5% in a quarter" are in market, a figure Dawes calls "a heuristic", not "a precise rule" [B6][B6b]. Pages and identities serve two audiences: the in-market few who compare, and the many who must remember the brand later (03, 05).

## Decision rules
- **Write 5 to 10 CEPs** as situations in the buyer's words ("a client paid late again", "first tax bill as a freelancer", "the spreadsheet broke") (opinion on the count). Pick **one primary CEP for the hero**, and up to three for the sections below it. Drop CEPs the product cannot credibly serve and ones a competitor already owns (opinion).
- **Map the four forces to slots** (opinion, from [B3][B5]):

| Force | What you write | Where it lands on the page |
|---|---|---|
| Push (the situation) | The trigger in their words | Hero line or the line under it |
| Pull (the new future) | The progress, as an outcome | Hero support, feature headings as outcomes |
| Anxiety (of the new) | The specific fear: switching cost, price, data, looking foolish | Reassurance beside the primary action; proof beside the claim (design-conversion 02) |
| Habit (of the present) | What they would keep doing | Migration or import path, "works with what you use" |

- **Awareness sets the hero's job** (website-strategy stage 3): problem-aware visitors get the situation first; product-aware visitors get proof and the offer first [B7]. **Sophistication sets the claim's form** (copywriting skill): in a market that has heard every claim, lead with mechanism or identification, not a bigger claim [B8].
- **If the audience is two people** (user and buyer, planner and boss), write two moments and say which one the hero serves; the other gets a section (website-strategy stage 3, secondary avatar).
- **If you have no customer words**, say so in the brief and use search phrasing and review mining from competitors as a stand-in, labelled (opinion).

## Numbers
| Item | Default |
|---|---|
| CEPs listed | 5 to 10; 1 for the hero, up to 3 for sections (opinion) |
| In market at once (B2B) | about 5 percent a quarter, a heuristic [B6][B6b]; for your category, share in market per year = 1 divided by the years between purchases, for cycles of a year or longer (two years gives "50%" a year, "around 13% in any quarter" [B6b]) |
| Customer phrases collected | 20 to 50 verbatim (design-copy 03) |
| Anxieties with a design answer | at least 1; usually 2 or 3 (opinion) |

## Ceiling: expert moves
1. **Write the hero from the primary CEP, not the product.** "Your first tax bill as a freelancer, already put aside" beats "Smart budgeting for freelancers": the situation is recognized before the product is understood. Reason: CEPs are the cues people use to retrieve a category [B1] (application is opinion).
2. **Spend design on the anxiety, not the pull.** The highest-value element on many pages is the small reassurance beside the button ("Cancel online in two taps", "Your bank login never reaches us") and the proof placed at the moment of doubt. Reason: Moesta's finding that removing anxiety drove switches where added features did not [B5].
3. **Design the habit exit.** Every switch has a "what about my old way" force; an import path or "keep your spreadsheet, we read it" section often converts better than another benefit (opinion, from the four forces [B3]).
4. **Two clocks: the comparer and the rememberer.** The in-market 5 percent need a fast comparison (category word, price, proof); the 95 percent need one distinctive thing to remember. Put both in the first screen: the category word for the first, the distinctive asset for the second (opinion, from [B6]).
5. **Quote the push, do not paraphrase it.** A phrase lifted from a review ("I'm never chasing invoices again") is recognized by the people in that situation in a way the brand's summary is not (practitioner advice in design-copy 03 and website-strategy stage 3; untested here, opinion).

## Do and don't
| Do | Don't |
|---|---|
| "UK freelancers when their first Self Assessment bill lands, wanting to know what is safe to spend, afraid of linking their bank" | "Freelancers, 25 to 40, tech-savvy" |
| Reassurance "Read-only access. We cannot move money." beside "Connect bank" | A fourth feature card |
| Status quo: "a spreadsheet and a savings pot" | Status quo omitted |
| Hero in their words, source named | Hero in the founder's words |

## Worked examples
### 1. Budgeting app for UK freelancers (one page depth)
- Moment: UK sole traders when the January Self Assessment deadline approaches, wanting to know what they can safely spend now, held back by fear of linking a bank and habit of a spreadsheet. Locale en-GB.
- Primary CEP for the hero: "a tax bill I didn't save for". Section CEPs: "a client paid late", "a big month, how much do I keep?".
- Anxiety answer: read-only bank access line beside the primary action; sample data on first run labelled "Sample" (design-ux 05). Habit answer: CSV import from the spreadsheet.
- Words: "safe to spend", "put aside for tax" (stand-in: review mining of two competitor apps, labelled).

### 2. Dental clinic booking site
- Moment: adults with a cracked tooth or toothache on a weekday evening, wanting to be seen tomorrow, afraid of cost and of pain. Locale en-US.
- Primary CEP: "toothache, need someone soon". Anxiety answers: prices for an emergency exam shown before booking; "We'll numb it first" in the clinic's voice; next free slot shown in the first screen.
- Push in their words, from the clinic's call log: "Can you see me today?" becomes the hero question.

## Where this domain is usually wrong
1. **Personas as demographics.** Age, title and income predict little about the situation that brings someone to a category; CEPs are situational by definition [B1][B2]. Correction: write the moment.
2. **More benefits win the switch.** Moesta: "More features can increase anxiety" [B5]. Correction: design the reassurance.
3. **Marketing reaches buyers.** It mostly reaches people who are not buying: 95 percent out of market in a B2B quarter [B6]. Correction: design for memory as well as conversion.
4. **"Everyone is our audience."** One primary moment for the hero; the rest go below (website-strategy stage 4 niche test).

## Hand-offs
- website-strategy stage 3: the full ICP, awareness level, objection map, language mirror. This file takes one line from it.
- copywriting: market sophistication and lead types for direct response pages.
- design-copy 01 and 03: hero structure and voice from the moment and the words.
- design-conversion 02 and 04: proof and reassurance placement for each anxiety.
- design-ux 05: sample data and first-run reassurance.
- design-search: the category word and CEP phrasing as the terms people search.
- Conflict: an anxiety answer (a long reassurance) against one primary action and a calm hero. The reassurance is one line beside the action, never a second button (FOUNDATIONS row 12).

## Sources
- Romaniuk, J. (2022), Category Entry Points in a B2B World, Ehrenberg-Bass Institute, listed at https://marketingscience.info/open-access-knowledge/open-access-reports (accessed 2026-10-13).
- Romaniuk, quoted in Marketing Week, relayed at http://www.jenniromaniuk.com/blog/2022/6/22/ehrenberg-bass-linking-brand-messages-to-buying-situations-wins-the-mind-and-the-market (accessed 2026-10-13).
- Moesta, B. and Spiek, C., Four Forces of Progress, https://jobstobedone.org/radio/wine-and-laptop-bag-jtbd and https://jobstobedone.org/radio/pull-and-anxiety (accessed 2026-10-13); The Re-Wired Group, https://therewiredgroup.com/learn/complete-guide-jobs-to-be-done (accessed 2026-10-13).
- Dawes, J. (2021), "Advertising effectiveness and the 95-5 rule: most B2B buyers are not in the market right now", Ehrenberg-Bass Institute for the LinkedIn B2B Institute, https://marketingscience.info/news-and-insights/advertising-effectiveness-and-the-95-5-rule-most-b2b-buyers-are-not-in-the-market-right-now (accessed 2026-10-13).
- Davon's skills: website-strategy `references/stage3-icp.md`; copywriting SKILL.md (accessed 2026-10-13).
