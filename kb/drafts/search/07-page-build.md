# 07 Search on a built page

Facts checked 2026-10-10; sources and quotes in `kb/research/search/07-page-build.md` (rows R1 to R30, measured M1 to M4). Recheck by 2027-01-10: Google updated its Googlebot, FAQ, carousels and favicon docs between February and September 2026.

This chapter is what design-director applies at build time, after the page is designed and before the self-critique loop. It turns the rules in chapters 01 to 06 into tags, markup and copy on one HTML file, and it is checked by a script, not by reading.

**Check it:** `node skills/design-search/assets/search-check.mjs page.html --base https://example.com/ --assets site/` (public pages) or `--expect private` (app screens behind login). Exit 1 on any fail; warnings never fail. Known limit: the relative-date warning matches weekday names, so opening hours written as "Monday to Friday" warn; read it, do not chase it. Run `npm ci` in `skills/design-search/assets/` once to add the full JSON-LD 1.1 expansion check.

## Floor: fundamentals (non-negotiable)

Tags: `[check]` = search-check.mjs fails the page; `[lint]` = tools/lint.mjs; `[judged]` = the tester on the renders and the source.

1. **Search work never costs a fundamentals miss.** `node tools/lint.mjs` result on every page and state is no worse after the search pass than before. `[lint]`
2. **One of each, in the head, before anything heavy:** one `<title>`, one meta description, one canonical (absolute https), robots meta if any, then Open Graph and `twitter:card`, then JSON-LD, then the big inline `<style>` and fonts. `[check]` (head-order warns)
3. **One visible H1, levels never skip, every heading has text.** Link-group labels in a footer are siblings of the newsletter heading, not its children. `[check]` for skips and count; `[judged]` for the outline making sense.
4. **Every link a crawler should follow is a real URL.** No `href="#"`, empty or `javascript:`. Header and footer links point at hub pages, not `#fragments` on the homepage. `[check]`
5. **Structured data parses, exists, applies and matches.** JSON parses; every `@type` and property exists in schema.org and applies to that type; Google's required properties for the target feature are present; every name, price, street address and phone in the markup appears in the visible text. `[check]`
6. **Markup is placed on the page it describes.** Product and Offer on the product page; Organization and WebSite on the home page; LocalBusiness on the location page (home page too when the business has one location and shows its address and hours there). `[check]` fails more than one Product outside an ItemList; `[judged]` for the rest.
7. **Social card complete:** og:title, og:type, og:image, og:url (the four required), og:url equals the canonical, og:image absolute, og:image:alt, width and height that match the file. `[check]`
8. **App pages behind login stay out:** auth answers first (unauthenticated requests get a redirect to login); `noindex` in a meta tag and in an `X-Robots-Tag` header on every app response as the backstop; no robots.txt Disallow on the app (it would hide the noindex); no JSON-LD; no social tags that could carry workspace data. `[check]` with `--expect private`
9. **Accessibility is the same work.** Alt text, link text, heading outline and labelled controls are WCAG 2.2 AA items in design-foundations and the inputs answer engines and browser agents read (Google AI optimization guide names the accessibility tree, R25). `[lint]`

