# Brief 06: Auth, row-level security and privacy

Question: who can see and change which rows, and how do I keep personal data lawful and safe?
After reading, the designer can: pick an auth approach, store sessions safely, write and test RLS policies that are correct and fast, keep secrets server side, and build privacy in (minimization, retention, export, erasure).
Must cover: buy auth, do not build it; NIST 800-63B rev 4 password rules; OWASP password hashing and session cookie settings; RLS default deny, per-operation policies, USING vs WITH CHECK, (select auth.uid()) performance numbers, index policy columns, TO authenticated, views and security_invoker, user_metadata trap, FORCE RLS, SET LOCAL with pools; Supabase publishable vs secret keys; Firebase rules anti-patterns; real incidents (Firebase 125M records 2024, CVE-2025-48757); GDPR Art. 5, 17, 25, 32; retention and deletion pipeline.
Test briefs: "Supabase app where users share projects with teammates"; "Delete my account" flow.
