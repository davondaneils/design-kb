#!/usr/bin/env node
// Proves each gate failure the round 3 critic found is fixed (kb/reviews/round3-critic.md, section 2).
// Run from the repo root with the repo served over HTTP:
//   python3 -m http.server 8765 --bind 127.0.0.1 &   node kb/tests/round4/check.mjs
// Prints one line per check, PASS or FAIL, and exits 1 on any fail.
import fs from 'node:fs';
import path from 'node:path';
import { launch } from '../../../tools/browser.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const B = 'http://127.0.0.1:8765/kb/tests/round4/';
let fails = 0;
const ok = (cond, msg, extra = '') => { if (!cond) fails++; console.log((cond ? 'PASS ' : 'FAIL ') + msg + (extra ? '  ' + extra : '')); };
const browser = await launch();
async function open(url, w, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce', colorScheme: opts.scheme || 'light' });
  const p = await ctx.newPage();
  if (opts.clock) await p.clock.install({ time: new Date('2026-10-12T16:58:00-07:00') });
  await p.goto(B + url);
  await p.evaluate(() => document.fonts.ready);
  return p;
}

// ---------- Dashboard, gate 12 and 13: the head never overlaps, at every width ----------
// Default page at seven widths, then every state at 390 and 768, where the freshness line is longest for its room
// (round 4 lint caught "Counting since 2:06 pm, times in PT" pushing Pause under the head's edge in first-data).
const headRuns = [390, 640, 768, 900, 1024, 1280, 1440].map((w) => ['', w]);
for (const s of ['loading', 'empty', 'partial', 'viewer', 'first-run', 'listening', 'check-failed', 'first-data', 'limit', 'limit-member']) for (const w of [390, 768]) headRuns.push(['?state=' + s, w]);
for (const [q, w] of headRuns) {
  const p = await open('dashboard.html' + q, w);
  const r = await p.evaluate(() => {
    const head = document.querySelector('.page-head');
    const kids = [...head.querySelectorAll(':scope > *, .title-block > *, .freshness > *')].filter((e) => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden');
    const top = [...head.children].filter((e) => e.getClientRects().length);
    const rects = top.map((e) => [e.className || e.tagName, e.getBoundingClientRect()]);
    const overlaps = [];
    for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
      const a = rects[i][1], b = rects[j][1];
      if (a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5) overlaps.push(rects[i][0] + ' x ' + rects[j][0]);
    }
    const lb = document.getElementById('live-btn');
    const live = lb.getBoundingClientRect();
    const pts = lb.getClientRects().length ? [[live.left + 2, live.top + live.height / 2], [live.right - 2, live.top + live.height / 2], [live.left + live.width / 2, live.top + live.height / 2]] : [];
    const hits = pts.map(([x, y]) => { const e = document.elementFromPoint(x, y); return !!e && !!e.closest('#live-btn'); });
    const outside = kids.filter((e) => { const r = e.getBoundingClientRect(); return r.bottom > head.getBoundingClientRect().bottom + 0.5 || r.right > head.getBoundingClientRect().right + 0.5; }).map((e) => e.className);
    const dot = document.querySelector('.freshness .dot').getBoundingClientRect();
    return { h: head.getBoundingClientRect().height, sp: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop), overlaps, hits, outside, dot: [dot.width, dot.height], lines: document.querySelector('.freshness').getClientRects().length && Math.round(document.querySelector('.freshness').getBoundingClientRect().height) };
  });
  ok(r.h === 64 && r.overlaps.length === 0 && r.hits.every(Boolean) && r.outside.length === 0 && r.dot[0] === 8 && r.dot[1] === 8 && r.lines <= 24,
    `dashboard head ${q || "default"} ${w}: 64px tall, no overlaps, "Pause updates" (when shown) hit-tests to itself, dot 8x8, freshness one line`,
    JSON.stringify({ h: r.h, overlaps: r.overlaps, hits: r.hits, outside: r.outside, dot: r.dot, freshness: r.lines }));
  ok(r.sp >= r.h + 16, `dashboard ${q || "default"} ${w}: scroll-padding-top ${r.sp} covers the ${r.h}px head plus 16`);
  await p.context().close();
}

