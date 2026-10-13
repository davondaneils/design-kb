// motion-audit scenarios for halyard.html: one per user action that moves anything.
// Run from the repo root: node skills/design-motion/assets/motion-audit.mjs kb/tests/fresh/landing/src/scenarios.mjs kb/tests/fresh/landing/reports/motion-audit
const url = 'kb/tests/fresh/landing/halyard.html';
const settle = (page, ms = 400) => page.waitForTimeout(ms);
// Under reduced motion the scene sits on its still frame and never steps, so the waits return at once.
const stateIs = (page, st) => page.waitForFunction((s) => matchMedia('(prefers-reduced-motion: reduce)').matches || document.querySelector('#hero-scene').dataset.state === s, st, { timeout: 15000 });
export default [
  {
    name: 'scene-tide-beat', url, clip: '#hero-scene',
    // The scene starts when a third of it is on screen; film the step from day to tide.
    setup: async ({ page }) => { await stateIs(page, 'day'); },
    trigger: async ({ page }) => { await stateIs(page, 'tide'); },
    wait: 2500,
  },
  {
    name: 'scene-window-beat', url, clip: '#hero-scene',
    setup: async ({ page }) => { await stateIs(page, 'light'); },
    trigger: async ({ page }) => { await stateIs(page, 'window'); },
    wait: 2500,
  },
  {
    name: 'pause-click', url, clip: '.hero__fig .fig-foot',
    // Under reduced motion the scene is a still and scene.js hides the button: nothing to press.
    trigger: async ({ page }) => { const b = page.locator('[data-scene-pause]'); if (await b.isVisible()) await b.click(); },
  },
  {
    name: 'primary-hover', url, clip: '.hero__copy .actions',
    trigger: async ({ page }) => { await page.hover('.hero__copy .btn--primary'); },
  },
  {
    name: 'billing-yearly-click', url, clip: '#plus',
    setup: async ({ page }) => { await page.locator('#pricing').scrollIntoViewIfNeeded(); await settle(page, 1200); },
    trigger: async ({ page }) => { await page.click('[data-billing-set="year"]'); },
  },
  {
    name: 'billing-yearly-keyboard', url, clip: '#plus',
    setup: async ({ page }) => { await page.locator('#pricing').scrollIntoViewIfNeeded(); await settle(page, 1200); await page.focus('[data-billing-set="year"]'); },
    trigger: async ({ page }) => { await page.keyboard.press('Space'); },
  },
  {
    name: 'faq-open-click', url, clip: '.faq details:first-child',
    setup: async ({ page }) => { await page.locator('#faq').scrollIntoViewIfNeeded(); await settle(page, 1200); },
    trigger: async ({ page }) => { await page.click('.faq details:first-child summary'); },
  },
  {
    name: 'faq-open-enter', url, clip: '.faq details:nth-child(2)',
    setup: async ({ page }) => { await page.locator('#faq').scrollIntoViewIfNeeded(); await settle(page, 1200); await page.focus('.faq details:nth-child(2) summary'); },
    trigger: async ({ page }) => { await page.keyboard.press('Enter'); },
  },
  {
    name: 'menu-open-390', url, width: 390, height: 844, clip: '.site-head', expect: 'motion',
    trigger: async ({ page }) => { await page.click('[data-menu]'); },
  },
  {
    name: 'reveal-how', url, clip: '#how',
    trigger: async ({ page }) => { await page.evaluate(() => document.querySelector('#how').scrollIntoView()); },
  },
  {
    name: 'reveal-route', url, clip: '#route',
    trigger: async ({ page }) => { await page.evaluate(() => document.querySelector('#route').scrollIntoView()); },
  },
  {
    name: 'reveal-warnings-390', url, width: 390, height: 844, clip: '#warnings',
    trigger: async ({ page }) => { await page.evaluate(() => document.querySelector('#warnings').scrollIntoView()); },
  },
];
