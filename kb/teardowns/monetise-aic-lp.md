# Monetise AI Income Challenge: squeeze page and long registration page

- **URLs:** https://event.monetise.com/lp?country=US (the page the ad sends to; tracking parameters dropped) and https://event.monetise.com/?country=US (the long-form version of the same offer).
- **Status:** exemplar for direct response and funnel pages, named by Davon on 2026-10-28: "this is a example of world class" for conversion. Judge cold-traffic opt-in pages, squeeze pages, free event and challenge registrations and quiz front doors against this file first.
- **Davon's call on scoring (2026-10-28):** the small misses noted in the first read (CTA pulse under reduced motion, placeholder-only field labels, empty alt text, two numbers for one earnings fact) carry no weight against this page. Do not mark the page down for them. When we build our own page in this pattern, the house build still ships reduced motion and visible labels, because they cost nothing in conversion; that is a build detail, not a critique of the exemplar.
- **Measured:** 2026-10-28, Playwright Chromium, desktop 1440x900 and phone 390x844 (iPhone user agent, `isMobile`). Computed styles via `getComputedStyle`; CTA motion sampled every 100ms; paint timings from one lab run (`PerformanceObserver`), not field data. Funnel steps after the opt-in are read from comments in the page's public inline scripts; the form was opened and an empty submit tried, never a real sign-up.
- **Screenshots:** `kb/exemplars/shots/monetise-aic-lp-390-light.jpg`, `monetise-aic-lp-1440-light.jpg`, `monetise-aic-lp-390-optin.jpg` (the opt-in modal), `monetise-aic-root-1440-overview.jpg` (the long page in three columns). Annotated teardown page: https://claude.ai/artifact/9Z4ztSoJvV4gVtPtQ1bVwc
- **Traffic:** cold paid social. The ad name in the link was `AIC_LC_AD439_H1_AI_AVOCADOTOAST_STORYBRIDGE_SAVERS_9x16` (Instagram Reels, broad 18 to 65): a story ad aimed at savers, so the page assumes the story is already told.
- **Strongest in:** copy, UX (the opt-in), hierarchy, conversion, measurement.
- Everything below is measured unless marked **opinion**.

## Measured values (/lp)

| Area | Value |
|---|---|
| Build | Framer (meta generator), server-rendered HTML, `robots=noindex` |
| Page length | 981px at 390, 1144px at 1440: the whole page is one phone screen plus the footer |
| Exits | No nav. Two links: Privacy Policy and Terms. Every other target is the opt-in. |
| Families | `Inter Display` 700 (h1), `Mona Sans` Regular, Medium, Bold (body, pill, banner), `Mounsta` (CTA label, wide display caps), `Inter` 800 (banner button) |
| H1 | 48/57.6 (1.2), -1.5px (-0.031em) at 1440, 1000px wide, 2 lines; 24/28.8 (1.2), -1px (-0.042em) at 390 |
| H1 color split | Ink `#000` with the number and the timeframe only ("$373 Per Day", "5 Days") in green `#008C3A`: 3.73:1 on the `#EBEBEB` page, passes as large bold text |
| Subhead | 16/23.2 at 1440 (800px wide, 2 lines), 14/21 at 390 (4 lines), Mona Sans 400 |
| Banner | Sticky (`position: sticky`), lime `#D0FE16` field. 16px at 1440 on one line with a pill button at the right; 12/15 Bold at 390 on two lines with a full-width black button below |
| Live pill | Red dot plus "LIVE VIRTUAL EVENT: NOV 7TH - NOV 15TH", 12px Mona Sans 500, dates in bold |
| Primary CTA | "SAVE MY FREE SPOT", 401x52 at 1440, 367x55 at 390 (full width less 11px each side). Fill `#D0FE16`, black 18px label, radius 50px, glow `0 0 20px rgb(141,176,0)`, brand glyph before the label |
| CTA motion | Endless scale pulse 1.000 to 1.050 and back, period about 1.3s, JS-driven (Framer), so `document.getAnimations()` is empty. Runs with `prefers-reduced-motion: reduce` too. |
| Under the CTA | Two icon plus italic lines: "No showing your face", "No experience needed" (12px, +0.48px tracking) |
| Page ground | `#EBEBEB` light grey; presenter cut out on a lit stage whose chevrons point inward at the face and the CTA |
| Paint (390, lab) | FCP 1.42s, LCP 1.43s, 160 requests, about 1.6MB by content-length, 7 ad pixels (Meta x4 IDs, TikTok, Google Ads x7 IDs, X, Taboola, AppLovin) plus Clarity, Varify, FirstPromoter, Whop tracking |

