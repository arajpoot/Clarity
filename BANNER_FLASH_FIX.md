# Banner flash — diagnosis & fixes (phased)

## Phase A — Confirmed present
- Banner HTML still in `index.html` (not in assets)
- Contains: bismillah, h1 Clarity On-device, rabbana, stream-controls
- Assets only hold deferred JS modules

## Phase B — Root causes of “flash then gone”
1. **CSS collapse**: `.banner { min-height: 0 }` + `overflow: hidden` + absolute `.banner-media` → height could clip to stream-controls only
2. **Mobile ≤900px**: `.banner-side { display: none }` (calendar/salah) — expected; center must grow
3. **Auto-scroll on boot**: Track OS / section scripts call `scrollIntoView` shortly after load → jumps past banner to purple section strips (Reminder / seerah mirror / Action)
4. **Deferred JS (chunk-8)**: Relabels Live→Stills; does not delete banner

## Phase C — Fixes in this package
1. Banner permanence CSS (min-height 260px mobile / 180px desktop, overflow visible, center forced visible)
2. Banner lock script: force visible styles + block non-banner `scrollIntoView` for ~1.5s after load + scrollTo(0)
3. Track OS first-scroll soft guard

## Phase D — Deploy
Re-upload `index.html` + `assets/clarity-track-os-v3.js` (or full zip). Purge CF cache.
