# Phase 0–2 Simulation Report · Yawm Restore

**Bismillah.** Educational only — not a fatwa.  
Build: **20261104Y2R** · Pack: `yawm-restore-phase2`

## Simulation executed
| Phase | Action | Result |
|-------|--------|--------|
| 0 | Inventory package vs GitHub simplified vs live | Package is rich restore source; GitHub index is stripped; live still has partial richness |
| 1 | Foundation lock + isolation contracts | Locked: edit only `/daily/`, no companion-inline/craft, four doors, SoT stamp, isolation guard |
| 2 | Import enriched surface from package | Full `daily/` tree staged: banner, dual tiles, hub, CSS/JS, modules, data, icons, guard |

## Isolation verification (sim)
- No `companion-inline` or craft imports in `index.html` / `daily.js`
- `yawm-isolation-guard-v1.js` present
- Contracts present: YAWM_CONTRACT · FOUNDATION_LOCK · ROOM_LOCK · NAV_CONTRACT

## Critical path assets (present)
- `index.html` (enriched, banner + dual tiles + hub)
- `assets/daily-banner.jpg`
- `assets/daily.css` · `assets/daily.js`
- `assets/yawm-isolation-guard-v1.js`
- Modules: now · deed · adhkar · tasbeeh · salah · light

## Deploy instruction
Replace live site `/daily/` with the `daily/` folder from this pack.  
See `daily/DEPLOY.md` and `daily/SMOKE_PHASE02.json`.

## Status
**READY_FOR_DEPLOY** — smoked polish complete.
