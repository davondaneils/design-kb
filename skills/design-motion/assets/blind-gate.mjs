#!/usr/bin/env node
// blind-gate: the motion judge. Films a build's moments and the exemplar moments they are measured against, strips
// every label, shuffles them, and hands a fresh critic only the unlabeled pairs. The build passes when the critic
// cannot tell which clip is the exemplar and can name one memorable moment in ours. Checks that only measure whether
// motion is present (motion-plan-check) passed the fresh brief while the result was "not anything special"
// (kb/tests/fresh/RESULTS.md); this gate measures the thing itself.
//
// 1. Prepare (films live; needs network for the exemplars):
//    node skills/design-motion/assets/blind-gate.mjs prepare <page.html|url> --out <dir>
//         --moment scene:#pay-scene [--moment hero:top] [--moment stack:#feed] ...   (kinds: scene swap event hero stack)
//         [--width 1440] [--scheme light|dark] [--seed n]
//    A moment is kind:selector; "hero:top" films the first screen from load. Each moment is paired with the exemplar for
//    its kind (assets/exemplar-moments.json "pairs"). Product pages bring at least three moments, the hero included.
//    Writes, per trial: <dir>/trial-N/{A,B}.mp4, {A,B}-overview.jpg (2 fps, whole clip, timestamped),
//    {A,B}-detail.jpg (10 fps around the clip's biggest change); <dir>/ours-stills.jpg (opening, result, ending: the
//    article's three stills); <dir>/QUESTIONS.md (the critic's form). The key goes to <dir>/../.<name>.blind-key.json,
//    outside the folder the critic is given.
//    stills: the same filming for ours only (no exemplars, no key, no network): <dir>/ours-N.mp4, ours-N-overview.jpg
//    and ours-stills.jpg. The builder's own review tool (reference 09 section 6); the gate itself stays prepare.
// 2. Judge: a fresh critic (no build context, no file paths but <dir>) opens the images, answers QUESTIONS.md and
//    writes <dir>/answers.json. It is told one clip in each pair is world class and asked which, how sure, what gave it
//    away, and the one moment it would remember from each clip.
// 3. Grade: node skills/design-motion/assets/blind-gate.mjs grade --out <dir>  (exit 1 on fail)
//    A trial passes when the critic picked ours as the stronger clip, called them the same, or picked the exemplar with
//    confidence 1 or 2 of 5; and named a memorable moment in ours ("none" and blanks fail).
//    The gate passes when every trial names a memorable moment in ours and at most one trial was told apart with
//    confidence 3 or more. Writes <dir>/gate.json with the tells and the four-field corrections to act on.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const here = path.dirname(new URL(import.meta.url).pathname);
const toolsDir = process.env.DESIGN_KB_TOOLS || path.resolve(here, '../../../tools');
const args = process.argv.slice(2);
const cmd = args[0];
const flag = (n, d) => { const i = args.indexOf('--' + n); return i === -1 ? d : args[i + 1]; };
const flags = (n) => args.flatMap((a, i) => (a === '--' + n ? [args[i + 1]] : []));
const out = flag('out', null);
if (!['prepare', 'stills', 'grade'].includes(cmd) || !out) {
  console.error('usage: blind-gate.mjs prepare <page> --out dir --moment kind:selector [...]\n       blind-gate.mjs stills <page> --out dir --moment kind:selector [...]\n       blind-gate.mjs grade --out dir');
  process.exit(2);
}
const keyFile = path.join(path.dirname(path.resolve(out)), '.' + path.basename(path.resolve(out)) + '.blind-key.json');
const sh = (bin, a) => execFileSync(bin, a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';

if (cmd === 'grade') grade();
else await prepare();

async function prepare() {
  const { launch, toUrl } = await import(pathToFileURL(path.join(toolsDir, 'browser.mjs')).href);
  const target = args[1];
  const moments = flags('moment').map((m) => { const i = m.indexOf(':'); return { kind: m.slice(0, i), sel: m.slice(i + 1) }; });
  if (!target || !moments.length) { console.error('prepare needs a page and at least one --moment kind:selector'); process.exit(2); }
  const lib = JSON.parse(fs.readFileSync(path.join(here, 'exemplar-moments.json'), 'utf8'));
  const W = +flag('width', 1440), H = W < 600 ? 844 : 900;
  const scheme = flag('scheme', 'light');
  let seed = +flag('seed', Date.now() % 100000);
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(path.dirname(path.resolve(out)), '.gate-'));

  // Film one clip. Returns { file, ms } with the clip trimmed to start at `startAt` (ms from context start).
  // trimLead: record up to that many ms extra and start the clip 300ms before the first visible change (a page that
  // stays blank while it loads, as Linear's hero does headless, would otherwise hand the critic seconds of black).
  async function film({ url, script = [], crop, cropEl, record, startOnText, trimLead = 0, viewport = { width: 1440, height: 900 }, colorScheme = 'light' }, name) {
    const browser = await launch();
    const dir = path.join(tmp, name); fs.mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme, reducedMotion: 'no-preference', recordVideo: { dir, size: viewport },
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36' });
    const page = await ctx.newPage();
    const t0 = Date.now();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch((e) => console.error('  goto', e.message.split('\n')[0]));
    let startAt = null;
    if (startOnText) {
      for (let i = 0; i < 300 && startAt == null; i++) {
        // Visible means: some match has a box and the product of its and its ancestors' opacity is over 0.02.
        const vis = await page.evaluate((s) => [...document.querySelectorAll(s)].some((e) => {
          if (!e.getBoundingClientRect().height) return false;
          let op = 1; for (let a = e; a; a = a.parentElement) op *= parseFloat(getComputedStyle(a).opacity);
          return op > 0.02;
        }), startOnText).catch(() => false);
        if (vis) startAt = Date.now() - t0 - 250; else await page.waitForTimeout(50);
      }
    }
    // Scroll to the element before the script's wait, so the clip opens on the settled scene, not on the scroll
    // and the section's own reveal (the critic read both as a cut to a blank frame).
    let box = crop;
    if (cropEl) {
      box = await page.evaluate(([sel]) => {
        const e = document.querySelector(sel); if (!e) return null;
        e.scrollIntoView({ block: 'center', behavior: 'instant' });
        const r = e.getBoundingClientRect(), pad = 24;
        const x = Math.max(0, Math.floor(r.left - pad)), y = Math.max(0, Math.floor(r.top - pad));
        return [x, y, Math.min(innerWidth - x, Math.ceil(r.width + 2 * pad)), Math.min(innerHeight - y, Math.ceil(r.height + 2 * pad))].join(',');
      }, [cropEl]);
      if (!box) console.error(`  ${cropEl} not found on the page`);
    }
    for (const st of script) {
      try {
        if (st.wait) await page.waitForTimeout(st.wait);
        else if (st.scroll != null) await page.evaluate((y) => scrollTo(0, y), st.scroll);
        else if (st.eval) await page.evaluate(st.eval);
        else if (st.click) await page.click(st.click, { timeout: 3000 });
      } catch (e) { console.error('  step', JSON.stringify(st).slice(0, 60), e.message.split('\n')[0]); }
    }
    if (startAt == null) {
      // Playwright's recording shows one washed-out frame about 5.0s after the context starts, on every page (seen in
      // kb/moments films and in gate round v06, where all three critics flagged it as a page glitch). Start after it.
      const since = Date.now() - t0;
      if (cropEl && since < 5400) await page.waitForTimeout(5400 - since); // a hero films from load, so it keeps it
      // Film the scene from its opening state: restart it (scene.js) now, so a scene that plays once is not caught
      // after its change (gate round v07: "the before state is visible for under a second").
      if (cropEl) await page.evaluate((sel) => { const e = document.querySelector(sel); const s = e?.closest('[data-scene]') || e?.querySelector('[data-scene]'); s?.__scene?.restart?.(); }, cropEl).catch(() => {});
      startAt = Date.now() - t0;
    }
    await page.waitForTimeout(record + trimLead);
    const video = page.video();
    await ctx.close(); await browser.close();
    const raw = await video.path();
    const [x, y, w, h] = (box || `0,0,${viewport.width},${viewport.height}`).split(',').map(Number);
    if (trimLead) {
      const lead = firstChange(raw, startAt / 1000, (record + trimLead) / 1000);
      startAt += Math.max(0, Math.min(trimLead, lead * 1000 - 300));
    }
    const file = path.join(tmp, name + '.mp4');
    // Fit every clip into the same 960x600 frame on the same neutral ground, so size and framing give nothing away.
    sh('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(startAt / 1000), '-t', String(record / 1000), '-i', raw, '-vf',
      `fps=25,crop=${w - (w % 2)}:${h - (h % 2)}:${x}:${y},scale=960:600:force_original_aspect_ratio=decrease,pad=960:600:(ow-iw)/2:(oh-ih)/2:color=0x808080`,
      '-an', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', file]);
    return { file, ms: record };
  }

  // Seconds from ss to the first frame that differs visibly from the one before.
  const firstChange = (file, ss, dur) => {
    let log = '';
    try { log = execFileSync('ffmpeg', ['-ss', String(ss), '-t', String(dur), '-i', file, '-vf', "select='gte(scene,0)',metadata=print:file=-", '-an', '-f', 'null', '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { log = e.stdout || ''; }
    const pts = [...log.matchAll(/pts_time:([\d.]+)[\s\S]*?scene_score=([\d.]+)/g)].map((m) => [+m[1], +m[2]]);
    const hit = pts.find((p) => p[1] > 0.004);
    return hit ? hit[0] : 0;
  };
  // Frames per second of change in a clip, to place the detail strip on the biggest change.
  const busiest = (file) => {
    const log = (() => { try { return execFileSync('ffmpeg', ['-i', file, '-vf', "select='gte(scene,0)',metadata=print:file=-", '-an', '-f', 'null', '-'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch (e) { return e.stdout || ''; } })();
    const pts = [...log.matchAll(/pts_time:([\d.]+)[\s\S]*?scene_score=([\d.]+)/g)].map((m) => [+m[1], +m[2]]);
    let best = 0, at = 0;
    for (let i = 0; i < pts.length; i++) { const s = pts.slice(i, i + 25).reduce((a, p) => a + p[1], 0); if (s > best) { best = s; at = pts[i][0]; } }
    return Math.max(0, at - 0.4);
  };
  const sheet = (file, outJpg, fps, ss, dur, cols) => {
    const n = Math.max(1, Math.round(dur * fps)), rows = Math.ceil(n / cols);
    sh('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(ss), '-t', String(dur), '-i', file, '-vf',
      `fps=${fps},scale=320:-2,drawtext=fontfile=${FONT}:text='%{eif\\:t+${ss}\\:d}.%{eif\\:mod((t+${ss})*100\\,100)\\:d\\:2}s':x=6:y=6:fontsize=14:fontcolor=white:box=1:boxcolor=black@0.7,tile=${cols}x${rows}:padding=4:color=gray`,
      '-frames:v', '1', '-q:v', '4', outJpg]);
  };

  const key = { page: target, created: new Date().toISOString(), trials: [] };
  const ours = [];
  for (const [i, m] of moments.entries()) {
    const ex = lib.moments.find((e) => e.id === lib.pairs[m.kind]);
    if (!ex) { console.error(`no exemplar for kind "${m.kind}"`); process.exit(2); }
    const hero = m.sel === 'top';
    console.log(`trial ${i + 1}: ${m.kind} ${m.sel} against ${ex.id}`);
    const a = await film({ url: toUrl(target), viewport: { width: W, height: H }, colorScheme: scheme, record: ex.record,
      cropEl: hero ? null : m.sel, crop: hero ? `0,0,${W},${H}` : null, script: hero ? [] : [{ wait: 1200 }] }, `ours-${i + 1}`);
    if (cmd === 'stills') {
      fs.copyFileSync(a.file, path.join(out, `ours-${i + 1}.mp4`));
      sheet(a.file, path.join(out, `ours-${i + 1}-overview.jpg`), 2, 0, ex.record / 1000, 6);
      ours.push(a.file); continue;
    }
    const b = await film({ url: ex.url, script: ex.script, crop: ex.crop, record: ex.record, startOnText: ex.startOnText, trimLead: ex.trimLead || 0 }, `ex-${i + 1}`);
    const oursIsA = rand() < 0.5;
    const dir = path.join(out, `trial-${i + 1}`); fs.mkdirSync(dir, { recursive: true });
    const pair = oursIsA ? { A: a, B: b } : { A: b, B: a };
    for (const L of ['A', 'B']) {
      fs.copyFileSync(pair[L].file, path.join(dir, `${L}.mp4`));
      const secs = ex.record / 1000;
      sheet(pair[L].file, path.join(dir, `${L}-overview.jpg`), 2, 0, secs, 6);
      const at = busiest(pair[L].file);
      sheet(pair[L].file, path.join(dir, `${L}-detail.jpg`), 10, at, Math.min(2, secs - at), 5);
    }
    key.trials.push({ trial: i + 1, kind: m.kind, selector: m.sel, exemplar: ex.id, ours: oursIsA ? 'A' : 'B' });
    ours.push(a.file);
  }
  // The article's three stills for ours: opening, result, ending of the first non-hero moment (else the hero).
  const main = ours[moments.findIndex((m) => m.sel !== 'top')] || ours[0];
  const dur = +sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', main]).trim();
  const tiles = [0.15, 0.55, 0.97].map((f, k) => { const o = path.join(tmp, `still-${k}.png`); sh('ffmpeg', ['-y', '-loglevel', 'error', '-ss', String(dur * f), '-i', main, '-frames:v', '1', o]); return o; });
  sh('ffmpeg', ['-y', '-loglevel', 'error', ...tiles.flatMap((t) => ['-i', t]), '-filter_complex', 'hstack=inputs=3', path.join(out, 'ours-stills.jpg')]);
  if (cmd === 'stills') { fs.rmSync(tmp, { recursive: true, force: true }); console.log(`wrote ours-stills.jpg and ${ours.length} clip(s) to ${out}`); return; }
  fs.writeFileSync(keyFile, JSON.stringify(key, null, 1));
  fs.writeFileSync(path.join(out, 'QUESTIONS.md'), questions(key.trials.length));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`prepared ${key.trials.length} blind trial(s) in ${out}; key kept outside it. Next: a fresh critic answers ${path.join(out, 'QUESTIONS.md')}, then: blind-gate.mjs grade --out ${out}`);
}

function questions(n) {
  return `# Blind motion review

You are judging motion craft. Each trial folder (trial-1 to trial-${n}) holds two clips of a product moment, **A** and **B**, filmed the same way and fitted to the same gray frame. In every trial **one clip is from a world-class product site and the other is not**. You do not know which. Judge only what you see.

For each clip you have: \`A.mp4\` / \`B.mp4\` (if you can play video), \`A-overview.jpg\` / \`B-overview.jpg\` (two frames a second, timestamped), \`A-detail.jpg\` / \`B-detail.jpg\` (ten frames a second around the biggest change). Read the timestamps: holds, the order things move in, and how long text stays still are visible in them.

What to look for: does one thing own the screen at a time; is every piece of text held still long enough to read aloud; do changes happen in place or cut; is the product's own action the climax; are offsets between related things about a tenth of a second; do curves land rather than stop; is anything decorative.

If you recognize a brand, say so in "tells", then judge the craft anyway: the score is for what is on screen, not for who made it.

Score each clip 1 to 10 for motion craft, on this scale: 10 the best work in the world; 8 to 9 what a top product team ships; 6 to 7 strong professional work with visible faults; 4 to 5 competent and forgettable; 1 to 3 faults that block understanding. Score the clips independently: the same score for both is allowed.

Write the answers file you were told to write (\`answers.json\` if none was named) in this folder: an array with one object per trial.

\`\`\`json
[
  {
    "trial": 1,
    "stronger": "A",            // "A", "B" or "same": which clip shows the stronger motion craft
    "confidence": 4,            // 1 (coin flip) to 5 (certain)
    "scores": { "A": 6, "B": 9 },   // motion craft, 1 to 10 each, on the scale above
    "tells": ["B holds the total for under a second", "A's rows roll in place top to bottom"],
    "memorable": { "A": "the price changing currency in place", "B": "none" },   // the one moment you would describe to a friend; "none" if there is none
    "corrections": [            // up to five, for the weaker clip only, each tied to a timestamp
      { "where": "B 2.40s, the receipt", "problem": "reads for 0.6s then the cursor moves over it", "change": "hold the receipt 2.5s with the cursor still", "keep": "the press timing" }
    ]
  }
]
\`\`\`

Corrections use four fields: where (clip, time, element), problem (what you saw), change (what to do), keep (what must stay as it is). Fix missing information and unreadable text first, then timing, then visual detail.
`;
}

function grade() {
  if (!fs.existsSync(keyFile)) { console.error(`no key at ${keyFile}; run prepare first`); process.exit(2); }
  const key = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
  // One answers file per critic: answers.json, or answers-1.json, answers-2.json, ... (v0.4.2: three critics).
  const files = fs.readdirSync(out).filter((f) => /^answers(-\d+)?\.json$/.test(f)).sort();
  if (!files.length) { console.error(`no answers in ${out}; fresh critics answer QUESTIONS.md first`); process.exit(2); }
  const critics = files.map((f) => ({ file: f, answers: JSON.parse(fs.readFileSync(path.join(out, f), 'utf8').replace(/\/\/[^\n]*/g, '')) }));
  const blank = (s) => !s || /^\s*(none|nothing|n\/?a|-|no)\b/i.test(String(s));
  const median = (xs) => { const v = xs.filter((x) => Number.isFinite(x)).sort((m, n) => m - n); if (!v.length) return null; const h = v.length >> 1; return v.length % 2 ? v[h] : (v[h - 1] + v[h]) / 2; };
  const rows = key.trials.map((t) => {
    const ex = t.ours === 'A' ? 'B' : 'A';
    const per = critics.map(({ file, answers }) => {
      const a = answers.find((x) => +x.trial === t.trial) || {};
      const sc = a.scores || {};
      return { critic: file, stronger: a.stronger, confidence: +a.confidence, toldApart: a.stronger === ex && +a.confidence >= 3,
        ours: +sc[t.ours], exemplar: +sc[ex], memorable: blank((a.memorable || {})[t.ours]) ? null : a.memorable[t.ours],
        recognised: (a.tells || []).some((x) => /recogni[sz]e|brand|stripe|linear|sonner/i.test(x)),
        corrections: (a.corrections || []).filter((c) => String(c.where || '').trim().startsWith(t.ours)) };
    });
    const ours = median(per.map((x) => x.ours)), exemplar = median(per.map((x) => x.exemplar));
    const gap = ours == null || exemplar == null ? null : +(exemplar - ours).toFixed(1);
    const moments = per.filter((x) => x.memorable).length;
    // Scored: the median craft score of ours is within 1 point of the exemplar's, and most critics remember a moment.
    // With no scores (a v0.4 answers file), fall back to the tell-apart rule.
    const scored = gap != null;
    const pass = (scored ? gap <= 1 : per.every((x) => !x.toldApart)) && moments * 2 > per.length;
    return { trial: t.trial, kind: t.kind, exemplar: t.exemplar, ours: t.ours, scoreOurs: ours, scoreExemplar: exemplar, gap,
      memorableCount: moments, critics: per.length, toldApart: per.filter((x) => x.toldApart).length, recognised: per.filter((x) => x.recognised).length, per, pass };
  });
  const pass = rows.length >= 1 && rows.every((r) => r.pass);
  const result = { page: key.page, graded: new Date().toISOString(), rule: 'median craft score within 1 of the exemplar, and a memorable moment named by most critics, in every trial', pass, critics: critics.length, rows };
  fs.writeFileSync(path.join(out, 'gate.json'), JSON.stringify(result, null, 1));
  console.log(`blind gate: ${key.page} (${critics.length} critic(s))`);
  for (const r of rows) console.log(`  trial ${r.trial} ${r.kind.padEnd(6)} vs ${r.exemplar.padEnd(22)} ours ${r.scoreOurs ?? '-'} vs ${r.scoreExemplar ?? '-'} (gap ${r.gap ?? '-'}); memorable ${r.memorableCount}/${r.critics}; told apart ${r.toldApart}/${r.critics}, recognised ${r.recognised}/${r.critics} ${r.pass ? 'PASS' : 'FAIL'}`);
  for (const r of rows) for (const x of r.per) for (const c of x.corrections) console.log(`  fix (trial ${r.trial}, ${x.critic}) where: ${c.where} | problem: ${c.problem} | change: ${c.change} | keep: ${c.keep}`);
  console.log(pass ? 'PASS: in every trial our median craft score is within 1 point of the exemplar and most critics remember a moment'
    : `FAIL: ${rows.filter((r) => !r.pass).length} of ${rows.length} trial(s) miss (gap over 1, or no memorable moment for most critics)`);
  process.exit(pass ? 0 : 1);
}
