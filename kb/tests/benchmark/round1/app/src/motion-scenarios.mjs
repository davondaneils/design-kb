// Motion audit scenarios for run-review.html (skills/design-motion/assets/motion-audit.mjs).
// Run from the repo root: node skills/design-motion/assets/motion-audit.mjs kb/tests/benchmark/round1/app/src/motion-scenarios.mjs kb/tests/benchmark/round1/app/shots/motion
const url = 'kb/tests/benchmark/round1/app/run-review.html';
export default [
  { name: 'approve-dialog-pointer', url, clip: '#approve-dialog', expect: 'motion',
    trigger: async ({ page }) => { await page.click('#approve'); } },
  { name: 'approve-dialog-keyboard', url, clip: '#approve-dialog', expect: 'none',
    trigger: async ({ page }) => { await page.focus('#approve'); await page.keyboard.press('Enter'); } },
  { name: 'drawer-pointer-390', url, width: 390, height: 844, clip: '#drawer', expect: 'motion',
    trigger: async ({ page }) => { await page.click('#menu-open'); } },
  { name: 'approve-confirm-keyboard', url, clip: '.page-head', expect: 'none',
    setup: async ({ page }) => { await page.focus('#approve'); await page.keyboard.press('Enter'); await page.waitForTimeout(100); },
    trigger: async ({ page }) => { await page.focus('#approve-dialog .btn-primary'); await page.keyboard.press('Enter'); } },
];
