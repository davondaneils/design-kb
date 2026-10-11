#!/usr/bin/env node
// Proves each gate failure the round 3 critic found is fixed (kb/reviews/round3-critic.md, section 2), and, from
// round 4.1, each judged fail of the round 4 critic (kb/reviews/round4-critic.md), and from round 4.2 each judged fail
// of the round 4.1 critic (kb/reviews/round4.1-critic.md). Port: KB_PORT (default 8765).
// Run from the repo root with the repo served over HTTP:
//   python3 -m http.server 8765 --bind 127.0.0.1 &   node kb/tests/round4/check.mjs
// Prints one line per check, PASS or FAIL, and exits 1 on any fail.
import fs from 'node:fs';
import path from 'node:path';
import { launch } from '../../../tools/browser.mjs';

const here = path.dirname(new URL(import.meta.url).pathname);
const B = 'http://127.0.0.1:' + (process.env.KB_PORT || 8765) + '/kb/tests/round4/';
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
    ok(usage === 'No events yet' && !/3\.6M|9\.3M/.test(t), `dashboard ?state=${s}: usage reads "No events yet" (sample data is not usage)`, usage);
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
  ok(r.vs.length === 4 && r.vs.every((v) => v === 'vs prior 7 days') && r.chgHead === 'vs prior 7 days' && /Last 7 days/.test(r.kpiHead)
    && /Last 12 weeks/.test(r.legend) && /vs previous 12/.test(r.legend) && !/Compared to|previous/.test(r.toolbar),
    'dashboard comparison: KPIs and table say "vs prior 7 days" (round 4.1: the window is rolling); the 12-week comparison is the chart legend, the only numbers it drives');
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
    const tops = [...document.querySelectorAll('.promises .steps li')].map((li) => ['h3', 'p'].map((t) => Math.round(li.querySelector(t).getBoundingClientRect().top + scrollY)).join('/'));
    const gaps = [...document.querySelectorAll('#paid tr')].map((tr) => { const th = tr.querySelector('th').getBoundingClientRect(), td = tr.querySelector('td'); const range = document.createRange(); range.selectNodeContents(td.firstChild); return Math.round(range.getBoundingClientRect().left - th.right); });
    const names = [...document.querySelectorAll('#g-brew .opt')].map((o) => ({ w: Math.round(o.getBoundingClientRect().width), lines: [o.querySelector('.name'), o.querySelector('.sub')].map((e) => Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight))) }));
    const slip = document.querySelector('.slip'); const sw = slip.getBoundingClientRect().width - parseFloat(getComputedStyle(slip).paddingLeft) * 2;
    const cols = new Set([...document.querySelectorAll('#g-brew .opt')].map((o) => Math.round(o.getBoundingClientRect().left))).size;
    return { tops, gaps, names, sw: Math.round(sw), cols };
  });
  if (w >= 1024) ok(new Set(r.tops).size === 1, `coffee promises ${w}: the three columns share one top edge for headings and one for bodies (round 4.1 subgrid: a two-line heading moves every body down)`, r.tops.join(','));
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

// =================== Round 4.1: the round 4 critic's judged fails (kb/reviews/round4-critic.md, section 2) ===================
const src = (f) => fs.readFileSync(path.join(here, f), 'utf8');

// ---------- Coffee 13a: the option hover is the 8 percent --state-hover layer, on the page and the sheet ----------
{
  const files = { 'coffee.src.html': src('coffee.src.html'), 'states.mjs': src('states.mjs') };
  const rawHover = Object.entries(files).filter(([, t]) => /\.opt(:hover|\.is-hover)\s*\{[^}]*color-mix/.test(t)).map(([f]) => f);
  const p = await open('coffee.html', 1440);
  await p.locator('#g-brew .opt').first().scrollIntoViewIfNeeded();
  await p.locator('#g-brew .opt').nth(1).hover();
  const r = await p.evaluate(() => {
    const o = document.querySelectorAll('#g-brew .opt')[1];
    return { img: getComputedStyle(o).backgroundImage, layer: getComputedStyle(document.documentElement).getPropertyValue('--state-hover').trim() };
  });
  ok(rawHover.length === 0 && /linear-gradient/.test(r.img) && /8%/.test(r.layer),
    'coffee 13a: option hover paints var(--state-hover), 8 percent, on the page and the sheet (no raw color-mix)', JSON.stringify({ rawHover, img: r.img.slice(0, 60), layer: r.layer }));
  await p.context().close();
}
{
  const s = await open('coffee-states.html', 1440);
  const img = await s.evaluate(() => getComputedStyle(document.querySelector('.opt.is-hover')).backgroundImage);
  ok(/linear-gradient/.test(img), 'coffee 13a: the sheet\'s hover option uses the same layer', img.slice(0, 60));
  await s.context().close();
}

