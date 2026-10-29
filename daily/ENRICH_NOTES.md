# Daily · isolated surface (campus-style) — Phase 2 polish

Bismillah. Educational only — not a fatwa.

## Architecture (self-contained like Campus)
```
/daily/
  index.html
  assets/
    daily-banner.jpg   ← cleaned, wider, no caption overlay
    daily.css
    daily.js
  ENRICH_NOTES.md
```

- No companion-inline scripts
- No deep `#reminder` / `#reality` links
- Only external navigation: dual tiles → Companion + Campus
- Shared device keys kept for continuity of deed / tasbeeh / streak

## Content imported from live day-landing pulse
| Block | Status |
|-------|--------|
| Banner (Furnish Your Grave) | Clean rectangular impact, caption removed |
| Dual path tiles | Strengthened plaque styling |
| Furnish your grave / Muslim 1631 | Present |
| Remember the long stay | Added this phase |
| Do this today + tasbeeh + streak | Present |
| Full morning/evening adhkār packs | Present |
| Wuḍūʾ 8 steps + Prayer 7 steps | Expandable |
| Send light ahead | Present |
| Core protection set | Present |
| Provisions map (7 lanes, today highlighted) | Present |
| Local theme toggle | Present |

## Intentionally left in Companion
Full Reminder tab (commands, hadith, Names), Vault registry UI, qaḍāʾ tracker, farḍ map, ṣawm/zakāt/ḥajj sections, banner media dock, Hijri calendar — those remain Companion tools. Daily owns the daily pulse only.

## Deploy
Replace entire `/daily/` folder with this package.

## Smoke
- [x] JS syntax
- [x] HTML structure
- [x] Banner clean (no white caption bar)
- [x] Dual tiles plaque form
- [x] “Remember the long stay” present
- [x] Self-contained (no companion-inline)