// ---------- Dashboard, gate 16: every state shows only the numbers it can have ----------
const visibleText = (p) => p.evaluate(() => {
  const out = [];
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = walk.nextNode())) {
    const e = n.parentElement; if (!e || e.closest('script,style,.sr-only,dialog:not([open]),[aria-hidden=true] .sr-only')) continue;
    if (!e.getClientRects().length || getComputedStyle(e).visibility === 'hidden') continue;
    out.push(n.textContent);
  }
  return out.join(' ').replace(/\s+/g, ' ');
});
for (const s of ['loading', 'empty', 'first-run', 'listening', 'check-failed', 'first-data', 'ready', 'partial', 'viewer', 'limit']) {
  const p = await open('dashboard.html?state=' + s, 1440);
  const t = await visibleText(p);
  const usage = await p.evaluate(() => document.getElementById('usage-num').textContent);
  if (['loading', 'empty'].includes(s)) {
    ok(!/48,210|3\.6M|31,040|184\.2|9\.3M/.test(t), `dashboard ?state=${s}: no usage, total or KPI number on screen`, usage);
  } else if (['first-run', 'listening', 'check-failed'].includes(s)) {
    ok(usage === '0 of 10M' && !/3\.6M|9\.3M/.test(t), `dashboard ?state=${s}: usage reads 0 of 10M (sample data is not usage)`, usage);
    ok(/Sample data\. Active users/.test(t), `dashboard ?state=${s}: the platform total is labelled sample`);
  } else if (s === 'first-data') {
    const r = await p.evaluate(() => ({
      plat: [...document.querySelectorAll('#plat-list .b-val')].map((e) => +e.textContent.replace(/,/g, '')),
      kpi: document.querySelector('.kpis.first .kpi .value').textContent.trim(),
      views: [...document.querySelectorAll('#pages-body td.key')].map((e) => +e.textContent.replace(/,/g, '')),
      share: [...document.querySelectorAll('#pages-body td.t-share')].map((e) => parseFloat(e.textContent.replace(/[^\d.]/g, ''))),
      answer: document.querySelector('.answer-first').textContent,
      deltas: document.querySelectorAll('#plat-list .delta').length,
    }));
    const sum = r.plat.reduce((a, b) => a + b, 0), views = r.views.reduce((a, b) => a + b, 0), share = r.share.reduce((a, b) => a + b, 0);
    ok(usage === '38 of 10M' && sum === 12 && r.kpi === '12' && /12 visitors/.test(r.answer) && views === 38 && /38 page views/.test(r.answer) && Math.abs(share - 100) < 0.3 && r.deltas === 0,
      'dashboard ?state=first-data: 38 events, 12 visitors on every surface, shares of 38 views sum to 100, no week-on-week deltas', JSON.stringify({ usage, sum, kpi: r.kpi, views, share }));
  } else {
    ok(/3\.6M of 10M|7\.8M of 10M/.test(usage), `dashboard ?state=${s}: usage shown`, usage);
  }
  await p.context().close();
}

// ---------- Dashboard, gate 16: five live updates, every number agrees after each ----------
{
  const p = await open('dashboard.html', 1440, { clock: true });
  const read = () => p.evaluate(() => {
    const n = (s) => +s.replace(/[^\d.]/g, '');
    const plat = [...document.querySelectorAll('#plat-list li')].map((li) => ({ v: n(li.querySelector('.b-val').textContent), w: parseFloat(li.querySelector('.b-bar i').style.width), d: li.querySelector('.delta').textContent }));
    return {
      wau: n(document.getElementById('wau-sr').textContent),
      pct: document.getElementById('wau-pct').textContent,
      ans: document.getElementById('ans-pct').textContent,
      spark: document.getElementById('wau-spark').getAttribute('aria-label'),
      plat, note: document.getElementById('plat-note').textContent,
      desc: document.getElementById('chart-desc').textContent,
      label: [...document.querySelectorAll('#chart-plot .label-current')].map((e) => e.textContent).join(),
      rev: document.querySelector('.kpi[data-metric=rev] .value').textContent.replace(/\s/g, ''),
      ios: document.getElementById('ios-pct').textContent,
      fresh: document.querySelector('.fresh-ready time').textContent,
    };
  });
  let prev = await read();
  const consistent = (r) => {
    const sum = r.plat.reduce((a, b) => a + b.v, 0);
    const pct = '+' + ((r.wau / 44600 - 1) * 100).toFixed(1) + '%';
    const widths = r.plat.reduce((a, b) => a + b.w, 0);
    const k = (r.wau / 1000).toFixed(1) + 'k';
    const ios = Math.abs(Math.round((r.plat[1].v / 12040 - 1) * 100)) + '%';
    return sum === r.wau && r.pct === pct && r.ans === pct.slice(1) && r.spark.endsWith(r.wau.toLocaleString('en-US')) && r.note.includes(r.wau.toLocaleString('en-US'))
      && r.desc.includes(r.wau.toLocaleString('en-US')) && r.label === k && Math.abs(widths - 100) < 0.3 && r.ios === ios && r.plat[1].d.includes(r.ios);
  };
  ok(consistent(prev), 'dashboard live, at load: KPI, delta, sentence, sparkline name, platform sum and bars, chart point and iOS alert agree', JSON.stringify({ wau: prev.wau, pct: prev.pct }));
  for (let i = 1; i <= 5; i++) {
    await p.clock.runFor(60000);
    await p.waitForTimeout(400);
    const r = await read();
    ok(consistent(r) && r.wau > prev.wau && r.rev === prev.rev && r.fresh === 'just now',
      `dashboard live, update ${i}: users ${prev.wau} to ${r.wau} (only rises), ${r.pct} everywhere, revenue held at ${r.rev} while checkout events are stopped`);
    prev = r;
  }
  await p.click('#live-btn');
  await p.clock.runFor(120000); await p.waitForTimeout(200);
  const r = await read();
  ok(r.wau === prev.wau, 'dashboard live, paused: two polls change nothing (WCAG 2.2.2)');
  await p.context().close();
}

