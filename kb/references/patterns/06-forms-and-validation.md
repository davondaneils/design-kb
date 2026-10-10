# Forms and validation

Jobs: dashboard, mobile app. Sources observed 2026-10-10. Source type per entry: **live page** (fetched or rendered today) or **Mobbin** (none yet; the Mobbin connector needs a paid plan). Opinion is marked (opinion).
Floor rules live in [design-ux 03-forms](../../../skills/design-ux/references/03-forms.md) (labels, validation timing, keyboards, passwords) and [design-product-ui 03-forms-settings](../../../skills/design-product-ui/references/03-forms-settings.md) (save models); this file is the ceiling: what the best shipped examples do.

## What the best examples do
1. **Validate on blur, then go live only while the field is wrong.** GitHub Primer: "validation may be performed as the user is typing ... but only after the first time the input has been validated and the input is in an invalid state." [primer.style/product/ui-patterns/forms](https://primer.style/product/ui-patterns/forms/) [live page]
2. **Stripe Dashboard sign-up shows the email error on blur, next to the field, with an icon.** Typing "davon@" and tabbing away set `aria-invalid="true"`, turned the border red and showed "Please enter a valid email." with a warning icon in a `role="alert"` node, 14px. Measured with Playwright. [dashboard.stripe.com/register](https://dashboard.stripe.com/register) [live page]
3. **Stripe swaps password rules for a 3-segment strength meter with a word label.** After typing "abc", the field label row showed "Too weak" in red at the right and the first of three bars filled red; a show/hide eye sits inside the field. Observed in screenshot. [dashboard.stripe.com/register](https://dashboard.stripe.com/register) [live page]
4. **Error summary only when errors pile up.** Primer: "If the form has 3 or more errors, you may show an interactive summary of errors" as a Banner of anchor links, focused when it appears; otherwise focus and scroll to the first invalid input. Primer also says live regions "should not be used for form validation"; use focus management. [primer.style/product/ui-patterns/forms](https://primer.style/product/ui-patterns/forms/) [live page]
5. **Never disable submit (most systems), but the products disagree.** Atlassian: "Never disable a submit button ... describe what needs to be done using validation and error messages." Primer: "Disabled buttons are discouraged." Carbon allows disabling only on short forms. Stripe's sign-up button was `disabled` (Playwright could not click it) until fields were valid, and Cash App's Continue is visually dimmed until a number is typed. [atlassian.design/patterns/forms](https://atlassian.design/patterns/forms/), [carbondesignsystem.com/patterns/forms-pattern](https://carbondesignsystem.com/patterns/forms-pattern/) [live page]. Which one to follow: the systems (opinion; a disabled button gives no reason, and Stripe's short 4-field form is the only case Carbon would allow).
6. **Swap helper text for the error instead of stacking both.** Material 3: "replace supporting text with error text. Swapping ... prevents new lines of text from bumping content." Primer says the same: "Show the validation message and remove the caption." [m3.material.io/components/text-fields/guidelines](https://m3.material.io/components/text-fields/guidelines) [live page]
7. **Error icon as a second cue.** Material 3: "It's strongly recommended to show an error icon when the text field is in the error state." Stripe (warning triangle) and Airbnb (filled red circle) both do it. [m3.material.io/components/text-fields/guidelines](https://m3.material.io/components/text-fields/guidelines) [live page]
8. **Airbnb mobile login: one field for phone or email, validated on submit, error tints the whole field.** Field "Phone number or email" with `autocomplete="tel-national"` and `inputmode="email"`, 55px tall, floating label. Blur showed nothing; tapping Continue showed "Please enter a valid phone number or email address." in rgb(193, 53, 21) with an icon, red border and a pale red field fill; consent text stays below. Measured at 390x844. [airbnb.com/login](https://www.airbnb.com/login) [live page]
9. **Cash App formats the phone number as you type and picks the keyboard.** `type="tel"`, `inputmode="numeric"`, `autocomplete="tel-national"`; typing "4155550123" rendered "(415) 555-0123". A Phone number / Email segmented control swaps the field to `inputmode="email"`, `autocomplete="email"`. Country code "+1" with flag is a separate tap target inside the field. Measured at 390x844. [cash.app/login](https://cash.app/login) [live page]
10. **Revolut splits country code and number into two fields.** Country chip "+1" with flag left, "Phone number" field right (`inputmode="tel"`, `autocomplete="tel-national"`), 56px tall labels, pill Continue 52px tall dimmed until input. Escape hatch link "Lost access to my phone number" sits directly under the field. Measured at 390x844. [app.revolut.com/start](https://app.revolut.com/start) [live page]
11. **Stripe raises input text to 16px on mobile.** Same page: inputs are 14px at 1440 wide but 16px at 390 wide, the size that stops iOS Safari zooming on focus (floor rule in design-ux 03). Measured. [dashboard.stripe.com/register](https://dashboard.stripe.com/register) [live page]
12. **Apple: timing depends on the field.** "When entering an email address, it's best to validate when people switch to another field; when creating a user name or password, validation needs to happen before people switch." Also: show the matching keyboard type and a trailing Clear button on iOS. [developer.apple.com/design/human-interface-guidelines/text-fields](https://developer.apple.com/design/human-interface-guidelines/text-fields) [live page]
13. **Do not wipe a form that cannot save.** Primer: "If a form's data cannot be saved, don't remove or disable the form fields or the submit button." Tell people it is read-only; if only some data failed to load, disable just those fields with a message. [primer.style/product/ui-patterns/forms](https://primer.style/product/ui-patterns/forms/) [live page]

## Common structure
Dashboard (Stripe, Primer, Atlassian, Carbon, Polaris):
```
[Error summary banner]   only on submit, 3+ errors (Primer)
Label (14px, sentence case, <= 3 words)        * or "(optional)", whichever is rarer
Caption / helper            -> replaced by error, not stacked
[ Input  40px tall ]  width hints at value length
(!) Error text, icon, red, under the field, linked by aria-describedby
...                         32px between fields on a page, 16 to 24 in panels (Carbon)
                            48px before the button row (Carbon)
[ Primary action, outcome verb ]  enabled; disable only while submitting
```
Mobile (Airbnb, Cash App, Revolut, Material, Apple):
```
Title ("Log in or sign up")
[Mode switch: Phone | Email]      optional, swaps keyboard
[ +1 flag | Phone number ]        52 to 56 tall, 16px text, floating or inside label
Escape link / consent text right under the field
[ Continue ]  full width, 48 to 52 tall
---- or ----  social / passkey buttons
```

## Spacing and type conventions observed
| Product or system | Element | Value | How known | Link |
|---|---|---|---|---|
| Stripe Dashboard (1440) | Input height / text | 40px / 14px; password 44px / 16px | measured with getComputedStyle | [register](https://dashboard.stripe.com/register) |
| Stripe Dashboard (1440) | Label to input; input to next label | about 9px; 17px | measured (bounding boxes) | same |
| Stripe Dashboard (390) | Input text | 16px | measured | same |
| Stripe Dashboard | Submit height | 36px, full width 383px | measured | same |
| Carbon | Input height | 40px | stated in docs | [forms pattern](https://carbondesignsystem.com/patterns/forms-pattern/) |
| Carbon | Gap between fields | 32px page, 16 to 24px in modal or side panel | stated in docs | same |
| Carbon | Last field to button | 48px | stated in docs | same |
| Atlassian | Field widths | 75, 150, 250, 350, 500px | stated in docs | [forms](https://atlassian.design/patterns/forms/) |
| Material 3 | Text field height | 56dp; 16dp side padding; 4dp above supporting text | stated in docs | [specs](https://m3.material.io/components/text-fields/specs) |
| Airbnb (390) | Field / button | 55px field, 16px text; 48px button, 12px radius | measured | [login](https://www.airbnb.com/login) |
| Cash App (390) | Phone field | 52px tall, 16px text, 8px radius, 112px left padding for country code | measured | [login](https://cash.app/login) |
| Revolut (390) | Field / button | 56px field, 16px; 52px pill button | measured | [start](https://app.revolut.com/start) |
| Calendly (1440) | Email field / button | 48px / 50px, 16px text | measured | [signup](https://calendly.com/signup) |

## Mistakes they avoid
- **Errors while typing the first time.** Shopify: "Avoid showing an error while merchants are typing ... Wait until the keyboard focus moves away." Airbnb goes further and waits for submit. [shopify.dev alerts](https://shopify.dev/docs/apps/design/user-experience/alerts.md)
- **Browser-native validation bubbles.** Primer: they "are not accessible to screen readers, and they visually clash." Stripe and Airbnb render their own errors. [Primer forms](https://primer.style/product/ui-patterns/forms/)
- **Helper text and error stacked**, which pushes the layout down. Material 3 and Primer swap one for the other.
- **One validation message per checkbox.** Primer: show one message for the group, not each input.
- **Errors left after the fix.** Polaris inline error: "Be removed as soon as the input is valid." [Polaris inline error](https://polaris-react.shopify.com/components/selection-and-input/inline-error)
- **Wrong keyboard.** Cash App and Revolut set `tel` or `numeric` input modes; Airbnb's combined field opens the email keyboard, which has both @ and digits (opinion: a sensible compromise for a dual field).
- **A disabled submit with no reason.** Stripe and Cash App still do this (opinion: the one place these strong products fall short of Atlassian and Primer).

## Products to look at
- Stripe Dashboard sign-up: blur validation, strength meter, 14 to 16px mobile switch. https://dashboard.stripe.com/register
- GitHub Primer forms pattern: the clearest written timing rules and the error summary rule. https://primer.style/product/ui-patterns/forms/
- Shopify Polaris inline error and app forms guidance: error copy and save bar. https://polaris-react.shopify.com/components/selection-and-input/inline-error and https://shopify.dev/docs/apps/design/user-experience/forms
- IBM Carbon forms pattern: spacing numbers for page, modal and side panel forms. https://carbondesignsystem.com/patterns/forms-pattern/
- Airbnb login (mobile width): combined phone or email field, error state. https://www.airbnb.com/login
- Cash App login (mobile width): live phone formatting, mode switch that swaps keyboards. https://cash.app/login
- Revolut sign-in (mobile width): split country code, recovery link under field. https://app.revolut.com/start
- Material 3 text fields and Apple HIG text fields: mobile field anatomy and validation timing. https://m3.material.io/components/text-fields/guidelines and https://developer.apple.com/design/human-interface-guidelines/text-fields
- Mobbin links pending: connector needs a paid plan.

## Gap: average vs best in class
An average product validates on every keystroke from the first character (or only on submit with a generic banner), stacks red text under grey hint text, uses one input size everywhere and opens the default keyboard for phone numbers. The best wait for blur, go live only to clear errors, swap hint for error with an icon, summarize only when there are 3 or more errors, format phone numbers as typed and raise input text to 16px on phones. Gap score 3 of 5 (opinion): the rules are well published, so the gap is execution detail rather than missing knowledge.

## Screenshots
| Path | Shows | Source URL | Owner | Captured |
|---|---|---|---|---|
| shots/06-forms-and-validation/stripe-signup-inline-validation.jpg | Blur error on email with icon, "Too weak" strength meter, disabled Create account | https://dashboard.stripe.com/register | Stripe | 2026-10-10 |
| shots/06-forms-and-validation/airbnb-login-error-mobile.jpg | Submit error on combined phone or email field, tinted field, icon, consent text | https://www.airbnb.com/login | Airbnb | 2026-10-10 |
| shots/06-forms-and-validation/cashapp-phone-field-mobile.jpg | Phone or Email segmented switch, +1 country code inside field, dimmed Continue | https://cash.app/login | Block (Cash App) | 2026-10-10 |
| shots/06-forms-and-validation/revolut-phone-country-code-mobile.jpg | Split country code and phone fields, recovery link under the field | https://app.revolut.com/start | Revolut | 2026-10-10 |
