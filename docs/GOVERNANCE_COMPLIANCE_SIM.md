# Room-nav bump · governance simulation · 20261104C10

## Contract sources
- `ARCHITECTURE.md` — four isolation doors; shared room-nav; no cross-room module imports
- `amana/NAV_CONTRACT.md` — Amānah internal doors; four-room chrome wording

## Soft Craft (allowed)
- Craft is a **chrome tile only** on the shared rail (soft fifth surface).
- Isolation domains remain: Companion · Yawm · University · Amānah.
- Room-nav must **upgrade in place**, never add a second `.clarity-room-nav` when one exists.
- No Craft script may import Amānah dayn/passphrase mutators or Yawm SoT.

## Simulation results

| Room | Nav before | After upgrade | Simple rail | Second rail? | Isolation smells |
|------|------------|---------------|-------------|--------------|------------------|
| Amānah | 4 links + seal | + Craft, seal → Five rooms | rich | no | none |
| Campus | 4 links + seal | + Craft | rich | no | none |
| Companion | 4 links | + Craft | rich | no | none (version bump only) |
| Yawm | 4 text links | + Craft text pill | **simple `.top`** | no | amana links are **pointers** only (compliant) |

## Script rules verified
- Single `clarity-room-nav-v1.js` include per index
- Cache-bust `?v=20261104C10` on all four
- Yawm: script **added** (was missing — root cause of missing Craft pill)
- Guard `__CLARITY_ROOM_NAV_V1_C10__` + idempotent craft insert
- `ensureNav`: upgrades all existing rails; creates only if zero rails

## Not changed (by design)
- Four-door isolation boundaries
- Amānah internal NAV_CONTRACT paths
- No Phase D Companion craft decommission

Educational only — not a fatwa.
