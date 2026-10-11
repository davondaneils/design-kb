# design-conversion: suggested changes to shared files

Written 2026-10-10. This wave may not edit these files; each item is a proposal for the owner.

1. **design-ux `references/03-forms.md`:** it cites Baymard's older US average of 14.88 checkout fields. Baymard's 2024 figure is 11.3 (C9 in `kb/research/conversion/04-checkout-and-forms.md`). Update the number; the advice (cut to 7 or 8) stands.
2. **kb/FOUNDATIONS.md:** add `surface-sunken` as a named surface role (the combined pages already use `--color-surface-sunken`). Add a rule: muted text on any tinted or sunken surface must be re-measured; ship a `text-muted-on-tint` role (the slice found 4.38:1 and 4.24:1 failures there).
3. **design-playbook-landing:** load `design-conversion` for pricing, subscription, shop and checkout sections; add "price and primary in the first screen at 390" and "term line beside any renewal CTA" to what done looks like.
4. **design-playbook-dashboard:** load `design-conversion` reference 05 when the product has plan limits; add "upgrade is never the header primary unless the user is blocked".
5. **design-director:** list `design-conversion` among the references and run `skills/design-conversion/assets/conversion-audit.mjs` in the self-critique loop for any page that sells.
6. **tools/lint.mjs:** promote a primary-per-screen check (one filled primary per viewport, counting only an open modal when present) from the audit into lint, since it is FOUNDATIONS item 12.
7. **kb/status/funnels.md** (owned elsewhere): note that `design-conversion` is the design-side companion and that sales-funnels stays the source for funnel step order and offers.
8. **Pipeline:** this wave had no subagent tool, so critic and tester were self-reviews. Re-run the tester from a clean context before merge.
9. **Global CSS reset in templates:** include `[hidden] { display: none !important; }`; grid and flex rules silently override the attribute.
