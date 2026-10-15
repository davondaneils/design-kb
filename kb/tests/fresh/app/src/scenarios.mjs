// Motion scenarios for the Halyard plan screen (one per user action). Run from the repo root:
//   node skills/design-motion/assets/motion-audit.mjs kb/tests/fresh/app/src/scenarios.mjs kb/tests/fresh/app/reports/motion
// expect 'none': keyboard and drag paths on the departure must never animate (key repeat would queue motion).
const P = 'kb/tests/fresh/app/plan.html';
const into = (sel) => async ({ page }) => page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center', behavior: 'instant' }), sel);

export default [
  { name: 'plan-1-stepper-slides-leg', url: P, clip: '#p-plan', expect: 'motion', frames: 6,
    note: 'Pointer press on "+10 min" (Leave Yarmouth): leg, handle, guides and margin bracket slide at --duration-base, --ease-standard (transform only).',
    setup: into('#tl'), trigger: async ({ page }) => page.click('[data-step="back"][data-by="10"]') },
  { name: 'plan-2-stepper-rolls-time', url: P, clip: '#facts', expect: 'motion', frames: 6,
    note: 'Same press, filmed at the facts: Leave Yarmouth and Home roll to their new value in their slot at --duration-slow.',
    setup: into('#facts'), trigger: async ({ page }) => page.click('[data-step="back"][data-by="10"]') },
  { name: 'plan-3-stepper-flashes-changed-warning', url: P, height: 1800, clip: '#warn-light', expect: 'motion', frames: 6,
    note: 'Leave Yarmouth 10 min earlier takes the return margin from 25 to 36 min: warning 3 turns clear, its row flashes once (opacity, --duration-slow) and the status fades in (--duration-base).',
    setup: async ({ page }) => page.evaluate(() => window.scrollTo(0, 0)), trigger: async ({ page }) => page.click('[data-step="back"][data-by="-10"]') },
  { name: 'plan-4-arrow-key-repeat', url: P, clip: '#p-plan, #facts', expect: 'none', frames: 4,
    note: 'Eight ArrowRight presses on the Leave Yarmouth handle (key repeat): every value updates at once, nothing animates.',
    setup: async ({ page }) => { await into('#tl')({ page }); await page.focus('.handle >> nth=1'); },
    trigger: async ({ page }) => { for (let i = 0; i < 8; i++) await page.keyboard.press('ArrowRight', { delay: 0 }); } },
  { name: 'plan-5-shift-arrow-and-page-keys', url: P, clip: '#p-plan, #warnings', expect: 'none', frames: 4,
    note: 'Shift+ArrowLeft, PageDown and PageUp on the Leave Lymington handle: instant, including the warning rows.',
    setup: async ({ page }) => { await into('#tl')({ page }); await page.focus('.handle >> nth=0'); },
    trigger: async ({ page }) => { await page.keyboard.press('Shift+ArrowLeft'); await page.keyboard.press('PageDown'); await page.keyboard.press('PageUp'); } },
  { name: 'plan-6-drag-departure', url: P, clip: '#p-plan', expect: 'none', frames: 4,
    note: 'Mouse drag of the Leave Yarmouth handle to 16:15: the leg tracks the pointer 1:1, no transition.',
    setup: into('#tl'),
    trigger: async ({ page }) => {
      const b = await page.locator('.handle').nth(1).boundingBox(); const p = await page.locator('#p-plan').boundingBox();
      const x0 = b.x + b.width / 2, y = b.y + b.height / 2, x1 = p.x + (975 / 1440) * p.width;
      await page.mouse.move(x0, y); await page.mouse.down();
      for (let i = 1; i <= 6; i++) await page.mouse.move(x0 + (x1 - x0) * i / 6, y);
      await page.mouse.up();
    } },
  { name: 'plan-7-warning-hover-highlights-span', url: P, clip: '#p-wind', expect: 'motion', frames: 5,
    note: 'Pointer over warning 2: its gust span on the wind row outlines (opacity, --duration-fast).',
    setup: into('#warnings'), trigger: async ({ page }) => page.hover('#warn-gust') },
  { name: 'plan-8-save', url: P, clip: '.head-actions, #toast', expect: 'motion', frames: 6, wait: 1500,
    note: 'Save plan: label fades (--duration-instant), spinner loops while busy (reported, not judged), then the toast rises 16px at --duration-base, --ease-enter.',
    trigger: async ({ page }) => { await page.click('.head-actions [data-action="save"]'); await page.waitForTimeout(650); } },
  { name: 'plan-9-phone-menu', url: P, width: 390, height: 844, clip: '.topbar, #nav-panel', expect: 'motion', frames: 5,
    note: 'Menu opens: panel fades and drops 8px at --duration-slow, --ease-enter. Escape closes at once.',
    trigger: async ({ page }) => page.click('[data-menu]') },
  { name: 'plan-10-route-reveal', url: P, clip: '#map', expect: 'motion', frames: 7,
    note: 'The route draws once from Lymington to Yarmouth when the map is 40% on screen: two-transform wipe at --duration-reveal (600 ms).',
    trigger: into('#map'), wait: 2000 },
  { name: 'plan-11-hourly-toggle', url: P, clip: 'details.hourly summary', expect: 'motion', frames: 4,
    note: 'Show hourly values: the plus turns to a cross (rotate 45deg, --duration-base).',
    setup: into('details.hourly'), trigger: async ({ page }) => page.click('details.hourly summary') },
];
