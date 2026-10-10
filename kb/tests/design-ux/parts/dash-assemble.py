# Executed by assemble.py with d (dashboard source), P (read part), sub (checked replace), re in scope.
d = sub(d, "   Review hooks are URL only: ?state=loading|empty|partial|viewer,",
        "   design-ux wave 2 adds the first run: ?state=first-run|listening|check-failed|first-data (kb/tests/design-ux.md).\n   Review hooks are URL only: ?state=loading|empty|partial|viewer,")
d = sub(d, "\n@media (prefers-reduced-motion: reduce) { * {", P('dash-firstrun.css') + "\n@media (prefers-reduced-motion: reduce) { * {")

# Sidebar: the guide stays findable after it is hidden
guide = ('        <li class="guide-link"><a href="#setup" data-tip="Setup guide"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">'
         '<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 2a6 6 0 0 1 6 6H8z" fill="currentColor"/></svg>'
         '<span class="label">Setup guide</span><span class="label guide-count" id="guide-count">1 of 4</span></a></li>\n')
d = sub(d, '        <li><a href="#" data-tip="Settings" data-go="s">', guide + '        <li><a href="#" data-tip="Settings" data-go="s">')
d = sub(d, ".nav a kbd { margin-left: auto; visibility: hidden; }",
        ".nav a kbd { margin-left: auto; visibility: hidden; }\n.nav .guide-count { margin-left: auto; font-size: var(--text-xs); color: var(--color-text-muted); font-weight: 500; }")

# Header: freshness words per phase; one primary action per state
d = sub(d, '<span class="fresh-empty">Waiting for first event</span>',
        '<span class="fresh-empty">Waiting for first event</span><span class="fresh-sample">Sample data, nothing tracked yet</span><span class="fresh-first">Counting since 14:06, times in PT</span>')
d = sub(d, '<button class="btn btn-primary install-btn" type="button">Install snippet</button>',
        '<a class="btn btn-primary install-btn" href="#step-install">Install snippet</a>\n      <button class="btn btn-primary invite-btn" type="button">Invite a teammate</button>')

# Guide and the two answer lines go before the KPI panel
d = sub(d, '      <section class="panel" aria-label="Key metrics, last 7 days versus previous 7 days">',
        P('dash-setup.html') + '\n      <section class="panel" aria-label="Key metrics, last 7 days versus previous 7 days">\n'
        '        <p class="sample-bar"><span class="tag" style="display:inline-flex">Sample</span>Demo store numbers. Yours replace them after the first event.</p>')

# First data: metrics that cannot compute yet say when they will
kpis_first = '''        <dl class="kpis first">
          <div class="kpi"><dt>Weekly active users</dt><dd><span class="value">12</span><span class="pending">Week-on-week from Oct 19</span></dd></div>
          <div class="kpi"><dt>Conversion</dt><dd><span class="value" aria-hidden="true">&ndash;</span><span class="pending">Needs a <code>checkout_completed</code> event</span></dd></div>
          <div class="kpi"><dt>Revenue</dt><dd><span class="value" aria-hidden="true">&ndash;</span><span class="pending"><a href="#">Connect Stripe</a> to see revenue</span></dd></div>
          <div class="kpi"><dt>Churn</dt><dd><span class="value" aria-hidden="true">&ndash;</span><span class="pending">Needs 30 days of data, Nov 11</span></dd></div>
        </dl>
'''
d = sub(d, '        <dl class="kpis state empty-st">', kpis_first + '        <dl class="kpis state empty-st">')

# Sample tags in panel heads
d = sub(d, '<div class="panel-head"><h2 id="chart-title">Weekly active users, 12 weeks</h2>',
        '<div class="panel-head"><div class="title"><h2 id="chart-title">Weekly active users, 12 weeks</h2><span class="tag fr-sample">Sample</span></div>')
d = sub(d, '<div class="panel-head"><h2 id="pages-title">Top pages</h2>',
        '<div class="panel-head"><div class="title"><h2 id="pages-title">Top pages</h2><span class="tag fr-sample">Sample</span></div>')

