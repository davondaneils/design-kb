// State truth and proportion checks for tools/lint.mjs (round 3 critic, kb/reviews/round3-critic.md, gate item 16:
// numbers in empty and setup states that the state cannot have, a live feed that contradicts the page's own error,
// totals that disagree after one update, shares that sum to 100 over a subset, bars scaled to the maximum).
//
// The pass opens the page at 1440 light with a fake clock (Playwright page.clock), reads every number on the page,
// drives N live updates (advances the clock by --tick-ms, default 61000, --ticks times, default 3; a page may expose
// window.__designKbTick() to run one update instead), and compares the numbers after each update.
//
// Checks without any markup (heuristics):
//   truth  fail  a number (4+ digits) shown in two places changes in one place and not the other after an update
//                (KPI 48,236 while the footnote still says 48,210)
//   truth  fail  a number keeps changing inside a tile that carries a caveat ("Partial since 2:05 pm") while the
//                page says a source stopped or failed; warn when only the caveat is there
//   truth  warn  a count that cannot fall in an open window (active users, visitors, sign-ups, events, orders,
//                "this week", "to date") falls after an update
//   truth  fail  an empty or setup state ("No events yet", "Waiting for first event", "nothing tracked") shows a
//                number that the default state also shows (data carried into a state that cannot have it);
//                other numbers in that state are listed as a warning to tick
//   proportion fail  a share or percent column sums to 100 over the rows shown while the panel says it shows
//                "1 to 6 of 214" (shares of a subset labelled as shares of all); warn when no total is printed
//   proportion fail  a bar fill beside exactly one percent value is not drawn on a 0 to 100 scale (64% filling
//                the whole track because bars are scaled to the maximum)
//
// Data-attribute contract (fails when broken; document it in the page's build note):
//   data-num                       a measured number; value from data-value, else parsed from the text
//   data-sum-of="<selector>"       equals the sum of the numbers in the matched elements (at displayed precision)
//   data-derived-from="<op> <#a> [<#b>]"  op is same | diff | pct-change | ratio | share:
//                                  same a; a minus b; (a minus b) / b x 100; a / b; a / b x 100
//   data-bar="<value or #selector>" [data-bar-max="100"]   a fill whose width / its parent's width = value / max
//   data-share-base="<N>"          on a table or list of shares: the shares are of N items
//   data-monotonic="up|down"       never moves the other way across live updates
//   data-source="<name>"           with data-source-stopped="<name>" on a visible alert: the number must not change
//                                  while that alert is visible
//   data-data="none"               on html, body or a panel in empty and setup states: every visible [data-num]
//                                  inside is hidden, zero or a dash; [data-sample] regions are exempt
// The contract checks run again after every live update, so a total that stops matching after a tick fails.

