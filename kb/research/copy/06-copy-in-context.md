# Research: Copy in context, and the v0.2 source gaps

Researcher run, 2026-10-10. Status key: **C** consensus, **R** research-backed, **P** practitioner opinion, **X** contested, **M** measured or derived here.

## Access notes (honest limits)
- `curl` through the proxy reached developer.apple.com only. nngroup.com, gov.uk, punchy.co, veryshortcopy.com, learn.microsoft.com and m3.material.io were refused (HTTP 403 on CONNECT). WebFetch reached productmarketingalliance.com, punchy.co/blog, verygoodcopy.com, webexpo.net, polaris-react.shopify.com, styleguide.mailchimp.com, ftc.gov and ecfr.gov. WebFetch returns a model summary of the page; quotes below were checked to appear as quoted text in that summary, and the critic re-fetched a 20 percent sample.
- **Apple HIG Writing** (v0.1 ticket 2): fetched as JSON from `developer.apple.com/tutorials/data/design/human-interface-guidelines/writing.json`, page change log "December 16, 2025 Clarified guidance on language patterns, and added guidance for possessive pronouns." Quotes are verbatim from the JSON text nodes.
- **Practitioners** (v0.1 ticket 1): Emma Stratton's primary material is a book (Make It Punchy) and a paid course; the reachable pages carry only article titles and summaries. Eddie Shleyner's site lists products, no lessons in the fetched page. Kinneret Yifrah's reachable source is a conference talk abstract. All three stay **leads, not support** for any rule (source policy tier 5), except one Punchy blog title used as an opinion label. X.com compilations were not attempted (x.com refuses fetches).

## Key findings

| # | Claim | Quote (under 40 words) | Source | Accessed | Tier | Status |
|---|---|---|---|---|---|---|
| 1 | Keep a list of common terms and reuse it so language stays consistent. | "Create a list of common terms, and reference that list to keep your language consistent." | Apple HIG, Writing, https://developer.apple.com/design/human-interface-guidelines/writing (JSON endpoint above) | 2026-10-10 | 1 | C |
| 2 | Buttons and links: almost always a verb; clarity over cleverness. | "When labeling buttons and links, it's almost always best to use a verb. Prioritize clarity and avoid the temptation to be too cute or clever with your labels." | Apple HIG, Writing | 2026-10-10 | 1 | C |
| 3 | Pick one capitalization style per element type and apply it everywhere. | "Choose a style for each UI element type and use it consistently throughout your app" | Apple HIG, Writing | 2026-10-10 | 1 | C |
| 4 | Multi-step flows: one consistent set of step labels; "Done" ends the flow. | "decide how you want to label the actions that take people from one step to the next" | Apple HIG, Writing | 2026-10-10 | 1 | C |
| 5 | Possessive pronouns sparingly and never switch perspective; avoid "we" in UI, especially errors. | "try not to switch perspectives. Avoid using we altogether because it may be unclear who the "we" in question refers to." | Apple HIG, Writing (added Dec 16, 2025) | 2026-10-10 | 1 | C |
| 6 | Empty states: give the next step and a control to take it; do not put crucial information there. | "Remember that empty states are usually temporary, so don't show crucial information that could then disappear." | Apple HIG, Writing | 2026-10-10 | 1 | C |
| 7 | Errors: close to the problem, no blame, say how to fix; skip "oops". | "Interjections like "oops!" or "uh-oh" are typically unnecessary and can sound insincere." | Apple HIG, Writing | 2026-10-10 | 1 | C |
| 8 | Settings labels: say what the setting does when on; the off state is inferred. | "Describe what it does when turned on, and people can infer the opposite." | Apple HIG, Writing | 2026-10-10 | 1 | C |
| 9 | To send someone to a setting, link to it; do not describe the path. | "If you need to direct someone to a setting, provide a direct link or button, rather than trying to describe its location." | Apple HIG, Writing | 2026-10-10 | 1 | C |
| 10 | Use numerals; commas from four digits; avoid shortening numbers. | "Use commas for numbers with four or more digits. Avoid shortening numbers." | Shopify Polaris, Grammar and mechanics, https://polaris-react.shopify.com/content/grammar-and-mechanics | 2026-10-10 | 1 | C |
| 11 | Times use the 12-hour clock with am or pm (US product voice). | "Use the 12-hour clock, followed by am or pm" | Shopify Polaris, Grammar and mechanics | 2026-10-10 | 1 | C |
| 12 | Dates: full month name, 3-letter abbreviation when space is short. | "Use the month's full name. If there isn't enough space, use 3-letter abbreviations." | Shopify Polaris, Grammar and mechanics | 2026-10-10 | 1 | C |
| 13 | Spell out a number only when it starts a sentence. | "Spell out a number when it begins a sentence. Otherwise, use the numeral." | Mailchimp Content Style Guide, Grammar and mechanics, https://styleguide.mailchimp.com/grammar-and-mechanics/ | 2026-10-10 | 1 | C |
| 14 | Abbreviate large numbers (1k, 150k) only where space is tight, such as a chart. | "Write out big numbers in full. Abbreviate them if there are space restraints, as in a tweet or a chart: 1k, 150k." | Mailchimp Content Style Guide | 2026-10-10 | 1 | C |
| 15 | Times: numerals plus am or pm with a space. | "Use numerals and am or pm, with a space in between." | Mailchimp Content Style Guide | 2026-10-10 | 1 | C |
| 16 | Advertising claims must be truthful, not misleading, and substantiated. | "federal law says that ad must be truthful, not misleading, and, when appropriate, backed by scientific evidence." | FTC, Truth in Advertising, https://www.ftc.gov/news-events/topics/truth-advertising | 2026-10-10 | 1 | C |
| 17 | A "former" or regular price used for a savings claim must be the bona fide price offered on a regular basis; others' prices must be factual. | "bona fide price at which the article was offered to the public on a regular basis" | 16 CFR 233.1, Guides Against Deceptive Pricing, https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233 | 2026-10-10 | 1 | C |
| 18 | Lead B2B messaging with customer value; the technology can come later. | "Simple tech messaging secret: The tech can wait" (article title) | Punchy blog, https://www.punchy.co/blog | 2026-10-10 | 4 | P (opinion) |
| 19 | Microcopy guides, motivates and delights; it covers buttons, forms, errors, fields. | "Microcopy is the words on your digital product, that are guiding, motivating and delighting users." | Kinneret Yifrah, WebExpo 2018 talk abstract, https://webexpo.net/prague2018/talk/microcopy-your-users-will-fall-in-love.html | 2026-10-10 | 5 | P (lead only) |

