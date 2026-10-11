# Research 03: Visual hierarchy and gestalt

Status key: C = consensus, X = contested, O = opinion.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Hierarchy tools: color and contrast, scale, grouping. "If everything is contrasted, then nothing stands out." Limit large elements to 2; no more than 3 type sizes in simple designs; 2 primary and 2 secondary colors; squint test to check. | [NN/g Visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) | C (numbers are NN/g guidance, not law) |
| 2 | Scanning patterns ranked: F-pattern (worst), spotted, layer-cake ("by far the most effective" scanning), commitment (reading). Layout that makes headings stand out produces layer-cake. | [NN/g Text scanning patterns](https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/) | C |
| 3 | F-pattern is caused by walls of text; fix with standout subheadings front-loaded so "the first 2 words" give the gist; key points in first two paragraphs. | [NN/g F-shaped pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) | C |
| 4 | About 80% of fixations fell on the left half of the screen (up from 69% in 2010). Attention peaks about 600px from the left edge. Leftmost 192px drew 6% (nav is skipped until needed). Put priority content center-left, secondary on the right; make important right-side content visually prominent. No horizontal scrolling: a "right-hand fold". | [NN/g Horizontal attention leans left](https://www.nngroup.com/articles/horizontal-attention-leans-left/) | C (eyetracking, LTR languages) |
| 5 | Fold: 57% of viewing time above the fold in 2018 (80% in 2010); 74% within first two screenfuls; 81% within three. Minimal designs create "false floors" that stop scrolling; show cut-off content as a signifier. | [NN/g Scrolling and attention](https://www.nngroup.com/articles/scrolling-and-attention/) | C |
| 6 | Proximity overpowers similarity of color or shape. | [NN/g Proximity](https://www.nngroup.com/articles/gestalt-proximity/) | C |
| 7 | Common region: elements sharing a bounded area read as a group; created with a border or background. | [Laws of UX: Common region](https://lawsofux.com/law-of-common-region/); Palmer, S. E. (1992), Common region, Cognitive Psychology 24 | C |
| 8 | Apple HIG: people assume aligned items are related and perceive indented items as subordinate. | [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout) | C |
| 9 | Refactoring UI: emphasize by de-emphasizing competitors; use color (3 text tones: dark, grey, light grey) and weight (400 or 500 normal, 600 or 700 emphasis) before size; fewer borders: use shadow, background difference or extra space instead; button styling follows hierarchy (primary solid, secondary outline or muted, tertiary as link). | [Refactoring UI, 7 practical tips](https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886) | O (influential) |
| 10 | WCAG 1.3.2 Meaningful Sequence: visual and DOM order may differ only if meaning survives; CSS positioning that changes meaning fails (F1). Matching DOM to visual order (C27) is sufficient. | [W3C 1.3.2](https://www.w3.org/WAI/WCAG22/Understanding/meaningful-sequence.html) | C (standard) |
| 11 | CSS `reading-flow` can make tab and reading order follow visual flex or grid order; experimental, limited availability. | [MDN reading-flow](https://developer.mozilla.org/en-US/docs/Web/CSS/reading-flow) | C (status volatile) |
| 12 | Fitts's law in layout: time to hit a target depends on distance and size; screen corners and edges act as infinitely deep targets. | [Rauno Freiberg, Interaction design](https://rauno.me/craft/interaction-design) | C (Fitts 1954), practitioner framing |
| 13 | Classical book margins in the ratio 2:3:4:6 (inner : top : outer : bottom); text block sits high on the page. | Jan Tschichold, The Form of the Book (1975, English 1991) | C (canonical) |
| 14 | Swiss school favors asymmetric, grid-based composition derived from the type; the grid gives a few elements an intended alignment. | Josef Muller-Brockmann, Grid Systems in Graphic Design (1981) | C (canonical), taste O |

## Conflicting views
- NN/g "no more than 3 type sizes" vs the foundation 9-step scale. Not a contradiction: the scale is the menu, a single view uses about 3 to 4 steps.
- Borders vs space: Apple lists separators as a valid grouping tool; Refactoring UI says use fewer. Resolution: space first, region second, lines last.
