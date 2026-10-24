# Legacy folders — delete guidance · 20261024JOURNEY

## Confirmed University → imported
- `journey/` → now `campus/journey/` (+ root stub redirect)

## Safe to delete AFTER redirects proven on live (wait 1–2 deploys)
| Folder | Reason |
|--------|--------|
| `craft/` | Lab double; `_redirects` + stubs → `/campus/lab/` |
| `journey/` content | Only after `/journey` 301 works; can leave stub index |
| `library/` (root) | Thin; use `campus/library/` — confirm Companion does not need `/library/` |
| `charter/` (root) | Duplicate of `campus/charter/` — optional consolidate |

## Do NOT delete
| Folder | Reason |
|--------|--------|
| `vault/` | Companion Amana |
| `assets/` | Shared Companion/University |
| Root Companion pages | index, adhkar, janazah, will tools, etc. |
| Full `lab/` assets immediately | Until splat redirects verified; station HTML already stubs |

## Never bulk-delete without
1. Live `_redirects` merged file deployed
2. Smoke `/lab` → `/campus/lab/`, `/journey` → `/campus/journey/`
3. Companion home still loads
