# Tests: design-copy v0.1

Method: each brief answered twice by the same model, once as a strong generic assistant (no skill) and once following `skills/design-copy/SKILL.md` and the matching reference. Scored 0 to 10 on five criteria drawn from the skill's own rules. **Gate** is pass/fail first: any fundamentals miss caps the total at 20/50.

Rubric: (1) Clarity and specificity (Dry tests, "only this text"), (2) Action and label quality, (3) Accessibility and error handling, (4) Fit to brief and voice, (5) Expert moves and honesty (no invented proof, tested decisions).

---

## Brief 1: B2B SaaS hero and page outline
"Write the hero and section outline for Ledgerline, a SaaS that automatically matches invoices to bank payments for small accounting firms. Works with Xero and QuickBooks. 14 day free trial."

### Generic output (abridged)
- H1: "Reconciliation, Reimagined."
- Sub: "AI-powered invoice matching that saves your firm hours every week."
- CTAs: "Get Started Free" / "Book a Demo"
- Proof: "Trusted by 500+ accounting firms"
- Sections: Features ("Smart Matching", "Seamless Integrations", "Powerful Reporting", each with "Learn More"), Testimonials ("Ledgerline changed how we work!" Sarah, CPA), Pricing, CTA "Ready to transform your workflow?"

### With-skill output (abridged)
| Element | Copy | Note |
|---|---|---|
| H1 | Match every invoice to every payment, automatically. | Clarity layer: category plus outcome, 8 words |
| Sub | Ledgerline reads your bank feeds and invoices and pairs them for you. It flags only the ones it is not sure about. | What and how; no unproven number |
| Primary CTA | Start matching free | Continues the H1 verb |
| Risk reducer | 14 days free. Works with Xero and QuickBooks. | Kills the top objection: will it fit our stack |
| Proof strip | [Number of firms using Ledgerline] or [2 to 4 client logos] | Placeholder: brief supplied no proof |
| Block 1 | Header: "Matches [X in 10] invoices on its own" / body: what happens to the rest (review queue) | Objection: will I still have to check everything? |
| Block 2 | "Connects to Xero and QuickBooks in 2 minutes" | Objection: setup effort (time must be verified) |
| Block 3 | "Every match has an audit trail" | Objection: compliance |
| How it works | Connect your bank. Import invoices. Approve the matches. | 3 steps, verbs first |
| FAQ | "Is my client data secure?" "Does it handle partial payments?" "What happens after the trial?" | Answer-first |
| Final CTA | Start matching free | Same verb as hero |
Plus: a 5 second test plan (pass if 4 of 5 say "matches invoices to payments for accountants") and the layer each block answers.

### Scores
| Criterion | Generic | With skill |
|---|---|---|
| Gate | **Fail**: noun-free slogan H1, "Powered by AI" as value, "Learn More" links, Title Case buttons, invented "500+ firms" and testimonial | Pass |
| Clarity and specificity | 3 | 9 |
| Labels | 4 | 9 |
| Accessibility | 5 | 8 |
| Fit | 5 | 9 |
| Expert and honesty | 2 | 9 |
| **Total** | **19 (capped 20)** | **44** |

---

## Brief 2: Banking transfer microcopy
"Write the microcopy for a money transfer flow in our banking app: amount, recipient account number, review, success, and a dialog to cancel a scheduled payment."

### Generic output (abridged)
- Amount error: "Insufficient funds." Account error: "Invalid account number."
- Review button: "Confirm". Success: "Transfer successful! 🎉"
- Cancel dialog: "Are you sure you want to cancel this payment?" [Yes] [No] (or [Confirm] [Cancel])

### With-skill output (abridged)
- Amount: label "Amount", hint "Available: $1,240.18"; error "That is more than your available $1,240.18. Enter a smaller amount."
- Account number: hint "8 to 12 digits"; adaptive errors: "Account number is too short. It needs at least 8 digits." / "Account numbers only use digits 0 to 9."; name check "This account belongs to M. Okafor." [Send to M. Okafor] [Change account].
- Review: "Send $250 to M. Okafor?" / "Arrives by Fri, Oct 10. You cannot cancel after 5 pm today." / [Send $250]
- Success (announced via `role="status"`): "Sent. M. Okafor will get $250 by Friday."
- Cancel dialog: "Cancel your $120 payment to Hydro One on Oct 15?" / "It will not be sent. You can set it up again anytime." / [Cancel payment] [Keep payment]. Notes why a bare "Cancel" is banned in this dialog.