const SNAP = () => {
  const L = window.__lint;
  const MON = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s$/;
  const RE = /(?<![\w.,])([−-]?)([$€£]?)(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?(?:\s?(k|K|M|B|bn|%))?(?![\w.]?\d)(?![A-Za-z])/g;
  const norm = (s) => s.replace(/[   ]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = (text) => {
    const out = [];
    let m;
    RE.lastIndex = 0;
    while ((m = RE.exec(text))) {
      const before = text.slice(Math.max(0, m.index - 6), m.index), after = text.slice(m.index + m[0].length, m.index + m[0].length + 4);
      if (MON.test(before) || /^\s?(am|pm)\b|^:\d/i.test(after) || /:$/.test(before)) continue;
      if (!m[2] && !m[4] && !m[5] && /^(19|20)\d\d$/.test(m[3])) continue; // a year
      const digits = (m[3] + (m[4] || '')).replace(/\D/g, '').length;
      let v = parseFloat(m[3].replace(/,/g, '') + (m[4] ? '.' + m[4] : ''));
      if (m[1]) v = -v;
      const mult = { k: 1e3, K: 1e3, M: 1e6, B: 1e9, bn: 1e9 }[m[5]] || 1;
      const period = /^\s?(?:seconds?|minutes?|mins?|hours?|days?|weeks?|months?|years?|wks?|mos?)\b/i.test(text.slice(m.index + m[0].length, m.index + m[0].length + 9));
      out.push({ t: m[0].trim(), v: v * mult, dec: m[4] ? m[4].length : 0, mult, pct: m[5] === '%', digits, period });
    }
    return out;
  };
  const shown = (e) => { if (!e.getClientRects().length) return false; const s = getComputedStyle(e); return s.visibility !== 'hidden'; };
  const els = [...document.body.querySelectorAll('*')].filter((e) => !e.closest('script, style, template, svg, noscript') && shown(e));
  let id = Number(document.documentElement.dataset.truthNext || 0);
  const owners = {};
  const text = new Map();
  for (const e of els) { const t = norm(e.textContent || ''); if (t.length <= 240) text.set(e, t); }
  for (const [e, t] of text) {
    const toks = tokens(t);
    if (!toks.length) continue;
    const kids = [...e.children].map((c) => text.get(c) || norm(c.textContent || ''));
    const own = toks.filter((k) => !kids.some((kt) => kt.includes(k.t)));
    if (!own.length) continue;
    if (!e.dataset.truthId) e.dataset.truthId = String(id++);
    // Context for labels and caveats: the nearest repeated item (a tile, row or card: an ancestor with a sibling of
    // the same tag and class), else up to 3 levels under 300 characters.
    const sigOf = (a) => a.tagName + '.' + [...a.classList].sort().join('.');
    let ctx = null;
    for (let a = e.parentElement, i = 0; a && a !== document.body && i < 7; a = a.parentElement, i++) {
      if (a.parentElement && [...a.parentElement.children].some((s) => s !== a && sigOf(s) === sigOf(a))) { ctx = a; break; }
    }
    if (!ctx) { ctx = e; for (let a = e.parentElement, i = 0; a && i < 3; a = a.parentElement, i++) { if (norm(a.textContent || '').length > 300) break; ctx = a; } }
    if (!ctx.dataset.truthCtx) ctx.dataset.truthCtx = String(id++);
    const ctxText = norm(ctx.textContent || '');
    const sample = !!e.closest('[data-sample]') || (() => { for (let a = e, i = 0; a && i < 6; a = a.parentElement, i++) { const at = norm(a.textContent || ''); if (at.length > 600) break; if (/\bsample\b/i.test(at)) return true; } return false; })();
    owners[e.dataset.truthId] = { sel: L.sel(e), toks: own, ctx: ctxText.slice(0, 200), ctxId: ctx.dataset.truthCtx, ctxSel: L.sel(ctx), inMain: !!e.closest('main, [role=main]'), sample, dataNum: e.hasAttribute('data-num') };
  }
  document.documentElement.dataset.truthNext = String(id);
  return { owners, body: norm(document.body.innerText || '') };
};

// Contract and proportion checks on the current DOM. Returns [{ check, level, message, sel }].
const CONTRACT = () => {
  const L = window.__lint;
  const out = [];
  const norm = (s) => s.replace(/[   ]/g, ' ').replace(/\s+/g, ' ').trim();
  const num = (e) => {
    if (!e) return null;
    const raw = e.getAttribute('data-value') ?? norm(e.textContent || '');
    const m = raw.match(/([−-]?)[$€£]?(\d{1,3}(?:,\d{3})+|\d+)(?:\.(\d+))?\s?(k|K|M|B|bn|%)?/);
    if (!m) return null;
    const mult = { k: 1e3, K: 1e3, M: 1e6, B: 1e9, bn: 1e9 }[m[4]] || 1;
    let v = parseFloat(m[2].replace(/,/g, '') + (m[3] ? '.' + m[3] : '')) * mult;
    if (m[1]) v = -v;
    return { v, tol: 0.5 * Math.pow(10, -(m[3] ? m[3].length : 0)) * mult + 1e-9, text: m[0] };
  };
  const q = (s) => { try { return [...document.querySelectorAll(s)]; } catch { return []; } };
  const vis = (e) => e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  for (const e of q('[data-sum-of]').filter(vis)) {
    const me = num(e); const parts = q(e.getAttribute('data-sum-of')).map(num).filter(Boolean);
    if (!me || !parts.length) continue;
    const sum = parts.reduce((a, p) => a + p.v, 0), tol = me.tol + parts.reduce((a, p) => a + p.tol, 0);
    if (Math.abs(sum - me.v) > tol) out.push({ check: 'truth', level: 'fail', message: `"${me.text}" should be the sum of ${e.getAttribute('data-sum-of')} (${Math.round(sum * 100) / 100})`, sel: L.sel(e) });
  }
  for (const e of q('[data-derived-from]').filter(vis)) {
    const [op, a, b] = e.getAttribute('data-derived-from').trim().split(/\s+/);
    const me = num(e), A = num(q(a)[0]), B = b ? num(q(b)[0]) : null;
    if (!me || !A || (op !== 'same' && !B)) continue;
    const f = { same: () => A.v, diff: () => A.v - B.v, 'pct-change': () => (A.v - B.v) / B.v * 100, ratio: () => A.v / B.v, share: () => A.v / B.v * 100 }[op];
    if (!f) { out.push({ check: 'truth', level: 'fail', message: `unknown data-derived-from op "${op}"`, sel: L.sel(e) }); continue; }
    const want = f();
    // Tolerance: the element's displayed precision, plus the effect of the inputs' rounding on pct-change and ratios.
    const slack = op === 'same' || op === 'diff' ? A.tol + (B ? B.tol : 0) : Math.abs(want) * ((A.tol / Math.abs(A.v || 1)) + (B.tol / Math.abs(B.v || 1)));
    if (Math.abs(Math.abs(want) - Math.abs(me.v)) > me.tol + slack) out.push({ check: 'truth', level: 'fail', message: `"${me.text}" disagrees with ${op} of ${a}${b ? ' and ' + b : ''} (${Math.round(want * 100) / 100})`, sel: L.sel(e) });
  }
  const dataNone = q('[data-data="none"]').filter((e) => e === document.documentElement || vis(e));
  for (const host of dataNone) for (const e of [...host.querySelectorAll('[data-num]')].filter(vis)) {
    if (e.closest('[data-sample]')) continue;
    const n = num(e);
    if (n && n.v !== 0) out.push({ check: 'truth', level: 'fail', message: `"${n.text}" shows in a state marked data-data="none" (empty or setup); hide it or show 0 or a dash`, sel: L.sel(e) });
  }
  // Bars: contract first, then a fill beside exactly one percent value.
  const bars = new Set();
  for (const e of q('[data-bar]').filter(vis)) {
    bars.add(e);
    const spec = e.getAttribute('data-bar');
    const val = /^[\d.]+$/.test(spec) ? parseFloat(spec) : (num(q(spec)[0]) || {}).v;
    const max = parseFloat(e.getAttribute('data-bar-max') || '100');
    const tw = e.parentElement.getBoundingClientRect().width;
    if (val == null || !tw) continue;
    const got = e.getBoundingClientRect().width / tw * 100, want = val / max * 100;
    if (Math.abs(got - want) > 2) out.push({ check: 'proportion', level: 'fail', message: `bar drawn at ${Math.round(got)}% of its track for a value of ${Math.round(want)}% (scale it 0 to ${max})`, sel: L.sel(e) });
  }
  const groups = new Map();
  for (const e of q('[style*="width"]').filter(vis)) {
    if (bars.has(e) || (e.textContent || '').trim() || !/width:\s*[\d.]+%/.test(e.getAttribute('style'))) continue;
    const r = e.getBoundingClientRect(); if (r.height > 24) continue;
    let host = null;
    for (let a = e.parentElement, i = 0; a && i < 3; a = a.parentElement, i++) { const pcts = norm(a.textContent || '').match(/\d+(?:\.\d+)?\s?%/g); if (pcts) { host = pcts.length === 1 ? { a, v: parseFloat(pcts[0]) } : null; break; } }
    if (!host) continue;
    const got = r.width / e.parentElement.getBoundingClientRect().width * 100;
    const key = (e.parentElement.className || '') + '|' + e.tagName;
    if (Math.abs(got - host.v) > 3) { const g = groups.get(key) || { n: 0, first: null }; g.n++; g.first ||= { sel: L.sel(e), got: Math.round(got), v: host.v }; groups.set(key, g); }
  }
  for (const [, g] of groups) out.push({ check: 'proportion', level: 'fail', message: `${g.n} bar${g.n > 1 ? 's' : ''} not on a 0 to 100 scale: a ${g.first.v}% value fills ${g.first.got}% of its track (bars scaled to the maximum read as shares of 100)`, sel: g.first.sel });
  // Share columns that sum to 100 over the rows shown.
  for (const t of q('table, [role=table]').filter(vis)) {
    const rows = [...t.querySelectorAll('tr, [role=row]')].filter(vis);
    const head = rows.find((r) => r.querySelector('th, [role=columnheader]'));
    if (!head) continue;
    const hs = [...head.querySelectorAll('th, td, [role=columnheader], [role=cell]')];
    const col = hs.findIndex((h) => /share|% of|percent/i.test(h.textContent));
    if (col < 0) continue;
    const body = rows.filter((r) => r !== head && !r.querySelector('th[scope=col], [role=columnheader]'));
    const vals = body.map((r) => { const c = [...r.querySelectorAll('th, td, [role=cell], [role=rowheader]')][col]; const m = c && norm(c.textContent).match(/(\d+(?:\.\d+)?)\s?%?/); return m ? parseFloat(m[1]) : null; }).filter((v) => v != null);
    if (vals.length < 2) continue;
    const sum = vals.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 100) > 0.6) continue;
    let total = parseInt((t.closest('[data-share-base]') || t).getAttribute('data-share-base') || '', 10);
    if (!total) {
      for (let a = t, i = 0; a && i < 4; a = a.parentElement, i++) { const m = norm(a.textContent || '').match(/\bof\s+(\d[\d,]*)\b/); if (m) { total = parseInt(m[1].replace(/,/g, ''), 10); break; } }
    }
    const what = `"${norm(hs[col].textContent)}" sums to ${Math.round(sum * 10) / 10} over the ${vals.length} rows shown`;
    if (total > vals.length) out.push({ check: 'proportion', level: 'fail', message: `${what}, but the panel shows ${vals.length} of ${total}: shares of a subset read as shares of all (compute against all ${total}, or label it "share of rows shown")`, sel: L.sel(hs[col]) });
    else out.push({ check: 'proportion', level: 'warn', message: `${what}: confirm the base is these rows (declare data-share-base on the table)`, sel: L.sel(hs[col]) });
  }
  return out;
};

