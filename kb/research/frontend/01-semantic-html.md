# Research 01: Semantic HTML and native controls

Researched 2026-10-09. Status key: C = consensus or standard, P = practitioner opinion, V = verify before relying (fast moving).

## Key findings
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Rules of ARIA use: prefer native HTML; do not change native semantics unless you must; interactive ARIA controls must be keyboard operable; do not put `role="presentation"` or `aria-hidden="true"` on focusable elements; interactive elements need an accessible name (the last rule is also WCAG 4.1.2). | W3C, Using ARIA; WCAG 2.2 | C |
| 2 | `showModal()` puts the dialog in the top layer, makes everything outside it inert, closes on Esc, exposes `aria-modal="true"`. `show()` is non-modal and does not close on Esc. | MDN `<dialog>` | C |
| 3 | Initial focus: `showModal()` focuses the first focusable element; put `autofocus` on the most likely action, or the close button; never put `tabindex` on `<dialog>`. | MDN `<dialog>` | C |
| 4 | `closedby="any"` enables light dismiss; default for a modal is `closerequest`. | MDN `<dialog>` | V (check support table) |
| 5 | `<form method="dialog">` closes the dialog and sets `returnValue`. | MDN `<dialog>` | C |
| 6 | Dialogs and popovers are an Interop 2026 focus area; anchor positioning became Baseline newly available in January 2026 with Firefox 147. | web.dev Interop 2026; web.dev New to the web platform, January 2026 | V |
| 7 | Customizable select (`appearance: base-select`) is Chromium-led; treat as progressive enhancement over a native select. | Chrome for Developers | V |
| 8 | `<head>` order by weight: pragma meta (charset, viewport, http-equiv, base), title, preconnect and high-priority preload, async scripts, `@import` CSS, sync scripts, sync CSS, normal preload, defer scripts, prefetch / prerender / speculation rules, everything else. | capo.js rules (Rick Viscomi), from Harry Roberts' "Get your head straight" | C (practitioner-originated, widely adopted) |
| 9 | Missing page language on 13.5% of home pages; empty links 46.3%; empty buttons 30.6%; missing form labels 51%. | WebAIM Million 2026 | C (data) |
| 10 | Use `<a>` or framework `<Link>` for navigation so Cmd/Ctrl click and middle click work. | Vercel Web Interface Guidelines | P |
| 11 | Mark brand and technical names with `translate="no"`. | Vercel Web Interface Guidelines | P |

## Conflicting views
- Custom select styling: older advice is "build a listbox in JS"; the platform direction is `appearance: base-select` with native fallback. Support differs by browser (V).

## Sources
- W3C, Using ARIA: https://www.w3.org/TR/using-aria/
- MDN, `<dialog>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
- web.dev, Interop 2026: https://web.dev/blog/interop-2026
- web.dev, New to the web platform in January 2026: https://web.dev/blog/web-platform-01-2026
- Chrome for Developers, customizable select: https://developer.chrome.com/blog/a-customizable-select
- capo.js rules: https://rviscomi.github.io/capo.js/user/rules/
- Smashing Magazine, Getting your head straight (Harry Roberts): https://www.smashingmagazine.com/2021/09/css-head-tag/
- WebAIM Million: https://webaim.org/projects/million/
- Vercel Web Interface Guidelines: https://vercel.com/design/guidelines
