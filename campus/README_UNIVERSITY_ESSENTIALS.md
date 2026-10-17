# Clarity University essentials — full phase package
Build: **20261017UNI8**

## Companion
**Not modified.** No root `index.html` or Amana/Companion scripts in this package.

## Phases delivered
| Phase | Status |
|-------|--------|
| U0 Inventory | `U0_INVENTORY.json` |
| U1 Shell | `campus.css` + `campus.js` |
| U2 Landing | `index.html` |
| U3 Faculty | `faculty.html` + roster fetch |
| U4 Phase desk | `phase-desk.html` |
| U5 Bots | `bots.html` + worker bridge |
| U6 Grading | `grading.html` |
| U7 Wiring | Shared nav · `cu_uni_*` · worker load |
| U8 Package | This zip |

## Workers
`campus.js` loads (when present on site):
- faculty-controller, staff-dispatcher, nur-workers-arsenal, staff-ops-monitor
- security-auditors, om-controller, it-controller

Beacons light when APIs appear. Bots degrade to local guided messages offline.

## Storage
`cu_uni_progress_v1`, `cu_uni_day_note_v1`, `cu_uni_bots_v1` only.

## Upload
Unzip so files live at `/campus/index.html`, `/campus/campus.js`, etc.
Keep existing `/assets/curriculum/vault/admin/**` on the server for reactivation.
