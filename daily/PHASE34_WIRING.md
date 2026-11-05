# Phase 3 · Wiring & Polish · Phase 4 · Deploy Simulation

**Bismillah.** Educational only — not a fatwa.  
Build: **20261104Y2R**

## Phase 3 — Wiring completed
- Theme toggle already in `daily.js` (`clarity.daily.theme.v1`); added `assets/yawm-theme-v1.js` as self-contained fallback.
- Isolation guard path made **relative** (`assets/yawm-isolation-guard-v1.js`) so it works under `/daily/` without absolute dependency.
- All module links remain relative (`modules/now/` etc.).
- Dual tiles + room nav four doors point to `/companion/`, `/daily/`, `/campus/`, `/amana/`.
- Shared `/assets/nuros/nuros-type-icons-v1.css` kept (site-wide); all Yawm-specific assets are under `daily/assets/`.
- No companion-inline, no craft, no campus desk JS.

## Phase 4 — Deploy simulation (local)
Because this agent cannot push to Cloudflare/GitHub, Phase 4 is simulated as a final package verification:

1. Critical assets present (banner, CSS, JS, guard, 6 modules) — PASS
2. Isolation clean — PASS
3. Build stamp consistent `20261104Y2R` — PASS
4. DEPLOY.md + smoke checklist present — PASS
5. Package is drop-in replacement for live `/daily/` — PASS

## Live deploy (operator)
1. Backup live `/daily/`.
2. Unzip and copy `daily/` contents over live `/daily/`.
3. Purge CDN / hard refresh.
4. Run smoke checklist in DEPLOY.md.
5. Confirm Network tab shows only daily assets + optional shared nuros/room-nav.

Campus / Amānah / Companion core untouched.