## Measured values (opt-in modal)

| Area | Value |
|---|---|
| Trigger | Every CTA opens the same modal; the page never shows a form |
| Card | Dark (`#0F1012` inputs on near-black), headline "Enter your details", line "Enter your details below and join our WhatsApp group." |
| Fields | 3: full name, email, phone. 58px tall, 16px text (stops iOS focus zoom), radius 14px, 1px `rgba(255,255,255,.14)` border |
| Field attributes | `autocomplete="name"`, `"email"`, `"tel"`; `inputmode="email"` and `"tel"`; `autocapitalize="words"` on name, `"none"` on email; `spellcheck="false"` on email; `enterkeyhint="next"`, `"next"`, `"go"` |
| Phone | Country flag and dial code preset from Framer's geo lookup (a `Server-Timing: country;desc=US` entry on the navigation response), E.164 parsed as the last fallback |
| Validation | `novalidate`, own inline errors, one at a time ("Please enter your name.") |
| Button | "GET MY FREE TICKET →", 58px tall, radius 29px, same lime. The word changes from "spot" to "ticket" (**opinion:** the value of the thing claimed rises at the moment of commitment). |

## The long page at the root (13,006px at 1440, 16,142px at 390)
Order, with the job each block does (**opinion** on the jobs):
1. Hero: "I Challenge YOU To Build A $373/Day AI Side Hustle In Just 5 Days" (a dare, not a promise), proof line "$155M+", CTA, the same two reassurances. Black stage, where /lp is light: a theme and headline variant, likely under test.
2. Ticker of the partner's numbers ("$5.4B Valuation", "Growing Faster Than OpenAI & Facebook").
3. The news hook: "I've made a huge investment in the fastest-growing AI company in history. Here's what that means for you."
4. "Your 5-Day AI Income Blueprint": five episode cards, each a big numeral, a curiosity title ("The Untapped Digital Goldmine"), three bullets and a date and time ("NOVEMBER 9TH · 1 PM EASTERN TIME"). Read as a TV schedule.
5. Proof staircase: $8.9M, $15M, $31M, $41M, then $155,174,554 to the dollar, each with a leaderboard screenshot.
6. "All The Details": What, When, Where in three cards.
7. "What You'll Learn For FREE in 5 Days": six fascination cards, each with a mini chart or photo.
8. "Why Should You Listen To Us?": origin story on a vertical timeline ("It All Started With A Kid, A Laptop, And A Single Mom").
9. "If This Works, Why Is It Free?": the reason why, answered with the host's own interest ("every time you make money, I make money too").
10. "Quick Recap" (What, When, Where again), then "Claim Your Spot Below. You'll get the confirmation sent to your email address."
CTA count: 9, about one per screen at 1440.

## The funnel behind it (from the page's script comments; steps 4 to 7 not walked)
1. Story ad on Reels, creative-tested (the UTM names the hook, the format and the audience).
2. /lp squeeze, split-tested by Varify against other variants.
3. Modal opt-in: name, email, phone; contact data and a visitor id carried on every internal URL.
4. Thank-you page with a vTurb video; the player variant is saved per visitor ("VSL Variant").
5. A $15 paid upgrade ("VIP" and "FTK" offers) on the thank-you page, each in a named live split test ("VIP V4 hook test", "FTK V1/V2 video test"), with a decline page.
6. WhatsApp group through Sendflow invite links that carry UTMs and contact, for reminders and show-up.
7. Five live sessions, then the sale on Whop.
Attribution: UTMs stored for 45 days (localStorage, cookie fallback), written onto every internal link, checkout link and WhatsApp invite, and sent to the payment webhooks, so the sale weeks later is credited to the ad.

