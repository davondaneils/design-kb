# Tests: design-frontend v0.1 (tester)

Run 2026-10-09. Each brief was answered twice: A = a strong generic assistant with no skill loaded; B = the same assistant following SKILL.md and the references it points to. Outputs are condensed to the decisions that differ; code is shown where it decides the score.

## Rubric (from the skill's own rules)
| Criterion | Weight | What earns full marks |
|---|---|---|
| Fundamentals gate (section 1 of SKILL.md) | pass / fail | Zero misses. One miss caps the total at 5/10. |
| Correctness | 2 | Code valid; facts match current docs (October 2026) |
| Accessibility | 2 | WCAG 2.2 AA met in code, with SC named where it matters |
| Performance | 2 | LCP element prioritized, CLS prevented, budget respected |
| Specificity | 2 | Real numbers, tokens and attributes, not adjectives |
| Expert moves and fit | 2 | Uses the non-obvious moves; fits the brief and the foundation contract |
Pass bar: B wins clearly on every brief and would ship at a top studio (B at least 9/10, A at least 2 points lower).

---

## Brief 1: SaaS hero and pricing section, Next.js + Tailwind v4
"Build the hero and the three-tier pricing section from our Figma in Next.js 16 with Tailwind. Monthly / yearly toggle. Must be fast and accessible."

### A (generic), condensed
- Hero: `<div className="h-screen bg-[url('/hero.jpg')] bg-cover">` with `<h1 className="text-6xl">`.
- `<Image src="/product.png" priority ... />` below the headline.
- Toggle: `<div onClick={() => setYearly(!yearly)} className="w-12 h-6 rounded-full ...">`.
- Cards: `p-8 rounded-2xl shadow-lg`, middle card `bg-indigo-600 text-white scale-105`, prices `text-5xl`, buttons `<button onClick={() => router.push('/signup')}>`.
- Notes "add aria labels for accessibility" and "images are optimized by next/image".

### B (with skill), condensed
- Landmarks and outline first: `header > nav[aria-label=Primary]`, `main > section[aria-labelledby=hero-title] > h1`, `section[aria-labelledby=pricing-title] > h2`, card names `h3`.
- Hero visual is the LCP element: `<Image src={hero} alt="" sizes="(width >= 64em) 50vw, 100vw" fetchPriority="high" />` (decorative, so empty alt), no CSS background, `min-h-[100svh]` not `h-screen`. `priority` not used (deprecated in Next 16).
- Display type from `@theme` tokens: `text-5xl` is `clamp(2.4375rem, 1.8995rem + 2.3913vw, 3.8125rem)` (39 to 61px, ratio 1.56, passes 1.4.4). `text-wrap: balance` on h1.
- Toggle: `<fieldset>` with visually hidden `<legend>Billing period</legend>` and two radios styled as a segmented control; arrow keys and state announcement are native. Price change announced through a `role="status"` region ("Yearly prices, 2 months free").
- Cards: `@container` wrapper, row at `@3xl` (48rem container) else stacked; `rounded-xl p-6` (16px, 24px), CTA `rounded-md`. Highlight via 2px `border-primary` plus a "Most popular" text badge, no `scale-105` (it shifts layout and blurs text). Prices `tabular-nums`, `&nbsp;` in "$29&nbsp;/&nbsp;month".
- CTAs are `<Link href="/signup?plan=pro">`, so middle click works; 44px min height; names include visible text ("Start Pro trial").
- Hover lift behind `hover:` only under `(hover: hover)` via a custom variant; transition lists `transform, box-shadow` with `--duration-fast` and `--ease-standard`, opt-in under `motion-safe:`.
- Delivery note: LCP element and priority, tokens source, Baseline caveats (none used beyond widely available), manual tests left (VoiceOver, forced colors).

### Scores
| Criterion | A | B |
|---|---|---|
| Fundamentals gate | Fail (div toggle, button-as-link, LCP as CSS background, `h-screen` hero, color-only highlight) | Pass |
| Correctness | 1 (uses deprecated `priority`) | 2 |
| Accessibility | 0 | 2 |
| Performance | 1 | 2 |
| Specificity | 1 | 2 |
| Expert moves and fit | 0 | 2 |
| **Total** | **3 (capped at 5)** | **10** |

---

## Brief 2: Fix a slow marketing site
"Mobile LCP is 4.1s and CLS 0.22 at p75. Hero is a CSS background image, brand font from Google Fonts, a cookie banner appears at the top after load, and we use a tag manager."

### A (generic), condensed
- Compress images, convert to WebP, add `loading="lazy"` to images "including the hero to save bandwidth", add `<link rel="preload">` for all fonts, `font-display: swap`, minify JS, use a CDN, "consider removing unused CSS".