// ---------- Coffee 13b: control sizes are FOUNDATIONS tokens ----------
{
  const t = src('coffee.src.html');
  const raw = (t.match(/min-height:\s*(32|40|48)px/g) || []);
  const p = await open('coffee.html', 1440);
  const r = await p.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const btn = document.querySelector('.btn:not(.btn-sm):not(.btn-wide)'), sm = document.querySelector('.btn-sm');
    return { lg: cs.getPropertyValue('--size-control-lg').trim(), md: cs.getPropertyValue('--size-control-md').trim(), sm: cs.getPropertyValue('--size-control-sm').trim(), icon: cs.getPropertyValue('--size-icon-md').trim(), btn: getComputedStyle(btn).minHeight, btnSm: sm && getComputedStyle(sm).minHeight };
  });
  ok(raw.length === 0 && r.lg === '48px' && r.md === '40px' && r.sm === '32px' && r.icon === '16px' && r.btn === '48px' && r.btnSm === '40px' && /--size-control-lg\)/.test(t) && !/FOUNDATIONS v0\.3/.test(t),
    'coffee 13b: --size-control-{sm,md,lg} and --size-icon-* on the coffee root; buttons and fields use them (no raw 32, 40 or 48px heights)', JSON.stringify({ raw, ...r }));
  await p.context().close();
}

// ---------- Coffee 16: one rule for when a subscriber pays, the same in slip, cart and checkout ----------
{
  const files = ['coffee.html', 'coffee-states.html'].map((f) => src(f)).join('\n');
  ok(!/charged on roast day/.test(files), 'coffee 16: "charged on roast day" (which contradicted "Due today $39") is gone from the page and the sheet');
  const nb = (t) => t.replace(/ /g, ' ');
  const slip = await open('coffee.html', 1440);
  const terms = nb(await slip.evaluate(() => document.getElementById('sub-terms').textContent));
  await slip.context().close();
  const plan4 = await open('coffee.html?state=plan-4', 1440);
  const terms4 = nb(await plan4.evaluate(() => document.getElementById('sub-terms').textContent));
  await plan4.context().close();
  const cart = await open('coffee.html?state=cart', 1440);
  const c = nb(await cart.evaluate(() => document.getElementById('cart-totals').textContent));
  await cart.context().close();
  const co = await open('coffee.html?state=checkout', 1440);
  const k = await co.evaluate(() => ({ lines: document.getElementById('co-lines').textContent, term: document.getElementById('co-term').textContent, pay: document.getElementById('co-pay-lbl').textContent }));
  await co.context().close();
  const sub = 18, once = 21;
  ok(/^\$18 at checkout, then every 2 weeks on roast day: next charge Tue, Oct 27\./.test(terms) && /^\$16 at checkout, then every 4 weeks on roast day: next charge Tue, Nov 10\./.test(terms4),
    'coffee 16: the slip says the first bag is paid at checkout, then every 2 (or 4) weeks on roast day, next Tue, Oct 27 (Nov 10)', terms.slice(0, 80));
  ok(c.includes('Due today$' + (sub + once).toFixed(2)) && c.includes('Then every 2 weeks on roast day, from Tue, Oct 27$18.00'),
    'coffee 16: the cart charges the $18 today with the $21 bag ($39.00), then $18 every 2 weeks on roast day from Tue, Oct 27', c.slice(0, 160));
  ok(nb(k.lines).includes('Due today$39.00') && k.pay === 'Pay $39.00' && /every 2 weeks on roast day, next on Tue, Oct 27/.test(nb(k.term)),
    'coffee 16: checkout pays $39.00 today and restates the same renewal rule', nb(k.term));
}
{
  const files = ['coffee.html', 'coffee-states.html'].map((f) => src(f)).join('\n');
  ok(!/roasted Tue|shipped Wed|Roasted Tue/.test(files) && /It roasts Tue,(&nbsp;|\s)Oct(&nbsp;|\s)13/.test(files) && /free over \$40 or with a subscription/.test(files),
    'coffee 16 (also): future dates in the present tense ("It roasts Tue, Oct 13"); the lots note states the cart\'s "Free with your subscription" rule');
}

