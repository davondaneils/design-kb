#!/usr/bin/env python3
"""Builds state-sheet.html from the page's own CSS (schedule.template.html, verbatim) plus sheet-only rules that pin
hover, pressed and focus so they show in a static screenshot. Every control and panel the schedule uses appears here."""
import re, pathlib
HERE = pathlib.Path(__file__).resolve().parent
src = (HERE / 'schedule.template.html').read_text()
css = re.search(r'<style>(.*?)</style>', src, re.S).group(1)
logo = re.search(r'(<svg viewBox="0 30 276 78".*?</svg>)', src, re.S).group(1)
assert css.count('@layer states') == 1

ICON = {
 'check': '<path d="M3.5 8.5l3 3 6-7"/>', 'queue': '<path d="M3 4.5h10M3 8h10M3 11.5h6"/>',
 'clock': '<circle cx="8" cy="8" r="5.75"/><path d="M8 4.75V8l2.25 1.5"/>',
 'alert': '<path d="M8 2.5l6 10.5H2z"/><path d="M8 6.5v3"/><path d="M8 11.5v.01"/>',
 'stop': '<circle cx="8" cy="8" r="5.75"/><path d="M4 12L12 4"/>',
 'info': '<circle cx="8" cy="8" r="5.75"/><path d="M8 7.25v3.5"/><path d="M8 5.25v.01"/>',
 'left': '<path d="M10 3.5L5.5 8l4.5 4.5"/>', 'right': '<path d="M6 3.5l4.5 4.5L6 12.5"/>',
 'down': '<path d="M4 6l4 4 4-4"/>', 'retry': '<path d="M3 8a5 5 0 1 0 1.5-3.5"/><path d="M3 2.5v3h3"/>'}
def icon(n, cls=''): return f'<svg class="icon {cls}" viewBox="0 0 16 16" aria-hidden="true">{ICON[n]}</svg>'
NB = ' '

SHEET_CSS = """
@layer sheet {
  .sheet { max-width: 1120px; margin: 0 auto; padding: var(--space-7) var(--space-5) var(--space-9); display: grid; gap: var(--space-8); }
  .sheet > header h1 { font-size: var(--text-2xl); font-weight: var(--weight-bold); letter-spacing: -0.015em; line-height: var(--leading-tight); }
  .sheet > header p { margin-top: var(--space-3); color: var(--color-text-muted); max-inline-size: var(--size-measure); font-size: var(--text-sm); }
  .sec { display: grid; gap: var(--space-5); }
  .sec > h2 { font-size: var(--text-lg); font-weight: var(--weight-semibold); }
  .sec > p { font-size: var(--text-sm); color: var(--color-text-muted); max-inline-size: var(--size-measure); }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: var(--space-5) var(--space-6); align-items: start; }
  .grid.wide { grid-template-columns: repeat(auto-fill, minmax(min(100%, 520px), 1fr)); }
  .cell { display: grid; gap: var(--space-3); justify-items: start; min-width: 0; }
  .cell > .cap { font-size: var(--text-xs); color: var(--color-text-muted); font-weight: var(--weight-medium); }
  .cell.stretch { justify-items: stretch; }
  .sub { font-size: var(--text-sm); font-weight: var(--weight-semibold); color: var(--color-text-muted); margin-top: var(--space-3); }
  .cell .day-link { width: var(--size-touch); }
  .cell .place { margin-left: 0; max-width: 100%; }
  .cell .place select { max-width: 100%; }
  .bar-sample { position: relative; height: var(--appbar-height); }
  .bar-sample .appbar { position: static; }
  .card-sample { background: var(--color-surface); border-radius: var(--radius-card); box-shadow: var(--elevation-card); overflow: clip; }
  .dialog-sample { padding: var(--space-6); border-radius: var(--radius-xl); background: var(--color-surface-raised); box-shadow: var(--elevation-modal); max-width: 440px; }
  .dialog-sample h3 { font-size: var(--text-lg); font-weight: var(--weight-semibold); }
  .dialog-sample p { margin-top: var(--space-3); color: var(--color-text-muted); }
  .dialog-sample .actions { display: flex; flex-wrap: wrap-reverse; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-6); }
  .backdrop-sample { padding: var(--space-6); border-radius: var(--radius-lg); background: rgb(var(--shadow-rgb) / 0.48); }
  /* Pinned states: the same declarations as the page's states layer, keyed to classes so a screenshot holds them. */
  .is-hover.cls-row, .is-hover.icon-btn, .is-hover.day-link, .is-hover.btn-secondary, .is-hover.btn-danger, .place select.is-hover { background-color: var(--state-hover); }
  .is-hover.btn-primary { background: var(--color-primary-hover); }
  .is-pressed.cls-row, .is-pressed.icon-btn, .is-pressed.day-link, .is-pressed.btn-secondary, .is-pressed.btn-danger { background-color: var(--state-pressed); }
  .is-pressed.btn-primary { background: var(--color-primary-active); }
  .is-focus { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; }
  .is-focus.cls-row { outline-offset: -2px; border-radius: var(--radius-card); }
  .is-busy .label { opacity: 0; }
  .is-busy .spinner { opacity: 1; animation: spin 0.8s linear infinite; }
  @media (prefers-reduced-motion: reduce) { .is-busy .spinner { animation: none; opacity: 0.6; border-right-color: currentColor; } }
}
"""

