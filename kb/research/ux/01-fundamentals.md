# Research: UX fundamentals

Status key: C = consensus, S = standard (normative), P = practitioner opinion, R = single study.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | 10 heuristics: visibility of system status; match with real world; user control and freedom; consistency and standards; error prevention; recognition over recall; flexibility and efficiency; aesthetic and minimalist design; help users recognize, diagnose, recover from errors; help and documentation. Last updated 30 Jan 2024. | NN/g, Nielsen [1] | C |
| 2 | Response limits: 0.1 s feels instant, no extra feedback needed; 1 s keeps flow of thought, users notice delay; 10 s is the limit of attention, give completion estimates. | NN/g [2] | C |
| 3 | Doherty and Thadani (IBM Systems Journal, 1982) set a 400 ms response target, replacing 2 s. | Laws of UX [3] | R, often cited |
| 4 | WCAG 2.2 2.5.8 Target Size (Minimum), AA: 24x24 CSS px, or the 24 px diameter circle centered on each undersized target does not overlap another target or circle. Exceptions: equivalent control, inline in text, user agent default, essential. | W3C [4][5] | S |
| 5 | WCAG 2.2 adds 2.4.11 Focus Not Obscured (AA), 2.4.13 Focus Appearance (AAA, 2 px perimeter, 3:1), 2.5.7 Dragging Movements (AA), 3.2.6 Consistent Help (A), 3.3.7 Redundant Entry (A), 3.3.8 Accessible Authentication (AA). | W3C [4] | S |
| 6 | Apple: hit region at least 44x44 pt (visionOS 60x60 pt). | Apple HIG Buttons [6] | S (platform) |
| 7 | Android: touch targets at least 48x48 dp; "larger is even better". | Android accessibility docs [7] | S (platform) |
| 8 | Warnings fail through habituation; "Never use a warning when you mean undo." Typing to confirm is tolerable only for rare actions. | Raskin, A List Apart 2007 [8] | C among experts |
| 9 | Confirmation dialogs only for serious consequences; label buttons with outcomes ("Delete file", "Keep file"), no Yes/No; no default on Yes; name the exact item; typed confirmation only for rare high-stakes. | NN/g [9] | C |
| 10 | Apple: avoid alerts for common, undoable destructive actions; alert for uncommon destructive actions that cannot be undone. Never make Cancel the default; use "Cancel" exactly; avoid "OK" except informational alerts. | Apple HIG Alerts [10] | S (platform) |
| 11 | Real links (`a`) for navigation so modifier clicks work; URL holds state (filters, tabs, pagination); Back restores scroll; no dead zones; every flow keyboard operable; visible `:focus-visible` ring not covered by sticky UI; never disable zoom; never block paste. | Vercel Web Interface Guidelines [11] | P (industry, widely adopted) |
| 12 | Hit area may exceed visual size: under 24 px visual, expand hit area to 24 px; 44 px on mobile. | Vercel [11] | P, matches [4][6] |
| 13 | Interaction states (hover, active, focus) need more contrast than rest. | Vercel [11] | P |
| 14 | Frequency rule: the more often an interaction happens, the less animation it should have; never animate keyboard-initiated actions; UI animation generally under 300 ms. | Emil Kowalski [12] | P |
| 15 | Skip motion on high frequency, low novelty actions; destructive gestures commit on release, reversible ones may commit mid-gesture; gestures should track the finger immediately and be interruptible. | Rauno Freiberg [13] | P |
| 16 | Severity ratings 0 to 4: 0 not a problem, 1 cosmetic, 2 minor, 3 major, 4 catastrophe; severity combines frequency, impact and persistence. | NN/g [14] | C |
| 17 | EU Digital Services Act Article 25: providers of online platforms shall not design interfaces that deceive, manipulate or impair users' free and informed decisions. | Regulation (EU) 2022/2065 [15] | S (law, EU) |

## Conflicting views
- 44 pt (Apple) vs 48 dp (Android) vs 24 px (WCAG AA floor). Resolution: 24 px is the legal floor, platform figures are the design default on touch. Shared foundations set 24 floor, 44 preferred for touch.
- Typed confirmation: NN/g and Raskin both allow it only for rare actions; GitHub style "type the repo name" is consistent with that.

## Likely to change
- WCAG 3 drafts (not normative as of Oct 2026). Re-check yearly.

## Sources
1. https://www.nngroup.com/articles/ten-usability-heuristics/
2. https://www.nngroup.com/articles/response-times-3-important-limits/
3. https://lawsofux.com/doherty-threshold/
4. https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
5. https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
6. https://developer.apple.com/design/human-interface-guidelines/buttons
7. https://developer.android.com/guide/topics/ui/accessibility/apps
8. https://alistapart.com/article/neveruseawarning
9. https://www.nngroup.com/articles/confirmation-dialog/
10. https://developer.apple.com/design/human-interface-guidelines/alerts
11. https://vercel.com/design/guidelines (practitioner tier; authors include Rauno Freiberg and Paco Coursey, active on X)
12. https://emilkowal.ski/ui/you-dont-need-animations (Emil Kowalski, @emilkowalski on X)
13. https://rauno.me/craft/interaction-design (Rauno Freiberg, @raunofreiberg on X)
14. https://www.nngroup.com/articles/how-to-rate-the-severity-of-usability-problems/
15. https://eur-lex.europa.eu/eli/reg/2022/2065/oj
