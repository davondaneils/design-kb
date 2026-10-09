# Research 05: States and bulk actions

Researcher, 2026-10-09. Access method and status codes as in research 01. Timing, error ladder and toast research lives in `kb/research/ux/04-states-feedback.md`.

## Key findings
1. Primer loading thresholds: under 1s no indicator; 1 to 3s indeterminate; 3 to 10s determinate if possible; over 10s determinate and non-blocking. Load collections item by item, most important data first.
2. Skeletons ("a vague representation of the content") for large areas; spinners in place or next to a message (Primer).
3. Empty states: never totally empty; communicate status, teach, give a direct path (NN/g). Primer: one primary action, brief non-redundant secondary text. Geist names four variants: blank slate, informational, educational, guide.
4. Degraded experiences (Primer): replace only the affected content, warning icon before the message, do not imply data loss, avoid many error messages, never disable a control for availability reasons.
5. Bulk actions: Carbon shows a batch action bar at the top when a row is selected and disables row-level actions meanwhile; Linear shows common bulk actions at the bottom and in Cmd/Ctrl+K and the context menu; Polaris uses verb plus noun labels and hides bulk actions only under 490px when not essential.
6. Linear selection: X on a highlighted row, Shift click and Shift arrows for ranges, Cmd/Ctrl A for all.

## Claim table
| ID | Claim | Quote (under 40 words) | URL | Tier | Status |
|---|---|---|---|---|---|
| B1 | No indicator under 1s | Under 1 second: "Don't show a loading state." | https://primer.style/product/ui-patterns/loading/ | 2 | P |
| B2 | Why | "Seeing a loading indicator flash on the screen could be distracting and make the product feel slower than it is." | https://primer.style/product/ui-patterns/loading/ | 2 | P |
| B3 | Over 10s | "Use a determinate loading state and avoid blocking other interactions." | https://primer.style/product/ui-patterns/loading/ | 2 | P |
| B4 | Show items as they load | "Whenever possible, show each item in a collection as soon as it loads." | https://primer.style/product/ui-patterns/loading/ | 2 | P |
| B5 | Most important first | "Whenever possible, prioritize the most important pieces of data to load first." | https://primer.style/product/ui-patterns/loading/ | 2 | P |
| B6 | Skeleton for large areas | "For large areas of loading content, the loading content may be replaced by a vague representation of the content." | https://primer.style/product/ui-patterns/loading/ | 2 | P |
| B7 | Never totally empty | "Do not default to totally empty states." | https://www.nngroup.com/articles/empty-state-interface-design/ | 3 | C |
| B8 | Direct pathways | "Provide direct pathways for getting started with key tasks." | https://www.nngroup.com/articles/empty-state-interface-design/ | 3 | C |
| B9 | One primary action | "Blankslates can and are encouraged to use one primary link or action." | https://primer.style/product/ui-patterns/empty-states/ | 2 | P |
| B10 | Brief secondary text | "Secondary text should be brief and non-redundant if possible." | https://primer.style/product/ui-patterns/empty-states/ | 2 | P |
| B11 | Geist blank slate | "The most basic empty state should convey the state of the view." | https://vercel.com/geist/empty-state | 2 | P |
| B12 | Geist guide variant | "Starter content that allows users to interact with data and learn the system by tinkering or setting up their environment" | https://vercel.com/geist/empty-state | 2 | P |
| B13 | Replace only affected content | "By default, replace the affected content with an error message." | https://primer.style/product/ui-patterns/degraded-experiences/ | 2 | P |
| B14 | Warning icon | "Show a warning icon before the message to help differentiate it from non-degraded content." | https://primer.style/product/ui-patterns/degraded-experiences/ | 2 | P |
| B15 | No implied data loss | "We don't want users to think they've suffered data loss." | https://primer.style/product/ui-patterns/degraded-experiences/ | 2 | P |
| B16 | Tone | "A page with too many error messages could communicate an unnecessarily reactionary and negative tone." | https://primer.style/product/ui-patterns/degraded-experiences/ | 2 | P |
| B17 | Carbon batch bar | "the batch action bar appears at the top of the table." | https://carbondesignsystem.com/components/data-table/usage/ | 2 | P |
| B18 | Row actions disabled in batch mode | "single action icons and overflow menus on the row should be disabled." | https://carbondesignsystem.com/components/data-table/usage/ | 2 | P |
| B19 | Bulk for frequent multi-item tasks | "Provide bulk actions for tasks that are often applied to many list items at once." | https://polaris-react.shopify.com/components/tables/index-table | 2 | P |
| B20 | Verb plus noun | "Follow the verb + noun formula for bulk actions" | https://polaris-react.shopify.com/components/tables/index-table | 2 | P |
| B21 | Hide bulk only under 490px | "We only recommend hiding bulk actions on screens smaller than 490px" | https://polaris-react.shopify.com/components/tables/index-table | 2 | P |
| B22 | Linear bulk bar at bottom | "Common bulk actions will show up at the bottom." | https://linear.app/docs/select-issues | 2 | P |
| B23 | Linear X to select | "Once an issue is highlighted, press `X` shortcut" | https://linear.app/docs/select-issues | 2 | P |
| B24 | Linear select all | "use Cmd/Ctrl A to select all issues on a board or list" | https://linear.app/docs/select-issues | 2 | P |
| B25 | Vercel: design all states | "Empty, sparse, dense, & error states." | https://vercel.com/design/guidelines | 2 | P |
| B26 | Loader show delay and minimum | "add a short show-delay (~150–300 ms) & a minimum visible time (~300–500 ms)" | https://vercel.com/design/guidelines | 2 | P |
| B27 | Optimistic with rollback | "On failure, show an error & roll back or provide Undo." | https://vercel.com/design/guidelines | 2 | P |
