# Research 03: Structured data

Researched 2026-10-09. Labels as defined in 01.

## Key findings

| # | Claim | Source (date) | Label |
|---|---|---|---|
| 1 | Google search gallery lists 25 features: Article, Breadcrumb, Carousel, Course list, Dataset, Discussion forum, Education Q&A, Employer aggregate rating, Event, Image metadata, Job posting, Local business, Math solver, Movie, Organization, Product, Profile page, Q&A, Recipe, Review snippet, Software app, Speakable, Subscription and paywalled content, Vacation rental, Video. | Google search gallery, updated 2026-06-15 | Official |
| 2 | HowTo rich results deprecated (2023-09-14). FAQ rich results limited to gov and health sites (Aug 2023), then removed for all sites from 2026-05-07; Search Console report and Rich Results Test support dropped June 2026, API August 2026. FAQPage type itself remains valid schema.org. | Google FAQPage doc changelog; TechWyse 2026 | Official |
| 3 | June 2025 phase-out: Book Actions, Course Info, ClaimReview, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing. | Google blog "Simplifying the search results page" 2025-06-12; Search Engine Land | Official |
| 4 | Nov 2025: further features removed incl. Practice Problem; Search Console reporting removed from January 2026. | Google blog 2025-11 "update on our efforts"; FAQ doc changelog 2025-11-05 | Official |
| 5 | Mueller: markup types "come and go". Removal of features does not mean Google uses structured data less. | SEJ, Roger Montti, 2025-11-11 | Practitioner (reporting Official remark) |
| 6 | Structured data is not required for AI Overviews or AI Mode; no special schema for AI; still useful for rich results; must match visible text. | Google AI features doc (2025-12-10); AI optimization guide (2026-07-10) | Official |
| 7 | 1,885 pages that added JSON-LD vs about 4,000 matched controls, Aug 2025 to Mar 2026: AIO citations -4.6% (significant, small), AI Mode +2.4% and ChatGPT +2.2% (not distinguishable from zero). Cross-sectional: cited pages 3x likelier to have JSON-LD (correlation). | Ahrefs, 2026-05-11 | Measured (difference-in-differences) |
| 8 | Title links can use WebSite structured data (site name). | Google title link doc | Official |
| 9 | Sitelinks search box retired. | Google Search Central blog, "Farewell, Sitelinks Search Box", 2024-10 (archive listing) | Official |
| 10 | Self-serving reviews: if the entity being reviewed controls reviews about itself, LocalBusiness and Organization pages cannot get star review snippets. | Google review snippet doc, fetched 2026-10-09 | Official |
| 11 | Keep Merchant Center and Business Profile data current to appear in AI responses. | Google AI optimization guide | Official |

## From prior knowledge of Google docs (stable, widely documented; verify on use)
- JSON-LD is Google's recommended format; markup must describe visible content; violations can lead to manual actions. (Official, Google structured data general guidelines)
- Self-serving reviews: review snippets are not shown for LocalBusiness or Organization reviews about yourself on your own site. (Official; confirmed in review snippet doc, row 10)

## Conflicts
- Vendors claim LLMs "read schema". The only controlled 2026 study found no lift. Label claims of AI uplift from schema as unproven.

## Sources
- https://developers.google.com/search/docs/appearance/structured-data/search-gallery
- https://developers.google.com/search/docs/appearance/structured-data/faqpage
- https://developers.google.com/search/blog/2025/06/simplifying-search-results
- https://searchengineland.com/google-to-drop-support-for-several-rich-result-types-to-simplify-the-search-results-page-456969
- https://developers.google.com/search/blog/2025/11/update-on-our-efforts
- https://www.searchenginejournal.com/google-is-not-diminishing-the-use-of-structured-data-in-2026/560516/
- https://www.techwyse.com/news/ai-search/google-faq-rich-results-deprecated-2026
- https://ahrefs.com/blog/schema-ai-citations/
- https://developers.google.com/search/docs/appearance/structured-data/review-snippet
