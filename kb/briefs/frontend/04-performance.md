# Brief 04: Performance and Core Web Vitals

## Question it answers
How do I hit good Core Web Vitals at p75 on real mobile devices, and what budget keeps a project there?

## After reading, Claude must be able to decide
- Which LCP subpart is the problem and the fix for each.
- How to keep INP under 200ms (yielding, DOM size, rendering cost).
- What causes CLS on this page and how to reserve space.
- A performance budget by site type.
- Which platform features (bfcache, speculation rules, priority hints) to turn on.

## Must cover
Thresholds, p75, field vs lab, LCP subparts, fetchpriority, preload, render-blocking, INP phases, scheduler.yield, content-visibility, CLS session windows, bfcache, speculation rules, head order, third parties, budgets (Alex Russell), measuring with web-vitals and CrUX.

## Test briefs it should pass
- A marketing site with a hero video and LCP of 4.2s on mobile.
- A dashboard with INP of 450ms on filter changes.
