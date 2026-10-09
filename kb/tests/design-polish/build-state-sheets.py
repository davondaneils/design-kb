import re, sys
root = sys.argv[1]
def style_of(p):
    s = open(p).read()
    return re.search(r'<style>(.*?)</style>', s, re.S).group(1)

SHEET_CSS = """
/* State sheet: every control in every state, side by side (design-polish 01, signature move 1).
   .is-hover / .is-active / .is-focus mirror the real :hover / :active / :focus-visible rules so they can be rendered. */
.sheet { grid-template-columns: minmax(0, 1fr); max-width: 1200px; margin: 0 auto; padding: var(--space-8) var(--space-5); display: grid; gap: var(--space-8); }
@media (min-width: 768px) { .sheet { padding: var(--space-8) var(--space-7); } }
.sheet > header h1 { font-size: var(--text-xl); line-height: 1.25; }
.sheet > header p { color: var(--color-text-muted); margin-top: var(--space-3); max-width: 32em; }
.group h2 { font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; color: var(--color-text-muted); margin-bottom: var(--space-5); }
.row { display: flex; flex-wrap: wrap; gap: var(--space-6); align-items: flex-start; }
.cell { display: grid; gap: var(--space-3); justify-items: start; }
.cell > span { font-size: var(--text-xs); color: var(--color-text-muted); }
.spinner { width: 16px; height: 16px; border-radius: var(--radius-full); border: 2px solid currentColor; border-right-color: transparent; }
@media (prefers-reduced-motion: no-preference) { .spinner { animation: spin 700ms linear infinite; } }
@keyframes spin { to { transform: rotate(360deg); } }
.is-loading { color: transparent !important; }
.is-loading > .label { opacity: 0; } /* not visibility: hidden, which drops the accessible name (caught by axe button-name) */
.is-loading > .spinner { position: absolute; left: 50%; top: 50%; margin: calc(var(--space-3) * -1) 0 0 calc(var(--space-3) * -1); }
.skel { display: block; border-radius: var(--radius-sm); background: var(--color-surface-sunken, var(--color-surface-hover)); }
.is-focus { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
.reason { font-size: var(--text-xs); color: var(--color-text-muted); max-width: 20em; }
"""

coffee_css = style_of(f'{root}/coffee-after.html') + SHEET_CSS + """
.btn-primary.is-hover { background: var(--color-primary-hover); box-shadow: var(--highlight), var(--shadow-2); }
.btn-primary.is-active { background: var(--color-primary-active); box-shadow: var(--highlight); transform: scale(0.97); }
.btn-secondary.is-hover { background: var(--state-hover); }
.btn-secondary.is-active { background: var(--state-pressed); transform: scale(0.97); }
.btn[aria-disabled=true] { background: var(--color-surface-sunken); color: var(--color-text-muted); border-color: transparent; box-shadow: none; cursor: default; }
.btn-success { color: var(--color-text); border-color: var(--color-border-strong); }
input.is-hover { border-color: var(--color-text-muted); }
.card.is-hover { box-shadow: var(--elevation-card-hover); transform: translateY(-2px); }
.card.is-focus { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
.card-demo { width: 300px; }
.on-band { background: var(--color-feature-bg); padding: var(--space-6); border-radius: var(--radius-lg); color: var(--color-feature-text); }
.on-band .btn-feature { margin-top: 0; width: auto; }
.btn-feature.is-hover { background: var(--color-feature-cta-hover); }
.on-band .is-focus { outline-color: var(--color-feature-text); }
.field { width: 320px; }
.ok { display: flex; gap: var(--space-3); align-items: flex-start; font-size: var(--text-sm); margin-top: var(--space-3); color: var(--color-text); }
"""

