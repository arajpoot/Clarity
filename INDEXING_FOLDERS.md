# Google indexing folders (GitHub Pages)

## How it works

GitHub Pages serves **real directories**. Clean URLs in Search Console must map to:

```
/journey/index.html  →  https://clarity-dawah.fyi/journey/
```

Cloudflare `_redirects` alone is **not** enough on pure GitHub Pages.

## In this package

### SPA section gateways (new)
journey, seerah, grave, tafseer, tajweed, lectures,
fiqh-tools, meme, notes, commands, about

SPA gateways are crawlable landings. **Do not upload** over existing rich landings (`janazah-prayer/`, `prepare-for-death/`, etc.).

Each new gateway is a **crawlable** landing page with canonical + JSON-LD + link into the app (`/?tab=`).

### Legacy educational landings (already on main — keep on repo)
prepare-for-death, remember-death, what-benefits-the-deceased, debts-and-trusts,
sadaqah-jariyah, ghusl-kafan-burial, wasiyyah, islamic-will*, 
islamic-inheritance-calculator, hajj-checklist, dua-for-the-deceased,
ya-ayyuhalladhina-amanu, amana-vault, charter

Do **not** delete those folders when purging root grocery-list HTML files.

## Deploy order

1. Upload package root onto `main` (merge; do not wipe legacy SEO folders).
2. Ensure `assets/` from this package overwrites (chunk-8 syntax fix).
3. Purge CDN cache.
4. Search Console → submit `https://clarity-dawah.fyi/sitemap.xml`
5. Request indexing for `/grave/`, `/journey/`, `/prepare-for-death/`, `/janazah-prayer/`

## Main app router

`assets/clarity-chunk-8.js` already maps path keys via `CLARITY_ROUTES` + `clarityPathKey()`.
Gateways set `sessionStorage.clarity_entry_tab` for soft handoff when user clicks into the app.
