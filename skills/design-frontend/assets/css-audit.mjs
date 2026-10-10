#!/usr/bin/env node
// CSS architecture audit for one page: are components token-driven, layered, logical, preference-aware?
// Reads the page's own stylesheets through the CSSOM in Chromium (what the browser parsed, not a regex over source).
//
// Usage: node css-audit.mjs <page.html> [--json out.json] [--quiet]
// Exit 1 when any "fail" check is above zero. Checks marked "warn" are judgment calls the report lists for a person.
//
// Token rules follow kb/FOUNDATIONS.md: primitives and raw values live only in token rules (custom property
// declarations); components use semantic tokens. Rule source: design-frontend SKILL.md section 1 (CSS) and
// references/07-measured-build-quality.md.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { launch, parseArgs } from './pw.mjs';

const opts = parseArgs(process.argv.slice(2), ['json']);
const file = opts._[0];
if (!file) { console.error('Usage: node css-audit.mjs <page.html> [--json out.json]'); process.exit(2); }

const browser = await launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(path.resolve(file)).href, { waitUntil: 'load' });
const report = await page.evaluate(() => {
  const out = { layers: [], layerRules: {}, unlayered: 0, styleRules: 0, decls: 0, tokens: 0, media: {}, containerRules: 0, containers: 0, has: 0,
    important: [], findings: {} };
  const add = (k, sel, val) => { (out.findings[k] ||= []).push(sel + ' { ' + val + ' }'); };
  // Split a declaration block on top-level semicolons (data: URLs contain ';').
  const splitDecls = (text) => { const res = []; let depth = 0, q = null, cur = '';
    for (const ch of text) { if (q) { if (ch === q) q = null; } else if (ch === '"' || ch === "'") q = ch; else if (ch === '(') depth++; else if (ch === ')') depth--; else if (ch === ';' && depth === 0) { res.push(cur); cur = ''; continue; } cur += ch; }
    if (cur.trim()) res.push(cur); return res.map((d) => d.trim()).filter(Boolean); };
  const spec = (sel) => { // rough specificity (ids, classes/attrs/pseudo-classes, types); :where() counts 0
    const s = sel.replace(/:where\([^)]*\)/g, '').replace(/::?(before|after|backdrop|selection|placeholder|marker)/g, ' x');
    return [(s.match(/#[\w-]+/g) || []).length, (s.match(/\.[\w-]+|\[[^\]]+\]|:(?!not|is|has)[\w-]+/g) || []).length, (s.match(/(^|[\s>+~(])[a-z][\w-]*/g) || []).length]; };
  const rawColor = /#[0-9a-f]{3,8}\b|\b(rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(|\b(white|black)\b/i;
  const primitive = /var\(--color-[a-z]+-\d{2,3}\b|var\(--color-brand\)/;
  const spaceProp = /^(margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left)(-|$)/;
  const physical = /^(margin|padding|border)-(left|right)\b|^(left|right)$|^border-(top|bottom)-(left|right)-radius$/; // inline axis only: RTL is the real risk (opinion)
  function walk(rules, ctx) {
    for (const r of rules) {
      const type = r.constructor.name;
      if (type === 'CSSLayerStatementRule') { out.layers.push(...r.nameList); continue; }
      if (type === 'CSSLayerBlockRule') { const name = (ctx.layer ? ctx.layer + '.' : '') + (r.name || '(anonymous)'); if (!out.layers.includes(name)) out.layers.push(name); walk(r.cssRules, { ...ctx, layer: name }); continue; }
      if (type === 'CSSMediaRule') { const c = r.conditionText || r.media.mediaText; out.media[c] = (out.media[c] || 0) + 1; walk(r.cssRules, { ...ctx, media: [...(ctx.media || []), c] }); continue; }
      if (type === 'CSSContainerRule') { out.containerRules++; walk(r.cssRules, { ...ctx, container: r.conditionText }); continue; }
      if (type === 'CSSSupportsRule') { walk(r.cssRules, ctx); continue; }
      if (type !== 'CSSStyleRule') continue;
      const sel = r.selectorText;
      out.styleRules++;
      if (ctx.layer) out.layerRules[ctx.layer] = (out.layerRules[ctx.layer] || 0) + 1; else out.unlayered++;
      if (/:has\(/.test(sel)) out.has++;
      const sp = spec(sel); if (sp[0] > 0) add('id-selector', sel, '');
      const media = (ctx.media || []).join(' and ');
      if (/:hover/.test(sel) && !/hover:\s*hover/.test(media)) add('hover-unguarded', sel, 'hover outside (hover: hover)');
      const forced = /forced-colors/.test(media);
      for (const d of splitDecls(r.style.cssText)) {
        const i = d.indexOf(':'); const prop = d.slice(0, i).trim(); let val = d.slice(i + 1).trim();
        const imp = /!important$/.test(val); val = val.replace(/\s*!important$/, '');
        out.decls++;
        if (imp) out.important.push((ctx.layer || 'unlayered') + ' :: ' + sel + ' { ' + prop + ' }');
        if (prop === 'container-type' || prop === 'container') out.containers++;
        if (prop.startsWith('--')) { // token declaration
          out.tokens++;
          if (/^--text-/.test(prop) && /^\d+(\.\d+)?px$/.test(val)) add('type-token-px', sel, `${prop}: ${val}`);
          if (!/^(:root|html)/.test(sel) && primitive.test(val) && !/^--color-illustration|^--color-/.test(prop)) add('component-token-primitive', sel, `${prop}: ${val}`);
          continue;
        }
        const noUrl = val.replace(/url\([^)]*\)/g, '').replace(/rgba?\(var\(--[\w-]+\)[^)]*\)/g, 'TOKEN');
        if (!forced && rawColor.test(noUrl)) add('raw-color', sel, `${prop}: ${val}`);
        if (primitive.test(val)) add('primitive-in-component', sel, `${prop}: ${val}`);
        if (spaceProp.test(prop)) { const px = (noUrl.replace(/var\([^)]*\)/g, '').match(/-?\d*\.?\d+px/g) || []).filter((p) => !/^-?[0-2]px$/.test(p)); if (px.length) add('raw-space', sel, `${prop}: ${val}`); }
        if ((prop === 'font-size' || prop === 'font') && /\b\d+(\.\d+)?px\b/.test(noUrl.replace(/var\([^)]*\)/g, ''))) add('font-size-px', sel, `${prop}: ${val}`);
        if (physical.test(prop) && !/^(0|0px|auto)$/.test(val)) add('physical-property', sel, `${prop}: ${val}`);
        if (prop === 'text-align' && /left|right/.test(val)) add('physical-property', sel, `${prop}: ${val}`);
        if (/\b100vh\b/.test(val)) add('vh-unit', sel, `${prop}: ${val}`);
        if (/^transition(-property)?$/.test(prop) && /\ball\b/.test(val)) add('transition-all', sel, `${prop}: ${val}`);
        if (/^(transition|animation)/.test(prop) && !/prefers-reduced-motion/.test(media) && !/none/.test(val)) add('motion-unguarded', sel, `${prop}: ${val}`);
      }
    }
  }
  for (const sh of document.styleSheets) { try { walk(sh.cssRules, {}); } catch { /* cross-origin */ } }
  for (const q of Object.keys(out.media)) if (/max-width:\s*\d+(\.\d+)?(px|em)/.test(q) || /min-width/.test(q)) (out.findings['media-min-max-syntax'] ||= []).push('@media ' + q);
  out.inlineStyleAttrs = [...document.querySelectorAll('[style]')].length;
  return out;
});
await browser.close();

const levels = { 'raw-color': 'fail', 'primitive-in-component': 'fail', 'raw-space': 'fail', 'font-size-px': 'fail', 'type-token-px': 'fail',
  'transition-all': 'fail', 'id-selector': 'warn', 'hover-unguarded': 'fail', 'physical-property': 'warn', 'vh-unit': 'warn',
  'motion-unguarded': 'warn', 'media-min-max-syntax': 'warn', 'component-token-primitive': 'warn' };
const counts = Object.fromEntries(Object.keys(levels).map((k) => [k, (report.findings[k] || []).length]));
const fails = Object.entries(counts).filter(([k, n]) => n && levels[k] === 'fail');
const res = { file, ...report, counts, levels, layered: report.layers.length > 0, verdict: fails.length ? 'fail' : 'pass' };
if (!opts.quiet) {
  console.log(`${file}: ${res.verdict.toUpperCase()}  (${report.styleRules} style rules, ${report.decls} declarations, ${report.tokens} token declarations)`);
  console.log(`  layers: ${report.layers.length ? report.layers.join(', ') : 'none'}; unlayered rules ${report.unlayered}`);
  console.log(`  container queries ${report.containerRules} (containers ${report.containers}), :has() rules ${report.has}, media queries ${Object.keys(report.media).length} distinct, !important ${report.important.length}, inline style attributes ${report.inlineStyleAttrs}`);
  for (const [k, n] of Object.entries(counts)) if (n) {
    console.log(`  ${levels[k].padEnd(4)} ${k}: ${n}`);
    for (const f of report.findings[k].slice(0, 4)) console.log(`         ${f.slice(0, 140)}`);
  }
}
if (opts.json) { fs.mkdirSync(path.dirname(opts.json), { recursive: true }); fs.writeFileSync(opts.json, JSON.stringify(res, null, 2)); }
process.exit(fails.length ? 1 : 0);
