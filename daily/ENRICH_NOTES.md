# Daily surface enrichment — Phases A–G

Bismillah. Educational only — not a fatwa.

## Source
- Package: Clarity-main (attached) · `assets/companion-inline/inline-clarity-landing-v3.js` + LANDING_PHASES.md
- Live form factor: https://clarity-dawah.fyi/daily/ (cdl-card, dual-tiles, shared device keys)

## What was ported

| Phase | Content | Where in enriched daily |
|-------|---------|-------------------------|
| A | Oath plaque + Muslim 1631 framing | `#cdl-oath` card |
| A | 7 grave-furniture provisions | `#cdl-today` deed (rotates by day hash) |
| B | Full morning / evening adhkār packs (6 each) with targets + refs | `#cdl-adhkar-list` |
| C | Wuḍūʾ 8 steps (expandable) | `#cdl-wudu` |
| D | Prayer 7 steps (expandable) | `#cdl-salah` |
| E | Send light ahead (knowledge / ṣadaqah / duʿāʾ) | `#cdl-light` |
| F | Mobile folds, full-width cards, dual-tile stack | CSS |
| G | Core protection set reminder | Protection card |

## Shared device keys (continuity with Companion)
- `clarity_provision_day_v1`
- `clarity_cph_tasbeeh_v1`
- `clarity_today_done_v1`
- `clarity_soft_streak_v1`
- `clarity_daily_adhkar_v1`
- `clarity_daily_history_v1`
- `clarity_send_light_v1`

## Deploy (only these paths)
```
/daily/index.html          ← replace
/daily/assets/daily.js     ← replace
/daily/assets/daily-form.css ← replace
```

Companion (`/`) and Campus (`/campus/**`) remain untouched.

## Smoke checklist
- [ ] Cold load: no console errors
- [ ] Deed rotates by calendar day; same key as Companion
- [ ] Morning vs evening adhkār switch by hour (≥15 or <4 = evening)
- [ ] +1 / reset tasbeeh persists
- [ ] Mark done → streak + 7-day history
- [ ] Expand wuḍūʾ / prayer; collapse again
- [ ] Send-light toggles persist for the day
- [ ] Dual tiles → `/` and `/campus/` only (no JS pull)
- [ ] Mobile: cards full width, no horizontal overflow
- [ ] All source refs + “educational only — not a fatwa” present

## Optional next (Phase B from package DAILY_PLAN)
- Companion “Day landing” pill becomes a link to `/daily/`
- Banner / next-salah plaque can move into daily later