## Signature moves
1. **Page length follows the ad's job.** The story ad sells; /lp only converts, in one screen. The long argument lives on a separate URL for traffic that has not seen the story. (Measured lengths above; the split is the lesson, **opinion**.)
2. **The banner finishes the ad's sentence.** "To celebrate my investment in Higgsfield AI, I'm hosting a 5-Day Challenge..." First person, mid-thought, ending on an ellipsis the headline closes. Message match by voice, not only by keywords.
3. **The action is never off screen.** A sticky banner button plus the hero CTA; on the long page a CTA about once per screen.
4. **Specific odd numbers, coloured.** "$373 Per Day", "5 Days", "$155,174,554": only the number and the timeframe take the accent. Specific figures read as measured (Caples, *Tested Advertising Methods*; Schwartz, *Breakthrough Advertising*).
5. **Three "without"s, then one proof line.** "...without needing to quit your job, without needing to get on camera, and without needing prior experience." Then "$100 million in tracked, verified earnings." Each clause removes one objection the ad's viewer already holds.
6. **Reassurance at the point of decision.** The top two objections repeat directly under the button, 12px italic with icons.
7. **A real date is the urgency.** A live pill with the event dates. No countdown timer anywhere on either page.
8. **Two-step opt-in.** One tap first, then a form in a modal: a small yes before the big one (Cialdini, *Influence*, commitment and consistency; Freedman and Fraser 1966, foot-in-the-door).
9. **The CTA claims a thing, first person.** "Save my free spot" (free, limited, mine), then "Get my free ticket" in the form.
10. **Phone captured for show-up.** The WhatsApp group is where a free live event wins attendance (**opinion**; the script comments show the group links are a tracked step).
11. **Reason why, as a headline.** "If This Works, Why Is It Free?" names the sceptic's thought and answers with self-interest (Hopkins, *Scientific Advertising*, 1923).
12. **Proof as a rising staircase.** Each result beats the last, so the method reads as improving.
13. **Curriculum as a schedule.** Dated episodes make free content feel like a show you would miss (Walker, *Launch*; Brunson, *Expert Secrets*).
14. **Test everything, lose no attribution.** Live split tests on the page, the video and the upgrade; UTMs kept from click to payment.
15. **Fast first frame despite heavy tags.** The hero is server HTML, so 7 pixels do not hold back a 1.4s LCP on a phone.

## Where it deviates from FOUNDATIONS and the house rules
Data for the editor-in-chief, not a mark against the exemplar (Davon, 2026-10-28):
- The CTA pulse runs forever and under reduced motion (house: design-motion 01, WCAG 2.2.2). Our builds keep the pulse on a one-action page and stop it under `prefers-reduced-motion: reduce` (design-motion 01, rule on the single primary CTA).
- Placeholder-only field labels (house: design-ux 03, WCAG 3.3.2). Our builds keep the field look and add a visible or floating label.
- Empty `alt` on the presenter image.
- One earnings fact said two ways ($100 million on /lp, $155M+ on the root). Our builds keep one number per fact (design-playbook-landing non-negotiable 6).
- Income claims as the headline. Our offers do not sell income; for an earnings offer, follow the FTC's guidance on earnings claims (FTC, Notice of Penalty Offenses Concerning Money-Making Opportunities, 2021).

## Borrow / Do not borrow
- **Borrow:** all 15 signature moves; the field attributes table as is; the sticky banner on a squeeze page; one accent colour on the number and the timeframe only.
- **Do not borrow:** the specific income promise for a non-income offer; seven ad pixels where one analytics tool and one ad pixel answer the question (**opinion**).
