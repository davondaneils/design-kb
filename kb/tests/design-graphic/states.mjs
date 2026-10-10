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
.is-loading { color: transparent !important; }
.is-loading > .lbl { opacity: 0; }  /* not visibility: hidden, which deletes the accessible name */
.is-loading > .spinner { display: inline-block !important; position: absolute; left: 50%; top: 50%; margin: -8px 0 0 -8px; }
`;

const check = '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7"/></svg>';
const alertIcon = '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><path d="M8 4.5v4M8 11v.5"/></svg>';

const coffee = {
  title: 'Ember &amp; Oak, state sheet',
  css: SHEET_CSS + `
.btn-primary.is-hover { background: var(--color-primary-hover); box-shadow: var(--highlight), var(--shadow-2); }
.btn-primary.is-active { background: var(--color-primary-active); box-shadow: var(--highlight); transform: scale(0.97); }
.btn-secondary.is-hover { background: var(--state-hover); }
.btn-secondary.is-active { background: var(--state-pressed); transform: scale(0.97); }
.btn[aria-disabled=true]:not([aria-busy]) { background: var(--color-surface-sunken); color: var(--color-text-muted); border-color: transparent; box-shadow: none; cursor: not-allowed; }
.on-band { background: var(--color-feature-bg); color: var(--color-feature-text); padding: var(--space-6); border-radius: var(--radius-lg); }
.on-band .row { align-items: flex-end; }
.on-band .cell > span { color: inherit; }
.on-band .btn-feature { margin-top: 0; width: auto; }
.btn-feature.is-hover { background: var(--color-feature-cta-hover); }
.btn-feature.is-active { background: var(--color-feature-cta-active); box-shadow: none; transform: scale(0.98); }
.on-band .is-focus { outline-color: var(--color-feature-text); }
.nav-demo a { display: inline-flex; align-items: center; color: var(--color-text); text-decoration: none; padding: var(--space-3) var(--space-4); font-size: var(--text-sm); font-weight: 500; border-radius: var(--radius-full); }
.nav-demo a.is-hover { background: var(--state-hover); }
.nav-demo a.is-active { background: var(--state-pressed); }
input.is-hover { border-color: var(--color-text-muted); }
.field { width: 320px; max-width: 100%; }
.card-demo { width: 300px; }
.card.is-hover { box-shadow: var(--elevation-card-hover); transform: translateY(-2px); }
.card.is-focus { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
.card.is-focus .card-link { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; }
.reason { font-size: var(--text-xs); color: var(--color-text-muted); max-width: 20em; }
`,
  body: `<main class="sheet">
  <header><h1>Ember <span class="amp">&amp;</span> Oak, state sheet</h1><p>Every interactive part of the homepage in every state it can be in, drawn by the page’s own CSS. Focus ring contrast and pressed against hover are judged here.</p></header>
  <section class="group" aria-labelledby="g1"><h2 id="g1">Primary button</h2><div class="row">
    <div class="cell"><span>Rest</span><a class="btn btn-primary" href="#">Start a subscription</a></div>
    <div class="cell"><span>Hover</span><a class="btn btn-primary is-hover" href="#">Start a subscription</a></div>
    <div class="cell"><span>Pressed</span><a class="btn btn-primary is-active" href="#">Start a subscription</a></div>
    <div class="cell"><span>Focus</span><a class="btn btn-primary is-focus" href="#">Start a subscription</a></div>
    <div class="cell"><span>Sending (width kept)</span><button class="btn btn-primary is-loading" type="button" aria-busy="true" aria-disabled="true"><span class="lbl">Sign up</span><span class="spinner" style="color:var(--color-on-primary)" aria-hidden="true"></span></button></div>
  </div></section>
  <section class="group" aria-labelledby="g2"><h2 id="g2">Secondary and add to cart</h2><div class="row">
    <div class="cell"><span>Rest</span><button class="btn btn-secondary btn-sm add-btn" type="button"><span class="idle">Add to cart</span></button></div>
    <div class="cell"><span>Hover</span><button class="btn btn-secondary btn-sm add-btn is-hover" type="button"><span class="idle">Add to cart</span></button></div>
    <div class="cell"><span>Pressed</span><button class="btn btn-secondary btn-sm add-btn is-active" type="button"><span class="idle">Add to cart</span></button></div>
    <div class="cell"><span>Focus</span><button class="btn btn-secondary btn-sm add-btn is-focus" type="button"><span class="idle">Add to cart</span></button></div>
    <div class="cell"><span>Added, 2 s, announced</span><button class="btn btn-secondary btn-sm add-btn" type="button" data-added><span class="idle">Add to cart</span><span class="done">${check}Added</span></button></div>
    <div class="cell"><span>Sold out (focusable, says why)</span><button class="btn btn-secondary btn-sm add-btn" type="button" aria-disabled="true" aria-describedby="why"><span class="idle">Sold out</span></button><p class="reason" id="why">Next roast Tuesday. We will email you.</p></div>
  </div></section>
  <section class="group" aria-labelledby="g3"><h2 id="g3">Subscription band call to action</h2><div class="on-band"><div class="row">
    <div class="cell"><span>Rest</span><a class="btn btn-feature" href="#">Start my subscription</a></div>
    <div class="cell"><span>Hover</span><a class="btn btn-feature is-hover" href="#">Start my subscription</a></div>
    <div class="cell"><span>Pressed</span><a class="btn btn-feature is-active" href="#">Start my subscription</a></div>
    <div class="cell"><span>Focus (ring in band text color)</span><a class="btn btn-feature is-focus" href="#">Start my subscription</a></div>
  </div></div></section>
  <section class="group" aria-labelledby="g4"><h2 id="g4">Navigation and cart count</h2><div class="row nav-demo">
    <div class="cell"><span>Rest</span><a href="#">Shop</a></div>
    <div class="cell"><span>Hover</span><a class="is-hover" href="#">Shop</a></div>
    <div class="cell"><span>Pressed</span><a class="is-active" href="#">Shop</a></div>
    <div class="cell"><span>Focus</span><a class="is-focus" href="#">Shop</a></div>
    <div class="cell"><span>Cart empty</span><a href="#">Cart&nbsp;<span class="cart-count"><span aria-hidden="true">0</span></span><span class="sr-only">empty</span></a></div>
    <div class="cell"><span>Cart with 2 bags</span><a href="#">Cart&nbsp;<span class="cart-count has"><span aria-hidden="true">2</span></span><span class="sr-only">2 bags</span></a></div>
  </div></section>
  <section class="group" aria-labelledby="g5"><h2 id="g5">Email field</h2><div class="row">
    <div class="cell field"><span>Rest</span><label for="e1">Email address</label><input id="e1" type="email" placeholder="you@example.com"></div>
    <div class="cell field"><span>Hover</span><label for="e2">Email address</label><input id="e2" class="is-hover" type="email" value="dana@example.com"></div>
    <div class="cell field"><span>Focus</span><label for="e3">Email address</label><input id="e3" class="is-focus" type="email" value="dana@example.com"></div>
    <div class="cell field"><span>Error (icon, text, inset second pixel)</span><label for="e4">Email address</label><input id="e4" type="email" value="dana@" aria-invalid="true" aria-describedby="e4e"><p class="error" id="e4e">${alertIcon}Add the rest of your email, for example dana@example.com.</p></div>
    <div class="cell field"><span>Done</span><p class="ok">${check}<span>You’re on the list. The first letter goes to dana@example.com on Oct 22.</span></p></div>
  </div></section>
  <section class="group" aria-labelledby="g6"><h2 id="g6">Product card</h2><ul class="row cards" style="display:flex">
    <li class="card card-demo"><div class="card-body"><div class="roast label"><span class="roast-meter" aria-hidden="true"><i class="on"></i><i></i><i></i></span>Rest</div><h3><a class="card-link" href="#">Ethiopia Guji</a></h3><p class="taste">Peach, jasmine, wildflower honey</p></div></li>
    <li class="card card-demo is-hover"><div class="card-body"><div class="roast label"><span class="roast-meter" aria-hidden="true"><i class="on"></i><i></i><i></i></span>Hover (lift 2px, ring step)</div><h3><a class="card-link" href="#">Ethiopia Guji</a></h3><p class="taste">Peach, jasmine, wildflower honey</p></div></li>
    <li class="card card-demo is-focus"><div class="card-body"><div class="roast label"><span class="roast-meter" aria-hidden="true"><i class="on"></i><i></i><i></i></span>Focus (ring on card, underline on title)</div><h3><span class="card-link">Ethiopia Guji</span></h3><p class="taste">Peach, jasmine, wildflower honey</p></div></li>
  </ul></section>
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
.demo-pal { width: 340px; max-width: 100%; padding: var(--space-3); background: var(--color-surface-raised); border-radius: var(--radius-lg); box-shadow: var(--elevation-modal); }
`,
  body: `<main class="sheet">
  <header><h1>Tally, state sheet</h1><p>Every control on the overview in every state it can be in, drawn by the page’s own CSS. Hover is an 8 percent layer of the text color, pressed is 10 percent and scales to 0.97, filled buttons step to their active color.</p></header>
  <section class="group" aria-labelledby="d1"><h2 id="d1">Buttons</h2><div class="row">
    <div class="cell"><span>Primary rest</span><button class="btn btn-primary" type="button">Share report</button></div>
    <div class="cell"><span>Hover</span><button class="btn btn-primary is-hover" type="button">Share report</button></div>
    <div class="cell"><span>Pressed</span><button class="btn btn-primary is-active" type="button">Share report</button></div>
    <div class="cell"><span>Focus</span><button class="btn btn-primary is-focus" type="button">Share report</button></div>
    <div class="cell"><span>Secondary rest</span><button class="btn" type="button">Retry</button></div>
    <div class="cell"><span>Hover</span><button class="btn is-hover" type="button">Retry</button></div>
    <div class="cell"><span>Pressed</span><button class="btn is-active" type="button">Retry</button></div>
    <div class="cell"><span>Focus</span><button class="btn is-focus" type="button">Retry</button></div>
  </div></section>
  <section class="group" aria-labelledby="d2"><h2 id="d2">Filter chips and icon buttons</h2><div class="row">
    <div class="cell"><span>Applied</span><button class="chip active" type="button">Compared to: <b>previous period</b></button></div>
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
    <div class="cell"><span>Ready, with sparkline</span><dl class="demo-kpi"><div class="kpi"><dt>Conversion</dt><dd><span class="value">3.8<span class="u">%</span></span><svg class="spark" viewBox="0 0 96 32" preserveAspectRatio="none" role="img" aria-label="12-week trend: up from 3.0% to 3.8%"><polyline points="4,28 12,25 20,25 28,22 36,22 44,19 52,16 60,19 68,13 76,10 84,22 92,4" vector-effect="non-scaling-stroke"/><circle cx="92" cy="4" r="2.5"/></svg><span class="delta good">${up}+0.6 pts <span>vs last week</span></span></dd></div></dl></div>
    <div class="cell"><span>No data yet</span><dl class="demo-kpi"><div class="kpi"><dt>Conversion</dt><dd><span class="value" aria-hidden="true">&ndash;</span><span class="restricted">No data yet</span></dd></div></dl></div>
    <div class="cell"><span>Viewer role</span><dl class="demo-kpi"><div class="kpi"><dt>Revenue</dt><dd><span class="value" aria-hidden="true">{{i:lock:i-lock}}</span><span class="restricted">Visible to Finance admins. <a href="#">Ask Priya Shah</a></span></dd></div></dl></div>
  </div></section>
  <section class="group" aria-labelledby="d7"><h2 id="d7">Menus and command palette</h2><div class="row">
    <div class="cell"><span>Row menu, second item focused</span><div class="menu demo-menu" role="menu" aria-label="Page actions demo"><button role="menuitem" type="button" tabindex="-1">Open in Events</button><button role="menuitem" type="button" tabindex="-1" class="is-focus" style="background:var(--state-hover);outline-offset:-2px">Copy page URL</button><button role="menuitem" type="button" tabindex="-1">Hide from report</button></div></div>
    <div class="cell"><span>Palette option, active</span><div class="demo-pal" role="listbox" aria-label="Commands demo"><div class="pal-opt" role="option" aria-selected="true">Share report</div><div class="pal-opt" role="option" aria-selected="false">Events<span class="kbds" aria-hidden="true"><kbd>G</kbd><kbd>E</kbd></span></div></div></div>
  </div></section>
</main>`,
};

export const sheets = { coffee, dashboard };
export { SHEET_CSS, check, alertIcon };