check = '<svg class="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style="stroke-width:1.5px"><path d="M3.5 8.5l3 3 6-7"/></svg>'
coffee_body = f"""
<main class="sheet">
  <header><h1 class="serif">Ember and Oak, state sheet</h1><p>Every interactive part of the homepage in every state it can be in. Rendered next to the page so collisions show (hover equal to selected, disabled that looks secondary).</p></header>
  <section class="group" aria-labelledby="g1"><h2 id="g1">Primary button</h2><div class="row">
    <div class="cell"><span>Rest</span><a class="btn btn-primary" href="#">Start a subscription</a></div>
    <div class="cell"><span>Hover</span><a class="btn btn-primary is-hover" href="#">Start a subscription</a></div>
    <div class="cell"><span>Pressed</span><a class="btn btn-primary is-active" href="#">Start a subscription</a></div>
    <div class="cell"><span>Focus</span><a class="btn btn-primary is-focus" href="#">Start a subscription</a></div>
    <div class="cell"><span>Loading (width kept)</span><button class="btn btn-primary is-loading" type="button" aria-busy="true"><span class="label">Start a subscription</span><span class="spinner" style="color:var(--color-on-primary)" aria-hidden="true"></span></button></div>
  </div></section>
  <section class="group" aria-labelledby="g2"><h2 id="g2">Add to cart (secondary)</h2><div class="row">
    <div class="cell"><span>Rest</span><button class="btn btn-secondary btn-sm" type="button">Add to cart</button></div>
    <div class="cell"><span>Hover</span><button class="btn btn-secondary btn-sm is-hover" type="button">Add to cart</button></div>
    <div class="cell"><span>Pressed</span><button class="btn btn-secondary btn-sm is-active" type="button">Add to cart</button></div>
    <div class="cell"><span>Focus</span><button class="btn btn-secondary btn-sm is-focus" type="button">Add to cart</button></div>
    <div class="cell"><span>Loading</span><button class="btn btn-secondary btn-sm is-loading" type="button" aria-busy="true"><span class="label">Add to cart</span><span class="spinner" style="color:var(--color-text)" aria-hidden="true"></span></button></div>
    <div class="cell"><span>Done (1.5 s, then back)</span><button class="btn btn-secondary btn-sm btn-success" type="button">{check}Added</button></div>
    <div class="cell"><span>Unavailable, says why</span><button class="btn btn-sm" type="button" aria-disabled="true" aria-describedby="why">Sold out</button><p class="reason" id="why">Next roast Friday. We will email you.</p></div>
  </div></section>
  <section class="group" aria-labelledby="g3"><h2 id="g3">On the subscription band</h2><div class="row on-band">
    <div class="cell"><span style="color:var(--color-feature-muted)">Rest</span><a class="btn btn-feature" href="#">Start my subscription</a></div>
    <div class="cell"><span style="color:var(--color-feature-muted)">Hover</span><a class="btn btn-feature is-hover" href="#">Start my subscription</a></div>
    <div class="cell"><span style="color:var(--color-feature-muted)">Focus</span><a class="btn btn-feature is-focus" href="#">Start my subscription</a></div>
  </div></section>
  <section class="group" aria-labelledby="g4"><h2 id="g4">Email field</h2><div class="row">
    <div class="cell field"><label for="e1">Rest</label><input id="e1" type="email" placeholder="you@example.com" autocomplete="off"></div>
    <div class="cell field"><label for="e2">Hover</label><input id="e2" class="is-hover" type="email" value="dana@example.com" autocomplete="off"></div>
    <div class="cell field"><label for="e3">Focus</label><input id="e3" class="is-focus" type="email" value="dana@example.com" autocomplete="off"></div>
    <div class="cell field"><label for="e4">Error (no size change)</label><input id="e4" type="email" value="dana@" aria-invalid="true" aria-describedby="e4m" autocomplete="off"><p class="error" id="e4m"><svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><path d="M8 4.5v4M8 11.25v.25"/></svg>Add the rest of your email.</p></div>
    <div class="cell field"><label for="e5">Success</label><input id="e5" type="email" value="dana@example.com" autocomplete="off" aria-describedby="e5m"><p class="ok" id="e5m" role="status">{check}You are in. First letter arrives Thursday.</p></div>
  </div></section>
  <section class="group" aria-labelledby="g5"><h2 id="g5">Product card</h2><ul class="row" style="list-style:none">
    <li class="cell"><span>Rest</span><div class="card card-demo"><div class="thumb" aria-hidden="true"><div class="floor"></div><div class="mini" style="--bag: var(--color-brand)"><i></i></div></div><div class="card-body"><h3 class="serif">Ethiopia Guji</h3><p class="origin">Hambela Wamena, washed</p></div></div></li>
    <li class="cell"><span>Hover (pointer only)</span><div class="card card-demo is-hover"><div class="thumb" aria-hidden="true"><div class="floor"></div><div class="mini" style="--bag: var(--color-brand)"><i></i></div></div><div class="card-body"><h3 class="serif">Ethiopia Guji</h3><p class="origin">Hambela Wamena, washed</p></div></div></li>
    <li class="cell"><span>Focus (ring on the card)</span><div class="card card-demo is-focus"><div class="thumb" aria-hidden="true"><div class="floor"></div><div class="mini" style="--bag: var(--color-brand)"><i></i></div></div><div class="card-body"><h3 class="serif" style="text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px">Ethiopia Guji</h3><p class="origin">Hambela Wamena, washed</p></div></div></li>
  </ul></section>
</main>
"""

