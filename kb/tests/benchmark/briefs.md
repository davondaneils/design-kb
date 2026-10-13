# Exemplar benchmark: briefs

Date: 2026-10-13. Committed before anything was built. Unlike every earlier test, there is no without-skill baseline: the skilled output is scored against the measured exemplar teardowns (`kb/teardowns/`), the same way the critic would score Stripe or Linear.

Both briefs are for one fictional product, so the marketing site and the app share a brand and the comparison sets line up with the strongest exemplars (Stripe, Linear, Ramp, Mercury for the site; Linear app, Stripe Dashboard, Vercel Dashboard for the app).

## Product
**Ferry**: cross-border payroll for teams of 5 to 200 people. A company funds one balance in its home currency; Ferry pays employees and contractors in their local currency on the same day, with the exchange rate locked when the run is approved. Audience: founders, finance leads and operations people at remote-first companies in the US. Locale en-US. All customer names, numbers and quotes are sample content and must be marked as such where a reader could mistake them for real claims.

## Brief 1: marketing home page
- One page, `ferry.html`, at 1440 and 390 wide, light and dark.
- Job: a founder who pays 12 people in 7 countries through three tools lands here from a search. In one screen they learn what Ferry does, who it is for and what to do next (start a free trial, or book a demo).
- Must include: hero with one primary action, the product shown (built in HTML and CSS, not a screenshot), how a run works (fund, approve, everyone paid), countries and currencies covered, pricing ($12 per person per month, first 3 people free), proof (sample, labelled), FAQ, footer.
- Closest exemplars: Stripe home, then Linear home, Ramp home, Mercury home.

## Brief 2: product app screen
- One screen, `run-review.html`, the screen a finance lead sees before approving the October 2026 payroll run. At 1440 and 390 wide, light and dark.
- Content: 38 people across 7 currencies (USD, CAD, GBP, EUR, MXN, BRL, INR); a total to fund in USD; rates locked for 30 minutes after approval starts; pay date Fri, Oct 30, 2026; 3 people need attention (missing bank details, a rate above the alert threshold, a new hire with a partial month). One primary action: Approve run.
- States reachable by URL: default, `?state=empty` (no run drafted yet), `?state=error` (the bank rejected the funding transfer), `?state=loading`. Plus a state sheet.
- Closest exemplars: Linear app, then Stripe Dashboard, Vercel Dashboard.

## How it is scored
1. **Fundamentals gate first** (FOUNDATIONS 16-item checklist, lint, claims, search check). One miss caps a page.
2. **Measured comparison**: `node kb/teardowns/measure.mjs` runs on the built pages exactly as it ran on the exemplars, and `kb/tests/benchmark/score.py` compares type scale, tracking, line height, measure, spacing rhythm, text contrast, radii, shadows and motion against the exemplar set's measured range.
3. **Judged comparison** by a fresh-context critic that did not build the pages: side by side with the exemplar screenshots, per domain (type, spacing and rhythm, color and contrast, hierarchy, copy, imagery, motion), rated reaches exemplar, close, clearly below, or far below.
4. Gaps are ranked fundamentals first, each tied to the skill that should fix it. Fixes go into the skills, then both briefs are rebuilt from scratch by a fresh builder and re-scored with the same method.
