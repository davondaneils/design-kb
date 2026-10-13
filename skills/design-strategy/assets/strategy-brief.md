<!--
Strategy brief template (design-strategy). One page: about 700 words or fewer outside these comments, tables included (about 1.3 A4 sides at 10pt; the name is the discipline).
Fill every {{field}}. Delete the sections your depth does not need (see the depth table in SKILL.md section 1):
  inherit:     Header, 1 (Moment only), the Inherit block; record the swap test and any new claim in the hand-over
  three lines: Header, 1 (Moment only), 3 (Fact only), 2 (Competitor wall only), 7, and 8 (the rows ref 06 runs at this depth)
  one page and full: everything; full adds the asset audit in 6
Check it: node skills/design-strategy/assets/brief_lint.mjs <this file>
House rules: no em dashes; mark opinion as (opinion); the locale becomes <html lang>.
-->
# Strategy brief: {{brand or project}}

Depth: {{inherit | three lines | one page | full}} ({{why this depth, from the brief}})
Locale: {{en-US | en-GB | other}} ({{audience and place}})
Deliverables: {{what the brief asks for}}
Not built: {{what you are not making and why, or "nothing left out"}}

<!-- Inherit depth only: keep this block, delete sections 2 to 8. -->
Brand source: {{guidelines file, tokens file or live site you inherit}}
Must not change: {{shell, nav, type scale, voice}}

## 1. Audience moment
Moment: {{who}} when {{trigger or situation}}, wanting {{progress}}, held back by {{anxiety or habit}}.
Primary CEP (hero): {{the situation, in their words}}
Other CEPs: {{up to three, for sections}}
Anxiety and design answer: {{fear}} -> {{where and how the page answers it}}
Their words: {{phrases}} (source: {{reviews, tickets, calls, search, or "stand-in: competitor reviews"}})

## 2. Positioning
Alternatives: status quo: {{what they do today}}; {{other alternatives}}
Competitors named: {{one}}, {{two}}, {{three}}
Competitor wall: {{what the category's first screens, posters or marks share}}
Category frame: {{chosen frame}} (tried: {{two other frames}})
Onlyness (internal): Our {{offering}} is the only {{category}} that {{benefit}}, for {{who}}, {{where or when}}.
Swap test: {{pass or fail, with each competitor's name tried}}

## 3. One true fact and proof
Fact: {{one specific, checkable, owned fact}} (source: {{document, data or person}})
Proof on the page: {{how the page shows it}}
Weakest field: {{the thinnest part of this brief}}

## 4. Claims ledger
| Claim as written | Fact | Source | Evidence held |
|---|---|---|---|
| {{claim}} | {{fact}} | {{source, date}} | {{yes or cut}} |

## 5. Voice
| Attribute (this, not that) | Sample line |
|---|---|
| {{Plainspoken, not blunt}} | "{{a line in a hard moment}}" |
Flat in: {{errors, payments, security, and any others}}

## 6. Identity decisions
| Attribute | Decision | Reason | Level | Owner |
|---|---|---|---|---|
| {{attribute from positioning or voice}} | {{type, color, shape, imagery, layout or motion choice, in FOUNDATIONS tokens}} | {{why}} | {{E, C or O}} | {{design-typography 02, design-color, design-graphic 01, design-art-direction, design-layout, design-motion}} |
Primary distinctive asset: {{a shape: mark, container, character, crop}}
Supporting assets: {{color at a fixed share, face, image treatment}}
Category codes: kept: {{semantic codes}}; broken: {{one expressive code}}
Asset audit (rebrand only): {{asset, quadrant, action; or "not a rebrand"}}

## 7. Concept for art direction
Concept sentence: {{one sentence with a drawable noun, built from the fact}}
Reject test: {{one line a stranger could use to throw an image out}}

## 8. Checks
| Check | Result |
|---|---|
| Word swap test | {{result}} |
| Competitor wall, logos covered | {{result}} |
| Hide-the-logo | {{result}} |
| Five-second test (who viewed) | {{result}} |
| Claims ledger complete | {{result}} |
