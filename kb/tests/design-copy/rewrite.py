# Copy rewrite for the design-copy render test (kb/tests/design-copy.md).
# Applies every copy change to the sources copied from kb/tests/combined/, asserting each target string
# appears exactly as often as expected, so the diff between before/ and the built pages is only copy
# (plus the one .caveat style the dashboard needs). Run: python3 -I kb/tests/design-copy/rewrite.py
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def apply(name, pairs):
    path = os.path.join(HERE, name)
    s = open(path, encoding='utf8').read()
    for old, new, n in pairs:
        c = s.count(old)
        if c != n:
            sys.exit(f'{name}: expected {n} of {old[:70]!r}, found {c}')
        s = s.replace(old, new)
    open(path, 'w', encoding='utf8').write(s)
    print(name, 'ok,', len(pairs), 'edits')


coffee = [
    # The first screen at 390 px ends above the lead line, so the label carries the category word.
    ('<p class="label">This week’s single origin · Lot 0412</p>', '<p class="label">This week’s single-origin coffee · Lot 0412</p>', 1),
    ('the Hambela Wamena hills where it grew. The map continues off the bag to the summit at 2,100 metres.',
     'the Hambela Wamena hills where it grew. The map continues off the bag to the summit at 2,100 meters.', 1),
    ('<p class="lead">Roasted light in small batches and on its way to you within two days of the roast.</p>',
     '<p class="lead">Single-origin coffee, roasted in Portland every Tuesday and Friday. Every bag ships within 48 hours of its roast.</p>', 1),
    ('<a class="btn btn-primary" href="#subscribe">Start a subscription</a>\n          <a class="btn btn-secondary" href="#shop">Buy a bag, $21</a>',
     '<a class="btn btn-primary" href="#subscribe">Subscribe, $18 a bag</a>\n          <a class="btn btn-secondary" href="#shop">Buy this bag, $21</a>', 1),
    ('<dt class="label">Roast to door</dt>', '<dt class="label">Roast to ship</dt>', 1),
    ('Roasted to order, never more than three days old when it ships</li>', 'Shipped within 48 hours of its roast, every time</li>', 1),
    ('<p class="offer-note"><strong>A bag, shipping included.</strong> 15% under shop price. Your first bag ships this Friday.</p>',
     '<p class="offer-note"><strong>Any coffee, shipping included.</strong> Shop price is $18 to $21 plus shipping. Order by Mon,&nbsp;Oct&nbsp;12 for the Tue,&nbsp;Oct&nbsp;13 roast.</p>', 1),
    ('<a class="btn btn-feature btn-wide" href="#">Start my subscription</a>',
     '<a class="btn btn-feature btn-wide" href="#">Subscribe for $18 a bag</a>', 1),
    ('<p class="label">On the roaster now</p>', '<p class="label">In the shop</p>', 1),
    ('<h2 id="shop-title">Three coffees we can’t stop <em>drinking</em></h2>',
     '<h2 id="shop-title">Three coffees, grown 1,100&nbsp;to&nbsp;2,100 <em>meters up</em></h2>', 1),
    ('twelve kilos at a time. Every batch is logged', '12 kilos at a time. Every batch is logged', 1),
    ('<b>Batch 0412, Ethiopia Guji.</b> Bean temperature over 10 minutes 10 seconds, the bag in your hands.</span><span class="anno">First crack at 8:40 and 196&#8239;°C, dropped at 10:10 and 207&#8239;°C</span>',
     '<b>Batch 0412, Ethiopia Guji.</b> Bean temperature through the roast, for the coffee in this week’s bags.</span><span class="anno">First crack 8:40, 196&#8239;°C. Out at 10:10, 207&#8239;°C</span>', 1),
    ('<h3>Buy direct</h3><p>We pay growers we know by name, and we visit every farm we buy from at least once every two years.</p>',
     '<h3>We know every grower by name</h3><p>We buy direct and visit every farm at least once every two years. What we paid for this lot is in the table.</p>', 1),
    ('<h3>Roast in small batches</h3><p>Twelve kilos at a time, profiled for each lot and cupped by two of us before a single bag ships.</p>',
     '<h3>Two of us taste every batch</h3><p>Each lot gets its own roast profile. Nothing ships until two roasters have cupped the batch and signed it off.</p>', 1),
    ('<h3>Ship within 48 hours</h3><p>Your coffee leaves the roastery two days after roasting at most, so it peaks in your kitchen, not ours.</p>',
     '<h3>It leaves within 48 hours of the roast</h3><p>Fresh coffee keeps changing for days after the roast. Shipping fast means those days happen in your kitchen, not on our shelf.</p>', 1),
    ('<tr><th scope="row">New York C price, Sept 30</th>', '<tr><th scope="row">Commodity price (New York “C”), Sep 30</th>', 1),
    ('<tr class="total"><th scope="row">Over the Fairtrade floor</th>', '<tr class="total"><th scope="row">Times the Fairtrade minimum</th>', 1),
    ('<span class="spinner" aria-hidden="true"></span>Sign up</button>', '<span class="spinner" aria-hidden="true"></span>Get the letters</button>', 1),
    ("The first letter goes to ' + addr.replace(/[<>&]/g, '') + ' on Oct 22.",
     "The first letter goes to ' + addr.replace(/[<>&]/g, '') + ' on Thu,\u00a0Oct\u00a022.", 1),
]

