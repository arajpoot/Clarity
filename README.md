# Dayn v2 mount fix (delta)

Live issue: vault uses `.amana-vault-interior` / `#amana-family-tree-lite` / `#ahr-debts` — not `#tab-amanah`.
Landing needs host **inside** `#clarity-day-landing`.

## Deploy only
- assets/companion-inline/inline-clarity-dayn-ledger-v2.js (NEW)
- assets/companion-inline/inline-clarity-landing-v3-fortify-v1.js (if not already)
- assets/css/clarity-dayn-ledger-v1.css (if not already)
- index.html: add v2 script (see INDEX_SNIPPET.txt); can leave v1 or remove to avoid double UI

Prefer **only v2** script tag to avoid duplicate cards.
