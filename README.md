# Companion banner polish · Integrity BI1

Bismillah. Educational display only — not a fatwa. Verify ṣalāh with a local mosque.

## Deep scan findings
| Element | Problem |
|---------|---------|
| **#salah-times-list** | Stuck on `Loading…` — old repair looked for wrong selectors |
| **#temp-makkah / #temp-madinah** | Never filled by any script |
| **#hijri-cal-grid / meta** | Empty / ellipsis |
| **#hijri-local-time** | Stale placeholder |
| **AV / banner-media** | Overlay clicks can be blocked by media layer |

## Fix · `clarity-banner-integrity-v1`
- Hijri label + simple grid (Intl Islamic calendar)
- Temps via **Open-Meteo** (Makkah & Madinah)
- Ṣalāh list via **Aladhan** timingsByCity (default Makkah; `clarity_salah_city` in localStorage)
- Local clock tick
- Media `pointer-events: none` so plaques/controls stay clickable

## Deploy
```
index.html
assets/clarity-banner-integrity-v1.js   # optional; also inlined
```
Hard-refresh.

## Smoke
Salah list · temps · clock · hijri · `allOk: true` (mock APIs in sandbox)