### B (with skill), condensed
- Diagnose first: collect LCP attribution with `web-vitals` attribution build. Expected split: high resource load delay (background image discovered only after CSS parses), so fix discovery before bytes.
- LCP: move hero to `<img srcset sizes="100vw" fetchpriority="high">` in the HTML, AVIF with WebP fallback in `<picture>`, widths 640 to 1920; never lazy. Remove any fade-in on hero text (render delay).
- Fonts: Google Fonts uses two origins, so `preconnect` to fonts.googleapis.com and fonts.gstatic.com (`crossorigin`), or self-host on the HTML origin; one preloaded WOFF2 for the headline weight only; `swap` with a metric-matched fallback (`size-adjust`, `ascent-override`, etc. via Fontaine), plus a Roboto fallback face for Android.
- CLS: cookie banner becomes a fixed bottom overlay (no push), `html { scroll-padding-block-end: <banner height> }` so it never hides focused elements (2.4.11); ad and embed slots get reserved heights; all images get width and height.
- Tag manager: load after `load` or on first interaction; it counts inside the about 75 KiB JS budget for a markup-centric site.
- Free wins: remove `unload` handlers (bfcache), speculation rules `prerender` at `moderate` for internal links.
- Verify in field data after 28 days (CrUX window), not just Lighthouse.

### Scores
| Criterion | A | B |
|---|---|---|
| Fundamentals gate | Fail (lazy-loading the LCP image makes it worse; preloading all fonts competes with the hero) | Pass |
| Correctness | 0 | 2 |
| Accessibility | 1 | 2 |
| Performance | 1 | 2 |
| Specificity | 1 | 2 |
| Expert moves and fit | 0 | 2 |
| **Total** | **3 (capped at 5)** | **10** |

---

## Brief 3: Accessibility audit of a sign-up modal and card grid
"Audit: modal sign-up built from divs with an X icon to close, sticky header, errors shown as toasts that disappear after 3s, card grid with a hover zoom, focus styles removed because the designer disliked them."

### A (generic), condensed
- Add `role="dialog"` and `aria-modal="true"`, add `aria-label="close"` to the X, trap focus, restore focus styles with `:focus { outline: 2px solid blue }`, keep errors visible longer (5s), "make sure color contrast is sufficient".

### B (with skill), condensed (reported in the skill's audit order)
Fundamentals failures:
1. Div modal: replace with `<dialog>` + `showModal()` (inert background, Esc, top layer for free), `aria-labelledby` to its h2, `autofocus` on the first field, explicit "Close" button (`<button aria-label="Close">` with `aria-hidden` SVG, 44px target). SC 2.1.1, 4.1.2, 2.4.3.
2. Focus removed: restore with `:focus-visible { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }`, not `:focus`, so the designer's mouse-click complaint is solved without hurting keyboard users. Outline (not box-shadow) so it survives forced colors. SC 2.4.7; meets 2.4.13 AAA too.
3. Sticky header hides focus: `html { scroll-padding-block-start: 72px }` (header height). SC 2.4.11.
4. Toast-only errors that vanish: inline errors next to fields with `aria-invalid` and `aria-describedby`, focus first invalid field, `role="alert"` summary; errors never auto-dismiss. SC 3.3.1, 3.3.3, 2.2.1.
5. Paste and password managers: confirm not blocked; offer passkey or magic link. SC 3.3.8.
Expert improvements:
6. Hover zoom: `transform: scale(1.03)` on the image inside an `overflow: clip` frame (no layout shift), only under `(hover: hover) and (pointer: fine)` and `prefers-reduced-motion: no-preference`; mirror it on `:focus-within` so keyboard users get the same affordance.
7. Card is one stretched link (title `<a>` with `::after { inset: 0 }`), not a link wrapping the whole card.
8. Forced colors check: card borders are shadows only, so add `outline: 1px solid transparent` to keep the boundary visible.

### Scores
| Criterion | A | B |
|---|---|---|
| Fundamentals gate | Fail (`:focus` ring brings back the mouse ring the designer removed, so it will be removed again; sticky-header obscuring missed; toasts still vanish) | Pass |
| Correctness | 1 | 2 |
| Accessibility | 1 | 2 |
| Performance | 1 | 2 |
| Specificity | 1 | 2 |
| Expert moves and fit | 0 | 2 |
| **Total** | **4 (capped at 5)** | **10** |

---

## Trigger check
| Prompt | Should fire | Fires (from description) |
|---|---|---|
| "Code this Figma pricing page in Next" | yes | yes ("code this design", "Next.js") |
| "Our site is slow on mobile, Lighthouse says LCP" | yes | yes ("page is slow", "Lighthouse", "LCP") |
| "Make this form accessible" | yes | yes ("make it accessible") |
| "Pick a palette for a calm fintech brand" | no (design-color) | no: description excludes choosing palettes |
| "Write a sales email" | no (copywriting) | no |
| "Which font pairs with Inter?" | no (design-typography) | no: excludes choosing typefaces; would fire only if the user asks about loading it |

## Gaps found and sent back (all fixed in v0.1)
1. Brief 2 needed the Google Fonts two-origin preconnect detail, which was only implicit in reference 05. Added explicitly. **Fixed.**
2. Brief 1 needed text over images (hero headline on a photo). The skill had no rule for contrast over imagery. Added a scrim rule to reference 03 and SKILL.md gate item 8. **Fixed.**
3. Brief 3 needed `:focus-within` parity for hover effects. Added to SKILL.md decision table. **Fixed.**
4. Brief 1: Tailwind `motion-safe:` and a hover-capable custom variant were not named. Added to reference 06. **Fixed.**
5. Brief 2: verifying fixes in the field needs the 28-day CrUX window; added to reference 04. **Fixed.**

## Result
Pass. B beat A by 5 or more points on every brief and met every fundamentals check. B outputs are at the level of a top product studio on these briefs; A outputs would fail a senior review on fundamentals.
