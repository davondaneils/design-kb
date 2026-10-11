# Mobile exemplars: what to take from each

Five apps to compare against, each with the specific moves to take and the evidence for them. Added after the held-out test, where the skilled budgeting app home was "correct but generic" and clearly below Cash App and Things 3 (`kb/tests/heldout.md` section 5).

**Evidence levels.** *Measured* values come from a design-kb teardown (`kb/teardowns/`, Playwright on the public page or on the team's own published app screenshots). *Documented* means the team's own help center, blog, brand site or App Store text says it. *Opinion* is the judge's reading. Native app screens could not be measured directly on 2026-10-11: the apps sit behind logins and the Mobbin connector refused with "requires a paid plan". Pixel teardowns of these five home screens are open work (see the end of this file).

## Pick the closest

| Job | Compare against first | Then |
|---|---|---|
| Money: balance, pay, cash out | Cash App | Monzo |
| Money: budgeting, "can I spend this?" | Copilot Money | Monzo |
| Personal tasks, calm lists | Things 3 | Linear mobile |
| Work tool on the go (triage, inbox, quick create) | Linear mobile | Things 3 |
| UK or EU banking, en-GB copy | Monzo | Copilot Money |

## Cash App: one number, one action, one face
- **Home is the amount.** The Money tab leads with the balance as the largest thing on screen, with the add and cash-out actions directly under it; paying is a full-screen keypad where the typed amount is the hero (documented: WalletHub's walkthrough, "your available balance prominently displayed at the top"; opinion on proportions until measured).
- **One custom face, one weight, tight tracking.** Cash Sans is "a customized version of Söhne by Klim", distinguished by "rounded punctuation" (design.cash.app/typography, accessed 2026-10-11). On cash.app every size runs at -0.03em and weight 400; line height 0.95 on the display line (measured, `kb/teardowns/cashapp-home.md`).
- **Color as a field, not a highlight.** Green `#00e013` is a surface with black text (white on it is 1.80:1); no shadows anywhere (measured, same teardown).
- **Take:** the hero number at display size with tabular figures and the face's own tracking; one filled action under it; let the brand live in the number's typography, not in decoration.

## Things 3: system chrome, private details
- **One hue per list, used only on the icon.** Inbox blue `#469ffc`, Today yellow `#fdd314`, Upcoming red `#f94876`, Anytime green `#47b378` (estimate from Cultured Code's own app collage, `kb/teardowns/things-home.md`).
- **Rhythm from two pitches.** Sidebar rows about 36px, to-do rows about 42px (1.17 times); no lines between rows, a hairline only under headings (estimate, same teardown).
- **One magic control.** The Magic Plus button creates a to-do on tap and, dragged, inserts it exactly where it is dropped (documented, culturedcode.com/things/features; Apple Design Award 2017, apple.com newsroom 2017-06-07).
- **Take:** standard navigation and sheets; personality in one control, one hue system and the checkbox; let metadata go lighter and smaller so a list of 5 reads as 5.

## Monzo: the home is the user's, and simple means ordered
- **Customizable order, not a fixed tile wall.** "Customise what you see in your Home screen, in what order, and with what level of detail" (monzo.com/blog/the-new-and-improved-home-screen).
- **Research rejected the busy version.** "Some of our initial ideas were overwhelming and confusing"; "Simplicity isn't the absence of things, it's bringing order to complexity"; the core jobs stayed one tap away: "viewing balances, copying card details and searching for transactions" (monzo.com/blog/how-we-built-the-new-home-screen, over 1,000 customers heard).
- **One activity stream across accounts** rather than one card per account (monzo.com blog, "How we unified our customers' activity on the new home screen", 2024-01-10).
- **Take:** for en-GB money apps, Monzo's copy and dates set the register (FOUNDATIONS locale table); measure the redesign by "do no harm" on session time, as Monzo did (monzo.com/blog/how-we-measured-change-aversion-with-our-new-home-screen).

## Copilot Money: the hero number is an answer
- **"Free to Spend" leads the dashboard.** "At the top of this graph is the Free to Spend value (ex: $1,380 left). This is the amount of money that can still be spent without going over budget for the month" (help.copilot.money, Dashboard Tab Overview, updated 2026-04-14).
- **Pace, not just total.** A dotted line is "the ideal spending rate to stay within the current monthly budget"; a solid line is actual spend, ending at today (same source).
- **Then the jobs, in order:** To Review (new transactions to confirm), trending budgets, upcoming recurrings, net this month vs last month to date (same source). Apple Design Award finalist 2024 and Editor's Choice (App Store listing).
- **Take:** state the hero number as the answer to the user's question, with its basis beside it ("$1,380 left this month"), and give it a pace or comparison so it means something; a review queue is a better second block than a tile grid.

## Linear mobile: away-from-keyboard jobs only
- **Purpose-cut, not a shrunk desktop.** "Purpose-designed for 'away from keyboard' workflows": inbox, quick create, unblock (linear.app/changelog/2024-09-19-introducing-linear-mobile). Native Swift and Kotlin (linear.app/mobile).
- **Gestures with visible twins.** "Tap to take action, swipe to delete, snooze to deal with it later", and the bottom bar shows back, create, archive and snooze as buttons (linear.app/mobile; changelog image caption).
- **Speed as the brand.** "The quick-access issue composer is designed with an obsessive focus on speed" (linear.app/mobile). Desktop values to carry over: Inter Variable at weights 510 and 590, status as the only color (measured, `kb/teardowns/linear-app.md`).
- **Take:** list the three jobs a person does on the phone and build only those; every swipe has a button.

## Open work
- Pixel teardowns of the five home screens (hero number size and weight, row pitch, first-screen content at 390x844) from published screenshots, press kits or screenshots Davon supplies; Mobbin access would also unlock them. Until then, compare proportions by eye and say so in the hand-over.
- An Android-first exemplar is still missing (playbook section 3).
