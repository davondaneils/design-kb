// Token checks for tools/lint.mjs (added after the round 4 critic review, kb/reviews/round4-critic.md: a sheet-only rule
// used --color-warning-mark, a token that existed nowhere, so the warning meter painted an empty bar; the coffee option
// hover was a raw 4 percent color-mix where FOUNDATIONS names an 8 percent --state-hover layer).
//
// tokenChecks(page, add) runs once per page (1440 light), on every stylesheet rule (inside @media, @layer, @container,
// @supports and nested rules) and every inline style attribute:
//   undefined-var  fail  a var(--name) with no fallback whose custom property is declared nowhere: not in any rule, not in
//                        any inline style, not registered with @property. The declaration is invalid at computed-value
//                        time, so it paints nothing (an empty meter, a missing ring) and no other check notices.
//                        Rules whose selector matches no element on the page are skipped (they paint nothing anyway).
//   state-layer    fail  a hover or pressed background (:hover, :active, .is-hover, .is-active, .is-pressed) that is a
//                        raw color (color-mix(), rgb(), hsl(), oklch(), hex) instead of a token: use var(--state-hover)
//                        or var(--state-pressed) on neutral surfaces, var(--color-primary-hover|active) on filled ones
//                        (FOUNDATIONS "State layers"). Also fails when --state-hover is not 8 percent or
//                        --state-pressed not 10 percent of the content color.
// Opt out per rule: none. Opt out per element (inline styles only): data-lint-skip="undefined-var state-layer".

export async function tokenChecks(page, add) {
  const r = await page.evaluate(() => {
    const defined = new Set();
    const uses = [];      // { name, where }
    const layers = [];    // { where, prop, value }
    const levels = {};    // --state-hover / --state-pressed declared percents
    const STATE_SEL = /:hover|:active|\.is-hover\b|\.is-active\b|\.is-pressed\b/;
    const refs = (v) => {
      const out = [];
      let i = 0;
      while ((i = v.indexOf('var(', i)) !== -1) {
        const m = v.slice(i + 4).match(/^\s*(--[\w-]+)\s*([,)])/);
        if (m) out.push({ name: m[1], fallback: m[2] === ',' });
        i += 4;
      }
      return out;
    };
    // Remove every var(...) group (balanced), leaving what the declaration paints without tokens.
    const stripVars = (v) => {
      let out = '', i = 0;
      while (i < v.length) {
        if (v.startsWith('var(', i)) { let d = 0, j = i; for (; j < v.length; j++) { if (v[j] === '(') d++; else if (v[j] === ')') { d--; if (d === 0) break; } } i = j + 1; continue; }
        out += v[i++];
      }
      return out;
    };
    const decls = (cssText) => {
      // Split on top-level semicolons (values nest parentheses and may quote strings), then on the first colon.
      const out = [];
      let d = 0, q = '', cur = '';
      const flush = () => { const i = cur.indexOf(':'); if (i > 0) out.push([cur.slice(0, i).trim(), cur.slice(i + 1).replace(/!important\s*$/, '').trim()]); cur = ''; };
      for (const ch of cssText) {
        if (q) { if (ch === q) q = ''; cur += ch; continue; }
        if (ch === '"' || ch === "'") q = ch;
        else if (ch === '(') d++;
        else if (ch === ')') d--;
        else if (ch === ';' && d === 0) { flush(); continue; }
        cur += ch;
      }
      flush();
      return out;
    };
    const visitStyle = (style, where, sel) => {
      for (const [prop, value] of decls(style.cssText)) {
        if (prop.startsWith('--')) {
          defined.add(prop);
          if (prop === '--state-hover' || prop === '--state-pressed') { const p = value.match(/(\d+(?:\.\d+)?)%/); if (p) levels[prop] = { pct: parseFloat(p[1]), where }; }
        }
        for (const ref of refs(value)) uses.push({ ...ref, where: where + ' { ' + prop + ' }', sel });
        if (sel && STATE_SEL.test(sel) && /^background(-color|-image)?$/.test(prop)) layers.push({ where, prop, value });
      }
    };
    const walk = (rules) => {
      for (const rule of rules) {
        if (rule.constructor.name === 'CSSPropertyRule') defined.add(rule.name);
        if (rule.style) visitStyle(rule.style, rule.selectorText || rule.keyText || rule.constructor.name, rule.selectorText || '');
        if (rule.cssRules) walk(rule.cssRules);
      }
    };
    for (const sheet of document.styleSheets) { try { walk(sheet.cssRules); } catch { /* cross-origin */ } }
    for (const el of document.querySelectorAll('[style]')) {
      const skip = (el.closest('[data-lint-skip]')?.getAttribute('data-lint-skip') || '');
      if (/undefined-var/.test(skip)) { for (const [p] of decls(el.style.cssText)) if (p.startsWith('--')) defined.add(p); continue; }
      visitStyle(el.style, window.__lint ? window.__lint.sel(el) : el.tagName.toLowerCase(), '');
    }
    const undef = new Map();
    // A rule that matches no element paints nothing either way (a state sheet reusing page CSS without the element that
    // sets --v inline); only rules that apply, and inline styles, count. Selectors that cannot be tested count as applying.
    const applies = (sel) => {
      if (!sel) return true;
      const plain = sel.replace(/::?(?:before|after|marker|placeholder|selection|backdrop|first-line|first-letter)\b/g, '').replace(/:(?:hover|active|focus|focus-visible|focus-within|visited)\b/g, '');
      try { return !!document.querySelector(plain || '*'); } catch { return true; }
    };
    for (const u of uses) if (!u.fallback && !defined.has(u.name) && !undef.has(u.name) && applies(u.sel)) undef.set(u.name, u.where);
    const RAW = /color-mix\(|rgba?\(|hsla?\(|oklch\(|oklab\(|\blab\(|\blch\(|#[0-9a-f]{3,8}\b/i;
    const raw = layers.filter((l) => RAW.test(stripVars(l.value)));
    return { undef: [...undef], raw, levels };
  });
  for (const [name, where] of r.undef) add('undefined-var', 'fail', `var(${name}) has no fallback and ${name} is declared nowhere, so "${where}" computes to nothing (rename it to a defined token)`, { where });
  const seen = new Set();
  for (const l of r.raw) {
    const k = l.where + l.value; if (seen.has(k)) continue; seen.add(k);
    add('state-layer', 'fail', `hover or pressed background is a raw color in "${l.where}": ${l.prop}: ${l.value.slice(0, 90)}; use var(--state-hover) or var(--state-pressed) (layered on the surface with linear-gradient), or a --color-*-hover token`, { where: l.where });
  }
  const want = { '--state-hover': 8, '--state-pressed': 10 };
  for (const [k, v] of Object.entries(r.levels)) if (Math.abs(v.pct - want[k]) > 0.01) add('state-layer', 'fail', `${k} is ${v.pct}% of the content color; FOUNDATIONS state layers are hover 8, pressed 10`, { where: v.where });
}
