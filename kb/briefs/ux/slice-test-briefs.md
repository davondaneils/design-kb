# design-ux wave 2: rendered slice test briefs

Written by the editor-in-chief, 2026-10-10. The tester runs these and does not change them. Baseline: the combined pages (`kb/tests/combined/coffee.html`, `dashboard.html`), which Davon ranked 3 of 3 over the color pilot. Each brief is rebuilt from that baseline through design-director and its playbook with design-ux applied, so the gain is measured against the best pages the kb has, not a strawman.

## Brief UX-A: Ember and Oak, from interest to checkout (design-playbook-landing)
"Same homepage. Make it sell properly. A visitor must be able to: choose a coffee, choose how it is ground, choose one bag or a subscription and how often, see it in the cart, change or remove it, and reach checkout knowing the total. Phone navigation must reach every section. Every step and every failure is a real state."

States the page must expose by URL (`?state=`): menu (phone navigation open), quick (quick add with a grind choice), sub-error (subscription added with a choice missing), cart (two lines: a subscription and a bag), cart-empty, removed (undo available), checkout (handing off to checkout), plus the baseline newsletter states (error, sending, subscribed).

- Closest exemplars: apple.com product pages (the buy flow: one choice at a time, price always visible); family.co and mercury.com for calm.
- UX decisions the page must show: option controls and labels, defaults, error placement, subscription disclosure, cart feedback and announcement, totals and shipping before checkout, undo, phone navigation.

## Brief UX-B: Tally, the first ten minutes (design-playbook-dashboard)
"A new workspace has no data. Design the first run: what the owner sees before any event arrives, while Tally waits for the first event, when installation fails, and the moment real data arrives. No tour."

States by URL: first-run (sample data and setup guide), listening (waiting for the first event), check-failed (installation found a problem), first-data (first real events, partial metrics), plus the baseline states (ready, loading, empty, partial, viewer).

- Closest exemplars: Vercel Dashboard and Stripe Dashboard (their onboarding: a checklist on real UI, test data clearly marked), Linear (no tour).
- UX decisions the page must show: honest sample data, a setup checklist with a finish line, a live wait with a specific cause on failure, metrics that cannot compute yet say when they will, one primary action per state.

## Rubric (both)
**Gate (any miss fails):** `tools/lint.mjs` exits 0 on the page, every `?state=` URL and the state sheet; every `[judged]` row of the FOUNDATIONS checklist holds; every design-ux gate check (SKILL.md section 1) holds in every state.

**Exemplar closeness (close / clearly below / far below):**
1. Flow: the job completes in the fewest honest steps; no dead end; nothing discovered late.
2. States: each state is designed (copy, layout, focus target), not a hidden div with a sentence.
3. Calm: no modal or banner that is not earned; the visual system of the baseline is kept.
4. Craft: options, drawer and checklist look like parts of the same product, in both themes, at 390 and 1440.

**Pass** = gate 100 percent, rated close on 1 to 4, and clearly better than the baseline on flow and states.