## Standards (with source rows)
- Title: unique, descriptive, concise; no length limit, truncated to device width; the homepage title may carry site information (R14). Google may build the title link from the title, H1, og:title or prominent text (R15), so they must agree in substance.
- Snippet: mostly from page text; the meta description is used when it describes the page better; put the facts (price, place, spec) in it (R16).
- Robots: `max-image-preview:large` allows a large image preview (R17). A robots.txt Disallow hides noindex (R18). noindex by meta or `X-Robots-Tag` (R19). Private content needs a password, not just noindex (R20).
- Size: Googlebot reads the first 2 MB of HTML, uncompressed; inlined fonts, SVG and data URIs count (R21).
- Favicon: square, larger than 48x48 recommended, crawlable stable URL, `rel="icon"` or `apple-touch-icon`; Google's format list is BMP, GIF, ICO, PNG, JPEG, PPM, TIFF, so ship a PNG even when the browser gets an SVG (R22).
- Site name: WebSite with `name` and `url` on the domain's home page; `alternateName` for the long or short form (R13).
- Organization: home or about page; no required properties; OnlineStore for a shop; logo at least 112x112 (R6). Global shipping and returns go on Organization, Offer only overrides (R4).
- Product: rich results only for pages about one product (R1); snippets need name plus offers, review or aggregateRating (R2); merchant listings need image, an Offer with price above zero and currency, and a page where the shopper can buy (R3, R5).
- LocalBusiness: name and address required; most specific subtype; geo 5 decimals; url a working absolute link (R7, R8).
- Carousels: ItemList only with Course list, Movie, Recipe, Restaurant (R11); ItemList with Product, LocalBusiness or Event only in the EEA, Turkiye and South Africa beta, on a summary page of at least three items that each link to a detail page (R12).
- FAQ: no FAQ rich result since 2026-05-07 (R10).
- AI features: nothing beyond indexing and snippet eligibility; no special schema; no AI text files needed for Google Search (R24, R25).
- Open Graph: four required properties; og:url is the canonical permanent ID; og:image:alt should accompany the image (R28).

## Decision rules
| If | Then |
|---|---|
| The homepage hero changes every week (a lot, a launch, a drop) | Title and meta description carry the stable entity, category and place; the H1 may carry the weekly headline; a visible line in the first screen names the category and place. (Opinion: a weekly-changing title churns the result for brand and category queries.) |
| A homepage shows a grid of products | No Product markup on the homepage. Each product page carries Product and Offer. The homepage carries WebSite and Organization (OnlineStore for a shop). Exception: EEA, Turkiye or South Africa audience and a real category page: ItemList of Products for the carousels beta. |
| The business has one physical location and shows address and hours on the homepage | Add the most specific LocalBusiness subtype to the homepage graph, linked to the Organization by `parentOrganization` and `subOrganization`; the location page carries it too. Hours in markup only if they are visible. |
| Shipping and returns are the same for every product | Put `shippingDetails` and `hasMerchantReturnPolicy` on the Organization once, only after the policy page exists and the page says it. |
| The page has questions and answers in the visible text | FAQPage is allowed but earns no rich result in Google since 2026-05-07; add it only if the page is a real FAQ. Never add Q and A content to a landing page to justify markup. |
| A sentence carries a fact you want quoted (price paid, altitude, roast time, hours) | Name the subject in the sentence ("Ember & Oak roasts..." not "We roast..."), use absolute numbers with units, and wrap relative dates in `<time datetime>`. (Speculation on citation effect; zero cost.) |
| The copy says "Tuesday", "this week", "this Friday" | Keep the voice; wrap the whole phrase: `<time datetime="2026-10-06">roasted Tuesday</time>` (a week works: `datetime="2026-W41"`). No font features on `time` itself. |
| The page inlines fonts, SVG or images | Keep the head tags before the first large inline block and the whole file well under 2 MB; warn at 1 MB. |
| Header and footer links point to `#sections` on the homepage | Point them at hub URLs (`/coffee/`, `/subscriptions/`, `/journal/`); keep in-page anchors only inside the hero or body where scrolling is the point. |
| An app screen sits behind login | `--expect private`: noindex meta plus `X-Robots-Tag`, no JSON-LD, no og tags; put a generic brand card on the login page so shared app links unfurl to the brand, not to a blank or to data. |
| A client asks for llms.txt | Google Search does not use it (R25). Chrome Lighthouse's Agentic Browsing audit only fails if `/llms.txt` returns a server error; a 404 is Not Applicable (R26). So: never let it 5xx; build one only for a non-Google reason you can name. |