def btn(kind, label, state='', disabled=False, busy=False):
    cls = f'btn btn-{kind}' + (f' is-{state}' if state else '') + (' is-busy' if busy else '')
    attrs = (' disabled' if disabled else '') + (' aria-busy="true"' if busy else '')
    return f'<button type="button" class="{cls}"{attrs}><span class="label">{label}</span><span class="spinner" aria-hidden="true"></span></button>'

def cells(items):
    return '<div class="grid">' + ''.join(f'<div class="cell"><span class="cap">{cap}</span>{html}</div>' for cap, html in items) + '</div>'

STATES = [('Rest', ''), ('Hover', 'hover'), ('Pressed', 'pressed'), ('Focus', 'focus')]
buttons = ''
for kind, label in [('primary', 'Book this class'), ('secondary', 'Leave waitlist'), ('danger', 'Cancel booking')]:
    items = [(f'{cap}', btn(kind, label, st)) for cap, st in STATES]
    items.append(('Disabled', btn(kind, label, disabled=True)))
    items.append(('Busy (after 150 ms)', btn(kind, label, busy=True)))
    buttons += f'<h3 class="sub">{kind.title()}</h3>' + cells(items)

iconbtns = cells([(cap, f'<button type="button" class="icon-btn{" is-" + st if st else ""}" aria-label="Previous week">{icon("left")}</button>') for cap, st in STATES]
                 + [('Disabled', f'<button type="button" class="icon-btn" disabled aria-label="Previous week">{icon("left")}</button>')])

def picker(st, invalid=False):
    sid = 'sel-' + (st or ('invalid' if invalid else 'rest'))
    inv = f' aria-invalid="true" aria-describedby="{sid}-err"' if invalid else ''
    err = f'<p class="field-error" id="{sid}-err"><svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.75"/><path d="M8 4.75v3.5"/><path d="M8 10.75v.01"/></svg><span>That wall isn’t available to you any more. Pick another.</span></p>' if invalid else ''
    return f'<div class="place"><label class="sr-only" for="{sid}">Gym and wall</label><select id="{sid}" class="{"is-" + st if st else ""}"{inv}><option>Basalt, Eastside</option></select>{icon("down")}</div>{err}'
select = cells([(cap, picker(st)) for cap, st in STATES[:2] + STATES[3:]] + [('Error: wall no longer visible (404)', picker('', True))])

def day(dn, dd, st='', current=False, mine=False):
    cur = ' aria-current="date"' if current else ''
    return f'<a class="day-link{" is-" + st if st else ""}" href="#d" data-mine="{str(mine).lower()}"{cur}><span class="dn">{dn}</span><span class="dd num">{dd}</span><span class="mark"></span></a>'
