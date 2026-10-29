# Daily · Phase 3 — banner, al-ʿAṣr, pillars, farḍ map

Bismillah. Educational only — not a fatwa.

## Phase plan (executed)
1. **Banner sleek** — re-crop scenic (Kaaba/quill), bottom caption removed, residual title quieted with soft upper gradient
2. **Sūrat al-ʿAṣr** — gold Naskh Arabic + Sahih International English overlay on banner
3. **Five pillars** — self-contained educational map (Shahāda · Ṣalāh · Zakāt · Ṣawm · Ḥajj) with NurOS icons
4. **Farḍ rakʿahs** — daily map of the five farḍ units (from live day-landing pulse)
5. **Campus model** — all assets under `/daily/`; no companion-inline dependency

## Architecture
```
/daily/
  index.html
  assets/
    daily-banner.jpg
    daily.css
    daily.js
    icons/nuros-*.svg
```

## Content now on Daily
- Full-width scenic banner + al-ʿAṣr plaque
- Dual path tiles (NurOS)
- Five pillars map
- Farḍ rakʿahs map
- Furnish your grave / Muslim 1631
- Remember the long stay
- Do this today + tasbeeh + streak
- Full morning/evening adhkār
- Wuḍūʾ 8 + Prayer 7 (expandable)
- Send light ahead
- Core protection
- Provisions map (7 lanes)
- 7-day history
- Local theme toggle

## Left in Companion
Reminder tab, Vault UI, qaḍāʾ tracker, media dock, Hijri calendar — by design.

## Deploy
Replace entire `/daily/` folder. Hard-refresh.