// ---------- Dashboard, gate 16: shares and bars are true; one comparison per number ----------
{
  const p = await open('dashboard.html', 1440);
  const r = await p.evaluate(() => ({
    rows: [...document.querySelectorAll('#pages-body tr')].map((tr) => ({ views: +tr.querySelector('td.key').textContent.replace(/,/g, ''), share: parseFloat(tr.querySelector('td.t-share').textContent), s: tr.style.getPropertyValue('--s') })),
    range: document.getElementById('pages-range').textContent,
    vs: [...document.querySelectorAll('.kpis.ready .delta .vs')].map((e) => e.textContent),
    chgHead: document.querySelector('th[data-key=chg]').textContent.trim(),
    kpiHead: document.getElementById('kpi-title').textContent,
    legend: document.querySelector('#chart-panel .legend').textContent.replace(/\s+/g, ' '),
    toolbar: document.querySelector('.toolbar').textContent.replace(/\s+/g, ' '),
  }));
  const sharesOk = r.rows.every((x) => Math.abs(x.share - Math.round(x.views / 112560 * 1000) / 10) < 0.01 && x.s === x.share + '%');
  const sum = r.rows.reduce((a, b) => a + b.share, 0);
  ok(sharesOk && sum < 100 && /63\.7% of 112,560 views/.test(r.range), `dashboard table: share is of all 112,560 views (six rows sum to ${sum.toFixed(1)}%), each row bar is that share on 0 to 100`);
  ok(r.vs.length === 4 && r.vs.every((v) => v === 'vs last week') && r.chgHead === 'vs last week' && /This week/.test(r.kpiHead)
    && /Last 12 weeks/.test(r.legend) && /vs previous 12/.test(r.legend) && !/Compared to|previous/.test(r.toolbar),
    'dashboard comparison: KPIs and table say "vs last week"; the 12-week comparison is the chart legend, the only numbers it drives');
  await p.context().close();
}

// ---------- Dashboard, gate 15: the state sheet has disabled, busy, error and panel states; ids unique ----------
{
  const p = await open('dashboard-states.html', 1440);
  const r = await p.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
    return {
      dupes: ids.filter((id, i) => ids.indexOf(id) !== i),
      busy: [...document.querySelectorAll('.btn[aria-busy=true] .spinner')].filter((s) => getComputedStyle(s).display !== 'none' && s.getBoundingClientRect().width === 16).length,
      disabled: document.querySelectorAll('.btn[aria-disabled=true]:not([aria-busy])').length,
      panels: ['.skel', '.failed', '.empty', '.caveat', '.i-lock', '.search-miss'].map((s) => [s, document.querySelectorAll(s).length]),
    };
  });
  ok(r.dupes.length === 0 && r.busy >= 1 && r.disabled >= 1 && r.panels.every(([, n]) => n > 0), 'dashboard state sheet: busy spinner drawn, disabled button, skeleton, error, empty, partial, viewer and no-match states, unique ids', JSON.stringify(r));
  await p.context().close();
}

