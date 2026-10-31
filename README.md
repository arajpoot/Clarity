# Companion Phases 1–4 · Surface Authority SA1

Bismillah. Educational only — not a fatwa.

## What changed

### Phase 1 — Single authority
- Removed competing inlines: landing-unfreeze v1, freeze-breaker, companion-unfreeze v2, link-rescue v3
- **One** controller: `clarity-surface-authority-v1`
- `ClarityShell.setMode("landing")` → `/daily/` (no in-page landing trap)
- Body default: `data-active-tab="reminder"` (not `journey`)

### Phase 2 — Tab & main first paint
- Authority opens hash tab or **reminder**, shows `#main-content`, pointer-events auto
- `daily-isolate-js` **neutralized** — never forces `#clarity-day-landing` in companion mode
- Single `clarityOpenSectionDoor` / `ClaritySurface.openTab`

### Phase 3 — Gate ghosts
- Removes/kills `#landing-gate-screen`, welcome overlays
- Hides in-page day-landing under companion mode
- `resetToGateView` → reminder (no gate trap)
- Scrubs Dayn outside vault

### Phase 4 — Paths
- Static remap: seerah/tafseer/tajweed/lectures/meme/commands/fiqh → Campus or Companion
- Runtime path wire for remaining anchors
- Daily / Campus label hrefs normalized

## Deploy
Replace root **`index.html`** (authority is **inline** — no extra asset required).  
Optional: also upload `assets/clarity-surface-authority-v1.js` as backup copy.

Hard-refresh + clear site data once.

## Smoke
| Gate | Result |
|------|--------|
| Static phase 1–4 | **PASS** |
| Runtime 12 tab cycles | **12/12** |
| Integrity | **restored** |
