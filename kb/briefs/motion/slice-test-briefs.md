# Motion: vertical slice test briefs

Written by the editor-in-chief, 2026-10-10. Reuses the two pilot briefs unchanged (`kb/briefs/color/slice-test-briefs.md`: Brief A, Ember & Oak coffee roaster landing page; Brief B, Tally analytics overview), so the gain from design-motion is measured on the same pages.

## Method
- **Baseline ("before")**: the combined pages Davon picked 3 of 3, `kb/tests/combined/coffee.html` and `dashboard.html`, unchanged (copies in `kb/tests/design-motion/before/`). They pass the lint but have almost no motion: one 1800 ms curve draw, a button press scale, a skeleton pulse, and a global `animation: none !important` reset.
- **After**: the same pages through design-director and the two playbooks, with design-motion applied (landing: references 01 and 04 per the playbook, plus 03 and 07 for the reveals; dashboard: 04, plus 07 for live numbers). Content, color, type and layout stay the same, so differences come from motion.
- **Screenshots cannot show motion.** `tools/render.mjs` renders with reduced motion (end states). So each animation is also filmed: `skills/design-motion/assets/motion-audit.mjs` triggers it, freezes every animation it started with the Web Animations API, seeks them together to evenly spaced moments and screenshots each one, in both motion settings. The same run reads each animation's real duration, delay, curve and animated properties from the browser and checks them against the FOUNDATIONS tokens.
- **Frame cost**: `kb/tests/design-motion/perf.mjs` records frame intervals at 4x CPU throttle for the heaviest moves.

## What each page must show (test briefs)
**A. Coffee landing page (playbook-landing, closest exemplars apple.com product pages and family.co; stripe.com for data reveals).**
1. The roast curve draws on once when it scrolls into view, within the 600 ms marketing ceiling, with markers synced to the pen.
2. A contour reveal tied to what the contours mean (line count = altitude).
3. Add-to-cart feedback at the button and at the cart badge, with no layout shift.
4. Hover, success and loading feedback; the hero does not move (first paint).
5. A per-element reduced-motion design, not a global reset.

**B. Tally dashboard (playbook-dashboard, closest exemplars the Linear app and the Vercel and Stripe dashboards).**
1. Number transitions when a value changes while visible, never on load; WCAG 2.2.2 handled for auto-updating values.
2. Command palette open: the expert answer for a keyboard-first tool (frequency rule), shown on a strip.
3. Popover, dialog and drawer motion from their origin, with exits shorter than entrances.
4. States: loading delay, retry, sort; what is deliberately not animated, with reasons.

## Rubric
**Gate (fails the page):** lint exits 0 on the page, every `?state=` variant and the state sheet; every `[judged]` row of the FOUNDATIONS checklist holds; `motion-audit.mjs` passes every scenario (token durations and curves, compositor properties, nothing moves under reduced motion, keyboard paths do not animate).

**Motion rubric (pass or fail per item, judged on the strips and the source):**
1. Purpose: every animation names one job (feedback, state change, orientation, signifier, attention); nothing decorative.
2. Frequency: keyboard paths and high-frequency actions get no motion or the smallest budget.
3. Timing: tokens only; exits one token shorter than entrances; nothing a person triggers over 400 ms in the app, 600 ms on the landing page.
4. Choreography: one lead element; fade-through instead of double exposure; staggers capped; origin follows cause.
5. Reduced motion: designed per element (movement replaced, meaning kept), shown on the reduce row of every strip.
6. Performance: transform and opacity for movement; no box-shadow, layout or blur animation; frame times at 4x throttle recorded.
7. Honesty to data: motion on charts and numbers never misrepresents the data (draw speed, roll direction, no count-up from zero).

**Exemplar closeness:** compared with the same exemplars as earlier waves, on motion only. Exemplar hosts are blocked from this environment, so the comparison is from published talks, docs and memory, and says so. Rated close, clearly below or far below.

**Pass** = gate 100 percent, motion rubric 7 of 7 on both pages, and the after pages rated better than the before pages on motion.
