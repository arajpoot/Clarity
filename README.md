# Clarity – Furnish Your Grave

Local-first Islamic **educational** companion (NurOS).

Path: **Seeker → New Muslim → Daily → Da'i**

> Not a fatwa service. Verify with Qur'an, Sunnah, and a local scholar.

## Live

https://clarity-dawah.fyi/

## Section paths (SEO)

- `/journey` `/seerah` `/grave` `/janazah-prayer`
- `/tafseer` `/tajweed` `/lectures`
- `/fiqh-tools` `/meme` `/notes` `/commands` `/about`

## Deploy

See `PUBLISH_STEPS.md`. Upload `index.html`, `robots.txt`, `sitemap.xml`.

## Privacy

Vault & notes stay on-device (localStorage). Educational tools only.


## Curriculum management (20261006PH)

Four pathways live under `assets/curriculum/{seeker,new-muslim,daily,dai}/`.
Runtime uses **Pathway Hydrator** for progressive script loading and live on/off flags.
See `CURRICULUM_MANAGER.md` and `PERFORMANCE_V2.md`.


## Performance release 20261006PH

Full phased upgrade: minified payloads, on-demand vault stack, pathway hydrator, non-blocking CSS, Seeker-first service worker.
See `PERFORMANCE_V2.md` and `CURRICULUM_MANAGER.md`.


> Educational only — not a fatwa. Verify with Qur'an, Sunnah, and a local scholar.
