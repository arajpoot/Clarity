# Phase A — Offline baseline + Castle Port

## Delivered
- `index.html` — Castle Port with five room towers + short inventory
- `sw.js` — per-room cache buckets (`clarity-*-v20261106A1`)
- Precache: `/`, `/daily/`, `/companion/`, `/campus/`, `/amana/`, `/craft/`, port CSS/JS
- Network-first HTML; cache fallback offline
- Online/offline chip + SW register on Port

## Enrichment hold
Companion educational modules not thinned in this phase.

## Offline test checklist
| Room | Check | Pass? |
|------|--------|-------|
| Port | Castle loads offline after first visit | |
| Yawm `/daily/` | Shell loads offline | |
| Companion | Opens; static reminder if previously visited | |
| Campus | Shell offline after visit | |
| Amānah | Desk shell offline | |
| Craft | Shell offline | |
| PWA | SW registers; chip shows PWA ready | |

## Deploy
Upload to site root:
- `index.html` (replaces Port)
- `sw.js` (replaces SW)
- `assets/port-castle-v1.css`
- `assets/port-castle-v1.js`

Hard-refresh; visit each room once online; then airplane mode retest.


## Binding governance (Phases B–D+)

`GOVERNANCE_CONTRACT.md` ships with Phase A and is **binding** on all later phases.

- Enrichment hold: **Port + Companion + Yawm + Campus + Amānah + Craft**
- Phase exit requires enrichment smoke for all rooms after SW/root changes
- Default for infrastructure: `enrichment: held` unless documented migration/addition
