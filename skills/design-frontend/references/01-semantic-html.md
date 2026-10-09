# 01 Semantic HTML and native controls

Sources: kb/research/frontend/01-semantic-html.md. Opinion is marked (opinion).

## Principles
1. The element is the API. Choosing `<button>` gives focus, Enter and Space activation, a role and a name for free. A `div` gives nothing and every missing behaviour is a bug (W3C, Using ARIA).
2. No ARIA is better than bad ARIA. ARIA changes what assistive tech announces, never what the element does (W3C, Using ARIA).
3. Structure is shared by humans, screen readers, search engines and AI agents. Landmarks and headings are the table of contents for all of them.
4. The platform now ships the hard widgets: `<dialog>`, `popover`, `inert`, `<details>`, anchor positioning. Reach for them before a library (opinion, backed by Baseline status in research).

## Decision rules
| If | Then |
|---|---|
| It changes the URL or goes somewhere | `<a href>` (or framework `<Link>`), so Cmd/Ctrl click and middle click work |
| It does something on this page | `<button type="button">` |
| It submits data | `<button type="submit">` inside a `<form>` |
| It toggles state | `<button aria-pressed>` for a toggle button, or `<input type="checkbox" role="switch">` for a setting |
| It opens a menu, tooltip-like panel or teaching bubble | `popover` attribute plus a `popovertarget` button; position with anchor positioning where supported, fallback to static placement |
| It blocks the page until answered | `<dialog>` opened with `showModal()` |
| It is a show/hide section | `<details><summary>`; add `name` for exclusive accordions |
| Part of the page must be non-interactive (behind a drawer, during drag) | `inert` attribute |
| A list of things of the same kind | `<ul>`/`<ol>`; nav links too |
| Data with rows and columns | `<table>` with `<caption>`, `<th scope>` |
| You are tempted to add `role` | Check for a native element first; if you still need it, the widget must also implement the full keyboard pattern from the ARIA Authoring Practices Guide |

## Page skeleton (default)
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pricing | Brand</title>
  <link rel="preconnect" href="https://cdn.example.com" crossorigin>
  <link rel="preload" as="image" href="/hero-1200.avif" fetchpriority="high">
  <link rel="stylesheet" href="/app.css">
  <script src="/app.js" defer></script>
  <meta name="description" content="...">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header>
    <nav aria-label="Primary">...</nav>
  </header>
  <main id="main" tabindex="-1">
    <h1>...</h1>
  </main>
  <footer>...</footer>
</body>
</html>
```
- Head order follows capo.js weights: charset and viewport, title, preconnect and high-priority preload, async scripts, sync CSS, normal preloads, defer scripts, prefetch, then everything else (meta description, icons, Open Graph).
- Never `maximum-scale=1` or `user-scalable=no` in the viewport (fails 1.4.4).
- Title pattern: page first, brand last (`Pricing | Brand`), so tabs and screen readers lead with the unique part (opinion, common practice).
- One `<main>`. Every `<nav>` gets an `aria-label` when there is more than one.
- Headings: one `h1`, no skipped levels inside a section, chosen for structure not size. Size is a class.

## Forms (the most failed area: 51% of home pages have unlabeled inputs, WebAIM 2026)
- Every input has a visible `<label for>`. Placeholder is never the label.
- Group radios and checkboxes in `<fieldset><legend>`.
- Use `autocomplete` tokens (`email`, `given-name`, `postal-code`, `one-time-code`, `new-password`, `current-password`): WCAG 1.3.5, and it is what makes 3.3.7 and 3.3.8 easy.
- Use the right `type` and `inputmode` (`type="email"`, `inputmode="numeric"` for codes; never `type="number"` for card numbers, ZIP codes or IDs).
- Wire errors: `aria-invalid="true"` on the field, error text in an element referenced by `aria-describedby`, and focus the first invalid field on submit.
- Never block paste. Never disable the submit button before the user has tried to submit (opinion, Vercel guidelines: keep it enabled until the request starts).
- Inputs render at 16px or larger on mobile so iOS Safari does not zoom on focus.

## Accessible names
- The visible label must be contained in the accessible name, ideally at the start (WCAG 2.5.3). A button that reads "Buy now" must not be named "Purchase item".
- Icon-only button: `<button aria-label="Close">` or visually hidden text. The SVG inside gets `aria-hidden="true"`.
- Images: informative `alt` says what the image communicates in context; decorative `alt=""`. Missing alt is on 53.1% of home pages (WebAIM 2026).
- Informative inline SVG (a chart, a logo that is the only content of a link): `<svg role="img" aria-label="Revenue up 12% in Q3">` or a `<title>` as first child referenced by `aria-labelledby`. Decorative SVG: `aria-hidden="true"`.
- Links: the text must make sense out of context. No "click here", no empty links (46.3% of home pages).

## Dialog recipe
```html
<button type="button" id="open-signup">Start free trial</button>
<dialog id="signup" aria-labelledby="signup-title" closedby="any">
  <form method="dialog">
    <h2 id="signup-title">Start your free trial</h2>
    ...
    <button value="cancel" formnovalidate>Cancel</button>
    <button value="confirm" autofocus>Create account</button>
  </form>
</dialog>
```
- `showModal()` for modal; the browser inerts the background and handles Esc.
- `autofocus` on the most likely action, or on Close for content dialogs. No `tabindex` on `<dialog>`.
- Return focus to the opener on close (browsers do this for `showModal()`; verify in custom code).
- `closedby` support varies (V): keep an explicit close button regardless.

## Do and don't
| Do | Don't |
|---|---|
| `<button type="button">Menu</button>` | `<div class="btn" onclick>` |
| `<a href="/pricing">See pricing</a>` | `<button onclick="location='/pricing'">` |
| `<h2 class="text-sm">` when structure says h2 | `<h4>` because it looks the right size |
| `popover` for a dropdown panel | a hand-rolled click-outside listener plus z-index war |
| `alt=""` on a decorative flourish | `alt="image"` |

## Worked examples
1. Card that is fully clickable. Brief: product card with title, image, price and a "Compare" checkbox. Choice: the title is the only `<a>`; stretch its hit area with `a::after { content:""; position:absolute; inset:0 }` on a `position: relative` card; the checkbox sits above with `position: relative; z-index: 1`. Reason: one link per card (not a link wrapping a checkbox, which is invalid nesting), screen readers hear one clear link, and the whole card is still clickable.
2. Plan toggle (monthly / yearly). Choice: two radio inputs in a `<fieldset>` with a visually hidden `<legend>Billing period</legend>`, styled as a segmented control. Reason: arrow-key behaviour and state announcement come free; a pair of `aria-pressed` buttons would need more code for the same result.
3. Filter menu. Choice: `<button popovertarget="filters">` plus `<div popover id="filters">`, anchor positioned under the button with a fallback. Reason: light dismiss, Esc and top layer come free; no z-index bugs.

## Hand-offs
- Copy for labels, errors and link text: design-copy (and copywriting for persuasion).
- Heading hierarchy and visual size mapping: design-typography, design-layout.
- Interaction patterns (when a modal is the wrong choice at all): design-ux.
- Markup that search engines and answer engines read (titles, structured data): design-search.
