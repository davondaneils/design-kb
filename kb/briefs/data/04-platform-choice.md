# Brief 04: Choosing the data platform

Question: Postgres, SQLite, Firestore, Supabase, Firebase, Convex, or something else?
After reading, the designer can: pick a platform from the data shape, team, and risk profile, and know the exit cost.
Must cover: relational is the default for business data (Kleppmann on many-to-many); when documents win; SQLite thresholds from sqlite.org; hosted Postgres (Supabase) features and free-tier limits; Firestore limits (1 MiB doc, hotspotting, index fanout); BaaS lock-in and rules risk; what to check before choosing (backups, PITR, region, pricing cliffs).
Test briefs: "Realtime collaborative whiteboard"; "Marketplace MVP on a weekend".
