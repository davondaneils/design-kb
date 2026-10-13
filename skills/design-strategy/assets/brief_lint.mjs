#!/usr/bin/env node
// brief_lint.mjs: checks a design-strategy brief (assets/strategy-brief.md format).
// Usage: node brief_lint.mjs <brief.md> [--json]
//        node brief_lint.mjs --self-test
// Exit 1 on any FAIL. WARN lines are read and decided by the author.
import { readFileSync } from 'node:fs';

const DEPTHS = ['inherit', 'three lines', 'one page', 'full'];
const WORD_WARN = 700;
const WORD_FAIL = 900;

function stripComments(text) {
  return text.replace(/<!--[\s\S]*?-->/g, '');
}

function field(text, label) {
  const re = new RegExp('^' + label.replace(/[()]/g, '\\$&') + ':\\s*(.*)$', 'im');
  const m = text.match(re);
  return m ? m[1].trim() : null;
}

function tableAfter(text, heading) {
  const idx = text.search(new RegExp('^##\\s+' + heading, 'im'));
  if (idx < 0) return null;
  const rest = text.slice(idx).split('\n').slice(1);
  const rows = [];
  let started = false;
  for (const line of rest) {
    if (/^##\s/.test(line)) break;
    if (/^\|/.test(line.trim())) {
      started = true;
      const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
      if (cells.every((c) => /^:?-{3,}:?$/.test(c))) continue;
      rows.push(cells);
    } else if (started && line.trim() !== '' && !/^\|/.test(line.trim())) {
      // a non-table line after the table ends it
      if (rows.length) break;
    }
  }
  return rows.length ? rows.slice(1) : []; // drop the header row
}

export function lint(raw) {
  const out = [];
  const fail = (rule, msg) => out.push({ level: 'FAIL', rule, msg });
  const warn = (rule, msg) => out.push({ level: 'WARN', rule, msg });
  const text = stripComments(raw);

  // House rules and leftovers
  if (/\u2014/.test(raw)) fail('em-dash', 'em dash found; house rule: never use em dashes');
  const ph = text.match(/\{\{[^}]*\}\}/g);
  if (ph) fail('placeholder', `${ph.length} unfilled {{field}} left, first: ${ph[0]}`);
  if (/\b(TODO|TBD|lorem ipsum)\b/i.test(text)) fail('placeholder', 'TODO, TBD or lorem ipsum left in the brief');

  const words = text.replace(/[|#*`>-]/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words > WORD_FAIL) fail('length', `${words} words; one page means about ${WORD_WARN} or fewer`);
  else if (words > WORD_WARN) warn('length', `${words} words; aim for ${WORD_WARN} or fewer`);

  // Header
  const depthRaw = (field(text, 'Depth') || '').toLowerCase();
  const depth = DEPTHS.find((d) => depthRaw.startsWith(d));
  if (!depth) fail('depth', 'Depth: must start with inherit, three lines, one page or full');
  const locale = field(text, 'Locale');
  if (!locale || !/^[a-z]{2,3}(-[A-Z]{2})?\b/.test(locale)) fail('locale', 'Locale: must start with a language tag such as en-US or en-GB (it becomes <html lang>)');
  else if (/^en\b(?!-)/.test(locale)) warn('locale', 'Locale "en" reads as en-US; name the region');

  // Audience moment (every depth)
  const moment = field(text, 'Moment');
  if (!moment) fail('moment', 'Moment: missing');
  else if (!/\bwhen\b/i.test(moment)) fail('moment', 'Moment must describe a situation: "[who] when [trigger], wanting [progress], held back by [anxiety]"');
  else if (!/held back|afraid|worried|anxi|fear|habit/i.test(moment)) warn('moment', 'Moment names no anxiety or habit');

  if (depth === 'inherit') {
    if (!field(text, 'Brand source')) fail('inherit', 'Brand source: missing (what you inherit)');
    if (!field(text, 'Must not change')) fail('inherit', 'Must not change: missing');
    return finish(out, depth, words);
  }

  // Three lines and up
  const fact = field(text, 'Fact');
  if (!fact) fail('fact', 'Fact: missing (the one true fact)');
  else if (!/source/i.test(fact)) fail('fact', 'Fact has no (source: ...)');
  const wall = field(text, 'Competitor wall');
  if (!wall) fail('wall', 'Competitor wall: missing (what the category shares)');
  const concept = field(text, 'Concept sentence');
  if (!concept) fail('concept', 'Concept sentence: missing (hand-off to design-art-direction)');
  else if (concept.split(/(?<=[.!?])\s+/).filter((s) => s.trim()).length > 2) warn('concept', 'Concept is more than one sentence');
  if (!field(text, 'Reject test')) fail('concept', 'Reject test: missing');

  if (depth === 'three lines') return finish(out, depth, words);

  // One page and full
  const anx = field(text, 'Anxiety and design answer');
  if (!anx || !/->|→/.test(anx)) fail('anxiety', 'Anxiety and design answer: write "fear -> design answer"');
  const theirWords = field(text, 'Their words');
  if (!theirWords || !/source/i.test(theirWords)) fail('words', 'Their words: missing or no (source: ...)');
  if (!field(text, 'Primary CEP (hero)')) fail('cep', 'Primary CEP (hero): missing');

  const alts = field(text, 'Alternatives');
  if (!alts) fail('alternatives', 'Alternatives: missing');
  else if (!/status quo/i.test(alts)) fail('alternatives', 'Alternatives must name the status quo first ("status quo: ...")');
  const comps = field(text, 'Competitors named');
  const n = comps ? comps.split(/[,;]/).map((s) => s.trim()).filter(Boolean).length : 0;
  if (n < 3) (n === 0 ? fail : warn)('competitors', `Competitors named: ${n}; the swap tests use 3`);
  if (!field(text, 'Category frame')) fail('category', 'Category frame: missing');
  const only = field(text, 'Onlyness (internal)');
  if (!only || !/\bonly\b/i.test(only)) fail('onlyness', 'Onlyness (internal): missing the word "only"');
  const swap = field(text, 'Swap test');
  if (!swap || !/\b(pass|passes|passed|fail|fails|failed)\b/i.test(swap)) fail('swap', 'Swap test: record pass or fail');
  else if (/\bfail/i.test(swap) && !/\bpass/i.test(swap)) fail('swap', 'Swap test failed and no passing rewrite is recorded');
  if (!field(text, 'Proof on the page')) fail('proof', 'Proof on the page: missing');
  if (!field(text, 'Weakest field')) warn('weakest', 'Weakest field: not named');

  // Claims ledger
  const ledger = tableAfter(text, '4\\. Claims ledger') || [];
  if (!ledger.length) warn('ledger', 'Claims ledger is empty; every public claim needs a row');
  ledger.forEach((r, i) => {
    if (r.length < 4 || r.slice(0, 4).some((c) => !c)) fail('ledger', `ledger row ${i + 1}: four cells needed (claim, fact, source, evidence held)`);
    else if (!/^(yes|cut)\b/i.test(r[3])) fail('ledger', `ledger row ${i + 1}: evidence held must be "yes" or "cut" (no evidence: rewrite as the fact or cut it)`);
  });

  // Voice
  const voice = tableAfter(text, '5\\. Voice') || [];
  if (voice.length < 2 || voice.length > 4) warn('voice', `${voice.length} voice attributes; use 3 or 4`);
  voice.forEach((r, i) => {
    if (!/,\s*not\s+/i.test(r[0] || '')) fail('voice', `voice row ${i + 1}: write "this, not that" ("Plainspoken, not blunt")`);
    if (!r[1] || r[1].replace(/["\s]/g, '') === '') fail('voice', `voice row ${i + 1}: sample line missing`);
  });
  if (!field(text, 'Flat in')) warn('voice', 'Flat in: name the moments where the voice goes flat');

  // Identity decisions
  const ident = tableAfter(text, '6\\. Identity decisions') || [];
  if (!ident.length) fail('identity', 'Identity decisions table is empty');
  ident.forEach((r, i) => {
    if (r.length < 5 || r.slice(0, 5).some((c) => !c)) fail('identity', `identity row ${i + 1}: five cells needed (attribute, decision, reason, level, owner)`);
    else if (!/^(E|C|O)\b/.test(r[3])) fail('identity', `identity row ${i + 1}: level must start with E, C or O, got "${r[3]}"`);
  });
  const identAttrs = ident.map((r) => (r[0] || '').toLowerCase()).join(' ');
  voice.forEach((r) => {
    const head = (r[0] || '').split(',')[0].trim().toLowerCase();
    if (head && !identAttrs.includes(head)) warn('twin', `voice attribute "${head}" has no visual twin in the identity table`);
  });
  const folklore = text.match(/\b(blue|green|red|orange|purple|yellow|black|white|pink)\s+(means|=|equals|signals)\s+\w+/i);
  if (folklore) warn('folklore', `"${folklore[0]}" reads as a hue-meaning law; label it convention (C) at most`);
  const primary = field(text, 'Primary distinctive asset');
  if (!primary) fail('asset', 'Primary distinctive asset: missing');
  else if (/\b(colou?r|hue|palette)\b/i.test(primary) && !/\b(shape|mark|symbol|logo|container|character|wordmark|monogram|crop|form|pack|object|card)\b/i.test(primary))
    fail('asset', 'Primary distinctive asset is a color alone; lead with a shape (color is the weakest asset type)');
  const codes = field(text, 'Category codes');
  if (!codes || !/kept:/i.test(codes) || !/broken:/i.test(codes)) fail('codes', 'Category codes: write "kept: ...; broken: ..."');
  const audit = field(text, 'Asset audit (rebrand only)');
  if (depth === 'full' && (!audit || /not a rebrand/i.test(audit))) warn('audit', 'Full depth with no asset audit; required for any rebrand');

  // Checks
  const checks = tableAfter(text, '8\\. Checks') || [];
  if (!checks.length) fail('checks', 'Checks table is empty');
  checks.forEach((r, i) => { if (!r[1]) fail('checks', `check row ${i + 1} (${r[0]}): no result recorded`); });

  return finish(out, depth, words);
}

function finish(out, depth, words) {
  return { depth: depth || null, words, fails: out.filter((o) => o.level === 'FAIL').length, findings: out };
}

function print(file, res) {
  console.log(`${file}: depth ${res.depth || '?'}, ${res.words} words`);
  for (const f of res.findings) console.log(`  ${f.level} ${f.rule}: ${f.msg}`);
  console.log(res.fails ? `FAIL (${res.fails})` : 'PASS');
}

function selfTest() {
  const ok = `# Strategy brief: Test
Depth: three lines (a poster)
Locale: en-GB (Glasgow)
Moment: printmakers in Glasgow when April plans are made, wanting a weekend of letters, held back by habit.
Fact: Glasgow is built of red sandstone laid in courses (source: city heritage records)
Competitor wall: festival posters lean on Didones
Concept sentence: Type is set the way the sandstone is set.
Reject test: Does it show stone, courses or setting?
`;
  const cases = [
    ['three-line brief passes', ok, 0],
    ['em dash fails', ok.replace('a poster', 'a poster \u2014 small'), 1],
    ['placeholder fails', ok.replace('Glasgow is', '{{fact}} Glasgow is'), 1],
    ['moment without when fails', ok.replace(' when April plans are made', ''), 1],
    ['fact without source fails', ok.replace(' (source: city heritage records)', ''), 1],
    ['bad locale fails', ok.replace('en-GB', 'British'), 1],
  ];
  let bad = 0;
  for (const [name, text, wantFails] of cases) {
    const r = lint(text);
    const got = r.fails > 0 ? 1 : 0;
    const pass = got === wantFails;
    if (!pass) bad++;
    console.log(`${pass ? 'ok  ' : 'BAD '} ${name} (fails: ${r.fails})`);
  }
  console.log(bad ? `self-test FAILED (${bad})` : 'self-test passed');
  process.exit(bad ? 1 : 0);
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) selfTest();
else if (!args.length || args[0].startsWith('--')) {
  console.log('Usage: node brief_lint.mjs <brief.md> [--json] | --self-test');
  process.exit(2);
} else {
  const file = args[0];
  const res = lint(readFileSync(file, 'utf8'));
  if (args.includes('--json')) console.log(JSON.stringify(res, null, 2));
  else print(file, res);
  process.exit(res.fails ? 1 : 0);
}
