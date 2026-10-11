// Layout, collision and content-visibility checks for tools/lint.mjs (added after the round 3 critic review,
// kb/reviews/round3-critic.md: every lint check passed while a clean-context critic found 7 gate failures by eye).
//
// layoutChecks(page, width) runs in a page opened at one width (lint runs it at 390, 768, 1024 and 1440 by default):
//   occlusion     an interactive control whose own box hit-tests to another element (the 768 and 1024 search field
//                 over "Pause updates"). Sample points: center and the four edge midpoints, 2px in. Fail when the
//                 covering element shares the control's layer; warn when it is a different sticky or fixed bar.
//   squash        a fixed-size flex child (a dot, an icon, a badge) rendered narrower or shorter than its own size
//                 (an 8px live dot at 2x8), or a flex or grid child whose text wraps to one word per line (3+ lines)
//   sticky-header a sticky or fixed top bar taller than html scroll-padding-top at this width (a 142px header
//                 against 80px), so in-page jumps and Shift+Tab land under it (WCAG 2.4.11)
//   overflow      horizontal scroll at any lint width, not only 390
//   run-together  text in two separate boxes (cells, flex items) that sits on one line with less than 0.2em
//                 between them, so it reads as one word ("Sep 30$2.62", "Pauseupdates")
//   word-break    a word split across two lines inside a control, label or table cell ("Pour-" / "over"),
//                 or text that runs into the control's padding; elsewhere a mid-word break is a warning
//   double-space  a flex or grid gap next to a no-break space at an item's edge, or two spaces in a row where one is
//                 a no-break space ("Invite&nbsp;&nbsp;&nbsp;a teammate", round 4 critic)
//   grid-edge     sibling columns (same tag and class, side by side) whose matching children miss each other's
//                 top or left edge by more than 2px while every earlier child has the same height (the promise
//                 columns 12px off); near-miss left edges (2 to 6px off an edge used 4+ times) are warnings
//
// pageChecks(page) runs once at 1440 light:
//   hidden-content a control whose text is transparent and whose box paints nothing but its fill (the state
//                 sheet's blank "Sending" pill); measured on pixels, so a visible spinner passes
//   state-sheet   on a page marked as a state sheet: at least one disabled control, one busy control
//                 (aria-busy=true) and, when the sheet has fields, one invalid field (aria-invalid=true);
//                 a data sheet (table, chart or KPI) names loading, error, empty and partial panels (warn)
//
// Opt out per element with data-lint-skip="occlusion squash run-together word-break grid-edge hidden-content double-space".

