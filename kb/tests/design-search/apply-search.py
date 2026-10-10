# Applies design-search to the combined coffee page source. Every change is commented with its reason.
# Run from the repo root:
#   cp kb/tests/combined/coffee.src.html kb/tests/design-search/coffee.src.html
#   python3 kb/tests/design-search/apply-search.py kb/tests/design-search/coffee.src.html
#   node kb/tests/design-search/build.mjs
# Each replacement asserts it matched exactly once, so a drift in the combined page stops the script.
import sys, json
p = sys.argv[1]
s = open(p, encoding='utf8').read()

def rep(old, new, count=1):
    global s
    n = s.count(old)
    if n != count:
        raise SystemExit(f'expected {count} of {old[:70]!r}, found {n}')
    s = s.replace(old, new)

BASE = 'https://emberandoak.example/'
graph = {
  "@context": "https://schema.org",
  "@graph": [
    {"@type": "WebSite", "@id": BASE + "#website", "url": BASE, "name": "Ember & Oak",
     "alternateName": ["Ember & Oak Coffee Roasters"], "publisher": {"@id": BASE + "#org"}, "inLanguage": "en-US"},
    {"@type": "OnlineStore", "@id": BASE + "#org", "name": "Ember & Oak Coffee Roasters", "url": BASE,
     "logo": BASE + "logo-512.png",
     "image": BASE + "og/home-1200x630.png",
     "description": "Specialty coffee roaster in Southeast Portland, Oregon. Single-origin coffee roasted twelve kilos at a time on a 1962 Probat and shipped within 48 hours of roasting.",
     "address": {"@id": BASE + "#address"},
     "subOrganization": {"@id": BASE + "visit/#cafe"}},
    {"@type": "PostalAddress", "@id": BASE + "#address", "streetAddress": "1120 SE Water Ave",
     "addressLocality": "Portland", "addressRegion": "OR", "postalCode": "97214", "addressCountry": "US"},
    {"@type": "CafeOrCoffeeShop", "@id": BASE + "visit/#cafe", "name": "Ember & Oak Coffee Roasters",
     "url": BASE + "visit/", "parentOrganization": {"@id": BASE + "#org"},
     "address": {"@id": BASE + "#address"},
     "geo": {"@type": "GeoCoordinates", "latitude": 45.51216, "longitude": -122.66534},
     "openingHoursSpecification": [{"@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "07:00", "closes": "15:00"}],
     "servesCuisine": "Coffee", "image": BASE + "og/home-1200x630.png"}
  ]
}
ld = json.dumps(graph, indent=1, ensure_ascii=False).replace('</', '<\\/')

head = f'''<title>Ember &amp; Oak: small-batch coffee roasters in Portland, Oregon</title>
<meta name="description" content="Single-origin coffee roasted 12 kg at a time on a 1962 Probat in Southeast Portland, shipped within 48 hours. Bags from $18; subscriptions $18 with shipping.">
<link rel="canonical" href="{BASE}">
<meta name="robots" content="max-image-preview:large">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Ember &amp; Oak">
<meta property="og:title" content="Ember &amp; Oak: small-batch coffee roasters in Portland">
<meta property="og:description" content="Single-origin coffee, roasted twelve kilos at a time and shipped within 48 hours. Every bag prints what we paid for it.">
<meta property="og:url" content="{BASE}">
<meta property="og:locale" content="en_US">
<meta property="og:image" content="{BASE}og/home-1200x630.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="The Ember &amp; Oak wordmark over orange contour lines, with the line: single-origin coffee, roasted in Portland.">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script type="application/ld+json">
{ld}
</script>
'''
rep('<title>Ember &amp; Oak Coffee Roasters, Portland</title>\n<meta name="description" content="Single-origin coffee roasted in small batches on a 1962 Probat in Southeast Portland. This week: Ethiopia Guji, lot 0412.">\n', head)

# Footer link-group headings: h3 under the newsletter h2 made a false outline. They are siblings, so h2.
rep('.site-footer h2 {', '.site-footer h2:not(.label) {')
rep('.links h3 { margin-bottom', '.links h2 { margin-bottom')
rep('<div class="links"><h3 class="label">Shop</h3>', '<div class="links"><h2 class="label">Shop</h2>')
rep('<div class="links"><h3 class="label">Roastery</h3>', '<div class="links"><h2 class="label">Roastery</h2>')

# Real URLs: crawlers follow <a href>, not "#". Hub pages get sitewide links from header and footer.
rep('<a class="logo" href="#">', '<a class="logo" href="/">')
rep('<a href="#shop">Shop</a>', '<a href="/coffee/">Shop</a>')
rep('<a class="hide-sm" href="#story">Roastery</a>', '<a class="hide-sm" href="/roastery/">Roastery</a>')
rep('<a class="hide-sm" href="#journal">Journal</a>', '<a class="hide-sm" href="/journal/">Journal</a>')
rep('<a href="#cart" aria-describedby', '<a href="/cart/" aria-describedby')
rep('<a class="btn btn-secondary btn-sm hide-sm" href="#subscribe">Subscribe</a>', '<a class="btn btn-secondary btn-sm hide-sm" href="/subscriptions/">Subscribe</a>')
rep('<a class="btn btn-secondary" href="#shop">Buy a bag, $21</a>', '<a class="btn btn-secondary" href="/coffee/ethiopia-guji-hambela-wamena/">Buy a bag, $21</a>')
rep('<a class="btn btn-feature btn-wide" href="#">Start my subscription</a>', '<a class="btn btn-feature btn-wide" href="/subscriptions/">Start my subscription</a>')
rep('<a class="more" href="#">See all 9 coffees', '<a class="more" href="/coffee/">See all 9 coffees')
rep('<a class="card-link" href="#">Ethiopia Guji</a>', '<a class="card-link" href="/coffee/ethiopia-guji-hambela-wamena/">Ethiopia Guji</a>')
rep('<a class="card-link" href="#">Colombia Huila</a>', '<a class="card-link" href="/coffee/colombia-huila-finca-el-mirador/">Colombia Huila</a>')
rep('<a class="card-link" href="#">Oak Fire Espresso</a>', '<a class="card-link" href="/coffee/oak-fire-espresso/">Oak Fire Espresso</a>')
for text, url in [('Coffee', '/coffee/'), ('Subscriptions', '/subscriptions/'), ('Brewing gear', '/brewing-gear/'), ('Gift cards', '/gift-cards/'),
                  ('Our story', '/roastery/'), ('Wholesale', '/wholesale/'), ('Visit the cafe', '/visit/'), ('Contact', '/contact/')]:
    rep(f'<li><a href="#">{text}</a></li>', f'<li><a href="{url}">{text}</a></li>')

# Absolute dates behind relative words: the visible voice stays, the machine-readable date travels with any quote.
# Wrap the whole phrase, not the one word, and give <time> no font features of its own: the first build (time around
# "Tuesday" only, plus a global tabular-nums rule on time) moved "Tuesday" 3px in the H1 and reshaped the eyebrow and
# offer note. Whole phrases plus a ledger-only rule: zero pixel difference from the combined page above the story section.
rep('<p class="label">This week’s single origin · Lot 0412</p>', '<p class="label"><time datetime="2026-W41">This week’s single origin</time> · Lot 0412</p>')
rep('<em>roasted&nbsp;Tuesday</em>', '<em><time datetime="2026-10-06">roasted&nbsp;Tuesday</time></em>')
rep('Your first bag ships this Friday.', '<time datetime="2026-10-16">Your first bag ships this Friday.</time>')
rep('<th scope="row">New York C price, Sept 30</th>', '<th scope="row"><time datetime="2026-09-30">New York C price, Sept 30</time></th>')

# A passage that still makes sense when lifted out of the page names its subject.
rep('<p class="manifesto">We roast on a 1962 Probat', '<p class="manifesto">Ember &amp; Oak roasts on a 1962 Probat')

# The original data (prices paid) gets a link to its hub: the page an answer engine can cite and a buyer can check.
rep('<p class="src">Contract and receipts on request. Prices before import and freight.</p>',
    '<p class="src">Prices before import and freight. Contract and receipts on request, and <a href="/transparency/">what we paid for every lot</a> we roast.</p>')

# Visible facts the LocalBusiness markup states: full address and opening hours.
rep('<p>Ember &amp; Oak Coffee Roasters, 1120 SE Water Ave, Portland, Oregon</p>',
    '<p>Ember &amp; Oak Coffee Roasters, 1120 SE Water Ave, Portland, OR 97214. Cafe and roastery open every day, 7am to 3pm.</p>')

# Dates set in <time> keep the ledger's figures aligned like every other number on the page.
rep('.links h2 { margin-bottom', '.ledger time { font-variant-numeric: tabular-nums; } /* scoped: on the hero label and offer note the feature shifted the letters too */\n.links h2 { margin-bottom')

open(p, 'w', encoding='utf8').write(s)
print('ok')
