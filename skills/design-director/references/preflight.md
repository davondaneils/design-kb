# Preflight: read this before any design work

Every design job, every time, including a "quick tweak" to a page that already exists. The knowledge is in this repo; the failures on record came from not opening it at the moment of the decision (a font picked without design-typography; a cinematic page built from Scrolltide's restraint rules but none of its components, shaders, UI or backgrounds). This page is the order, the triggers that add files, and the proof that you read them.

## 1. Load, in this order (non-negotiable)
1. **design-director** `SKILL.md` (this skill). Sections 2 to 5 are the method.
2. **design-foundations** `SKILL.md`, then `references/fundamentals-checklist.md` and `references/tokens.md`. Token names and numbers come from here (source of truth: `kb/FOUNDATIONS.md`).
3. **design-strategy** `SKILL.md` section 1, then write the brief at the depth it sets and run `node skills/design-strategy/assets/brief_lint.mjs <brief.md>`. No visual decision before the brief.
4. **The playbook** for the job (director section 2 step 3): its `SKILL.md`, then every file its section 1 names, in its order, and its `references/signature-moves.md`. Landing pages also write `references/build-spec.md` beside the brief.
5. **Trigger files** from section 2 below, for every trigger the brief or the request matches.
6. **Exemplars**: the job's row in `kb/teardowns/INDEX.md` table 1, and each named teardown's "Measured values" and "Borrow / Do not borrow". That is the bar.

A file that is named above and is not in your read log (section 3) was not read. Skimming a SKILL.md and skipping the references it names is the most common failure on record.

## 2. Trigger table: when the work touches X, read Y before deciding X
Read these even when the playbook did not reach that step yet, and even inside an existing page. A decision taken before its file is read is redone.

| The work touches | Read before deciding |
|---|---|
| Any font: choosing, pairing, swapping, loading | design-typography `SKILL.md`, `references/02-selection-pairing.md`, `06-type-without-web-fonts.md`, `03-web-fonts-variable-licensing.md`; `07-type-led-pages.md` if type carries the page |
| Type sizes, scale, line length, leading | design-typography `references/01-scale-measure-leading.md`, `05-typographic-detail.md` |
| Palette, brand color, dark mode | design-color `SKILL.md`, `references/palette-building.md`, `ui-tokens-themes.md`, `contrast-accessibility.md` |
| Grid, spacing, section order, phone layout | design-layout `references/05-page-composition-and-density.md`, `06-pacing-signature-and-phone-editing.md` (flatplan and phone edit list) |
| Photos, backgrounds, textures, hero art, text over images | design-art-direction `SKILL.md`, `references/01-concept-and-consistency.md`, `03-composition-and-overlays.md`, `04-visuals-without-image-hosts.md` |
| Logo, wordmark, favicon, icon set, social card | design-graphic `SKILL.md`, `references/01-logo-identity.md`, `02-icon-systems.md`, `05-composition-social.md` |
| Any motion: hover, reveal, page transition | design-motion `SKILL.md`, `references/01-purpose-restraint.md`, `02-timing-easing.md`, `04-micro-interactions.md`, `05-accessibility-performance.md` |
| "Cinematic", "wow", scroll-driven, pinned, film, frame sequence, animated background or shader | design-motion `references/08-cinematic-scroll.md` **at the flatplan, before layout**: its mechanism picker and (once PR #15 lands) its component-by-job table; research `kb/research/motion/08-cinematic-scroll.md` (the Scrolltide catalogue: sections, full builds, components, shaders, UI previews, backgrounds; easings.net curves); the playbook's `build-spec.md` MOTION block. The story beats and the component for each beat are the layout; motion added to a finished static page fails |
| Buttons, forms, states, navigation, onboarding | design-ux `SKILL.md`, `references/03-forms.md`; design-polish `references/01-interactive-states.md` |
| Price, plan, signup, checkout, waitlist, upgrade | design-conversion `SKILL.md` and the references it names; design-ux `references/07-commerce-flows.md` |
| Tables, filters, settings, command menus, app shells | design-product-ui `SKILL.md` and the reference for that pattern; examples in `kb/references/patterns/` |
| Numbers from data, counts, money, dates, stock | design-data `references/07-data-shapes-the-ui.md`; design-copy `references/06-copy-in-context.md` |
| Any page copy or microcopy | Director section 3 (which copy skill); design-copy `references/01-page-copy-structure.md` or `02-ux-microcopy.md` |
| A public page | design-search `references/07-page-build.md` (head, social card, favicon, structured data) |
| "Make it look like <site>" | that site's teardown in `kb/teardowns/` if it exists; otherwise measure it with `kb/teardowns/measure.mjs` before borrowing |
| Charts, KPIs, dashboards | the dataviz skill, then design-product-ui |
| Shadows, borders, radius, finish, "looks cheap" | design-polish `SKILL.md`, `references/06-polish-checklist.md` |
| A resource, site or library Davon names | `references/resource-index.md` first: it may be mined already. If it is new, mine it into a research note and the skill it belongs to; never use it once and lose it |

## 3. The read log (proof you read it)
Before the first line of build, write `design-log.md` beside the work:

```
Job: <one line>   Playbook: <name>   Strategy depth: <inherit | three lines | one page | full>
Exemplars: <first pick, then>   (kb/teardowns/INDEX.md table 1)
Triggers matched: <font, cinematic, sells, ...>
First screen after this pass: <what changes at the top of the page, or "unchanged on purpose: <reason>">
Read (path, one line on what it decided):
- skills/design-foundations/references/tokens.md: spacing and type steps
- skills/design-typography/references/02-selection-pairing.md: chose X over Y because ...
Resources consulted: <Scrolltide components: Zoom Reveal, Focus Reveal; easings.net easeOutQuint>
```

Add to it as the job goes: each new trigger, each file read, each decision a person made (the build spec's "two columns": what the build got right on its own, what a person had to decide). The hand-over attaches it.

## 4. Hand-over gate (required, not optional)
1. `node tools/check.mjs <page.html> [--states a,b] [--sells] [--private]` from the repo root (after `npm ci` in `tools/`). It runs the brief lint, renders at 390, 768, 1024 and 1440, the fundamentals lint, the claims inventory, the search check, the conversion and icon audits when they apply, the CSS audit and the polish audit, and writes `check-<page>/check-report.md`. It must exit 0. Fix every FAIL; read every WARN.
2. Do every judged step the report lists (director section 5 steps 1, 3, 7 to 13), ticking each with what you saw. Motion is judged from a recording, never from screenshots. Before judging a section, count its pictures in the render against its `<img>` tags: a section judged without its images is not judged (Stand Firm v3: four empty chapters passed a critic because the renders had skipped every lazy image).
3. A fresh-context critic pass (director section 5 step 13), or the hand-over says "gate not claimed: self-review only".
4. The hand-over attaches `design-log.md` and `check-report.md`, then names the three biggest gaps against the exemplars.

## 5. Close the loop
When Davon corrects something, the lesson goes back into the knowledge base in the same job: the skill reference it belongs to, plus a research note with the evidence, in a pull request (as `kb/research/motion/08-cinematic-scroll.md` section G did for the Stand Firm rebuild). A correction that lives only in a chat thread is made again by the next thread.

## 6. Working on files outside this repo
Project work (for example `/mnt/project-files/<client>/`) still uses this repo: read the skills from `skills/` (or `.claude/skills/`, the same files) and run the tools from the repo root against the page's absolute path. Keep `design-log.md` and the check report beside the page.

**Publishing a page as a hosted preview (an Artifact link):** inline every image as a data URI in the published copy, and check it in a browser opened from that copy alone (every `<img>` has `naturalWidth > 0`). Relative `img/` paths that work on the local server came up blank on the hosted link twice for the Stand Firm pages (Davon, 2026-10-24). Keep the relative-path version as the source and hand-off file; the inlined copy is only for the preview.

## 7. An "improve it" brief on an existing page
"Make it better", "one more pass" and "one last time" are visible-leap briefs (director section 2 step 5). Plan the pass from the top of the page down: decide what the first screen becomes and what one visual idea the sections carry, then do the fixes the gate asks for. Fill the "First screen after this pass" line of the read log before the first edit; if it says "unchanged", say so in the hand-over's first sentence and expect to be asked why. The hand-over opens with before and after pictures of the first screen at 1440 and 390 (director section 5, hand-over rule). Evidence: Stand Firm v4, 2026-10-24, where a pass that rebuilt every section below the fold and shortened the buy page by 1,300px read as "you didn't even change anything" because the first screens were v3's.