// ---------- Coffee, gate 16: one shipping promise, one tasting claim ----------
{
  const files = ['coffee.html', 'coffee-states.html', 'og.html'].map((f) => fs.readFileSync(path.join(here, f), 'utf8')).join('\n');
  const bad = [/48\s*(&nbsp;|&#8239;| |<small>&#8239;)?\s*(h\b|hours)/i, /ships by/i, /shipped by/i, /within 48/i, /Thu,(&nbsp;|\s)Oct(&nbsp;|\s)15/, /Two of us/, /next day/i];
  const hits = bad.filter((re) => re.test(files)).map(String);
  ok(hits.length === 0, 'coffee promise: no "48 h", "ships by", "within 48", "Thu, Oct 15", "next day" or "Two of us" left in page, sheet or card', hits.join(' '));
  const p = await open('coffee.html', 1440);
  const t = await visibleText(p);
  const dayAfter = (t.match(/the day after the roast/g) || []).length;
  ok(dayAfter >= 2 && /Roast to ship 1 day/.test(t) && /ships Wed, Oct 14/.test(t.replace(/ /g, ' ')) && /tasted twice/.test(t) && /We taste every batch twice/.test(t),
    `coffee promise: "the day after the roast" (${dayAfter}x), 1 day, Wed, Oct 14 (the day after Tue, Oct 13); "tasted twice" and "We taste every batch twice"`);
  ok(/4\.7 from 1,284 subscriber reviews/.test(t), 'coffee rating: the hero line names whose reviews they are');
  await p.context().close();
}

// ---------- Coffee, gate 13: aligned promise columns, a ledger gutter, slip options sized by the slip ----------
for (const w of [390, 768, 1024, 1440]) {
  const p = await open('coffee.html', w);
  const r = await p.evaluate(() => {
    const tops = [...document.querySelectorAll('.promises .steps li > div')].map((d) => Math.round(d.getBoundingClientRect().top + scrollY));
    const gaps = [...document.querySelectorAll('#paid tr')].map((tr) => { const th = tr.querySelector('th').getBoundingClientRect(), td = tr.querySelector('td'); const range = document.createRange(); range.selectNodeContents(td.firstChild); return Math.round(range.getBoundingClientRect().left - th.right); });
    const names = [...document.querySelectorAll('#g-brew .opt')].map((o) => ({ w: Math.round(o.getBoundingClientRect().width), lines: [o.querySelector('.name'), o.querySelector('.sub')].map((e) => Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight))) }));
    const slip = document.querySelector('.slip'); const sw = slip.getBoundingClientRect().width - parseFloat(getComputedStyle(slip).paddingLeft) * 2;
    const cols = new Set([...document.querySelectorAll('#g-brew .opt')].map((o) => Math.round(o.getBoundingClientRect().left))).size;
    return { tops, gaps, names, sw: Math.round(sw), cols };
  });
  if (w >= 1024) ok(new Set(r.tops).size === 1, `coffee promises ${w}: the three columns share one top edge`, r.tops.join(','));
  ok(r.gaps.every((g) => g >= 16), `coffee ledger ${w}: label to price gutter at least 16px`, r.gaps.join(','));
  ok(r.names.every((n) => n.lines.every((l) => l === 1) && n.w >= 120) && r.cols === (r.sw >= 416 ? 3 : 2),
    `coffee slip ${w}: ${r.cols} grind columns for a ${r.sw}px slip (3 from 26rem), every name and grind on one line`, JSON.stringify(r.names.map((n) => n.w)));
  await p.context().close();
}

// ---------- Coffee, gate 15: the state sheet's Sending button shows its spinner and label ----------
{
  const p = await open('coffee-states.html', 1440);
  const r = await p.evaluate(() => {
    const b = [...document.querySelectorAll('.btn[aria-busy=true]')][0];
    const sp = b.querySelector('.spinner'), cs = getComputedStyle(b);
    return { color: cs.color, spinner: getComputedStyle(sp).display, sw: sp.getBoundingClientRect().width, text: b.textContent.trim() };
  });
  ok(r.color !== 'rgba(0, 0, 0, 0)' && r.spinner !== 'none' && r.sw === 16 && r.text === 'Get the letters', 'coffee state sheet: "Sending" draws its spinner beside a visible label with the page\'s own rule', JSON.stringify(r));
  await p.context().close();
}

await browser.close();
console.log(fails ? `${fails} checks failed` : 'all checks pass');
process.exit(fails ? 1 : 0);
