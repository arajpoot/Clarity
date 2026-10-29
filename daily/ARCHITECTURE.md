# Daily surface — isolation contract (Campus pattern)

Bismillah. Educational only — not a fatwa.

## Principle
`/daily/` is a **self-contained surface**, same model as `/campus/`.
It must run after a full folder replace with **zero** dependency on Companion inline scripts or Companion asset paths.

## Required layout (every successive build)
```
daily/
  index.html
  ARCHITECTURE.md
  ENRICH_NOTES.md
  assets/
    daily.css
    daily.js
    daily-banner.jpg
    adhkar/
      morning.json
      evening.json
    icons/
      nuros-*.svg
```

## Rules for successive builds
1. **Ship the whole `daily/` folder** — never patch single files into Companion root.
2. **Relative assets only** — `assets/...` from `index.html`. No `companion-inline`.
3. **Own localStorage keys** under `clarity.daily.*`.
4. **External links only** to `/` and `/campus/`.
5. **Content packs embed in `daily.js`** (JSON mirrors optional under assets/adhkar/).
6. **Disclaimers** on practice cards: educational · not a fatwa.
7. **Smoke**: `node --check assets/daily.js`; grep `companion-inline`; zip extracts to top-level `daily/`.

## Zip convention
Extract yields `daily/index.html` + `daily/assets/...`.
Deploy = replace site `/daily/` entirely.

## Out of scope on Daily
Live adhan, Qibla, full Quran app, Vault UI, accounts, Companion rails.
