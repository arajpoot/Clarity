# Companion patch · Daily nav pills v1

Streamlines the path controls into one straight pill row:

| Pill | Action |
|------|--------|
| **Day landing** | On-page plaque mode (existing shell) |
| **Daily page** | Primary pill → `/daily/` isolated surface |
| **Companion** | Companion tools on this page |
| **Campus** | → `/campus/` |

## Install
1. Copy `inline-clarity-daily-nav-pills-v1.js` into Companion’s companion-inline (or site assets).
2. Load it **after** day-shell / reopen-bar scripts (end of body is fine).
3. Hard-refresh Companion root.

Does not modify Daily folder. Daily remains Campus-isolated at `/daily/`.