dash = [
    ('.restricted { display: block;',
     '.kpi .caveat { grid-column: 1 / -1; display: block; margin-top: var(--space-2); font-size: var(--text-xs); color: var(--color-text-muted); }\n.restricted { display: block;', 1),
    ('Compared to: <b>previous period</b>', 'Compared to: <b>previous 12 weeks</b>', 1),
    ('<strong>Weekly active users are up 12.4%, the third rise in a row.</strong> Checkout tracking has been down since 14:05, so <a href="#attention-title">today’s conversion and revenue are undercounted</a>.',
     '<strong>Weekly active users are up 8.1%, the eighth rise in a row.</strong> Checkout events stopped at 2:05&nbsp;pm, so <a href="#attention-title">today’s conversion and revenue are undercounted</a>.', 1),
    ('aria-label="Key metrics, last 7 days versus previous 7 days"', 'aria-label="Key metrics, this week versus last week"', 1),
    ('</svg>+12.4% <span>vs last week</span></span>', '</svg>+8.1% <span>vs last week</span></span>', 1),
    ('</svg>+0.6 pts <span>vs last week</span></span>',
     '</svg>+0.6 pts <span>vs last week</span></span><span class="caveat">Partial since 2:05&nbsp;pm</span>', 1),
    ('</svg>+8.1% <span>vs last week</span></span></span>',
     '</svg>+8.1% <span>vs last week</span></span><span class="caveat">Partial since 2:05&nbsp;pm</span></span>', 1),
    ('Visible to Finance admins. <a href="#">Ask Priya Shah</a>', 'Visible to Finance admins. <a href="#">Ask Priya Shah for access</a>', 1),
    ('<strong>Error: checkout events stopped</strong><p>No <code>checkout_completed</code> events for 2&nbsp;hours.</p><p class="meta">Since 14:05 &middot; <a href="#">View tracking plan</a></p>',
     '<strong>Error: checkout events stopped at 2:05&nbsp;pm</strong><p>No <code>checkout_completed</code> events since then. Other events are still arriving.</p><p class="meta">Last event 2:05&nbsp;pm PT &middot; <a href="#">Open in Events</a></p>', 1),
    ('<strong>Warning: iOS volume down 18%</strong><p>Fewer events from iOS 26 since Tuesday.</p><p class="meta">Since Oct 7 &middot; <a href="#">Compare platforms</a>',
     '<strong>Warning: iOS events down 18% this week</strong><p>The drop is limited to devices on iOS 26.</p><p class="meta">Started Wed,&nbsp;Oct&nbsp;7 &middot; <a href="#">Compare platforms</a>', 1),
    ('class="line-current"/></svg>This period</li>', 'class="line-current"/></svg>Last 12 weeks</li>', 1),
    ('<button class="btn" type="button" id="retry">Retry</button>', '<button class="btn" type="button" id="retry">Try again</button>', 1),
    ("run: () => announce('Export started')", "run: () => announce('Exporting top pages as CSV')", 1),
    ("menu.addEventListener('click', (e) => { const t = e.target.closest('button'); if (t) { announce(t.textContent + ': done'); closeMenu(true); } });",
     "// Announce the specific outcome, not 'done' (design-copy 02: success says what happened, to what).\n"
     "  const doneMsg = { 'Open in Events': (p) => 'Opening ' + p + ' in Events', 'Copy page URL': (p) => p + ' URL copied', 'Hide from report': (p) => p + ' hidden from this report' };\n"
     "  menu.addEventListener('click', (e) => { const t = e.target.closest('button'); if (t) { const p = menuBtn ? menuBtn.getAttribute('aria-label').replace('Actions for ', '') : 'Page'; const f = doneMsg[t.textContent]; announce(f ? f(p) : t.textContent); closeMenu(true); } });", 1),
]

states = [
    ('href="#">Start a subscription</a>', 'href="#">Subscribe, $18 a bag</a>', 4),
    ('<span class="lbl">Sign up</span>', '<span class="lbl">Get the letters</span>', 1),
    ('href="#">Start my subscription</a>', 'href="#">Subscribe for $18 a bag</a>', 4),
    ('type="button">Retry</button>', 'type="button">Try again</button>', 4),
    ('Compared to: <b>previous period</b>', 'Compared to: <b>previous 12 weeks</b>', 1),
    ('Visible to Finance admins. <a href="#">Ask Priya Shah</a>', 'Visible to Finance admins. <a href="#">Ask Priya Shah for access</a>', 1),
    ('id="why">Next roast Tuesday. We will email you.', 'id="why">Back after the Tue,&nbsp;Oct&nbsp;13 roast.', 1),
]

apply('coffee.src.html', coffee)
apply('dashboard.src.html', dash)
apply('states.mjs', states)
