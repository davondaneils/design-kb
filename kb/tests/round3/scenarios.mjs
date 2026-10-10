// Motion scenarios for skills/design-motion/assets/motion-audit.mjs (run from the repo root):
//   node skills/design-motion/assets/motion-audit.mjs kb/tests/round3/scenarios.mjs kb/tests/round3/strips
// One user action each. expect: 'none' marks actions that must not animate (keyboard paths, frequent switches).
const C = 'kb/tests/round3/coffee.html';
const D = 'kb/tests/round3/dashboard.html';
const into = (sel) => async ({ page }) => page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center', behavior: 'instant' }), sel);

export default [
  // ---------- Coffee ----------
  { name: 'coffee-1-roast-curve', url: C, clip: '.curve .plot', expect: 'motion', frames: 7,
    note: 'The one reveal on the page: a two-transform wipe at --duration-page (600 ms), linear because x is time; markers pop at --duration-fast as the pen passes. No hero reveal at all, so the 800 ms allowance is unused.',
    trigger: into('figure.curve') },
  { name: 'coffee-2-contour-rise', url: C, clip: '.lots > li:first-child .tile', expect: 'motion', frames: 6,
    note: 'Contours fade in from the lowest level to the summit, opacity only, --duration-base, the last level starts within 300 ms.',
    trigger: into('.lots') },
  { name: 'coffee-3-cart-badge', url: C + '?state=quick', clip: '#cart-count', pad: 12, expect: 'motion', frames: 6,
    note: 'Quick add submits with a remembered grind: the old digit leaves upward (--duration-fast, exit), the new one rolls in (--duration-base, enter), the badge bumps once. Filmed at the header behind the opening drawer.',
    trigger: async ({ page }) => page.click('#q-add') },
  { name: 'coffee-4-cart-drawer', url: C + '?state=quick', clip: '#cart', expect: 'motion', frames: 6,
    note: 'The drawer enters 24px from the right with opacity at --duration-slow (300 ms), --ease-enter.',
    trigger: async ({ page }) => page.click('#q-add') },
  { name: 'coffee-5-letters-success', url: C, clip: '#news', expect: 'motion', frames: 5,
    note: 'Confirmation rises 4px at --duration-base with --ease-enter after the 900 ms send.',
    setup: async ({ page }) => { await into('#news')({ page }); await page.fill('#email', 'dana@example.com'); },
    trigger: async ({ page }) => page.click('#news-btn'), wait: 1500 },
  { name: 'coffee-6-slip-change', url: C, clip: '#sub-form #g-every', expect: 'motion', frames: 4,
    note: 'Changing the plan: the chosen option tints over --duration-instant (background color only, no movement); its ring snaps; the button and term line rewrite in place inside reserved height, so nothing shifts.',
    setup: into('#sub-form'), trigger: async ({ page }) => page.click('input[name=every][value="4"]', { force: true }) },
  // ---------- Tally ----------
  { name: 'dash-1-live-kpi', url: D + '?demo=live', clip: '.kpis.ready', expect: 'motion', frames: 6,
    note: 'A live poll changes two KPIs on screen: only changed digits roll (--duration-fast out, --duration-base in). Never on first load; Pause stops it (WCAG 2.2.2).',
    trigger: async () => {}, wait: 2000 },
  { name: 'dash-2-metric-switch', url: D, clip: '#chart-panel', expect: 'none', frames: 4,
    note: 'A KPI tile switches the chart metric: a redraw, never a transition (a frequent action; design-motion 04).',
    trigger: async ({ page }) => page.click('.kpi-pick[data-metric="conv"]') },
  { name: 'dash-3-palette-key', url: D, clip: '#palette', expect: 'none', frames: 4,
    note: 'Ctrl+K opens the command palette with no animation: keyboard paths do not animate (FOUNDATIONS item 10).',
    trigger: async ({ page }) => page.keyboard.press('Control+k') },
];
