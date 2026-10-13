// run-review-states.html: every control on the run review in every state, plus the empty, loading, error and
// partial panels (design-director section 4, state sheet; design-polish references/01 and 06).
// Forced states use classes (.is-hover, .is-active, .is-focus) that mirror the real :hover, :active and :focus-visible rules.
import { mark, navList } from './page.mjs';

const forced = `
@layer states {
  .btn-primary.is-hover { background: var(--color-primary-hover); }
  .btn-secondary.is-hover, .btn-quiet.is-hover, .nav a.is-hover, .ws.is-hover, .seg a.is-hover { background: var(--state-hover); }
  .btn-primary.is-active { background: var(--color-primary-active); transform: scale(0.97); }
  .btn-secondary.is-active, .btn-quiet.is-active, .nav a.is-active { background: var(--state-pressed); }
  .is-focus { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
  tr.is-hover { background: var(--state-hover); }
  .sort.is-hover { color: var(--color-text); }
  .ws.is-hover, .nav a.is-hover, .nav a.is-active, tr.is-hover { --color-text-muted: var(--color-text-muted-on-tint); }
}
@layer components {
  .sheet { max-inline-size: 1200px; padding: var(--space-7) var(--space-5) var(--space-9); margin-inline: auto; display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--space-8); background: var(--color-surface); }
  .sheet > header { display: grid; gap: var(--space-3); }
  .sheet > header .brand { display: flex; align-items: center; gap: var(--space-3); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(10rem, 100%), 1fr)); gap: var(--space-5) var(--space-6); }
  .grid.wide { grid-template-columns: repeat(auto-fill, minmax(min(17rem, 100%), 1fr)); }
  .grid > *, .panels > * { min-inline-size: 0; }
  .cell .field, .cell .field.stack { inline-size: 100%; }
  .sort-demo { inline-size: 100%; }
  .rows-demo { inline-size: 100%; }
  .rows-demo :is(th, td) { white-space: normal; }
  .cell { display: grid; justify-items: start; align-content: start; gap: var(--space-3); }
  .cell > .cap { font-size: var(--text-xs); color: var(--color-text-muted); font-weight: var(--weight-medium); }
  .group { display: grid; gap: var(--space-5); }
  .group > h2 { padding-block-end: var(--space-3); border-block-end: 1px solid var(--color-border); }
  .nav-demo { inline-size: min(15rem, 100%); padding: var(--space-3); background: var(--color-bg); border-radius: var(--radius-xl); }
  .panels { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(30rem, 100%), 1fr)); gap: var(--space-6); }
  .panel-demo { display: grid; gap: var(--space-4); align-content: start; padding: var(--space-5); border-radius: var(--radius-card); box-shadow: inset 0 0 0 1px var(--color-border); }
  .field-err { display: flex; align-items: center; gap: var(--space-2); color: var(--color-danger); font-size: var(--text-xs); font-weight: var(--weight-medium); }
  .field-err .i { position: static; flex: none; }
  .field.stack { display: grid; gap: var(--space-2); margin: 0; }
  .field.stack .wrap { position: relative; display: flex; align-items: center; }
}`;

