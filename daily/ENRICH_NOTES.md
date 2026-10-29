# Daily · Final build (Phases 1–4)

Bismillah. Educational only — not a fatwa. Self-contained like Campus.

## Phases delivered
1. **Message alignment** — order: Banner → dual tiles → Now cue → Do this today → Adhkār → Farḍ check → post/sleep → light/protection → oath → maps → history → continuity
2. **Full adhkār** — morning + evening packs embedded from package `adhkar/data/*.json` (also shipped under assets/adhkar/)
3. **Stackable routines** — after farḍ dhikr · before sleep protection · today’s five farḍ mark-done
4. **Continuity** — streak, 7-day history, closing line tied to al-ʿAṣr / furnish the grave

## Architecture
```
/daily/
  index.html
  assets/
    daily-banner.jpg
    daily.css
    daily.js          ← all packs embedded (no network required)
    adhkar/
      morning.json
      evening.json
    icons/nuros-*.svg
```

## Smoke
- node --check daily.js OK
- DOM id cross-check OK
- Runtime eval with mock DOM OK
- No companion-inline dependency

## Non-goals (by design)
Live adhan, Qibla, full Quran app, accounts — stay on Companion / elsewhere.
