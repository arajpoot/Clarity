# Daily · isolated surface (campus-style) — polished build

Bismillah. Educational only — not a fatwa.

## Architecture (like Campus)
```
/daily/
  index.html
  assets/
    daily.css          ← self-contained theme + plaques
    daily.js           ← all logic, no companion pull
    daily-banner.jpg   ← Furnish Your Grave banner
  ENRICH_NOTES.md
```

- **Isolated**: no companion-inline scripts, no deep `#reminder` pills.
- Only external links: dual tiles → `/` (Companion) and `/campus/`.
- Shared device keys kept so deed / tasbeeh / streak continue if user also opens Companion.

## Content map
| Section | Source |
|---------|--------|
| Banner | Extracted from provided “Clarity – Furnish Your Grave” artwork |
| Oath plaque | Muslim 1631 framing (Phase A) |
| Do this today + tasbeeh + streak | Provisions + shared keys |
| Full adhkār packs | Phase B (morning / evening auto) |
| Wuḍūʾ 8 steps | Phase C (expandable) |
| Prayer 7 steps | Phase D (expandable) |
| Send light ahead | Phase E |
| Core protection | Phase G |
| Provisions map | Surprise — all 7 lanes, today highlighted |
| Local theme toggle | Surprise — dark/light, stored only for Daily |

## Deploy
Replace entire `/daily/` folder (or the four files under it).

## Smoke checklist
- [x] Banner loads
- [x] Theme toggle persists
- [x] Deed rotates by day; Mark done → streak + history
- [x] Adhkār morning/evening switch
- [x] Expanders open/close
- [x] Send-light toggles
- [x] Provisions map highlights today’s lane
- [x] No companion JS required
- [x] Dual tiles only external navigation
- [x] Mobile: single column, no overflow
