# Research 03: Accessibility implementation (WCAG 2.2 AA)

Researched 2026-10-09. Status key: C = consensus or standard, P = practitioner opinion, V = verify (fast moving).

## Key findings
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | WCAG 2.2 adds 9 SCs and removes 4.1.1 Parsing. AA additions: 2.4.11 Focus Not Obscured (Minimum), 2.5.7 Dragging Movements, 2.5.8 Target Size (Minimum, 24 by 24 CSS px), 3.3.8 Accessible Authentication (Minimum). Level A additions: 3.2.6 Consistent Help, 3.3.7 Redundant Entry. AAA: 2.4.12, 2.4.13 Focus Appearance (2 CSS px perimeter, 3:1 change), 3.3.9. | W3C, What's new in WCAG 2.2 | C |
| 2 | 2.5.8 exceptions: spacing (24px circles centred on undersized targets do not intersect), equivalent control, inline in text, user agent default, essential. 20 by 20 buttons with a 4px gap pass; with no gap they fail. | W3C, Understanding 2.5.8 | C |
| 3 | WebAIM Million 2026: 95.9% of home pages have detected failures, 56.1 errors per page. Top failures: low contrast 83.9%, missing alt 53.1%, missing labels 51%, empty links 46.3%, empty buttons 30.6%, missing lang 13.5%. | WebAIM Million | C (data) |
| 4 | Outlines survive forced colors mode; box-shadows usually do not. Two-tone indicator: `outline: 3px solid` dark plus `box-shadow: 0 0 0 6px` light. A 2px dashed outline fails 2.4.13; 4px dashed passes. | Sara Soueidan, focus indicators guide | P (expert, maths from WCAG) |
| 5 | Never disable zoom or paste in inputs. Input font size at least 16px to stop iOS Safari auto zoom on focus. | Vercel Web Interface Guidelines | P (paste blocking also undermines password managers, which 3.3.8 relies on) |
| 6 | On submit, focus the first invalid field; show the error next to the field. | Vercel Web Interface Guidelines | P |
| 7 | Hit targets 24px minimum, 44px on mobile. | Vercel Web Interface Guidelines; design-kb foundation contract | P / house rule |
| 8 | Automatic motion longer than 5 seconds needs pause, stop or hide (WCAG 2.2.2). | WCAG 2.2; Vercel guidelines | C |
| 9 | Legal: the European Accessibility Act applies from 28 June 2025 to many consumer digital services and references EN 301 549 (built on WCAG 2.1 AA). US DOJ ADA Title II rule requires WCAG 2.1 AA for state and local government; on 20 April 2026 DOJ published an interim final rule extending the compliance dates. | Accessibility Developer Guide (EAA); Reed Smith; Illinois Lawyer Now | V (legal; check current dates) |

## Standard criteria used directly (WCAG 2.2 text)
1.3.1 Info and relationships; 1.3.5 Identify input purpose (autocomplete); 1.4.1 Use of color; 1.4.3 Contrast 4.5:1 body, 3:1 large; 1.4.4 Resize text to 200%; 1.4.10 Reflow at 320 CSS px wide; 1.4.11 Non-text contrast 3:1; 1.4.12 Text spacing (line height 1.5, paragraph spacing 2x, letter spacing 0.12em, word spacing 0.16em) without loss; 1.4.13 Content on hover or focus is dismissible, hoverable, persistent; 2.1.1 Keyboard; 2.4.1 Bypass blocks; 2.4.3 Focus order; 2.4.7 Focus visible; 2.5.3 Label in name; 3.3.1 Error identification; 3.3.3 Error suggestion; 4.1.2 Name, role, value; 4.1.3 Status messages.

## Conflicting views
- 2.4.13 Focus Appearance is AAA. Opinion (Soueidan, and this KB): meet it by default because it costs nothing in CSS.
- Automated tools find only part of the issues; vendor coverage figures vary. Manual testing is required (consensus; a specific percentage was not verified this round).

## Sources
- W3C, What's new in WCAG 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/
- W3C, Understanding 2.5.8: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- WebAIM Million: https://webaim.org/projects/million/
- Sara Soueidan, A guide to designing accessible, WCAG-conformant focus indicators: https://www.sarasoueidan.com/blog/focus-indicators/
- Vercel Web Interface Guidelines: https://vercel.com/design/guidelines
- EAA overview: https://www.accessibility-developer-guide.com/knowledge/legal/eaa/
- DOJ Title II extension (Reed Smith): https://www.reedsmith.com/articles/doj-extends-digital-accessibility-compliance-dates-under-title-ii-of-the-ada/
- DOJ Title II extension (Illinois Lawyer Now): https://www.illinoislawyernow.com/2026/04/doj-extends-title-ii-ada-web-content-accessibility-compliance-deadlines/
