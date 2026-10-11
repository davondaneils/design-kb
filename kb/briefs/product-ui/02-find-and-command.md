# Brief 02: Find and command (filters, search, command palette, keyboard layers)

## Question
How do people narrow, find and act in a dense tool fast, by mouse and by keyboard, without the keyboard layer becoming an accessibility failure?

## Audience
Claude building app screens; knows "add Cmd+K" as a buzzword.

## Decisions the reader must be able to make
- Global toolbar filters vs per-panel controls; chips; URL state.
- Plain search vs structured syntax (field:value, operators, negation).
- What the command palette contains, how it ranks, how it teaches.
- Which shortcuts to offer at which tier, and how single-key shortcuts meet WCAG 2.1.4.
- How shortcuts are shown (menus, tooltips, a `?` sheet) and on which platform modifier.

## Fundamentals
Every shortcut has a visible, clickable equivalent; single-character shortcuts can be turned off or remapped, or only work on focus (WCAG 2.1.4); shortcuts do not fire while typing in a field; platform shortcuts are not repurposed (Apple HIG); palette follows the APG combobox pattern in a modal dialog with focus return; filter state lives in the URL.

## Expert layer
Palette shows the shortcut beside each command so mouse users learn it (Superhuman); synonyms and typo tolerance; contextual commands first; one shortcut to open everywhere; sequence shortcuts (G then I, O then V) as a namespace; `?` opens the shortcut sheet (Stripe); structured search with bookmarkable URLs (Stripe); filters as removable chips with "Clear all".

## Must cover
Superhuman command palette and speed posts, Linear docs (custom views, select issues), Stripe docs (basics, search), Vercel docs (command menu) and web interface guidelines, Things support (Type Travel), W3C APG combobox, WCAG 2.1.4, Apple HIG keyboards.

## Out of scope or reuse
Faceted filter rules (live vs batch, counts, mobile tray): design-ux `references/02-navigation-ia.md`. Website search and SEO: design-search.

## Test briefs
1. Slice brief B: add the search, `/` and Cmd/Ctrl+K entry points, a shortcut hint layer, and a working palette. Exemplar: Linear app, Vercel Dashboard.
2. "Issue list for an engineering team with saved views and keyboard triage." Exemplar: Linear app, Superhuman.

## Rubric
Gate: fundamentals checklist. Close to exemplar: palette opens instantly, lists real commands grouped with shortcuts, focus is never lost; every shortcut has a clickable twin; the page reads calm with the keyboard layer present (hints are muted, never louder than content).
