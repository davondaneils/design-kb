// Builds run-review.html and run-review-states.html from data.mjs, icons.mjs, styles.css and the inlined fonts.
// Run: node kb/tests/benchmark/round2/app/src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compute, RATES, PRORATE, ALERT_THRESHOLD_PCT } from './data.mjs';
import { icon } from './icons.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '..');
const d = compute();

// ---------- formatting (en-US, Intl; FOUNDATIONS content mechanics) ----------
const NB = ' ';
const nb = (s) => s.replace(/ /g, NB);
const money = (v, ccy) => new Intl.NumberFormat('en-US', { style: 'currency', currency: ccy }).format(v);
const usd = (c) => money(c / 100, 'USD');
const local = (v, ccy) => money(v, ccy);
const rate = (r) => r.toFixed(4);
const pct1 = (x) => x.toFixed(1) + '%';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const show = (...st) => ` data-show="${st.join(' ')}"`;
const TOTAL = usd(d.totalCents);
const PEOPLE_N = d.people.length;
const CCY_N = d.byCcy.filter((r) => r.count).length;
const T = { quote: nb('10:48 am ET'), approved: nb('10:52 am ET'), lockEnd: nb('11:22 am ET'), failed: nb('10:58 am ET') };
const PAY = nb('Fri, Oct 30');
const BANK = nb('Chase ••4410');
const held = d.held, brl = d.brl, hire = d.newHire;
const heldLocal = local(held.local, held.ccy), heldUsd = usd(held.usdCents);
const brlPct = d.brlPct.toFixed(1) + '%';
const hireLocal = local(hire.local, hire.ccy), hireMonthly = local(hire.monthly, hire.ccy), hireUsd = usd(hire.usdCents);

// shares of the total, one decimal; largest-remainder so the column sums to exactly 100.0
const raw = d.byCcy.map((r) => (r.usdCents / d.totalCents) * 1000);
const floor = raw.map(Math.floor);
let left = 1000 - floor.reduce((a, b) => a + b, 0);
raw.map((v, i) => [v - floor[i], i]).sort((a, b) => b[0] - a[0]).slice(0, left).forEach(([, i]) => floor[i]++);
const share = floor.map((v) => v / 10);

// ---------- logo, favicon ----------
const wm = fs.readFileSync(path.join(here, 'wm.svg'), 'utf8').replace(/<svg[^>]*>/, '').replace('</svg>', '');
const MARK_PATHS = '<path class="wake" d="M6.5 9.5 12 12.5l5.5-3M6 15.25c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 2.25 1.1 3 .55"/>';
const logo = (id) => `<a class="logo" href="#" aria-label="Ferry, home"${id ? ` id="${id}"` : ''}>
  <svg class="mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect class="field" width="24" height="24" rx="6"/>${MARK_PATHS}</svg>
  <svg class="word" viewBox="0 -4 320 140" aria-hidden="true" focusable="false">${wm}</svg></a>`;
