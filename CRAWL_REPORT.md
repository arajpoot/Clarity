# Live crawl 2026-10-26

## Server truth
Landing **v6 is deployed** on clarity-dawah.fyi:
- Farḍ rakʿahs, Ṣawm, Zakāt, Ḥajj, qibla, rich wuḍūʾ/ṣalāh tips + Deepen links
- DOM: 22 learn links, 18 tips, 14 icons inside `#clarity-day-landing`

## Why phones looked empty
**Choose your door** modal stayed on top (tiles often dead; dismiss did not stick).
Content was under the dimmed overlay — scroll alone could not reveal it.

## Fix in this package
`inline-clarity-doors-fix-v1.js` v2: hard hide, session dismiss, returning visitors skip modal, interval heal if modal reopens.
