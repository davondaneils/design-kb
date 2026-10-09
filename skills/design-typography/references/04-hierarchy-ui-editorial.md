# Hierarchy in UI and editorial

Read this when a screen or page needs a clear reading order, when styles multiply, or when building a type ramp for components.

## Principles
1. **Hierarchy is a ranking, not a decoration.** Decide the order in which a reader should see things (one primary, a few secondary, the rest quiet) before choosing any style.
2. **Use the cheapest lever that works.** In order: position and space, then size, then weight, then color (still passing contrast), then case and tracking, then a different typeface. Each lever you add costs consistency.
3. **Fewer styles, more contrast between them.** Two styles that differ a lot read as hierarchy; five that differ a little read as noise. Apple separates Headline from Body by weight alone at the same 17pt (HIG).
4. **Semantics and visuals are separate decisions.** The HTML heading level follows the document outline (WCAG 1.3.1); the visual style follows the design. An `h2` may look like `--text-lg`.

## Fundamentals (non-negotiable)
- One h1 per page, heading levels in order, no skipped levels for styling reasons (WCAG 1.3.1).
- Each visible text style maps to one token pair (size and line height) plus weight. No one-off styles.
- Adjacent levels differ by at least one scale step (1.25) or two weight steps (400 to 600). Smaller differences look accidental (opinion, consistent with Butterick's "use bold or italic as little as possible").
- Muted text still passes 4.5:1 (foundation `--color-text-muted`). Never make text muted with `opacity`; contrast then changes with every surface it sits on.
- Never demote one element three ways at once (small and light gray and caps): it vanishes.
- Bold and italic never together (Butterick). Underline only for links.
- Caps only for labels under one line, with +0.06 to +0.1em tracking (Butterick: 5 to 12%).

## UI type ramp (foundation tokens)
| Role | Token | Weight | Notes |
|---|---|---|---|
| Page title | `--text-2xl` (31/36) | 600 | One per screen |
| Section title | `--text-lg` (20/24) | 600 | Space above 32 to 48, below 12 to 16 |
| Card or dialog title | `--text-base` (16/24) | 600 | Same size as body, weight carries it (Apple pattern) |
| Body and descriptions | `--text-base` (16/24) | 400 | |
| Labels, table cells, secondary | `--text-sm` (14/20) | 400 or 500 | Labels 500 |
| Caption, metadata, overline | `--text-xs` (12/16) | 500 | Caps only here, +0.08em |
| Button | `--text-sm` or `--text-base` | 500 or 600 | Trim half-leading for optical centering |
| Input text | `--text-base` (16) | 400 | Never below 16px (iOS zoom) |
| KPI value | `--text-3xl` (39/44) | 600 | Tabular lining figures; unit at `--text-lg` on the same baseline |

Six to eight styles cover almost every product screen. Material 3 offers 15 roles; most screens use five or six (M3 tokens). Opinion: if a single screen shows more than six text styles, merge some.

## Decision rules
- **If** two items compete for attention **then** demote one; do not promote both.
- **If** you are about to add a size **then** first try weight or color on the existing size.
- **If** a label sits next to its value **then** the value carries the emphasis (bigger or heavier), the label is quiet (`--text-sm`, muted). Users scan values, not labels.
- **If** numbers update or align in columns **then** `font-variant-numeric: tabular-nums` and right-align them.
- **If** a heading wraps to two to six lines **then** `text-wrap: balance` (Chromium limit 6 lines, Firefox 10, MDN). **If** paragraphs end in a single orphaned word **then** `text-wrap: pretty` on body (WebKit improves the whole paragraph, Chromium the last four lines). Never `balance` on long passages (WebKit blog).
- **If** text sits inside a button, chip or badge **then** trim the line box (`text-box: trim-both cap alphabetic`) so padding is measured from the letters, and equal padding looks equal.
- **If** the reader glances (dashboards, nav, signage, watch faces) **then** go larger and regular width; short uppercase labels are acceptable here because single-word glance tests favored caps (NN/g, MIT AgeLab). Not for sentences.

## Editorial ramp (long-read, desktop)
| Element | Style | Notes |
|---|---|---|
| Kicker or section | `--text-xs` caps, 600, +0.08em | Optional |
| Headline | `--text-5xl` fluid, line height 1.1, -0.025em, `text-wrap: balance` | Display optical size if available |
| Dek (standfirst) | `--text-lg` 20/30, muted, max 2 to 3 lines | Sets up the story |
| Byline and date | `--text-sm`, muted | `<time>` element |
| Body | `--text-lg` 20, line height 1.5, `max-inline-size: 52ch` (63 to 68 characters) | `text-wrap: pretty`, `hyphens: auto` on narrow screens with `lang` set |
| Subhead | `--text-xl` 25/30, 600 | 48 above, 12 to 16 below |
| Pull quote | `--text-2xl`, italic or display face, hanging punctuation | Breaks the measure deliberately |
| Caption | `--text-sm`, muted, same measure or narrower | |

## Do and don't
- Do: section title 20/600 above 16/400 body. Don't: section title 18/500 above 16/400 body (too close, looks like an error).
- Do: muted color token at 4.5:1. Don't: `opacity: 0.6` on gray text over a tinted card.
- Do: `<h2 class="text-lg">` when the outline needs h2 but the design is small. Don't: `<h4>` because "it looked the right size".

## Worked examples
1. **Analytics dashboard card.** Card title 16/600; KPI 39/600 tabular; delta 14/500 in success or danger color plus an arrow icon (never color alone); label 12/500 caps +0.08em muted. Four styles, ranking: KPI, then title, then delta, then label.
2. **Pricing page.** Plan name `--text-lg` 600; price `--text-4xl` 600 tabular with currency symbol at `--text-xl` top-aligned; period `--text-sm` muted; features `--text-base`. Recommended plan wins by surface and a badge, not by a third type size. For conversion structure and copy, use the sales-funnels and copywriting skills.
3. **Docs article.** h1 `--text-3xl`, h2 `--text-xl` with 48 above, h3 `--text-lg`, body `--text-base` 1.5, `font-size-adjust: ex-height from-font` on `body` (it resolves to the body face's ratio there and inherits), so inline code in mono matches the body x-height. Declared on `code` itself it measures the mono and does nothing (measured, research 06 M4).

## Hand-offs
- Grid, spacing and section rhythm: design-layout. Color tokens: design-color.
- Headline wording, decks, microcopy: design-copy and the copywriting skill.
- Tables: design-product-ui. Charts: dataviz.
