# Brief: Content design process (content first, systems, localization, testing)

**Domain:** copy. **Skill:** design-copy.

## Question
How does copy get made, reviewed, shipped and tested inside a design process so layouts are built for real words?

## Decisions the reader must be able to make
- When copy is written relative to wireframes.
- How to hand copy to a build (copy doc, string keys, character budgets).
- How to make copy survive translation.
- How to test copy cheaply before and after launch.

## Fundamentals (non-negotiable)
- Real copy in every review; layouts tested with the longest realistic string.
- No text baked into images; no string concatenation.
- Every string has an owner and a source of truth.

## Expert layer
- IBM text expansion table for short strings (200 to 300% under 10 characters).
- Message testing by layer; 5 second tests; highlighter tests.
- A copy QA checklist that catches AI-generated filler.

## Must cover
Content-first workflow, copy docs, string keys, localization, inclusive language, accessibility of copy, testing, AI drafting guardrails.

## Out of scope or reuse
A/B testing statistics and funnels: `sales-funnels`. Build and i18n code: design-frontend.

## Test briefs
- "Our app is launching in German and Japanese. What breaks in our copy?"
