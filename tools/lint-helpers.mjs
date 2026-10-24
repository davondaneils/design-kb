// Shared in-page helpers (window.__lint) and the animation settle wait, used by lint.mjs and operate.mjs.
// Shared in-page helpers, injected as a string so they run in the browser.
export const helpers = `
  window.__lint = {
    visible(el) {
      // Content of a closed <details> is not rendered, but Chromium can still report boxes for it (the Ferry FAQ
      // gave 14 false fails, benchmark round 1). Everything but the <summary> of a closed <details> is hidden.
      const shut = el.closest('details:not([open])');
      if (shut && el !== shut && !el.closest('summary')) return false;
      const s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    },
    skipped(el, check) {
      const host = el.closest('[data-lint-skip]');
      if (host && host.getAttribute('data-lint-skip').split(/\\s+/).includes(check)) return true;
      // Rotated, mirrored or vertical text: its client rects are the axis-aligned box of the turned text, so line
      // counts, widths and edges read wrong (the held-out poster's -1.2deg sheet reported 9 characters per line on
      // one-line text). Geometry checks skip it; contrast, overlay, canvas-text and focus still run.
      if (this.GEOMETRY.includes(check) && this.transformed(el)) return true;
      return false;
    },
    GEOMETRY: ['measure', 'squash', 'run-together', 'word-break', 'grid-edge', 'heading-wrap', 'svg-overlap', 'double-space'],
    // 'rotated', 'mirrored' or 'vertical' when the element or an ancestor turns or flips its text, else null.
    transformed(el) {
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (s.rotate && s.rotate !== 'none' && parseFloat(s.rotate.trim().split(/\\s+/).pop())) return 'rotated';
        if (s.scale && s.scale !== 'none' && s.scale.split(/\\s+/).map(parseFloat).some((v) => v < 0)) return 'mirrored';
        if (s.transform && s.transform !== 'none') {
          const m = new DOMMatrixReadOnly(s.transform);
          if (Math.abs(m.b) > 1e-3 || Math.abs(m.c) > 1e-3) return 'rotated';
          if (m.a < 0 || m.d < 0) return 'mirrored';
        }
        if (/vertical|sideways/.test(s.writingMode)) return 'vertical';
      }
      return null;
    },
    // The open modal dialog, if any: native dialog shown with showModal(), or a visible [aria-modal=true] element.
    modal() {
      for (const d of document.querySelectorAll('dialog[open]')) { try { if (d.matches(':modal')) return d; } catch { /* old engines */ } }
      return [...document.querySelectorAll('[aria-modal="true"]')].find((d) => this.visible(d)) || null;
    },
    // Inactive content: behind an open modal, or inside [inert]. Exempt from contrast (WCAG 1.4.3) and unreachable.
    inactive(el) {
      if (el.closest('[inert]')) return true;
      const m = this.modal();
      return !!m && !m.contains(el);
    },
    sel(el) {
      if (el.id) return '#' + el.id;
      const parts = [];
      let n = el;
      while (n && n.nodeType === 1 && parts.length < 4) {
        let p = n.tagName.toLowerCase();
        if (n.classList.length) p += '.' + [...n.classList].slice(0, 2).join('.');
        parts.unshift(p);
        if (n.id) { parts[0] = '#' + n.id; break; }
        n = n.parentElement;
      }
      return parts.join(' > ');
    },
    // Visible text nodes outside code-like elements.
    textNodes(root) {
      const out = [];
      const w = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT);
      for (let n = w.nextNode(); n; n = w.nextNode()) {
        const el = n.parentElement;
        if (!el || !n.textContent.trim()) continue;
        if (el.closest('script, style, template, noscript, code, pre, kbd, samp, textarea, [aria-hidden="true"] title')) continue;
        if (!this.visible(el)) continue;
        out.push(n);
      }
      return out;
    },
    // Does bar b paint above el where their boxes intersect? Sample the middle of the intersection with
    // elementsFromPoint (stacking-aware), so a skip link with a higher z-index over a sticky header is not "under" it.
    paintsOver(b, el) {
      const er = el.getBoundingClientRect(), br = b.getBoundingClientRect();
      const l = Math.max(er.left, br.left, 0), r = Math.min(er.right, br.right, innerWidth - 1);
      const t = Math.max(er.top, br.top, 0), btm = Math.min(er.bottom, br.bottom, innerHeight - 1);
      if (r - l <= 1 || btm - t <= 1) return false;
      for (const [x, y] of [[(l + r) / 2, (t + btm) / 2], [l + 1, t + 1], [r - 1, btm - 1]]) {
        for (const hit of document.elementsFromPoint(x, y)) {
          if (hit === el || el.contains(hit) || hit.contains(el)) break;
          if (b === hit || b.contains(hit)) return true;
        }
      }
      return false;
    },
    // Simulate an anchor jump or Shift+Tab: scroll the element to the top (scroll-padding is honored), then look for bars over it.
    coveredAtTop(el) {
      if (el.closest('dialog, [role=dialog]')) return null;
      const y = scrollY;
      el.scrollIntoView({ block: 'start' });
      const er = el.getBoundingClientRect();
      let hit = null;
      for (const b of document.querySelectorAll('body *')) {
        const s = getComputedStyle(b);
        if (s.position !== 'sticky' && s.position !== 'fixed') continue;
        if (b.contains(el) || !this.visible(b)) continue;
        const br = b.getBoundingClientRect();
        if (br.height > innerHeight * 0.5) continue;
        const ix = Math.min(er.right, br.right) - Math.max(er.left, br.left);
        const iy = Math.min(er.bottom, br.bottom) - Math.max(er.top, br.top);
        if (ix > 1 && iy > 1 && this.paintsOver(b, el)) { hit = this.sel(b) + ' (scrolled to top)'; break; }
      }
      scrollTo(0, y);
      return hit;
    },
    // Lines of an element's text, as word counts per rendered line.
    lines(el) {
      const lines = new Map();
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const range = document.createRange();
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const re = /\\S+/g; let m;
        while ((m = re.exec(n.textContent))) {
          range.setStart(n, m.index); range.setEnd(n, m.index + m[0].length);
          const rc = range.getClientRects()[0];
          if (!rc || !rc.width) continue;
          const key = Math.round(rc.bottom / 4);
          const cur = lines.get(key) || { words: 0, chars: 0 };
          cur.words++; cur.chars += m[0].length + 1;
          lines.set(key, cur);
        }
      }
      return [...lines.entries()].sort((a, b) => a[0] - b[0]).map((e) => e[1]);
    },
  };
`;

// Wait for finite animations (entrances, reveals) to finish, capped at 2s, so nothing is measured mid-transition.
export async function settle(page) {
  await page.evaluate(() => Promise.race([
    Promise.all(document.getAnimations().filter((a) => { const t = a.effect && a.effect.getComputedTiming(); return t && Number.isFinite(t.endTime); }).map((a) => a.finished.catch(() => null))),
    new Promise((r) => setTimeout(r, 2000)),
  ])).catch(() => null);
}

