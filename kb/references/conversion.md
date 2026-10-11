# Conversion: CRO, landing page evidence and experimentation

Where to go deeper on making pages convert, and on proving it. Read Kohavi for how to trust a test result, Baymard for what the research says about checkout and forms, then GoodUI for what other teams' tests found. Funnel architecture, offers and order bumps are covered by Davon's sales-funnels skill (Brunson, Todd Brown); this list spends its effort on evidence and experiment discipline, which that skill lacks.

## Start here
- **Trustworthy Online Controlled Experiments (Kohavi, Tang, Xu):** the standard on running A/B tests you can believe. Opinion: read before running any test.
- **Baymard Institute:** the largest public body of ecommerce and checkout usability research. Opinion: the first place to look before guessing at a checkout or form fix.
- **Evan Miller's "How Not To Run an A/B Test" and sample size calculator:** ten minutes that prevent the most common testing mistake (peeking). Opinion.

## Entries

### Trustworthy Online Controlled Experiments (book, plus course)
- **Who / what:** Ron Kohavi (Microsoft, previously Amazon, later Airbnb), Diane Tang (Google) and Ya Xu (LinkedIn). Cambridge University Press, 2020, 288 pages. Kohavi also teaches "Accelerating Innovation with A/B Testing" on Maven.
- **Best for:** choosing an Overall Evaluation Criterion, sample ratio checks, guardrail metrics, Twyman's law (surprising results are usually errors), and building a testing culture.
- **Why it meets the bar:** written by the people who ran experimentation at companies that each run more than 20,000 controlled experiments a year (per the publisher). The publisher's summary: "Getting numbers is easy; getting numbers you can trust is hard." Opinion: the canonical text.
- **Link:** https://www.cambridge.org/9781108724265 ; course: https://maven.com/kohavi/abtesting
- **Tier:** 3
- **Checked:** Cambridge University Press page (authors, April 2020, ISBN 9781108724265, description), Cambridge front matter PDF, Maven course page (instructor bio, syllabus topics), accessed 2026-10-10.

### Baymard Institute (research)
- **Who / what:** UX research firm founded in 2009 by Christian Holst and Jamie Appleseed, focused on ecommerce. Publishes free articles plus paid Baymard Premium guidelines.
- **Best for:** checkout, cart, forms, payment, product listing and search UX; cart abandonment reasons; field-level rules (guest checkout, card forms, total cost shown upfront).
- **Why it meets the bar:** its methodology page lists 200,000+ hours of research: 25 rounds of moderated usability testing with 4,400+ participant/site sessions, eye-tracking, 12 quantitative studies with 20,240 participants, and benchmarks of 327 leading sites against 650+ guidelines. Tracked average cart abandonment: 70.19%. Already used in kb/research/copy/02.
- **Link:** https://baymard.com/research/checkout-usability ; articles: https://baymard.com/blog
- **Tier:** 3 (large-sample applied research, not peer reviewed)
- **Checked:** checkout usability research page (methodology, 110+ checkout guidelines, 70.19% figure), 2025 checkout UX benchmark article (18% abandon over forced account creation), payment UX article (2026), accessed 2026-10-10.

### Evan's Awesome A/B Tools and "How Not To Run an A/B Test" (tool)
- **Who / what:** Evan Miller's free calculators (sample size, chi-squared, sequential sampling, t-test) and his 2010 essay on repeated significance testing.
- **Best for:** fixing the sample size before a test starts, and understanding why stopping a test when the dashboard first says "significant" inflates false positives.
- **Why it meets the bar:** opinion: the clearest plain-language explanation of the peeking problem; the calculator states its assumptions (baseline, minimum detectable effect, power, significance). Also opinion: the simplest guardrail a small team can adopt.
- **Link:** https://www.evanmiller.org/ab-testing/sample-size.html ; https://www.evanmiller.org/how-not-to-run-an-ab-test.html
- **Tier:** 4
- **Checked:** both pages loaded (calculator inputs, essay date April 18, 2010, recommendation to fix sample size in advance), accessed 2026-10-10.

### GoodUI (gallery/teardown, test database)
- **Who / what:** Jakub Linowski's database of A/B tested UI patterns, Toronto. Its patterns page lists 141 patterns based on 644 tests, and publishes losers and flat results as well as winners (43 losing, 147 insignificant negative, 285 insignificant positive, 169 winning at time of check).
- **Best for:** estimating the odds that a pattern (fewer form fields, visible prices, social proof, plan count) will move a metric before you test it yourself.
- **Why it meets the bar:** shows sample sizes and statistical power per test, and includes failures, which most CRO case studies hide. Full results are paid. Opinion: the most honest public source of pattern-level test evidence; still check power, since many listed tests are underpowered.
- **Link:** https://goodui.org/patterns/
- **Tier:** 4
- **Checked:** goodui.org patterns page (counts by outcome), tests listing (per-test sample and power), LinkedIn for founder role, accessed 2026-10-10.

