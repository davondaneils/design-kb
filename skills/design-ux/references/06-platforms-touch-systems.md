# Platforms, touch and design systems

Platform conventions (touch numbers, iOS vs Android vs web table, modality, porting rules) moved to design-playbook-mobile `references/platform-conventions.md`. This file keeps the principles, the component spec template and expert moves.

## Principles
1. **Native first.** On iOS and Android, people's expectations come from the system apps. Deviate only where the brand gains something measurable (Nielsen H4; Apple HIG; Material).
2. **Fingers are not cursors.** Targets are larger, hover does not exist, hands cover content, and people prefer the center of the screen (Hoober 2017).
3. **A component is a contract**, not a picture: anatomy, every state, behavior, keyboard, screen reader, content rules and tokens.

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
- **Floating bars cover the last item.** Reserve bottom padding equal to the bar plus the safe area so the last item and its focus stay visible (WCAG 2.4.11); platform specifics in design-playbook-mobile.
- **Tokens follow the DTCG 2025.10 format** so Figma variables, code and docs stay in sync (design-frontend).
- **Atomic thinking for scope, not for naming:** atoms to pages helps decide where state lives; teams name components by purpose ("Combobox"), not by atomic level (opinion).

## Before and after (image comparison) slider
Evidence and quotes: `kb/research/ux/08-image-comparison-slider.md` (read 2026-11-26).
- **Scroll wins.** `touch-action: pan-y` on the frame; move the line only once a touch has gone sideways (about 6px, and further sideways than down). A vertical swipe that starts on the picture scrolls the page (Poper).
- **Dragging is never the only way** (WCAG 2.5.7). A tap on the picture sends the line there; a native `input type="range"` (it can be visually hidden) gives arrow keys, Home, End and a value for screen readers (Cloud Four; a11yfix). Show the focus ring on the grip while the range has focus.
- **Track the finger one to one.** No easing while dragging (design-motion 04); only a tap glides, at `--duration-slow`. Nothing moves under reduced motion.
- **Grip 44px or larger; the whole frame is the drag area,** so the thumb never has to land on a 2px line.
- **Label both sides, in opposite top corners, each on a solid chip.** A label with no background disappears on one of the two photos (Common Ninja). Put each label on its own photo so the line cuts it with the picture.
- **Start at 50.** Both states show before anyone touches it.
- **The frame takes the photos' ratio** (design-art-direction 02, Crop). Do not go taller on phones.
- **If the pair was not shot from the same spot, do not use a slider.** Show two labelled photos, whole (a11yfix option 1). A wipe between unmatched angles shows a seam, not a change.

## Hand-offs
- Tokens, CSS, `<dialog>`, ARIA implementation: design-frontend.
- Visual style of components: design-color, design-typography, design-layout.
- Press and transition motion: design-motion.
- Platform conventions and porting between iOS, Android and web: design-playbook-mobile `references/platform-conventions.md`.