// ---------- Coffee band (fix 4): the proof rides beside the slip and ends level with it at 1024 and 1440 ----------
for (const w of [1024, 1440]) {
  const p = await open('coffee.html', w);
  const r = await p.evaluate(async () => {
    const slip = document.querySelector('.slip'), proof = document.querySelector('.proof');
    const sb = slip.getBoundingClientRect().bottom + scrollY;
    const still = proof.getBoundingClientRect().bottom + scrollY;
    const stick = parseFloat(getComputedStyle(proof).top), ph = proof.getBoundingClientRect().height;
    scrollTo(0, sb - stick - ph); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const gap = Math.round(slip.getBoundingClientRect().bottom - proof.getBoundingClientRect().bottom);
    const top = Math.round(proof.getBoundingClientRect().top);
    return { hole: Math.round(sb - still), gap, top, pos: getComputedStyle(proof).position };
  });
  ok(r.pos === 'sticky' && Math.abs(r.gap) <= 1 && r.top >= 64,
    `coffee band ${w}: the proof is sticky and ends level with the slip as the reader reaches the slip's end (gap ${r.gap}px, was ${r.hole}px at rest), clear of the 64px header`, JSON.stringify(r));
  await p.context().close();
}

// ---------- Dashboard 13a: "Invite a teammate" has one word space ----------
{
  const p = await open('dashboard.html?state=first-data', 1440);
  const r = await p.evaluate(() => {
    const b = document.querySelector('.invite-btn');
    const rg = document.createRange();
    const walk = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
    const nodes = []; for (let n = walk.nextNode(); n; n = walk.nextNode()) nodes.push(n);
    const a = nodes.find((n) => n.textContent === 'Invite'), z = nodes.find((n) => /^ a teammate/.test(n.textContent));
    rg.selectNodeContents(a); const ar = rg.getBoundingClientRect().right;
    rg.setStart(z, 1); rg.setEnd(z, 2); const zl = rg.getBoundingClientRect().left;
    rg.setStart(z, 0); rg.setEnd(z, 1); const space = rg.getBoundingClientRect().width;
    return { gap: Math.round((zl - ar) * 10) / 10, space: Math.round(space * 10) / 10, text: b.textContent };
  });
  ok(Math.abs(r.gap - r.space) <= 0.5, `dashboard 13a: "Invite a teammate" (first-data, 1440) has one word space between the words (${r.gap}px, one space is ${r.space}px)`, JSON.stringify(r));
  await p.context().close();
}

// ---------- Dashboard 15: the sheet's 75 percent usage meter paints its warning fill ----------
{
  const p = await open('dashboard-states.html', 1440);
  const r = await p.evaluate(() => {
    const m = document.querySelector('.usage.warn .meter'), i = m.querySelector('i');
    const want = getComputedStyle(document.documentElement).getPropertyValue('--color-warning').trim();
    return { bg: getComputedStyle(i).backgroundColor, ring: getComputedStyle(m.closest('.usage')).boxShadow, frac: Math.round(i.getBoundingClientRect().width / m.getBoundingClientRect().width * 100), want };
  });
  ok(r.bg !== 'rgba(0, 0, 0, 0)' && r.frac === 78 && r.ring !== 'none' && !/warning-mark/.test(src('states.mjs')),
    'dashboard 15: the sheet\'s warning meter fills 78% of its track in the warning color, with its ring (no undefined --color-warning-mark)', JSON.stringify(r));
  await p.context().close();
}

