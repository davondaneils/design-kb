(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const params = new URLSearchParams(location.search);
  const state = params.get('state');
  const css = getComputedStyle(document.documentElement);
  const ms = (name) => parseFloat(css.getPropertyValue(name)) || 0;

  /* phone menu: the trigger reads Close while open */
  const menuBtn = $('[data-menu]');
  const menu = $('#menu');
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.textContent = open ? 'Close' : 'Menu';
    for (const el of document.querySelectorAll('main, footer')) el.inert = open;
  };
  /* pointer opens animate; keyboard opens appear at once (design-motion: keyboard paths never animate) */
  menuBtn.addEventListener('click', (e) => { menu.dataset.by = e.detail > 0 ? 'pointer' : 'key'; setMenu(menu.hidden); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* signup: idle, invalid, busy, sent */
  const form = $('[data-signup]');
  const email = $('#email');
  const err = $('#email-error');
  const done = $('#signup-done');
  const submit = form.querySelector('button[type=submit]');
  const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const setInvalid = (on) => {
    err.hidden = !on;
    email.setAttribute('aria-invalid', String(on));
    email.setAttribute('aria-describedby', on ? 'email-error email-terms' : 'email-terms');
  };
  const setBusy = (on) => submit.setAttribute('aria-busy', String(on));
  const showSent = (addr) => {
    done.querySelector('[data-email]').textContent = addr;
    form.hidden = true; done.hidden = false;
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (submit.getAttribute('aria-busy') === 'true') return;
    const v = email.value.trim();
    if (!valid(v)) { setInvalid(true); email.focus(); return; }
    setInvalid(false); setBusy(true);
    /* stand-in for the network call: production posts to the form action */
    setTimeout(() => { setBusy(false); showSent(v); done.focus(); }, 900);
  });
  email.addEventListener('input', () => { if (email.getAttribute('aria-invalid') === 'true' && valid(email.value.trim())) setInvalid(false); });
  $('[data-reset]').addEventListener('click', () => { done.hidden = true; form.hidden = false; email.focus(); email.select(); });

  /* every call to action lower down brings you back to the one field */
  document.querySelectorAll('[data-focus-email]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    $('#hero-title').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => email.focus({ preventScroll: true }), reduce ? 0 : ms('--duration-page'));
  }));

  /* pricing stepper */
  const input = $('#people');
  const out = $('[data-total]');
  const math = $('[data-math]');
  const [minus, plus] = document.querySelectorAll('[data-step]');
  const PRICE = 12, FREE = 3, MIN = 1, MAX = 200;
  const render = () => {
    let n = Math.round(Number(input.value));
    if (!Number.isFinite(n)) n = MIN;
    n = Math.min(MAX, Math.max(MIN, n));
    const paid = Math.max(0, n - FREE);
    out.textContent = '$' + (paid * PRICE).toLocaleString('en-US');
    math.textContent = paid === 0
      ? `Up to ${FREE} people are free.`
      : `${paid} ${paid === 1 ? 'person' : 'people'} at $${PRICE}. Your first ${FREE} are free.`;
    minus.disabled = n <= MIN; plus.disabled = n >= MAX;
    return n;
  };
  minus.parentElement.addEventListener('click', (e) => {
    const b = e.target.closest('[data-step]'); if (!b || b.disabled) return;
    input.value = Math.min(MAX, Math.max(MIN, Number(input.value) + Number(b.dataset.step)));
    render();
  });
  input.addEventListener('input', render);
  input.addEventListener('change', () => { input.value = render(); });
  render();

  /* review states: ?state=error | busy | sent | menu | faq */
  if (state === 'error') { email.value = 'dana@lumen'; setInvalid(true); }
  if (state === 'busy') { email.value = 'dana@lumen.studio'; setBusy(true); }
  if (state === 'sent') showSent('dana@lumen.studio');
  if (state === 'menu') setMenu(true);
  if (state === 'faq') document.querySelector('.faq details').open = true;
})();