## Numbers
| Item | Value | Source |
|---|---|---|
| Googlebot HTML cut | first 2 MB, uncompressed | R21 |
| Title | no limit; distinguishing words in the first 50 to 60 characters | R14; practitioner (chapter 02) |
| Meta description | no limit; about 120 to 160 characters shows whole | R16; practitioner |
| Organization logo | at least 112x112 px | R6 |
| Favicon | square, larger than 48x48; PNG for Google | R22 |
| geo precision | at least 5 decimal places | R7 |
| Social card | 1200x630 px (1.91:1), PNG or JPEG, under 1 MB; safe area: centered 630x630 | convention, measured here (M2); opinion on size cap |
| Social card type | wordmark at least 96px, supporting line at least 28px on the 1200px canvas (reads at 40 and 12px in a 500px feed) | measured here (M2), opinion |
| Carousels beta | at least 3 items, summary page, EEA, Turkiye, South Africa | R12 |

## Ceiling: exemplar patterns
Not measured. Every exemplar host was refused from this environment on 2026-10-10 (curl through the egress proxy), and WebFetch returns page text, not the `<head>`. What to measure when access exists, for each marketing exemplar: title pattern on home and one inner page, meta description length, og:image size and composition (evergreen or per page), presence of JSON-LD types, favicon formats, head order. Record in `kb/teardowns/`. Until then, the patterns below are opinion from the craft, not measurement.

## Signature moves
1. **The card is a designed object, not a screenshot.** Build it from the page's own signature (here: the brand-orange band, its contour field, the display face) as an HTML template rendered to PNG at build time, so it updates with the brand and costs nothing. Generic: a cropped hero screenshot, unreadable at 500px.
2. **Design the card for its crops.** Keep every line inside the centered 630x630 square; then a 2:1 crop and a centered square crop both still read. Measure the text widths in the browser (M2), do not eyeball them. The first version of this card lost "Em" and "ak" in the square crop.
3. **Evergreen card on the homepage, per-item cards by URL.** Unfurlers cache images by URL (R30); a homepage card that names "this week's lot" is wrong next week and stays cached. Put the lot on the lot page's card, with the lot number in the file name.
4. **Product markup where the shopper can buy.** The homepage grid is the most common place teams paste Product JSON-LD; Google supports product rich results only on single-product pages (R1, R5). The homepage gets the entity graph; the product page gets Product and Offer; the global shipping and returns policy sits once on Organization (R4).
5. **One graph, many pages.** Give every entity an `@id` of its canonical URL plus a fragment (`https://example.com/#org`, `https://example.com/visit/#cafe`) and reference it from other pages instead of redefining it. The product page's Offer points at `{"@id": ".../#org"}` as seller.
6. **The markup is a promise the page keeps.** Before adding hours, address or price to JSON-LD, put them in the visible page (here the footer gained the ZIP and the hours). search-check fails any name, price, street or phone that is not visible.
7. **Head order for lazy readers.** Slackbot reads "as little of the page as it can" with Range requests (R29); Googlebot stops at 2 MB (R21). A self-contained page with inlined fonts must put title, description, canonical, robots and social tags first. Here they end at byte 1,423; the font CSS starts at 3,704.
8. **Machine dates under human words, invisibly.** Keep "roasted Tuesday" in the H1 for voice and wrap the whole phrase: `<time datetime="2026-10-06">roasted&nbsp;Tuesday</time>`. A passage copied into an index or a chat answer keeps its real date. (Speculation on effect; valid HTML.) Measured cost when done carelessly: wrapping only "Tuesday" and giving `time` a global `tabular-nums` rule moved the word 3px and reshaped two labels; whole phrases and a feature rule scoped to the ledger gave a zero-pixel diff against the original above the fold. Pixel-diff the page against its previous render after any semantic markup pass.
9. **Quotable facts carry their subject.** One sentence that names the entity and the number ("Ember & Oak roasts on a 1962 Probat in Southeast Portland, twelve kilos at a time") survives being lifted out of the page. Original data (the prices-paid ledger) gets a link to its own hub page, the page others can cite. Google's guide asks for non-commodity content (R25); the ledger is exactly that.
10. **Keep the brand's headings.** "Three coffees we can't stop drinking" stays. A homepage outline needs order and honest structure, not keyword headings; hub pages carry descriptive headings. (Opinion.)
11. **App screens: quiet by construction.** Auth first, noindex as backstop on every response, no robots.txt block, no social tags on app pages, a generic card on the login page. Title text of app pages shows up in tabs, history and shared bookmarks: keep customer names and secrets out of it.

