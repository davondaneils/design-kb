# Voice and tone systems

## Principles
1. **Voice is who you are; tone is how you read the room.** "You have the same voice all the time, but your tone changes" (Mailchimp).
2. **Clarity outranks personality.** "It's always more important to be clear than entertaining" (Mailchimp). A voice that costs comprehension is wrong.
3. **A voice is a set of decision rules, not adjectives.** "Friendly, bold, human" tells a writer nothing. A voice chart (Podmajersky) turns each attribute into rules for vocabulary, length, grammar, punctuation and case.
4. **The customer's vocabulary is the raw material.** Mine reviews, support tickets and sales calls for exact phrases (Copyhackers, practitioner).

## Fundamentals (gate)
- One mechanics sheet, applied everywhere: sentence case, numerals, serial comma or not, date and currency formats, contractions policy, exclamation policy.
- No humor in errors, money loss, security, health, legal or bereavement moments (NN/g errors; Mailchimp "keep a straight face").
- Same term for the same thing everywhere (a glossary; "workspace" never becomes "project" or "team").
- Requirement verbs: "must" (legal), "need to" (required step), "can" (optional). Never "may be able to" (GOV.UK).

## Decision rules

### Building the voice (90 minute version)
1. **Collect:** 20 to 50 verbatim customer phrases from reviews and tickets (six types: problems, current-solution complaints, motivations, desires, favored features, anxieties; Copyhackers).
2. **Pick 3 to 4 attributes**, each with a boundary: "Plainspoken, not blunt", "Warm, not cute", "Expert, not academic". Two-sided pairs stop over-steering (Mailchimp pattern).
3. **Place the brand on the 4 NN/g dimensions** (formal to casual, serious to funny, respectful to irreverent, matter-of-fact to enthusiastic) as a 1 to 5 score each. These are your default dials.
4. **Write the voice chart:** attributes as columns; rows: Concepts (what we talk about), Vocabulary (words we use and ban), Verbosity (how long), Grammar (person, voice, sentence types), Punctuation, Capitalization.
5. **Write the tone map:** list the 8 to 12 moments in your product and set the dials for each (table below).
6. **Prove it:** rewrite 10 real strings and have someone not on the project pick which brand wrote them.

### Tone map template
Dials: 1 = formal, serious, respectful, matter-of-fact; 5 = casual, funny, irreverent, enthusiastic.

| Moment | Reader state | Formal/casual | Serious/funny | Respectful/irreverent | Matter-of-fact/enthusiastic | Example |
|---|---|---|---|---|---|---|
| Marketing hero | Curious, skeptical | 4 | 2 | 2 | 3 | "Your books, closed by Friday." |
| Onboarding | Hopeful, impatient | 4 | 2 | 1 | 3 | "Connect your bank to see this month's numbers." |
| Success | Relieved | 4 | 2 to 3 | 2 | 4 | "Done. That's March reconciled." |
| Empty state (cleared) | Satisfied | 4 | 3 | 2 | 3 | "All caught up." |
| Form error | Mildly annoyed | 3 | 1 | 1 | 1 | "Enter a date after today." |
| Payment failed | Worried | 2 | 1 | 1 | 1 | "Your payment did not go through. You have not been charged." |
| Security alert | Alarmed | 2 | 1 | 1 | 1 | "New sign-in from Chrome on Windows in Lyon. Was this you?" |
| Cancellation | Leaving, maybe annoyed | 3 | 1 | 1 | 1 | "Your plan ends on Nov 9. Your data stays for 90 days." |
| Legal, billing terms | Cautious | 2 | 1 | 1 | 1 | Plain, complete sentences |
Rule: the worse the reader's moment, the closer every dial moves to 1. Enthusiasm never exceeds the reader's.

### Mechanics defaults (override per brand)
- Sentence case for headings, buttons, menus, tabs (Microsoft, GOV.UK).
- Person: "you" for the user. "We" for the company. Avoid "my" in UI navigation ("My account") unless tested; it mixes speakers (opinion, common in style guides).
- Contractions: positive contractions yes for casual voices (Microsoft). **Negative contractions avoided in instructions, warnings, legal text and anything that will be translated** ("cannot", "do not"), because "can't" and "can" differ by one easily missed letter for scanners and low-literacy readers (GOV.UK). This is a deliberate resolution of a real conflict between two major guides.
- Exclamation marks: at most one per screen, never in errors or warnings (opinion).
- Numerals for all numbers (GOV.UK), including 2 to 9 in UI.
- No ampersands in running text; fine in tight nav if consistent (GOV.UK says "and").
- Emoji: never as the only carrier of meaning; screen readers read their names.

### Writing with an AI or a team
Brief format that works: the voice chart, the tone map row for the moment, 3 approved examples, the banned word list, the character budget. Then review against the chart, not against taste.

Banned-word starter list (AI and corporate filler, opinion drawn from GOV.UK words to avoid plus common machine tells): leverage, utilize, seamless, robust, empower, unlock, elevate, supercharge, streamline, cutting-edge, next-generation, world-class, revolutionize, delve, journey (non-literal), in today's fast-paced world, it's not just X, it's Y.

## Do and don't
| Don't | Do |
|---|---|
| Voice = "Friendly, innovative, human" | Voice chart row: "Vocabulary: use the customer's words (books, not ledgers). Ban: leverage, seamless." |
| "Oops! Payment failed!" | "Your payment did not go through. You have not been charged." |
| "Woohoo! Profile updated!!" | "Profile updated." |
| Humor in a 2FA lockout | Straight instructions, a support link |

## Worked example: calm meditation app
Attributes: Calm, not sleepy. Warm, not sugary. Clear, not clinical. Dials: casual 4, serious 2, respectful 1, matter-of-fact 2. Vocabulary: "practice" not "workout"; ban "crush", "hack", "optimize". Verbosity: short sentences, never stacked imperatives. Punctuation: no exclamation marks at all (brand-specific override). Rewrites:
- "Streak lost! Don't give up!" to "Your streak reset. Start fresh whenever you're ready." (positive contraction OK; no negative contraction)
- "Error: audio failed to load" to "This session did not load. Check your connection, then try again."
- "Unlock Premium to supercharge your mindfulness journey" to "Get the full library: 400 sessions, offline listening."
- "Are you sure you want to delete?" to "Delete 'Morning reset' from your downloads?" [Delete download] [Keep]
- "Congratulations!!! 10 days!" to "10 days in a row. That's a habit forming."

## Hand-offs
- `website-strategy`: brand positioning and personality inputs.
- design-graphic: visual identity should share the voice attributes.
- design-motion: motion personality should match tone dials.
