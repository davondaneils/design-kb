# Review: design-motion v0.1 (critic)

Reviewed: `skills/design-motion/SKILL.md`, `references/01` to `06`, `assets/motion-tokens.css`, against `kb/research/motion/*` and the shared foundation contract (v0.1).

## Verdict
First pass: **revise** (two fundamentals misses). After fixes 1 to 9 below were applied: **approve**.

## Fundamentals gate
| Check | First pass | After fixes |
|---|---|---|
| Code correctness | Fail: dialog CSS overrode only `transition-property`, which re-mapped the `allow-discrete` list onto the wrong properties (overlay would lose allow-discrete). Hover color sat inside the reduced-motion block, so reduced-motion users lost hover feedback. | Pass |
| Accessibility | Fail: tooltip spec ignored WCAG 1.4.13; hold-to-confirm cited 2.5.1 (wrong criterion, pointer gestures) | Pass |
| Internal consistency | Fail: 02 said accelerate exits at fast or shorter while SKILL.md and the 02 worked example used a base-length drawer exit | Pass (rule now "one token shorter than entrance, never above base") |
| Foundation contract | Pass: all durations, curves and token names match; easing token names `--easing-*` chosen (contract names no easing tokens; see pipeline notes) | Pass |
| Em dashes | Pass | Pass |

## Fix list (all applied)
1. `references/06-implementation.md` and draft: rewrite the dialog CSS so each `transition` shorthand lists every property with its own `allow-discrete`; explain enter uses the `[open]` rule, exit the closed rule. Done.
2. `references/06`: move hover color outside the reduced-motion block; keep only `transform` inside `no-preference`. Comment corrected: color is low risk, not "not motion" (WCAG 2.3.3 erratum says color can count). Done.
3. `references/04`: tooltip row adds WCAG 1.4.13 (hoverable, dismissible with Esc, persistent). Done.
4. `references/04`: hold-to-confirm cites 2.1.1 Keyboard and requires a keyboard-reachable alternative plus text for remaining time. Done.
5. `references/04`: error shake was 3 cycles in under 300 ms (about 10 Hz, jittery); now 3 decaying oscillations over 300 to 400 ms, plus focus to first invalid field. Done.
6. `references/04`: toast row adds `role="status"` or `alert`. Done.
7. `references/05`: claim that the global 0.01 ms reset makes `animationend` fire "instantly and break JS" was wrong in emphasis (0.01 ms is chosen so events still fire). Rewritten to the real objection: it deletes meaningful crossfades. Done.
8. `SKILL.md` and `references/01`: "anything started from the keyboard never animates" overstated the source (Kowalski means shortcuts and keyboard navigation). Narrowed, with Enter on a button explicitly allowed. Done.
9. `references/02`: exit-easing rule made consistent (see gate). Done.

## Claims checked against research
- Material 3 durations, curves and spring tokens: match MDC Motion.md verbatim.
- Fade through 0.92 and 0.35: verified in MDC source code.
- Shared axis 30 px slide distance: not verified (source code delegates to a provider whose value was not read). Labeled opinion in 03. Keep labeled.
- Cross-document View Transitions support (Chromium 126, Safari 18.2, not Firefox): not re-verified because the shared web search budget ran out. Labeled "verify on caniuse" in 03 and research. Recheck at next review.
- UIScrollView normal deceleration 0.998: Apple page not machine readable; value is the long-standing UIKit constant. Acceptable, labeled with source.
- dotLottie "up to 80% smaller": vendor claim, labeled.

## Expert-depth test ("would the best person learn something?")
Items a strong generalist usually does not know and the skill carries: Material 3 spatial vs effects spring split; M3 spring to Motion damping conversion; fade-through 35 percent threshold; momentum projection with 0.998; velocity-first dismiss threshold; LCP exclusion of opacity 0 elements; transitions retarget while keyframes restart; `allow-discrete` list mapping trap; WCAG 2.3.3 erratum (blur counts); SSR default for reduced-motion hooks; tabular numbers for animated counts; delayed loaders. Verdict: passes. Remaining "nod along" material (use transform and opacity, respect reduced motion) is kept because it is the fundamentals gate.

## Contradictions with other skills
None found. Color values in code are marked illustrative and deferred to design-color. CTA content deferred to copywriting and sales-funnels.
