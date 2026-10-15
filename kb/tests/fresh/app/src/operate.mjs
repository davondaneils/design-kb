// Operates every control on plan.html and checks that every derived number agrees with the model.
import { launch, toUrl } from '/home/user/design-kb/tools/browser.mjs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const H = require('/home/user/design-kb/kb/tests/fresh/app/src/model.js');
const W = H.makeWind(H.WIND);
const target = '/home/user/design-kb/kb/tests/fresh/app/plan.html';
const browser = await launch();
let fails = 0, checks = 0;
const log = (ok, msg) => { checks++; if (!ok) fails++; console.log((ok ? 'ok   ' : 'FAIL ') + msg); };

async function read(page) {
  return page.evaluate(() => {
    const t = (s) => (document.querySelector(s)?.textContent || '').replace(/\s+/g, ' ').trim();
    const stackT = (k) => { const el = document.querySelector(`[data-time="${k}"]`); return el.dataset.v; };
    const rows = [...document.querySelectorAll('#wp-body tr')].map((r) => [...r.children].map((c) => c.textContent));
    return { out: stackT('out'), back: stackT('back'), home: stackT('home'), homeNote: t('[data-note="home"]'), legs: t('[data-note="legs"]'),
      outNote: t('[data-note="out"]'), backNote: t('[data-note="back"]'), verdict: t('#verdict'), count: t('#w-count'), answer: t('#answer'),
      ll: t('[data-ll="b"]'), llo: t('[data-ll="o"]'), sum: t('#savebar-sum'), rows,
      warns: [...document.querySelectorAll('.warn')].map((li) => li.querySelector('h3').textContent + ' | ' + li.querySelector('.effect').textContent),
      hOut: document.querySelectorAll('.handle')[0].getAttribute('aria-valuenow'), hBack: document.querySelectorAll('.handle')[1].getAttribute('aria-valuenow'),
      hOutText: document.querySelectorAll('.handle')[0].getAttribute('aria-valuetext'), url: location.search };
  });
}
const mins = (s) => +s.slice(0, 2) * 60 + +s.slice(3);
function verify(r, label) {
  const out = mins(r.out), back = mins(r.back);
  const o = H.leg(W, out, 1), b = H.leg(W, back, -1);
  const m = H.SUNSET - b.arr;
  log(r.home === H.hhmm(b.arr), `${label}: home ${r.home} = model ${H.hhmm(b.arr)}`);
  log(+r.hOut === out && +r.hBack === back, `${label}: slider values ${r.hOut}/${r.hBack} match facts ${out}/${back}`);
  log(r.legs === `Each way: ${o.mins} min out, ${b.mins} min back`, `${label}: legs "${r.legs}"`);
  log(r.rows[4][2] === H.hhmm(o.arr) && r.rows[0][3] === H.hhmm(b.arr) && r.rows[0][2] === r.out && r.rows[4][3] === r.back, `${label}: waypoint table ends agree (${r.rows[0][2]}..${r.rows[4][2]}, ${r.rows[4][3]}..${r.rows[0][3]})`);
  log(r.ll.startsWith(`Back ${r.back}`) && r.ll.endsWith(H.hhmm(b.arr)), `${label}: lane label "${r.ll}"`);
  log(r.sum.includes(`Out ${r.out} · Back ${r.back}`) && r.sum.includes(`Home ${r.home}`), `${label}: save bar "${r.sum}"`);
  const mt = m < 0 ? `${-m} min after sunset` : `${m} min before sunset`;
  log(r.homeNote.includes(m < 0 ? `after sunset` : `before sunset`) && r.homeNote.includes(String(Math.abs(m) >= 60 ? '' : Math.abs(m))), `${label}: home note "${r.homeNote}" (margin ${m})`);
  log(r.answer.includes(`Lymington at ${r.out}`) && r.answer.includes(`Yarmouth at ${r.back}`), `${label}: answer names the times`);
  const affect = r.warns.filter((w) => !w.includes('Clear of your plan')).length;
  log(r.count === `3 warnings, ${affect} affect${affect === 1 ? 's' : ''} your plan`, `${label}: count "${r.count}"`);
  return { o, b, m };
}