// Favicon: the mark on its own field; the field swaps to blue 300 with near-black ink on dark tab strips.
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><style>.f{fill:#006ebe}.k{stroke:#fff}@media (prefers-color-scheme:dark){.f{fill:#90c6ff}.k{stroke:#101214}}</style><rect class="f" width="24" height="24" rx="6"/><path class="k" d="M6.5 9.5 12 12.5l5.5-3M6 15.25c1.5 1.3 3 1.3 4.5 0s3-1.3 4.5 0 2.25 1.1 3 .55" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const faviconPng = fs.existsSync(path.join(here, 'favicon-64.png')) ? fs.readFileSync(path.join(here, 'favicon-64.png')).toString('base64') : '';
fs.writeFileSync(path.join(here, 'favicon.svg'), faviconSvg);

// ---------- fonts ----------
const latinCss = fs.readFileSync(path.join(here, 'latin.css'), 'utf8').replace(/\/\*.*?\*\//s, '');
const rupee = fs.readFileSync(path.join(here, 'rupee.b64'), 'utf8').trim();
const fonts = latinCss + `\n@font-face { font-family: "Inter"; src: url("data:font/woff2;base64,${rupee}") format("woff2"); font-weight: 400 600; font-style: normal; font-display: swap; unicode-range: U+20B9; }\n`;
const css = fs.readFileSync(path.join(here, 'styles.css'), 'utf8').replace('/*FONTS*/', fonts);

// ---------- pieces ----------
const statusCell = (p) => {
  const def = {
    bank: ['is-danger', 'danger', 'No bank details'],
    rate: ['is-warning', 'warning', 'Rate alert'],
    prorated: ['is-info', 'info', 'Partial month'],
  }[p.flag] || ['is-ready', 'check', 'Ready'];
  const after = p.flag === 'bank' ? ['is-held', 'clock', 'Held for bank details'] : ['is-wait', 'clock', 'Pays ' + PAY];
  const failed = p.flag === 'bank' ? ['is-held', 'clock', 'Held for bank details'] : ['is-wait', 'clock', 'Waiting for funds'];
  const s = ([c, i, t]) => `<span class="status ${c}">${icon(i)}${nb(t)}</span>`;
  return `<span${show('default')}>${s(def)}</span><span${show('approved')} hidden>${s(after)}</span><span${show('error')} hidden>${s(failed)}</span>`;
};

const peopleRows = d.people.slice().sort((a, b) => b.usdCents - a.usdCents).map((p) => `
<tr role="row" data-review="${p.flag ? 1 : 0}" data-name="${esc(p.name)}" data-usd="${p.usdCents}">
  <th role="rowheader" scope="row" class="person"><a href="#${p.id}" id="${p.id}">${esc(p.name)}</a><span class="sr-only">, ${esc(p.role)}</span></th>
  <td role="cell" class="muted hide-sm hide-md">${esc(p.role)}</td>
  <td role="cell" class="muted hide-sm">${esc(p.country)}</td>
  <td role="cell" class="r hide-sm num">${local(p.local, p.ccy)}</td>
  <td role="cell" class="r num usd line1-end" data-ccy="${p.ccy}">${usd(p.usdCents)}</td>
  <td role="cell" class="hide-sm">${statusCell(p)}</td>
  <td role="cell" class="line2 show-sm">${esc(p.country)} · ${local(p.local, p.ccy)} · ${statusCell(p)}</td>
</tr>`).join('');

const ccyRows = d.byCcy.map((r, i) => {
  const alert = r.ccy === 'BRL';
  const flag = alert ? `<span class="status is-warning ccy-flag"${show('default')} data-explained-by="#alert-rate">${icon('warning')}<span class="flag-txt">${nb('Above 30-day average')}</span></span>` : '';
  return `
<tr role="row">
  <th role="rowheader" scope="row"><span class="ccy-code">${r.ccy}</span><span class="muted-name hide-md">${RATES[r.ccy].name}</span>${flag}</th>
  <td role="cell" class="r hide-sm num">${r.count}</td>
  <td role="cell" class="r hide-sm num">${local(r.localCents / 100, r.ccy)}</td>
  <td role="cell" class="r hide-sm num">${rate(r.rate)}</td>
  <td role="cell" class="r num line1-end ccy-usd" id="usd-${r.ccy}" data-sum-of="#people-table .usd[data-ccy='${r.ccy}']">${usd(r.usdCents)}</td>
  <td role="cell" class="r hide-sm"><span class="share"><span class="track" aria-hidden="true"><span class="fill" data-bar="${share[i]}" data-bar-max="100" style="inline-size:${share[i]}%"></span></span><span class="pct num">${pct1(share[i])}</span></span></td>
  <td role="cell" class="line2 show-sm">${nb(r.count + (r.count === 1 ? ' person' : ' people'))} · ${local(r.localCents / 100, r.ccy)} at ${rate(r.rate)} · ${pct1(share[i])} of total${alert ? ' · <span' + show('default') + '>above 30-day average</span>' : ''}</td>
</tr>`;
}).join('');

// ---------- the page ----------
const answer = `
<p class="answer"${show('default')}>${nb(PEOPLE_N + ' people')} in ${nb(CCY_N + ' currencies')} get paid on ${PAY}. ${nb('3 of them')} need a look before you approve: a missing bank account, a rate above your ${ALERT_THRESHOLD_PCT}% alert, and a partial month.</p>
<p class="answer"${show('approved')} hidden>Approved at ${T.approved}. Ferry is pulling ${TOTAL} from ${BANK}; ${nb((PEOPLE_N - 1) + ' people')} get paid on ${PAY} and ${esc(held.name)}’s pay waits for his bank details.</p>
<p class="answer"${show('error')} hidden>Nobody has been paid. ${nb('Chase')} rejected the funding transfer at ${T.failed}; the rates stay locked until ${T.lockEnd}, so retry before then to keep this total.</p>`;

const errorAlert = `
<div class="alerts" ${show('error').trim()} hidden>
  <div class="alert is-danger" id="alert-funding" role="alert">${icon('danger')}
    <div class="body"><div><p class="what"><span class="kind">Error:</span> the bank rejected the funding transfer of ${TOTAL} at ${T.failed}.</p>
    <p class="detail">Chase returned code R29: Ferry’s ACH company ID 1234567890 is not on this account’s debit allow list. Add it in Chase under ACH positive pay, then retry. Retrying keeps the locked rates until ${T.lockEnd}.</p></div>
    <div class="act"><a class="btn secondary" href="#">How to add the ID${icon('external')}</a></div></div></div>
</div>`;

const summary = `
<div class="summary">
  <section class="panel commit" aria-labelledby="total-label">
    <p class="label" id="total-label"><span>Total to fund, USD</span>
      <span class="badge"${show('default')}>${icon('clock')}Estimate</span>
      <span class="badge is-info"${show('approved', 'error')} hidden>${icon('lock')}Locked</span></p>
    <p class="total" id="total" data-sum-of=".ccy-usd">${TOTAL}</p>
    <p class="explain"${show('default')}>${nb(PEOPLE_N + ' payments')} converted at the rates quoted at ${T.quote}. Approving locks these rates for 30 minutes and Ferry pulls the total from ${BANK}.</p>
    <p class="explain"${show('approved')} hidden>Locked at ${T.approved} for 30 minutes. Ferry is pulling it from ${BANK} now.</p>
    <p class="explain"${show('error')} hidden>Locked at ${T.approved} for 30 minutes. The transfer from ${BANK} was rejected, so nothing has moved.</p>
    <dl class="counts">
      <div><dt>People in this run</dt><dd>${PEOPLE_N}</dd></div>
      <div><dt>Currencies</dt><dd>${CCY_N}</dd></div>
      <div><dt>Pay date</dt><dd>${PAY}</dd></div>
      <div${show('default')}><dt>Need a look</dt><dd>3</dd></div>
      <div${show('approved', 'error')} hidden><dt>Held</dt><dd>1</dd></div>
    </dl>
  </section>
  <section class="panel steps" aria-labelledby="steps-h">
    <h2 id="steps-h">How this run pays out</h2>
    <ol${show('default')}>
      <li class="is-now">${icon('check')}<div><b>You approve</b><p>Locks the rates for 30 minutes.</p></div></li>
      <li>${icon('funding')}<div><b>Ferry pulls ${TOTAL}</b><p>From ${BANK}, by ACH debit.</p></div></li>
      <li>${icon('people')}<div><b>Everyone is paid ${PAY}</b><p>In their own currency, to their own bank.</p></div></li>
    </ol>
    <ol${show('approved')} hidden>
      <li class="is-done">${icon('done')}<div><b>Approved at ${T.approved}</b><p>By you, Rachel Kim.</p></div></li>
      <li class="is-now">${icon('funding')}<div><b>Funding in progress</b><p>Rates locked until ${T.lockEnd}.</p>
        <p class="countdown" data-countdown="29"><span class="left" aria-live="off"><span class="mins">29</span>${NB}min left</span><button class="btn ghost" type="button" data-hide-countdown>Hide countdown</button></p></div></li>
      <li>${icon('people')}<div><b>Everyone is paid ${PAY}</b><p>Except ${esc(held.name)}, until he adds bank details.</p></div></li>
    </ol>
    <ol${show('error')} hidden>
      <li class="is-done">${icon('done')}<div><b>Approved at ${T.approved}</b><p>By you, Rachel Kim.</p></div></li>
      <li class="is-failed">${icon('failed')}<div><b>Funding failed at ${T.failed}</b><p>Rates locked until ${T.lockEnd}.</p>
        <p class="countdown" data-countdown="24"><span class="left" aria-live="off"><span class="mins">24</span>${NB}min left</span><button class="btn ghost" type="button" data-hide-countdown>Hide countdown</button></p></div></li>
      <li>${icon('clock')}<div><b>Pay on ${PAY} is on hold</b><p>It goes ahead once the funds arrive.</p></div></li>
    </ol>
  </section>
</div>`;

const review = `
<section class="section" aria-labelledby="review-h"${show('default')}>
  <div class="section-head"><h2 id="review-h">Needs a look <span class="count-pill num">3</span></h2><p>Approving accepts all three as they are.</p></div>
  <ul class="alerts">
    <li class="alert is-danger" id="alert-bank">${icon('danger')}<div class="body"><div>
      <p class="what"><span class="kind">No bank details:</span> ${esc(held.name)} can’t be paid yet.</p>
      <p class="detail">His ${heldLocal} (${heldUsd}) stays in your Ferry balance and goes out within 1 business day of him adding an account.</p></div>
      <div class="act"><a class="btn secondary" href="#">Ask Tomás for details</a></div></div></li>
    <li class="alert is-warning" id="alert-rate">${icon('warning')}<div class="body"><div>
      <p class="what"><span class="kind">Rate alert:</span> BRL costs ${brlPct} more than its <span class="nowrap">30-day</span> average.</p>
      <p class="detail">${esc(brl.name)}’s ${local(brl.local, 'BRL')} costs ${usd(brl.usdCents)} at ${rate(RATES.BRL.rate)}, ${usd(d.brlExtraCents)} more than at the average of ${rate(RATES.BRL.avg30)}. Your alert is set at ${ALERT_THRESHOLD_PCT}%.</p></div>
      <div class="act"><a class="btn secondary" href="#">BRL rate history</a></div></div></li>
    <li class="alert is-info" id="alert-hire">${icon('info')}<div class="body"><div>
      <p class="what"><span class="kind">Partial month:</span> ${esc(hire.name)} started on ${nb(PRORATE.start)}.</p>
      <p class="detail">She is paid for ${PRORATE.days} of ${PRORATE.of} days: ${hireLocal} (${hireUsd}) of her ${hireMonthly} monthly pay.</p></div>
      <div class="act"><a class="btn secondary" href="#">Check proration</a></div></div></li>
  </ul>
</section>
<section class="section" aria-labelledby="held-h"${show('approved', 'error')} hidden>
  <div class="section-head"><h2 id="held-h">Held <span class="count-pill num">1</span></h2></div>
  <ul class="alerts">
    <li class="alert is-info">${icon('clock')}<div class="body"><div>
      <p class="what">${esc(held.name)}’s pay is held for bank details.</p>
      <p class="detail">${heldLocal} (${heldUsd}) is part of the locked total and stays in your Ferry balance until he adds an account.</p></div>
      <div class="act"><a class="btn secondary" href="#">Ask Tomás for details</a></div></div></li>
  </ul>
</section>`;

const ccyTable = `
<section class="section" aria-labelledby="ccy-h">
  <div class="section-head"><h2 id="ccy-h">By currency</h2><p>Rates are units per 1 USD, quoted at ${T.quote}.</p></div>
  <div class="table-wrap">
    <table class="data ccy" role="table" aria-labelledby="ccy-h">
      <thead role="rowgroup"><tr role="row">
        <th role="columnheader" scope="col">Currency</th><th role="columnheader" scope="col" class="r">People</th><th role="columnheader" scope="col" class="r">Amount</th>
        <th role="columnheader" scope="col" class="r">Rate per USD</th><th role="columnheader" scope="col" class="r">USD</th><th role="columnheader" scope="col" class="r">Share of total</th>
      </tr></thead>
      <tbody role="rowgroup">${ccyRows}</tbody>
      <tfoot role="rowgroup"><tr role="row"><th role="rowheader" scope="row">Total</th><td role="cell" class="r hide-sm num">${PEOPLE_N}</td><td role="cell" class="hide-sm"></td><td role="cell" class="hide-sm"></td>
        <td role="cell" class="r num line1-end" data-derived-from="same #total">${TOTAL}</td><td role="cell" class="r hide-sm num">100.0%</td>
        <td role="cell" class="line2 show-sm">${nb(PEOPLE_N + ' people')} · each payment converted, then rounded to the cent</td></tr></tfoot>
    </table>
  </div>
</section>`;

const peopleTable = `
<section class="section" aria-labelledby="people-h">
  <div class="section-head"><h2 id="people-h">People in this run <span class="count-pill num" id="people-count">${PEOPLE_N}</span></h2>
    <div class="seg" role="group" aria-label="Show"${show('default')}>
      <button type="button" aria-pressed="true" data-filter="all">All ${PEOPLE_N}</button>
      <button type="button" aria-pressed="false" data-filter="review">Needs a look 3</button>
    </div></div>
  <div class="table-wrap">
    <table class="data people" id="people-table" role="table" aria-labelledby="people-h">
      <thead role="rowgroup"><tr role="row">
        <th role="columnheader" scope="col" data-key="name"><button class="sort" type="button">Person${icon('sortUp')}</button></th>
        <th role="columnheader" scope="col" class="hide-md">Role</th><th role="columnheader" scope="col">Country</th>
        <th role="columnheader" scope="col" class="r">Amount</th>
        <th role="columnheader" scope="col" class="r" data-key="usd" aria-sort="descending"><button class="sort" type="button">USD${icon('sortDown')}</button></th>
        <th role="columnheader" scope="col">Status</th>
      </tr></thead>
      <tbody role="rowgroup">${peopleRows}</tbody>
    </table>
  </div>
</section>`;

const skeleton = `
<div class="loading" aria-hidden="true"${show('loading')} hidden>
  <div class="summary">
    <div class="panel commit"><span class="sk t14" style="inline-size:9rem"></span><span class="sk t39" style="inline-size:16rem"></span><span class="sk t14" style="inline-size:70%"></span>
      <div class="counts">${'<div><span class="sk t14" style="inline-size:6rem"></span><span class="sk t20" style="inline-size:3rem"></span></div>'.repeat(4)}</div></div>
    <div class="panel steps"><span class="sk t14" style="inline-size:10rem"></span>${'<span class="sk t14" style="inline-size:80%"></span>'.repeat(3)}</div>
  </div>
  <div class="table-wrap">${'<div class="sk-line" style="padding:0 var(--space-5);block-size:40px"><span class="sk t14" style="inline-size:60%"></span></div>'.repeat(8)}</div>
</div>`;

const empty = `
<section class="panel empty" aria-labelledby="empty-h"${show('empty')} hidden>
  ${icon('runs')}
  <h2 id="empty-h">No October run yet</h2>
  <p>Ferry drafts the run from your People list and each person’s pay, converts it at the current rates, and flags anything that needs a look. Nothing is paid until you approve.</p>
  <p>Your next pay date is ${PAY}.</p>
</section>`;

const confirm = `
<dialog id="confirm" aria-labelledby="confirm-h" aria-describedby="confirm-d">
  <form method="dialog" class="dlg">
    <h2 id="confirm-h">Approve ${TOTAL} for ${nb(PEOPLE_N + ' people')}?</h2>
    <p id="confirm-d">This locks the rates quoted at ${T.quote} for 30 minutes and Ferry pulls ${TOTAL} from ${BANK}. Everyone is paid on ${PAY}. You are also accepting:</p>
    <ul>
      <li class="is-danger">${icon('danger')}<div><b>${esc(held.name)} has no bank details.</b> <span>${heldLocal} (${heldUsd}) is held in your Ferry balance, not sent on ${PAY}.</span></div></li>
      <li class="is-warning">${icon('warning')}<div><b>BRL costs ${brlPct} more than its <span class="nowrap">30-day</span> average.</b> <span>+${usd(d.brlExtraCents)} on ${esc(brl.name)}’s pay.</span></div></li>
      <li class="is-info">${icon('info')}<div><b>${esc(hire.name)} is paid for ${PRORATE.days} of ${PRORATE.of} days.</b> <span>${hireLocal} (${hireUsd}).</span></div></li>
    </ul>
    <div class="sr-only" role="status" id="dlg-live"></div>
    <div class="foot">
      <button class="btn secondary lg" value="cancel" type="submit">Keep reviewing</button>
      <button class="btn primary lg" value="approve" type="submit" id="confirm-approve"><span class="lbl">Approve ${TOTAL}</span><span class="spin" aria-hidden="true"></span></button>
    </div>
  </form>
</dialog>`;

const headActions = `
<div class="head-actions">
  <span class="badge"${show('default')}>${icon('clock')}Draft</span>
  <span class="badge is-info"${show('approved')} hidden>${icon('funding')}Funding</span>
  <span class="badge is-danger"${show('error')} hidden>${icon('danger')}Funding failed</span>
  <span class="badge"${show('empty')} hidden>${icon('runs')}Not drafted</span>
  <button class="btn primary" type="button" data-open-confirm${show('default')}><span class="lbl">Approve ${TOTAL}</span><span class="spin" aria-hidden="true"></span></button>
  <button class="btn primary" type="button" data-retry${show('error')} hidden><span class="lbl">Retry funding ${TOTAL}</span><span class="spin" aria-hidden="true"></span></button>
  <button class="btn primary" type="button" data-draft${show('empty')} hidden><span class="lbl">Draft October run</span><span class="spin" aria-hidden="true"></span></button>
  <button class="btn primary" type="button" aria-disabled="true" aria-busy="true"${show('loading')} hidden><span class="lbl">Approve run</span><span class="spin" aria-hidden="true"></span></button>
</div>`;

const commitBar = `
<div class="commit-bar"${show('default', 'error', 'empty', 'loading')}>
  <button class="btn primary lg" type="button" data-open-confirm${show('default')}><span class="lbl">Approve ${TOTAL}</span><span class="spin" aria-hidden="true"></span></button>
  <button class="btn primary lg" type="button" data-retry${show('error')} hidden><span class="lbl">Retry funding ${TOTAL}</span><span class="spin" aria-hidden="true"></span></button>
  <button class="btn primary lg" type="button" data-draft${show('empty')} hidden><span class="lbl">Draft October run</span><span class="spin" aria-hidden="true"></span></button>
  <button class="btn primary lg" type="button" aria-disabled="true" aria-busy="true"${show('loading')} hidden><span class="lbl">Approve run</span><span class="spin" aria-hidden="true"></span></button>
</div>`;

const nav = `
<aside class="sidebar" id="sidebar" aria-label="Ferry">
  ${logo()}
  <div class="workspace"><b>Northwind Labs</b><span class="sample-tag">${icon('info')}Sample workspace: example names and pay</span></div>
  <nav class="nav" aria-label="Main">
    <ul>
      <li><a href="#">${icon('home')}Home</a></li>
      <li><a href="#" aria-current="page">${icon('runs')}Payroll runs</a></li>
      <li><a href="#">${icon('people')}People</a></li>
      <li><a href="#">${icon('funding')}Funding</a></li>
      <li><a href="#">${icon('reports')}Reports</a></li>
    </ul>
    <div><h2>Workspace</h2><ul><li><a href="#">${icon('settings')}Settings</a></li><li><a href="#">${icon('help')}Help</a></li></ul></div>
  </nav>
</aside>`;

const script = fs.readFileSync(path.join(here, 'app.js'), 'utf8');

const head = (title, extra = '') => `<!doctype html>
<html lang="en-US" data-lint-page="${extra.includes('state-sheet') ? 'state-sheet' : 'app'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="robots" content="noindex, nofollow">
<!-- Production: send X-Robots-Tag: noindex, nofollow on every app response; unauthenticated requests redirect to login; no robots.txt Disallow on /app. -->
<meta name="color-scheme" content="light dark">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#181a1d">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(faviconSvg)}">
${faviconPng ? `<link rel="icon" type="image/png" sizes="64x64" href="data:image/png;base64,${faviconPng}">` : ''}
<style>${css}</style>
</head>`;

const page = `${head('October 2026 run · Payroll · Ferry')}
<body class="has-commit">
<a class="skip" href="#main">Skip to content</a>
<div class="app">
  <div class="topbar">${logo()}<button class="btn secondary" type="button" id="menu-btn" aria-expanded="false" aria-controls="sidebar">${icon('menu', 'menu-i')}${icon('close', 'close-i')}<span class="menu-lbl">Menu</span></button></div>
  ${nav}
  <div class="scrim" hidden></div>
  <main id="main" tabindex="-1">
    <header class="page-head">
      <div class="title-group"><a class="crumb" href="#">Payroll runs</a><span class="sep" aria-hidden="true">/</span><h1>October 2026 run</h1></div>
      ${headActions}
    </header>
    <div class="content" id="content">
      ${skeleton}
      ${empty}
      <div class="ready" data-show="default approved error" style="display:contents">
        ${errorAlert}
        ${answer}
        ${summary}
        ${review}
        ${ccyTable}
        ${peopleTable}
      </div>
    </div>
  </main>
  ${commitBar}
</div>
${confirm}
<div class="sr-only" role="status" id="live"></div>
<script>${script}</script>
</body>
</html>
`;
fs.writeFileSync(path.join(out, 'run-review.html'), page);

// ---------- state sheet ----------
const btnRow = (cls, label) => ['rest', 'hover', 'pressed', 'focus', 'disabled', 'busy'].map((s) => {
  const a = s === 'disabled' ? ' aria-disabled="true"' : s === 'busy' ? ' aria-busy="true"' : '';
  const c = s === 'hover' ? ' is-hover' : s === 'pressed' ? ' is-pressed' : s === 'focus' ? ' is-focus' : '';
  return `<div class="cell"><span class="cap">${s}</span><button class="btn ${cls}${c}" type="button"${a}><span class="lbl">${label}</span><span class="spin" aria-hidden="true"></span></button></div>`;
}).join('');
const sheet = `${head('Run review state sheet · Ferry', 'state-sheet')}
<body>
<style>
  .sheet { display: grid; gap: var(--space-8); padding: var(--space-7) var(--space-5); max-inline-size: 1200px; margin-inline: auto; }
  .sheet h1 { font-size: var(--text-xl); line-height: 32px; white-space: normal; }
  .sheet h2 { font-size: var(--text-base); line-height: 24px; }
  .sheet > p { color: var(--color-text-muted); max-inline-size: var(--size-measure); }
  .row { display: flex; flex-wrap: wrap; gap: var(--space-5); align-items: end; }
  .cell { display: grid; gap: var(--space-3); justify-items: start; }
  .cap { font-size: var(--text-xs); line-height: 16px; color: var(--color-text-muted); }
  .btn.primary.is-hover { background: var(--color-primary-hover); }
  .btn.secondary.is-hover, .btn.ghost.is-hover { background: var(--state-hover); }
  .is-focus { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
  .seg button.is-hover { background: var(--state-hover); color: var(--color-text); }
  .panels { display: grid; gap: var(--space-6); grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr)); }
  .panels .panel { padding: var(--space-6); display: grid; gap: var(--space-3); align-content: start; }
  .panels .panel p { color: var(--color-text-muted); }
  .field { display: grid; gap: var(--space-2); max-inline-size: 20rem; }
  .field label { font-weight: var(--weight-medium); }
  .field input { min-block-size: var(--size-control-md); padding: 0 var(--space-4); border: 1px solid var(--color-border-strong); border-radius: var(--radius-md); background: var(--color-surface); font-size: var(--text-base); }
  .field input[aria-invalid="true"] { border-color: var(--color-danger); box-shadow: inset 0 0 0 1px var(--color-danger); }
  @media (width < 40rem) { .field input { min-block-size: var(--size-control-lg); } }
  .field .err { display: flex; gap: var(--space-3); align-items: start; color: var(--color-danger); }
  .field .err .i { margin-block-start: var(--space-1); }
</style>
<main id="main" class="sheet">
  <h1>Run review: every control in every state</h1>
  <p>Sample data. Rest, hover, pressed, focus, disabled and busy side by side, in the page’s own tokens, for both themes. Pressed is one ramp step past hover; disabled is a neutral fill, never the brand at reduced opacity.</p>
  <section class="cell"><h2>Primary: Approve</h2><div class="row">${btnRow('primary', 'Approve ' + TOTAL)}</div></section>
  <section class="cell"><h2>Secondary</h2><div class="row">${btnRow('secondary', 'Ask Tomás for details')}</div></section>
  <section class="cell"><h2>Ghost</h2><div class="row">${btnRow('ghost', 'Hide countdown')}</div></section>
  <section class="cell"><h2>Filter (segmented)</h2><div class="row">
    <div class="cell"><span class="cap">selected, unselected</span><div class="seg" role="group" aria-label="Show"><button type="button" aria-pressed="true">All ${PEOPLE_N}</button><button type="button" aria-pressed="false">Needs a look 3</button></div></div>
    <div class="cell"><span class="cap">unselected hover</span><div class="seg" role="group" aria-label="Show, hover"><button type="button" aria-pressed="true">All ${PEOPLE_N}</button><button type="button" aria-pressed="false" class="is-hover">Needs a look 3</button></div></div>
    <div class="cell"><span class="cap">focus</span><div class="seg" role="group" aria-label="Show, focus"><button type="button" aria-pressed="false">All ${PEOPLE_N}</button><button type="button" aria-pressed="true" class="is-focus">Needs a look 3</button></div></div>
  </div></section>
  <section class="cell"><h2>Navigation</h2><nav class="nav" aria-label="Sample navigation"><ul style="inline-size:15rem">
    <li><a href="#">${icon('home')}Home (rest)</a></li><li><a href="#" aria-current="page">${icon('runs')}Payroll runs (current)</a></li><li><a href="#" class="is-focus">${icon('people')}People (focus)</a></li></ul></nav></section>
  <section class="cell"><h2>Field: invalid</h2>
    <div class="field"><label for="acct">Account number</label><input id="acct" name="acct" inputmode="numeric" value="12345" aria-invalid="true" aria-describedby="acct-err"><p class="err" id="acct-err">${icon('danger')}Account number is too short. It needs at least 8 digits.</p></div></section>
  <section class="cell"><h2>Panels</h2><div class="panels">
    <div class="panel"><h3>Ready</h3><p class="total" style="font-size:var(--text-2xl);line-height:36px">${TOTAL}</p><p>Total to fund, USD (estimate).</p></div>
    <div class="panel loading"><h3>Loading</h3><span class="sk t14" style="inline-size:9rem"></span><span class="sk t39" style="inline-size:14rem"></span><span class="sk t14" style="inline-size:80%"></span></div>
    <div class="panel" data-data="none"><h3>Empty</h3><p>No October run yet. Ferry drafts it from your People list.</p></div>
    <div class="panel"><h3>Error</h3><p class="status is-danger">${icon('danger')}Funding transfer rejected by the bank.</p><p>Nothing has moved. Retry keeps the locked rates.</p></div>
    <div class="panel"><h3>Partial</h3><p class="status is-held">${icon('clock')}1 of ${PEOPLE_N} held for bank details.</p><p>The other ${PEOPLE_N - 1} are paid on ${PAY}.</p></div>
  </div></section>
  <section class="cell"><h2>Status glyphs</h2><div class="row">
    <span class="status is-ready">${icon('check')}Ready</span><span class="status is-danger">${icon('danger')}No bank details</span><span class="status is-warning">${icon('warning')}Rate alert</span><span class="status is-info">${icon('info')}Partial month</span><span class="status is-held">${icon('clock')}Held</span>
  </div></section>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(out, 'run-review-states.html'), sheet);
console.log('built', 'total', TOTAL, 'shares', share.join(','), 'sum', share.reduce((a, b) => a + b, 0).toFixed(1));
