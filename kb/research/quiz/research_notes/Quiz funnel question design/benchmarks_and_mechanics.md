# Quiz funnel performance benchmarks and flow mechanics

Research date: 2026-10-29. Vendor bias warning applies to almost every number below: platform benchmarks are self-reported, observational, rarely state sample size, and are published by companies selling quiz software. Academic sources (survey methodology, operations management) are older but controlled.

## 1. Platform datasets: completion and lead rates, and how they vary with question count

### Takeaway
Platform start-to-finish completion clusters around 45 to 65% (Typeform 47%, Interact 65%), with start-to-lead around 40% (Interact). Shorter is better for completion (Outgrow: 3 to 7 questions 65 to 85% vs 16+ at 25 to 45%), but revenue-optimal ecommerce quizzes sit at 5 to 8 questions, and RevenueHunt sees conversion peak at 9 to 12. No vendor publishes a controlled 5 vs 7 vs 9 vs 12 comparison.

### Cited Findings
- Interact "Quiz Conversion Rate Report 2026" (updated 8 Sep 2026): portfolio average start-to-lead 40.1%, start-to-finish 65%. By vertical: coaching/courses 44.9% lead / 59.1% completion; ecommerce 37.6% / 55.5%; service providers 42.2% / 47.3%. Some quizzes exceed 80% lead capture, some get 0%. No sample size stated beyond "100M+ lifetime leads" since 2014; no breakdown by question count or gate placement. Observational, vendor. — [Interact](https://www.tryinteract.com/blog/quiz-conversion-rate-report/)
- ConvertFlow Lead Generation Quiz Funnel Benchmark, September 2026 (n = 1,063 campaigns from a 200k+ funnel database): mean lead capture rate 11.28% for quiz landing pages, 10.45% quiz embed, 7.06% dark embed; 7.85% across the four templates that record lead capture. Mean "conversion rate" (ConvertFlow's step metric) 23.84% across five templates; landing page 26.72%, embed 25.01%, dark landing page 15.14%, dark embed 12.80%. Note: ConvertFlow's lead capture is measured against views, not starts, so it is not comparable with Interact's start-to-lead. The page is internally inconsistent about what the 7.85% covers. — [ConvertFlow](https://www.convertflow.com/benchmark-reports/lead-generation-quiz-funnel-benchmark-september-2026)
- Outgrow (25 Jun 2025, "thousands of quizzes", no n): completion by length 3 to 7 questions 65 to 85%; 8 to 15 questions 45 to 65%; 16+ questions 25 to 45%; calls 7 the "sweet spot"; 10-question quiz target 50 to 65%. Start rate benchmark 40 to 60%. Time to complete 2 to 4 minutes. Each extra second of load costs about 7% completion. Progress bars "12 to 18% completion lift" (no test design given). Ranges, not measured points; vendor. — [Outgrow](https://outgrow.co/blog/quiz-engagement-benchmarks-completion-rates)
- Outgrow completion by traffic source: email subscribers 70 to 85%, Google search 55 to 70%, partner/affiliate 40 to 65%, social media 45 to 60%, paid ads 35 to 50%. About 60% of quiz traffic is mobile. Completion by type: personality 60 to 80%, assessment 45 to 65%, product recommendation 40 to 60%. — [Outgrow](https://outgrow.co/blog/quiz-engagement-benchmarks-completion-rates)
- Typeform (data year 2023; 2.6M forms, 568M responses in 2023): average completion 47.3% vs "industry average" 21.5%; forms with the most responses had fewer than six questions; visuals (image/video) associated with a 120.6% completion increase; "exclusive language" +25%; starting with a number +7%. Correlational, vendor, older than 2024. — [MarTech Series on Typeform report](https://martechseries.com/?p=353042); Typeform help page states 47% average (opened to submitted) — [Typeform Help](https://help.typeform.com/hc/en-us/articles/360029615911)
- RevenueHunt (Shopify product quizzes; article dated 23 Feb 2023, so older; 1,905 quizzes with 25+ responses over 180 days, deduped to 1,092; broader base 20,000+ stores): median question count of top-third quizzes by revenue per completion (RPC) is 5 (cosmetics), 6 (skincare, pets, food/drink), 7 (haircare, supplements, fashion). Across 20,000 stores, conversion rate is highest at 9 to 12 questions (conversion only, not RPC). Top performers use about 3.3 to 4.4 answer choices per question. 79% of top-converting quizzes use exactly one results page; bundle/routine results are 59 to 82% of top-third recommended products. About 1 in 5 quiz-attributed orders land more than 30 days after the quiz. — [RevenueHunt](https://revenuehunt.com/quiz-creation-mistakes-that-hurt-your-ecommerce-sales/)
- RevenueHunt docs: ideal length 6 to 12 questions, "7 to 8 being the most common length for top-converting quizzes"; healthy completion 60 to 70% on a 7 to 8 question quiz; each question answerable in under 5 seconds; 3 to 6 options; a question taking 2 to 3x longer than others signals confusion. A/B tests need "at least a few hundred starts per version." — [RevenueHunt docs](https://docs.revenuehunt.com/customer-success/reduce-dropoff/)
- Riddle case study, Club Med: 8 gamified quizzes over 4 weeks, 72% completion, 83% opted in to future content; gate placement and quiz length not stated; date not stated. Single cherry-picked vendor case. — [CaseStudies.com / Riddle](https://www.casestudies.com/company/riddle/case-study/club-med-boosts-opt-ins-to-83-with-riddle)

### Inferences
- A reasonable planning baseline for a 7-question quiz on cold mobile traffic: start rate 40 to 60% of landers, completion 50 to 65% of starters, so roughly 20 to 40% of landers finish. These are vendor ranges, so treat them as priors to beat, not targets.
- Completion and revenue optimise at different lengths: completion falls monotonically with length, but recommendation quality and purchase intent can rise up to about 7 to 9 questions. The decision rule: add a question only if its answer changes the result or the offer.
- Social and paid traffic completes 10 to 35 points below email traffic (Outgrow), so Instagram ad traffic should be planned at the bottom of every range.

### Gaps
- Octane AI, Heyflow, Jebbit, LeadQuizzes and ScoreApp: no public benchmark report with completion or lead rates by question count was found in this pass; their pages are case studies (e.g. Octane "16x more opt-ins") without denominators.
- No vendor publishes per-question drop-off curves (question 1 to N) with real numbers. The only consistent qualitative claim is that the email step is the single largest drop (RevenueHunt docs, no figure).
- No controlled test of 5 vs 7 vs 9 vs 12 questions in a marketing quiz was found.

## 2. Progress indicators, interstitials, analysing screens, auto-advance, back buttons

### Takeaway
The controlled evidence says a plain, accurate progress bar does not reliably reduce drop-off; a bar that feels slow early increases drop-off; fast-early bars reduce it (with ethical concerns). A short "analysing" wait with visible work increases perceived value up to about 30 seconds, but backfires when the result is disappointing. No solid public data on auto-advance or back buttons.

### Cited Findings
- Villar, Callegaro and Yang (2013), Social Science Computer Review 31(6): meta-analysis of 32 experiments from 19 studies. Constant-speed indicators: LOR 0.072, OR about 1.07, not significant (p = .365), so no reduction in breakoff. Fast-to-slow: LOR -0.212 (OR about 0.80), significant (p = .02) only after excluding one outlier. Slow-to-fast: LOR 0.447 (OR about 1.56), significant (p = .001), so it increases breakoff. With a small incentive, constant indicators were associated with more breakoff (OR about 1.17 after outlier removal). Authors: findings "question the common belief that progress indicators help reduce drop-off rates." Older than 2022 but the definitive synthesis. — [Villar et al. 2013 (CORE PDF)](https://core.ac.uk/download/42630452.pdf); [Google Research listing](https://research.google/pubs/where-am-i-a-meta-analysis-of-experiments-on-the-effects-of-progress-indicators-for-web-surveys/)
- Conrad, Couper, Tourangeau and Peytchev (2010), Interacting with Computers 22, 417 to 427: slow early progress feedback produced higher abandonment and a worse experience than fast early feedback; intermittent (on-demand or occasional) feedback reduced the harm of slow progress while keeping the benefit of fast progress. "When progress seems to lag behind what users expect, feedback degrades their experience and lowers completion rates." Older. Breakoff percentages per condition not retrieved. — [Fred Conrad, ISR Michigan](https://faculty.isr.umich.edu/fredconrad/?p=142)
- Outgrow claims progress bars give a 12 to 18% completion lift; no method, sample or control described. Vendor; conflicts with the meta-analysis for constant bars. — [Outgrow](https://outgrow.co/blog/quiz-engagement-benchmarks-completion-rates)
- RevenueHunt guidance (opinion, no data): show "3 of 8" rather than "37%", and keep the total consistent. — [RevenueHunt docs](https://docs.revenuehunt.com/customer-success/reduce-dropoff/)
- Buell and Norton (2011), "The Labor Illusion", Management Science: with a 30-second wait that showed the work being done (operational transparency), 62% chose the waiting service over an instant one; at 60 seconds, 63%. With a blind wait (progress bar only), 42% at 30 s and 23% at 60 s. Perceived value Exp. 1: transparent 5.36 vs blind 4.96 (p < .01). Exp. 3 at 30 s: transparent 5.13, info-list only 4.49, blind 3.82. Reversal: in online dating (Exp. 5), the benefit faded by 30 s, and with unfavourable outcomes transparency lowered value even at 15 s (2.47 vs 3.24 instant, p < .05). Sample sizes 116 to 280 per experiment. Older, lab/online experiments, not quizzes. — [Buell and Norton 2011 PDF](https://quartz-digitalbrain.pages.dev/The-labor-illusion.pdf); [INFORMS](https://pubsonline.informs.org/doi/fpi/10.1287/mnsc.1110.1376)

### Inferences
- Progress indicator rule: if shown, make early steps feel fast (put the easiest, one-tap questions first so the bar moves quickly), use step counts ("3 of 7"), and never let the bar slow down visibly near the end (e.g. a long form step). Do not inflate early progress artificially; the meta-analysis flags that as deceptive.
- "Analysing your answers" screen: keep it short (about 3 to 10 seconds is well under the 15 to 30 s range where effects faded), show the specific work ("matching your 4 answers to 12 routines"), and only use it when the result will feel favourable and personal. The 15 to 60 s waits tested by Buell and Norton are far longer than a quiz should use; this is extrapolation.
- Mid-quiz encouragement interstitials work in the same direction as Conrad's "intermittent feedback" finding, but no quiz-specific A/B test was found.

### Gaps
- No public A/B test numbers for auto-advance on tap vs a Next button, or for showing vs hiding a back button, in marketing quizzes.
- No quiz-specific test of progress bar style (segmented vs continuous vs percentage) with numbers.
- Conrad et al. per-condition breakoff rates and Ns not retrieved (paywalled).

## 3. Mobile and in-app browser specifics

### Takeaway
Quiz traffic is majority mobile (60% Outgrow; 74 to 88% for Shopify product quizzes). The design pattern evidence is one question per screen, 3 to 6 tappable options, under 5 seconds per answer and under 2 seconds load. In-app browser (Instagram/Facebook) conversion penalties are widely claimed but only weakly sourced.

### Cited Findings
- Mobile share: about 60% of quiz traffic (Outgrow, no n) — [Outgrow](https://outgrow.co/blog/quiz-engagement-benchmarks-completion-rates); 74% (supplements) to 88% (cosmetics) across top Shopify quizzes (RevenueHunt, 2023) — [RevenueHunt](https://revenuehunt.com/quiz-creation-mistakes-that-hurt-your-ecommerce-sales/)
- Load speed: each extra second costs about 7% completion; target under 2 s (vendor claim) — [Outgrow](https://outgrow.co/blog/quiz-engagement-benchmarks-completion-rates)
- Pacing: each question answerable in under 5 s; 3 to 6 options; flag any question taking 2 to 3x the median time; one screen per question, large tap targets (guidance, no data) — [RevenueHunt docs](https://docs.revenuehunt.com/customer-success/reduce-dropoff/)
- Typeform attributes its above-average completion partly to one question at a time and mobile adaptation, without supporting data. — [Typeform Help](https://help.typeform.com/hc/en-us/articles/360029615911)
- In-app browser: one Shopify merchant reported Mobile Safari UI/WKWebView (in-app browser) conversion falling from 7.8% to 0.86% year on year (Dec 2024), cause unconfirmed (merchant suspected iOS privacy changes). Anecdote, n = 1. — [Shopify Community](https://community.shopify.com/t/conversion-rate-issue-in-mobile-safari-ui-wkwebview/380512)
- Claims like "Instagram links lose 40% of sales" come from vendors selling in-app-browser bypass tools; not independently verified. — [Bouncy (vendor)](https://blog.bouncy.ai/blog/instagram-links-lose-sales/)

### Inferences
- Design for the Instagram webview as the default context: no reliance on saved autofill or Apple Pay inside the webview, short email field with correct input type, sticky primary action in the bottom thumb zone, and no hover-dependent UI.
- Instagram traffic sits at the bottom of every completion range (paid social 35 to 60%), so every question and every second of load costs more there.

### Gaps
- No public per-question drop-off curve split by mobile vs desktop.
- No independent (non-vendor) measurement of the in-app browser checkout penalty.
- No tap-target A/B data specific to quizzes (general platform guidelines on target size live in design-foundations).

## 4. Email-gate placement and copy

### Takeaway
The best dataset (RevenueHunt, 1,092 Shopify quizzes, 2023) shows an optional or skippable email ask before results beat a hard gate on both completion (85% vs 76%) and revenue per completion ($7.77 vs $6.06), while no ask had the highest completion (90%) but the lowest revenue ($3.99). This conflicts with RevenueHunt's own docs claim that 75% of top quizzes require email. For pure lead-gen (no product sale), a hard gate maximises captured leads by design.

### Cited Findings
- RevenueHunt (432 gated, 225 optional, 435 no ask): gated before results 76% completion, 7% conversion, $6.06 RPC; optional/skippable 85%, 9%, $7.77; no ask 90%, 5%, $3.99. Gating captures close to 100% of completers. In pets, 54% of top performers use no email ask. A gated 8-question pets quiz (about 1,250 responses): gate blocked 43% of starters (57% completion), but 31% of completers placed an attributed order, RPC $18. A 21-question gated cosmetics quiz (about 567 responses) had 0% conversion. Observational, not randomised; dated 2023. — [RevenueHunt](https://revenuehunt.com/quiz-creation-mistakes-that-hurt-your-ecommerce-sales/)
- RevenueHunt docs: "75% of top-converting quizzes that collect email make it required"; the email step is "typically the highest drop-off point" (no figure). Contradicts the article's optional-beats-gated result unless "top-converting" is measured on a different metric. — [RevenueHunt docs](https://docs.revenuehunt.com/customer-success/reduce-dropoff/)
- Interact says presentation of the lead form matters but publishes no gated vs ungated comparison. — [Interact](https://www.tryinteract.com/blog/quiz-conversion-rate-report/)
- Outgrow advises collecting contact info at the end, after investment, with no numbers. — [Outgrow](https://outgrow.co/blog/quiz-engagement-benchmarks-completion-rates)

### Inferences
- Decision rule (inference): selling a product right after the quiz, use a skippable ask before results (or show the result and ask for email to send the full plan); building a list for a later sale, use a hard gate after the last question with a concrete promise of what the email delivers.
- Interact's 40% start-to-lead vs 65% completion implies roughly 60% of completers opt in on its platform average (40.1 / 65), which is a usable benchmark for the gate step itself.

### Gaps
- No controlled test found of partial-result teasers vs full gate, or of specific opt-in copy patterns with numbers.
- No data on lead quality (downstream open, click or purchase rate) by gate type beyond RevenueHunt's RPC.

## 5. Quiz-to-purchase conversion for low-ticket offers ($20 to $50)

### Takeaway
Hard data is thin. The only usable figures are Shopify product-quiz numbers: 5 to 9% of completers convert to an order (RevenueHunt by gate type), up to 31% in a strong single case, with revenue per completion $4 to $8 typical and $18 in a strong case. No public dataset isolates $20 to $50 offers after an Instagram quiz.

### Cited Findings
- Completer-to-order conversion: 7% (gated), 9% (optional), 5% (no ask); RPC $6.06, $7.77, $3.99. Average order values not stated, so price band cannot be isolated. — [RevenueHunt](https://revenuehunt.com/quiz-creation-mistakes-that-hurt-your-ecommerce-sales/)
- About 20% of quiz-attributed orders arrive more than 30 days after the quiz, so short attribution windows undercount. — [RevenueHunt](https://revenuehunt.com/quiz-creation-mistakes-that-hurt-your-ecommerce-sales/)

### Inferences
- Funnel math for a $20 to $50 offer on Instagram (inference from the ranges above, not a measured benchmark): 1,000 landers x 50% start x 55% completion = about 275 completers; at 5 to 9% purchase = 14 to 25 orders, i.e. 1.4 to 2.5% lander-to-purchase. Use this as a sanity check, not a promise.
- A follow-up email sequence matters: one fifth of orders arrive after 30 days, which argues for capturing email even when the offer is on the results page.

### Gaps
- No platform publishes quiz-to-purchase rates by price band, and no study isolated Instagram traffic for low-ticket offers. Octane AI, Jebbit and Heyflow case studies cite relative lifts ("16x opt-ins") without base rates.
- Survicate's 21k-survey length study was found but not fetched; survey-length breakoff curves remain a gap for this note.
