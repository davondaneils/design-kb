# Platforms, touch and design systems

## Principles
1. **Native first.** On iOS and Android, people's expectations come from the system apps. Deviate only where the brand gains something measurable (Nielsen H4; Apple HIG; Material).
2. **Fingers are not cursors.** Targets are larger, hover does not exist, hands cover content, and people prefer the center of the screen (Hoober 2017).
3. **A component is a contract**, not a picture: anatomy, every state, behavior, keyboard, screen reader, content rules and tokens.

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

## Component spec template (every component in a design system)
1. **Purpose and when not to use** (with the alternative component).
2. **Anatomy:** named parts.
3. **Variants:** e.g. button: primary, secondary, tertiary (ghost), destructive. Sizes sm 32, md 40, lg 48 px height (opinion; md touch use needs a 44 px hit area via padding).
4. **States:** default, hover, focus-visible, active/pressed, disabled, loading, selected (if toggle), error (if input). Focus and hover need more contrast than rest (Vercel).
5. **Behavior:** keyboard (Enter/Space for button; arrows for tabs, radios, menus per APG), touch, loading, overflow (long labels wrap or truncate with tooltip).
6. **Accessibility:** role, name, states (`aria-pressed`, `aria-expanded`, `aria-busy`), target size.
7. **Content rules:** verb-first labels, sentence case (design-copy).
8. **Tokens:** only semantic tokens: `--color-primary`, `--color-on-primary`, `--color-focus-ring`, `--radius-md`, `--space-3` / `--space-4`, `--duration-fast`. Never raw hex in components (FOUNDATIONS).
9. **Do and don't** with images.

## Expert moves
- **Disabled is a last resort.** Prefer enabled plus explanation; if disabled is unavoidable, provide the reason nearby (Silver; Apple: do not disable tabs).
- **Style, not size, marks the preferred choice** in a button group (Apple HIG Buttons).
- **Hit area decoupled from visual size:** a 20 px icon gets 44 px of invisible padding; layouts plan for it.
- **Safe areas and floating bars.** iOS 26 tab bars float over content; reserve bottom padding with `env(safe-area-inset-bottom)` plus bar height so the last item is reachable and focus is not obscured (WCAG 2.4.11).
- **Tokens follow the DTCG 2025.10 format** so Figma variables, code and docs stay in sync (design-frontend).
- **Atomic thinking for scope, not for naming:** atoms to pages helps decide where state lives; teams name components by purpose ("Combobox"), not by atomic level (opinion).

## Hand-offs
- Tokens, CSS, `<dialog>`, ARIA implementation: design-frontend.
- Visual style of components: design-color, design-typography, design-layout.
- Press and transition motion: design-motion.
