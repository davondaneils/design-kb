# Tests: design-copy

## Run 2: rendered, through design-director (v0.2, 2026-10-10)

Brief and rubric: `kb/briefs/copy/06-copy-in-context.md` (editor-in-chief). Pages, lint JSON, screenshots: `kb/tests/design-copy/`.

**Method.** The baseline is the pair Davon picked 3 of 3 (`kb/tests/combined/coffee.html`, `dashboard.html`), copied to `kb/tests/design-copy/before/` and linted again here. The with-skill pages start from the same sources and change only strings, plus one CSS rule the dashboard caveat needs (`.kpi .caveat`, `--space-2`, `--text-xs`). Every change is a scripted, asserted replacement (`kb/tests/design-copy/rewrite.py`: 19 coffee, 14 dashboard, 7 state sheet), so the diff between before and after is the copy and nothing else. Build: `node kb/tests/design-copy/build.mjs` (same inlined Newsreader and Inter subsets as the combined pages; copy needed no new face, so the news that Google Fonts is now reachable changed nothing here). Routing: design-director, design-playbook-landing and design-playbook-dashboard, design-copy for both (premium brand site and product UI); `copywriting` deliberately not used, per the director's copy rule. **Clean context:** the "without" page is the existing combined page, written by another session before v0.2 existed.

Three critic/tester rounds were used. Round 1: the rewrite. Round 2, after the first render: an italic turn on a filler word ("*grown*"), a date split across lines ("Tue, Oct / 13"), a 3-line answer sentence that repeated the KPI value, an alert body that said the undercount a third time. Round 3, after the phone render: the KPI caveat wrapping in the 2-column grid at 390, a range split inside "1,100 to / 2,100", the category word missing from the first phone screen.

### Lint (`node tools/lint.mjs`, any fail = fail)
| Target | Before (combined) | After (design-copy) |
|---|---|---|
| coffee.html and `?state=` added, subscribed, error, sending | 0 fail, 21 warn each (18 targets under 44px at 390, 3 fluid display sizes) | 0 fail, 21 warn each (same) |
| coffee-states.html | 0 fail, 14 warn | 0 fail, 14 warn |
| dashboard.html, `?density=compact`, `?open=palette`, `?open=sheet` | 0 fail; 27, 27, 28, 34 warn | 0 fail; 28, 28, 29, 34 warn |
| dashboard `?state=` loading, empty, partial, viewer | 0 fail; 8, 8, 12, 28 warn | 0 fail; 8, 8, 13, 28 warn |
| dashboard-states.html | 0 fail, 35 warn | 0 fail, 35 warn |

The one new warning is the lint's `fallback` check: at 390 the overview shifts 21px if the web fonts fail, because the new KPI caveats and alert text wrap differently in Liberation Sans (the stand-in for Arial here; the metric overrides were tuned for Arial). The before page shows the same check on its viewer state (14px at 1440). Warning, not fail; logged as gap 3.

### Claims inventory (`skills/design-copy/assets/claims_inventory.mjs`, new in v0.2)
- Before coffee: exit 1, RELATIVE "this Friday" in shipping copy. After coffee: exit 0; 54 claims listed, each ticked against the card prices, the roast log in `build.mjs` and the ledger.
- Before and after dashboard: exit 0 mechanically. The false numbers were found by the reconciliation step (recomputing from the chart array), which the script cannot do. That is why fundamental 13 is `[judged]`.