### Scores
| Criterion | Generic | With skill |
|---|---|---|
| Gate | **Fail**: Yes/No on a money action; "Invalid" errors with no fix; emoji carrying meaning in a money moment | Pass |
| Clarity | 5 | 9 |
| Labels | 3 | 10 |
| Accessibility and errors | 3 | 9 |
| Fit (tone for money) | 4 | 9 |
| Expert | 2 | 9 |
| **Total** | **17** | **46** |
Gap found: success copy mixed "by Friday" and the review's "Fri, Oct 10". For money and deadlines, relative dates are ambiguous across time zones and late-night sessions. **Fixed:** SKILL.md now says use absolute dates (with weekday) for money, deadlines and legal timing.

---

## Brief 3: Voice and tone for a calm meditation app
"Create a voice and tone guide for Stillwater, a calm meditation app, and rewrite: 'Streak lost! Don't give up!', 'Error: audio failed to load', 'Unlock Premium to supercharge your mindfulness journey', 'Are you sure you want to delete?', 'Congratulations!!! 10 days!'"

### Generic output (abridged)
Voice: "Calm, Supportive, Encouraging, Mindful." Do: use gentle language. Don't: be pushy. Rewrites: "Oops! Your streak ended, but every day is a fresh start!", "Oops! We couldn't load your audio. Please try again.", "Upgrade to Premium and deepen your mindfulness journey", "Are you sure you want to delete this?", "Amazing! 10 days of mindfulness!"

### With-skill output (abridged)
Attributes with boundaries (Calm, not sleepy; Warm, not sugary; Clear, not clinical); NN/g dials (casual 4, serious 2, respectful 1, matter-of-fact 2); voice chart rows (vocabulary: "practice" not "workout", banned: crush, hack, optimize, unlock, supercharge, journey; punctuation: no exclamation marks, a brand override of the default); tone map for 9 moments (session start, streak reset, payment failed, cancellation, and so on). Rewrites:
- "Your streak reset. Start fresh whenever you're ready."
- "This session did not load. Check your connection, then try again."
- "Get the full library: [number] sessions and offline listening." (placeholder, count not supplied)
- "Delete 'Morning reset' from your downloads?" [Delete download] [Keep]
- "10 days in a row. That's a habit forming."

### Scores
| Criterion | Generic | With skill |
|---|---|---|
| Gate | **Fail**: humor ("Oops") in errors, "Are you sure" with no object, exclamation-heavy | Pass |
| Clarity | 5 | 9 |
| Labels | 4 | 9 |
| Accessibility | 6 | 8 |
| Fit to "calm" | 4 | 10 |
| Expert | 3 | 9 |
| **Total** | **22 (capped 20)** | **45** |

---

## Trigger check
- Fires: "rewrite our hero", "what should this button say", "error messages for signup", "voice and tone guide", "make this FAQ easier to read", "empty state copy". All match description phrases.
- Stays quiet or defers: "write a long-form sales letter" and "VSL script" (description routes to `copywriting`), "build a webinar funnel" (`sales-funnels`), "pick a palette" (design-color). Pass.
- Risk: "landing page" appears in both this skill's and `copywriting`'s descriptions. Resolution in SKILL.md: this skill owns structure, slots and microcopy; `copywriting` owns long-form persuasion. Acceptable; flag for design-director routing.

## Result
**Pass.** With-skill wins every brief by 23 to 29 points and clears the gate; generic fails the gate on all three. With-skill outputs are what a top content design team would ship, given that bracketed proof placeholders are filled with real data.

## Gap list (sent to domain-specialist)
1. Absolute dates for money and deadlines. **Fixed** in SKILL.md and references/02.
2. v0.2: add worked examples for a pricing page feature table and a settings screen (labels, helper text, toggles: label states what is on, not the action).
3. v0.2: Apple HIG Writing could not be fetched (needs JavaScript); verify alignment on capitalization (Apple uses title case for some iOS button and menu contexts) and add a platform note.
