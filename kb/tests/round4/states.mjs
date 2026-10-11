// State sheets for the combined pages (design-director build rules; design-polish 01 and 06).
// Each sheet reuses the built page's CSS; .is-hover, .is-active and .is-focus mirror the real :hover, :active and
// :focus-visible rules so those states can be rendered side by side. Built by build.mjs.

const SHEET_CSS = `
.sheet { max-width: 1232px; margin: 0 auto; padding: var(--space-8) var(--space-5); display: grid; gap: var(--space-8); }
@media (min-width: 768px) { .sheet { padding: var(--space-8); } }
.sheet > header h1 { font: 400 var(--text-2xl)/1.1 var(--font-serif, inherit); }
.sheet > header p { color: var(--color-text-muted); margin-top: var(--space-3); max-inline-size: 52ch; }
.group h2 { font: 600 var(--text-xs)/1.333 var(--font-sans); text-transform: uppercase; letter-spacing: 0.08em; color: var(--color-text-muted); margin-bottom: var(--space-5); }
.row { display: flex; flex-wrap: wrap; gap: var(--space-6); align-items: flex-start; }
.cell { display: grid; gap: var(--space-3); justify-items: start; }
.cell > span { font-size: var(--text-xs); color: var(--color-text-muted); }
.is-focus { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
`;