export async function layoutChecks(page, width) {
  return page.evaluate((width) => {
    const L = window.__lint;
    const out = { occlusion: [], squash: [], sticky: [], overflow: null, together: [], words: [], padding: [], grid: [], near: [] };
    const all = [...document.body.querySelectorAll('*')].filter((el) => !el.closest('svg, script, style, template, head'));
    const CONTROL = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=tab], [role=menuitem], [role=checkbox], [role=radio], [role=switch], [tabindex]:not([tabindex="-1"])';
    const layerOf = (el) => { for (let n = el; n && n !== document.body; n = n.parentElement) { const p = getComputedStyle(n).position; if (p === 'sticky' || p === 'fixed') return n; } return null; };
    // Visually hidden (sr-only) text: a clip, a clip-path, or a 1px box with overflow hidden, on the element or 3 ancestors.
    const clipped = (el) => { for (let a = el, i = 0; a && a !== document.body && i < 4; a = a.parentElement, i++) { const s = getComputedStyle(a); if (s.clip !== 'auto' || s.clipPath !== 'none') return true; if (s.overflow !== 'visible') { const r = a.getBoundingClientRect(); if (r.width <= 1 || r.height <= 1) return true; } } return false; };
    const sheet = document.documentElement.dataset.lintPage === 'state-sheet' || /state sheet/i.test(document.title);

    // ---- occlusion ----
    const controls = all.filter((el) => el.matches(CONTROL) && L.visible(el) && !L.inactive(el) && !L.skipped(el, 'occlusion') && !clipped(el) && getComputedStyle(el).pointerEvents !== 'none');
    const y0 = scrollY;
    for (const el of controls.slice(0, 300)) {
      let r = el.getBoundingClientRect();
      if (r.width < 6 || r.height < 6) continue;
      el.scrollIntoView({ block: 'center', inline: 'nearest' });
      r = el.getBoundingClientRect();
      // Clip to scrolling or clipping ancestors: a chip scrolled out of its rail is not covered.
      let cl = { l: 0, t: 0, r: innerWidth, b: innerHeight };
      for (let a = el.parentElement; a && a !== document.documentElement; a = a.parentElement) {
        const cs = getComputedStyle(a);
        if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') { const ar = a.getBoundingClientRect(); cl = { l: Math.max(cl.l, ar.left), t: Math.max(cl.t, ar.top), r: Math.min(cl.r, ar.right), b: Math.min(cl.b, ar.bottom) }; }
      }
      const inset = Math.min(2, r.width / 4, r.height / 4);
      const pts = [[(r.left + r.right) / 2, (r.top + r.bottom) / 2, 'center'], [r.left + inset, (r.top + r.bottom) / 2, 'left edge'], [r.right - inset, (r.top + r.bottom) / 2, 'right edge'], [(r.left + r.right) / 2, r.top + inset, 'top edge'], [(r.left + r.right) / 2, r.bottom - inset, 'bottom edge']];
      for (const [x, y, where] of pts) {
        if (x < cl.l || x > cl.r - 1 || y < cl.t || y > cl.b - 1) continue;
        const hit = document.elementFromPoint(x, y);
        if (!hit || hit === el || el.contains(hit) || hit.contains(el)) continue;
        if (el.labels && [...el.labels].some((lb) => lb === hit || lb.contains(hit))) continue;
        if (hit.control === el) continue;
        const myLayer = layerOf(el), hitLayer = layerOf(hit);
        const sameLayer = myLayer === hitLayer || (hitLayer && hitLayer.contains(el));
        out.occlusion.push({ sel: L.sel(el), by: L.sel(hit), where, sameLayer, text: (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 30) });
        break;
      }
    }
    scrollTo(0, y0);

    // ---- squash: fixed-size flex children pressed below their own size; text squeezed to one word per line ----
    const flexKids = all.filter((el) => el.parentElement && /flex/.test(getComputedStyle(el.parentElement).display) && L.visible(el) && !L.skipped(el, 'squash'));
    for (const el of flexKids) {
      const r = el.getBoundingClientRect();
      const text = (el.textContent || '').trim();
      if (text.length <= 3 && r.width <= 64 && r.height <= 64 && getComputedStyle(el).position !== 'absolute') {
        const prev = el.style.getPropertyValue('flex-shrink'), prio = el.style.getPropertyPriority('flex-shrink');
        el.style.setProperty('flex-shrink', '0', 'important');
        const n = el.getBoundingClientRect();
        el.style.setProperty('flex-shrink', prev, prio);
        const dw = n.width - r.width, dh = n.height - r.height;
        if ((dw >= 2 && r.width < n.width * 0.75) || (dh >= 2 && r.height < n.height * 0.75)) out.squash.push({ sel: L.sel(el), kind: 'shrunk', from: `${Math.round(n.width)}x${Math.round(n.height)}`, to: `${Math.round(r.width * 10) / 10}x${Math.round(r.height * 10) / 10}` });
      }
    }
    const items = all.filter((el) => el.parentElement && /flex|grid/.test(getComputedStyle(el.parentElement).display) && L.visible(el) && !L.skipped(el, 'squash'));
    for (const el of items) {
      const text = (el.textContent || '').replace(/\s+/g, ' ').trim();
      if (text.split(' ').length < 3 || el.closest('svg')) continue;
      // Only one run of inline text: a list of block items (a nav column, a footer column) stacks on purpose.
      if ([...el.querySelectorAll('*')].some((c) => !/^(inline|contents|none)$/.test(getComputedStyle(c).display) && !c.closest('svg'))) continue;
      const ls = L.lines(el);
      const avg = ls.reduce((a, l) => a + l.words, 0) / (ls.length || 1);
      if (ls.length >= 3 && (ls.every((l) => l.words <= 1) || (ls.length >= 4 && avg <= 1.6))) out.squash.push({ sel: L.sel(el), kind: 'one word per line', lines: ls.length, text: text.slice(0, 40) });
    }

    // ---- sticky header taller than scroll-padding-top ----
    const sptRaw = getComputedStyle(document.documentElement).scrollPaddingTop;
    const spt = sptRaw === 'auto' ? 0 : parseFloat(sptRaw) || 0;
    for (const el of all) {
      const s = getComputedStyle(el);
      if (s.position !== 'sticky' && s.position !== 'fixed') continue;
      if (!L.visible(el) || L.skipped(el, 'sticky-header') || el.closest('dialog, [role=dialog]')) continue;
      const top = parseFloat(s.top);
      if (!(top <= 1 && top >= 0)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < innerWidth * 0.5 || r.height > innerHeight * 0.5 || r.height < 24) continue;
      if (s.position === 'sticky' && el.parentElement && el.parentElement.getBoundingClientRect().height < r.height * 2) continue; // sticks inside a small box, not the page
      const reach = top + r.height;
      if (reach > spt + 1) out.sticky.push({ sel: L.sel(el), height: Math.round(r.height), spt: sptRaw });
    }

    // ---- overflow ----
    const doc = document.documentElement;
    if (doc.scrollWidth > doc.clientWidth + 1) {
      const off = all.filter((e) => L.visible(e)).map((e) => ({ e, r: e.getBoundingClientRect() })).filter((x) => x.r.right > doc.clientWidth + 1).slice(0, 5).map((x) => L.sel(x.e));
      out.overflow = { scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth, offenders: off };
    }

    // ---- run-together: text in two boxes that touch on one line ----
    const boxOf = (n) => { for (let e = n.parentElement; e; e = e.parentElement) { const d = getComputedStyle(e).display; if (d !== 'inline' && d !== 'contents') return e; } return document.body; };
    const runs = L.textNodes().filter((n) => !n.parentElement.closest('svg'));
    const range = document.createRange();
    const rectsOf = (n) => { range.selectNodeContents(n); return [...range.getClientRects()].filter((r) => r.width >= 2 && r.height >= 2); };
    const UNIT_AFTER = /^(?:k|K|M|B|bn|m|h|s|ms|px|pt|x|×|st|nd|rd|th|g|kg|oz|lb|mo|yr|%)\b/;
    let prev = null;
    for (const n of runs) {
      const el = n.parentElement;
      if (clipped(el) || L.inactive(el)) { prev = null; continue; }
      const rs = rectsOf(n);
      if (!rs.length) continue;
      const cur = { n, el, box: boxOf(n), first: rs[0], last: rs[rs.length - 1], text: n.textContent };
      if (prev && prev.box !== cur.box && !L.skipped(el, 'run-together') && !L.skipped(prev.el, 'run-together')) {
        const a = prev.last, b = cur.first;
        const vo = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        const fsz = parseFloat(getComputedStyle(el).fontSize);
        const gap = b.left - a.right;
        const aEnd = prev.text.replace(/\s+$/, ''), bStart = cur.text.replace(/^\s+/, '');
        const touchesWS = /\s$/.test(prev.text) || /^\s/.test(cur.text);
        const lastA = aEnd.slice(-1), firstB = bStart.charAt(0);
        const joinable = /[\p{L}\p{N}.)]/u.test(lastA) && /[\p{L}\p{N}$€£(#+−]/u.test(firstB) && !(/\p{N}/u.test(lastA) && UNIT_AFTER.test(bStart));
        if (vo > Math.min(a.height, b.height) * 0.5 && gap < Math.max(2, fsz * 0.2) && gap > -fsz && !touchesWS && joinable) {
          out.together.push({ sel: L.sel(el), prevSel: L.sel(prev.el), gap: Math.round(gap * 10) / 10, text: (aEnd.slice(-14) + bStart.slice(0, 14)).replace(/\s+/g, ' ') });
        }
      }
      prev = cur;
    }

    // ---- double-space: a flex or grid gap plus a no-break space, or two spaces in a row that HTML cannot collapse ----
    // ("Invite&nbsp;&nbsp;&nbsp;a teammate": an 8px gap between "Invite" and a span that starts with &nbsp;, round 4 critic).
    out.doubles = [];
    const NB = / | | /;
    const shownItem = (n) => n.nodeType === 3 ? !!n.textContent.length : (n.nodeType === 1 && n.getClientRects().length > 0 && !/absolute|fixed/.test(getComputedStyle(n).position) && !clipped(n) && getComputedStyle(n).display !== 'contents');
    for (const c of all) {
      if (!L.visible(c) || L.inactive(c) || L.skipped(c, 'double-space')) continue;
      const cs = getComputedStyle(c);
      if (!/flex|grid/.test(cs.display) || /column/.test(cs.flexDirection) && /flex/.test(cs.display)) continue;
      if ((parseFloat(cs.columnGap) || 0) < 1) continue;
      const items = [...c.childNodes].filter(shownItem).filter((n) => n.nodeType === 1 || n.textContent.trim() || NB.test(n.textContent));
      items.forEach((n, i) => {
        const t = n.textContent;
        const lead = i > 0 && NB.test(t.charAt(0)), trail = i < items.length - 1 && NB.test(t.charAt(t.length - 1));
        if (lead || trail) out.doubles.push({ sel: L.sel(n.nodeType === 1 ? n : c), text: (lead ? '[gap]' : '') + t.replace(/\s+/g, ' ').trim().slice(0, 30) + (trail ? '[gap]' : ''), gap: Math.round(parseFloat(cs.columnGap)), kind: 'gap' });
      });
    }
    {
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let last = null;
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const el = n.parentElement;
        if (!el || el.closest('script, style, template, noscript, code, pre, textarea, svg') || !n.textContent.length) continue;
        if (!el.getClientRects().length || clipped(el) || L.inactive(el) || L.skipped(el, 'double-space') || /pre/.test(getComputedStyle(el).whiteSpace)) { last = null; continue; }
        const t = n.textContent;
        const within = /[   ][  ]|[  ] /.test(t);
        const across = last && boxOf(last) === boxOf(n) && /[   ]$/.test(last.textContent) && /^[   ]/.test(t) && (NB.test(last.textContent.slice(-1)) || NB.test(t.charAt(0)));
        if (within || across) out.doubles.push({ sel: L.sel(el), text: t.replace(/\s+/g, ' ').trim().slice(0, 30), kind: 'spaces' });
        last = n;
      }
    }

    // ---- word-break and text into padding, inside controls, labels and cells ----
    const TIGHT = 'button, a, label, summary, legend, th, td, dt, [role=button], [role=tab], [role=radio], [role=option], [role=menuitem], [role=checkbox], [role=switch], [class*=chip], [class*=badge], [class*=tag]';
    const seenW = new Set();
    for (const n of L.textNodes()) {
      const el = n.parentElement;
      if (el.closest('svg, code, pre') || clipped(el) || L.skipped(el, 'word-break') || L.inactive(el)) continue;
      const host = el.closest(TIGHT);
      const hy = getComputedStyle(el).hyphens === 'auto';
      const re = /\S{2,}/g; let m;
      while ((m = re.exec(n.textContent))) {
        const w = m[0];
        if (/[/@]|https?:|\.\w{2,}\//.test(w) || w.length > 28) continue;
        range.setStart(n, m.index); range.setEnd(n, m.index + w.length);
        const rs = [...range.getClientRects()].filter((r) => r.width >= 1);
        if (rs.length < 2) continue;
        const tops = rs.map((r) => r.top);
        if (Math.max(...tops) - Math.min(...tops) < rs[0].height * 0.5) continue;
        const key = L.sel(el) + w;
        if (seenW.has(key)) continue; seenW.add(key);
        if (host) out.words.push({ sel: L.sel(host), word: w, level: 'fail' });
        else if (!hy) out.words.push({ sel: L.sel(el), word: w, level: 'warn' });
      }
      if (host && host.matches('button, a, label, summary, [role=button], [role=tab], [role=radio], [class*=chip]')) {
        const hs = getComputedStyle(host);
        if (/(hidden|clip|scroll|auto)/.test(hs.overflowX) && hs.textOverflow === 'ellipsis') continue;
        const hr = host.getBoundingClientRect();
        const pr = parseFloat(hs.paddingRight) || 0, pl = parseFloat(hs.paddingLeft) || 0;
        if (pr < 2 && pl < 2) continue;
        const inner = { l: hr.left + (parseFloat(hs.borderLeftWidth) || 0) + pl, r: hr.right - (parseFloat(hs.borderRightWidth) || 0) - pr };
        for (const tr of rectsOf(n)) {
          const over = Math.max(tr.right - inner.r, inner.l - tr.left);
          if (over > 1.5) { const k = 'pad' + L.sel(host); if (!seenW.has(k)) { seenW.add(k); out.padding.push({ sel: L.sel(host), px: Math.round(over), text: n.textContent.trim().slice(0, 24) }); } break; }
        }
      }
    }

    // ---- grid-edge: side-by-side siblings of one kind must share their children's top and left edges ----
    const sig = (e) => e.tagName + '.' + [...e.classList].filter((c) => !/^(is-|active|selected|current|open|on|off|first|last)/.test(c)).sort().join('.');
    const ownText = (e) => [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim());
    const parts = (col) => [...col.querySelectorAll('*')].filter((e) => !e.closest('svg') && L.visible(e) && (ownText(e) || e.matches('img, svg, picture, video, canvas, hr, button, input')) && !clipped(e));
    for (const parent of sheet ? [] : all) { // a state sheet sets unlike states side by side on purpose
      const d = getComputedStyle(parent).display;
      if (!/grid|flex/.test(d) || L.skipped(parent, 'grid-edge') || !L.visible(parent)) continue;
      const kids = [...parent.children].filter((k) => L.visible(k) && !L.skipped(k, 'grid-edge') && getComputedStyle(k).position !== 'absolute');
      if (kids.length < 2) continue;
      const bySig = new Map();
      for (const k of kids) { const s = sig(k); if (!bySig.has(s)) bySig.set(s, []); bySig.get(s).push(k); }
      for (const [, group] of bySig) {
        if (group.length < 2) continue;
        // Rows of side-by-side columns: boxes overlap vertically by more than half.
        const rows = [];
        for (const k of group) {
          const r = k.getBoundingClientRect();
          const row = rows.find((rw) => { const q = rw[0].r; return Math.min(q.bottom, r.bottom) - Math.max(q.top, r.top) > Math.min(q.height, r.height) * 0.5; });
          if (row) row.push({ k, r }); else rows.push([{ k, r }]);
        }
        for (const row of rows) {
          if (row.length < 2 || row.some((x) => x.r.width < 48)) continue;
          const ps = row.map((x) => parts(x.k));
          const n = Math.min(...ps.map((p) => p.length), 12);
          const sameW = Math.max(...row.map((x) => x.r.width)) - Math.min(...row.map((x) => x.r.width)) <= 2;
          for (let i = 0; i < n; i++) {
            if (new Set(ps.map((p) => sig(p[i]))).size > 1) break; // the columns differ in structure from here
            const rr = ps.map((p) => p[i].getBoundingClientRect());
            const tops = rr.map((r, j) => r.top - row[j].r.top);
            const lefts = rr.map((r, j) => r.left - row[j].r.left);
            const dt = Math.max(...tops) - Math.min(...tops);
            // Left edges are compared only between equal columns and equal-width parts (a centered or trailing
            // inline item of a different width moves legitimately).
            const partW = rr.map((r) => r.width);
            const dl = sameW && Math.max(...partW) - Math.min(...partW) <= 2 ? Math.max(...lefts) - Math.min(...lefts) : 0;
            if (dt > 2 || dl > 2) {
              const vals = dt > 2 ? tops : lefts;
              const med = [...vals].sort((a, b) => a - b)[Math.floor(vals.length / 2)];
              const j = vals.reduce((bi, v, k) => (Math.abs(v - med) > Math.abs(vals[bi] - med) ? k : bi), 0);
              out.grid.push({ sel: L.sel(ps[j][i]), parent: L.sel(parent), axis: dt > 2 ? 'top' : 'left', px: Math.round(dt > 2 ? dt : dl), columns: row.length });
              break;
            }
            const hs = rr.map((r) => r.height);
            if (Math.max(...hs) - Math.min(...hs) > 1) break; // later children may shift legitimately
          }
        }
      }
    }
    // Near-miss left edges across the page (warn): an edge 2 to 6px off one that 4+ blocks share.
    const blocks = sheet ? [] : all.filter((e) => e.matches('h1, h2, h3, p, figure, img, table, ul, ol, blockquote') && L.visible(e) && !e.closest('nav, button, td, th, li, [role=dialog], dialog, header') && getComputedStyle(e).textAlign !== 'center' && e.getBoundingClientRect().width >= 120 && !L.skipped(e, 'grid-edge')
      && parseFloat(getComputedStyle(e).fontSize) < 39 && parseFloat(getComputedStyle(e).marginLeft) >= 0 && parseFloat(getComputedStyle(e).textIndent) >= 0); // display type and negative offsets: optical alignment on purpose
    const edges = new Map();
    for (const e of blocks) { const x = Math.round(e.getBoundingClientRect().left); edges.set(x, (edges.get(x) || 0) + 1); }
    const common = [...edges.entries()].filter(([, c]) => c >= 4).map(([x]) => x);
    const seenN = new Set();
    for (const e of blocks) {
      const x = Math.round(e.getBoundingClientRect().left);
      if (common.includes(x)) continue;
      const near = common.find((c) => Math.abs(c - x) > 2 && Math.abs(c - x) <= 6);
      if (near === undefined || seenN.has(x)) continue;
      seenN.add(x);
      out.near.push({ sel: L.sel(e), x, grid: near });
    }
    return out;
  }, width);
}

