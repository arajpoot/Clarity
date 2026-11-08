# Clarity Port — Full P0–P3 deploy package

**Bismillah.** Educational only — not a fatwa.

You do **not** need to edit HTML by hand. Upload as mapped below.

## Contents

| Phase | Feature |
|-------|---------|
| **P0** | Inventory freeze · enrichment-only · rooms untouched |
| **P1** | Trust strip (Local-first · On this device · Not a fatwa · Verify…) |
| **P1b** | Door registry — last entered date/time on each tile |
| **P2b** | Visit notepad — optional, timestamped, **not Amānah** |
| **P3** | How the castle works — Arrive → Choose a door → Verify |

## Upload map

```
/index.html                              ← Port homepage (already wired)
/assets/port-trust-strip-v1.css
/assets/port-trust-strip-v1.js
/assets/port-door-registry-v1.css
/assets/port-door-registry-v1.js
/assets/port-visit-notes-v1.css
/assets/port-visit-notes-v1.js
/assets/port-how-castle-v1.css
/assets/port-how-castle-v1.js
```

If Port is not site root, replace **your Port HTML file** with `index.html` from this zip; keep all files under `/assets/` as named.

## After upload — checklist

1. Hard-refresh Port  
2. Trust pills under hero  
3. “How the castle works” (3 steps) above room tiles  
4. Each door: Not yet entered / Last entered  
5. Visit notes under tiles (not Amānah)  
6. Enter a room, return — stamp updates  

## Storage (this device only)

- `clarity.port.doorRegistry.v1`  
- `clarity.port.visitNotes.v1`  

## Governance

- Enrichment only  
- Companion / Yawm / Amānah / Campus / Craft **untouched**  
- Not a fatwa · not legal advice · formal trusts stay in Amānah  

## Rollback

Restore previous Port HTML and delete the eight `/assets/port-*` files listed above.
