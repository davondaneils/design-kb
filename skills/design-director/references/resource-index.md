# Resource index: where everything lives

One table for "where do I look for X". Each row points at the file that holds the mined material, so a resource is used through what the knowledge base already learned from it, with its sources and access dates. Full entries (who, why it meets the bar, tier, what was checked) are in the reference library `kb/references/`.

## 1. Inside the repo
| Need | Look in |
|---|---|
| Token names and values, the 16-item gate | `kb/FOUNDATIONS.md` (source of truth); design-foundations `references/tokens.md`, `references/fundamentals-checklist.md` |
| The quality bar, who counts as an exemplar | `kb/exemplars.md` |
| Measured numbers from an exemplar (type steps, tracking, radii, shadows, durations, 390 hero) | `kb/teardowns/INDEX.md` table 1 (by job) and table 2 (by domain), then the teardown's "Measured values" |
| What the best sites in a job category share | each playbook's `references/signature-moves.md` |
| Decide a landing page in values before building | design-playbook-landing `references/build-spec.md` |
| What shipped products do for a UI pattern (onboarding, empty states, tables, filters, settings, command palettes, notifications, checkout) | `kb/references/patterns/` (one file per pattern, with shots) |
| Mobile platform rules (HIG, Material) | design-playbook-mobile `references/platform-conventions.md` |
| The research behind any skill rule, with quotes and dates | `kb/research/<domain>/` (same file names as the skill references) |
| Past critic findings to not repeat | `kb/reviews/` (start with `round3-critic.md`) |
| Tested pages that passed the gate | `kb/tests/` |

## 2. Outside resources, already mined
| Resource | What it is for | Mined into |
|---|---|---|
| Scrolltide (scrolltide.co, eBook) | Scroll-driven sections, full builds, 66 components, 55 shaders, 14 UI previews, backgrounds; its seven-stage build method | design-motion `references/08-cinematic-scroll.md`; research `kb/research/motion/08-cinematic-scroll.md` (catalogue and, from PR #15, section G: components, shaders and UI by job); design-playbook-landing `references/build-spec.md`; library entry `kb/references/00-general.md` |
| easings.net | Named cubic-bezier curves; half-time settle figures | `--ease-reveal` (easeOutQuint) in `kb/FOUNDATIONS.md` Motion; design-motion `SKILL.md` token block and `references/08-cinematic-scroll.md` section 2; `kb/references/motion.md` |
| motionin.design (Motion sections) | Interactive section prompts, reduced-motion paths | design-motion 08; `kb/references/motion.md` |
| 60fps | Mobile motion gallery | `kb/references/motion.md` |
| Recent (formerly Godly), Land-book, Landdding, Footer | Landing page and section galleries for inspiration | `kb/references/00-general.md` (gallery section) |
| Mobbin, Refero, Page Flows | Real app screens and flows | `kb/references/00-general.md`, `kb/references/ux.md`; when a session has the Mobbin connector, search screens and flows directly |
| Iconly | Icon sets | `kb/references/graphic.md`; design-graphic `references/02-icon-systems.md` |
| Font In Logo, Typewolf, Fonts In Use | Identify and see faces in use | `kb/references/typography.md` |
| Web Interface Guidelines (Vercel), Emil Kowalski, Rauno Freiberg | Interaction and polish detail | `kb/references/00-general.md`, `motion.md`, `frontend-a11y.md` |
| Baymard, NN/g, GOV.UK | Evidence for UX and conversion rules | `kb/references/ux.md`, `conversion.md` |

## 3. Tools
| Tool | Run it for |
|---|---|
| `tools/check.mjs` | The whole automated hand-over gate in one command, with a report (preflight section 4) |
| `tools/render.mjs`, `tools/lint.mjs` | Screenshots and the fundamentals lint on their own |
| `skills/design-strategy/assets/brief_lint.mjs` | The strategy brief |
| `skills/design-copy/assets/claims_inventory.mjs` | Every number, date and promise on the page |
| `skills/design-search/assets/search-check.mjs` | Head, social card, structured data |
| `skills/design-conversion/assets/conversion-audit.mjs` | Pages that sell |
| `skills/design-graphic/assets/icon_audit.mjs`, `tab_contrast.py`, `wordmark.py` | Icons, favicon contrast, outlined wordmarks |
| `skills/design-motion/assets/motion-audit.mjs` | Filming each animation |
| `skills/design-frontend/assets/css-audit.mjs`, `pixel-diff.mjs`, `vitals.mjs`, `weight.mjs` | Build proof |
| `skills/design-polish/assets/polish-audit.mjs` | Polish detail (advisory) |
| `skills/design-color/assets/oklch_scale.py` | Ramps and non-text contrast |
| `skills/design-typography/assets/font_kit.py` | Subset and inline fonts |
| `kb/teardowns/measure.mjs` | Measure a new exemplar before borrowing from it |

## 4. Adding a resource
A new site, library or post Davon shares is mined, not bookmarked: a research note in `kb/research/<domain>/` with quotes and access dates, the rules it changes in the skill reference it belongs to, an entry in `kb/references/<domain>.md`, and a row in section 2 above. Same pipeline as everything else (CLAUDE.md).