// Report layout findings into the lint report. `add(check, level, message, detail)`.
export function reportLayout(r, width, add) {
  for (const o of r.occlusion) add('occlusion', o.sameLayer ? 'fail' : 'warn', `control "${o.text}" is covered at its ${o.where} by ${o.by} at ${width}px${o.sameLayer ? '' : ' (a different sticky or fixed layer; check scroll position)'}`, { sel: o.sel, width });
  for (const s of r.squash) add('squash', 'fail', s.kind === 'shrunk' ? `flex child squashed from ${s.from} to ${s.to} at ${width}px; give it flex: none` : `text squeezed to one word per line (${s.lines} lines, "${s.text}") at ${width}px`, { sel: s.sel, width });
  for (const s of r.sticky) add('sticky-header', 'fail', `sticky top bar is ${s.height}px tall at ${width}px but html scroll-padding-top is ${s.spt}; anchors and focus land under it (WCAG 2.4.11)`, { sel: s.sel, width });
  if (r.overflow && width !== 390) add('overflow', 'fail', `horizontal overflow at ${width}px: page is ${r.overflow.scrollWidth}px wide`, { offenders: r.overflow.offenders, width });
  for (const t of r.together) add('run-together', 'fail', `text in separate boxes runs together at ${width}px: "${t.text}" (${t.gap}px apart, needs a gap or a space)`, { sel: t.sel, prev: t.prevSel, width });
  for (const w of r.words) add('word-break', w.level, `"${w.word}" breaks across two lines at ${width}px${w.level === 'fail' ? ' inside a control, label or cell' : ''}`, { sel: w.sel, width });
  for (const p of r.padding) add('word-break', 'fail', `text "${p.text}" runs ${p.px}px into its control's padding at ${width}px`, { sel: p.sel, width });
  for (const g of r.grid) add('grid-edge', 'fail', `sibling columns miss a shared ${g.axis} edge by ${g.px}px at ${width}px (${g.columns} columns in ${g.parent})`, { sel: g.sel, width });
  for (const d of r.doubles || []) add('double-space', 'fail', d.kind === 'gap' ? `a ${d.gap}px flex or grid gap plus a no-break space at ${width}px: "${d.text}" reads as two or three word spaces (put the words in one item, or drop the no-break space)` : `two spaces in a row that HTML cannot collapse at ${width}px: "${d.text}"`, { sel: d.sel, width });
  for (const n of r.near.slice(0, 6)) add('grid-edge', 'warn', `left edge at ${n.x}px is ${Math.abs(n.x - n.grid)}px off the edge at ${n.grid}px that 4+ blocks share, at ${width}px (align it, or offset it on purpose by a full step)`, { sel: n.sel, width });
}