## Measured and derived here (method recorded)

| # | Finding | Method | Status |
|---|---|---|---|
| M1 | The combined dashboard's answer sentence said weekly active users were "up 12.4%, the third rise in a row". The page's own chart data (`cur` array in `dashboard.src.html`) gives 44,600 to 48,210 = +8.09 percent, and eight consecutive weekly rises (weeks 5 to 12). | Recomputed from the array in the page source. | M |
| M2 | The combined coffee page's band said "15% under shop price" for an $18 subscription bag. Shop prices on the same page are $21, $19 and $18: savings of 14.3, 5.3 and 0 percent. The claim is true for one coffee of three. | Arithmetic on the card prices. | M |
| M3 | The combined coffee page states the freshness promise four ways: "within two days of the roast", "never more than three days old when it ships", "Roast to door 48 h", "leaves the roastery two days after roasting at most". "To door" and "ships" are different promises; "three days" contradicts "two". | Read every string with a number on the page (claims inventory, 52 strings). | M |
| M4 | The combined dashboard's warning says "since Tuesday" and "Since Oct 7". Oct 7, 2026 is a Wednesday. | `new Date(Date.UTC(2026, 9, 7)).getUTCDay()` = 3. | M |
| M5 | Mixed clocks: the dashboard used 24-hour "14:05" while its audience copy is US English ("times in PT"). Polaris and Mailchimp both specify 12-hour with am or pm. | Rows 11 and 15. | M |
| M6 | A KPI caveat "Undercounted since 2:05 pm" (26 characters) wrapped to two lines in the 390 px two-column KPI grid at `--text-xs`; "Partial since 2:05 pm" (21 characters) fits on one line. | Rendered with `tools/render.mjs` at 390 and read the screenshot. | M |
| M7 | Dates broke across lines ("Tue, Oct / 13") and a range broke inside itself ("1,100 to / 2,100") until no-break spaces were set inside them. | Renders at 1440 (band note) and 390 (shop heading). | M |

## Conflicting views
- **Shortening numbers.** Polaris: "Avoid shortening numbers." Mailchimp: abbreviate "in a tweet or a chart". Dashboards (Stripe, Linear, by observation from memory; not measured, exemplar hosts blocked) show "$184.2k" in tiles. Adopted: full numbers in sentences and tables; compact numbers only in KPI tiles and chart axes, with the full value in the accessible name or tooltip.
- **"We" in copy.** Apple: avoid "we" in UI. Polaris: refer to the company as "we" but keep it out of content where possible. Brand marketing pages (Ember & Oak) speak as "we" by design. Adopted: "we" is fine for a brand speaking on a marketing page; never in product UI errors or system messages, where the subject is the thing that failed ("Top pages didn't load").
- **Possessives.** Apple: sparingly, never switch perspective. v0.1 already called first-person CTAs ("Start my trial") a test idea, not a rule. The combined coffee page used "Start a subscription", "Start my subscription" and "Your first bag" on one screen: three perspectives. Adopted: one perspective per page; second person ("your") by default.

## Sources
- https://developer.apple.com/design/human-interface-guidelines/writing (fetched as https://developer.apple.com/tutorials/data/design/human-interface-guidelines/writing.json)
- https://polaris-react.shopify.com/content/grammar-and-mechanics
- https://styleguide.mailchimp.com/grammar-and-mechanics/
- https://www.ftc.gov/news-events/topics/truth-advertising
- https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-233
- https://www.punchy.co/blog
- https://webexpo.net/prague2018/talk/microcopy-your-users-will-fall-in-love.html
- Unreachable this run: nngroup.com, gov.uk style guide, learn.microsoft.com, m3.material.io, veryshortcopy.com, atlassian.design (WebFetch client error). verygoodcopy.com reached, but the page had no lesson text.