// Coffee sheet (round 4): every control on the new page, in every state, drawn by the page's own rules.
// Icons are {{c:name}} tokens from icons.mjs (the C16 set), expanded by build.mjs, so the sheet passes the icons lint too.
const coffee = {
  title: 'Ember &amp; Oak, state sheet',
  css: SHEET_CSS + `
.btn-primary.is-hover { background: var(--color-primary-hover); box-shadow: var(--highlight), var(--shadow-2); }
.btn-primary.is-active { background: var(--color-primary-active); box-shadow: var(--highlight); transform: scale(0.97); }
.btn-secondary.is-hover { background: var(--state-hover); }
.btn-secondary.is-active { background: var(--state-pressed); transform: scale(0.97); }
.btn[aria-disabled=true]:not([aria-busy]) { background: var(--color-surface-sunken); color: var(--color-text-muted); border-color: transparent; box-shadow: none; cursor: not-allowed; }
.nav-demo a.is-hover, .menu-toggle.is-hover, .close.is-hover, .stepper button.is-hover { background: var(--state-hover); }
.nav-demo a.is-active, .close.is-active, .stepper button.is-active { background: var(--state-pressed); }
.nav-demo { display: flex; }
.opt.is-hover { background: linear-gradient(var(--state-hover), var(--state-hover)), var(--color-surface); }
.opt.is-hover .sub { color: var(--color-text-muted-on-tint); }
@layer components { .sheet .menu-toggle { display: inline-flex !important; } } /* the page hides it from 768 up with !important in components; the sheet shows its states at every width */
.opt.is-focus { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
.news input.is-hover { border-color: var(--color-text-muted); }
.demo-w { width: 320px; max-width: 100%; }
.demo-lot { width: 100%; max-width: 760px; }
.demo-lot .lot { border-top: 1px solid var(--color-border); }
.demo-lot .lot.is-hover .card-link { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 6px; }
.demo-lot .lot.is-focus { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; border-radius: var(--radius-sm); }
.demo-slip { width: 100%; max-width: 480px; }
.on-band { background: var(--color-feature-bg); color: var(--color-feature-text); padding: var(--space-6); border-radius: var(--radius-lg); }
.on-band .cell > span { color: inherit; }
.panel-demo { width: 100%; max-width: 448px; border-radius: var(--radius-lg); box-shadow: var(--elevation-modal); background: var(--color-surface-raised); }
.panel-demo .cart-body { padding-bottom: 0; }
`,
  body: `<main class="sheet" id="main">
<header><h1>Ember &amp; Oak, state sheet</h1><p>Every control on the round 4 homepage in every state, drawn by the page’s own CSS. Hover, pressed and focus are forced with classes that mirror the real rules; loading, error and success use the page’s own markup.</p></header>

<section class="group" aria-labelledby="s-btn"><h2 id="s-btn">Buttons</h2>
  <div class="row">
    <div class="cell"><span>Primary, rest</span><button class="btn btn-primary" type="button">Subscribe, $18 a bag</button></div>
    <div class="cell"><span>Hover</span><button class="btn btn-primary is-hover" type="button" data-lint-skip="primary">Subscribe, $18 a bag</button></div>
    <div class="cell"><span>Pressed</span><button class="btn btn-primary is-active" type="button" data-lint-skip="primary">Subscribe, $18 a bag</button></div>
    <div class="cell"><span>Focus</span><button class="btn btn-primary is-focus" type="button" data-lint-skip="primary">Subscribe, $18 a bag</button></div>
    <div class="cell"><span>Sending (the page’s own aria-busy rule)</span><button class="btn btn-primary" type="button" aria-busy="true" aria-disabled="true" data-lint-skip="primary"><span class="spinner" aria-hidden="true"></span>Get the letters</button></div>
    <div class="cell"><span>Disabled</span><button class="btn btn-primary" type="button" aria-disabled="true">Pay $39.00</button></div>
  </div>
  <div class="row" style="margin-top:var(--space-6)">
    <div class="cell"><span>Secondary, rest</span><a class="btn btn-secondary" href="#main">Buy this bag, $21</a></div>
    <div class="cell"><span>Hover</span><a class="btn btn-secondary is-hover" href="#main">Buy this bag, $21</a></div>
    <div class="cell"><span>Pressed</span><a class="btn btn-secondary is-active" href="#main">Buy this bag, $21</a></div>
    <div class="cell"><span>Focus</span><a class="btn btn-secondary is-focus" href="#main">Buy this bag, $21</a></div>
    <div class="cell"><span>Small, rest</span><button class="btn btn-secondary btn-sm" type="button">Add to cart…</button></div>
    <div class="cell"><span>Small, focus</span><button class="btn btn-secondary btn-sm is-focus" type="button">Add to cart…</button></div>
  </div>
</section>

<section class="group" aria-labelledby="s-nav"><h2 id="s-nav">Header</h2>
  <div class="row">
    <div class="cell"><span>Nav link: rest, hover, pressed, focus</span><nav class="nav nav-demo" aria-label="Demo"><a href="#main">Shop</a><a class="is-hover" href="#main">Subscriptions</a><a class="is-active" href="#main">Roastery</a><a class="is-focus" href="#main">Journal</a></nav></div>
    <div class="cell"><span>Cart, empty and with 2 items</span><nav class="nav nav-demo" aria-label="Demo cart"><a href="#main">Cart <span class="cart-count"><span aria-hidden="true">0</span></span></a><a href="#main">Cart <span class="cart-count has"><span aria-hidden="true">2</span></span></a></nav></div>
    <div class="cell"><span>Menu: closed, hover, open, focus</span><div class="row" style="gap:var(--space-3)"><button class="menu-toggle" type="button" aria-expanded="false">{{c:menu}}Menu</button><button class="menu-toggle is-hover" type="button" aria-expanded="false">{{c:menu}}Menu</button><button class="menu-toggle" type="button" aria-expanded="true">{{c:menu}}Menu</button><button class="menu-toggle is-focus" type="button" aria-expanded="false">{{c:menu}}Menu</button></div></div>
    <div class="cell"><span>Skip link, focused</span><a class="skip" href="#main" style="position:static;transform:none">Skip to content</a></div>
  </div>
</section>

<section class="group" aria-labelledby="s-lot"><h2 id="s-lot">Lot row</h2>
  <div class="demo-lot"><ul>
    <li class="lot"><div class="tile" aria-hidden="true"></div><div class="lot-main"><div class="roast label"><span class="roast-meter" aria-hidden="true"><i class="on"></i><i></i><i></i></span>Light roast</div><h3><a class="card-link" href="#main">Ethiopia Guji, rest</a></h3><p class="origin">Hambela Wamena, washed, 2,100&#8239;m</p></div><div class="lot-buy"><p class="p">$21 <small>/ <span class="unit">340&#8239;g</span></small></p><button class="btn btn-secondary btn-sm" type="button">Add to cart…</button></div></li>
    <li class="lot is-hover"><div class="tile" aria-hidden="true"></div><div class="lot-main"><div class="roast label"><span class="roast-meter" aria-hidden="true"><i class="on"></i><i class="on"></i><i></i></span>Medium roast</div><h3><a class="card-link" href="#main">Colombia Huila, hover</a></h3><p class="origin">Finca El Mirador, washed, 1,750&#8239;m</p></div><div class="lot-buy"><p class="p">$19 <small>/ <span class="unit">340&#8239;g</span></small></p><button class="btn btn-secondary btn-sm" type="button">Add to cart…</button></div></li>
    <li class="lot is-focus"><div class="tile" aria-hidden="true"></div><div class="lot-main"><div class="roast label"><span class="roast-meter" aria-hidden="true"><i class="on"></i><i class="on"></i><i class="on"></i></span>Dark roast</div><h3><a class="card-link" href="#main">Oak Fire Espresso, focus</a></h3><p class="origin">Brazil and Guatemala blend</p></div><div class="lot-buy"><p class="p">$18 <small>/ <span class="unit">340&#8239;g</span></small></p><button class="btn btn-secondary btn-sm" type="button">Add to cart…</button></div></li>
  </ul></div>
</section>

<section class="group" aria-labelledby="s-opt"><h2 id="s-opt">Order slip options</h2>
  <div class="row">
    <div class="cell demo-w"><span>Rest</span><label class="opt stack"><input type="radio" name="d1"><span><span class="name">Pour-over</span><span class="sub">Medium-fine</span></span></label></div>
    <div class="cell demo-w"><span>Hover</span><label class="opt stack is-hover"><input type="radio" name="d2"><span><span class="name">Espresso</span><span class="sub">Fine</span></span></label></div>
    <div class="cell demo-w"><span>Selected</span><label class="opt stack"><input type="radio" name="d3" checked><span><span class="name">Moka pot</span><span class="sub">Fine to medium</span></span></label></div>
    <div class="cell demo-w"><span>Selected, focus</span><label class="opt stack is-focus"><input type="radio" name="d4" checked tabindex="-1"><span><span class="name">French press</span><span class="sub">Coarse</span></span></label></div>
    <div class="cell demo-w"><span>With price</span><label class="opt"><input type="radio" name="d5" checked><span><span class="name">Ethiopia Guji</span><span class="sub">Light, peach and jasmine</span></span><span class="amt">$18</span></label></div>
    <div class="cell demo-w"><span>Your usual (quick add)</span><label class="opt stack"><input type="radio" name="d6" checked><span><span class="name">Pour-over</span><span class="sub">Medium-fine</span><span class="usual">Your usual</span></span></label></div>
  </div>
  <div class="row" style="margin-top:var(--space-6)">
    <div class="cell demo-slip"><span>Brew question, error</span><fieldset class="opt-group invalid"><legend>How do you brew?<span class="hint">We grind each bag for your brewer the morning it ships.</span></legend><p class="error">{{c:error}}Choose how you brew, so we grind it right.</p><div class="opts cols-2"><label class="opt stack"><input type="radio" name="d7"><span><span class="name">Pour-over</span><span class="sub">Medium-fine</span></span></label><label class="opt stack"><input type="radio" name="d7"><span><span class="name">Espresso</span><span class="sub">Fine</span></span></label></div></fieldset></div>
    <div class="cell demo-slip"><span>Term line, 4 weeks</span><p class="terms"><b>$16 at checkout, then every 4 weeks</b> on roast day: next charge Tue,&nbsp;Nov&nbsp;10. First roast Tue,&nbsp;Oct&nbsp;13. Skip, pause or cancel online any time before a roast.</p></div>
  </div>
</section>

<section class="group" aria-labelledby="s-qty"><h2 id="s-qty">Stepper and close</h2>
  <div class="row">
    <div class="cell"><span>One bag (minus disabled)</span><div class="stepper" role="group" aria-label="Bags, one"><button type="button" aria-label="One bag fewer" aria-disabled="true">{{c:minus}}</button><output>1</output><button type="button" aria-label="One bag more">{{c:plus}}</button></div></div>
    <div class="cell"><span>Three bags, plus hover</span><div class="stepper" role="group" aria-label="Bags, three"><button type="button" aria-label="One bag fewer">{{c:minus}}</button><output>3</output><button class="is-hover" type="button" aria-label="One bag more">{{c:plus}}</button></div></div>
    <div class="cell"><span>Pressed and focus</span><div class="stepper" role="group" aria-label="Bags, two"><button class="is-active" type="button" aria-label="One bag fewer">{{c:minus}}</button><output>2</output><button class="is-focus" type="button" aria-label="One bag more">{{c:plus}}</button></div></div>
    <div class="cell"><span>Close: rest, hover, pressed, focus</span><div class="row" style="gap:var(--space-3)"><button class="close" type="button" aria-label="Close">{{c:close}}</button><button class="close is-hover" type="button" aria-label="Close">{{c:close}}</button><button class="close is-active" type="button" aria-label="Close">{{c:close}}</button><button class="close is-focus" type="button" aria-label="Close">{{c:close}}</button></div></div>
    <div class="cell"><span>Remove and undo</span><div class="row" style="gap:var(--space-5)"><button class="link-btn" type="button">Remove</button><button class="link-btn is-focus" type="button">Undo</button></div></div>
  </div>
</section>

<section class="group" aria-labelledby="s-field"><h2 id="s-field">Email field</h2>
  <div class="row">
    <div class="cell demo-w news"><span>Rest</span><input type="email" placeholder="you@example.com" aria-label="Email, rest"></div>
    <div class="cell demo-w news"><span>Hover</span><input class="is-hover" type="email" placeholder="you@example.com" aria-label="Email, hover"></div>
    <div class="cell demo-w news"><span>Focus</span><input class="is-focus" type="email" value="dana@example.com" aria-label="Email, focus"></div>
    <div class="cell demo-w news"><span>Error</span><input type="email" value="dana@" aria-invalid="true" aria-label="Email, error" aria-describedby="sheet-err"><p class="error" id="sheet-err">{{c:error}}Add the rest of your email, for example dana@example.com.</p></div>
    <div class="cell demo-w"><span>Subscribed</span><p class="ok">{{c:check}}<span>You’re on the list. The first letter goes to dana@example.com on Thu,&nbsp;Oct&nbsp;22.</span></p></div>
  </div>
</section>

<section class="group" aria-labelledby="s-cart"><h2 id="s-cart">Cart panel</h2>
  <div class="row">
    <div class="cell panel-demo"><div class="cart-body"><div class="cart-empty"><h3>Your cart is empty</h3><p>This week’s coffee is Ethiopia Guji. It roasts Tue,&nbsp;Oct&nbsp;13 in Portland and ships Wed,&nbsp;Oct&nbsp;14.</p><a class="more" href="#main">See all 9 coffees{{c:arrow-right}}</a></div></div></div>
    <div class="cell panel-demo"><div class="cart-body"><ul><li class="line removed"><span>Removed Colombia Huila.</span><button class="link-btn" type="button">Undo</button></li></ul></div></div>
  </div>
</section>
</main>`,
};
const up = '{{i:arrow-up}}';
const dots = '{{i:more}}';
const grid = '{{i:overview}}';
const sortIcon = '{{i:arrow-down}}';