### CXL conversion optimization guide (course/guide)
- **Who / what:** Peep Laja's CXL (founded as ConversionXL), with guides on conversion research, analytics, heat maps, user testing and running A/B tests. Laja later founded Speero and Wynter.
- **Best for:** a research-first CRO process: find where the problems are (analytics), why (qualitative research), then prioritize and test.
- **Why it meets the bar:** long-running practitioner curriculum with chapters by named practitioners (for example Michael Aagaard on conversion research). Opinion: the best free process overview; its blog quality varies, so prefer the structured guides.
- **Link:** https://cxl.com/conversion-optimization ; https://cxl.com/blog/conversion-rate-optimization
- **Tier:** 4
- **Checked:** both CXL guide pages (chapter list, author bio of Peep Laja, Speero and Wynter), accessed 2026-10-10.

### Wynter (tool, message testing)
- **Who / what:** B2B message testing and buyer research platform founded by Peep Laja. Runs message tests, ICP surveys and brand tracking with verified target buyers.
- **Best for:** testing copy and positioning with real target buyers when traffic is too low for an A/B test (most B2B and new sites).
- **Why it meets the bar:** fills the gap A/B testing cannot: qualitative, pre-launch evidence from the actual audience. Its message-layers framework is already used in kb/research/copy/01 and 05. Opinion: it is a vendor; use its blog for method, not as proof of outcomes.
- **Link:** https://wynter.com/ ; framework: https://wynter.com/post/b2b-message-layers-framework-wynter
- **Tier:** 4
- **Checked:** wynter.com home and Peep Laja author page (founder and CEO), accessed 2026-10-10.

### Julian Shapiro, Landing Page Copywriting (guide)
- **Who / what:** a free chapter of Julian Shapiro's Startup Handbook on writing and structuring a landing page: hero header and subheader, objections, feature blocks, getting feedback.
- **Best for:** the hero section: the "if the visitor reads only this, do they know what you sell" test, and using the header to answer the biggest objection.
- **Why it meets the bar:** concrete, example-led and widely used by startups; the rules are practitioner opinion, not tested. Already used in kb/research/copy/01.
- **Link:** https://www.julian.com/guide/growth/landing-pages ; X: https://twitter.com/julian (linked from the guide; lead only, tier 5)
- **Tier:** 4
- **Checked:** guide page (sections on hero header, hooks, objections; author link), accessed 2026-10-10.

### Unbounce Conversion Benchmark Report 2024 (dataset)
- **Who / what:** landing page vendor's benchmark from 464 million visitors to 41,000+ landing pages and 57 million conversions (July 2023 to July 2024).
- **Best for:** realistic baseline conversion rates by industry and channel, and the finding that harder-to-read copy correlates with lower conversion.
- **Why it meets the bar:** very large sample, but correlational and limited to Unbounce customers; use for baselines, never as causal proof. Already used in kb/research/copy/01 and 04.
- **Link:** https://unbounce.com/conversion-benchmark-report
- **Tier:** 5 (vendor data, correlational)
- **Checked:** Unbounce report page and the September 2024 press release (methodology numbers), accessed 2026-10-10.

### Deceptive Patterns (gallery, guardrail)
- **Who / what:** catalog of deceptive design patterns (formerly darkpatterns.org), founded by Dr. Harry Brignull and now run with legal scholars Mark Leiser, Cristiana Santos and Kosha Doshi.
- **Best for:** the line CRO must not cross: confirmshaming, sneaking, hidden costs, hard cancellation, with real company examples and legal context.
- **Why it meets the bar:** running since 2010 (its tagline), with named company examples, and now maintained with legal scholars. Opinion: every conversion idea should be checked against it. Already used in kb/research/copy/02.
- **Link:** https://www.deceptive.design/
- **Tier:** 4
- **Checked:** deceptive.design home (who runs it, hall of shame examples), accessed 2026-10-10.

## Considered and dropped
- **Russell Brunson, Todd Brown, offer stacking and funnel scripts:** covered by Davon's sales-funnels skill. Link there.
- **Vendor "we lifted conversions 300%" case studies (testing tools, agencies):** usually no sample size, no power, no losers reported. Weak evidence.
- **NN/g:** essential, but listed in copy.md and ux.md; cite its articles directly when a conversion claim is about usability.
- **Stefan Thomke, Experimentation Works:** relevant HBS book, not verified this session; queue for v0.2.
- **Peep Laja's X account:** could not confirm the handle from his own pages this session.
- **"Average conversion rate" listicles:** recycled numbers without methodology; use Unbounce or Baymard instead.