export function renderStates(c, a) {
  const { usd, money } = c;
  const btns = (cls, label, extra = '') => ['rest', 'hover', 'pressed', 'focus', 'disabled', 'loading'].map((st) => {
    const k = { rest: '', hover: ' is-hover', pressed: ' is-active', focus: ' is-focus', disabled: '', loading: '' }[st];
    const attr = st === 'disabled' ? ' aria-disabled="true"' : st === 'loading' ? ' aria-busy="true"' : '';
    return `<div class="cell"><span class="cap">${st[0].toUpperCase() + st.slice(1)}</span><button class="btn ${cls}${k}" type="button"${attr}>${extra}<span class="btn-label">${label}</span><span class="spinner" aria-hidden="true"></span></button>${st === 'disabled' ? '<span class="cap">Shown while the run is still loading</span>' : ''}</div>`;
  }).join('');
  return `<!doctype html>
<html lang="en-US" data-lint-page="state-sheet" data-state="ready">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Run review state sheet · Ferry</title>
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="light dark">
<link rel="icon" href="${a.favicon}" type="image/svg+xml">
<style>
${a.fontCss}
${a.css}
${forced}
</style>
</head>
<body>
<main class="sheet" id="main" style="container: content / inline-size">
  <header>
    <span class="brand">${mark()}${a.word}</span>
    <h1>Run review state sheet</h1>
    <p class="muted answer">Every control on the October 2026 run review in every state, and every panel state. Hover, pressed and focus are forced with classes that copy the real rules. Sample data.</p>
  </header>

  <section class="group" aria-labelledby="g-primary">
    <h2 id="g-primary">Primary button</h2>
    <div class="grid">${btns('btn-primary', 'Approve run')}</div>
  </section>

  <section class="group" aria-labelledby="g-secondary">
    <h2 id="g-secondary">Secondary button</h2>
    <div class="grid">${btns('btn-secondary', 'Send reminder')}</div>
  </section>

  <section class="group" aria-labelledby="g-quiet">
    <h2 id="g-quiet">Quiet button</h2>
    <div class="grid">${btns('btn-quiet', 'Clear filter')}</div>
  </section>

  <section class="group" aria-labelledby="g-nav">
    <h2 id="g-nav">Navigation</h2>
    <div class="grid wide">
      <div class="cell"><span class="cap">Rest, current, hover, pressed, focus</span>
        <div class="nav nav-demo">
          <a href="#home">{{i:home}}<span class="label">Home</span></a>
          <a href="#runs" aria-current="page">{{i:runs}}<span class="label">Payroll runs</span></a>
          <a href="#people" class="is-hover">{{i:people}}<span class="label">People</span></a>
          <a href="#payments" class="is-active">{{i:payments}}<span class="label">Payments</span></a>
          <a href="#funding" class="is-focus">{{i:bank}}<span class="label">Funding</span></a>
        </div>
      </div>
      <div class="cell"><span class="cap">Workspace switcher: rest, hover</span>
        <div class="nav-demo" style="display:grid;gap:var(--space-2)">
          <button class="ws" type="button">${mark()}<span class="ws-text"><span class="ws-name">Northwind Labs</span><span class="ws-sub">Sample workspace</span></span>{{i:chevrons chev}}</button>
          <button class="ws is-hover" type="button">${mark()}<span class="ws-text"><span class="ws-name">Northwind Labs</span><span class="ws-sub">Sample workspace</span></span>{{i:chevrons chev}}</button>
        </div>
      </div>
      <div class="cell"><span class="cap">Breadcrumb: rest, focus</span>
        <nav class="crumbs" aria-label="Breadcrumb example"><ol><li><a href="#runs">Payroll runs</a>{{i:12-sep}}</li><li aria-current="page">October 2026</li></ol></nav>
        <nav class="crumbs" aria-label="Breadcrumb example, focused"><ol><li><a href="#runs" class="is-focus">Payroll runs</a>{{i:12-sep}}</li><li aria-current="page">October 2026</li></ol></nav>
      </div>
    </div>
  </section>

  <section class="group" aria-labelledby="g-filter">
    <h2 id="g-filter">Filters, search and sorting</h2>
    <div class="grid wide">
      <div class="cell"><span class="cap">Segmented filter: current, rest, hover, focus</span>
        <nav class="seg" aria-label="Filter example"><a href="#all" aria-current="true">All <span class="num">${c.count}</span></a><a href="#att">Needs attention <span class="num">3</span></a></nav>
        <nav class="seg" aria-label="Filter example, hover"><a href="#all2" aria-current="true">All <span class="num">${c.count}</span></a><a href="#att2" class="is-hover">Needs attention <span class="num">3</span></a></nav>
        <nav class="seg" aria-label="Filter example, focus"><a href="#all3" aria-current="true">All <span class="num">${c.count}</span></a><a href="#att3" class="is-focus">Needs attention <span class="num">3</span></a></nav>
      </div>
      <div class="cell"><span class="cap">Search: rest, focus, filled</span>
        <div class="field" style="margin:0">{{i:search}}<label class="sr-only" for="s1">Filter people, rest</label><input id="s1" type="search" placeholder="Filter by name or country"></div>
        <div class="field" style="margin:0">{{i:search}}<label class="sr-only" for="s2">Filter people, focused</label><input id="s2" class="is-focus" type="search" placeholder="Filter by name or country"></div>
        <div class="field" style="margin:0">{{i:search}}<label class="sr-only" for="s3">Filter people, filled</label><input id="s3" type="search" value="Mexico"></div>
      </div>
      <div class="cell"><span class="cap">Invalid field (from the reminder form)</span>
        <div class="field stack">
          <label for="s4">Her email</label>
          <span class="wrap"><input id="s4" type="email" value="lucia.fernandez@" aria-invalid="true" aria-describedby="s4-err" style="padding-inline-start:var(--space-3)"></span>
          <span class="field-err" id="s4-err">{{i:12-warn}}Email needs a domain, like name@example.com</span>
        </div>
      </div>
      <div class="cell"><span class="cap">Sort header: rest, hover, sorted, focus</span>
        <table class="sort-demo" aria-label="Sort header example"><thead><tr>
          <th scope="col"><button class="sort" type="button">Name{{i:12-down}}</button></th>
          <th scope="col"><button class="sort is-hover" type="button">Role{{i:12-down}}</button></th>
          <th scope="col" aria-sort="ascending"><button class="sort" type="button">Status{{i:12-down}}</button></th>
          <th scope="col"><button class="sort is-focus" type="button">Country{{i:12-down}}</button></th>
        </tr></thead></table>
      </div>
    </div>
  </section>

  <section class="group" aria-labelledby="g-rows">
    <h2 id="g-rows">Table rows and status</h2>
    <table class="people rows-demo" aria-label="Row states">
      <thead><tr><th scope="col">Name</th><th scope="col" class="n">Pay this run</th><th scope="col">Status</th></tr></thead>
      <tbody>
        <tr><th scope="row" class="person"><a href="#p1">Ananya Iyer</a><span class="role">Row at rest</span></th><td class="n num">${money(310000)}</td><td><span class="status status-ok">{{i:check}}Ready</span></td></tr>
        <tr class="is-hover"><th scope="row" class="person"><a href="#p2">Rohan Mehta</a><span class="role">Row on hover</span></th><td class="n num">${money(265000)}</td><td><span class="status status-ok">{{i:check}}Ready</span></td></tr>
        <tr class="is-attention"><th scope="row" class="person"><a href="#p3" class="is-focus">Lucía Fernández</a><span class="role">Needs attention, link focused</span></th><td class="n num">${money(5250)}</td><td><span class="status status-warn">{{i:warn}}Missing bank details</span></td></tr>
      </tbody>
    </table>
    <div class="grid">
      <div class="cell"><span class="cap">Run badges</span><span class="badge"><span class="dot" aria-hidden="true"></span>Draft</span><span class="badge">Not drafted</span><span class="badge"><span class="dot" aria-hidden="true"></span>Approved</span><span class="badge badge-danger">{{i:12-warn}}Funding failed</span></div>
      <div class="cell"><span class="cap">Caveat on a number</span><span class="caveat">{{i:12-warn}}Rate lock ended; new rates on retry</span></div>
      <div class="cell"><span class="cap">Success</span><div class="done-note">{{i:lock}}<span>Approved. Rates are locked for 30 minutes.</span></div></div>
    </div>
  </section>

  <section class="group" aria-labelledby="g-panels">
    <h2 id="g-panels">Panel states</h2>
    <div class="panels">
      <div class="panel-demo"><span class="cap muted">Empty (no run drafted)</span>
        <div class="empty" style="padding:var(--space-6)">{{i:runs i-lg}}<h3>No October run yet</h3><p>Ferry drafts the run from your people list and each person’s pay schedule.</p><button class="btn btn-primary" type="button">Draft October run</button></div>
      </div>
      <div class="panel-demo" aria-busy="true"><span class="cap muted">Loading (skeleton matches the ready rows)</span>
        <div>${Array.from({ length: 4 }, () => '<span class="sk-row"><span class="sk sk-line" style="inline-size:30%"></span><span class="sk sk-line" style="inline-size:20%;margin-inline-start:auto"></span></span>').join('')}</div>
      </div>
      <div class="panel-demo"><span class="cap muted">Error (bank rejected the debit)</span>
        <div class="banner">{{i:error}}<div class="alert-body"><h3>Error: Chase rejected the ${usd(c.total)} debit</h3><p>Return code R01, insufficient funds. Nobody has been paid.</p></div>
          <div class="actions"><button class="btn btn-secondary" type="button">Use another account</button><button class="btn btn-primary" type="button">{{i:retry}}<span class="btn-label">Retry funding</span><span class="spinner" aria-hidden="true"></span></button></div></div>
      </div>
      <div class="panel-demo"><span class="cap muted">Partial (rates did not load; amounts in local currency still shown)</span>
        <div class="banner" style="background:var(--color-warning-subtle)"><span style="color:var(--color-warning)">{{i:warn}}</span><div class="alert-body"><h3>Rates didn’t load</h3><p>The rate service timed out. Local amounts are complete; USD costs appear when rates return.</p></div>
          <div class="actions"><button class="btn btn-secondary" type="button">{{i:retry}}<span class="btn-label">Retry</span><span class="spinner" aria-hidden="true"></span></button></div></div>
      </div>
      <div class="panel-demo"><span class="cap muted">Needs attention row</span>
        <ul class="alerts"><li class="alert-row">{{i:hire}}<div class="alert-body"><p class="alert-title"><span class="kind">Partial month:</span> Amara Okafor started Mon,&nbsp;Oct&nbsp;19</p><p class="alert-detail">Prorated to 10 of 22 working days.</p></div><button class="btn btn-secondary alert-act" type="button">Check proration</button></li></ul>
      </div>
    </div>
  </section>
</main>
</body>
</html>
`;
}
