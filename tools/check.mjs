#!/usr/bin/env node
// One command for the automated half of the design-director self-critique loop (section 5), so no step is skipped.
// Runs every tool the loop names on one page, writes a hand-over report with a pass or fail per step, and lists the
// judged steps that still need eyes. The report is what the hand-over pastes; "gate claimed" is never written by this
// script, only by a fresh-context critic (design-director section 5 step 13).
//
// Usage (from the repo root, after `npm ci` in tools/):
//   node tools/check.mjs <page.html> [--states a,b] [--sells] [--private] [--year 2026] [--brief brief.md]
//                        [--state-sheet sheet.html] [--out dir] [--no-render]
//
//   --states       state names for ?state= URLs (lint, claims, conversion and render run on each)
//   --sells        the page sells (pricing, subscription, shop, checkout, upgrade): runs conversion-audit
//   --private      an app screen behind a login: search-check runs with --expect private
//   --year         year for the claims inventory weekday check (default: this year)
//   --brief        the strategy brief; default: strategy-brief.md or brief.md beside the page, else the step fails
//   --state-sheet  the state sheet page; default: state-sheet.html beside the page, else a warning when the page has
//                  interactive controls
//   --out          report and renders folder (default: <page dir>/check-<page name>)
//   --no-render    skip the screenshots (they are needed for the judged steps, so only for a quick re-run)
//
// Exit 1 if any hard step fails, 0 otherwise. Advisory steps (polish-audit) warn and never fail the run.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const opt = { states: [], sells: false, private: false, year: new Date().getFullYear(), render: true };
let page;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--states') opt.states = argv[++i].split(',').map((s) => s.replace(/^state=/, '')).filter(Boolean);
  else if (a === '--sells') opt.sells = true;
  else if (a === '--private') opt.private = true;
  else if (a === '--year') opt.year = argv[++i];
  else if (a === '--brief') opt.brief = argv[++i];
  else if (a === '--state-sheet') opt.sheet = argv[++i];
  else if (a === '--out') opt.out = argv[++i];
  else if (a === '--no-render') opt.render = false;
  else if (!page) page = a;
}
if (!page || !fs.existsSync(page)) {
  console.error('Usage: node tools/check.mjs <page.html> [--states a,b] [--sells] [--private] [--year 2026] [--brief brief.md] [--state-sheet sheet.html] [--out dir] [--no-render]');
  process.exit(2);
}
page = path.resolve(page);
const dir = path.dirname(page);
const base = path.basename(page, path.extname(page));
const out = path.resolve(opt.out || path.join(dir, `check-${base}`));
fs.mkdirSync(out, { recursive: true });
const html = fs.readFileSync(page, 'utf8');
const urls = [page, ...opt.states.map((s) => `${page}?state=${s}`)];
const findBeside = (names) => names.map((n) => path.join(dir, n)).find((p) => fs.existsSync(p));
const brief = opt.brief ? path.resolve(opt.brief) : findBeside(['strategy-brief.md', 'brief.md']);
const sheet = opt.sheet ? path.resolve(opt.sheet) : findBeside(['state-sheet.html', `${base}-state-sheet.html`]);
const hasControls = /<(button|input|select|textarea)\b/i.test(html);
const hasIcons = /<svg\b/i.test(html);
const moves = /@keyframes|animation\s*:|transition\s*:|requestAnimationFrame|animate\(|scroll-timeline|view-timeline/i.test(html);

const steps = [];
function run(name, script, args, { advisory = false, loopStep } = {}) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [path.join(ROOT, script), ...args], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 << 20 });
  const text = `${r.stdout || ''}${r.stderr || ''}`.trim();
  const ok = r.status === 0;
  const result = ok ? 'PASS' : advisory ? 'WARN' : 'FAIL';
  const log = path.join(out, `${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.log`);
  fs.writeFileSync(log, `$ node ${script} ${args.join(' ')}\n\n${text}\n`);
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const failing = lines.filter((l) => /^(fail|FAIL|ERROR|Error)\b|^[A-Z]+\s+fail|\bfail\s+[a-z-]+:/.test(l));
  const tail = (ok || !failing.length ? lines.slice(-2) : failing.slice(0, 4)).join(' / ').slice(0, 300);
  steps.push({ name, loopStep, result, cmd: `node ${script} ${args.map((a) => (a.includes(' ') ? `"${a}"` : a)).join(' ')}`, tail, log, secs: ((Date.now() - t0) / 1000).toFixed(1) });
  console.log(`${result.padEnd(5)} ${name} (${steps.at(-1).secs}s)`);
}
const skip = (name, loopStep, why, result = 'SKIP') => {
  steps.push({ name, loopStep, result, cmd: '', tail: why });
  console.log(`${result.padEnd(5)} ${name}: ${why}`);
};

// 0. Strategy brief (design-director section 2 step 2)
if (brief) run('Strategy brief lint', 'skills/design-strategy/assets/brief_lint.mjs', [brief], { loopStep: '2.2' });
else skip('Strategy brief lint', '2.2', 'no strategy-brief.md or brief.md beside the page and no --brief: write the brief before any visual decision', 'FAIL');

