# Research: 01 Interactive states

Accessed 2026-10-09 unless noted. Tiers per the researcher source policy (1 standards and official docs, 2 measured exemplars, 3 canonical books and research, 4 practitioners with shipped work, 5 leads only). Status: C consensus, X contested, O opinion.

## Key findings
1. Focus: `:focus-visible` lets authors style focus "without changing when the focus indicator appears"; mouse clicks on buttons generally show no ring, keyboard focus does (MDN).
2. The 2.4.13 Focus Appearance criterion is AAA, not AA, but its geometry (indicator area at least a 2 CSS px perimeter, 3:1 between focused and unfocused pixels) is the best available spec of a "good" ring. An inset ring has to be thicker than 2px to meet it.
3. Disabled controls are exempt from 1.4.11 and 1.4.3. Hover visuals do not need 3:1 (the pointer is the indicator). Focus indicators do need 3:1 against the adjacent background.
4. Apple: "Always include a press state for a custom button." Use style, not size, to mark the preferred option; one or two prominent buttons per view.
5. Material state layers (Material 3 token set v4): hover 0.08, focus 0.10, pressed 0.10, dragged 0.16. Note: design-color `ui-tokens-themes.md` lists focus and pressed at 12% (the older Material 2 values); see pipeline notes.
6. Carbon disabled default: "a decrease in opacity with no hover state change", 50% for components and icons, 25% for text. Carbon separates disabled (temporary, dependency), read-only (relevant content) and hidden (no permission).
7. `aria-disabled="true"` keeps the element in the focus order and is not dimmed by UA styles, so an explanation can be reached; but functionality must be suppressed by script.
8. `@media (hover: hover)` tests the primary input; touch devices emulate hover on long tap, which causes sticky hover if not gated.
9. Outline follows `border-radius` and does not take up space, so a focus outline never shifts layout (MDN outline).
10. Response time limits: 0.1 s feels instantaneous, 1 s keeps flow, 10 s holds attention (Nielsen). Loader timing details live in design-ux `04-states-feedback.md` (delay 150 to 300 ms, minimum display 300 to 500 ms).
11. Interaction details: frequent interactions should not animate; feedback such as the macOS menu "blinks the accent color" to confirm selection (Rauno Freiberg, practitioner with shipped work at Vercel).
12. `transition-behavior: allow-discrete` plus `@starting-style` lets popovers and dialogs animate in from `display: none` (MDN).

## Numbers
| Item | Value | Source |
|---|---|---|
| State layers | hover 8%, focus 10%, pressed 10%, dragged 16% | Material 3 tokens (Flutter gen_defaults state.json v4_0_0) |
| Disabled | 50% components and icons, 25% text (Carbon); Material 38% content and 12% container (per design-color, not re-verified here) | Carbon; design-color |
| Focus ring | 2px solid, 2px offset (FOUNDATIONS default); AAA reference: area of 2px perimeter, 3:1 change | FOUNDATIONS; WCAG 2.4.13 |
| Hit area | 44x44 pt (Apple), 24x24 CSS px floor (WCAG 2.5.8) | Apple HIG Buttons; FOUNDATIONS |

## Conflicting views
- Stepped colors (design-color default) vs overlays (Material). Overlays work on any surface but their contrast varies; stepped tokens keep measured contrast. Not a conflict once scoped: overlays on neutral surfaces (rows, ghost buttons), stepped on filled buttons.
- Hover asymmetry (fast in, slower out): practitioner opinion, no standard. Labelled opinion in the chapter.
- `cursor: not-allowed` on disabled: common but no source above tier 5. Labelled opinion.

