# Companion freeze repair · 10-pass integrity

Bismillah. Yawm & Campus untouched.

## Causes addressed
1. **Shell landing freeze** — mode `landing` hides `#main-content` while day-landing host is missing → blank/frozen UI.
2. **Dayn Reality leak** — ledger fallback mounted into `#main-content` (fixed sealed module).
3. **UI thrash** — gates / `shell-landing-hide` / `pointer-events` left main non-interactive.

## This package
| File | Role |
|------|------|
| `index.html` | Inline **unfreeze** + **dayn contain** + **freeze-breaker** (10 timed passes + MutationObserver) |
| `vault/sealed/dayn-ledger-v2.js` | Dayn mounts **only** inside `#clarity-day-landing` |

## Simulation (10 cycles)
All passes: mode `companion`, main `display:block`, integrity **allOk: true**.

## Deploy
1. Replace root `index.html`
2. Replace `vault/sealed/dayn-ledger-v2.js`
3. Hard-refresh (clear site data if still stuck once)

Bottom tabs Reminder → Reality → Reflection → Action → Amana should remain interactive.
