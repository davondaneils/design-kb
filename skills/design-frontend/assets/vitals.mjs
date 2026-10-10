#!/usr/bin/env node
// Lab Core Web Vitals for one page, in a throttled Chromium run: LCP, CLS, an INP proxy from scripted interactions, FCP, TBT,
// wire bytes, main-thread cost. Lab numbers are a regression check, not field data (CrUX p75 is the real test).
//
// Usage:
//   node vitals.mjs <page.html[?query]> [--runs 5] [--profile mobile|desktop|none] [--encoding gzip|br|none]
//        [--repeat] [--storage key=value,...] [--interact "click:.add-btn; type:#email=dana@; press:Enter; hover:#chart-svg"] [--json out.json] [--quiet]
//
// Profiles (Lighthouse defaults, github.com/GoogleChrome/lighthouse docs/throttling.md and core/config/constants.js):
//   mobile  412x823 at DPR 1.75, touch, CPU 4x slowdown, 150 ms latency, 1.6 Mbps down, 750 Kbps up (Lighthouse "slow 4G")
//   desktop 1350x940 at DPR 1, CPU 1x, 40 ms latency, 10 Mbps down
//   none    412x823, no throttling (to see the page's own cost)
// CPU and bandwidth are throttled with CDP (Emulation.setCPUThrottlingRate, Network.emulateNetworkConditions). Latency is
// added by the local server (CDP latency is not applied to 127.0.0.1 here): one RTT per request, three for the first
// (cold TCP and TLS). There is no TCP slow start, so lab LCP is lower than Lighthouse's simulated LCP on the same page.
// The page is served over local HTTP with real compression so throttling sees wire bytes (file: URLs are never throttled).
//
// --storage seeds localStorage before any page script runs (a returning user's saved preferences).
// --repeat measures a second visit with the HTTP cache warm (the server sends no-cache, so the HTML is revalidated
// and re-sent; separate font and script files are reused): the cost an app pays on every navigation.
//
// INP proxy: each --interact step is one interaction; its latency is the longest Event Timing entry sharing its
// interactionId (durationThreshold 16 ms, the minimum). With fewer than 50 interactions INP is the worst one (web.dev/articles/inp).
import fs from 'node:fs';
import path from 'node:path';
import { launch, serve, median, parseArgs } from './pw.mjs';

const opts = parseArgs(process.argv.slice(2), ['runs', 'profile', 'encoding', 'interact', 'json', 'storage']);
const target = opts._[0];
if (!target) { console.error('Usage: node vitals.mjs <page.html[?query]> [--runs 5] [--profile mobile|desktop|none] [--interact "..."] [--json out.json]'); process.exit(2); }
const runs = Number(opts.runs || 5);
const profile = opts.profile || 'mobile';
const P = {
  mobile: { viewport: { width: 412, height: 823 }, dpr: 1.75, mobile: true, cpu: 4, net: { latency: 150, down: 1.6e6 / 8, up: 750e3 / 8 } },
  desktop: { viewport: { width: 1350, height: 940 }, dpr: 1, mobile: false, cpu: 1, net: { latency: 40, down: 10.24e6 / 8, up: 10.24e6 / 8 } },
  none: { viewport: { width: 412, height: 823 }, dpr: 1.75, mobile: true, cpu: 1, net: null },
}[profile];
if (!P) { console.error('unknown --profile'); process.exit(2); }

const q = target.indexOf('?');
const file = path.resolve(q === -1 ? target : target.slice(0, q));
const query = q === -1 ? '' : target.slice(q);
const steps = (opts.interact || '').split(';').map((s) => s.trim()).filter(Boolean).map((s) => {
  const i = s.indexOf(':'); return { kind: s.slice(0, i), arg: s.slice(i + 1) };
});

// Runs in the page before any script: collects paint, LCP, CLS session windows, long tasks and event timing.
const probe = () => {
  const v = window.__vitals = { lcp: null, lcpEl: null, lcpSize: 0, fcp: null, shifts: [], long: [], events: [], fontsReady: null, inputAt: null };
  const desc = (el) => { if (!el) return null; const t = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.classList.length ? '.' + [...el.classList].join('.') : '') + (t ? ` "${t}"` : ''); };
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (v.inputAt == null) { v.lcp = e.startTime; v.lcpEl = desc(e.element); v.lcpSize = e.size; } }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') v.fcp = e.startTime; }).observe({ type: 'paint', buffered: true }); } catch {}
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) v.shifts.push({ t: e.startTime, value: e.value, input: e.hadRecentInput,
    src: (e.sources || []).map((s) => desc(s.node)).filter(Boolean).slice(0, 3) }); }).observe({ type: 'layout-shift', buffered: true }); } catch {}
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) v.long.push({ t: e.startTime, d: e.duration }); }).observe({ type: 'longtask', buffered: true }); } catch {}
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.interactionId) v.events.push({ id: e.interactionId, name: e.name, d: e.duration,
    input: e.processingStart - e.startTime, proc: e.processingEnd - e.processingStart }); }).observe({ type: 'event', buffered: true, durationThreshold: 16 }); } catch {}
  addEventListener('pointerdown', () => { if (v.inputAt == null) v.inputAt = performance.now(); }, { capture: true, once: true });
  addEventListener('keydown', () => { if (v.inputAt == null) v.inputAt = performance.now(); }, { capture: true, once: true });
  if (document.fonts) document.fonts.ready.then(() => { v.fontsReady = performance.now(); });
};

