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
//   primitive-in-component  fail  a declaration outside a token-definition block that reads a color primitive,
//                        var(--color-{hue}-{50..990}) (FOUNDATIONS token schema: "a component never names a primitive").
//                        Token-definition blocks are rules whose every selector is a root or theme selector (:root,
//                        html, with attribute, class or :not() qualifiers, or a bare [data-*] or .dark/.light/.theme-*);
//                        only custom-property declarations there may read primitives. Added in round 4.2 after the
//                        coffee label curve (--color-orange-700) and the dashboard tooltip (--color-slate-950 on
//                        --color-slate-50, which did not remap and sat at 1.09:1 against its dark surfaces).
//   error-icon     fail  (errorIconChecks) a visible field error carries an icon or a non-color marker besides its text
//                        (FOUNDATIONS item 11, "errors have icon plus text"). A field error is a [role=alert], the
//                        aria-errormessage target of any element, or the aria-describedby target of an
//                        [aria-invalid=true] control (with several targets, the ones whose id or class names an error).
//                        An icon is an svg, img or [role=img] inside it, a ::before or ::after that paints content or an
//                        image, or a text prefix such as "Error:". Round 4.2: the dashboard invite error was red text.
// Opt out per rule: none. Opt out per element (inline styles only): data-lint-skip="undefined-var state-layer primitive-in-component".
// Opt out for one error element: data-lint-skip="error-icon".

export async function tokenChecks(page, add) {
  const r = await page.evaluate(() => {
    const defined = new Set();
    const uses = [];      // { name, where }
    const layers = [];    // { where, prop, value }
    const prims = [];     // { where, prop, value }
    const SEMANTIC = new Set(['text', 'surface', 'bg', 'border', 'primary', 'accent', 'chart', 'feature', 'danger', 'warning', 'success', 'info', 'brand', 'selected', 'on', 'focus', 'ring', 'scrim', 'state', 'illustration', 'print', 'tooltip', 'link', 'input', 'series']);
    const PRIM = /var\(\s*--color-([a-z]+)-(50|[1-9]\d{2})\s*[,)]/g;
    const primRefs = (v) => [...v.matchAll(PRIM)].filter((m) => !SEMANTIC.has(m[1])).map((m) => '--color-' + m[1] + '-' + m[2]);
    // A token-definition block: every selector in the list is a root or theme selector.
    const THEME_PART = /^(?:(?::root|html)(?:\[[^\]]+\]|:not\([^)]*\)|\.[\w-]+)*|\[data-[\w-]+(?:[~|^$*]?=[^\]]+)?\]|\.(?:dark|light|theme-[\w-]+))$/;
    const isTokenBlock = (sel) => !!sel && sel.split(',').every((p) => THEME_PART.test(p.trim()));
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
    const visitStyle = (style, where, sel, inline) => {
      for (const [prop, value] of decls(style.cssText)) {
        const pr = primRefs(value);
        if (pr.length && !(prop.startsWith('--') && !inline && isTokenBlock(sel))) prims.push({ where, prop, value, names: pr, sel, inline: !!inline });
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
      if (/primitive-in-component/.test(skip)) continue;
      visitStyle(el.style, window.__lint ? window.__lint.sel(el) : el.tagName.toLowerCase(), '', true);
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
    // Primitives only count in rules that apply (a sheet reusing page CSS) or inline styles.
    const primUsed = prims.filter((p) => p.inline || applies(p.sel));
    return { undef: [...undef], raw, levels, prims: primUsed };
  });
  for (const [name, where] of r.undef) add('undefined-var', 'fail', `var(${name}) has no fallback and ${name} is declared nowhere, so "${where}" computes to nothing (rename it to a defined token)`, { where });
  const seen = new Set();
  for (const l of r.raw) {
    const k = l.where + l.value; if (seen.has(k)) continue; seen.add(k);
    add('state-layer', 'fail', `hover or pressed background is a raw color in "${l.where}": ${l.prop}: ${l.value.slice(0, 90)}; use var(--state-hover) or var(--state-pressed) (layered on the surface with linear-gradient), or a --color-*-hover token`, { where: l.where });
  }
  const pseen = new Set();
  for (const p of r.prims) {
    const k = p.where + p.prop; if (pseen.has(k)) continue; pseen.add(k);
    add('primitive-in-component', 'fail', `"${p.where}" { ${p.prop} } reads the primitive ${p.names.join(', ')}; a component uses semantic tokens only: declare a role token (for example --color-tooltip-bg) on :root and in each theme block, then use it here`, { where: p.where });
  }
  const want = { '--state-hover': 8, '--state-pressed': 10 };
  for (const [k, v] of Object.entries(r.levels)) if (Math.abs(v.pct - want[k]) > 0.01) add('state-layer', 'fail', `${k} is ${v.pct}% of the content color; FOUNDATIONS state layers are hover 8, pressed 10`, { where: v.where });
}

// Field errors carry an icon or non-color marker besides their text (FOUNDATIONS item 11). Runs once at 1440 light.
export async function errorIconChecks(page, add) {
  const bad = await page.evaluate(() => {
    const L = window.__lint;
    const vis = (el) => (L ? L.visible(el) : !!el.getClientRects().length) && getComputedStyle(el).visibility !== 'hidden';
    const found = new Set();
    for (const el of document.querySelectorAll('[role=alert]')) found.add(el);
    const byIds = (ids) => ids.split(/\s+/).filter(Boolean).map((id) => document.getElementById(id)).filter(Boolean);
    for (const el of document.querySelectorAll('[aria-errormessage]')) for (const t of byIds(el.getAttribute('aria-errormessage'))) found.add(t);
    for (const el of document.querySelectorAll('[aria-invalid=true][aria-describedby]')) {
      const ts = byIds(el.getAttribute('aria-describedby'));
      for (const t of ts.length > 1 ? ts.filter((t) => /err|invalid/i.test(t.id + ' ' + t.className)) : ts) found.add(t);
    }
    const paints = (el, pseudo) => { const cs = getComputedStyle(el, pseudo); const c = cs.content; return (c && c !== 'none' && c !== 'normal' && c !== '""' && c !== "''") || cs.backgroundImage !== 'none' || (cs.maskImage && cs.maskImage !== 'none') || (cs.webkitMaskImage && cs.webkitMaskImage !== 'none'); };
    const out = [];
    for (const el of found) {
      const text = (el.innerText || '').trim();
      if (!text || !vis(el) || (el.closest('[data-lint-skip]')?.getAttribute('data-lint-skip') || '').includes('error-icon')) continue;
      if (L && L.inactive && L.inactive(el)) continue;
      const nodes = [el, ...el.querySelectorAll('*')];
      const icon = nodes.some((n) => (n.matches('svg, img, [role=img]') && n.getClientRects().length && n.getBoundingClientRect().width >= 8) || paints(n, '::before') || paints(n, '::after'));
      const marker = /^(error|warning|problem|invalid|required)\b\s*[:.-]/i.test(text) || /^[\u26a0\u2716\u2715\u00d7!]/.test(text);
      if (!icon && !marker) out.push({ sel: L ? L.sel(el) : el.tagName.toLowerCase(), text: text.slice(0, 80) });
    }
    return out;
  });
  for (const b of bad) add('error-icon', 'fail', `field error "${b.text}" is text and color only; add the error icon (or a non-color marker) beside the text (FOUNDATIONS item 11)`, { target: b.sel });
}
