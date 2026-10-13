// Critic scratch: one continuous mouse drag; where is the handle relative to the pointer?
import { launch, toUrl } from '../../../../../tools/browser.mjs';
const P = process.argv[2];
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }); const page = await ctx.newPage();
await page.goto(toUrl(P)); await page.waitForTimeout(300);
await page.evaluate(() => scrollTo(0, 350)); await page.waitForTimeout(200);
const h = (await page.$$('.handle'))[0]; const b = await h.boundingBox();
const lane = await page.$eval('#p-plan', (e) => { const r = e.getBoundingClientRect(); return { x: r.left, w: r.width }; });
const y = b.y + b.height / 2;
await page.mouse.move(b.x + 12, y); await page.mouse.down();
for (const t of [720, 740, 760, 770]) {
  await page.mouse.move(lane.x + (t / 1440) * lane.w, y, { steps: 4 }); await page.waitForTimeout(100);
  const nb = await h.boundingBox();
  console.log(`pointer y ${Math.round(y)}; handle now ${await page.$eval('[data-time="out"]', (e) => e.dataset.v)} spans y ${Math.round(nb.y)} to ${Math.round(nb.y + nb.height)}; pointer ${y >= nb.y && y <= nb.y + nb.height ? 'on' : 'OFF'} the handle`);
}
await page.screenshot({ path: new URL('./op-drag-shift-1440.png', import.meta.url).pathname });
await page.mouse.up();
await browser.close();