// Watched values (data-monotonic, data-source): compare with the value recorded on the previous call.
const WATCH = () => {
  const L = window.__lint; const out = [];
  const val = (e) => { const m = (e.getAttribute('data-value') ?? e.textContent).replace(/,/g, '').replace('\u2212', '-').match(/-?\d+(?:\.\d+)?/); return m ? parseFloat(m[0]) : null; };
  for (const e of document.querySelectorAll('[data-monotonic], [data-source]')) {
    const now = val(e), was = e.dataset.truthWas === undefined ? null : parseFloat(e.dataset.truthWas);
    if (now != null) e.dataset.truthWas = String(now);
    if (was == null || now == null || was === now) continue;
    const dir = e.getAttribute('data-monotonic');
    if ((dir === 'up' && now < was) || (dir === 'down' && now > was)) out.push({ check: 'truth', level: 'fail', message: `${L.sel(e)} moved ${was} to ${now}, against data-monotonic="${dir}"`, sel: L.sel(e) });
    const src = e.getAttribute('data-source');
    const alert = src && [...document.querySelectorAll('[data-source-stopped]')].find((a) => a.getAttribute('data-source-stopped').split(/\s+/).includes(src) && a.getClientRects().length);
    if (alert) out.push({ check: 'truth', level: 'fail', message: `${L.sel(e)} changed ${was} to ${now} while ${L.sel(alert)} says source "${src}" stopped`, sel: L.sel(e) });
  }
  return out;
};

