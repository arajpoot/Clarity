# Daily-first landing — polished smoked build

Bismillah.

## Sandbox proof (not a stub)
Simulator: **Node `vm.Script`** with isolated context per cycle, real `eval`, navigation log via `location.href` setter.

| Cycles | Passed | Landing target |
|--------|--------|----------------|
| 12 | **12** | **`/daily/` only** |

Verified:
- First paint → `/daily/`
- Open daily routines CTA → `/daily/`
- `ClarityShell.setMode("landing")` → `/daily/`
- Already on `/daily/` → no loop
- Companion picked / section hash → no forced redirect
- Live `/daily/` returns **200** (Yawm page)

**Not** Reminder. **Not** Reality.

## Deploy
Replace root `index.html`. Hard-refresh (clear site data once if an old shell mode is stuck).

Yawm `/daily/` and Campus remain separate surfaces.
