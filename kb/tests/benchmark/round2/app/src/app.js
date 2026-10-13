(() => {
  // States by URL: default, confirm (default with the dialog open), approved, error, empty, loading.
  const STATES = ['default', 'confirm', 'approved', 'error', 'empty', 'loading'];
  const params = new URLSearchParams(location.search);
  let state = STATES.includes(params.get('state')) ? params.get('state') : 'default';
  const view = state === 'confirm' ? 'default' : state;
  const root = document.documentElement;
  root.dataset.state = state;
  for (const el of document.querySelectorAll('[data-show]')) el.hidden = !el.dataset.show.split(' ').includes(view);
  const content = document.getElementById('content');
  if (view === 'empty') content.dataset.data = 'none';
  if (view === 'loading') { content.setAttribute('aria-busy', 'true'); }
  if (view === 'approved') document.body.classList.remove('has-commit');
  const live = document.getElementById('live');
  const say = (t) => { live.textContent = ''; requestAnimationFrame(() => { live.textContent = t; }); };
  if (view === 'loading') say('Loading the October run');

  const go = (s) => { const u = new URL(location.href); if (s === 'default') u.searchParams.delete('state'); else u.searchParams.set('state', s); location.assign(u); };

  // Input modality, so a dialog opened from the keyboard does not animate (design-motion reference 07).
  let via = 'pointer';
  addEventListener('keydown', () => { via = 'key'; }, true);
  addEventListener('pointerdown', () => { via = 'pointer'; }, true);

  // Commit dialog
  const dlg = document.getElementById('confirm');
  let opener = null;
  const open = () => { opener = document.activeElement; dlg.dataset.via = via; dlg.showModal(); };
  for (const b of document.querySelectorAll('[data-open-confirm]')) b.addEventListener('click', open);
  dlg.addEventListener('cancel', () => { dlg.dataset.via = via; });
  dlg.addEventListener('close', () => {
    if (dlg.returnValue === 'approve') { go('approved'); return; }
    if (opener && opener.focus) opener.focus();
  });
  dlg.querySelector('#confirm-approve').addEventListener('click', (e) => {
    const b = e.currentTarget;
    if (b.getAttribute('aria-busy') === 'true') { e.preventDefault(); return; }
    e.preventDefault();
    b.setAttribute('aria-busy', 'true');
    document.getElementById('dlg-live').textContent = 'Approving and locking rates';
    requestAnimationFrame(() => { dlg.close('approve'); });
  });
  if (state === 'confirm') { dlg.dataset.via = 'key'; dlg.showModal(); }

  for (const b of document.querySelectorAll('[data-retry]')) b.addEventListener('click', () => { b.setAttribute('aria-busy', 'true'); say('Retrying the funding transfer'); go('approved'); });
  for (const b of document.querySelectorAll('[data-draft]')) b.addEventListener('click', () => { b.setAttribute('aria-busy', 'true'); say('Drafting the October run'); go('default'); });

  // Rate-lock countdown: minutes, polite at most once a minute through the page region, with a hide control (WCAG 2.2.2).
  const MINUTE = 60 * 1000;
  const t0 = Date.now();
  for (const c of document.querySelectorAll('[data-countdown]')) {
    if (c.closest('[hidden]')) continue;
    const start = Number(c.dataset.countdown);
    const mins = c.querySelector('.mins');
    const tick = () => {
      const left = Math.max(0, start - Math.floor((Date.now() - t0) / MINUTE));
      if (mins.textContent !== String(left)) { mins.textContent = String(left); if (!c.querySelector('.left').hidden && left % 5 === 0) say(`${left} minutes left on the rate lock`); }
    };
    setInterval(tick, MINUTE / 4);
    c.querySelector('[data-hide-countdown]').addEventListener('click', (e) => {
      const l = c.querySelector('.left');
      l.hidden = !l.hidden;
      e.currentTarget.textContent = l.hidden ? 'Show countdown' : 'Hide countdown';
    });
  }

  // People table: filter and sort, state in the URL
  const table = document.getElementById('people-table');
  const tbody = table.tBodies[0];
  const count = document.getElementById('people-count');
  const segs = [...document.querySelectorAll('.seg [data-filter]')];
  const setFilter = (f, announce) => {
    let n = 0;
    for (const tr of tbody.rows) { const on = f === 'all' || tr.dataset.review === '1'; tr.hidden = !on; if (on) n++; }
    for (const s of segs) s.setAttribute('aria-pressed', String(s.dataset.filter === f));
    count.textContent = String(n);
    const u = new URL(location.href); if (f === 'all') u.searchParams.delete('filter'); else u.searchParams.set('filter', f); history.replaceState(null, '', u);
    if (announce) say(f === 'all' ? `Showing all ${n} people` : `Showing ${n} people who need a look`);
  };
  for (const s of segs) s.addEventListener('click', () => setFilter(s.dataset.filter, true));
  if (params.get('filter') === 'review' && view === 'default') setFilter('review', false);

  const ths = [...table.tHead.rows[0].cells].filter((th) => th.dataset.key);
  const sortBy = (key, dir) => {
    const rows = [...tbody.rows];
    rows.sort((a, b) => key === 'name' ? a.dataset.name.localeCompare(b.dataset.name) * dir : (Number(a.dataset.usd) - Number(b.dataset.usd)) * dir);
    tbody.append(...rows);
    for (const th of ths) {
      if (th.dataset.key === key) th.setAttribute('aria-sort', dir > 0 ? 'ascending' : 'descending'); else th.removeAttribute('aria-sort');
      const svg = th.querySelector('svg'); if (svg && th.dataset.key === key) svg.style.transform = (key === 'usd' ? dir < 0 : dir > 0) ? '' : 'rotate(180deg)';
    }
    say(`Sorted by ${key === 'name' ? 'person' : 'USD amount'}, ${dir > 0 ? 'ascending' : 'descending'}`);
  };
  for (const th of ths) th.querySelector('button').addEventListener('click', () => {
    const cur = th.getAttribute('aria-sort');
    const dir = cur ? (cur === 'ascending' ? -1 : 1) : (th.dataset.key === 'name' ? 1 : -1);
    sortBy(th.dataset.key, dir);
  });

  // Phone and tablet menu (drawer under 64rem)
  const menu = document.getElementById('menu-btn');
  const side = document.getElementById('sidebar');
  const scrim = document.querySelector('.scrim');
  const setMenu = (openIt) => {
    menu.setAttribute('aria-expanded', String(openIt));
    menu.querySelector('.menu-lbl').textContent = openIt ? 'Close' : 'Menu';
    side.classList.toggle('open', openIt);
    scrim.hidden = !openIt;
    if (openIt) side.querySelector('a').focus(); else menu.focus();
  };
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  scrim.addEventListener('click', () => setMenu(false));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') setMenu(false); });
  if (params.get('open') === 'menu') setMenu(true);
})();