const EMPTY_CUE = /\bno [a-z]+(?: [a-z]+)? yet\b|waiting for (?:the |your )?first|nothing (?:tracked|here) yet|nothing tracked|sample data/i;
const STOPPED = /\b(?:stopped|not being received|not received|failed|outage)\b/i;
const CAVEAT = /partial since|partial data|undercount|stopped|paused|not received|delayed since|stale/i;
const CUMULATIVE = /active users|unique|visitors|sign-?ups|events|orders|installs|downloads|to date|so far|this (?:week|month|quarter|year)/i;

export async function truthPass(browser, target, helpers, toUrl, opts, add) {
  const ticks = opts.ticks ?? 3, tickMs = opts.tickMs ?? 61000;
  const open = async (url) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce', deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.clock.install();
    await page.goto(toUrl(url), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts && document.fonts.ready);
    await page.clock.runFor(1500);
    await page.waitForTimeout(300);
    await page.addScriptTag({ content: helpers });
    return { context, page };
  };
  const seen = new Set();
  const emit = (f) => { const k = f.key || f.check + f.message; if (seen.has(k)) return; seen.add(k); add(f.check, f.level, f.message, { sel: f.sel }); };

  const { context, page } = await open(target);
  try {
    let before = await page.evaluate(SNAP);
    await page.evaluate(WATCH);
    (await page.evaluate(CONTRACT)).forEach(emit);

    // Empty or setup state: numbers carried over from the default state.
    const q = target.indexOf('?');
    const isSheet = await page.evaluate(() => document.documentElement.dataset.lintPage === 'state-sheet' || /state sheet/i.test(document.title));
    if (!isSheet && EMPTY_CUE.test(before.body)) {
      let base = new Set();
      if (q !== -1 && /state=/.test(target)) {
        const b = await open(target.slice(0, q));
        const bs = await b.page.evaluate(SNAP);
        for (const o of Object.values(bs.owners)) for (const t of o.toks) if (t.digits >= 2 && t.v !== 0) base.add(t.t);
        await b.context.close();
      }
      const carried = [], other = [];
      // A "sample data" state labels the sample in the content; numbers outside main (a sidebar meter, a header)
      // are real and must match the state. "No events yet" and "Waiting for first" states have no numbers at all.
      const sampleState = /sample data/i.test(before.body.match(EMPTY_CUE)[0]);
      for (const o of Object.values(before.owners)) {
        if (o.sample || (sampleState && o.inMain)) continue;
        for (const t of o.toks) {
          if (t.digits < 2 || t.v === 0 || t.period) continue;
          (base.has(t.t) ? carried : other).push(`${t.t} (${o.sel})`);
        }
      }
      const cue = before.body.match(EMPTY_CUE)[0];
      if (carried.length) emit({ check: 'truth', level: 'fail', message: `the state says "${cue}" but shows ${carried.length} number${carried.length > 1 ? 's' : ''} from the default state: ${[...new Set(carried)].slice(0, 6).join(', ')}` });
      if (other.length) emit({ check: 'truth', level: 'warn', message: `the state says "${cue}"; tick these numbers against what the state can have: ${[...new Set(other)].slice(0, 8).join(', ')}` });
    }

    // Live updates.
    for (let i = 1; i <= ticks; i++) {
      const hooked = await page.evaluate(() => { if (typeof window.__designKbTick === 'function') { window.__designKbTick(); return true; } return false; });
      if (!hooked) await page.clock.runFor(tickMs);
      await page.waitForTimeout(500);
      const after = await page.evaluate(SNAP);
      const stopped = STOPPED.test(after.body);
      // Divergence: a 4+ digit number in two places changes in one.
      const where = new Map();
      for (const [id, o] of Object.entries(before.owners)) for (const t of o.toks) if (t.digits >= 4) { if (!where.has(t.t)) where.set(t.t, []); where.get(t.t).push(id); }
      for (const [tok, ids] of where) {
        if (ids.length < 2) continue;
        const live = ids.filter((id) => after.owners[id]);
        const changed = live.filter((id) => !after.owners[id].toks.some((t) => t.t === tok));
        const same = live.filter((id) => after.owners[id].toks.some((t) => t.t === tok));
        if (changed.length && same.length) {
          const now = after.owners[changed[0]].toks.map((t) => t.t).join(' ');
          emit({ check: 'truth', level: 'fail', message: `after live update ${i}, ${before.owners[changed[0]].sel} changed ${tok} to ${now} but ${before.owners[same[0]].sel} still says ${tok} ("${after.owners[same[0]].ctx.slice(0, 60)}"); recompute related numbers in the same frame`, sel: before.owners[same[0]].sel });
        }
      }
      // Per-element changes: falling counts, caveated tiles, stopped sources.
      for (const [id, o] of Object.entries(before.owners)) {
        const a = after.owners[id];
        if (!a || a.toks.length !== 1 || o.toks.length !== 1) continue;
        const x = o.toks[0], y = a.toks[0];
        if (x.t === y.t || x.pct !== y.pct) continue;
        if (y.v < x.v && CUMULATIVE.test(o.ctx)) emit({ key: 'fall' + o.ctxId, check: 'truth', level: 'warn', message: `${o.sel} fell from ${x.t} to ${y.t} after live update ${i}; a count over an open window ("${o.ctx.slice(0, 50)}") cannot fall (mark data-monotonic to make this a fail)`, sel: o.sel });
        const cav = o.ctx.match(CAVEAT);
        if (cav) emit({ key: 'cav' + o.ctxId, check: 'truth', level: stopped ? 'fail' : 'warn', message: `${o.sel} keeps updating (${x.t} to ${y.t}) inside ${o.ctxSel}, marked "${cav[0]}"${stopped ? ' while the page says its source stopped' : ''}; freeze it or recompute the caveat`, sel: o.sel });
      }
      // Contract: monotonic and stopped sources, then every relation again.
      (await page.evaluate(WATCH)).forEach(emit);
      (await page.evaluate(CONTRACT)).forEach((f) => emit({ ...f, message: `${f.message} (after live update ${i})`, key: f.check + f.message }));
      before = after;
    }
  } finally {
    await context.close();
  }
}
