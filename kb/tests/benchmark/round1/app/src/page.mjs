// Markup for run-review.html. Icons are {{i:name}} placeholders expanded by build.mjs.
// States: html[data-state] = ready | empty | error | loading, set from ?state= by the head script before first paint;
// elements carry data-show="<states>" and app.css hides the rest.
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]+/g, '-');
const nb = (s) => s.replace(/ /g, ' ');
const STATUS = {
  ready: { rank: 3, html: '<span class="status status-ok">{{i:check}}Ready</span>' },
  bank: { rank: 0, html: '<span class="status status-warn">{{i:warn}}Missing bank details</span>' },
  rate: { rank: 1, html: '<span class="status status-warn">{{i:warn}}Rate alert</span>' },
  hire: { rank: 2, html: '<span class="status status-warn">{{i:warn}}Partial month</span>' },
};

export function navList(current = 'runs') {
  const item = (id, label, icon) => `<li><a href="#${id}"${id === current ? ' aria-current="page"' : ''}>{{i:${icon}}}<span class="label">${label}</span></a></li>`;
  return `<ul class="nav-group">
        ${item('home', 'Home', 'home')}
        ${item('runs', 'Payroll runs', 'runs')}
        ${item('people', 'People', 'people')}
        ${item('payments', 'Payments', 'payments')}
        ${item('funding', 'Funding', 'bank')}
        ${item('reports', 'Reports', 'reports')}
      </ul>
      <p class="nav-head" aria-hidden="true">Workspace</p>
      <ul class="nav-group">
        ${item('settings', 'Settings', 'settings')}
        ${item('help', 'Help', 'help')}
      </ul>`;
}