days = cells([('Rest', day('Wed', 14)), ('Hover', day('Wed', 14, 'hover')), ('Pressed', day('Wed', 14, 'pressed')), ('Focus', day('Wed', 14, 'focus')),
              ('Today', day('Tue', 13, current=True, mine=True)), ('Has my booking', day('Sun', 18, mine=True))])

def rail(taken, cap, big=False):
    dots = ''.join(f'<i class="{"on" if i < taken else ""}"></i>' for i in range(cap))
    return f'<span class="rail{" lg" if big else ""}" role="img" aria-label="{taken} of {cap} places taken">{dots}</span>'
def bar(taken, cap):
    pct = round(taken / cap * 100)
    return f'<span class="bar" role="img" aria-label="{taken} of {cap} places taken"><i style="width:{pct}%"></i></span>'
rails = cells([('0 of 10 taken', rail(0, 10)), ('6 of 10 taken', rail(6, 10)), ('10 of 10, full', rail(10, 10)), ('9 of 12 taken', rail(9, 12)),
               ('Detail size, 8 of 12', rail(8, 12, True)), ('Over 16 places: bar, 14 of 20', bar(14, 20))])

chips = cells([('Booked', f'<span class="chip chip-booked">{icon("check")}Booked</span>'),
               ('On the waitlist', f'<span class="chip chip-queue">{icon("queue")}2nd in line</span>'),
               ('Attended', f'<span class="chip chip-quiet">{icon("check")}Attended</span>'),
               ('No-show', f'<span class="chip chip-quiet">{icon("stop")}No-show</span>'),
               ('Late cancel', f'<span class="chip chip-quiet">{icon("stop")}Late cancel</span>'),
               ('Cancelled by the gym', f'<span class="chip chip-cancel">{icon("stop")}Cancelled</span>'),
               ('Inline warning', f'<span class="cls-row" style="display:block;padding:0"><span class="warn">{icon("clock")}Free cancellation ended</span></span>')])

def row(st, chip_html, places, time_s='6:30 pm', end='to 8:30 pm', name='Lead Climbing Course', expanded=False, muted=False, who='Jonah'):
    return f'''<li class="cls" data-muted="{str(muted).lower()}" data-lint-skip="measure"><button type="button" class="cls-row{" is-" + st if st else ""}" aria-expanded="{str(expanded).lower()}">
      <span class="t"><time>{time_s}</time><span class="t-end">{end}</span></span>
      <span class="body"><span class="name">{name}</span><span class="meta"><span>{who}</span>{places}</span>{f'<span class="status">{chip_html}</span>' if chip_html else ''}</span>
      {icon("down", "chev")}</button></li>'''
rows_html = '<ul class="card-sample">' + ''.join([
    row('', '', f'{rail(8, 12)}<span>4{NB}places left</span>', '7 am', 'to 8:30 am', 'Intro to Bouldering'),
    row('hover', f'<span class="chip chip-booked">{icon("check")}Booked</span>', f'{rail(9, 12)}<span>3{NB}places left</span>', '10 am', 'to 11:30 am', 'Intro to Bouldering'),
    row('pressed', f'<span class="chip chip-queue">{icon("queue")}2nd in line</span>', f'{rail(10, 10)}<span>Full, 3{NB}waiting</span>', '6 pm', 'to 7:30 pm', 'Intro to Bouldering'),
    row('focus', f'<span class="chip chip-booked">{icon("check")}Booked</span><span class="warn">{icon("clock")}Free cancellation ended</span>', f'{rail(8, 8)}<span>Full, 2{NB}waiting</span>'),
    row('', f'<span class="chip chip-cancel">{icon("stop")}Cancelled</span>', '<span>Cancelled by the gym</span>', '6 pm', 'to 7:30 pm', 'Intro to Bouldering', muted=True),
]) + '</ul>'

