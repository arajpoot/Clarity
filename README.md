# Daily-first landing HARDENED v3

## Live problem found
Daily-first v2 ran **at end of body**. Before it ran:
1. micro-boot set shell `landing`
2. freeze-breaker saw no day-landing host → forced **companion** + `user_pick=1`
3. v2 then treated that as “user chose companion” → **skipped `/daily/`**

So landing never reached Daily on a real browser.

## Fix
1. **EARLY** script in `<head>` (before micro-boot / freeze-breaker):
   - On `/` with no section hash and no explicit `clarity_landing_dest_v1=companion` → `location.replace("/daily/")`
2. **LATE** script for CTAs + `ClarityShell.setMode("landing")` → `/daily/`
3. Companion skip only when **dest === companion** (not mere pick flag)

## Sandbox (vm.Script) · 10/10
Including “freeze pick alone still daily” — **pass**.

## Deploy
Replace root `index.html`. Hard-refresh. Clear site data once if old session dest blocks you.
