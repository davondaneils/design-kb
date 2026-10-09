# Brief: States and feedback

## Question it answers
What does every view show when it is empty, loading, partially loaded, failed, succeeded, offline or overloaded with content?

## After reading, a designer can decide
- Which loading treatment fits a wait (none, skeleton, spinner, progress bar with estimate), with time thresholds and anti-flicker timing.
- What an empty state contains for first use, cleared state and no results.
- How to present errors by severity: inline, banner, toast, dialog, full page.
- When to use toasts, and how long they stay.
- How to design optimistic updates, undo windows and long-running or AI tasks.

## Must cover
- NN/g progress indicator, skeleton screen, empty state and error message guidelines.
- Vercel Web Interface Guidelines on loading timing, optimistic updates, ellipses, states (practitioner).
- Apple HIG alerts and loading.
- WCAG 2.2.1 timing and 4.1.3 status messages (aria-live).
- Nielsen's intent and AI UX guidance for slow, agentic tasks.

## Test briefs it should pass
- "Dashboard state design for an analytics app."
- "Design the 'generate report' flow that takes 30 to 90 seconds."