dash_css = style_of(f'{root}/dashboard-after.html') + SHEET_CSS + """
.btn.is-hover { background: var(--color-surface-hover); }
.btn.is-active { background: color-mix(in oklch, var(--color-surface-hover), var(--color-text) 9%); box-shadow: none; transform: scale(0.97); }
.btn-primary.is-hover { background: var(--color-primary-hover); }
.btn-primary.is-active { background: var(--color-primary-active); box-shadow: var(--highlight); }
.btn[aria-disabled=true] { background: var(--color-surface-hover); color: var(--color-text-muted); border-color: transparent; box-shadow: none; cursor: default; }
.nav a.is-hover { background: var(--state-hover); color: var(--color-text); }
.nav a.is-focus { outline-offset: -2px; }
.navdemo { width: 220px; }
.search.is-hover { border-color: var(--color-text-muted); }
.search.is-focus { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
.state-panel { width: 100%; }
.state-body { padding: var(--space-8) var(--space-5); display: grid; justify-items: center; text-align: center; gap: var(--space-3); }
.state-body h3 { font-size: var(--text-base); font-weight: 600; }
.state-body p { color: var(--color-text-muted); max-width: 32em; }
.state-body .actions { display: flex; flex-wrap: wrap; gap: var(--space-3); justify-content: center; margin-top: var(--space-3); }
.state-body .glyph { width: 40px; height: 40px; border-radius: var(--radius-full); display: grid; place-items: center; background: var(--color-surface-hover); color: var(--color-text-muted); }
.state-body .glyph.err { background: var(--color-danger-subtle); color: var(--color-danger-mark); }
.skel-row td { padding-top: var(--space-5); padding-bottom: var(--space-5); }
.kpis.loading .skel { height: 12px; }
.kpis.loading .skel.big { height: 32px; margin-top: var(--space-3); width: 60%; }
.kpis.loading .skel.small { height: 12px; margin-top: var(--space-3); width: 45%; }
.retry-meta { font-size: var(--text-xs); color: var(--color-text-muted); }
"""