## Do and don't
- Do: `<title>Ember &amp; Oak: small-batch coffee roasters in Portland, Oregon</title>`. Don't: `Coffee | Coffee Roasters | Best Coffee Portland` (repeats, says nothing new).
- Do: meta description with facts: "...shipped within 48 hours. Bags from $18; subscriptions $18 with shipping." Don't: "Welcome to our coffee website."
- Do: `"price": 21.00, "priceCurrency": "USD"`. Don't: `"price": "$21"`.
- Do: `CafeOrCoffeeShop` with `parentOrganization`. Don't: invent `CoffeeShop` (not a schema.org type; search-check fails it).
- Do: PNG icon at 192px plus apple-touch-icon. Don't: ship only `favicon.svg` and expect Google to show it.
- Do: `noindex, nofollow` meta and `X-Robots-Tag` on app pages. Don't: `Disallow: /app/` in robots.txt as the only control.

## Worked examples

**1. Ember & Oak homepage (the combined coffee page).** Baseline: 0 lint fails, 6 search fails (no canonical, no og tags, 14 links to `#`), 6 warnings (no max-image-preview, three relative dates, no icon, no JSON-LD). Choices:
- Title: brand, category, place (60 characters). H1 stays the weekly lot; the first screen's eyebrow plus the title name the category and place.
- Graph: WebSite (site name, alternateName "Ember & Oak Coffee Roasters"), OnlineStore (logo, address, description), PostalAddress, CafeOrCoffeeShop (hours, geo to 5 decimals, `parentOrganization`). No Product (three products on the page), no FAQ (no questions on the page), no ItemList (US audience, the carousels beta does not apply).
- Links: 14 dead links become 16 unique destinations (hubs and three product pages); the prices-paid ledger links to `/transparency/`.
- Visible changes, kept small: footer gains ZIP and opening hours (markup must match), the manifesto names the roaster, the footer link labels become h2 (outline fix, same look).
- Card and icons: rendered from HTML templates with the page's own fonts and contour art; measured inside the square safe area.
- Stand-ins: the ZIP, opening hours and 5-decimal coordinates are invented for this fictional roaster. On a real job they come from the client and the Business Profile; markup must match reality, not only the page.
- Result: 0 search fails, 0 warnings; lint unchanged (0 fails, 21 warnings, all pre-existing touch-target and fluid-type warnings).

**2. Tally dashboard (app behind login).** Only one question applies: is it kept out? Baseline: no noindex (1 fail). Fix: `noindex, nofollow` meta plus a comment specifying the `X-Robots-Tag` header, the auth redirect and the robots.txt rule. No canonical, no JSON-LD, no og tags. Everything else in this chapter does not apply to a page no crawler should see.

**3. Product page fixture.** Product with name, three image ratios, sku, brand, weight, an Offer (21.00 USD, InStock, seller by `@id`), and BreadcrumbList. Shipping and returns not repeated (global on Organization once the policy page exists). Passes; the negative fixture with a homepage-style three-Product graph, `"$21"`, a FAQPage, `CoffeeShop` and a trailing comma fails 19 checks.

## Hand-offs
- design-frontend: server-render every tag above; set `X-Robots-Tag` on app responses; render the social card and icons in the build.
- design-art-direction: the social card is an art-directed asset; it follows the page concept and the reject test.
- design-typography: the card's type sizes follow the measured safe sizes above.
- design-copy: titles and descriptions in the brand's voice, with the facts first.
- website-strategy: which queries the homepage should own.
- design-ux and design-product-ui: login page and app shell (the generic card lives on the login page).