function cls(shifts) { // largest session window: gaps under 1 s, window at most 5 s (web.dev/articles/cls)
  let best = 0, cur = 0, start = 0, last = -Infinity;
  for (const s of shifts.filter((x) => !x.input)) {
    if (s.t - last > 1000 || s.t - start > 5000) { cur = 0; start = s.t; }
    cur += s.value; last = s.t; best = Math.max(best, cur);
  }
  return best;
}

const { server, origin, cold } = await serve(path.dirname(file), { encoding: opts.encoding || 'gzip', latency: P.net ? P.net.latency : 0 });
const url = origin + '/' + encodeURIComponent(path.basename(file)) + query;
const browser = await launch();
const results = [];
try {
  for (let r = 0; r < runs; r++) {
    const context = await browser.newContext({ viewport: P.viewport, deviceScaleFactor: P.dpr, isMobile: P.mobile, hasTouch: P.mobile });
    const page = await context.newPage();
    await page.addInitScript(probe);
    if (opts.storage) await page.addInitScript((pairs) => { for (const kv of pairs) { const i = kv.indexOf('='); try { localStorage.setItem(kv.slice(0, i), kv.slice(i + 1)); } catch {} } }, opts.storage.split(','));
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Performance.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: !opts.repeat });
    if (P.cpu > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: P.cpu });
    if (P.net) await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: P.net.latency, downloadThroughput: P.net.down, uploadThroughput: P.net.up });
    let bytes = 0, requests = 0, docBytes = 0;
    const urls = new Map(); let docId = null;
    cdp.on('Network.requestWillBeSent', (e) => { urls.set(e.requestId, e.request.url); if (e.type === 'Document' && !docId) docId = e.requestId; });
    cdp.on('Network.loadingFinished', (e) => { if (/^data:/.test(urls.get(e.requestId) || '')) return; bytes += e.encodedDataLength; requests++; if (e.requestId === docId) docBytes = e.encodedDataLength; });
    cold();
    if (opts.repeat) { await page.goto(url, { waitUntil: 'load', timeout: 120000 }); await page.waitForTimeout(500); await page.goto('about:blank'); bytes = 0; requests = 0; docId = null; cold(); }
    const t0 = Date.now();
    await page.goto(url, { waitUntil: 'load', timeout: 120000 });
    const loadMs = Date.now() - t0;
    await page.waitForTimeout(1500); // let LCP settle and late shifts land
    const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { ttfb: n.responseStart, dcl: n.domContentLoadedEventEnd, load: n.loadEventEnd, html: n.transferSize, dom: document.getElementsByTagName('*').length }; });
    const perf = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));
    // Interactions: one step = one interaction. Throttling stays on, as for a user on the same phone.
    const names = [];
    for (const s of steps) {
      try {
        if (s.kind === 'click') await page.locator(s.arg).first().click({ timeout: 5000 });
        else if (s.kind === 'clickall') { for (const h of await page.locator(s.arg).all()) { if (await h.isVisible()) { await h.click({ timeout: 5000 }); names.push('click ' + s.arg); await page.waitForTimeout(300); } } continue; }
        else if (s.kind === 'type') { const [sel, text] = s.arg.split('='); await page.locator(sel).first().click({ timeout: 5000 }); names.push('click ' + sel); await page.waitForTimeout(300); await page.keyboard.type(text, { delay: 60 }); names.push(...[...text].map((c) => 'key ' + c)); await page.waitForTimeout(300); continue; }
        else if (s.kind === 'press') await page.keyboard.press(s.arg);
        else if (s.kind === 'hover') { const b = await page.locator(s.arg).first().boundingBox(); if (b) for (let x = 0.1; x <= 0.9; x += 0.1) await page.mouse.move(b.x + b.width * x, b.y + b.height / 2); }
        else if (s.kind === 'wait') { await page.waitForTimeout(Number(s.arg)); continue; }
        names.push(s.kind + ' ' + s.arg);
      } catch (err) { names.push(`${s.kind} ${s.arg} (skipped: ${err.message.split('\n')[0]})`); }
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(500);
    const v = await page.evaluate(() => window.__vitals);
    const byId = new Map();
    for (const e of v.events) { const p = byId.get(e.id); if (!p || e.d > p.d) byId.set(e.id, e); }
    const inter = [...byId.values()].sort((a, b) => b.d - a.d);
    const fcp = v.fcp || 0;
    const tbt = v.long.filter((l) => l.t + l.d > fcp && l.t < nav.load).reduce((s, l) => s + Math.max(0, l.d - 50 - Math.max(0, fcp - l.t)), 0);
    results.push({
      ttfb: nav.ttfb, fcp: v.fcp, lcp: v.lcp, lcpEl: v.lcpEl, cls: cls(v.shifts), shifts: v.shifts.filter((s) => !s.input && s.value > 0.0001),
      tbt, inp: inter.length ? inter[0].d : 0, worst: inter.slice(0, 3).map((e) => ({ name: e.name, d: e.d, input: Math.round(e.input), proc: Math.round(e.proc) })),
      interactions: inter.length, fontsReady: v.fontsReady, dcl: nav.dcl, load: nav.load, wallLoad: loadMs,
      bytes, docBytes, requests, dom: nav.dom,
      mainThread: { script: perf.ScriptDuration * 1000, style: perf.RecalcStyleDuration * 1000, layout: perf.LayoutDuration * 1000, task: perf.TaskDuration * 1000,
        styleCount: perf.RecalcStyleCount, layoutCount: perf.LayoutCount },
      steps: names,
    });
    await context.close();
  }
} finally { await browser.close(); server.close(); }

