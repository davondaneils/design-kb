---
name: design-playbook-mobile
description: Job playbook for mobile app screens and flows on iOS, Android and mobile web, at the level of Things 3, Cash App and Arc. Use for "design an app screen", "iOS app", "Android app", "mobile onboarding", "tab bar or hamburger", "port this iOS design to Android", "make it feel native", "React Native or SwiftUI screen", "mobile web app". Holds the platform conventions (Apple HIG, Material) and says which foundations and domain references to load in what order and what done looks like. Not for responsive marketing pages (design-playbook-landing) or desktop dashboards (design-playbook-dashboard).
---

# design-playbook-mobile

On a phone, the platform is half the design. People bring the habits of their system apps; break them only when the brand gains something measurable.

## 1. Load in this order
1. **design-foundations** (always): tokens, the 15-item gate, `references/accessibility.md`.
2. **This playbook's** `references/platform-conventions.md`: touch numbers, the iOS vs Android vs web table, modality, porting rules. Decide the platform first.
3. **design-ux**: `references/01-fundamentals.md`, `02-navigation-ia.md`, `04-states-feedback.md`, `05-onboarding.md`, `03-forms.md`, `06-platforms-touch-systems.md` (component specs).
4. **design-layout**: `references/04-responsive-and-adaptive.md` (safe areas, width classes), `03-hierarchy-and-gestalt.md`.
5. **design-typography**: `references/04-hierarchy-ui-editorial.md`; support Dynamic Type and Android font scale up to 200%.
6. **design-color**: `references/ui-tokens-themes.md`; dark mode is expected on both platforms.
7. **design-motion**: `references/02-timing-easing.md` (springs), `03-choreography-transitions.md`, `04-micro-interactions.md`.
8. **design-graphic**: `references/02-icon-systems.md` (app icon, system symbols vs custom icons). **design-art-direction** `references/01-concept-and-consistency.md` when the app has illustration or onboarding art.
9. **design-copy**: `references/02-ux-microcopy.md` (alerts, permission prompts, notifications).
10. **design-frontend** for mobile web or a web mock; native code follows the platform's own toolkit.
11. **design-polish** after the lint gate passes (`references/06-polish-checklist.md`, state sheet for every control), then the self-critique loop in design-director. App screens with lists, settings or command layers also load design-product-ui `references/03-forms-settings.md` and `05-states-bulk.md`.

## 2. Non-negotiables for this job
1. Touch targets 44x44 pt on iOS, 48x48 dp on Android, 44x44 CSS px on mobile web.
2. Platform navigation and back behavior exactly as the table in `references/platform-conventions.md` says. No iOS chevrons or switches on Android, and the reverse.
3. Content clears safe areas and floating bars (`env(safe-area-inset-*)` on the web).
4. Every gesture has a visible alternative (WCAG 2.5.1, 2.5.7).
5. Text survives 200% system text size without clipping.

## 3. Done means
1. The screen is built as a 390px HTML mock (or native code with screenshots). For HTML: `node tools/lint.mjs page.html` exits 0 and `node tools/render.mjs page.html out/ --widths 390` renders light and dark.
2. Every `[judged]` row holds on the screenshots, plus the platform conventions table.
3. Compared with the closest exemplar: Things 3 (calm task and list apps), Cash App (money, bold single action), Arc (navigation-heavy tools), Family (wallets and onboarding warmth). The exemplar set has no Android-first app yet; propose one to Davon when the job is Android-first.
4. The hand-over names what is still short of the exemplar.

## 4. Reference map
| Need | Read |
|---|---|
| Touch numbers, iOS vs Android vs web conventions, modality, porting | `references/platform-conventions.md` |
| Moves the mobile exemplars share | `references/signature-moves.md` |
