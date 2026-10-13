# 06 Copy in context: strings on a rendered page

Copy that reads well in a doc can still fail on the page: a number that disagrees with the chart beside it, a promise said four ways, a date split across two lines, a caveat three panels away from the figure it qualifies. This chapter is the render pass. Run it after the layout exists and before the exemplar comparison (design-director section 5). Sources: design-kb `kb/research/copy/06-copy-in-context.md`; evidence: `kb/tests/design-copy.md` run 2. Tool: `assets/claims_inventory.mjs`.

## Floor: fundamentals (non-negotiable)

1. **Every number is a claim, and it is true.** Each number, percent, price, date, duration and comparison in the copy matches the data, price list, log or policy it describes. Recompute any derived figure (percent change, "Nth in a row", "X% under") from its source. Advertising must be "truthful, not misleading" (FTC); a savings claim needs a real regular price (16 CFR 233.1). `[judged]`, with `assets/claims_inventory.mjs` listing every claim to tick.
2. **One promise, one wording.** A fact stated in more than one place (hero, facts row, perks, steps, footer) uses the same number, unit and verb everywhere. "Ships within 48 hours of its roast" in all four places, never "two days", "three days old" and "roast to door" on one page. `[judged]`
3. **One verb per action, one action per verb.** The primary action's verb appears on every control that does it and on no control that does something else. `[judged]`
4. **Mechanics are one sheet, in the audience's locale.** `<html lang>` picks the row of the FOUNDATIONS locale table: en-US one 12-hour clock "2:05 pm" and dates as "Tue, Oct 13" (Polaris, Mailchimp); en-GB "5:30pm" and "Friday 15 January 2027", no comma, no ordinals (GOV.UK); the weekday checked against the year the date is in, numerals except at the start of a sentence (Mailchimp), one spelling system (US: "meters"; UK: "metres"), one perspective ("your", never "my" and "your" on one page; Apple HIG). `[judged]`; WEEKDAY, LOCALE and CLOCK are flagged by `claims_inventory.mjs`, which reads the page's `lang` (STYLE warns on am/pm spacing and weekday commas in the other locale's style).
5. **No split units.** No line break inside a date, a price, a range, a number and its unit, or a number and its count noun ("12&nbsp;people"; round 1 broke "12 / people" at 390, `kb/reviews/benchmark-round1-landing.md` gap 2). Use `&nbsp;` or `&#8239;` (narrow no-break space before units: "340&#8239;g"). `[judged]` on the 390 and 1440 renders.
6. **Every state string passes the gate,** including empty, loading, error, partial, not-permitted, success, toast and screen-reader-only announcements. A live region that says "done" fails rule 6 of v0.1's gate the same way a "Click here" link does. `[judged]`
7. **Copy changes never break the page.** Re-run `node tools/lint.mjs` with every `?state=` after a copy pass; longer strings can create overflow, target and measure fails. `[lint]`

## Standards
- FTC, Truth in Advertising; 16 CFR 233.1 and 233.2 (former and comparative prices). US law; other markets have equivalents (opinion: treat them the same way).
- WCAG 2.2: 4.1.3 Status Messages (announcements), 2.4.4 Link Purpose, 2.5.3 Label in Name, 1.4.1 Use of Color (caveats and alerts carry words, not only color).
- Apple HIG, Writing (updated Dec 16, 2025): consistent terms list, verbs on buttons, one capitalization style per element type, consistent flow labels, possessives sparingly, no "we" in UI errors, settings described by their on state, link to settings instead of describing the path.
- Shopify Polaris and Mailchimp content style guides for numbers, dates and times.

## Decision rules
- **If a sentence summarises a chart or table,** recompute its numbers from the data before shipping. If the data and the sentence disagree, the sentence is wrong.
- **If a summary sentence sits above a number tile,** do not repeat the tile's number. Say what the tile cannot: the streak, the cause, the caveat. ("Weekly active users are up 8.1%, the eighth rise in a row." The tile already shows 48,210.)
- **If a data problem affects a number,** put a short caveat on that number ("Partial since 2:05 pm") as well as in the alert. The alert explains; the caveat stops a misread at the point of reading.
- **If the same fact appears in an answer, a caveat and an alert,** each says something new. Answer: the consequence. Caveat: the scope. Alert: the diagnosis and the next step ("Other events are still arriving." / "Open in Events").
- **If two offers sit side by side,** put the price in both labels ("Subscribe, $18 a bag" / "Buy this bag, $21") and drop the percent claim. The gap is visible and true; "15% under" is a claim you have to keep true.
- **If a verb is the money verb** (Subscribe, Buy, Pay), reserve it. The newsletter on a subscription site is "Get the letters", not "Subscribe" or "Sign up".
- **If a word is trade jargon** ("dropped", "C price", "first crack"), keep it only where it earns its place and gloss it in the same string: "out of the roaster at 10:10", "Commodity price (New York 'C')". The chart can keep "First crack" as a labelled point; the caption cannot rely on it.
- **If a headline carries an italic turn,** the italic word carries the meaning ("every *two or four* weeks", "*meters up*"), never a filler word.
- **If a page shows times in more than one zone,** every time carries its zone or place ("lands 6:48 pm IST"), at every width; a collapsed layout keeps the zone. Round 1 printed "lands 6:48 pm" (India time) under "Rates locked 8:52 am ET" at 390 to 1023 (FOUNDATIONS Content mechanics; `kb/reviews/benchmark-round1-landing.md` gap 1). `claims_inventory.mjs` warns `ZONE`.
- **If a comparison word sits beside a number,** it agrees with the direction of that number as shown. FX quoted per USD falls when the currency gets dearer, so "BRL is 2.6% above its 30-day average" beside 5.4760 (average 5.6200) makes the reader invert the quote. Say what the reader pays: "BRL costs 2.6% more than its 30-day average", or show the rate in the direction of the word (`kb/reviews/benchmark-round1-app.md` item 13).
- **If a time-bound promise is dynamic** ("Order by Mon, Oct 12 for the Tue, Oct 13 roast"), it is generated from the roast calendar and logged in the string table as a computed string, never typed.
- **If a large number must be shortened** (KPI tile, chart axis), shorten only there and keep the full value in the accessible name or tooltip (Mailchimp: abbreviate "in a tweet or a chart"; Polaris: otherwise "avoid shortening").
- **If the product speaks in an error,** the subject is the thing that failed, not "we" ("Top pages didn't load"; Apple HIG). A brand marketing page may speak as "we".

## Numbers
| Item | Value | Source |
|---|---|---|
| KPI caveat at 390 px, 2-column grid, `--text-xs` | 21 characters or fewer stays on one line (measured: 26 wrapped) | M6, this run |
| Phone headline at `--text-display-2` (39 px min) | about 14 to 16 characters per line in Newsreader | read from the 390 render |
| Times | "2:05 pm", "3 pm" (no ":00") | Mailchimp |
| Dates | en-US "Tue, Oct 13"; en-GB "Tue 13 Oct", "Friday 15 January 2027"; full month name when space allows | Polaris; GOV.UK A to Z |
| Numbers | numerals; commas from 1,000; spelled out at sentence start | Polaris, Mailchimp |

## Ceiling: exemplar patterns
Exemplar hosts were blocked from this environment (`kb/exemplars.md`); the patterns below are from memory of public pages and are opinion until a teardown measures them.
- **Stripe Dashboard and Stripe marketing:** numbers in prose are exact and dated; price labels state the unit ("per successful card charge"); nothing claims a saving without the base price beside it.
- **Linear app:** empty and error states are one sentence of fact plus one action; announcements and toasts name the object ("Issue moved to Done").
- **apple.com product pages:** a fact is said once, in one wording, and repeated only as the same phrase; prices appear on buy buttons and in comparison tables with the unit.

## Signature moves
1. **Reconcile, do not proofread.** Read the copy against the data, not against itself. On the combined test pages the proofread copy was fluent and wrong three times: "+12.4%" where the data says +8.1%, "third rise" where it is the eighth, "15% under shop price" where it is 0 to 14%. Every prior review (critic, tester, Davon's blind rank) missed all three because none of them opened the data. Shipped example (from memory, not fetched): Stripe's changelog states the exact version and date of every change.
2. **The promise ledger.** List each promise once with its exact wording, then search the page for every restatement. Freshness was said four ways on the coffee page; two contradicted. One ledger line ("ships within 48 hours of its roast") replaced all four.
3. **Price-paired CTAs.** Two buttons, two prices, one verb each. The visitor does the subtraction; you make no claim that can go stale when a price changes.
4. **Caveat at the point of reading.** The checkout outage lived in an alert panel below the KPIs; the conversion and revenue tiles still looked healthy. A 3-word caveat on each affected tile fixes the misread where it happens. (Opinion, from the render; Linear and Vercel show "partial" or "incomplete" markers on affected values in a similar way, from memory.)
5. **Set the copy, do not type it.** No-break spaces inside "Tue,&nbsp;Oct&nbsp;13", "1,100&nbsp;to&nbsp;2,100", "2:05&nbsp;pm" and "340&#8239;g". Both breaks fixed here were invisible in the source and obvious on the render.
6. **Announcements are copy.** A screen reader user who hides a row hears "/pricing hidden from this report", not "Hide from report: done". Write live region strings in the string table next to the visible ones.

## Do and don't
| Don't | Do | Why |
|---|---|---|
| "Weekly active users are up 12.4%, the third rise in a row." (data: +8.1%, eighth) | "Weekly active users are up 8.1%, the eighth rise in a row." | Rule 1 |
| "15% under shop price." | "Shop price is $18 to $21 plus shipping." | Rule 1; 16 CFR 233 |
| "Start a subscription" / "Start my subscription" / "Subscribe" / newsletter "Sign up" | "Subscribe, $18 a bag" / "Subscribe for $18 a bag" / "Subscribe" / newsletter "Get the letters" | Rules 3 and 4 |
| "Since Tuesday" next to "Since Oct 7" (a Wednesday) | "Started Wed, Oct 7" | Rule 4 |
| "Checkout tracking has been down since 14:05" | "Checkout events stopped at 2:05 pm" | Rule 4 (US clock), names the event |
| "dropped at 10:10 and 207 °C" | "Out at 10:10, 207 °C" | Jargon glossed in place |
| Row menu announces "Hide from report: done" | "/pricing hidden from this report" | Rule 6 |
| Sold out: "Next roast Tuesday. We will email you." (no email captured) | "Back after the Tue, Oct 13 roast." | Promise you cannot keep; relative date |

## Worked examples

### A. Coffee subscription band (brief to finished copy)
Brief: an $18 subscription next to shop bags at $18 to $21, roast days Tuesday and Friday, ships within 48 hours. Before: "$18. A bag, shipping included. 15% under shop price. Your first bag ships this Friday." Checks: 15% is false for two of three coffees (rule 1); "this Friday" is relative and the roast calendar says the next roast is Tuesday (rule 4); "ships" vs the hero's "roasted" promise (rule 2). After: "**Any coffee, shipping included.** Shop price is $18 to $21 plus shipping. Order by Mon,&nbsp;Oct&nbsp;12 for the Tue,&nbsp;Oct&nbsp;13 roast." Button "Subscribe for $18 a bag". The saving is now visible (shipping plus up to $3) and stays true when a price changes.

### B. Dashboard answer sentence and alerts
Before: answer "Weekly active users are up 12.4%, the third rise in a row. Checkout tracking has been down since 14:05, so today's conversion and revenue are undercounted." Alert "No checkout_completed events for 2 hours." with "Since 14:05", updated at 16:58 (2 h 53 min, not 2 hours). After: answer "Weekly active users are up 8.1%, the eighth rise in a row. Checkout events stopped at 2:05 pm, so today's conversion and revenue are undercounted." Tiles: "Partial since 2:05 pm" on conversion and revenue. Alert title "Error: checkout events stopped at 2:05 pm", body "No checkout_completed events since then. Other events are still arriving.", meta "Last event 2:05 pm PT · Open in Events" (the same link label the page uses everywhere for that destination). Each of the three places now adds something.

### C. Pricing page feature table (v0.1 ticket 3)
Rules: row labels are outcomes with a unit, not feature names ("Events per month: 1 million", not "Event volume"); cells hold the value with its unit or a word, never a bare check where a limit exists ("Unlimited", "90 days", "Included"); a dash means "not included" and has the sr-only text "Not included" (1.4.1, 1.1.1); every price shows the period and what triggers it ("$20 per seat, per month, billed yearly"); footnotes only for conditions, never for the price itself. Plan names, anchoring and price framing go to `sales-funnels`. Example row set for Tally:

| | Free | Team | Business |
|---|---|---|---|
| Price | $0 | $20 per seat, per month | $45 per seat, per month |
| Events per month | 100,000 | 10 million | 100 million |
| Data kept for | 90 days | 2 years | 7 years |
| Single sign-on | Not included | Not included | Included |
| Button | Start free | Start a 14-day trial | Talk to sales |

The buttons use three different verbs because they do three different things (rule 3). Numbers are placeholders from the test fixture; use the real price list.

### D. Settings screen (v0.1 ticket 3)
Apple HIG: label the setting plainly and describe what it does when on. From the Tally shortcut sheet: label "Single-key shortcuts"; description "Shortcuts without Ctrl or Cmd, like / and G then O. Turn off if they clash with your screen reader or voice control."; saved confirmation "Single-key shortcuts off. Saved. Ctrl K still works." Rules: the label is a noun phrase naming the setting, not "Enable X"; the description says what happens when on and who should turn it off; the confirmation says the new state and what still works. Pointing to a setting from elsewhere is a link that opens it ("Open keyboard settings"), never a path ("Go to Settings > Keyboard > ...").

## Hand-offs
- design-typography `05-typographic-detail.md`: no-break and narrow no-break spaces, tabular figures for numbers in copy.
- design-ux and design-product-ui: which states exist; this chapter writes their strings.
- design-frontend: generated strings (dates from a calendar, plurals) and live regions.
- sales-funnels: plan names and price framing on pricing pages. copywriting: never on these two page types (design-director copy rule).
