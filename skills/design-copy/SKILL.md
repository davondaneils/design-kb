---
name: design-copy
description: Website copy structure and UX writing for sites and apps. Use when writing or reviewing hero headlines, subheadlines, section copy, CTAs and link labels; page outlines for homepages, landing pages, product and studio sites; UX microcopy such as buttons, form labels and hints, error messages, empty states, confirmation dialogs, success messages, onboarding, notifications and permission prompts; voice and tone guides, tone maps and style mechanics; readability, scannability and plain language rewrites; copy docs, string tables, localization-ready copy, and copy testing. Triggers include "write the copy for this page", "rewrite this headline", "what should this button say", "error message", "empty state", "microcopy", "UX writing", "content design", "voice and tone", "make this easier to read", "fix our homepage copy". For long-form persuasion, sales letters, VSLs and email sequences use the copywriting skill instead; for positioning use website-strategy.
---

# design-copy

Words are interface. This skill writes and reviews the copy that sits inside layouts: marketing pages and product UI. It leads with a fundamentals gate, then the expert moves.

**Reuse, do not duplicate:**
- `copywriting` (the user's direct response skill): awareness levels, big idea, leads, offers, long-form sales pages, VSLs, emails. Call it for persuasion depth.
- `website-strategy`: positioning, ICP, brand strategy. Its output is this skill's input.
- `sales-funnels`: funnel steps, offer stacks, plan naming and price framing, A/B test programs. This skill still owns pricing page feature lists, FAQ mechanics and button labels.
- Sibling design-kb skills: design-layout (hierarchy), design-typography (measure, scale), design-ux (flows, confirm vs undo), design-frontend (aria, i18n code), design-color (danger and success roles), design-motion, design-graphic, design-search (titles, SERP copy).

## 1. Fundamentals gate (check first; one miss fails the work)

**Clarity**
1. The hero (headline or subheadline) says what it is and who it is for. Test: if a visitor reads only this, do they know what you sell? Visitors decide in about 10 seconds (NN/g).
2. No noun-free slogans, no "Welcome to X", no "Powered by AI" as the value. Every claim passes Harry Dry's three tests (practitioner): visualize it, falsify it, nobody else could say it.
3. Plain words. Sentences over 25 words get split (GOV.UK). Specialist terms explained on first use.
4. Front-load headings, links, list items, buttons and notifications: scanners see about the first 2 words (NN/g).

**Actions**
5. Buttons start with a verb and name the result, sentence case: "Save changes", "Send $250", "Delete project". Never Yes/No/OK/Submit for consequential actions.
6. Links say where they go. No bare "Learn more" or "Click here". If the visible text must be short, the accessible name is unique and starts with the visible text (WCAG 2.4.4, 2.5.3).
7. Same word for the same thing and the same action, everywhere (glossary).

**Forms and errors**
8. Labels visible and outside the field; placeholders are examples only (NN/g).
9. Errors sit next to the field, say what is wrong and how to fix it, never blame, never joke, never rely on color alone (icon + text with `--color-danger`), and keep the user's input (NN/g; WCAG 3.3.1, 3.3.3, 1.4.1).
10. Status messages that appear without focus change are announced (WCAG 4.1.3).

**Honesty**
11. No confirmshaming ("No, I hate saving money"). Decline options are neutral: "No thanks", "Not now".
12. No invented numbers, testimonials or logos. If a proof point is not supplied, write a bracketed placeholder `[number of customers]` and say so.

**Mechanics**
13. Sentence case for headings, buttons, tabs and menus. Numerals for numbers. One mechanics sheet everywhere. No em dashes (house rule).
14. Real copy in every layout; test the longest realistic string.

## 2. Page copy: the decision rules (deep: references/01-page-copy-structure.md)

**Diagnose in layer order** (Wynter, practitioner): 1 Clarity (what is it), 2 Relevance (is it for me), 3 Value (do I want it), 4 Differentiation (why you); proof and friction run under every layer. Fix the earliest failed layer first; a differentiation tweak cannot save a page that fails clarity.

**Hero kit**
- H1: 4 to 10 words. Category plus outcome, or differentiator, or the ad's exact promise (message match).
- Subheadline: 1 to 2 sentences, 15 to 30 words. Sentence 1 what and for whom; sentence 2 how it is possible or the top objection answered (Shapiro, practitioner).
- Primary CTA: verb + outcome, 2 to 4 words, continuing the headline ("Start matching invoices").
- Risk reducer under the CTA: 3 to 8 words killing the top friction ("14 days free. No card needed.").
- Proof directly under the hero: logos, a real number, or one named quote.
- Clever headline allowed only if the subheadline alone passes the "only this text" test.

**Default homepage order:** nav, hero, proof strip, optional problem block, 3 to 6 benefit blocks (each mapped to one objection), how it works in 3 steps, deep proof, pricing or teaser, FAQ (5 to 8 objections), final CTA repeating the hero promise, footer.

**Feature block:** header is a benefit with a concrete noun or number ("Matches 9 in 10 invoices automatically", only if true), not a label ("Smart matching"). Body 15 to 40 words: what it does, then the objection it kills.

**CTA ladder:** high commitment "Start free trial"; medium "See pricing", "Watch 2 minute demo"; low "Read the Acme case study". One primary per view. First-person CTAs ("Start my trial") are a test idea from a single unreplicated study, not a rule.

## 3. Microcopy: the decision rules (deep: references/02-ux-microcopy.md)

- **Destructive echo pattern:** title asks with verb + object, body states the consequence, primary button repeats the verb. "Delete 'Q3 plan'?" / "This deletes the plan and its 14 tasks for everyone. You cannot undo this." / [Delete plan] [Keep plan]. Never a bare "Cancel" button in a dialog about cancelling something.
- **Undo beats confirm** for reversible actions ("Archived. Undo"). Routine confirmations train people to click through (NN/g). Typed confirmation only for irreversible, high-blast-radius actions.
- **Adaptive errors:** one message per validation rule, not per field. 98% of ecommerce sites use generic errors (Baymard); write 4 to 7 variants for email, phone, card, password. **Exception:** sign-in and password reset stay generic to avoid revealing which accounts exist.
- **Error formula:** [what is wrong] + [how to fix], one sentence, no "invalid/error/failed" as lead word. System errors add what is safe: "Your draft is safe on this device." Support code goes last: "(Ref: 7F3A)".
- **Validate on blur**, then live once an error shows so it clears immediately.
- **Empty states by type:** first use (value + one action), cleared (confirm, light tone), no results (echo the query, suggest a fix), not permitted (why and who can help). Never "No data" while loading (NN/g).
- **Success:** the specific outcome plus next step: "Sent. M. Okafor will get $250 by Fri, Oct 10."
- **Money buttons show the amount:** "Pay $48.00".
- **Absolute dates for money, deadlines and legal timing** ("Arrives by Fri, Oct 10"; "Cancel before 5 pm ET today"). Relative words ("Friday", "tomorrow") break across time zones and late-night sessions. Relative is fine for low-stakes recency ("2 hours ago").
- **Toggles and checkboxes:** the label names the setting, positively, and the control shows the state ("Email me receipts", not "Disable receipt emails" and never "Turn on/off").
- **Onboarding:** default to none; teach in context at the moment of need. NN/g found card tutorials did not improve performance. Justified only to collect needed info, set preferences, or explain a genuinely unfamiliar feature.
- **Permission prompts:** explain the benefit before the system dialog; buttons "Turn on" / "Not now".
- **Notifications:** lead with the news, not the app name.
- **AI features** (partly opinion): name the user goal not the tech ("Draft a reply", not "Ask AI"; NN/g 2025); label generated content where it could be mistaken for the user's own; set expectations once near the input; always offer [Use this] [Try again] [Edit].

## 4. Voice and tone (deep: references/03-voice-and-tone.md)

- Voice is constant; tone moves with the reader's state (Mailchimp). Clarity outranks personality.
- Build a voice as rules, not adjectives: 3 to 4 attributes each with a "not" boundary ("Warm, not cute"), placed on NN/g's 4 tone dimensions (formal/casual, serious/funny, respectful/irreverent, matter-of-fact/enthusiastic) as 1 to 5 dials, then a Podmajersky voice chart (rows: concepts, vocabulary, verbosity, grammar, punctuation, capitalization).
- **Tone map:** list the product's 8 to 12 moments and set the dials for each. The worse the reader's moment, the closer every dial moves to serious, respectful, matter-of-fact. Enthusiasm never exceeds the reader's.
- **Resolved conflict:** Microsoft says use contractions; GOV.UK says avoid negative ones. Default: positive contractions fine in casual voices; write "cannot", "do not" in instructions, warnings, legal and to-be-translated text, because "can't" and "can" differ by one letter a scanner misses.
- Requirement verbs: "must" (legal), "need to" (required), "can" (optional). Never "may be able to" (GOV.UK).
- Vocabulary comes from customers: mine reviews and tickets for exact phrases (Copyhackers, practitioner).

## 5. Readability (deep: references/04-readability-scannability.md)

- Users read about 20% (at most 28%) of a page's words; only about 18% of added words get read (NN/g 2008). Put the must-read sentence in the first 111 words.
- Target grade: consumer marketing 5 to 7 (Unbounce 2024: 11.1% conversion vs 7.1% at grade 8 to 9, correlation); general 6 to 8; specialists 10 to 12 ceiling (NN/g). Experts want plain language too.
- Sentences 15 to 20 words average, 25 maximum. Paragraphs one idea, 1 to 3 sentences on the web, 5 maximum.
- Marketing and help headings say something ("Refunds take 5 to 10 days"), not label ("Refunds"). App chrome is the exception: screen titles, nav, tabs and settings groups are short nouns naming the place ("Invoices"), because they are wayfinding.
- Answers start with the answer ("Yes. Go to Settings, then Billing.").
- Measure 45 to 75 characters, 66 ideal; body line-height 1.5 (shared foundation; detail in design-typography).

## 6. Process, localization, testing (deep: references/05-content-design-process.md)

- Message hierarchy before wireframes; copy-first wireframes; a string table with key, context, state, string, max characters, translator note.
- Translation growth (IBM via W3C): strings up to 10 characters grow 200 to 300%; 11 to 20 grow 180 to 200%; over 70 grow about 130%. Buttons and tabs wrap or grow, never truncate.
- No text in images. No string concatenation; use full-sentence messages with placeholders and plural rules.
- Test: 5 second test for the hero; layer test for marketing pages; highlighter test for long copy; first-click test for labels; A/B only with traffic (see `sales-funnels`).
- AI draft QA: strip filler (leverage, seamless, unlock, elevate, supercharge, delve), "it's not X, it's Y" constructions, adjective triplets and unfalsifiable claims; rewrite with customer phrases.

## 7. Slot budgets (opinion calibrated to NN/g reading data and the shared type scale)

| Slot | Words | Characters |
|---|---|---|
| Hero H1 | 4 to 10 | 20 to 60 |
| Subheadline | 15 to 30 | 90 to 180 |
| Button | 1 to 4 | under 25 (translation room) |
| Risk reducer | 3 to 8 | under 50 |
| Feature header / body | 3 to 8 / 15 to 40 | under 50 / under 250 |
| Error message | 1 sentence, about 15 words | |
| Toast | under 10 | |
| FAQ answer | 20 to 80, answer first | |

## 8. Workflow for any copy task
1. Identify the slot type (page, UI element, system) and load the matching reference.
2. Collect inputs: who, what, the one thing they must understand, the action, proof available, top objections, voice chart if one exists. If proof is missing, use bracketed placeholders, never invent.
3. Draft against the slot budget.
4. Run the fundamentals gate (section 1). Fix every miss.
5. Run the expert pass: layer order, echo pattern, adaptive errors, tone dials, translation growth.
6. Deliver: the copy laid out by slot (element, string, notes), the 1 to 3 decisions a reviewer should know, and a test to validate it. For a review, list fixes in gate-first order with before and after.

## 9. Output format
Present copy as a slot table or annotated outline, not loose paragraphs, so a designer can paste it into a layout:

| Element | Copy | Note |
|---|---|---|
| H1 | ... | layer it answers, character count |
| Button | ... | action, state |

Offer 2 to 3 headline options only when the brief leaves positioning open; recommend one and say why.