### What changed, and why (gate misses on the before pages)
| Page | Before | After | Rule |
|---|---|---|---|
| Dashboard | "Weekly active users are up 12.4%, the third rise in a row." | "Weekly active users are up 8.1%, the eighth rise in a row." (chart data: 44,600 to 48,210; eight rises) | 13 truth |
| Dashboard | KPI "+12.4% vs last week" | "+8.1% vs last week" | 13 |
| Coffee | "15% under shop price." ($18 against $18, $19, $21) | "Shop price is $18 to $21 plus shipping." | 13; 16 CFR 233 |
| Coffee | Freshness said four ways: "within two days of the roast", "never more than three days old when it ships", "Roast to door 48 h", "two days after roasting at most" | "ships within 48 hours of its roast" everywhere; facts row "Roast to ship 48 h" | 14 one promise |
| Coffee | "Your first bag ships this Friday." | "Order by Mon, Oct 12 for the Tue, Oct 13 roast." (no-break inside dates) | absolute dates |
| Coffee | "Start a subscription", "Start my subscription", "Subscribe", newsletter "Sign up" | "Subscribe, $18 a bag", "Subscribe for $18 a bag", "Subscribe", newsletter "Get the letters" | one verb per action, one perspective, price-paired CTAs |
| Coffee | Secondary "Buy a bag, $21" | "Buy this bag, $21" (the hero shows one bag) | 5 |
| Coffee | Label "This week's single origin" (no category word on the first phone screen; the lead line falls below 844px) | "This week's single-origin coffee" | 1 clarity |
| Coffee | Lead "Roasted light in small batches and on its way to you within two days of the roast." | "Single-origin coffee, roasted in Portland every Tuesday and Friday. Every bag ships within 48 hours of its roast." | 1, 14 |
| Coffee | "Three coffees we can't stop *drinking*" | "Three coffees, grown 1,100 to 2,100 *meters up*" (the page's altitude concept; true for all three; no-break inside the range) | 2 nobody else could say it |
| Coffee | Steps "Buy direct / Roast in small batches / Ship within 48 hours" (labels; step 2 repeated the manifesto's 12 kilos) | "We know every grower by name / Two of us taste every batch / It leaves within 48 hours of the roast"; step 1 points to the ledger beside it | statement headings, proof next to claim |
| Coffee | "dropped at 10:10", "New York C price, Sept 30", "Over the Fairtrade floor" | "Out at 10:10", "Commodity price (New York "C"), Sep 30", "Times the Fairtrade minimum" | 3 jargon, mechanics |
| Coffee | "metres", "twelve kilos" mid-sentence | "meters", "12 kilos" | 15 mechanics |
| Coffee state sheet | Sold out: "Next roast Tuesday. We will email you." (no email captured) | "Back after the Tue, Oct 13 roast." | honesty, absolute dates |
| Dashboard | "since 14:05", "for 2 hours" (actually 2 h 53 min at 16:58) | "stopped at 2:05 pm", "since then" | 13, 15 clock |
| Dashboard | Warning "since Tuesday" plus "Since Oct 7" (a Wednesday) | "Started Wed, Oct 7" | 15 weekday |
| Dashboard | Conversion and revenue tiles looked healthy during the outage | Caveat "Partial since 2:05 pm" on both tiles | caveat at the point of reading |
| Dashboard | Alert body repeated the undercount (third time on screen) | "No checkout_completed events since then. Other events are still arriving." plus "Open in Events" (the page's one label for that destination) | say it once; 7 glossary |
| Dashboard | "Compared to: previous period", legend "This period" | "previous 12 weeks", legend "Last 12 weeks" (the date chip's words) | 7 glossary |
| Dashboard | "Retry"; row menu announced "Hide from report: done"; "Export started" | "Try again"; "/pricing hidden from this report"; "Exporting top pages as CSV" | announcements are copy |
| Dashboard | Viewer: "Ask Priya Shah" | "Ask Priya Shah for access" | 6 link says what it does |

### Judged items
- Checklist rows 3, 11, 12, 13, 14 and 15 hold on the after renders and state sheets as on the before (copy did not touch color, icons or radius). Row 11 is stronger: the data caveats are words, not only alert color.
- Every string in every state passes the 16 design-copy fundamentals (read on `shots/*-state-*.png` and both state sheets).

### Exemplar comparison
Made against **measured teardowns** this time (the coordinator's exemplar library branch: `kb/teardowns/apple-macbook-air.md`, `stripe-home.md`, `linear-home.md` and their screenshots; read, not committed here), not memory.
- **Coffee vs the Apple MacBook Air product page** (teardown: "one number per claim", footnote markers on every claim, price and Buy on the first screen, a short headline over the product name): the copy is now **close**. Price is in both first-screen buttons; every number is single and true; the H1 is the product plus one fresh fact, as Apple's is the product plus a pun. Short of Apple: no footnote system for claims that need one (48-hour shipping, "2.3x"), and the hero carries two supporting paragraphs where the Linear teardown measures one 10-word supporting line. The page as a whole stays **clearly below** Apple, as in the combined test, because of photography, not copy.
- **Dashboard vs Stripe and Linear** (teardowns: Stripe's proof numbers are exact and dated, "$1.9T in payments volume processed in 2025"; case studies in one line; Linear's hero is one headline and one 10-word line): copy is **close**. The answer sentence, caveats and alerts are as exact as Stripe's proof numbers and each says one thing once. Product UI copy cannot be compared pixel to pixel: the teardowns cover marketing pages; Linear's app UI appears only as a hero mock-up with issue titles, not states.
- **The gain is measurable but quiet.** On a thumbnail the after pages look like the before pages. The gain is that a reader who checks the numbers now finds them true and no promise contradicts another. A blind visual rank cannot see that, so no blind pairs were prepared; a fact check can.

### Verdict
**Pass on the copy rubric.** Gate 100 percent: lint 0 fails on all 15 targets, claims inventory clean, every claim ticked. Clearly better than the before pages: 7 truth or consistency misses and 10 mechanics, glossary or clarity misses fixed, no new fails. Against the exemplar bar the copy is close; the coffee page as a whole remains clearly below Apple on imagery (other domains).

### Gaps (v0.3 or other domains)
1. Footnote or source markers for claims that need substantiation (Apple pattern) are not taught. design-copy v0.3.
2. Hero density: two supporting paragraphs against one 10-word line in the Linear teardown. Test a single supporting line on the coffee hero.
3. `fallback` lint warning at 390 on the dashboard: strings near a wrap boundary shift when the web font fails. design-frontend (metric overrides for Liberation Sans) plus a copy rule to keep tile strings well under their wrap length.
4. The claims inventory reads static HTML; JavaScript-built strings (success messages, announcements) must be checked from a string table. A string table export for test pages would close this (design-frontend).
5. Practitioner sources (Stratton, Shleyner, Yifrah) still not reached as primary material.

### Screenshots
`kb/tests/design-copy/shots/`: coffee and dashboard at 390 and 1440, light and dark; both state sheets in both themes; `coffee-state-subscribed`, `dashboard-state-partial`, `dashboard-state-empty`, `dashboard-state-viewer`. Before: `kb/tests/combined/shots/`. Copies of the four final shots: `/mnt/project-files/design-kb/wave/copy/`.

---

## Run 1: text-only test (v0.1, 2026-10-09)

Kept for history. Superseded by run 2.


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