const m = (k) => median(results.map((r) => r[k]));
const mt = (k) => median(results.map((r) => r.mainThread[k]));
const summary = {
  page: target, profile, runs, encoding: opts.encoding || 'gzip',
  lcp: m('lcp'), fcp: m('fcp'), cls: m('cls'), inp: m('inp'), tbt: m('tbt'), ttfb: m('ttfb'), fontsReady: m('fontsReady'), load: m('load'),
  bytes: m('bytes'), docBytes: m('docBytes'), requests: m('requests'), dom: m('dom'),
  mainThread: { script: mt('script'), style: mt('style'), layout: mt('layout'), task: mt('task'), styleCount: mt('styleCount'), layoutCount: mt('layoutCount') },
  lcpElement: results[0].lcpEl, worstInteractions: results.find((r) => r.inp === m('inp'))?.worst || results[0].worst,
  interactions: results[0].interactions, shifts: results[0].shifts, steps: results[0].steps,
  verdict: {}, perRun: results.map((r) => ({ lcp: r.lcp, cls: r.cls, inp: r.inp, tbt: r.tbt })),
};
const band = (v, good, poor) => (v == null ? 'n/a' : v <= good ? 'good' : v <= poor ? 'needs improvement' : 'poor');
summary.verdict = { lcp: band(summary.lcp, 2500, 4000), cls: band(summary.cls, 0.1, 0.25), inp: band(summary.inp, 200, 500) };
const r0 = (x) => (x == null ? 'n/a' : Math.round(x));
if (!opts.quiet) {
  console.log(`${target}  [${profile}, ${runs} runs, median, ${summary.encoding}]`);
  console.log(`  LCP ${r0(summary.lcp)} ms (${summary.verdict.lcp})  element: ${summary.lcpElement}`);
  console.log(`  CLS ${summary.cls.toFixed(3)} (${summary.verdict.cls})   INP proxy ${r0(summary.inp)} ms (${summary.verdict.inp}) over ${summary.interactions} interactions`);
  console.log(`  FCP ${r0(summary.fcp)} ms  TBT ${r0(summary.tbt)} ms  TTFB ${r0(summary.ttfb)} ms  fonts ready ${r0(summary.fontsReady)} ms  load ${r0(summary.load)} ms`);
  console.log(`  wire ${(summary.bytes / 1024).toFixed(1)} KB in ${summary.requests} requests (document ${(summary.docBytes / 1024).toFixed(1)} KB)  DOM ${summary.dom} elements`);
  console.log(`  main thread at load: script ${r0(mt('script'))} ms, style ${r0(mt('style'))} ms (${r0(mt('styleCount'))}x), layout ${r0(mt('layout'))} ms (${r0(mt('layoutCount'))}x)`);
  if (summary.worstInteractions.length) console.log('  worst interactions: ' + summary.worstInteractions.map((w) => `${w.name} ${r0(w.d)} ms (input ${w.input}, handler ${w.proc})`).join('; '));
  for (const s of summary.shifts) console.log(`  shift ${s.value.toFixed(4)} at ${r0(s.t)} ms: ${s.src.join(', ')}`);
}
const out = opts.json || null;
if (out) { fs.mkdirSync(path.dirname(out), { recursive: true }); fs.writeFileSync(out, JSON.stringify(summary, null, 2)); }
const fail = summary.verdict.lcp === 'poor' || summary.verdict.cls !== 'good' || summary.verdict.inp === 'poor';
process.exit(fail ? 1 : 0);
