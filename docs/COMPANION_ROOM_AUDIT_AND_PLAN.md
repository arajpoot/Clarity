# Companion room audit & phased repair (2026-11-04)

Campus / daily / amana **untouched**.

## Form factor (live)

| Room | Path | Role |
|------|------|------|
| Door hub | `/` | Four doors chooser |
| **Companion** | `/companion/` | RRRA tools (Reminder · Reality · Reflection · Action · Notes · About) |
| Yawm / Daily | `/daily/` | Daily portion |
| University | `/campus/` | Campus (frozen) |
| Amānah | `/amana/` | Vault / dayn / heirs |

Companion is now a **room** (campus-like), with:
- `/companion/assets/*` room scripts (boot, spine a2 packs, banner, unity)
- Shared `/assets/companion-inline/*` and `/assets/clarity-core-block-8.js`
- Room nav: `/assets/room-nav/clarity-room-nav-v1.js`

## Broken wiring found

| # | Issue | Impact | Tabs |
|---|--------|--------|------|
| 1 | **Perf-loader CORE path is relative** `assets/clarity-core-block-8.js` → resolves to `/companion/assets/…` **404** | Theme, many handlers, hydration stay soft | All |
| 2 | Core not in HTML as absolute URL; depends on broken relative load | `switchTab` / advanced APIs late or missing | All |
| 3 | Boot v2 forces `shell-mode=companion` and `__CLARITY_SKIP_DAY_LANDING__` | Day landing skipped (OK for room; daily is `/daily/`) | — |
| 4 | Dual stack: a2 spine **and** legacy companion-inline | Race / double init risk | Reality (meme), Action |
| 5 | `clarityPickPrimaryDoor` / `resetToGateView` may 404-logic to old root SPA | Door buttons leave room incorrectly if undefined | Banner/welcome remnants |
| 6 | Heavy onclick surface (233+) without guaranteed core | Soft failures until spine loads | Reminder, Reality |

Asset HEAD probes: room scripts and a2 packs **200**. Core at `/assets/clarity-core-block-8.js` **200**; at `/companion/assets/…` **404**.

## Phased plan

### Phase 0 — Core path integrity (implemented)
- Absolute load `/assets/clarity-core-block-8.js`
- Early stubs: theme, switchTab, meme*, surah, doors
- Dispatch `clarity-core-ready`
- Room guard: skip campus/amana

### Phase 1 — Tab integrity (implemented)
- Ensure `switchTab` + bottom nav binding
- Restore last tab from localStorage
- Re-bind on core/spine ready

### Phase 2 — Banner / ṣalāh / stream (next)
- Single banner control owner (n34 vs craft vs sleek)
- Absolute API paths only

### Phase 3 — Reality craft (meme / calligraphy)
- Prefer a2 chunk-8 + meme bridge; kill duplicate legacy meme inlines if conflict

### Phase 4 — Path / gates
- Path plaques only; no welcome 4-track poll in companion room

### Phase 5 — Smoke matrix
- Each tab: open, no console throw, primary CTA works
- Room nav: Companion ↔ Daily ↔ Campus ↔ Amānah
- Campus HTML bytes unchanged

## Deploy
Upload `companion/index.html` + `companion/assets/companion-core-path-fix-v1.js` + `companion-tab-integrity-v1.js`. Purge CDN. Hard refresh `/companion/`.
