# Research: Platforms, touch and systems

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Grips (780 touching users): one-handed 49%, cradled 36%, two-handed 15%. About 75% of touches by thumb. | Hoober, UXmatters 2013 [1]; mobiforge summary [2] | R |
| 2 | Target size containing about 95% of taps: 7 mm at screen center, about 12 mm at corners. People prefer to look at and tap the center. Hoober later retracted his 2013 thumb-zone drawings. | Hoober, UXmatters 2017 [3] | R |
| 3 | Apple: hit region 44x44 pt minimum (visionOS 60x60). Use style, not size, to mark the preferred button. | Apple HIG Buttons [4] | S |
| 4 | Android: 48x48 dp minimum touch target; Material components enforce it. | Android [5] | S |
| 5 | Material 3 state layers: hover 8%, focus 12%, pressed 12%, dragged 16% opacity of the content color. | Flutter gen_defaults state.json, Material tokens [6] | S (platform) |
| 6 | Apple modality: only when there is clear benefit; short and simple; no app-within-an-app; obvious dismissal (button or swipe down on iOS); confirm before discarding user content; title the task; never stack modals; never more than one alert. | Apple HIG Modality [7] | S |
| 7 | Apple sheets: Cancel on leading edge, Done on trailing; pair Done with Cancel; support swipe to dismiss and confirm with action sheet if unsaved changes; medium detent (about half height) for progressive disclosure; include a grabber; one sheet at a time. | Apple HIG Sheets [8] | S |
| 8 | Apple alerts: up to three buttons; one or two word verb titles; "Cancel" exactly; destructive style only for actions people did not deliberately choose; action sheet, not alert, for choices about an intentional action. | Apple HIG Alerts [9] | S |
| 9 | Modal dialog keyboard: focus moves inside on open (least destructive action for irreversible steps; title with tabindex -1 for long content); Tab wraps inside; Escape closes; focus returns to invoker. | WAI-ARIA APG [10] | S (authoring practice) |
| 10 | Design Tokens format: first stable version 2025.10 (W3C Community Group). | designtokens.org [11] | S (community spec) |
| 11 | Atomic design: atoms, molecules, organisms, templates, pages. | Brad Frost [12] | P (canonical) |
| 12 | Text size: support enlargement to at least 200%. | Apple HIG Accessibility [13]; WCAG 1.4.4 | S |
| 13 | RTL: system UI flips automatically; mirror back buttons, sliders, progress and fixed-order navigation; never reverse digits within a number; align paragraphs by their language. | Apple HIG Right to left [14] | S |

## Sources
1. https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php
2. https://mobiforge.com/design-development/designing-touch-thumb-and-finger-sized-design
3. https://www.uxmatters.com/mt/archives/2017/03/design-for-fingers-touch-and-people-part-1.php
4. https://developer.apple.com/design/human-interface-guidelines/buttons
5. https://developer.android.com/guide/topics/ui/accessibility/apps
6. https://flutter.googlesource.com/mirrors/flutter/+/a5d5cd7a7bc6b77f438e3bf427b415e8dd915cfb/dev/tools/gen_defaults/data/state.json
7. https://developer.apple.com/design/human-interface-guidelines/modality
8. https://developer.apple.com/design/human-interface-guidelines/sheets
9. https://developer.apple.com/design/human-interface-guidelines/alerts
10. https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
11. https://www.designtokens.org/
12. https://atomicdesign.bradfrost.com/
13. https://developer.apple.com/design/human-interface-guidelines/accessibility
14. https://developer.apple.com/design/human-interface-guidelines/right-to-left

## Practitioner tier note
X.com posts did not fetch and the session's web search budget ran out before more X threads could be found. Practitioner leads used: Rauno Freiberg (@raunofreiberg), Emil Kowalski (@emilkowalski), Vercel design team, Brad Frost (@brad_frost), Adam Silver (@adambsilver), Luke Wroblewski (@lukew), Jakob Nielsen (@NNgroup founder, now UX Tigers). Brett Williams (DesignJoy) shares mostly visual and business practice; no UX claim from him is used here. Each practitioner claim is labelled P and checked against a primary source where one exists.
