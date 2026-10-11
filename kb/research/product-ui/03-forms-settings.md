# Research 03: Forms and settings pages

Researcher, 2026-10-09. Access method and status codes as in research 01. Field-level form research lives in `kb/research/ux/03-forms.md` and is not repeated.

## Key findings
1. Polaris settings layout: labels and descriptions in a left column, grouped settings in cards on the right, groups stacked vertically. Example code collapses to one column below `md`.
2. Primer saving: start with explicit save; use automatic saving for imperative controls and when people expect instant feedback; never mix the two in one form.
3. Polaris contextual save bar appears when the form has unsaved changes and offers Discard.
4. Primer degraded experiences: never disable an interactive control because of an availability problem; explain instead.
5. Stripe splits settings into Personal, Account and Product categories; Vercel into account or team settings and project settings. Settings follow scope.

## Conflicting views
Danger zones and typed confirmation (type the project name to delete) are common in developer tools but no fetched tier 1 or 2 source documents the pattern. Treat as opinion; design-ux reference 01 already prefers undo over confirm for frequent actions and confirm only for rare, irreversible, costly ones.

## Claim table
| ID | Claim | Quote (under 40 words) | URL | Tier | Status |
|---|---|---|---|---|---|
| S1 | Left column labels and descriptions | "In the left column, glanceable labels and descriptions are listed" | https://polaris-react.shopify.com/patterns/app-settings-layout | 2 | P |
| S2 | Right column cards | "In the right column, settings are grouped in cards" | https://polaris-react.shopify.com/patterns/app-settings-layout | 2 | P |
| S3 | Stack groups | "Stack all setting groups vertically on the page." | https://polaris-react.shopify.com/patterns/app-settings-layout | 2 | P |
| S4 | Start with explicit save | "When designing a form, start with an explicit saving pattern." | https://primer.style/product/ui-patterns/saving/ | 2 | P |
| S5 | Never mix save patterns | "never mix save patterns in a single form." | https://primer.style/product/ui-patterns/saving/ | 2 | P |
| S6 | Autosave for imperative controls | "you should use automatic saving (and not explicit saving) for imperative controls." | https://primer.style/product/ui-patterns/saving/ | 2 | P |
| S7 | Autosave when instant feedback expected | "Automatic saving should be used when the user expects instant feedback from the change they made." | https://primer.style/product/ui-patterns/saving/ | 2 | P |
| S8 | Save bar on unsaved changes | "Become visible when a form on the page has unsaved changes" | https://polaris-react.shopify.com/components/internal-only/contextual-save-bar | 2 | P |
| S9 | Discard action | "Use the discard action to allow merchants the option to discard their changes." | https://polaris-react.shopify.com/components/internal-only/contextual-save-bar | 2 | P |
| S10 | Never disable for outages | "Never disable an interactive control that is non-functional due to availability issues." | https://primer.style/product/ui-patterns/degraded-experiences/ | 2 | P |
| S11 | Stripe settings categories | "The Dashboard's settings are broken into three categories: Personal, Account, and Product." | https://docs.stripe.com/dashboard/basics | 2 | P |
| S12 | Vercel settings types | "There are two different types of settings pages: Personal Account / Team Settings ... and Project Settings" | https://vercel.com/docs/dashboard-features | 2 | P |
| S13 | Enter submits explicit forms | "Explicitly saved forms can be saved by clicking a submit button or by pressing Enter while focused on an input." | https://primer.style/product/ui-patterns/saving/ | 2 | P |