first_chart = '''          <div class="first-chart">
            <svg width="160" height="96" viewBox="0 0 160 96" aria-hidden="true">
              <path class="ill-grid" d="M0 16.5h160M0 40.5h160M0 64.5h160M0 88.5h160"/>
              <path class="ill-line" d="M4 76 C40 72 64 66 96 58 S140 44 156 40"/>
              <circle cx="4" cy="76" r="4" fill="var(--color-chart-current)"/>
            </svg>
            <h3>The line starts tomorrow</h3>
            <p>12 visitors so far today. Each day becomes a point once it ends at midnight PT; the dashed line compares with the previous weeks once you have them.</p>
          </div>
'''
d = sub(d, '          <div class="chart-body state loading" aria-hidden="true">', first_chart + '          <div class="chart-body state loading" aria-hidden="true">')

# Script: phases, guide behavior, first-data rows
d = sub(d, "    root.dataset.state = s;\n", "    root.dataset.state = s;\n    root.dataset.phase = ['first-run', 'listening', 'check-failed'].includes(s) ? 'setup sample' : s === 'first-data' ? 'setup' : '';\n")
d = d.replace("html[data-phase=setup]", "html[data-phase~=setup]").replace("html[data-phase=sample]", "html[data-phase~=sample]")
d = sub(d, "  const maxShare = 34;", "  if (params.get('state') === 'first-data') rows.splice(0, rows.length,\n"
        "    { page: '/', views: 21, time: 41, share: 55 }, { page: '/pricing', views: 9, time: 73, share: 24 },\n"
        "    { page: '/docs/quickstart', views: 5, time: 128, share: 13 }, { page: '/signup', views: 3, time: 52, share: 8 });\n"
        "  const maxShare = Math.max(...rows.map((r) => r.share));")
d = sub(d, '<div class="panel-foot ready ready-table"><span id="pages-sort">Sorted by views, highest first</span><span>1 to 6 of 214</span></div>',
        '<div class="panel-foot ready ready-table"><span id="pages-sort">Sorted by views, highest first</span><span id="pages-range">1 to 6 of 214</span></div>')
guide_js = r"""
  // --- Setup guide (design-ux 05): a real count, copy with a status, hide and find again ---
  const st = params.get('state');
  if (st === 'first-data') {
    const s2 = document.getElementById('step-install'), s3 = document.querySelector('.step.s3');
    s2.classList.remove('current'); s2.classList.add('done');
    s2.querySelector('.mark').innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2.5 6.5l2.5 2.5 4.5-6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
    s2.querySelector('.why').textContent = 'First events arrived at 14:06 from acme.com.';
    s3.classList.add('current');
    document.getElementById('setup-count').textContent = '2 of 4 done';
    document.getElementById('setup-meter').style.width = '50%';
    document.getElementById('guide-count').textContent = '2 of 4';
    document.getElementById('pages-range').textContent = '1 to 4 of 4';
  } else { document.querySelectorAll('.st-done-sr').forEach((e) => e.remove()); }
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', () => {
    const text = document.getElementById(b.dataset.copy).textContent;
    const done = () => { document.getElementById('copy-status').textContent = 'Copied. Paste it, then come back: this page updates by itself.'; };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
  }));
  const check = () => { setState('listening'); announce('Listening for the first event from acme.com'); };
  document.getElementById('check-btn').addEventListener('click', check);
  document.getElementById('recheck-btn').addEventListener('click', check);
  document.getElementById('hide-guide').addEventListener('click', () => {
    document.getElementById('setup').hidden = true;
    announce('Setup guide hidden. Find it again under Workspace, Setup guide.');
    document.querySelector('.guide-link a').focus();
  });
"""
d = sub(d, "  // --- Density: imperative control, applies now ---", guide_js + "\n  // --- Density: imperative control, applies now ---")
d = sub(d, ".state { display: none; }", ".state { display: none; }\n.setup[hidden] { display: none !important; }")