## Claim table
| # | Claim | Quote | URL | Tier | Status |
|---|---|---|---|---|---|
| S1 | focus-visible vs focus | "allows authors to change the appearance of the focus indicator without changing when the focus indicator appears" | https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible | 1 | C |
| S2 | Mouse click usually shows no ring | "when a button is clicked using a pointing device, the focus is generally not visually indicated" | https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible | 1 | C |
| S3 | 2.4.13 area | "is at least as large as the area of a 2 CSS pixel thick perimeter of the unfocused component or sub-component" | https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html | 1 | C |
| S4 | 2.4.13 contrast | "has a contrast ratio of at least 3:1 between the same pixels in the focused and unfocused states" | https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html | 1 | C |
| S5 | Inactive exempt | "Note that this requirement does not apply to inactive user interface components." | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html | 1 | C |
| S6 | Hover visuals need not contrast | "do not themselves need to contrast 3:1 against the background" | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html | 1 | C |
| S7 | No border required when text identifies a control | "This success criterion does not require that controls have a visual boundary indicating the hit area." | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html | 1 | C |
| S8 | Press state | "Always include a press state for a custom button." | https://developer.apple.com/design/human-interface-guidelines/buttons (fetched as JSON from developer.apple.com/tutorials/data/design/human-interface-guidelines/buttons.json) | 1 | C |
| S9 | Style not size | "Use style [dash] not size [dash] to visually distinguish the preferred choice among multiple options." (Apple's em dashes replaced with [dash] per house rule) | same | 1 | C |
| S10 | Hit region | "a button needs a hit region of at least 44x44 pt" | same | 1 | C |
| S11 | Material state layers | "md.sys.state.hover.state-layer-opacity": 0.08 ... "focus" 0.1 ... "pressed" 0.1 ... "dragged" 0.16 | https://flutter.googlesource.com/mirrors/flutter/+/df64ca0b111147d4ebc71bc8775823617faa82e4/dev/tools/gen_defaults/data/state.json | 1 | C |
| S12 | Carbon disabled styling | "Default disabled states are most commonly styled by a decrease in opacity with no hover state change." | https://carbondesignsystem.com/patterns/disabled-states/ | 1 | C |
| S13 | Carbon read-only | "is still relevant to the user or important to task completion" | https://carbondesignsystem.com/patterns/disabled-states/ | 1 | C |
| S14 | aria-disabled keeps focus | "aria-disabled does not change the focusability of such elements, nor will the elements be dimmed by default browser styling" | https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-disabled | 1 | C |
| S15 | aria-disabled needs script | "Web developers must manually ensure such elements have their functionality suppressed when exposed to the disabled state." | same | 1 | C |
| S16 | hover media feature | "many mobile devices emulate hovering when the user performs an inconvenient long tap" | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover | 1 | C |
| S17 | Outline no layout | "outlines don't take up space, so they don't affect the layout of the document in any way" | https://developer.mozilla.org/en-US/docs/Web/CSS/outline | 1 | C |
| S18 | Outline radius | "corner angles using the border-radius property" | https://developer.mozilla.org/en-US/docs/Web/CSS/outline | 1 | C |
| S19 | 0.1 s | "is about the limit for having the user feel that the system is reacting instantaneously" | https://www.nngroup.com/articles/response-times-3-important-limits/ | 3 | C |
| S20 | Frequent actions | "cognitive burden after seeing the same animation for the hundredth time" | https://rauno.me/craft/interaction-design | 4 | O |
| S21 | Feedback blink | "briefly blinks the accent color (pink) to provide assurance" | https://rauno.me/craft/interaction-design | 4 | O |
| S22 | allow-discrete | "Transitions will be started on the element for discrete animated properties." | https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior | 1 | C |
| S23 | starting-style needed | "Without this, the entry animation would not occur and the popover would just appear." | https://developer.mozilla.org/en-US/docs/Web/CSS/transition-behavior | 1 | C |
| S25 | :active ordering | "will be overridden by any subsequent link-related pseudo-class (:link, :hover, or :visited) that has at least equal specificity" | https://developer.mozilla.org/en-US/docs/Web/CSS/:active | 1 | C |
| S26 | Tap highlight purpose | "indicates to the user that their tap is being successfully recognized" | https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-tap-highlight-color | 1 | C (non-standard property) |
| S24 | Apple prominent buttons | "Keep the number of prominent buttons to one or two per view." | Apple HIG Buttons (as S8) | 1 | C |
