# Yawm NAV_CONTRACT

## Outward (allowed)
- `/` Companion
- `/campus/` University
- `https://quran.com/*`
- `https://sunnah.com/*`
- Optional prayer-time API from device location (cue only — not a mosque timetable)

## Inward (forbidden)
- No script `src` to `/assets/companion-inline/*`
- No script `src` to Companion provision / landing-v3 / vault unlock bundles
- No shared DOM ids with Companion day-landing controllers

## Module routes (fixed)
- `/daily/`
- `/daily/modules/now/`
- `/daily/modules/deed/`
- `/daily/modules/adhkar/`
- `/daily/modules/tasbeeh/`
- `/daily/modules/salah/`
- `/daily/modules/light/`

Do not add routes without updating ARCHITECTURE.md and the audit tool.
