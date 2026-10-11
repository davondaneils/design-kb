# Research: Forms

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Average cart abandonment 70.22% (50 studies). Reasons: extra costs 40%, slow delivery 20%, distrust with card 19%, required account 18%, too long or complicated checkout 17%, errors or crashes 17%. | Baymard, updated Sep 2025 [1] | R (survey) |
| 2 | Average US checkout shows 23.48 form elements (14.88 fields); ideal 12 to 14 elements (7 to 8 fields). Outdated: Baymard's 2024 average is 11.3 fields (`kb/research/conversion/04-checkout-and-forms.md` C9); the ideal stands. | Baymard [1] | R |
| 3 | 14% of sites mark both required and optional fields (Baymard recommends marking both). 14% of users abandon when phone is required without explanation. 42% do not defer account creation to confirmation step. 47% do not make guest checkout most prominent. | Baymard [2] | R |
| 4 | Inline validation (Etre, 22 users): success +22%, errors -22%, satisfaction +31%, completion time -42%, fixations -47%. Validate after the field (on blur); keystroke validation only for strict-rule fields like passwords; "before and while" was worst. Persistent success messages beat fading ones. | Wroblewski, A List Apart 2009 [3] | R (small sample, caveated) |
| 5 | Baymard inline validation rules: no premature validation (validate on blur, or when a fixed-length field reaches its length); remove the error on the keystroke that fixes it; show positive validation. 31% of sites lack inline validation. | Baymard [4] | R |
| 6 | Placeholder-as-label fails 8 ways (memory, review, error fixing, keyboard users, mistaken for defaults, contrast, screen readers). Use visible labels outside the field; floating labels better than placeholder-only. | NN/g [5] | C |
| 7 | Inline labels caused problems in every Baymard test; acceptable only for single-field or very frequent two-field forms (search, sign-in). Floating labels lack in-depth testing; watch error state. | Baymard [6] | R |
| 8 | GOV.UK: start with one thing per page; write a question protocol (why, who, how checked, how kept) for every question; ask eligibility questions first; branch so users only see relevant questions; date of birth as 3 text fields. | GOV.UK Service Manual [7] | C (public sector, heavily tested) |
| 9 | Error summary at top of main content, above h1 below back link; always shown even for one error; focus moves to it; links to each field; "Error: " prefix on page title; heading "There is a problem"; wording identical to inline message. | GOV.UK Design System [8] | C |
| 10 | Errors: near the cause, high contrast and redundant cues, not color alone; plain language, specific, suggest fix, no blame, no humor; keep user input. | NN/g [9] | C |
| 11 | Disabled submit: no feedback, feels broken, low contrast, not focusable, easy to miss. Keep it enabled and validate on submit. | Adam Silver [10] | P (aligned with GOV.UK practice) |
| 12 | Keep submit enabled until submission starts, then disable plus spinner plus idempotency key; keep label while loading; focus first error on submit; correct `type`, `inputmode`, `autocomplete`; disable spellcheck on emails and codes; trim trailing whitespace; allow paste of OTP; warn on unsaved changes; input font 16 px or more on iOS to stop zoom. | Vercel [11] | P |
| 13 | WCAG 2.2: 3.3.7 Redundant Entry (A) - do not make people retype what they already gave in the same process; 3.3.8 Accessible Authentication (AA) - no cognitive function test (memorising, transcribing) without alternative; paste and password managers satisfy it. | W3C [12] | S |

## Conflicting views
- Positive validation: Baymard recommends it for all fields; Etre found checkmarks ambiguous ("correct" vs "valid"). Resolution: show it, but never imply a value is correct when you can only check format.
- Floating labels: practitioner favorite, under-tested. Default to labels above fields.

## Sources
1. https://baymard.com/lists/cart-abandonment-rate
2. https://baymard.com/blog/checkout-form-fields
3. https://alistapart.com/article/inline-validation-in-web-forms/
4. https://baymard.com/research-articles/inline-form-validation
5. https://www.nngroup.com/articles/form-design-placeholders/
6. https://baymard.com/research-articles/mobile-forms-avoid-inline-labels
7. https://www.gov.uk/service-manual/design/form-structure
8. https://design-system.service.gov.uk/components/error-summary/
9. https://www.nngroup.com/articles/error-message-guidelines/
10. https://adamsilver.io/blog/the-problem-with-disabled-buttons-and-what-to-do-instead/
11. https://vercel.com/design/guidelines
12. https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

## Added during critic pass
| # | Claim | Source | Status |
|---|---|---|---|
| 14 | NIST SP 800-63B Rev 4 (Aug 2025): single-factor passwords at least 15 characters (8 if only used within MFA); support at least 64; SHALL NOT impose composition rules or periodic changes; SHALL allow password managers and autofill; SHOULD allow paste and a show-password option; SHALL check a blocklist and tell the user why a password was rejected. | NIST [13] | S |
| 15 | GOV.UK text input: fixed-width classes for known-length content; labels above, sentence case, no colon; hints one short sentence, no links; no placeholders as label, hint or example; `autocomplete` required where a purpose exists (WCAG 1.3.5 AA); `spellcheck="false"` for names, emails, references; `inputmode="numeric"` for whole numbers, `decimal` for decimals; avoid `type="number"`. | GOV.UK Design System [14] | C |
| 16 | Prefer one full name field; if split, avoid "first/last", do not require a family name. | W3C Internationalization [15] | S (guidance) |

13. https://pages.nist.gov/800-63-4/sp800-63b.html
14. https://design-system.service.gov.uk/components/text-input/
15. https://www.w3.org/International/questions/qa-personal-names
