# Clarity SSR First-Session — Safe Port-preserving package

## What this does
- Adds a crawlable first session (āyah + ṣaḥīḥ ḥadīth) to:
  - `/` and `/#reminder`  (root Port entry)
  - `/companion/` and `/companion/#reminder`
- Does **not** replace the Port / Castle landing structure.
- Room nav, banner, path grid, focus plaque, and door rail stay intact.
- Existing Port / Castle / Companion JS can still take over `#cs-mount` after load.

## What this does NOT do
- Does not touch Yawm, Campus, Amānah, or Craft.
- Does not remove enrichment or force a permanent static page.
- Does not fight PageSpeed-critical chrome.

## Files
- `index.html` → site root (additive SSR inside `#cs-mount` only)
- `companion/index.html` → Companion room
- `companion/assets/companion-ssr-first-v1.css`
- `companion/assets/companion-ssr-protect-v1.js`

## Deploy
```bash
cp index.html index.html.bak 2>/dev/null || true
cp companion/index.html companion/index.html.bak

cp path/to/package/index.html ./
cp path/to/package/companion/index.html companion/
cp path/to/package/companion/assets/* companion/assets/
```
Commit, push, purge CDN for `/` and `/companion/`.

## Verify
```bash
curl -s https://clarity-dawah.fyi/ | grep -E 'quran.com|sunnah.com'
curl -s https://clarity-dawah.fyi/companion/ | grep -E 'quran.com|sunnah.com'
```
View-source should show Arabic + graded ḥadīth.  
In a real browser the Port/Castle experience should still load and feel rich.

Educational only — not a fatwa.