// Once per page, 1440 light: blank controls (pixels) and state sheet coverage.
export async function pageChecks(page, add) {
  const cand = await page.evaluate(() => {
    const L = window.__lint;
    const alpha = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return c === 'transparent' ? 0 : 1; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return v.length > 3 ? v[3] : 1; };
    const out = [];
    const controls = [...document.querySelectorAll('button, a[href], [role=button], input[type=submit], input[type=button]')].filter((el) => L.visible(el) && !L.skipped(el, 'hidden-content') && !L.inactive(el));
    controls.forEach((el, i) => {
      // Every rendered text node in the control, including ones hidden by opacity (L.textNodes skips those).
      const texts = [];
      const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const p = n.parentElement;
        if (!n.textContent.trim() || !p.getClientRects().length) continue;
        let sr = false;
        for (let a = p; a && a !== el.parentElement; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.clip !== 'auto' || cs.clipPath !== 'none') sr = true; if (cs.overflow !== 'visible') { const r = a.getBoundingClientRect(); if (r.width <= 1 || r.height <= 1) sr = true; } }
        if (!sr) texts.push(p);
      }
      if (!texts.length && !(el.value && el.matches('input'))) return;
      const faded = (p) => { for (let a = p; a && a !== el.parentElement; a = a.parentElement) if (Number(getComputedStyle(a).opacity) === 0) return true; return false; };
      const allClear = (texts.length ? texts : [el]).every((p) => { const s = getComputedStyle(p); return (alpha(s.color) < 0.1 || alpha(s.webkitTextFillColor || s.color) < 0.1 || faded(p) || s.visibility === 'hidden') && s.backgroundClip !== 'text' && s.webkitBackgroundClip !== 'text'; });
      if (!allClear) return;
      el.setAttribute('data-lint-blank', String(i));
      const r = el.getBoundingClientRect();
      out.push({ i, sel: L.sel(el), w: r.width, h: r.height, name: (el.getAttribute('aria-label') || el.textContent || el.value || '').replace(/\s+/g, ' ').trim().slice(0, 30) });
    });
    const sheet = document.documentElement.dataset.lintPage === 'state-sheet' || /state sheet/i.test(document.title);
    let cov = null;
    if (sheet) {
      const has = (s) => !!document.querySelector(s);
      const text = document.body.innerText;
      cov = {
        buttons: has('button, [role=button]'),
        fields: has('input:not([type=hidden]):not([type=radio]):not([type=checkbox]), select, textarea'),
        disabled: has('[disabled], [aria-disabled="true"]'),
        busy: has('[aria-busy="true"]'),
        invalid: has('[aria-invalid="true"]'),
        data: has('table, [role=table], [role=grid], svg[role=img], [class*=kpi], [class*=chart]'),
        panels: { loading: /\bloading\b|skeleton/i.test(text), error: /\berror\b|failed|timed out|couldn.t|could not/i.test(text), empty: /\bempty\b|no [a-z]+ yet|nothing (here|yet|tracked)/i.test(text), partial: /\bpartial\b/i.test(text) },
      };
    }
    return { blanks: out, cov };
  });
  for (const c of cand.blanks) {
    const loc = page.locator(`[data-lint-blank="${c.i}"]`);
    let blank = false;
    try {
      await loc.scrollIntoViewIfNeeded({ timeout: 1000 });
      const png = await loc.screenshot({ animations: 'disabled', timeout: 2000 });
      blank = await page.evaluate(async (b64) => {
        const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const cv = document.createElement('canvas'); cv.width = img.naturalWidth; cv.height = img.naturalHeight;
        const ctx = cv.getContext('2d', { willReadFrequently: true }); ctx.drawImage(img, 0, 0);
        // The inner area (inset by a quarter of the height, so borders and rounded corners drop out).
        const ins = Math.max(2, Math.round(cv.height / 4));
        const w = cv.width - ins * 2, h = cv.height - ins * 2;
        if (w < 4 || h < 4) return false;
        const d = ctx.getImageData(ins, ins, w, h).data;
        const counts = new Map();
        for (let i = 0; i < d.length; i += 4) { const k = (d[i] >> 3) + ',' + (d[i + 1] >> 3) + ',' + (d[i + 2] >> 3); counts.set(k, (counts.get(k) || 0) + 1); }
        const top = Math.max(...counts.values());
        return top / (d.length / 4) > 0.985;
      }, png.toString('base64'));
    } catch { /* off screen or detached */ }
    if (blank) add('hidden-content', 'fail', `control "${c.name}" renders blank: its text is transparent and nothing else paints inside it (a state rule hid the content)`, { sel: c.sel });
  }
  const v = cand.cov;
  if (v) {
    if (v.buttons && !v.disabled) add('state-sheet', 'fail', 'state sheet shows no disabled control ([disabled] or aria-disabled="true")');
    if (v.buttons && !v.busy) add('state-sheet', 'fail', 'state sheet shows no busy or loading control (aria-busy="true")');
    if (v.fields && !v.invalid) add('state-sheet', 'fail', 'state sheet has fields but no field in error (aria-invalid="true")');
    if (v.data) for (const [k, ok] of Object.entries(v.panels)) if (!ok) add('state-sheet', 'warn', `data state sheet names no ${k} panel (design-director: empty, loading, error and partial panels)`);
  }
}
