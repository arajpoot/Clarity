# Smooth Flow upgrade (2026-10-05f)

## Errors found
1. **Section fighting** — `clarity-polish-wiring-v2.js` ran `openAllSections()` every **2s** on Da'i while `path-progress` re-applied filters (40ms + 180ms). Cards flickered / jerked.
2. **Banner plaques crushed** — nuclear CSS `max-height: 18rem` + fixed `148px` sides; mobile rule **hid** calendar/salah sides under 900px.
3. **Meme lag** — `memeDraw` reassigned many times in chunk-8; rapid chip clicks stacked full canvas redraws (no rAF debounce).
4. **Sentinel noise** — `claritySectionSentinel` on a 2s interval plus other callers.

## Fixes (phases)
| Phase | Change |
|-------|--------|
| 1 | Soft doors heal (timeouts + `clarity-path-changed` event) instead of 2s interval |
| 1b | Single delayed `applyPathFilter`; dispatch path-changed |
| 2 | Desktop plaque flex: sides grow with viewport (160→260→300px), `max-height: none`, plaques restored under 900px as row |
| 3 | `clarity-smooth-flow-v1.js` — rAF-debounce `memeDraw` (~40ms), throttle sentinel (≥1.5s) |

## Deploy
Upload full tree including **new** `assets/clarity-smooth-flow-v1.js` and updated:
- `clarity-css-patches-v1.css`
- `clarity-polish-wiring-v2.js`
- `clarity-path-progress-v1.js`
- `clarity-boot-orchestrator-v1.js`
- `index.html` (`?v=20261005f`)

Purge CDN. Hard-refresh desktop.
