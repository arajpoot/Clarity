# PORTSMOKE audit · multi-cycle simulation

**Bismillah.** Educational only — not a fatwa.

## Live baseline (pre-deploy)
- Root still **PORTPOLISH-20261116** (no classic/write assets yet)
- `POST /api/feedback` → **`{"ok":true,"channel":"email_binding"}`** (Write path live)
- `port-visit-notes-v1.js|css` already **200** on `/assets/`
- Intro video **200** (~3.5 MB)
- Room tour MP4s still **404** (repair falls back to intro — expected)

## Bugs found & repaired

| ID | Issue | Repair |
|----|--------|--------|
| C6 | Visit notes JS-only → FOUC / mount fail | **SSR** `#port-visit-notes` shell + hydrate |
| C7 | Write to Clarity JS-only | **SSR** `#port-write-clarity` shell + hydrate |
| C3 race | Write mounted before visit | SSR both + write retries at 50/500/1200ms |
| Tour attrs | Fortify expects `data-tour`/`data-src`; HTML had `data-room`/`data-tour-src` | **Both sets** on every ▶ Tour |
| Write hang | No fetch timeout | **12s AbortController** + Copy/Mail fallback |
| Double-wire | Re-runs could bind twice | `data-pvn-wired` / `data-pwc-wired` guards |

## Smoke gates (all PASS / GREEN)
G1 port room · G2 SSR visit · G3 SSR write · G4 feedback API path · G5/G6 hydrate · G7 Yawm center · G8 tour parity · G9 edu stamp · G10 no companion-inline · G11 classic CSS · G12 write retry boot

## Feedback API cycle
- OPTIONS → 204  
- POST educational smoke message → `ok: true`

## Deploy order
1. Upload all `/assets/*` from pack  
2. Replace root `index.html`  
3. Hard refresh  

Educational only — not a fatwa.


## Pre-deploy final cycle (2026-11-18)
- Live baseline still PORTPOLISH — expected until this pack ships
- Feedback API POST/OPTIONS **pass**
- Package gates **FAIL_COUNT 0 · GREEN**
- Only WARN: room-specific tour MP4s missing (intro fallback)
- Deploy order: **assets first**, then root `index.html`, then hard refresh
- New assets not yet on CDN: `port-classic-plaques-v1.css`, `port-write-to-clarity-v1.js` (must upload)
