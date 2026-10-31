# Daily-first landing v2

**Landing = `/daily/`** — not Reminder, not Reality.

## Behavior
| Action | Result |
|--------|--------|
| First visit / shell mode `landing` | → `/daily/` |
| Open daily routines / Day landing CTA | → `/daily/` |
| `ClarityShell.setMode("landing")` | → `/daily/` |
| User opens Companion path | stays on Companion |
| Hash `#reminder` / `#reality` etc. | stays (explicit section) |
| Already on `/daily/` | no redirect loop |

## Deploy
Replace root `index.html`. Hard-refresh (clear site data once if old v1 forced Reminder).
