# Content design process: content first, handoff, localization, testing

## Principles
1. **Words before pixels.** Layout built around fake text breaks on real text. Write the message hierarchy first, then design the containers.
2. **Copy is a system.** Strings have keys, owners, character budgets and a single source of truth, like components.
3. **Copy is a differentiator, not a template.** Brett (Designjoy, practitioner on X): "If you're going to copy my business... at least write your own copy and design your own website."
4. **Test words cheaply and early.** A 5 minute comprehension test catches what a month of A/B testing would.

## Fundamentals (gate)
- Real copy in every design review; the longest realistic string tested in every slot (long names, big numbers, German).
- No text inside images (cannot be translated, read by screen readers, or found by search).
- No string concatenation in code ("You have " + n + " items"): word order and plurals differ by language. Use full-sentence strings with placeholders and plural rules (ICU MessageFormat style; hand-off: design-frontend).
- Every string traceable to one source (copy doc, CMS or string file), one owner.
- Inclusive by default: gender-neutral language, no idioms that do not translate, no ableist metaphors such as "crippled" or "lame" (common style guide consensus; specific word lists are opinion).

## Decision rules

### Workflow
1. **Inputs:** positioning (`website-strategy`), customer vocabulary (review mining), constraints (legal, localization languages).
2. **Message hierarchy doc:** for each page or screen, list in order: the one thing the user must understand, the action, the proof, the objections. Plain text, no design.
3. **Copy-first wireframe:** real headlines and button labels in grey boxes. Designers size to the copy.
4. **Copy doc / string table** for build: key, context (screen, element, state), string, max characters, notes for translators.
5. **Review against:** fundamentals gate, voice chart, readability targets, accessibility checks.
6. **Test** (below), ship, then measure.

### String table format
| Key | Screen / element | State | String | Max chars | Translator note |
|---|---|---|---|---|---|
| transfer.review.button | Transfer review, primary button | default | Send {amount} | 20 | {amount} includes currency symbol |
| transfer.error.over_balance | Amount field | error | That is more than your available {balance}. Enter a smaller amount. | 90 | |

### Localization
IBM expansion averages (W3C):

| English length | Expect translated length |
|---|---|
| up to 10 characters | 200 to 300% |
| 11 to 20 | 180 to 200% |
| 21 to 30 | 160 to 180% |
| 31 to 50 | 140 to 160% |
| 51 to 70 | 151 to 170% |
| over 70 | 130% |
Rules: buttons and tabs must wrap or grow, never truncate; design short-string slots for 2x to 3x; never rely on a pun or rhyme in UI; keep dates, currency and numbers in locale formats; avoid "Click here" style sentences built around a link because word order changes.

### Testing copy
| Method | Use for | How |
|---|---|---|
| 5 second test | Hero clarity | Show the hero 5 seconds; ask "What does this company do? Who is it for?" Pass if most answers match the brief (opinion on threshold: 4 of 5). |
| Layer test (Wynter) | Marketing pages | Rate clarity, relevance, value, differentiation with consistent scales plus "why"; fix the earliest failing layer first. |
| Highlighter test | Long copy | Readers mark green (clear, confident) and red (confusing, doubtful). |
| Cloze or comprehension | Instructions, legal | Ask readers to explain the next step in their words. |
| First-click test | Navigation and button labels | Did they pick the right label first? |
| A/B test | High-traffic pages only | One hypothesis per test; see `sales-funnels` for methodology. |

### AI-drafted copy QA
Practitioner consensus in 2025 to 2026 is that AI drafts read generic; NN/g 2025 also warns against "powered by AI" framing. Check every AI draft for: banned filler words (reference 03), "it's not X, it's Y" constructions, triplets of adjectives, claims that fail the falsify test, em dashes (house rule), and whether a competitor could sign it. Then rewrite with real customer phrases.

## Do and don't
| Don't | Do |
|---|---|
| Design the hero, then "fit copy" | Write the message hierarchy, then design |
| "Submit" key reused across 12 contexts | One key per context, so translators see each meaning |
| Truncated German button "Zahlung stor..." | Buttons that wrap to 2 lines or grow |

## Worked example: launching in German and Japanese
Audit the string table: every string under 20 characters gets a 2x to 3x layout check; buttons with fixed widths become min-width; concatenated strings become ICU messages with plural forms; hero puns are rewritten as plain claims before translation; dates move to locale formats; screenshots with baked-in English are rebuilt as live text. Japanese usually takes fewer characters than English, so short-string slots may look empty rather than overflow; line breaking and line height for CJK are typography decisions (opinion; hand-off: design-typography). Test both directions.

## Hand-offs
- design-frontend: i18n implementation, ICU plurals, `lang` attributes, live regions.
- design-ux: research methods for testing.
- `sales-funnels`: A/B testing and funnel measurement.
- design-search: content that answers search intent.
