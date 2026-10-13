# 04 Voice: the adapter

Research notes: `kb/research/strategy/04-voice.md` (D-numbers). Opinion is marked (opinion).

Three skills already define voice: Davon's crafting-voice-identity (the full brand voice style guide), design-copy `references/03-voice-and-tone.md` (voice chart, tone map, mechanics) and website-strategy stage 5 (voice and prohibitions in the creative brief). This file does not add a fourth method. It sets what the strategy brief carries (four lines), which skill to run when more is needed, and the one thing none of them does: tie each voice attribute to its visual twin, so words and pixels come from one decision.

## Floor: fundamentals (non-negotiable)
1. **Voice is 3 or 4 "this, not that" pairs, each with a sample line** written in the brand's real context (a hero, an error, a receipt). Adjectives alone fail. [lint: `brief_lint.mjs` checks for "not" in each attribute and a sample line]
2. **Clarity outranks personality** ("It's always more important to be clear than entertaining", Mailchimp via design-copy 03). [judged]
3. **The voice goes flat where it must**: no humor in errors, money loss, security, health, legal or bereavement moments (design-copy 03). [judged]
4. **Words come from the audience** (02): the voice uses their vocabulary, not the brand's jargon. [judged]
5. **Each attribute has a visual twin** in the identity table (05). [lint: `brief_lint.mjs` checks each voice attribute name appears in the identity table]

## Principles
1. **Same voice, moving tone.** "You have the same voice all the time, but your tone changes" [D1].
2. **The boundary is the useful half.** "Weird but not inappropriate, smart but not snobbish" [D1]: the "not" tells a writer where to stop.
3. **One decision, two expressions.** If the voice is "plainspoken, not blunt", the type, color and motion are plainspoken too. Readers perceive persona in typefaces as well as text [D5], so a mismatch is felt (Brumberger's appropriateness study, via its abstract).

## Decision rules
### Which voice tool
| Situation | Use |
|---|---|
| Three-line or inherit depth | The brand's existing voice; write one line naming its source. If none, two pairs and a sample |
| One page depth | Four lines in the brief (this file's format) |
| A voice guide, tone of voice document or "brand voice" is a deliverable | crafting-voice-identity in full (spectrum, polarity, scenarios), then copy its pairs into the brief |
| Writing product UI or page copy | design-copy 03: voice chart, tone map dials, mechanics sheet |
| Direct response page | copywriting; voice still from the brief |

### The four lines in the brief
```
Voice: Plainspoken, not blunt. "Your payment did not go through. You have not been charged."
       Warm, not cute.        "Morning. Three invoices went out overnight."
       Expert, not academic.  "Late fees work best at 2 percent a month. Here's why."
Flat:  errors, payments, security (tone map dials at 1)
```

### Find the attributes
1. Read 20 to 50 customer phrases (02). Circle the words they use for what they love about the category's best experience.
2. Run a tonality check on the three named competitors (crafting-voice-identity's Competitive Tonality Analysis): one line each on how they sound.
3. Pick pairs that are true of the brand and absent from at least two of the three. The "not" side is often a competitor's habit (opinion).
4. Write one sample line per pair in a hard moment (an error or a bill), not only in the hero. A voice that only works when the news is good is a slogan (opinion).

## Numbers
| Item | Default |
|---|---|
| Attribute pairs | 3 or 4 (design-copy 03) |
| Sample lines | 1 per pair, at least one in a hard moment (opinion) |
| Competitors in the tonality check | 2 to 3 (crafting-voice-identity) |
| Tone dials | 4 NN/g dimensions, 1 to 5 (design-copy 03) |

## Ceiling: expert moves
1. **Write the sample line in the worst moment first.** Payment failed, account locked, order late. If the pair still holds there, it is a voice; if it only works in the hero, cut it (opinion; design-copy 03 tone map).
2. **Steal the "not" from the category.** "Expert, not academic" for a field where competitors write like manuals; "warm, not cute" where competitors use mascots and exclamation marks. The boundary is the differentiation (opinion).
3. **Give every pair a visual twin in the same words.** "Plainspoken, not blunt" maps to a low-contrast grotesque at a calm size, not a condensed black weight; "warm, not cute" to a humanist face with soft terminals and rounded radius from the scale (`--radius-md`), not a bubble font. Written once, used by both the writer and the designer (05).
4. **Ban the category's words, not only the corporate ones.** design-copy 03 bans "leverage", "seamless" and friends; add the three phrases every competitor uses ("all-in-one", "built for teams", "your coffee journey"). They are the verbal version of a category code (opinion).

## Do and don't
| Do | Don't |
|---|---|
| "Plainspoken, not blunt" plus a sample error line | "Friendly, bold, human" |
| Voice source named for an inherited brand | A new voice for one settings screen |
| Banned list with the category's own phrases | Banned list of generic corporate words only |
| The same pair named in the identity table | Voice and visuals briefed separately |

## Worked examples
### 1. Calm meditation app
Pairs (from design-copy 03's worked example): calm, not sleepy; warm, not sugary; clear, not clinical. Hard-moment sample: "This session did not load. Check your connection, then try again." Visual twins: calm, not sleepy maps to low chroma with one warm accent and `--motion-enter` reveals, no bounce; warm, not sugary maps to a humanist sans and `--radius-lg` cards, no pastel gradients; clear, not clinical maps to generous line height and plain icons from one set.

### 2. Challenger bank
Category voice (tonality check): two incumbents formal and passive; one neobank chummy with emoji. Pairs: direct, not cold; optimistic, not flippant; human, not chummy. Hard-moment sample: "We've frozen your card. Unfreeze it any time in Settings." Visual twins: optimistic maps to one saturated brand color used as a field (Monzo's coral, 05), human maps to warm photography that breaks the category's stock people (Monzo blog), direct maps to large figures and short labels.

## Where this domain is usually wrong
1. **A voice is three adjectives.** Without the "not" and a sample, writers converge on generic copy (design-copy 03; website-strategy stage 5 "Template brand strategy" failure mode).
2. **Personality everywhere.** Clarity first, and some moments take no personality at all (design-copy 03).
3. **Voice belongs to the copywriter.** Readers ascribe persona to typefaces as well as text [D5]; a voice briefed without its visual twin produces type that says something else (opinion).

## Hand-offs
- crafting-voice-identity: the full voice guide when it is a deliverable.
- design-copy 03: voice chart, tone map, mechanics, banned words; 02 microcopy.
- website-strategy stage 5: voice prohibitions and the single feeling for the site.
- 05 (identity table): every pair has a visual twin.
- design-motion: motion personality follows the tone dials (design-copy 03 hand-off).
- Conflict: a playful voice against error and payment moments. The tone map wins: dials at 1.

## Sources
- Mailchimp Content Style Guide, Voice and tone, https://styleguide.mailchimp.com/voice-and-tone/ (accessed 2026-10-13).
- Brumberger, E. (2003), "The Rhetoric of Typography: The Persona of Typeface and Text", Technical Communication 50(2), abstract at https://www.ingentaconnect.com/contentone/stc/tc/2003/00000050/00000002/art00008 (accessed 2026-10-13; full text not accessed).
- design-kb internal: `skills/design-copy/references/03-voice-and-tone.md`. Davon's skills: crafting-voice-identity SKILL.md; website-strategy `references/stage5-brand.md` (accessed 2026-10-13).
- Monzo, "We've had a little makeover", https://monzo.com/blog/weve-had-a-little-makeover (accessed 2026-10-13).