export function renderPage(c, a) {
  const { run, cur, people, money, usd } = c;
  const peopleRows = [...people]
    .sort((x, y) => STATUS[x.status].rank - STATUS[y.status].rank || x.name.localeCompare(y.name))
    .map((p) => `
          <tr role="row" class="${p.status === 'ready' ? '' : 'is-attention'}" data-name="${p.name}" data-country="${p.country}" data-cur="${p.cur}" data-rank="${STATUS[p.status].rank}" data-attention="${p.status !== 'ready'}">
            <th role="rowheader" scope="row" class="person"><a href="#p-${slug(p.name)}">${p.name}</a><span class="role hide-sm">${p.role}<span class="only-md"> · ${p.country} · ${p.type}</span></span></th>
            <td role="cell" class="hide-sm hide-md">${p.country}</td>
            <td role="cell" class="hide-sm hide-md">${p.type}</td>
            <td role="cell" class="hide-sm cur-code">${p.cur}</td>
            <td role="cell" class="n num"><span class="only-sm muted">${p.cur}&nbsp;</span>${money(p.amount)}</td>
            <td role="cell" class="hide-sm">${STATUS[p.status].html}</td>
            <td role="cell" class="c2 only-sm">${p.role} · ${p.country} · ${p.type}${p.status === 'ready' ? '' : '<br>' + STATUS[p.status].html}</td>
          </tr>`).join('');

  const curRows = cur.map((x) => {
    const rate = x.code === 'USD' ? '<span class="dash" aria-hidden="true">–</span><span class="sr-only">No conversion</span>'
      : x.code === 'BRL' ? `<span class="flag-glyph" data-show="ready" data-explained-by="#alert-rate">{{i:12-warn}}<span class="num">${x.rate.toFixed(4)}</span><span class="sr-only">, above your rate alert</span></span><span data-show="error">${x.rate.toFixed(4)}</span>`
      : x.rate.toFixed(4);
    return `
          <tr role="row">
            <th role="rowheader" scope="row"><span class="cur-code">${x.code}</span><span class="cur-name hide-sm hide-md">${x.name}</span></th>
            <td role="cell" class="n hide-sm people-cell" data-num>${x.count}</td>
            <td role="cell" class="n hide-sm num">${money(x.local)}</td>
            <td role="cell" class="n hide-sm num">${rate}</td>
            <td role="cell" class="n num usd-cell" id="usd-${x.code}" data-num data-value="${x.usd}">${usd(x.usd)}</td>
            <td role="cell" class="n hide-sm"><span class="share"><span class="num share-cell" data-num>${x.share.toFixed(1)}%</span><span class="track" aria-hidden="true"><span class="fill" data-bar="${x.share}" data-bar-max="100" style="inline-size:${x.share}%"></span></span></span></td>
            <td role="cell" class="c2 only-sm">${x.code === 'USD' ? `${money(x.local)} USD, no conversion` : `${money(x.local)} ${x.code} at ${x.rate.toFixed(4)} per USD`} · ${x.count} ${x.count === 1 ? 'person' : 'people'} · ${x.share.toFixed(1)}%</td>
          </tr>`;
  }).join('');

  const skRows = (n) => Array.from({ length: n }, () => '<span class="sk-row"><span class="sk sk-line" style="inline-size:28%"></span><span class="sk sk-line" style="inline-size:18%;margin-inline-start:auto"></span></span>').join('');

  return `<!doctype html>
<html lang="en-US" data-state="ready">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>October 2026 payroll run · Ferry</title>
<!-- App screen behind login. Production: auth redirect first; X-Robots-Tag: noindex, nofollow on every app response;
     no robots.txt Disallow for /app (it would hide the noindex); no JSON-LD and no social tags (design-search 07). -->
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${a.favicon}" type="image/svg+xml">
${a.faviconPng ? `<link rel="icon" href="${a.faviconPng}" type="image/png" sizes="64x64">` : ''}
<script>
  // Review states by URL (design-product-ui move 17). Set before first paint: the state changes layout.
  (function () {
    var q = new URLSearchParams(location.search), s = q.get('state'), h = document.documentElement;
    h.dataset.state = ['empty', 'error', 'loading'].indexOf(s) > -1 ? s : 'ready';
    if (h.dataset.state === 'empty') h.dataset.data = 'none';
  })();
</script>
<style>
${a.fontCss}
${a.css}
</style>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="app">
  <header class="topbar">
    <button class="btn btn-quiet icon-btn" type="button" id="menu-open" aria-label="Open navigation" aria-haspopup="dialog" aria-controls="drawer">{{i:menu}}</button>
    <span class="logo-lockup" style="display:flex;align-items:center;gap:var(--space-3)">${mark()}${a.word}</span>
    <span class="tag" style="margin-inline-start:auto">Northwind Labs · Sample</span>
  </header>

  <nav class="sidebar" aria-label="Main">
    <button class="ws" type="button">
      ${mark()}
      <span class="ws-text"><span class="ws-name">Northwind Labs</span><span class="ws-sub">Sample workspace</span></span><span class="sr-only">, switch workspace</span>
      {{i:chevrons chev}}
    </button>
    <div class="nav">
      ${navList()}
    </div>
    <div class="sidebar-foot">
      <p class="sample-note">Sample workspace. Names, amounts and rates are not real.</p>
    </div>
  </nav>

  <main id="main" tabindex="-1">
    <div class="page">
      <header class="page-head">
        <nav class="crumbs" aria-label="Breadcrumb">
          <ol><li><a href="#runs">Payroll runs</a>{{i:12-sep}}</li><li aria-current="page">October 2026</li></ol>
        </nav>
        <div class="head-row">
          <div class="title-group">
            <h1>October 2026 payroll</h1>
            <span class="badge" data-show="ready loading"><span class="dot" aria-hidden="true"></span>Draft</span>
            <span class="badge" data-show="empty">Not drafted</span>
            <span class="badge badge-danger" data-show="error">{{i:12-warn}}Funding failed</span>
            <span class="badge" id="badge-approved" hidden><span class="dot" aria-hidden="true"></span>Approved</span>
          </div>
          <div class="actions" id="actions">
            <button class="btn btn-primary" type="button" id="approve" data-show="ready" aria-haspopup="dialog"><span class="btn-label">Approve run</span></button>
            <span class="sk" data-show="loading" style="inline-size:112px;block-size:32px;border-radius:var(--radius-md)" aria-hidden="true"></span>
            <button class="btn btn-secondary" type="button" data-show="error">Use another account</button>
            <button class="btn btn-primary" type="button" id="retry" data-show="error">{{i:retry}}<span class="btn-label">Retry funding</span><span class="spinner" aria-hidden="true"></span></button>
            <button class="btn btn-primary" type="button" data-show="empty">Draft October run</button>
          </div>
        </div>
        <p class="meta-line">
          <span data-show="ready loading">{{i:clock}}Rates as of ${nb('9:41 am')} ET, ${nb('Tue, Oct 27')}, estimates until you approve</span>
          <span data-show="error">{{i:check}}Approved by Dana Whitfield at ${nb('10:52 am')} ET, ${nb('Wed, Oct 28')}</span>
          <span data-show="empty">{{i:clock}}Pays ${nb('Fri, Oct 30, 2026')}</span>
          <span data-show="ready loading error">{{i:bank}}Paid from ${nb(run.account)}</span>
        </p>
      </header>

      <div class="done-note" id="done-note" role="status" hidden>{{i:lock}}<span>Approved. Rates are locked for 30 minutes while Ferry debits ${nb(run.account)}.</span></div>

      <!-- ===== ready ===== -->
      <p class="answer" data-show="ready">Up <strong><span data-num id="d-answer" data-derived-from="same #d-total">${usd(c.delta)}</span></strong> from September. <a href="#alert-hire">${c.hirePerson.name}’s first, partial month</a> adds <span data-num id="d-hire">${usd(c.hireUsd)}</span> and exchange rates take off <span data-num id="d-fx" data-value="${c.fx}">${usd(Math.abs(c.fx))}</span>. Three people need a look before you approve.</p>
      <p class="answer" data-show="error">Nobody has been paid. The run is approved but not funded, and the bank rejected the debit.</p>
      <p class="answer" data-show="empty">There is no October run yet. Draft it to see what this month costs.</p>
      <p class="answer" data-show="loading"><span class="sk sk-line" style="inline-size:min(100%, 52ch)"></span><span class="sk sk-line" style="inline-size:min(70%, 36ch)"></span></p>

      <dl class="kpis" aria-label="Run summary">
        <div class="kpi">
          <dt>Total to fund</dt>
          <dd class="kpi-value" data-show="ready error"><span id="kpi-total" data-num data-derived-from="same #fx-total">${usd(c.total)}</span></dd>
          <dd class="kpi-foot" data-show="ready">
            <span class="up">{{i:12-up}}<span id="d-total" data-num data-derived-from="diff #kpi-total #sep-total" data-sum-of="#d-hire, #d-fx">+${usd(c.delta)}</span></span>
            <span>vs September, <span id="sep-total" data-num>${usd(c.sepTotal)}</span></span>
          </dd>
          <dd class="kpi-foot" data-show="error"><span class="caveat" data-explained-by="#alert-funding">{{i:12-warn}}Rate lock ended; new rates on retry</span></dd>
          <dd class="kpi-value" data-show="empty"><span class="dash" aria-hidden="true">–</span><span class="sr-only">No value</span></dd>
          <dd class="kpi-foot" data-show="empty">Appears when the run is drafted</dd>
          <dd class="kpi-value" data-show="loading" aria-hidden="true"><span class="sk sk-value" style="inline-size:8ch"></span></dd>
          <dd class="kpi-foot" data-show="loading" aria-hidden="true"><span class="sk sk-line" style="inline-size:60%"></span></dd>
        </div>
        <div class="kpi">
          <dt>People paid</dt>
          <dd class="kpi-value" data-show="ready error"><span id="kpi-people" data-num data-derived-from="same #people-total">${c.count}</span></dd>
          <dd class="kpi-foot" data-show="ready error">${c.sepCount} in September, ${c.count - c.sepCount} new hire</dd>
          <dd class="kpi-value" data-show="empty"><span class="dash" aria-hidden="true">–</span><span class="sr-only">No value</span></dd>
          <dd class="kpi-value" data-show="loading" aria-hidden="true"><span class="sk sk-value" style="inline-size:3ch"></span></dd>
          <dd class="kpi-foot" data-show="loading" aria-hidden="true"><span class="sk sk-line" style="inline-size:70%"></span></dd>
        </div>
        <div class="kpi">
          <dt>Currencies</dt>
          <dd class="kpi-value" data-show="ready error">${cur.length}</dd>
          <dd class="kpi-foot" data-show="ready error">USD and ${c.converted} converted</dd>
          <dd class="kpi-value" data-show="empty"><span class="dash" aria-hidden="true">–</span><span class="sr-only">No value</span></dd>
          <dd class="kpi-value" data-show="loading" aria-hidden="true"><span class="sk sk-value" style="inline-size:3ch"></span></dd>
          <dd class="kpi-foot" data-show="loading" aria-hidden="true"><span class="sk sk-line" style="inline-size:70%"></span></dd>
        </div>
        <div class="kpi">
          <dt>Pay date</dt>
          <dd class="kpi-value"><time datetime="2026-10-30">${nb('Fri, Oct 30')}</time></dd>
          <dd class="kpi-foot" data-show="ready loading empty">Approve by ${nb('Wed, Oct 28')}, ${nb('5 pm')} ET</dd>
          <dd class="kpi-foot" data-show="error">Fund by ${nb('5 pm ET')}, ${nb('Wed, Oct 28')}</dd>
        </div>
      </dl>

      <section class="empty" data-show="empty" aria-labelledby="empty-title">
        {{i:runs i-lg}}
        <h2 id="empty-title">No October run yet</h2>
        <p>Ferry drafts the run from your people list and each person’s pay schedule. You check every amount and rate before anything is paid, and nothing moves until you approve.</p>
        <a class="btn btn-secondary" href="#runs">See past runs</a>
      </section>

      <div class="row" data-show="ready error loading">
        <section class="panel" aria-labelledby="att-title" data-show="ready">
          <div class="panel-head"><h2 id="att-title">Needs attention</h2><span class="count num">3 of ${c.count} people</span></div>
          <ul class="alerts">
            <li class="alert-row" id="alert-bank">
              {{i:bank}}
              <div class="alert-body">
                <p class="alert-title"><span class="kind">Missing bank details:</span> ${c.bankPerson.name}</p>
                <p class="alert-detail">Her EUR&nbsp;${money(c.bankPerson.amount)} is funded with the run and held in your Ferry balance until she adds them.</p>
              </div>
              <button class="btn btn-secondary alert-act" type="button">Send reminder</button>
            </li>
            <li class="alert-row" id="alert-rate">
              {{i:trend}}
              <div class="alert-body">
                <p class="alert-title"><span class="kind">Rate alert:</span> BRL is ${c.brl.vsAvg.toFixed(1)}% above its <span class="nowrap">30-day</span> average</p>
                <p class="alert-detail">${c.brlPerson.name}’s BRL&nbsp;${money(c.brlPerson.amount)} costs <span data-num data-derived-from="same #usd-BRL">${usd(c.brl.usd)}</span> at ${c.brl.rate.toFixed(4)} per USD, against ${usd(c.brlAtAvg)} at the average of ${c.brl.avg30.toFixed(4)}. Your alert is ${run.alertPct.toFixed(1)}%.</p>
              </div>
              <button class="btn btn-secondary alert-act" type="button">Review rate</button>
            </li>
            <li class="alert-row" id="alert-hire">
              {{i:hire}}
              <div class="alert-body">
                <p class="alert-title"><span class="kind">Partial month:</span> ${c.hirePerson.name} started ${nb(c.hire.start)}</p>
                <p class="alert-detail">Prorated to ${c.hire.days} of ${c.hire.of} working days: GBP&nbsp;${money(c.hirePerson.amount)} of her GBP&nbsp;${money(c.hire.monthly)} monthly pay.</p>
              </div>
              <button class="btn btn-secondary alert-act" type="button">Check proration</button>
            </li>
          </ul>
        </section>

        <section class="banner" id="alert-funding" role="alert" data-show="error" aria-labelledby="fail-title">
          {{i:error}}
          <div class="alert-body">
            <h2 id="fail-title">Error: Chase rejected the ${usd(c.total)} debit</h2>
            <p>Return code R01, insufficient funds, at ${nb('11:06 am')} ET. Your rate lock ended at ${nb('11:22 am')} ET, so a retry locks new rates for 30 minutes and the total can change. Add funds to ${nb(run.account)} or use another account, then retry by ${nb('5 pm')} ET.</p>
          </div>
        </section>

        <section class="panel" aria-labelledby="att-sk" data-show="loading" aria-hidden="true">
          <div class="panel-head"><h2 id="att-sk">Needs attention</h2></div>
          <div>${skRows(3)}</div>
        </section>

        <section class="panel" aria-labelledby="how-title">
          <div class="panel-head"><h2 id="how-title">How this run is paid</h2></div>
          <ol class="steps" data-show="ready loading">
            <li class="step"><span class="step-title">You approve</span><span class="step-detail">Rates lock for 30 minutes when you approve.</span></li>
            <li class="step"><span class="step-title">Ferry debits Chase ··4417</span><span class="step-detail">One ACH debit in USD, then one trade per currency.</span></li>
            <li class="step"><span class="step-title">Everyone is paid ${nb('Fri, Oct 30')}</span><span class="step-detail">In their own currency, the same day.</span></li>
          </ol>
          <ol class="steps" data-show="error">
            <li class="step" data-step="done"><span class="step-title">Approved</span><span class="step-detail">Dana Whitfield, ${nb('10:52 am')} ET</span></li>
            <li class="step" data-step="failed"><span class="step-title">Debit rejected</span><span class="step-detail">Chase ··4417, ${nb('11:06 am')} ET</span></li>
            <li class="step"><span class="step-title">Everyone is paid ${nb('Fri, Oct 30')}</span><span class="step-detail">If funding clears by ${nb('5 pm')} ET, ${nb('Wed, Oct 28')}.</span></li>
          </ol>
          <p class="note">{{i:info}}<span>Ferry’s fee is billed on your monthly invoice, not taken from this run.</span></p>
        </section>
      </div>

      <section class="panel" aria-labelledby="cur-title" data-show="ready error">
        <div class="panel-head"><h2 id="cur-title">Funding by currency</h2><span class="aside">Ferry buys each currency in one trade at the rate shown</span></div>
        <div class="table-wrap">
          <table class="collapse" role="table" data-share-base="${cur.length}" aria-labelledby="cur-title">
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader" scope="col">Currency</th>
                <th role="columnheader" scope="col" class="n">People</th>
                <th role="columnheader" scope="col" class="n">Amount</th>
                <th role="columnheader" scope="col" class="n">Rate per USD</th>
                <th role="columnheader" scope="col" class="n">Cost in USD</th>
                <th role="columnheader" scope="col" class="n">Share of cost</th>
              </tr>
            </thead>
            <tbody role="rowgroup">${curRows}
            </tbody>
            <tfoot role="rowgroup">
              <tr role="row">
                <th role="rowheader" scope="row">Total</th>
                <td role="cell" class="n hide-sm num" id="people-total" data-num data-sum-of=".people-cell">${c.count}</td>
                <td role="cell" class="hide-sm"></td>
                <td role="cell" class="hide-sm"></td>
                <td role="cell" class="n num" id="fx-total" data-num data-sum-of=".usd-cell">${usd(c.total)}</td>
                <td role="cell" class="n hide-sm num"><span data-num data-sum-of=".share-cell">100.0%</span></td>
                <td role="cell" class="c2 only-sm">${c.count} people in ${cur.length} currencies</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      <section class="panel" aria-labelledby="people-title" data-show="ready error">
        <div class="panel-head"><h2 id="people-title">People</h2><span class="count num" id="people-count">${c.count}</span></div>
        <div class="toolbar">
          <nav class="seg" aria-label="Filter people">
            <a href="?filter=all" id="f-all" aria-current="true">All <span class="num">${c.count}</span></a>
            <a href="?filter=attention" id="f-att">Needs attention <span class="num">3</span></a>
          </nav>
          <div class="field">
            {{i:search}}
            <label class="sr-only" for="q">Filter people by name or country</label>
            <input id="q" type="search" placeholder="Filter by name or country" autocomplete="off">
          </div>
        </div>
        <div class="table-wrap">
          <table class="collapse people" role="table" id="people-table" aria-labelledby="people-title">
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader" scope="col"><button class="sort" type="button" data-sort="name">Name{{i:12-down}}</button></th>
                <th role="columnheader" scope="col" class="hide-md"><button class="sort" type="button" data-sort="country">Country{{i:12-down}}</button></th>
                <th role="columnheader" scope="col" class="hide-md">Type</th>
                <th role="columnheader" scope="col"><button class="sort" type="button" data-sort="cur">Currency{{i:12-down}}</button></th>
                <th role="columnheader" scope="col" class="n">Pay this run</th>
                <th role="columnheader" scope="col" aria-sort="ascending"><button class="sort" type="button" data-sort="rank">Status{{i:12-down}}</button></th>
              </tr>
            </thead>
            <tbody role="rowgroup" id="people-body">${peopleRows}
            </tbody>
          </table>
          <p class="no-match" id="no-match" hidden>No one matches “<span id="no-match-q"></span>”. <button class="btn btn-quiet" type="button" id="clear-q">Clear filter</button></p>
        </div>
      </section>

      <section class="panel" data-show="loading" aria-hidden="true" aria-labelledby="cur-sk">
        <div class="panel-head"><h2 id="cur-sk">Funding by currency</h2></div>
        <div class="table-wrap">${skRows(7)}</div>
      </section>

      <p class="foot-note">Northwind Labs is a sample workspace. Every name, amount and exchange rate on this screen is sample data.</p>
    </div>
  </main>
</div>

<dialog class="drawer" id="drawer" aria-label="Navigation">
  <div class="drawer-inner">
    <div class="drawer-top">
      <span style="display:flex;align-items:center;gap:var(--space-3)">${mark()}<span class="ws-text"><span class="ws-name">Northwind Labs</span><span class="ws-sub">Sample workspace</span></span></span>
      <button class="btn btn-quiet icon-btn" type="button" id="menu-close" aria-label="Close navigation">{{i:close}}</button>
    </div>
    <nav class="nav" aria-label="Main, menu">
      ${navList()}
    </nav>
  </div>
</dialog>

<dialog class="modal" id="approve-dialog" aria-labelledby="ap-title" aria-describedby="ap-desc">
  <div class="modal-body">
    <h2 id="ap-title">Approve the October 2026 run?</h2>
    <p id="ap-desc">Rates lock for 30 minutes when you approve. Ferry then debits ${nb(run.account)} and pays everyone on ${nb('Fri, Oct 30')}.</p>
    <dl>
      <dt>People</dt><dd class="num">${c.count}</dd>
      <dt>Currencies</dt><dd class="num">${cur.length}</dd>
      <dt>Debit, at current rates</dt><dd class="num">${usd(c.total)}</dd>
    </dl>
    <p>${c.bankPerson.name}’s pay is held in your Ferry balance until she adds bank details.</p>
    <div role="status" class="sr-only" id="dialog-live"></div>
  </div>
  <div class="modal-foot">
    <button class="btn btn-secondary" type="button" id="ap-cancel" autofocus>Keep reviewing</button>
    <button class="btn btn-primary" type="button" id="ap-confirm"><span class="btn-label">Approve run</span><span class="spinner" aria-hidden="true"></span></button>
  </div>
</dialog>

<div role="status" class="sr-only" id="live"></div>

<script>
(function () {
  var h = document.documentElement, $ = function (s) { return document.querySelector(s); };
  var params = new URLSearchParams(location.search), live = $('#live');
  var say = function (t) { live.textContent = ''; setTimeout(function () { live.textContent = t; }, 50); };
  if (h.dataset.state === 'loading') { $('#main').setAttribute('aria-busy', 'true'); say('Loading the October run'); }

  // input modality: dialogs opened from the keyboard do not animate (design-motion 07)
  var via = 'pointer';
  addEventListener('keydown', function () { via = 'key'; }, true);
  addEventListener('pointerdown', function () { via = 'pointer'; }, true);
  function open(d, opener) { d.dataset.via = via; d.showModal(); d._opener = opener; }
  document.querySelectorAll('dialog').forEach(function (d) {
    d.addEventListener('close', function () { if (d._opener) d._opener.focus(); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
  });

  // approve
  var dlg = $('#approve-dialog');
  $('#approve').addEventListener('click', function (e) { open(dlg, e.currentTarget); });
  $('#ap-cancel').addEventListener('click', function () { dlg.close(); });
  $('#ap-confirm').addEventListener('click', function () {
    dlg.close();
    $('#approve').hidden = true; $('#approve').setAttribute('data-show', '');
    document.querySelectorAll('.badge[data-show~="ready"]').forEach(function (b) { b.setAttribute('data-show', 'none'); });
    $('#badge-approved').hidden = false; $('#done-note').hidden = false;
    $('#main').focus();
  });
  if (params.get('open') === 'approve' && h.dataset.state === 'ready') { dlg.dataset.via = 'key'; dlg.showModal(); }

  // phone drawer
  var drawer = $('#drawer');
  $('#menu-open').addEventListener('click', function (e) { open(drawer, e.currentTarget); });
  $('#menu-close').addEventListener('click', function () { drawer.close(); });

  // retry (error state): busy keeps the label's width and name
  $('#retry').addEventListener('click', function (e) { var b = e.currentTarget; b.setAttribute('aria-busy', 'true'); say('Retrying the debit'); });

  // people: filter, search and sort, state in the URL
  var body = $('#people-body'), rows = Array.prototype.slice.call(body.rows), q = $('#q');
  var filter = params.get('filter') === 'attention' ? 'attention' : 'all';
  function apply(announce) {
    var term = q.value.trim().toLowerCase(), shown = 0;
    rows.forEach(function (r) {
      var ok = (filter === 'all' || r.dataset.attention === 'true') &&
        (!term || r.dataset.name.toLowerCase().indexOf(term) > -1 || r.dataset.country.toLowerCase().indexOf(term) > -1);
      r.hidden = !ok; if (ok) shown++;
    });
    $('#f-all').setAttribute('aria-current', filter === 'all' ? 'true' : 'false');
    $('#f-att').setAttribute('aria-current', filter === 'attention' ? 'true' : 'false');
    $('#no-match').hidden = shown > 0; $('#no-match-q').textContent = q.value;
    $('#people-table').hidden = shown === 0;
    if (announce) say('Showing ' + shown + ' of ' + rows.length + ' people');
  }
  [['#f-all', 'all'], ['#f-att', 'attention']].forEach(function (p) {
    $(p[0]).addEventListener('click', function (e) {
      e.preventDefault(); filter = p[1];
      var u = new URL(location.href); if (filter === 'all') u.searchParams.delete('filter'); else u.searchParams.set('filter', filter);
      history.replaceState(null, '', u); apply(true);
    });
  });
  q.addEventListener('input', function () { apply(true); });
  $('#clear-q').addEventListener('click', function () { q.value = ''; apply(true); q.focus(); });
  document.querySelectorAll('.sort').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.dataset.sort, th = btn.parentElement, dir = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
      document.querySelectorAll('#people-table th[aria-sort]').forEach(function (t) { t.removeAttribute('aria-sort'); });
      th.setAttribute('aria-sort', dir);
      rows.sort(function (a, b) {
        var x = a.dataset[key], y = b.dataset[key];
        var r = key === 'rank' ? x - y : x.localeCompare(y);
        return (dir === 'ascending' ? r : -r) || a.dataset.name.localeCompare(b.dataset.name);
      }).forEach(function (r) { body.appendChild(r); });
      say('Sorted by ' + btn.textContent.trim() + ', ' + dir);
    });
  });
  apply(false);
})();
</script>
</body>
</html>
`;
}

export function mark() {
  return '<svg class="logo-mark" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><rect class="field" width="24" height="24" rx="6"/><path class="ink" d="M5.5 16.75h3.25c2.5 0 3.25-9.5 6.5-9.5h3.25"/></svg>';
}