dash_body = """
<main class="sheet">
  <header><h1>Tally overview, state sheet</h1><p>Every control and every data state of the overview screen. Loading mirrors the final layout; empty and error sit in the same panel frame as the filled view.</p></header>
  <section class="group" aria-labelledby="g1"><h2 id="g1">Buttons</h2><div class="row">
    <div class="cell"><span>Rest</span><button class="btn btn-primary" type="button">Share report</button></div>
    <div class="cell"><span>Hover</span><button class="btn btn-primary is-hover" type="button">Share report</button></div>
    <div class="cell"><span>Pressed</span><button class="btn btn-primary is-active" type="button">Share report</button></div>
    <div class="cell"><span>Focus</span><button class="btn btn-primary is-focus" type="button">Share report</button></div>
    <div class="cell"><span>Loading</span><button class="btn btn-primary is-loading" type="button" aria-busy="true" style="position:relative"><span class="label">Share report</span><span class="spinner" style="color:var(--color-on-primary)" aria-hidden="true"></span></button></div>
    <div class="cell"><span>Unavailable, says why</span><button class="btn" type="button" aria-disabled="true" aria-describedby="why">Export CSV</button><p class="reason" id="why">Exports are on the Team plan.</p></div>
  </div><div class="row" style="margin-top:var(--space-6)">
    <div class="cell"><span>Secondary rest</span><button class="btn" type="button">Jul 21 to Oct 12</button></div>
    <div class="cell"><span>Hover</span><button class="btn is-hover" type="button">Jul 21 to Oct 12</button></div>
    <div class="cell"><span>Pressed</span><button class="btn is-active" type="button">Jul 21 to Oct 12</button></div>
    <div class="cell"><span>Focus</span><button class="btn is-focus" type="button">Jul 21 to Oct 12</button></div>
  </div></section>
  <section class="group" aria-labelledby="g2"><h2 id="g2">Navigation item and search</h2><div class="row">
    <nav class="nav cell navdemo" aria-label="Demo"><span>Rest, hover, selected, focus</span><ul style="width:100%">
      <li><a href="#"><svg class="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 13l4-5 3 3 5-7"/></svg>Events</a></li>
      <li><a class="is-hover" href="#"><svg class="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3h12l-4 5v5l-4-2V8z"/></svg>Funnels</a></li>
      <li><a href="#" aria-current="page"><svg class="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z"/></svg>Overview</a></li>
      <li><a class="is-focus" href="#"><svg class="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5" r="3"/><path d="M2 14c1-3 3-4 6-4s5 1 6 4"/></svg>Users</a></li>
    </ul></nav>
    <div class="cell"><span>Search rest</span><label class="search" style="width:280px"><svg class="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/></svg><input type="search" placeholder="Search pages and events" aria-label="Search, rest"><kbd>/</kbd></label></div>
    <div class="cell"><span>Search hover</span><label class="search is-hover" style="width:280px"><svg class="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/></svg><input type="search" placeholder="Search pages and events" aria-label="Search, hover"><kbd>/</kbd></label></div>
    <div class="cell"><span>Search focus</span><label class="search is-focus" style="width:280px"><svg class="icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/></svg><input type="search" value="/pricing" aria-label="Search, focus" tabindex="-1"><kbd>/</kbd></label></div>
  </div></section>
  <section class="group" aria-labelledby="g3"><h2 id="g3">KPI row, loading (after 300 ms; same box sizes as the filled row)</h2>
    <section class="panel" aria-label="Key metrics, loading" aria-busy="true"><dl class="kpis loading">
      <div class="kpi"><dt>Weekly active users</dt><dd><span class="skel big"></span><span class="skel small"></span></dd></div>
      <div class="kpi"><dt>Conversion</dt><dd><span class="skel big"></span><span class="skel small"></span></dd></div>
      <div class="kpi"><dt>Revenue</dt><dd><span class="skel big"></span><span class="skel small"></span></dd></div>
      <div class="kpi"><dt>Churn</dt><dd><span class="skel big"></span><span class="skel small"></span></dd></div>
    </dl></section>
  </section>
  <section class="group" aria-labelledby="g4"><h2 id="g4">Top pages, empty (a filter matched nothing)</h2>
    <section class="panel state-panel" aria-labelledby="empty-title"><div class="panel-head"><h3 id="empty-title" style="font-size:var(--text-sm);font-weight:600">Top pages</h3><a href="#">All pages</a></div>
      <div class="state-body"><span class="glyph" aria-hidden="true"><svg class="icon" width="16" height="16" viewBox="0 0 16 16"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3"/></svg></span>
        <h3>No pages match "/careers" from Jul 21 to Oct 12</h3>
        <p>The path may be new, or it may use a different prefix. Try the whole site or a longer range.</p>
        <div class="actions"><button class="btn" type="button">Clear filter</button><button class="btn" type="button">Search all dates</button></div></div>
    </section>
  </section>
  <section class="group" aria-labelledby="g5"><h2 id="g5">Chart, error with retry</h2>
    <section class="panel state-panel" aria-labelledby="err-title"><div class="panel-head"><h3 id="err-title" style="font-size:var(--text-sm);font-weight:600">Weekly active users, last 12 weeks</h3></div>
      <div class="state-body" role="alert"><span class="glyph err" aria-hidden="true"><svg class="icon" width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5"/><path d="M8 4.5v4M8 11.25v.25"/></svg></span>
        <h3>Error: the chart did not load</h3>
        <p>The events service timed out after 10 seconds. Your data is safe; this is a display problem.</p>
        <div class="actions"><button class="btn btn-primary" type="button">Try again</button></div>
        <p class="retry-meta">Last loaded 14:02. Status: events API degraded.</p></div>
    </section>
  </section>
  <section class="group" aria-labelledby="g6"><h2 id="g6">Top pages, loading rows</h2>
    <section class="panel panel-table" aria-label="Top pages, loading" aria-busy="true"><div class="table-wrap" tabindex="0" role="region" aria-label="Top pages table, loading"><table><thead><tr><th scope="col">Page</th><th scope="col" class="num">Views</th><th scope="col" class="num">Avg. time</th><th scope="col" class="num">Share of views</th></tr></thead><tbody>
      <tr class="skel-row"><td><span class="skel" style="width:120px;height:12px"></span></td><td class="num"><span class="skel" style="width:56px;height:12px;margin-left:auto"></span></td><td class="num"><span class="skel" style="width:48px;height:12px;margin-left:auto"></span></td><td class="num"><span class="skel" style="width:128px;height:8px;margin-left:auto"></span></td></tr>
      <tr class="skel-row"><td><span class="skel" style="width:64px;height:12px"></span></td><td class="num"><span class="skel" style="width:56px;height:12px;margin-left:auto"></span></td><td class="num"><span class="skel" style="width:48px;height:12px;margin-left:auto"></span></td><td class="num"><span class="skel" style="width:128px;height:8px;margin-left:auto"></span></td></tr>
      <tr class="skel-row"><td><span class="skel" style="width:96px;height:12px"></span></td><td class="num"><span class="skel" style="width:56px;height:12px;margin-left:auto"></span></td><td class="num"><span class="skel" style="width:48px;height:12px;margin-left:auto"></span></td><td class="num"><span class="skel" style="width:128px;height:8px;margin-left:auto"></span></td></tr>
    </tbody></table></div></section>
  </section>
</main>
"""

def page(title, css, body):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>{title}</title>
<style>{css}</style>
</head>
<body>{body}</body>
</html>
"""
open(f'{root}/coffee-states.html', 'w').write(page('Ember and Oak, state sheet', coffee_css, coffee_body))
open(f'{root}/dashboard-states.html', 'w').write(page('Tally overview, state sheet', dash_css, dash_body))
print('ok')