const dashboard = {
  title: 'Tally, state sheet',
  css: SHEET_CSS + `
body { background: var(--color-surface); }
.sheet > header h1 { font: 600 var(--text-2xl)/1.15 var(--font-sans); letter-spacing: -0.02em; }
.btn.is-hover, .chip.is-hover, .icon-btn.is-hover, .row-btn.is-hover { background: var(--state-hover); }
.btn.is-active, .chip.is-active, .icon-btn.is-active, .row-btn.is-active { background: var(--state-pressed); transform: scale(0.97); }
.chip.is-active, .row-btn.is-active, .chip.is-hover, .row-btn.is-hover { color: var(--color-text); }
.btn-primary.is-hover { background: var(--color-primary-hover); }
.btn-primary.is-active { background: var(--color-primary-active); box-shadow: var(--highlight); }
.nav-demo { width: 240px; }
.nav-demo a.is-hover { background: var(--state-hover); color: var(--color-text); }
.nav-demo a.is-active { background: var(--state-pressed); color: var(--color-text); }
.search.is-focus { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
.search.is-focus kbd { visibility: hidden; }
.row-btn { opacity: 1 !important; }
.sort.is-hover { color: var(--color-text); }
.demo-panel { width: 340px; max-width: 100%; }
.demo-kpi { width: 300px; max-width: 100%; border: 1px solid var(--color-border); border-radius: var(--radius-lg); }
.demo-kpi .kpi { border: 0 !important; }
.demo-menu { position: static; }
.demo-wide { width: 100%; max-width: 520px; }
.demo-wide > .panel { align-self: stretch; width: 100%; }
.sheet .search { display: flex; } /* on the page it shows from 64rem of work area */
.demo-kpi .kpi { padding: var(--panel-p) !important; }
.sheet .failed, .sheet .empty { display: grid; }
.demo-pal { width: 340px; max-width: 100%; padding: var(--space-3); background: var(--color-surface-raised); border-radius: var(--radius-lg); box-shadow: var(--elevation-modal); }
`,
  body: `<main class="sheet">
  <header><h1>Tally, state sheet</h1><p>Every control and panel on the round 4 overview in every state it can be in, drawn by the page’s own CSS. Hover is an 8 percent layer of the text color, pressed is 10 percent and scales to 0.97, filled buttons step to their active color.</p></header>
  <section class="group" aria-labelledby="d1"><h2 id="d1">Buttons</h2><div class="row">
    <div class="cell"><span>Primary rest</span><button class="btn btn-primary" type="button">Share report</button></div>
    <div class="cell"><span>Hover</span><button class="btn btn-primary is-hover" type="button">Share report</button></div>
    <div class="cell"><span>Pressed</span><button class="btn btn-primary is-active" type="button">Share report</button></div>
    <div class="cell"><span>Focus</span><button class="btn btn-primary is-focus" type="button">Share report</button></div>
    <div class="cell"><span>Secondary rest</span><button class="btn" type="button">Try again</button></div>
    <div class="cell"><span>Hover</span><button class="btn is-hover" type="button">Try again</button></div>
    <div class="cell"><span>Pressed</span><button class="btn is-active" type="button">Try again</button></div>
    <div class="cell"><span>Focus</span><button class="btn is-focus" type="button">Try again</button></div>
    <div class="cell"><span>Busy (spinner over the kept box)</span><button class="btn" type="button" aria-busy="true" aria-disabled="true"><span class="spinner" aria-hidden="true"></span><span>Try again</span></button></div>
    <div class="cell"><span>Primary busy</span><button class="btn btn-primary" type="button" aria-busy="true" aria-disabled="true"><span class="spinner" aria-hidden="true"></span><span>Share report</span></button></div>
    <div class="cell"><span>Disabled</span><button class="btn" type="button" aria-disabled="true">Export CSV</button></div>
  </div></section>
  <section class="group" aria-labelledby="d2"><h2 id="d2">Filter chips and icon buttons</h2><div class="row">
    <div class="cell"><span>Applied</span><button class="chip active" type="button"><svg width="24" height="8" aria-hidden="true"><line x1="0" y1="4" x2="24" y2="4" class="line-previous"/></svg>vs previous 12&nbsp;weeks</button></div>
    <div class="cell"><span>Not applied</span><button class="chip" type="button">Add filter</button></div>
    <div class="cell"><span>Hover</span><button class="chip is-hover" type="button">Add filter</button></div>
    <div class="cell"><span>Pressed</span><button class="chip is-active" type="button">Add filter</button></div>
    <div class="cell"><span>Focus</span><button class="chip is-focus" type="button">Add filter</button></div>
    <div class="cell"><span>Row actions rest, hover, pressed, focus</span><div class="row" style="gap:var(--space-3)"><button class="row-btn" type="button" aria-label="Actions, rest">${dots}</button><button class="row-btn is-hover" type="button" aria-label="Actions, hover">${dots}</button><button class="row-btn is-active" type="button" aria-label="Actions, pressed">${dots}</button><button class="row-btn is-focus" type="button" aria-label="Actions, focus">${dots}</button></div></div>
  </div></section>
  <section class="group" aria-labelledby="d3"><h2 id="d3">Navigation</h2><div class="row">
    <nav class="nav nav-demo" aria-label="Navigation states"><ul>
      <li><a href="#">${grid}<span class="label">Rest</span></a></li>
      <li><a class="is-hover" href="#">${grid}<span class="label">Hover</span><kbd aria-hidden="true" style="visibility:visible">G O</kbd></a></li>
      <li><a class="is-active" href="#">${grid}<span class="label">Pressed</span></a></li>
      <li><a href="#" aria-current="page">${grid}<span class="label">Current page</span></a></li>
      <li><a class="is-focus" href="#">${grid}<span class="label">Focus</span></a></li>
    </ul></nav>
  </div></section>
  <section class="group" aria-labelledby="d4"><h2 id="d4">Fields and switch</h2><div class="row">
    <div class="cell"><span>Search rest</span><label class="search"><input type="search" placeholder="Search pages" aria-label="Search pages, rest"><kbd aria-hidden="true">/</kbd></label></div>
    <div class="cell"><span>Search focus (shortcut hint hides)</span><label class="search is-focus"><input type="search" value="/pricing" aria-label="Search pages, focus" data-lint-skip="focus"><!-- the ring is drawn on the label by :focus-within; .is-focus mirrors it --><kbd aria-hidden="true">/</kbd></label></div>
    <div class="cell"><span>Switch on</span><input type="checkbox" role="switch" class="switch" checked aria-label="Single-key shortcuts, on"></div>
    <div class="cell"><span>Switch off</span><input type="checkbox" role="switch" class="switch" aria-label="Single-key shortcuts, off"></div>
    <div class="cell"><span>Switch focus</span><input type="checkbox" role="switch" class="switch is-focus" checked aria-label="Single-key shortcuts, focus"></div>
  </div></section>
  <section class="group" aria-labelledby="d5"><h2 id="d5">Table header sort</h2><div class="row"><table style="width:auto"><thead><tr>
    <th scope="col"><button class="sort" type="button">Not sorted${sortIcon}</button></th>
    <th scope="col" class="num"><button class="sort is-hover" type="button">Hover${sortIcon}</button></th>
    <th scope="col" class="num" aria-sort="descending"><button class="sort" type="button">Sorted, high first${sortIcon}</button></th>
    <th scope="col" class="num" aria-sort="ascending"><button class="sort" type="button">Sorted, low first${sortIcon}</button></th>
    <th scope="col"><button class="sort is-focus" type="button">Focus${sortIcon}</button></th>
  </tr></thead><tbody><tr><td>/pricing</td><td class="num">24,180</td><td class="num">24,180</td><td class="num">1,488</td><td>/</td></tr></tbody></table></div></section>
  <section class="group" aria-labelledby="d6"><h2 id="d6">KPI tile</h2><div class="row">
    <div class="cell"><span>Ready, with sparkline</span><dl class="demo-kpi"><div class="kpi"><dt>Conversion</dt><dd><span class="value">3.8<span class="u">%</span></span><svg class="spark" viewBox="0 0 96 32" preserveAspectRatio="none" role="img" aria-label="12-week trend: up from 3.0% to 3.8%"><polyline points="4,28 12,25 20,25 28,22 36,22 44,19 52,16 60,19 68,13 76,10 84,22 92,4" vector-effect="non-scaling-stroke"/><circle cx="92" cy="4" r="2.5"/></svg><span class="delta good">${up}+0.6 pts <span class="vs">vs prior 7 days</span></span></dd></div></dl></div>
    <div class="cell"><span>Partial (data problem marked where it is read)</span><dl class="demo-kpi"><div class="kpi"><dt>Revenue</dt><dd><span class="value"><span class="u pre">$</span>184.2<span class="u">k</span></span><span class="delta good">${up}+8.1% <span class="vs">vs prior 7 days</span></span><span class="caveat">Partial since 2:05&nbsp;pm</span></dd></div></dl></div>
    <div class="cell"><span>Loading (skeleton after 300 ms)</span><div class="demo-kpi"><div class="kpi"><span class="skel label"></span><span class="skel value"></span><span class="skel delta"></span></div></div></div>
    <div class="cell"><span>No data yet</span><dl class="demo-kpi"><div class="kpi"><dt>Conversion</dt><dd><span class="value" aria-hidden="true">&ndash;</span><span class="restricted">No data yet</span></dd></div></dl></div>
    <div class="cell"><span>Viewer role</span><dl class="demo-kpi"><div class="kpi"><dt>Revenue</dt><dd><span class="value" aria-hidden="true">{{i:lock:i-lock}}</span><span class="restricted">Visible to Finance admins. <a href="#">Ask Priya Shah for access</a></span></dd></div></dl></div>
  </div></section>
  <section class="group" aria-labelledby="d7"><h2 id="d7">Menus and command palette</h2><div class="row">
    <div class="cell"><span>Row menu, second item focused</span><div class="menu demo-menu" role="menu" aria-label="Page actions demo"><button role="menuitem" type="button" tabindex="-1">Open in Events</button><button role="menuitem" type="button" tabindex="-1" class="is-focus" style="background:var(--state-hover);outline-offset:-2px">Copy page URL</button><button role="menuitem" type="button" tabindex="-1">Hide from report</button></div></div>
    <div class="cell"><span>Palette option, active</span><div class="demo-pal" role="listbox" aria-label="Commands demo"><div class="pal-opt" role="option" aria-selected="true">Share report</div><div class="pal-opt" role="option" aria-selected="false">Events<span class="kbds" aria-hidden="true"><kbd>G</kbd><kbd>E</kbd></span></div></div></div>
  </div></section>
  <section class="group" aria-labelledby="d9"><h2 id="d9">Panels: error, empty, loading, no match</h2><div class="row">
    <div class="cell demo-wide"><span>Error, with retry</span><section class="panel" aria-label="Top pages, error demo"><div class="panel-head"><h3>Top pages, last 7 days</h3></div><div class="failed">{{i:warning:icon i-20}}<h3>Top pages didn’t load</h3><p>The query timed out after 30 seconds. Your data is safe; the rest of the overview is current.</p><button class="btn" type="button"><span class="spinner" aria-hidden="true"></span><span>Try again</span></button></div></section></div>
    <div class="cell demo-wide"><span>Empty, before the first event</span><section class="panel" aria-label="Top pages, empty demo"><div class="panel-head"><h3>Top pages, last 7 days</h3></div><div class="empty"><h3>No pages tracked yet</h3><p>Pages are ranked by views once the snippet sends <code>page_view</code> events.</p></div></section></div>
    <div class="cell demo-wide"><span>Loading rows</span><section class="panel" aria-label="Top pages, loading demo"><div class="panel-head"><h3>Top pages, last 7 days</h3></div><div class="skel-row"><span class="skel" style="width:40%"></span><span class="skel" style="width:15%"></span></div><div class="skel-row"><span class="skel" style="width:25%"></span><span class="skel" style="width:15%"></span></div><div class="skel-row"><span class="skel" style="width:45%"></span><span class="skel" style="width:15%"></span></div></section></div>
    <div class="cell demo-wide"><span>Invite field, error (checked on submit)</span><form class="invite-form" novalidate><input class="field" type="email" value="sam@" aria-invalid="true" aria-label="Teammate’s work email, error" aria-describedby="inv-err"><button class="btn" type="button">Invite</button><p class="field-msg err" id="inv-err">Add the rest of the address, for example sam@acme.com.</p></form></div>
    <div class="cell demo-wide"><span>Invite field, rest</span><form class="invite-form" novalidate><input class="field" type="email" placeholder="name@acme.com" aria-label="Teammate’s work email"><button class="btn" type="button">Invite</button></form></div>
    <div class="cell demo-wide"><span>Search, no match (the field’s only failure: it cannot be invalid)</span><label class="search" style="display:flex"><input type="search" value="/pricng" aria-label="Search pages, no match"><kbd aria-hidden="true">/</kbd></label><table><tbody><tr class="search-miss"><td colspan="6">No pages in the last 7 days match “/pricng”. <button class="text-link dismiss" type="button">Clear search</button></td></tr></tbody></table></div>
  </div></section>
  <section class="group" aria-labelledby="d8"><h2 id="d8">Plan usage meter (design-conversion 05)</h2><div class="row">
    <div class="cell usage-demo"><span>Setup and empty: nothing counted yet</span><a class="usage" href="#"><span class="usage-row"><span id="u0">Events this month</span><span class="plan">Starter</span></span><span class="meter" role="meter" aria-labelledby="u0" aria-valuemin="0" aria-valuemax="10000000" aria-valuenow="0" aria-valuetext="No events yet, 0 of 10 million"><i style="--w:0%"></i></span><span class="usage-row num"><span>No events yet</span><span></span></span></a></div>
    <div class="cell usage-demo"><span>Under 75%: quiet</span><a class="usage" href="#"><span class="usage-row"><span id="u1">Events this month</span><span class="plan">Starter</span></span><span class="meter" role="meter" aria-labelledby="u1" aria-valuemin="0" aria-valuemax="10000000" aria-valuenow="3600000" aria-valuetext="3.6 million of 10 million events"><i style="--w:36%"></i></span><span class="usage-row num"><span>3.6M of 10M</span><span>On pace for 9.3M</span></span></a></div>
    <div class="cell usage-demo"><span>Hover</span><a class="usage is-hover" href="#"><span class="usage-row"><span id="u2">Events this month</span><span class="plan">Starter</span></span><span class="meter" role="meter" aria-labelledby="u2" aria-valuemin="0" aria-valuemax="10000000" aria-valuenow="3600000" aria-valuetext="3.6 million of 10 million events"><i style="--w:36%"></i></span><span class="usage-row num"><span>3.6M of 10M</span><span>On pace for 9.3M</span></span></a></div>
    <div class="cell usage-demo"><span>Focus</span><a class="usage is-focus" href="#"><span class="usage-row"><span id="u3">Events this month</span><span class="plan">Starter</span></span><span class="meter" role="meter" aria-labelledby="u3" aria-valuemin="0" aria-valuemax="10000000" aria-valuenow="3600000" aria-valuetext="3.6 million of 10 million events"><i style="--w:36%"></i></span><span class="usage-row num"><span>3.6M of 10M</span><span>On pace for 9.3M</span></span></a></div>
    <div class="cell usage-demo"><span>75% and up: warning, projected date</span><a class="usage warn" href="#"><span class="usage-row"><span id="u4">Events this month</span><span class="plan">Starter</span></span><span class="meter" role="meter" aria-labelledby="u4" aria-valuemin="0" aria-valuemax="10000000" aria-valuenow="7800000" aria-valuetext="7.8 million of 10 million events, limit on Oct 16"><i style="--w:78%"></i></span><span class="usage-row num"><span>7.8M of 10M</span><span>Limit Oct 16</span></span></a></div>
  </div></section>
</main>`,
};

const _usageCss = `.usage-demo { width: 220px; } .usage-demo .usage { margin: 0; } .usage.is-hover { background: var(--state-hover); color: var(--color-text); } .usage.warn { box-shadow: inset 0 0 0 1px var(--color-warning); } .usage.warn .meter i { background: var(--color-warning); }`;
dashboard.css += _usageCss;
export const sheets = { coffee, dashboard };
export { SHEET_CSS };
