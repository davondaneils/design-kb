// Full tester run for design-graphic (repo root): build, sheets, lint every page and state, icon audit, renders.
//   node kb/tests/design-graphic/run.mjs [--no-render]
import { execFileSync } from 'node:child_process';
const D = 'kb/tests/design-graphic';
const run = (args, ok = false) => {
  try { return execFileSync('node', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { if (!ok) process.exitCode = 1; return e.stdout || ''; }
};
run([`${D}/build.mjs`]); run([`${D}/mark-sheet.mjs`]); run([`${D}/icon-sheet.mjs`]);
run(['tools/lint.mjs', `${D}/coffee.html`, '--quiet', '--states', 'state=added,state=subscribed,state=error,state=sending']);
run(['tools/lint.mjs', `${D}/dashboard.html`, '--quiet', '--states', 'state=loading,state=empty,state=partial,state=viewer,density=compact,open=palette,open=sheet']);
for (const f of ['coffee-states', 'dashboard-states', 'mark-sheet', 'icon-sheet']) run(['tools/lint.mjs', `${D}/${f}.html`, '--quiet']);
process.stdout.write(run([`${D}/lint-summary.mjs`], true));
for (const p of ['dashboard', 'coffee']) process.stdout.write(`icon audit ${p}: ` + run(['skills/design-graphic/assets/icon_audit.mjs', `${D}/${p}.html`, '--json', `${D}/${p}.icons.json`]).trim().split('\n').pop() + '\n');
if (!process.argv.includes('--no-render')) {
  for (const f of ['coffee', 'dashboard', 'coffee-states', 'dashboard-states', 'mark-sheet', 'icon-sheet']) run(['tools/render.mjs', `${D}/${f}.html`, `${D}/shots`]);
  run(['tools/render.mjs', `${D}/dashboard.html?state=empty`, `${D}/shots`, '--widths', '1440', '--schemes', 'light']);
  run(['tools/render.mjs', `${D}/dashboard.html?state=viewer`, `${D}/shots`, '--widths', '1440', '--schemes', 'dark']);
  console.log('renders written to', `${D}/shots`);
}
