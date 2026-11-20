# U32CALM · Hub calm (curriculum back on desk)

**Problem:** `boot.js` on `/campus/` loaded all colleges → Junior curriculum painted above the gate.

**Fix:** Remove vault boot from campus landing. Curriculum stays on `/campus/desk/seeker|practice|…` via surface loaders (U28S).

1. Upload `campus/index.html` only (critical)
2. Optional: `campus/assets/js/cu-hub-calm-v1.js` (already inlined in index)
3. Hard refresh `/campus/`

Smoke: Gate + banner first · no Junior curriculum block · no integrity noise · desk seeker still has modules