// ---- 1440, mouse and keyboard ----
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', (e) => log(false, 'pageerror ' + e.message));
  await page.goto(toUrl(target)); await page.waitForTimeout(300);
  let r = await read(page);
  log(r.out === '11:50' && r.back === '16:44' && r.home === '17:31', `default: 11:50 / 16:44 / home 17:31`);
  log(r.homeNote.startsWith('25 min before sunset'), `default: "${r.homeNote}"`);
  log(r.count === '3 warnings, 2 affect your plan', `default count "${r.count}"`);
  log(r.outNote.includes('10:05 to 12:35') && r.backNote.includes('16:15 to 17:10'), `default windows: "${r.outNote}" / "${r.backNote}"`);
  console.log('   warnings:', r.warns.join('\n             '));
  verify(r, 'default');
  // stepper mouse clicks: back +10 x2 -> 17:04
  const back10 = page.locator('[data-step="back"][data-by="10"]');
  await back10.click(); await back10.click(); await page.waitForTimeout(400);
  r = await read(page); verify(r, 'mouse back +20');
  log(r.back === '17:04', `back now ${r.back}`);
  // home after sunset? 17:04 + leg
  console.log('   ', r.warns[2]);
  // Enter and Space on steppers
  await page.locator('[data-step="out"][data-by="-10"]').focus(); await page.keyboard.press('Enter'); await page.keyboard.press('Space'); await page.waitForTimeout(400);
  r = await read(page); log(r.out === '11:30', `Enter+Space out -20: ${r.out}`); verify(r, 'enter/space');
  // Arrow keys on handle, incl. key repeat (20 presses)
  const hb = page.locator('.handle').nth(1); await hb.focus();
  for (let i = 0; i < 6; i++) await page.keyboard.press('ArrowLeft');
  r = await read(page); log(r.back === '16:34', `ArrowLeft x6 back: ${r.back}`); verify(r, 'arrows');
  await page.keyboard.press('Shift+ArrowRight'); r = await read(page); log(r.back === '17:04', `Shift+Right: ${r.back}`);
  await page.keyboard.press('PageDown'); r = await read(page); log(r.back === '16:04', `PageDown: ${r.back}`); verify(r, 'pagedown');
  console.log('    16:04 back:', r.backNote, '|', r.verdict, '|', r.warns[0]);
  await page.keyboard.press('Home'); r = await read(page); console.log('    Home ->', r.back, r.verdict); verify(r, 'home key');
  await page.keyboard.press('End'); r = await read(page); console.log('    End ->', r.back, r.homeNote, r.verdict); verify(r, 'end key');
  // out handle End: clamps to back - ashore
  const ho = page.locator('.handle').nth(0); await ho.focus(); await page.keyboard.press('End'); r = await read(page);
  { const o = H.leg(W, mins(r.out), 1); log(o.arr + 30 <= mins(r.back), `out End clamps: out ${r.out} arr ${H.hhmm(o.arr)} back ${r.back}`); }
  verify(r, 'out end');
  // reset by reload, drag back handle with mouse
  await page.goto(toUrl(target)); await page.waitForTimeout(300);
  const box = await page.locator('.handle').nth(1).boundingBox();
  const plot = await page.locator('#p-plan').boundingBox();
  const xOf = (t) => plot.x + (t / 1440) * plot.width;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
  for (let i = 1; i <= 10; i++) await page.mouse.move(box.x + box.width / 2 + (xOf(16 * 60) - (box.x + box.width / 2)) * i / 10, box.y + 10);
  r = await read(page); log(r.back === '16:00', `mouse drag back to 16:00: ${r.back}`);
  const anim = await page.evaluate(() => document.getAnimations().length + ' anims, data-anim=' + document.querySelector('#tl').hasAttribute('data-anim'));
  log(anim.startsWith('0 anims'), 'drag runs no animation: ' + anim);
  await page.mouse.up(); verify(r, 'drag 16:00');
  console.log('    16:00 back:', r.verdict, '|', r.warns.join(' || '));
  // Save
  await page.locator('.head-actions [data-action="save"]').click(); await page.waitForTimeout(100);
  const busy = await page.locator('.head-actions [data-action="save"]').getAttribute('aria-busy');
  log(busy === 'true', 'save shows busy');
  await page.waitForTimeout(800); r = await read(page);
  const st = await page.evaluate(() => ({ btn: document.querySelector('.head-actions .btn').textContent.trim(), notice: document.querySelector('#notice').textContent.trim(), usage: document.querySelector('[data-usage]').textContent, toast: document.querySelector('#toast').hidden }));
  log(st.btn === 'Plan saved' && r.url === '?state=saved' && st.usage === '2 of 3' && !st.toast, `saved: ${JSON.stringify(st)} ${r.url}`);
  await page.keyboard.press('Tab');
  await page.locator('.handle').nth(1).focus(); await page.keyboard.press('ArrowRight'); r = await read(page);
  const st2 = await page.evaluate(() => ({ btn: document.querySelector('.head-actions .btn').textContent.trim(), notice: document.querySelector('#notice').hidden, usage: document.querySelector('[data-usage]').textContent }));
  log(st2.btn === 'Save plan' && st2.notice && r.url === '' && st2.usage === '2 of 3', `edit after save returns to unsaved: ${JSON.stringify(st2)}`);
  // hourly details
  await page.locator('details.hourly summary').click(); log(await page.locator('details.hourly').evaluate((d) => d.open), 'hourly table opens');
  // hover a warning row highlights its span
  await page.locator('#warn-gust').hover(); log((await page.locator('#tl').getAttribute('data-hl')) === '2', 'hover warning 2 highlights span 2');
  // crosshair
  await page.locator("#p-wind").scrollIntoViewIfNeeded(); { const pb = await page.locator("#p-wind").boundingBox(); await page.mouse.move(pb.x + (14 * 60 / 1440) * pb.width + 0.5, pb.y + 30); } await page.waitForTimeout(50);
  const ro = await page.locator('#readout').textContent(); log(ro.startsWith('14:00'), 'crosshair readout: ' + ro);
  // error -> retry -> loading -> default
  await page.goto(toUrl(target + '?state=error')); await page.waitForTimeout(200);
  await page.locator('.head-actions [data-action="retry"]').click(); await page.waitForTimeout(100);
  const l1 = await page.evaluate(() => [location.search, document.querySelector('main').getAttribute('aria-busy')]);
  await page.waitForTimeout(1400);
  const l2 = await page.evaluate(() => [location.search, document.querySelector('#verdict').textContent]);
  log(l1[0] === '?state=loading' && l1[1] === 'true' && l2[0] === '' && /Inside/.test(l2[1]), `retry flow ${JSON.stringify(l1)} -> ${JSON.stringify(l2)}`);
  await page.close();
}
// ---- 390, touch ----
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => log(false, 'pageerror ' + e.message));
  await page.goto(toUrl(target)); await page.waitForTimeout(300);
  await page.locator('[data-menu]').tap(); let m = await page.evaluate(() => [document.querySelector('[data-menu]').getAttribute('aria-expanded'), document.querySelector('#nav-panel').hidden, document.querySelector('[data-menu-label]').textContent]);
  log(m[0] === 'true' && !m[1] && m[2] === 'Close', 'tap Menu opens: ' + m);
  await page.locator('[data-menu]').tap(); m = await page.evaluate(() => [document.querySelector('[data-menu]').getAttribute('aria-expanded'), document.querySelector('#nav-panel').hidden]);
  log(m[0] === 'false' && m[1], 'tap Close closes');
  await page.locator('[data-step="out"][data-by="10"]').tap(); await page.waitForTimeout(400);
  let r = await read(page); log(r.out === '12:00', 'tap out +10: ' + r.out); verify(r, 'touch step');
  // touch drag via CDP
  const h = await page.locator('.handle').nth(1); await h.scrollIntoViewIfNeeded();
  const box = await h.boundingBox(); const plot = await page.locator('#p-plan').boundingBox();
  const cdp = await ctx.newCDPSession(page);
  const x0 = box.x + box.width / 2, y0 = box.y + box.height / 2;
  const xT = plot.x + ((17 * 60 - 360) / 840) * plot.width;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] });
  for (let i = 1; i <= 8; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (xT - x0) * i / 8, y: y0 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(100);
  r = await read(page); log(r.back === '17:00', 'touch drag back to 17:00: ' + r.back); verify(r, 'touch drag');
  console.log('    17:00 back:', r.homeNote, r.verdict, '|', r.warns[2]);
  await page.locator('#savebar [data-action="save"]').tap(); await page.waitForTimeout(900);
  log((await page.locator('#savebar .btn').textContent()).trim() === 'Plan saved', 'tap Save plan in save bar');
  await ctx.close();
}
await browser.close();
console.log(`\n${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
