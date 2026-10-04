# Publish + Google indexing (updated)

## Live structure (apex)

https://clarity-dawah.fyi/ exposes indexed paths:

`/journey` `/seerah` `/grave` `/janazah-prayer` `/tafseer` `/tajweed` `/lectures` `/fiqh-tools` `/meme` `/notes` `/commands` `/about`

`sitemap.xml` in this package lists all of them.

## GitHub Pages

1. Push `index.html`, `robots.txt`, `sitemap.xml`, `README.md` to repo root.
2. Settings → Pages → branch `main` / root.
3. Custom domain `clarity-dawah.fyi` + HTTPS.

## Search Console

1. Property: `https://clarity-dawah.fyi/`
2. Submit sitemap: `https://clarity-dawah.fyi/sitemap.xml`
3. Request indexing for `/` and key paths (`/grave`, `/tajweed`, `/commands`).

## After upload

- Hard-refresh production.
- Confirm LAST visit strip visible under banner.
- Tajweed record meter animates while mic is open.
- Meme verse push uses Indo-Pak (Nastaliq) sizing.
- Tweet desk opens X/Twitter app on mobile when installed.
