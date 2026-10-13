// Critic scratch: operate every control and check every derived number against an independent recomputation.
import { launch, toUrl } from '../../../../../tools/browser.mjs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const H = require('../src/model.js');
const P = process.argv[2];
const fmt = H.hhmm, W = H.makeWind(H.WIND);
const log = (...a) => console.log(...a);
let fails = 0; const check = (ok, msg) => { if (!ok) fails++; log((ok ? '  ok   ' : '  FAIL ') + msg); };
const dur = (m) => (m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min');

// independent expectations for an (out, back) plan
function expect(out, back) {
  const o = H.leg(W, out, 1), b = H.leg(W, back, -1);
  const margin = H.SUNSET - b.arr;
  return { o, b, margin, home: fmt(b.arr) };
}
async function read(page) {
  return page.evaluate(() => {
    const t = (s) => { const e = document.querySelector(s); return e ? e.textContent.replace(/\s+/g, ' ').trim() : null; };
    const stack = (k) => { const e = document.querySelector(`[data-time="${k}"]`); return e ? e.dataset.v : null; };
    return {
      out: stack('out'), back: stack('back'), home: stack('home'),
      noteOut: t('[data-note="out"]'), noteBack: t('[data-note="back"]'), noteHome: t('[data-note="home"]'), legs: t('[data-note="legs"]'),
      verdict: t('#verdict'), answer: t('#answer'), wcount: t('#w-count'),
      warns: [...document.querySelectorAll('#warnings .warn')].map((li) => li.querySelector('h3').textContent + ' || ' + li.querySelector('.effect').textContent),
      sum: t('#savebar-sum'), ll: [t('[data-ll="o"]'), t('[data-ll="b"]')],
      wp: [...document.querySelectorAll('#wp-body tr')].map((r) => r.textContent.replace(/\s+/g, ' ').trim()),
      vt: [...document.querySelectorAll('.handle')].map((h) => h.getAttribute('aria-valuetext') + ' [' + h.getAttribute('aria-valuemin') + ',' + h.getAttribute('aria-valuemax') + ']'),
      url: location.search, usage: t('[data-usage]'), notice: t('#notice'), live: t('#live'),
      saveBtn: [...document.querySelectorAll('[data-action="save"]')].map((b) => b.textContent.trim() + '|' + b.className + '|' + b.getAttribute('aria-disabled')),
    };
  });
}
function verify(r, out, back, tag) {
  const e = expect(out, back);
  log(`-- ${tag}: page out ${r.out} back ${r.back} home ${r.home}; expected out ${fmt(out)} back ${fmt(back)} home ${e.home}, margin ${e.margin}`);
  check(r.out === fmt(out) && r.back === fmt(back) && r.home === e.home, 'times');
  const mt = e.margin < 0 ? `${dur(-e.margin)} after sunset` : `${dur(e.margin)} before sunset`;
  check(r.noteHome.startsWith(mt), `home note "${r.noteHome}" ~ "${mt}"`);
  check(r.legs === `Each way: ${e.o.mins} min out, ${e.b.mins} min back`, `legs "${r.legs}"`);
  check(r.ll[1] === `Back ${fmt(back)} to ${e.home}`, `lane label back "${r.ll[1]}"`);
  check(r.wp.length === 5 && r.wp[0].endsWith(fmt(out) + ' ' + e.home) && r.wp[4].endsWith(fmt(e.o.arr) + ' ' + fmt(back)), `waypoint ends "${r.wp[0]}" / "${r.wp[4]}"`);
  log('   verdict:', r.verdict); log('   answer:', r.answer); log('   count:', r.wcount); r.warns.forEach((w) => log('   warn:', w));
  log('   notes:', r.noteOut, '|', r.noteBack); log('   sum:', r.sum); log('   aria:', r.vt.join(' ; '));
  // re-derive warning effects from the displayed numbers
  const gustAffects = [e.o, e.b].some((L) => L.dep < 1140 && L.arr > 960);
  const watAffects = [e.o, e.b].some((L) => L.dep < 925 && L.arr > 800);
  const nAff = (gustAffects ? 1 : 0) + (watAffects ? 1 : 0) + (e.margin < 30 ? 1 : 0);
  check(r.wcount === `3 warnings, ${nAff} affect${nAff === 1 ? 's' : ''} your plan`, `count re-derived ${nAff}`);
}
const browser = await launch();

// ---------- 1440 mouse, keyboard ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(toUrl(P)); await page.waitForTimeout(300);
  let out = 710, back = 1004;
  verify(await read(page), out, back, 'default load');
  // mouse: +10 out
  await page.click('[data-step="out"][data-by="10"]'); out += 10; await page.waitForTimeout(500);
  verify(await read(page), out, back, 'mouse +10 out');
  // keyboard Enter and Space on steppers
  await page.focus('[data-step="back"][data-by="-10"]'); await page.keyboard.press('Enter'); back -= 10; await page.waitForTimeout(400);
  verify(await read(page), out, back, 'Enter -10 back');
  await page.keyboard.press('Space'); back -= 10; await page.waitForTimeout(400);
  verify(await read(page), out, back, 'Space -10 back');
  // arrow keys on the out handle
  const hs = await page.$$('.handle');
  await hs[0].focus();
  for (let i = 0; i < 3; i++) await page.keyboard.press('ArrowRight'); out += 15; await page.waitForTimeout(200);
  verify(await read(page), out, back, 'ArrowRight x3 out');
  await page.keyboard.press('Shift+ArrowLeft'); out -= 30; await page.waitForTimeout(200);
  verify(await read(page), out, back, 'Shift+ArrowLeft out');
  await page.keyboard.press('PageUp'); out += 60; await page.waitForTimeout(200);
  verify(await read(page), out, back, 'PageUp out (into WAT?)');
  await page.keyboard.press('Home'); await page.waitForTimeout(200);
  let r = await read(page); log('Home ->', r.out, r.noteOut); out = parseInt(r.out) * 60 + parseInt(r.out.slice(3));
  verify(r, out, back, 'Home out');
  await page.keyboard.press('End'); await page.waitForTimeout(200);
  r = await read(page); log('End ->', r.out, r.noteOut); out = parseInt(r.out) * 60 + parseInt(r.out.slice(3));
  verify(r, out, back, 'End out');
  // back handle: arrows to after sunset
  await hs[1].focus();
  await page.keyboard.press('PageUp'); back += 60; await page.waitForTimeout(200);
  verify(await read(page), out, back, 'PageUp back (after sunset)');
  await page.screenshot({ path: new URL('./op-after-sunset-1440.png', import.meta.url).pathname });
  await page.keyboard.press('End'); await page.waitForTimeout(200);
  r = await read(page); back = parseInt(r.back) * 60 + parseInt(r.back.slice(3));
  verify(r, out, back, 'End back');
  // drag the back handle with the mouse to ~16:00
  await page.goto(toUrl(P)); await page.waitForTimeout(300); out = 710; back = 1004;
  const box = await (await page.$$('.handle'))[1].boundingBox();
  const lane = await page.$eval('#p-plan', (e) => { const b = e.getBoundingClientRect(); return { x: b.left, w: b.width }; });
  const target = (t) => lane.x + (t / 1440) * lane.w;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
  await page.mouse.move(target(990), box.y + box.height / 2, { steps: 8 });
  await page.mouse.move(target(960), box.y + box.height / 2, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(300);
  r = await read(page); back = parseInt(r.back) * 60 + parseInt(r.back.slice(3));
  verify(r, out, back, 'mouse drag back to ~16:00');
  await page.screenshot({ path: new URL('./op-drag-back-1440.png', import.meta.url).pathname, clip: { x: 240, y: 430, width: 1200, height: 470 } });
  // drag out handle into WAT
  const box0 = await (await page.$$('.handle'))[0].boundingBox();
  await page.mouse.move(box0.x + box0.width / 2, box0.y + box0.height / 2); await page.mouse.down();
  await page.mouse.move(target(800), box0.y + 10, { steps: 10 }); await page.mouse.up(); await page.waitForTimeout(300);
  r = await read(page); out = parseInt(r.out) * 60 + parseInt(r.out.slice(3));
  verify(r, out, back, 'mouse drag out to ~13:20 (WAT)');
  await page.screenshot({ path: new URL('./op-wat-1440.png', import.meta.url).pathname, fullPage: false });
  // save flow
  await page.goto(toUrl(P)); await page.waitForTimeout(300);
  await page.click('.head-actions [data-action="save"]');
  r = await read(page); log('save busy:', r.saveBtn.join(' / '), r.live);
  await page.waitForTimeout(900);
  r = await read(page); log('saved:', r.url, r.usage, r.saveBtn.join(' / '), '|', r.notice, '|', r.live);
  await page.screenshot({ path: new URL('./op-saved-1440.png', import.meta.url).pathname });
  await page.focus('[data-step="out"][data-by="10"]'); await page.keyboard.press('Enter'); await page.waitForTimeout(300);
  r = await read(page); log('after change:', r.url, r.usage, r.saveBtn.join(' / '), '| notice:', r.notice);
  await page.click('.head-actions [data-action="save"]'); await page.waitForTimeout(900);
  r = await read(page); log('re-saved:', r.url, r.usage, '|', r.notice);
  // reload saved URL: is the moved plan kept?
  await page.reload(); await page.waitForTimeout(300);
  r = await read(page); log('reload ?state=saved:', r.out, r.back, r.usage, r.notice);
  // error -> retry
  await page.goto(toUrl(P + '?state=error')); await page.waitForTimeout(300);
  r = await read(page); log('error:', r.verdict, '|', r.answer, '|', r.wcount, '|', r.warns.join(' ## '), '|', r.notice);
  verify(r, 710, 1004, 'error state numbers (tide only)');
  await page.click('.head-actions [data-action="retry"]'); await page.waitForTimeout(100);
  r = await read(page); log('retry t+100:', r.url, r.live);
  await page.waitForTimeout(1400);
  r = await read(page); log('retry done:', r.url, r.verdict, r.live);
  // nowindow
  await page.goto(toUrl(P + '?state=nowindow')); await page.waitForTimeout(300);
  r = await read(page); log('nowindow:', r.verdict, '|', r.answer, '|', r.wcount, '|', r.warns.join(' ## '), '|', r.sum);
  // empty
  await page.goto(toUrl(P + '?state=empty')); await page.waitForTimeout(300);
  r = await read(page); log('empty:', r.verdict, '|', r.answer, '|', r.sum, '|', r.notice);
  // crosshair readout at 14:00
  await page.goto(toUrl(P)); await page.waitForTimeout(300);
  const tb = await page.$eval('#p-tide', (e) => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width }; });
  await page.mouse.move(tb.x + (840 / 1440) * tb.w, tb.y + 20); await page.waitForTimeout(300);
  const ro = await page.$eval('#readout', (e) => e.textContent.replace(/\s+/g, ' '));
  log('readout 14:00:', ro, '| expected tide', H.tide(840).toFixed(1), 'stream', H.stream(840).toFixed(1), 'wind', Math.round(W.mean(840)), 'gust', Math.round(W.gust(840)));
  await page.screenshot({ path: new URL('./op-readout-1440.png', import.meta.url).pathname, clip: { x: 240, y: 430, width: 1200, height: 470 } });
  await ctx.close();
}
log('\nFAILS', fails);
await browser.close();
