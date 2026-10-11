# Research: 06 Evidence and testing

Researcher, 2026-10-10. Method as in note 01.

## Key findings
1. Most ideas fail: at Microsoft "only about 1/3 of ideas improve the metrics they were designed to improve" (C41).
2. Surprising results are usually wrong. Twyman's law: "any figure that looks interesting or different is usually wrong" (C42). With a 10% success rate (Booking.com, Google Ads, Netflix), the false positive risk at p < 0.05 two-tailed (0.025 per side) and 80% power is 22.0%; Airbnb Search at 8% gives 26.4% (C42).
3. Published case studies are often underpowered: the "337% lift" GuessTheTest case had about 80 users per variant and about 3% power to detect a 10% change; the authors say it "should not be trusted" (C42).
4. Small changes can matter, rarely: a Bing ad headline change raised revenue 12% (C43). This is an exception that needed large traffic to detect, not a rule that small tweaks pay.
5. Dark patterns are common and now regulated: 1,818 instances on about 11K shopping sites, 183 sites with deceptive practices (C26); FTC staff report, Sept 2022 (C25); fake reviews banned (C24); drip pricing banned in the UK (C29); California auto-renewal rules (C28).

## Evidence ladder (method, for the chapter)
1. Law and standards (WCAG, FTC rules, state and UK law, platform rules).
2. Large benchmarks with stated methods (Baymard: thousands of hours of testing, 50-study averages).
3. Lab usability and eye tracking (NN/g), peer-reviewed behavioral research (Spiegel, JCR, JMR).
4. Controlled experiments at scale published by the people who ran them (Kohavi et al., Stripe holdbacks, with vendor caveat).
5. Case studies, agency blog lifts, "X% more conversions" listicles: leads only.

## Claim table
| ID | Claim | Quote | URL | Accessed | Tier | Status |
|---|---|---|---|---|---|---|
| C25 | FTC dark patterns staff report | "FTC Report Shows Rise in Sophisticated Dark Patterns Designed to Trick and Trap Consumers" | https://www.ftc.gov/reports/bringing-dark-patterns-light | 2026-10-10 | 1 | regulator |
| C26 | Dark patterns at scale | "1,818 dark pattern instances" ; "find 183 websites that engage in such practices" | https://arxiv.org/abs/1907.07032 | 2026-10-10 | 3 | consensus |
| C41 | One third of ideas work | "only about 1/3 of ideas improve the metrics they were designed to improve" | https://ai.stanford.edu/~ronnyk/ExPThinkWeek2009Public.pdf | 2026-10-10 | 3 | consensus |
| C42 | Twyman's law; false positive risk; 337% case | "any figure that looks interesting or different is usually wrong" ; "The power for detecting a 10% relative change with 80 users in this example is 3%" | https://airbnb.tech/wp-content/uploads/sites/19/2025/10/ABTestingIntuitionBusters.pdf | 2026-10-10 | 3 | consensus |
| C43 | Bing headline +12% | "increased revenue by an astonishing 12%" | https://hbr.org/2017/09/the-surprising-power-of-online-experiments | 2026-10-10 | 3 | consensus |

## Likely to change
- US subscription law (state ARLs, any new FTC rulemaking after the 2025 vacatur), UK DMCC enforcement, EU consumer rules. Review every 3 months.
- Baymard averages update yearly; re-fetch C1 to C13 yearly.
