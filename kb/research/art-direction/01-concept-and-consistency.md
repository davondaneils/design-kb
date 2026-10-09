# Research 01: Concept and consistency

Researcher, 2026-10-09. Brief: `kb/briefs/art-direction/01-concept-and-consistency.md`. All URLs fetched through WebFetch on 2026-10-09 unless marked. curl and the render browser are blocked from most hosts by the egress policy; WebFetch returned text.

## Key findings
1. **Art direction is about meaning before style.** Andy Clarke: "Art direction is the art of distilling an essential, precise meaning or purpose from a piece of content." He also ties it to connecting brand touch points (marketing, product, site). [C1][C2]
2. **A system with room for each story.** Jason Santa Maria's approach, quoted by Zeldman: "a system for the way content gets handled, but every layout and story can take on a look of their own within that system." This is the shape of a concept: fixed rules, variable instances. [C3]
3. **Exemplars ground the concept in the brand's own subject.** Stripe's homepage customer photo: "Aerial view of a street intersection where the crosswalks form a slanted parallelogram, imitating the Stripe logo." The brand's geometry is found in real photography. [C4] (tier 2, text fetch of the live page's alt text, not measured pixels)
4. **Product-led exemplars use the product as the image.** Linear's homepage imagery is "mostly product UI screenshots"; Mercury mixes founder portraits, flat abstract illustrations ("overlapping circles, suggesting a unified view of incoming and outgoing funds") and a stylized card close-up. [C5][C6] Each exemplar has a small, repeated vocabulary.
5. **A treatment can carry an identity.** Collins' Spotify identity used duotone photography to "give the images a distinctive 'Spotify' look", part of a brief to shift positioning "from a technology to an entertainment brand". [C7]
6. **Consistency is a stated rule in mature systems.** Atlassian: "Always follow the brand guidance for product illustrations." and "Excessive illustrations increase cognitive load." [C8][C9]
7. **Decoration is ignored by users.** NN/g: "users ignore purely decorative images that don't add real content to the page." So a concept must work through informative images, not ornament. [C10]

## Numbers
None standardized. House defaults (opinion, for the specialist): 3 to 5 motifs in a vocabulary; one treatment per set; imagery on at most every other section of a landing page (pairs with the playbook's "alternating density" move).

## Conflicting views
- Some practitioners treat art direction as mood boards and style. Clarke and the Santa Maria quote put meaning and system first. We follow meaning first; mood follows from the fact. (opinion)
- Exemplars differ on photography: Linear uses almost none, Stripe and Mercury use real photos. The common thread is a small vocabulary, not a medium.

## Claim table
| ID | Claim | Quote (under 40 words) | URL | Date | Tier | Status |
|---|---|---|---|---|---|---|
| C1 | Art direction distills the content's meaning | "Art direction is the art of distilling an essential, precise meaning or purpose from a piece of content." | https://conffab.com/presentation/art-directing-web-design/ | 2026-10-09 | 4 | opinion (practitioner with published books and work) |
| C2 | Art direction connects brand touch points | "how art direction can maintain brand values and design principles by connecting touch points" | https://www.dhh-ev.de/fileadmin/user_upload/PDF/Art-direction-FTW-excerpt.pdf | 2026-10-09 | 4 | opinion |
| C3 | A system with per-story looks | "a system for the way content gets handled, but every layout and story can take on a look of their own within that system." | https://zeldman.com/2008/06/19/art-direction-on-the-web/ | 2026-10-09 | 4 | opinion |
| C4 | Stripe finds its logo geometry in real photos | "Aerial view of a street intersection where the crosswalks form a slanted parallelogram, imitating the Stripe logo." | https://stripe.com | 2026-10-09 | 2 | consensus (observed on live page text) |
| C5 | Linear's imagery is product UI | "The homepage imagery is mostly product UI screenshots" (WebFetch summary of page markup, not a page quote) | https://linear.app | 2026-10-09 | 2 | observed, summary |
| C6 | Mercury uses flat abstract illustration with meaning | "Abstract illustration of overlapping circles, suggesting a unified view of incoming and outgoing funds." | https://mercury.com | 2026-10-09 | 2 | observed |
| C7 | Spotify duotone as identity, Collins | "give the images a distinctive "Spotify" look" | https://www.designweek.co.uk/spotify-undergoes-colourful-brand-refresh/ | 2026-10-09 | 4 | consensus (shipped identity) |
| C8 | Follow brand guidance for illustration | "Always follow the brand guidance for product illustrations." | https://atlassian.design/foundations/illustrations | 2026-10-09 | 1 | consensus |
| C9 | Too many illustrations add load | "Excessive illustrations increase cognitive load." | https://atlassian.design/foundations/illustrations | 2026-10-09 | 1 | consensus |
| C10 | Decorative images are ignored | "users ignore purely decorative images that don't add real content to the page." | https://www.nngroup.com/articles/photos-as-web-content/ | 2026-10-09 | 3 | consensus (eyetracking) |

## Teardowns used
None measured: exemplar hosts block pixels from this environment (`kb/exemplars.md`). Items C4 to C6 are text fetches of alt text and markup.