// ---------- Dashboard 16: sample states drop caveats and glyphs whose alerts they hide; the live state keeps them ----------
for (const s of ['', 'first-run', 'listening', 'check-failed']) {
  const p = await open('dashboard.html' + (s ? '?state=' + s : ''), 1440);
  await p.click('.kpi-pick[data-metric=conv]').catch(() => {});
  const r = await p.evaluate(() => {
    const vis = (e) => !!e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
    return {
      caveats: [...document.querySelectorAll('.kpi .caveat')].filter(vis).length,
      glyph: [...document.querySelectorAll('.warn-mark')].filter(vis).length,
      legend: vis(document.getElementById('legend-partial')),
      alerts: [vis(document.getElementById('alert-checkout')), vis(document.getElementById('alert-ios'))],
      partialLine: !!document.querySelector('#chart-plot .line-partial'),
      orphans: [...document.querySelectorAll('[data-explained-by]')].filter(vis).filter((e) => ![...document.querySelectorAll(e.getAttribute('data-explained-by'))].some(vis)).length,
    };
  });
  if (!s) ok(r.caveats === 2 && r.glyph === 1 && r.legend && r.partialLine && r.alerts.every(Boolean) && r.orphans === 0, 'dashboard 16: the live state keeps both "Partial since 2:05 pm" caveats, the iOS glyph and the dotted chart point beside their alerts', JSON.stringify(r));
  else ok(r.caveats === 0 && r.glyph === 0 && !r.legend && !r.partialLine && r.orphans === 0, `dashboard 16 ?state=${s}: no outage caveat, iOS glyph or partial chart point while the alerts that explain them are hidden`, JSON.stringify(r));
  await p.context().close();
}

// ---------- Dashboard (fix 4): the rolling window is labelled as one; comparisons start once two full weeks are in ----------
{
  const p = await open('dashboard.html', 1440);
  const t = (await visibleText(p)).replace(/ /g, ' ');
  await p.context().close();
  const f = await open('dashboard.html?state=first-data', 1440);
  const tf = (await visibleText(f)).replace(/ /g, ' ');
  await f.context().close();
  ok(/Last 7 days ?, Oct 6 to 12/.test(t) && !/\bthis week\b/i.test(t) && !/vs last week/.test(t) && /Weekly comparisons start on Oct 26, once two full weeks are in/.test(tf) && /Week-on-week from Oct 26/.test(tf) && !/Oct 19/.test(tf),
    'dashboard: "Last 7 days, Oct 6 to 12" (a Tuesday to Monday rolling window), never "this week"; comparisons from Oct 26 (two full 7-day windows after Oct 12)');
}

// ---------- Dashboard (fix 5): Pause updates is at least 44x44 under a coarse pointer, and the head stays 64px ----------
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(B + 'dashboard.html'); await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    const b = document.getElementById('live-btn').getBoundingClientRect();
    const head = document.querySelector('.page-head').getBoundingClientRect();
    // Probe the hit area row by row and column by column: it is the button plus its ::after.
    const on = (x, y) => { const e = document.elementFromPoint(x, y); return !!e && !!e.closest('#live-btn'); };
    const cx = b.left + b.width / 2, cy = b.top + b.height / 2;
    let top = cy, bottom = cy, left = cx, right = cx;
    while (on(cx, top - 1)) top--; while (on(cx, bottom + 1)) bottom++; while (on(left - 1, cy)) left--; while (on(right + 1, cy)) right++;
    return { coarse: matchMedia('(pointer: coarse)').matches, w: Math.round(right - left + 1), h: Math.round(bottom - top + 1), head: Math.round(head.height), inside: top >= head.top && bottom <= head.bottom, label: [Math.round(b.top), Math.round(b.bottom)] };
  });
  ok(r.coarse && r.w >= 44 && r.h >= 44 && r.head === 64 && r.inside, 'dashboard (fix 5): "Pause updates" has a 44x44 hit area at 390 under a coarse pointer; the head stays 64px', JSON.stringify(r));
  await ctx.close();
}

// ---------- Round 4.1, further down the critic's list ----------
for (const w of [390, 768]) {
  const p = await open('coffee.html', w);
  const r = await p.evaluate(() => {
    const more = document.querySelector('.shop .margin-label .more').getBoundingClientRect().top;
    const h2 = document.getElementById('shop-title').getBoundingClientRect().top;
    const last = [...document.querySelectorAll('.shop .lots > li')].pop().getBoundingClientRect().bottom;
    return { more: Math.round(more), h2: Math.round(h2), last: Math.round(last) };
  });
  ok(r.more > r.h2 && r.more > r.last, `coffee shop ${w}: "See all 9 coffees" follows its heading and the three lots`, JSON.stringify(r));
  await p.context().close();
}
{
  const p = await open('coffee-states.html', 1440);
  const r = await p.evaluate(() => [...document.querySelectorAll('.menu-toggle')].filter((e) => e.getClientRects().length).length);
  ok(r >= 4, `coffee state sheet 1440: the menu toggle's states render (${r} shown)`);
  await p.context().close();
}
{
  const p = await open('dashboard.html', 1440);
  const r = await p.evaluate(() => {
    const panel = document.querySelector('.split > .panel[aria-labelledby=plat-title]');
    const note = document.getElementById('plat-note');
    const times = [...document.querySelectorAll('#pages-body td.t-time')].map((e) => e.textContent);
    return { slack: Math.round(panel.getBoundingClientRect().bottom - note.getBoundingClientRect().bottom), times };
  });
  ok(r.slack <= 24 && r.times.every((t) => !/^0m/.test(t)), 'dashboard: the platform panel ends with its footnote; durations under a minute read "58s", not "0m 58s"', JSON.stringify(r));
  await p.context().close();
}

