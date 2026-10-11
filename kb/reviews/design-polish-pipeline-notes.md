# design-polish: pipeline notes

Suggested changes to shared files this wave may not edit. Each item names the file, the change, and the evidence. Owner decides.

## 1. `tools/lint.mjs`: automatable polish checks
`skills/design-polish/assets/polish-audit.mjs` already implements all of these as an advisory script (Playwright via `tools/browser.mjs`), so porting is mostly copying functions. Test evidence: `kb/tests/design-polish.md`.

### Promote to hard gate (low false-positive rate in testing, each maps to a fundamentals item)
| Check | How | Evidence |
|---|---|---|
| Focus shape change | For each focusable element that paints a background or border, compare computed `border-radius`, `border-width`, `padding`, `font-weight` at rest and after `.focus()` with keyboard modality. Any difference fails. | Caught `a:not([class]):focus-visible` squaring the dashboard nav (8px to 4px); lint, critic and author missed it |
| State layout shift | Record `offsetWidth`/`offsetHeight` of each control and its parent at rest, hover and focus. Any change fails. | Clean on all six pages; catches the classic bold-on-hover jump |
| Radius off family | Every computed radius in {0, 4, 8, 12, 16, 9999 or 50%}, plus nested values derived as outer minus gap when the child sits inside a padded rounded parent. | Baseline coffee page clean; cheap and exact |
| `color-scheme` missing | Page with a `prefers-color-scheme: dark` rule but no `color-scheme` on `:root` fails (native controls, scrollbars and form fields stay light in dark). | Both baselines were missing it |

### Keep as warnings
| Check | How |
|---|---|
| Shadow inventory | More than 5 distinct `box-shadow` values, any negative y offset, any shadow alpha over 0.25, any non-ring shadow in dark mode |
| Icon stroke vs text | Inline SVG 10 to 28px tall: `stroke-width` x scale vs adjacent text stem (Inter: size x 0.088 / 0.107 / 0.127 / 0.147 for 400 / 500 / 600 / 700); warn beyond 0.25px |
| Heading wrap | h1 to h3 at 390 and 1440: warn when the last line holds one word (a 1440 only check missed 4 orphans) |
| Tabular figures | Digits in `td`, KPI values and prices without `tabular-nums` |
| Hover gating | `:hover` rules that change more than color, outside `(hover: hover) and (pointer: fine)` |
| SVG hairlines | 1px horizontal or vertical SVG lines on integer coordinates without `shape-rendering: crispEdges` (renders as 2 rows of 50% gray at 1x) |
| Forced colors edges | Re-render with Playwright `forcedColors: 'active'`; inputs and buttons with no visible border (box-shadow edges vanish) |
| Sticky header vs focus | With a sticky or fixed header, tab through and warn when the focused element's rect sits under the header (WCAG 2.4.11) |

### Fix in the existing `focus` check
It inspects the element, parent and grandparent only. A card ring drawn with `.card:has(a:focus-visible)` three levels up fails. Walk ancestors to the nearest one with a box (or up to 4 levels) before failing. Workaround used: a second cue on the link itself, which is better for users anyway, so this is low priority.

## 2. `kb/FOUNDATIONS.md`
- **Shadow recipes.** FOUNDATIONS names `shadow-0..4` and `elevation-*` but the owner skill (design-layout) carries no recipe. Adopt the design-polish recipe (`skills/design-polish/assets/polish-tokens.css`): tinted with `--shadow-rgb`, two layers (contact plus ambient), y offsets down only, elevation tokens = ring plus shadow; dark = ring plus top highlight, no shadow.
- **Add tokens** `--color-primary-active` (pressed is a further step past hover; testing found pressed equal to hover), `--ring` (the 1px elevation ring) and `--highlight` (dark top edge).

## 3. design-color
- Material 3 state layer opacities are hover 0.08, focus 0.10, pressed 0.10, dragged 0.16 (m3.material.io states). design-color's overlay row says 12% for focus and pressed; align to 10%.
- Disabled label color: align with `--color-text-muted` so disabled reads as unavailable, not as a third text tier.
- Dark-mode primary hover currently darkens. On a dark surface, lightening reads as "lift" (opinion; a design-color call).

## 4. design-director
- Load design-polish after the fundamentals gate passes and before the exemplar comparison in the self-critique loop; run `polish-audit.mjs` beside `lint.mjs`.
- Require a state sheet (every control in every state, plus empty, loading and error for data pages) for any page with interactive controls. Evidence: the coffee baseline's band CTA focus ring measured 1.02:1, a gate-level miss that only the state sheet surfaced. The baseline's judged pass missed it.

## 5. Playbooks
- Step 11 ("polish") should name design-polish and its `references/06-polish-checklist.md` instead of a generic polish step.

## 6. Pilot pages
- `kb/tests/design-color/` with-skill coffee page: band CTA focus ring `currentColor` fails 3:1 (1.02:1 dark, 2.83:1 light). Fixed in `kb/tests/design-polish/coffee-after.html`; the color pilot's own copy is unchanged.
