# Companion room Phases 2–4 (2026-11-04)

Other rooms **untouched**.

## Source map scanned
- `companion/assets/` — boot, unity, banner*, spine, craft
- `companion/assets/a2/` — overlays, chunk-8, feature, path, aux
- `companion/assets/boot/` — mirrored companion-inline copies
- `/assets/` + `/assets/companion-inline/` — shared

## Problem
Banner/live controllers (n34, av, integrity, craft, sleek, unity-v1) were left as `type="text/plain"` (stripped). Only unity-v2 ran — weak live control. Meme APIs raced spine. Track bar still present without plaque icons guarantee.

## Delivered
| Phase | File | Role |
|-------|------|------|
| 2 | `companion-banner-owner-v2.js` | Sole still/live + side layout |
| 3 | `companion-craft-phase3-v1.js` | memeFetchBg / RRRA / daily verse fallbacks |
| 4 | `companion-path-phase4-v1.js` | Path plaques + icons; hide TRACK |

## Deploy
Upload under `/companion/` only:
- `index.html`
- `assets/companion-banner-owner-v2.js`
- `assets/companion-craft-phase3-v1.js`
- `assets/companion-path-phase4-v1.js`
(+ keep phase 0–1 core-path + tab-integrity)

Purge CDN → hard refresh `/companion/`.
