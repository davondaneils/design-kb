# Mobile apps: signature moves

**Status of this file: opinion, unmeasured.** From the judge's knowledge of the shipped apps (Things 3, Cash App, Arc, Family), not from measurements; app internals cannot be fetched here. Teardowns in `kb/teardowns/` use published screenshots, press kits or screenshots Davon supplies. Per-app moves with evidence: `exemplars.md`.

1. **System first, brand in the details.** Things 3 uses standard navigation, lists and sheets, and puts its personality into one accent color, custom checkboxes and small, precise motion. Brand lives in content and a few controls, not in replacing the system chrome.
2. **One bold action per screen.** Cash App gives the main action the whole screen (a large numeric keypad and one primary button). On money and commerce screens, the primary action is the largest thing after the content.
3. **Thumb zone layout.** Primary actions sit low and centered; destructive and rare actions go to the top or into menus (Hoober, see `platform-conventions.md`).
4. **Sheets over pages for quick tasks.** Short edits and choices open in a sheet at medium height and dismiss with a swipe; full pages are for places the user will stay.
5. **Springs, not curves, for direct manipulation.** Anything the finger drags settles with a spring and keeps the finger's velocity; timed curves are for system-driven changes (design-motion `references/02-timing-easing.md`).
6. **Haptics paired with state changes** (native only): a light tick on toggle and selection, a success pattern on completion, never on scroll.
7. **Large titles that collapse.** iOS large titles shrink into the bar on scroll; the title stays the anchor of where you are.
8. **Dark mode as a first-class theme**, with elevated surfaces lighter, and the accent re-tuned for dark backgrounds rather than reused.
