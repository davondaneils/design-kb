# Structured data (schema.org)

Facts current to 2026-10-09. Sources in `kb/research/search/03-structured-data.md`.

## Principles
1. **Markup describes what is visible; it never adds claims.** Structured data must match on-page content (Official). Anything else risks a manual action and wastes trust.
2. **Mark up for a payoff you can name.** Valid payoffs: a rich result in Google's current gallery, entity clarity (Organization, WebSite, Person), merchant eligibility (Product with offers), local eligibility (LocalBusiness alongside a Business Profile). "AI will understand us better" is not a measured payoff in 2026.
3. **The gallery shrinks.** Google removed or limited many rich results 2023 to 2026. Check the gallery before promising any rich result.

## What still produces a Google rich result (search gallery, updated 2026-06-15)
Article, Breadcrumb, Carousel, Course list, Dataset, Discussion forum, Education Q&A, Employer aggregate rating, Event, Image metadata, Job posting, Local business, Math solver, Movie, Organization, Product, Profile page, Q&A, Recipe, Review snippet, Software app, Speakable, Subscription and paywalled content, Vacation rental, Video.

## Gone or limited (date every one)
| Type | Status | Date |
|---|---|---|
| HowTo | Rich result deprecated | 2023-09 |
| FAQPage | Limited to gov and health 2023-08; removed for all sites | 2026-05-07 (reports dropped June 2026, API August 2026) |
| Book Actions, Course Info, ClaimReview, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing | Phased out | announced 2025-06-12 |
| Practice Problem and other low-use features | Removed, reporting gone | announced 2025-11, from 2026-01 |
| Sitelinks search box | Retired | 2024-10 |

FAQPage and HowTo remain valid schema.org vocabulary. Keeping existing markup is harmless; adding it for a rich result is pointless.

## Decision rules by page type
| Page | Types | Notes |
|---|---|---|
| Every page | `WebSite` (on home, with `name` and `alternateName` for site name), `Organization` (on home or about, with `logo`, `url`, `sameAs` to official profiles) referenced by `@id` | Site name and logo in results draw on these (Official) |
| Article or blog post | `Article` or `BlogPosting` with `headline`, `datePublished`, `dateModified`, `author` (`Person` with `url` to author page), `image` | dateModified only on substantive change |
| Product detail | `Product` with `offers` (`price`, `priceCurrency`, `availability`), `aggregateRating` and `review` only if shown on page | Keep in sync with Merchant Center feed |
| Home page of a shop | `WebSite` and `Organization` (`OnlineStore`), plus the `LocalBusiness` subtype if the one location's address and hours are visible | No `Product` for a homepage grid: product rich results need a single-product page (Official, product snippet doc, updated 2026-09-08). Worked example: reference 07 |
| Category page | `BreadcrumbList`. `ItemList` with `Product`, `LocalBusiness` or `Event` only for the structured data carousels beta: EEA, Turkiye and South Africa, at least 3 items, each linking to its detail page (Official, carousels beta doc, updated 2026-09-11). Elsewhere `ItemList` carousels cover only Course list, Movie, Recipe, Restaurant | Do not mark up every product in full |
| Local business site | Most specific `LocalBusiness` subtype that exists on schema.org (Dentist, Plumber, Physiotherapy); check schema.org before using a name, and fall back to the nearest parent (for example `MedicalBusiness`) if none fits with NAP identical to Business Profile, `openingHoursSpecification`, `geo` | One entity per location page |
| Software or app | `SoftwareApplication` with `offers` and `aggregateRating` if real | |
| Events | `Event` with `startDate`, `location`, `eventStatus`, `offers` | |
| Jobs | `JobPosting`; remove or set `validThrough` when filled | Expired postings hurt |
| Video pages | `VideoObject` with `thumbnailUrl`, `uploadDate`, `duration`, key moments via `Clip` or `SeekToAction` | |

Never: `Review` or `AggregateRating` about your own business on a LocalBusiness or Organization page. Google: if the entity being reviewed controls the reviews about itself, those pages are not eligible for star review snippets (Official, Google review snippet doc, fetched 2026-10-09). Never markup for content hidden from users.

## Implementation
- JSON-LD in a `<script type="application/ld+json">`, server-rendered. AI crawlers do not run JS (Measured 2024-12); Google can read JS-injected JSON-LD but late.
- Use a connected graph: each entity gets a stable `@id` (`https://example.com/#organization`), and other nodes reference it (`"publisher": {"@id": "https://example.com/#organization"}`). One graph per page, not five disconnected blobs from five plugins. (Practitioner, Yoast and schema.org pattern)
- Validate twice: Google Rich Results Test (eligibility) and validator.schema.org (vocabulary). Then monitor Search Console enhancement reports.
- After template changes, re-test one URL per template.

## Schema and AI answers: what the evidence says (2026)
- Google: not required for AI Overviews or AI Mode, no special schema for AI (Official, 2025-12 and 2026-07).
- Ahrefs, 1,885 treated pages vs about 4,000 matched controls, Aug 2025 to Mar 2026: no clear citation lift on AI Overviews, AI Mode or ChatGPT (Measured, 2026-05-11).
- Rule: recommend schema for rich results and entity consistency. If a client asks for schema "for ChatGPT", say the best available evidence shows no measurable effect, and spend that budget on content and corroboration.

## Do and don't
- Do: `Organization` `sameAs` to the real LinkedIn, Crunchbase, Wikipedia or Wikidata entries. Don't: `sameAs` to directories you do not control.
- Do: one source of truth (CMS fields) feeding both page and JSON-LD. Don't: hand-typed JSON-LD prices that drift from the page.
- Don't: add FAQPage to every page in 2026 expecting stars or accordions in results.

## Worked example
**Shopify store with blog.** Theme already outputs Product JSON-LD; audit shows duplicate Product blocks from theme and an app, with mismatched prices on sale items. Fix: disable one source, map `offers.price` to the live variant price, add `BreadcrumbList`, add a single `Organization` with `@id` on home referenced by `BlogPosting` publisher. Validate both tools, watch Merchant listings report. Tell the client: rich results for products and breadcrumbs are realistic; FAQ snippets are gone since 2026-05-07; AI citation uplift from schema is unproven.

## Hand-offs
- The content model that feeds JSON-LD (single source of truth fields) is engineering, out of scope for design-kb.
- design-frontend owns server rendering of the script tag.
- 06 local: LocalBusiness must match the Business Profile exactly.
