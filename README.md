# Landing-v3 fortify (delta only)

## Live findings
- `build()` removes `#clarity-day-landing` then rebuilds once (`__CDL_V12_BUILT__`)
- Does **not** dispatch `clarity:landing-ready`
- ~57KB JS; 5s salah countdown intervals (hidden-tab aware)
- Dayn was mounting outside root → easy to miss visually / order races

## This delta
1. `inline-clarity-landing-v3-fortify-v1.js` — stable `#clarity-landing-slot-dayn` inside landing + ready event
2. Dayn JS prefers that slot
3. Cache-bust via query on deploy

## Deploy only
```
assets/companion-inline/inline-clarity-landing-v3-fortify-v1.js
assets/companion-inline/inline-clarity-dayn-ledger-v1.js
```
Plus one index.html line to load fortify (if not already).

Optional perf later: defer landing-v3 with `defer`, lengthen countdown to 15–30s inside upstream file.
