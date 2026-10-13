// Motion scenarios for ferry.html (design-motion assets/motion-audit.mjs). Run from the repo root:
//   node skills/design-motion/assets/motion-audit.mjs kb/tests/benchmark/round1/landing/src/motion-scenarios.mjs kb/tests/benchmark/round1/landing/motion
const url = 'kb/tests/benchmark/round1/landing/ferry.html';
export default [
  { name: 'crossing-reveal', url, width: 1440, height: 900, clip: '#lanes',
    trigger: async ({ page }) => { await page.evaluate(() => document.getElementById('lanes').scrollIntoView({ block: 'center' })); },
    expect: 'motion', frames: 6 },
  { name: 'faq-open', url, width: 1440, height: 900, clip: '.faq-list details:first-child',
    setup: async ({ page }) => { await page.evaluate(() => document.querySelector('.faq-list').scrollIntoView({ block: 'center' })); },
    trigger: async ({ page }) => { await page.click('.faq-list details:first-child summary'); },
    expect: 'motion' },
  { name: 'primary-press', url, width: 1440, height: 900, clip: '.hero .cta-row',
    trigger: async ({ page }) => { const b = await page.$('.hero .btn-primary'); const r = await b.boundingBox(); await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2); await page.mouse.down(); },
    expect: 'motion' },
  { name: 'stepper-keyboard', url, width: 1440, height: 900, clip: '.price-card .stepper',
    setup: async ({ page }) => { await page.evaluate(() => document.getElementById('team').scrollIntoView({ block: 'center' })); await page.focus('#team'); },
    trigger: async ({ page }) => { await page.keyboard.press('ArrowUp'); },
    expect: 'none' },
];