// ---------- Tools: the lint now catches each class (fixture tools/fixtures/bad-tokens.html; good.html passes) ----------
{
  const { execFileSync } = await import('node:child_process');
  const root = path.resolve(here, '../../..');
  const out = path.join(process.env.TMPDIR || '/tmp', 'r41-lint');
  fs.mkdirSync(out, { recursive: true });
  const run = (f) => { try { execFileSync('node', [path.join(root, 'tools/lint.mjs'), path.join(root, 'tools/fixtures', f), '--out-dir', out, '--quiet', '--no-fallback'], { stdio: 'pipe' }); } catch { /* exit 1 on fail */ } return JSON.parse(fs.readFileSync(path.join(out, f.replace('.html', '.lint.json')), 'utf8')); };
  const bad = run('bad-tokens.html'), good = run('good.html');
  const msgs = (c) => (bad.checks[c] && bad.checks[c].fail || []).map((x) => x.message).join(' | ');
  ok(/--color-warning-mark/.test(msgs('undefined-var')) && /raw color/.test(msgs('state-layer')) && /4%/.test(msgs('state-layer')) && /gap plus a no-break space/.test(msgs('double-space')) && /two spaces in a row/.test(msgs('double-space'))
    && /alert that explains it, is hidden/.test(msgs('truth')) && /paints no fill/.test(msgs('proportion')) && good.summary.fails === 0,
    'tools: lint fails bad-tokens.html on undefined-var, state-layer (raw and 4%), double-space (gap and spaces), truth (explained-by) and proportion (empty meter); good.html passes');
}