detail = f'''<div class="card-sample"><ul>{row('', f'<span class="chip chip-booked">{icon("check")}Booked</span>', f'{rail(9, 12)}<span>3{NB}places left</span>', '10 am', 'to 11:30 am', 'Intro to Bouldering', expanded=True)}</ul>
  <div class="detail"><div class="detail-inner">
    <p class="status-line">You’re booked.</p>
    <div class="facts"><div><strong>Sun, Oct{NB}18, 10{NB}to 11:30{NB}am{NB}MT</strong></div><div>With Jonah at Eastside</div><div>{rail(9, 12, True)}<span><span class="num">9</span> of 12 places taken</span></div></div>
    <p class="policy">{icon("clock")}<span>Free cancellation until Sat, Oct{NB}17, 10{NB}pm. After that, cancelling counts as a no-show.</span></p>
    <div class="actions">{btn('secondary', 'Cancel booking')}</div>
  </div></div></div>'''

policies = cells([('Rule, before the deadline', f'<p class="policy">{icon("clock")}<span>Free cancellation until today at 7{NB}pm if you book now.</span></p>'),
                  ('Rule, after the deadline', f'<p class="policy warn">{icon("clock")}<span>Free cancellation ended today at 6:30{NB}am. Cancelling now counts as a no-show.</span></p>'),
                  ('Late cancel action', btn('danger', 'Cancel anyway…')),
                  ('Waitlist rule', f'<p class="policy">{icon("info")}<span>If a place opens before the class starts, it goes to the first person in line and the booking is made for you.</span></p>'),
                  ('Blocked action with its reason', f'<div class="actions" style="display:grid;gap:var(--space-3)"><button type="button" class="btn btn-primary" disabled aria-describedby="why-s"><span class="label">Book this class</span></button><span class="reason" id="why-s">Booking is paused until your payment goes through.</span></div>')])
policies = policies.replace('class="grid"', 'class="grid wide"', 1)

banners = f'''<div class="grid wide">
  <div class="cell stretch"><span class="cap">Payment failed, inside the 7-day grace</span><section class="banner" aria-labelledby="b1">{icon("alert")}<div><h3 id="b1" style="font-size:var(--text-base);font-weight:var(--weight-semibold)">Your monthly pass payment didn’t go through</h3>
    <p>You can keep booking until Sun, Oct{NB}18, 9:14{NB}am. Update your card before then to keep your pass.</p></div><div class="actions"><a class="btn btn-primary" href="#update-payment"><span class="label">Update payment</span></a></div></section></div>
  <div class="cell stretch"><span class="cap">Grace ended</span><section class="banner danger" aria-labelledby="b2">{icon("stop")}<div><h3 id="b2" style="font-size:var(--text-base);font-weight:var(--weight-semibold)">Booking is paused</h3>
    <p>Your monthly pass payment didn’t go through, and booking stayed open until Sun, Oct{NB}11, 9:14{NB}am. Update your card to book again. Classes you already booked stay booked.</p></div><div class="actions"><a class="btn btn-primary" href="#update-payment"><span class="label">Update payment</span></a></div></section></div>
  <div class="cell stretch"><span class="cap">Success: status line after booking (also announced)</span><div class="card" style="width:100%"><p class="status-line">You’re booked.</p></div></div>
</div>'''