// 1. Render every state at 4 widths, light and dark
if (opt.render) {
  for (const u of urls) {
    const q = u.includes('?') ? u.split('?state=')[1] : 'default';
    run(`Render ${q}`, 'tools/render.mjs', [u, path.join(out, 'renders'), '--name', `${base}-${q}`, '--widths', '390,768,1024,1440'], { loopStep: '5.1' });
  }
  if (sheet) run('Render state sheet', 'tools/render.mjs', [sheet, path.join(out, 'renders'), '--widths', '390,1440'], { loopStep: '5.1' });
} else skip('Render', '5.1', '--no-render: the judged steps below need screenshots from a full run');

// 2. Fundamentals lint, every state, plus the state sheet
run('Fundamentals lint', 'tools/lint.mjs', [page, '--out-dir', out, ...(opt.states.length ? ['--states', opt.states.map((s) => `state=${s}`).join(',')] : [])], { loopStep: '5.2' });
if (sheet) run('Lint state sheet', 'tools/lint.mjs', [sheet, '--out-dir', out], { loopStep: '5.2' });
else if (hasControls) skip('Lint state sheet', '5.2', 'the page has controls but no state sheet was found (state-sheet.html beside the page or --state-sheet)', 'WARN');

// 3. Fact check, static and rendered, every state
run('Claims inventory', 'skills/design-copy/assets/claims_inventory.mjs', [page, '--year', String(opt.year)], { loopStep: '5.3' });
for (const u of urls) run(`Claims inventory rendered ${u.includes('?') ? u.split('?')[1] : 'default'}`, 'skills/design-copy/assets/claims_inventory.mjs', [u, '--year', String(opt.year), '--render'], { loopStep: '5.3' });

// 4. Search check
run('Search check', 'skills/design-search/assets/search-check.mjs', [page, '--expect', opt.private ? 'private' : 'public'], { loopStep: '5.4' });

// 5. Conversion audit, only when the page sells
if (opt.sells) for (const u of urls) run(`Conversion audit ${u.includes('?') ? u.split('?')[1] : 'default'}`, 'skills/design-conversion/assets/conversion-audit.mjs', [u], { loopStep: '5.5' });
else skip('Conversion audit', '5.5', 'not run: pass --sells if the page has a price, plan, form that buys or an upgrade prompt');

// 6. Icon audit
if (hasIcons) run('Icon audit', 'skills/design-graphic/assets/icon_audit.mjs', [page], { loopStep: '5.6' });
else skip('Icon audit', '5.6', 'no inline SVG on the page');

// 8. Build proof
run('CSS audit', 'skills/design-frontend/assets/css-audit.mjs', [page], { loopStep: '4 build proof' });

// 9. Polish audit (advisory)
run('Polish audit', 'skills/design-polish/assets/polish-audit.mjs', [page], { advisory: true, loopStep: '5.9' });

const fails = steps.filter((s) => s.result === 'FAIL');
const rel = (p) => path.relative(dir, p) || '.';
const judged = [
  ['5.1', 'Looked at every screenshot in `renders/` at 390, 768, 1024 and 1440, light and dark, every state'],
  ['5.3', 'Ticked every claim in the claims inventory against its source, in every state and after one live update'],
  ...(moves ? [['5.7', 'Filmed every animation with `skills/design-motion/assets/motion-audit.mjs` (the page moves; screenshots render with reduced motion and show none of it). Cinematic or scroll-driven: a screen recording at `prefers-reduced-motion: no-preference` (design-motion 08)']] : []),
  ['5.8', 'Pixel diff (`skills/design-frontend/assets/pixel-diff.mjs`) after any markup-only change'],
  ['5.9', 'Walked design-polish `references/06-polish-checklist.md` on the screenshots and the state sheet'],
  ['5.10', 'Walked every `[judged]` row of design-foundations `references/fundamentals-checklist.md` at 768 and 1024 and every state'],
  ['5.11', 'Landing and brand: logo-hidden competitor test, word swap test, five-second test (design-strategy 06)'],
  ['5.12', 'Compared numbers side by side with the named exemplars (`kb/teardowns/INDEX.md`); named the three biggest gaps'],
  ['5.13', 'Fresh-context critic pass, or the hand-over says "gate not claimed: self-review only"'],
];
const md = `# Check report: ${path.basename(page)}

Generated by \`node tools/check.mjs\` on ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC. States: ${opt.states.length ? opt.states.join(', ') : 'default only'}. Sells: ${opt.sells ? 'yes' : 'no'}. Moves: ${moves ? 'yes' : 'no'}.

**Automated result: ${fails.length ? `${fails.length} FAIL` : 'all hard steps pass'}.** This is the automated half only; the gate is not claimed until the judged steps below are done and a fresh-context critic has passed it.

## Automated steps (design-director section 5)
| Loop step | Check | Result | Last lines | Log |
|---|---|---|---|---|
${steps.map((s) => `| ${s.loopStep || ''} | ${s.name} | ${s.result} | ${(s.tail || '').replace(/\|/g, '\\|')} | ${s.log ? `\`${rel(s.log)}\`` : ''} |`).join('\n')}

## Judged steps (tick each in the hand-over, with what you saw)
${judged.map(([n, t]) => `- [ ] ${n} ${t}`).join('\n')}

## Commands run
\`\`\`
${steps.filter((s) => s.cmd).map((s) => s.cmd).join('\n')}
\`\`\`
`;
const report = path.join(out, 'check-report.md');
fs.writeFileSync(report, md);
console.log(`\n${fails.length ? `${fails.length} hard step(s) failed` : 'All hard steps pass'}. Report: ${path.relative(process.cwd(), report)}`);
process.exit(fails.length ? 1 : 0);