// ---------- Round 4.2: the round 4.1 critic's judged fails (kb/reviews/round4.1-critic.md, section 4) ----------
// Coffee 16: one cancel promise, one wording, in band, slip (2 and 4 weeks), cart, checkout and the sheet.
{
  const PROMISE = 'Skip, swap, pause or cancel online any time before a roast';
  const seen = new Map();
  const grab = async (url, w = 1440) => {
    const p = await open(url, w);
    const t = (await visibleText(p)).replace(/ /g, ' ');
    for (const m of t.matchAll(/Skip, [a-z, ]*?or cancel[a-z ,]*?roast/g)) seen.set(m[0].trim(), (seen.get(m[0].trim()) || []).concat(url));
    await p.context().close();
    return t;
  };
  const band = await grab('coffee.html');
  const cart = await grab('coffee.html?state=cart');
  const co = await grab('coffee.html?state=checkout');
  const plan4 = await grab('coffee.html?state=plan-4');
  const sheet = await grab('coffee-states.html');
  const where = [band, cart, co, plan4, sheet].map((t) => t.includes(PROMISE));
  ok(seen.size === 1 && seen.has(PROMISE) && where.every(Boolean), `coffee 16: one cancel promise ("${PROMISE}") on page, cart, checkout, 4-week slip and sheet`, JSON.stringify({ variants: [...seen.keys()], where }));
  const src = fs.readFileSync(path.join(here, 'coffee.src.html'), 'utf8') + fs.readFileSync(path.join(here, 'states.mjs'), 'utf8');
  const variants = new Set([...src.matchAll(/Skip, [a-z, ]*?or cancel[a-z ,]*/g)].map((m) => m[0]));
  ok(variants.size === 1, 'coffee 16: the source holds one "Skip, ... or cancel" wording', JSON.stringify([...variants]));
}
// Coffee 13: the label curve reads a semantic illustration token, fixed in both themes (printed ink on a photo).
{
  const r = {};
  for (const scheme of ['light', 'dark']) {
    const p = await open('coffee.html', 1440, { scheme });
    r[scheme] = await p.evaluate(() => ({ stroke: getComputedStyle(document.querySelector('.print .lcurve')).stroke }));
    await p.context().close();
  }
  const src = fs.readFileSync(path.join(here, 'coffee.src.html'), 'utf8');
  ok(/\.print \.lcurve \{[^}]*stroke: var\(--color-illustration-ink-accent\)/.test(src) && !/\.print[^{]*\{[^}]*(?:--color-orange-|#2a221b)/.test(src) && r.light.stroke === r.dark.stroke && r.light.stroke === 'rgb(147, 55, 1)',
    'coffee 13: the label curve and ink use --color-illustration-ink(-accent), no primitive or raw hex in .print rules; the curve is the same orange in both themes', JSON.stringify(r));
}
// Dashboard 11: the invite error is icon plus text, on the page (after a bad submit) and on the sheet.
{
  const p = await open('dashboard.html?state=first-run', 1440);
  const shown = await p.evaluate(() => !!document.getElementById('invite-email').getClientRects().length);
  const r = { shown };
  if (shown) {
    await p.fill('#invite-email', 'sam@');
    await p.click('#invite-form button[type=submit]');
    r.err = await p.evaluate(() => { const m = document.getElementById('invite-msg'); const i = m.querySelector('svg[data-icon=error-12]'); const b = i && i.getBoundingClientRect(); return { text: m.textContent, icon: !!i && b.width === 12 && b.height === 12, color: i && getComputedStyle(i).color, msg: getComputedStyle(m).color, invalid: document.getElementById('invite-email').getAttribute('aria-invalid') }; });
    await p.fill('#invite-email', 'sam@acme.com');
    await p.click('#invite-form button[type=submit]');
    r.okMsg = await p.evaluate(() => { const m = document.getElementById('invite-msg'); return { text: m.textContent, icons: m.querySelectorAll('svg').length }; });
  }
  await p.context().close();
  ok(shown && r.err.icon && r.err.color === r.err.msg && /Add the rest of the address/.test(r.err.text) && r.err.invalid === 'true' && r.okMsg.icons === 0 && /Invite sent/.test(r.okMsg.text),
    'dashboard 11: the invite error carries the 12px error icon in the error color beside its text; the success line has none', JSON.stringify(r));
  const s = await open('dashboard-states.html', 1440);
  const sr = await s.evaluate(() => { const m = document.getElementById('inv-err'); return { icon: !!m.querySelector('svg[data-icon=error-12]'), text: m.textContent }; });
  ok(sr.icon, 'dashboard 11: the sheet\'s "Invite field, error" cell shows the same icon plus text', JSON.stringify(sr));
  await s.context().close();
}
// Dashboard 13: logo and rail tooltip on semantic tokens; the dark tooltip has a visible edge against what it floats over.
{
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  const cr = (a, b) => { const x = L(a), y = L(b); return Math.round((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) * 100) / 100; };
  const res = {};
  for (const scheme of ['light', 'dark']) {
    const p = await open('dashboard.html', 900, { scheme });
    await p.locator('.sidebar .nav a[data-tip="Events"]').hover();
    const box = await p.evaluate(() => {
      const a = document.querySelector('.sidebar .nav a[data-tip="Events"]'), cs = getComputedStyle(a, '::after'), r = a.getBoundingClientRect();
      const w = parseFloat(cs.width), h = parseFloat(cs.height);
      return { x: r.right + 12, y: r.top + r.height / 2 - h / 2, w, h, logo: getComputedStyle(document.querySelector('.logo')).color };
    });
    const png = await p.screenshot({ clip: { x: Math.round(box.x) - 8, y: Math.round(box.y) - 8, width: Math.round(box.w) + 16, height: Math.round(box.h) + 16 } });
    const px = await p.evaluate(async ({ b64 }) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
      const at = (x, y) => [...g.getImageData(x, y, 1, 1).data].slice(0, 3);
      const my = Math.round(img.height / 2);
      return { outside: at(3, my), edge: at(7, my), inside: at(14, my), outsideR: at(img.width - 3, my) };
    }, { b64: png.toString('base64') });
    res[scheme] = { ...px, w: box.w, logo: box.logo, boxVsOutside: cr(px.inside, px.outside), edgeVsOutside: cr(px.edge, px.outside), edgeVsOutsideR: cr(px.edge, px.outsideR) };
    await p.context().close();
  }
  const src = fs.readFileSync(path.join(here, 'dashboard.src.html'), 'utf8');
  ok(/\.logo \{[^}]*color: var\(--color-on-brand\)/.test(src) && /\[data-tip\]:hover::after[^{]*\{[^}]*background: var\(--color-tooltip-bg\); color: var\(--color-tooltip-text\)/.test(src),
    'dashboard 13: .logo uses --color-on-brand and the rail tooltip --color-tooltip-bg and -text (no primitives in either rule)');
  ok(res.light.boxVsOutside >= 3 && res.dark.edgeVsOutside >= 3 && res.dark.edgeVsOutsideR >= 3 && res.light.logo === res.dark.logo,
    `dashboard 13: the rail tooltip stands off its surface (light box ${res.light.boxVsOutside}:1; dark edge ${res.dark.edgeVsOutside}:1 and ${res.dark.edgeVsOutsideR}:1, box ${res.dark.boxVsOutside}:1); logo glyph one color in both themes`, JSON.stringify(res));
}
// Tools (round 4.2): primitive-in-component and error-icon fail tools/fixtures/bad-semantic.html, good.html passes;
// --states replaces the target's query; claims_inventory flags two rights lists.
{
  const { execFileSync } = await import('node:child_process');
  const root = path.resolve(here, '../../..');
  const out = path.join(process.env.TMPDIR || '/tmp', 'r42-lint');
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  const run = (f, extra = []) => { try { execFileSync('node', [path.join(root, 'tools/lint.mjs'), f, '--out-dir', out, '--quiet', '--no-fallback', ...extra], { stdio: 'pipe', cwd: root }); } catch { /* exit 1 on fail */ } };
  run('tools/fixtures/bad-semantic.html'); run('tools/fixtures/good.html');
  const bad = JSON.parse(fs.readFileSync(path.join(out, 'bad-semantic.lint.json'), 'utf8')), good = JSON.parse(fs.readFileSync(path.join(out, 'good.lint.json'), 'utf8'));
  const prim = (bad.checks['primitive-in-component'] || { fail: [] }).fail.map((x) => x.message).join(' | ');
  const err = (bad.checks['error-icon'] || { fail: [] }).fail.map((x) => x.message);
  const others = Object.entries(bad.checks).filter(([k, v]) => !['primitive-in-component', 'error-icon'].includes(k) && v.fail.length).map(([k]) => k);
  ok(/--color-orange-700/.test(prim) && /--color-slate-950/.test(prim) && /--color-slate-50\b/.test(prim) && /--color-red-600/.test(prim) && !/":root/.test(prim)
    && err.length === 2 && err.some((m) => /Add the rest/.test(m)) && err.some((m) => /Payment did not/.test(m)) && others.length === 0 && good.summary.fails === 0,
    'tools: lint fails bad-semantic.html on primitive-in-component (curve, tooltip, inline; not the :root or dark token blocks) and error-icon (2 text-only errors; the icon and "Error:" ones pass), nothing else; good.html passes', JSON.stringify({ err: err.length, others }));
  run('kb/tests/round4/coffee.html?state=removed', ['--states', 'state=checkout', '--no-truth', '--widths', '1440']);
  const st = JSON.parse(fs.readFileSync(path.join(out, 'coffee.state-checkout.lint.json'), 'utf8')).file;
  ok(st === 'kb/tests/round4/coffee.html?state=checkout', 'tools: lint --states replaces state= in a target that already has a query', st);
  const tmp = path.join(out, 'rights.html');
  fs.writeFileSync(tmp, '<!doctype html><title>x</title><p>Skip, swap or cancel online, any time before the next roast.</p><p>Skip, pause or cancel online any time before a roast.</p>');
  const inv = (a) => { try { return execFileSync('node', [path.join(root, 'skills/design-copy/assets/claims_inventory.mjs'), ...a], { encoding: 'utf8' }); } catch (e) { return String(e.stdout); } };
  const txt = inv([tmp, '--year', '2026']);
  const page = inv([path.join(here, 'coffee.html'), '--year', '2026', '--render']);
  ok(/PROMISE\s+subscription rights has 2 different values: cancel, skip, swap.*cancel, pause, skip/.test(txt) && !/subscription rights/.test(page),
    'tools: claims_inventory PROMISE flags "skip, swap or cancel" against "skip, pause or cancel"; the coffee page has one rights list');
}


await browser.close();
console.log(fails ? `${fails} checks failed` : 'all checks pass');
process.exit(fails ? 1 : 0);
