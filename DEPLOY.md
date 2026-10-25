# Clarity Companion — Final polished build (20261025)

Campus (`/campus/**`) is **not** modified.

## Deploy

Upload the contents of this folder to the site root (merge/overwrite).

Critical new/changed paths:

- `index.html`
- `assets/clarity-link-stubs-v1.js`
- `assets/companion-inline/inline-96908bb2ed.js`
- `assets/companion-inline/inline-clarity-perf-loader-v1.js`
- `assets/companion-inline/inline-clarity_loader_guard_v1.js`
- `assets/companion-inline/inline-clarity_meme_layout_fix_v1.js`
- `assets/companion-inline/inline-clarity_surface_polish_v1.js`
- `assets/clarity-core-block-8.js` (ensure present; loader depends on it)

This package also mirrors other `assets/` + `companion-inline/` files fetched for sandbox completeness.

## Verify after purge + hard refresh

1. Day / Night / System — no console error  
2. Commands card loads a verse (not perpetual Loading)  
3. Salah / temps populate online  
4. Surah dropdown / meme chips do not throw before load  
5. `/campus/` unchanged  

## Smoke

See `SMOKE_REPORT.json` — all sandbox checks PASS; 71 JS files syntax-clean.