sk = ''.join('<div class="sk-row"><span class="sk-stack"><span class="sk" style="height:12px;width:56px"></span><span class="sk" style="height:12px;width:40px"></span></span><span class="sk-stack"><span class="sk" style="height:12px;width:60%"></span><span class="sk" style="height:12px;width:40%"></span></span></div>' for _ in range(2))
panels = f'''<div class="grid wide">
  <div class="cell stretch"><span class="cap">Loading (skeleton)</span><div class="card-sample" aria-busy="true"><span class="sr-only">Loading classes</span>{sk}</div></div>
  <div class="cell stretch"><span class="cap">Nothing scheduled (empty week)</span><div class="panel"><span class="rail lg" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><h3 style="font-size:var(--text-lg);font-weight:var(--weight-semibold)">No classes at Westside this week</h3>
    <p>The next classes here are in the week of October{NB}26.</p>{btn('primary', f'Show week of Oct{NB}26')}</div></div>
  <div class="cell stretch"><span class="cap">Nothing scheduled, and nothing later</span><div class="panel"><span class="rail lg" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><h3 style="font-size:var(--text-lg);font-weight:var(--weight-semibold)">No classes at Westside this week</h3>
    <p>Nothing is scheduled after this week yet. New classes show up here as soon as the gym publishes them.</p></div></div>
  <div class="cell stretch"><span class="cap">Error</span><div class="panel"><h3 style="font-size:var(--text-lg);font-weight:var(--weight-semibold)">The schedule didn’t load</h3>
    <p>We couldn’t reach Crux. Check your connection, then try again. Your bookings are not affected.</p>{btn('primary', 'Try again')}</div></div>
  <div class="cell stretch"><span class="cap">Partial: more than one page of classes (has_more)</span><div class="panel"><p class="asof">Places as of 2:46{NB}pm. Showing the first classes; more below.</p>{btn('secondary', 'Load more classes')}</div></div>
</div>'''

dialog = f'''<div class="backdrop-sample"><div class="dialog-sample" role="group" aria-labelledby="dlg-t">
  <h3 id="dlg-t">Cancel and count it as a no-show?</h3>
  <p>Free cancellation for Lead Climbing Course ended today at 6:30{NB}am. If you cancel now, your place goes to the next person in line and this counts as a no-show.</p>
  <div class="actions">{btn('danger', 'Cancel booking')}{btn('primary', 'Keep my place')}</div></div></div>'''

appbar = f'''<div class="bar-sample"><div class="appbar"><a class="brand" href="#top" aria-label="Crux, state sheet">{logo}</a>
  <div class="place"><label class="sr-only" for="loc-s">Gym and wall</label><select id="loc-s"><option>Basalt Climbing, Eastside</option></select>{icon("down")}</div>
  <span class="avatar" role="img" aria-label="Maya Okafor">MO</span></div></div>'''

def sec(title, note, body):
    return f'<section class="sec"><h2>{title}</h2>{f"<p>{note}</p>" if note else ""}{body}</section>'

html = f'''<!doctype html>
<html lang="en-US" data-lint-page="state-sheet">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="color-scheme" content="light dark">
<title>Crux state sheet</title>
<!-- Generated by tests/build_state_sheet.py from the schedule's own CSS; do not edit by hand. -->
<style>{css}{SHEET_CSS}</style>
</head>
<body id="top">
{appbar}
<main class="sheet">
  <header><h1>Schedule controls, every state</h1><p>Hover, pressed and focus are pinned with classes that copy the page’s own state rules, so a screenshot holds them. Busy shows the spinner the page reveals after 150 ms.</p></header>
  {sec('Buttons', 'One filled button per view on the page. Disabled buttons sit beside a reason.', buttons)}
  {sec('Week arrows', '', iconbtns)}
  {sec('Gym and wall picker', '', select)}
  {sec('Day strip', 'The dot under a day means you have a booking or a waitlist place that day.', days)}
  {sec('Places rail', 'One dot per place, filled when taken. Classes over 16 places switch to a bar.', rails)}
  {sec('Status chips', 'Each chip carries an icon and a word; color is never the only signal.', chips)}
  {sec('Class rows', 'Rest, hover, pressed, focus, and a class the gym cancelled.', rows_html)}
  {sec('Class detail, expanded', '', detail)}
  {sec('Rules and reasons', '', policies)}
  {sec('Banners and feedback', '', banners)}
  {sec('Panels', '', panels)}
  {sec('Late-cancel dialog', 'Keep my place is the default and takes focus first.', dialog)}
</main>
</body>
</html>
'''
assert chr(0x2014) not in html
(HERE.parent / 'state-sheet.html').write_text(html)
print('wrote', HERE.parent / 'state-sheet.html', len(html))
