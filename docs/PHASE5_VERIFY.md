# Phase 5 verification (2026-11-04)

## Live crawl
- Port University tile → `/campus/` ✓
- Campus `data-clarity-room="university"` ✓
- Rail `is-here` on University only (not Companion) ✓
- `university-path-markers-v1.js` live + `fixNavHere` ✓

## Known non-blocker (sev 2)
Campus HTML still loads many `/companion/assets/*` scripts (historical shared shell).  
Does **not** mis-mark the University door. Full shell separation is a later isolation epic, not Phase 5 content cut.

## Package
Polished campus `index.html` + markers JS; isolation note; nav boot fix.
