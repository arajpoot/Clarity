# Daily · full-width embossed plaques + NurOS icons

Bismillah. Educational only — not a fatwa.

## Architecture (self-contained like Campus)
```
/daily/
  index.html
  assets/
    daily-banner.jpg
    daily.css
    daily.js
    icons/          ← NurOS v3 SVGs from companion pack
      nuros-*.svg
  ENRICH_NOTES.md
```

## This phase
- Banner full viewport width (edge-to-edge)
- Content column widened (up to 64rem on large screens)
- Every section converted to embossed plaque (inset highlight + depth shadow)
- NurOS icons applied: dual tiles, section heads, expanders
- Icons local under /daily/assets/icons — no companion dependency

## Icons used
companion · campus · kaaba · tree · today · tasbih · dua · water · salah · seed · shield · path · scroll

## Deploy
Replace entire `/daily/` folder. Hard-refresh to load new CSS + icons.
