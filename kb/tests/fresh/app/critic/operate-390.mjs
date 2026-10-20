// Critic scratch: 1440 drag debug, 390 touch drag, menu focus, savebar occlusion, notice visibility.
import { launch, toUrl } from '../../../../../tools/browser.mjs';
const P = process.argv[2];
const here = (f) => new URL('./' + f, import.meta.url).pathname;
const browser = await launch();
const stackOut = (page) => page.evaluate(() => [...document.querySelectorAll('[data-time]')].map((e) => e.dataset.v).join(' '));
{ // drag debug at 1440
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
  await page.goto(toUrl(P)); await page.waitForTimeout(300);
  await page.$eval('#timeline', (e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(200);
  for (const i of [0, 1]) {
    const h = (await page.$$('.handle'))[i]; const b = await h.boundingBox();
    const cx = b.x + b.width / 2, cy = b.y + b.height / 2;
    const hit = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? (e.className || e.tagName) + (e.closest('.handle') ? ' (in handle)' : '') : null; }, [cx, cy]);
    console.log('handle', i, 'box', JSON.stringify(b), 'hit at center:', hit, 'in viewport:', b.y > 0 && b.y + b.height < 900);
    const lane = await page.$eval('#p-plan', (e) => { const r = e.getBoundingClientRect(); return { x: r.left, w: r.width }; });
    const before = await stackOut(page);
    await page.mouse.move(cx, cy); await page.mouse.down();
    await page.mouse.move(lane.x + ((i ? 1020 : 760) / 1440) * lane.w, cy, { steps: 10 }); await page.mouse.up(); await page.waitForTimeout(300);
    console.log('  drag', i, before, '->', await stackOut(page));
  }
  // notice visibility after unsave
  await page.goto(toUrl(P + '?state=saved')); await page.waitForTimeout(300);
  await page.click('[data-step="out"][data-by="10"]'); await page.waitForTimeout(400);
  console.log('saved then changed: notice hidden =', await page.$eval('#notice', (e) => e.hidden), 'url', await page.evaluate(() => location.search), 'toast hidden', await page.$eval('#toast', (e) => e.hidden));
  await ctx.close();
}
{ // 390 touch
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 }); const page = await ctx.newPage();
  await page.goto(toUrl(P)); await page.waitForTimeout(400);
  await page.$eval('[data-row="plan"]', (e) => e.scrollIntoView({ block: 'center' })); await page.waitForTimeout(300);
  await page.screenshot({ path: here('op-390-lane.png') });
  const cdp = await ctx.newCDPSession(page);
  for (const i of [0, 1]) {
    const b = await (await page.$$('.handle'))[i].boundingBox(); const x = b.x + b.width / 2, y = b.y + b.height / 2;
    const lane = await page.$eval('#p-plan', (e) => { const r = e.getBoundingClientRect(); return { x: r.left, w: r.width }; });
    const X = (t) => lane.x + ((t - 360) / 840) * lane.w;
    const before = await stackOut(page); const sy = await page.evaluate(() => scrollY);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let k = 1; k <= 10; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + (X(i ? 1015 : 740) - x) * k / 10, y }] }); await page.waitForTimeout(16); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(300);
    console.log('390 touch drag handle', i, before, '->', await stackOut(page), 'scrollY', sy, '->', await page.evaluate(() => scrollY));
  }
  // tap a stepper
  await page.tap('[data-step="back"][data-by="10"]'); await page.waitForTimeout(400);
  console.log('390 tap +10 back ->', await stackOut(page));
  // touch pan on a chart row: does the page still scroll vertically?
  const tp = await page.$eval('#p-tide', (e) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
  const sy0 = await page.evaluate(() => scrollY);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [tp] });
  for (let k = 1; k <= 8; k++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: tp.x, y: tp.y - k * 20 }] }); await page.waitForTimeout(16); }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await page.waitForTimeout(400);
  console.log('390 vertical pan on tide row scrollY', sy0, '->', await page.evaluate(() => scrollY));
  await page.screenshot({ path: here('op-390-after-touch.png') });
  // savebar occlusion of focused elements: tab through and check whether focused element is covered by the savebar
  await page.goto(toUrl(P)); await page.waitForTimeout(300);
  const covered = [];
  for (let k = 0; k < 40; k++) {
    await page.keyboard.press('Tab'); await page.waitForTimeout(30);
    const r = await page.evaluate(() => {
      const a = document.activeElement; if (!a || a === document.body) return null;
      const b = a.getBoundingClientRect(); const pts = [[b.left + 2, b.top + 2], [b.left + b.width / 2, b.top + b.height / 2], [b.right - 2, b.bottom - 2]];
      const hid = pts.filter(([x, y]) => { const e = document.elementFromPoint(x, y); return e && !a.contains(e) && !e.contains(a) && (e.closest('.savebar, .topbar')); }).length;
      return { name: (a.textContent || a.getAttribute('aria-label') || a.tagName).trim().slice(0, 30), hid, top: Math.round(b.top), bottom: Math.round(b.bottom) };
    });
    if (r && r.hid === 3) covered.push(`${r.name} (${r.top}-${r.bottom})`);
  }
  console.log('390 Tab: focused elements fully covered by savebar/topbar:', covered.length ? covered.join(', ') : 'none');
  // menu: open, tab and check
  await page.goto(toUrl(P)); await page.waitForTimeout(300);
  await page.tap('[data-menu]'); await page.waitForTimeout(400);
  await page.screenshot({ path: here('op-390-menu.png') });
  const seq = [];
  for (let k = 0; k < 14; k++) { await page.keyboard.press('Tab'); seq.push(await page.evaluate(() => { const a = document.activeElement; const b = a.getBoundingClientRect(); return (a.textContent || a.tagName).trim().slice(0, 22) + '@' + Math.round(b.top); })); }
  console.log('390 menu open, Tab order from menu button:', seq.join(' > '));
  console.log('menu is a', await page.$eval('#nav-panel', (e) => getComputedStyle(e).position), 'panel; main inert', await page.$eval('main', (e) => e.inert));
  await page.keyboard.press('Escape'); await page.waitForTimeout(200);
  console.log('after Escape focus on', await page.evaluate(() => document.activeElement.textContent.trim()));
  await ctx.close();
}
await browser.close();
