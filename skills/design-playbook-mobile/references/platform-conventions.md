# Platform conventions: iOS, Android and mobile web

Moved here from design-ux `references/06-platforms-touch-systems.md` in the restructure: platform conventions live in the mobile playbook; design-ux keeps the component spec template and touch expert moves. Sources are the ones cited inline (Apple HIG, Android and Material docs, WCAG, Hoober); research notes in `kb/research/ux/`.

**Principle: native first.** On iOS and Android, people's expectations come from the system apps. Deviate only where the brand gains something measurable (Nielsen H4; Apple HIG; Material). Platform guidance moves yearly (for example iOS 26 floating tab bars, Android width classes): re-check the HIG and Android docs before shipping native work.

## Touch numbers
| Thing | Value | Source |
|---|---|---|
| iOS hit region | 44x44 pt min (visionOS 60x60) | Apple HIG Buttons |
| Android touch target | 48x48 dp min | Android accessibility |
| Web | 24x24 CSS px legal floor; 44x44 px for touch | WCAG 2.5.8; FOUNDATIONS |
| Physical | 7 mm at center, about 12 mm in corners for 95% of taps | Hoober 2017 |
| Spacing between small targets | at least 8 px (opinion; ensures 24 px circles do not overlap at typical 16 to 20 px icons) | derived from WCAG 2.5.8 spacing rule |
| Grip | one hand 49%, cradled 36%, two hands 15% | Hoober 2013 |

## Platform conventions that must not be broken
| Need | iOS | Android | Web |
|---|---|---|---|
| Top-level nav | Tab bar, 5 or fewer, never hidden or disabled | Nav bar (compact), rail (medium+), optional drawer | Top bar or sidebar |
| Back | Leading-edge back button plus edge swipe | System back gesture or button (predictive back preview on recent Android versions; check current Android docs) | Browser Back must work |
| Dismiss modal | Swipe down or Cancel (leading) / Done (trailing) | Back gesture or close | Escape, close button, focus returns |
| Destructive choice about an intentional action | Action sheet | Bottom sheet or dialog | Dialog or menu |
| Confirmation | Alert, up to 3 buttons, "Cancel" exact | Dialog, text buttons | Dialog, `role="alertdialog"` |
| Pressed feedback | Highlight / dim | State layer: hover 8%, focus 12%, pressed 12%, dragged 16% | `:active` plus `:focus-visible` |
| Text size | Dynamic Type, support 200% | Font scale | 200% zoom without loss (WCAG 1.4.4), reflow at 320 px (1.4.10) |

## Modality rules
- Use a modal only when it clearly helps focus or a decision; keep it short; no navigation hierarchy inside; one at a time (Apple HIG Modality).
- Sheet on iPhone: medium detent (about half height) for progressive disclosure, grabber for resizable sheets, swipe to dismiss, confirm with an action sheet if unsaved changes (Apple HIG Sheets).
- Web dialog: focus moves in (least destructive action for irreversible steps), Tab wraps, Escape closes, focus returns to the trigger (WAI-ARIA APG). Use the native `<dialog>` element with `showModal()` where possible (design-frontend).
- Overlays set `overscroll-behavior: contain` so the page behind does not scroll (Vercel).

## Decision rules
- **Porting iOS to Android:** swap tab bar for navigation bar (same 3 to 5 items), use system back instead of a back button only, adopt Material state layers and ripple, move "Cancel/Done" sheet pattern to a top app bar with close and confirm. Do not ship iOS chevrons or iOS switches on Android.
- **Porting to web:** tab bar becomes top bar (marketing) or sidebar (app) at lg 1024+, stays bottom bar only for mobile web apps used like native apps (opinion).
- **If a gesture is the only way to do something:** add a visible control (WCAG 2.5.7 dragging, 2.5.1 pointer gestures).
- **If brand wants custom controls:** keep platform behavior and accessibility, change only visual style.
- **Right-to-left locales:** mirror navigation, back buttons, sliders and progress; keep the digit order inside any number (phone, card, "541"); align paragraphs by their own language (Apple HIG Right to left). System components flip automatically; custom ones must be checked.
- **Hover-only reveals:** never on touch. Use `@media (hover: hover)` to scope hover affordances.
