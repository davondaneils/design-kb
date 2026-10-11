# Research: UX microcopy

Status key: **C** consensus, **R** research-backed, **P** practitioner opinion, **X** contested.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Error guidelines: show next to the source; noticeable, redundant, accessible indicators (never color alone); match severity; do not show errors prematurely; human-readable; concise and precise; constructive; positive tone, no blame, avoid "invalid" and "incorrect", skip humor; prevent likely mistakes; preserve input; reduce correction effort; briefly educate. | Neusesser and Sunwall, "Error-Message Guidelines", NN/g, 2023 | C |
| 2 | 98% of benchmarked ecommerce sites use generic error messages; 2% adaptive. Some users took up to 5 minutes on simple sign-in errors. Write 4 to 7 messages for complex fields (card, password, phone, email). Example: "This email address is missing part of the domain (such as '.com')." Caveat: specific sign-in errors reveal which accounts exist; use rate limits or skip adaptive messages on sign-in and reset. | Scott, "Adaptive validation error messages", Baymard, 2023 | R |
| 3 | Confirmation dialogs: reserve for destructive or costly actions; offer undo instead where possible; name the item and consequence; descriptive buttons ("Delete file" / "Keep file") not Yes/No; no default on Yes; typed confirmation only for the rarest severe cases; allow "don't ask again" for routine ones. | Nielsen, "Confirmation Dialogs", NN/g, 2018 (reviewed 2026) | C |
| 4 | Empty states: communicate status (but never show "no records" while loading); provide learning cues ("Star your favorites to list them here"); provide direct pathways (a Create button, demo data). Types: no favorites or recent, no alerts, unpopulated dashboard, no search results, empty output. | Kaplan, "Designing Empty States", NN/g, 2021 | C |
| 5 | Placeholders as labels hurt memory, review, error recovery, contrast and screen reader support. Use visible labels outside the field; placeholders only for supplementary examples. | NN/g, "Placeholders in Form Fields Are Harmful", 2014, reviewed 2018 | C |
| 6 | Deck-of-cards onboarding tutorials did not improve task performance in NN/g research. Prefer contextual tips at the moment they are actionable. If used: visible Skip, few cards, one concept per card. Onboarding is warranted when the app needs user info, depends on preferences, or has unfamiliar key features. | Kendrick, "Mobile-App Onboarding", NN/g, 2020 | R |
| 7 | WCAG 2.5.3 Label in Name (A): the accessible name must contain the visible label text; best practice puts it first. | W3C Understanding SC 2.5.3 | C (standard) |
| 8 | WCAG 3.3.1 Error Identification (A), 3.3.2 Labels or Instructions (A), 3.3.3 Error Suggestion (AA), 4.1.3 Status Messages (AA), 2.4.4 Link Purpose in Context (A), 2.4.6 Headings and Labels (AA). | W3C WCAG 2.2 | C (standard) |
| 9 | Link labels: the 4 Ss, specific, sincere, substantial, succinct. | NN/g video "Better Link Labels" | C |
| 10 | Users see about the first 11 characters (about 2 words) of list items while scanning; for 35% of tested links the first 11 characters gave no idea of the destination. Strong links front-load plain, user and action terms. | NN/g, "First 2 Words: A Signal for the Scanning Eye" | R |
| 11 | Confirmshaming (guilt-worded decline options such as "No, I don't want to stay alive") is a recognised deceptive pattern; cited alongside FTC Act s.5 and ROSCA enforcement. | deceptive.design | C |
| 12 | Write like you speak ("Invalid ID" to "You need an ID that looks like this: someone@example.com"); start statements with a verb; cut "you can"; avoid "there is/are". | Microsoft Writing Style Guide, top 10 tips | C |
| 13 | Use "select" not "click": not all users click. | GOV.UK A to Z style guide | C |
| 14 | Specific button copy wins over generic in some tests and loses in others; "Submit" beat cute variants once. | WiderFunnel via CMI | R (weak) |

## Conflicting views
- Inline validation timing: NN/g says avoid premature errors. Rule adopted: validate a field on blur (when the user leaves it), then re-validate live once an error is showing so it clears as soon as it is fixed.
- Humor in errors: NN/g says skip it; brand-led products use warmth in low-stakes moments. Adopted: no humor in errors; warmth allowed in success and empty states only.

## Sources
- https://www.nngroup.com/articles/error-message-guidelines/
- https://baymard.com/blog/adaptive-validation-error-messages
- https://www.nngroup.com/articles/confirmation-dialog/
- https://www.nngroup.com/articles/empty-state-interface-design/
- https://www.nngroup.com/articles/form-design-placeholders/
- https://www.nngroup.com/articles/mobile-app-onboarding/
- https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html
- https://www.w3.org/TR/WCAG22/
- https://www.nngroup.com/videos/better-link-labels/
- https://www.nngroup.com/articles/first-2-words-a-signal-for-scanning/
- https://www.deceptive.design/types/confirmshaming
- https://learn.microsoft.com/en-us/style-guide/top-10-tips-style-voice
- https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/
