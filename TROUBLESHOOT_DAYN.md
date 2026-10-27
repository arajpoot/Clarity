# Dayn ledger live troubleshoot

## Verified on live (crawl)
- index **includes** `inline-clarity-dayn-ledger-v1.js` and CSS
- assets return **HTTP 200**
- `#clarity-dayn-entry` is **not** in static HTML (created by JS) — expected

## Why it may not "land" on screen
1. **Landing-v3 repaints** dual-tiles area and can drop a node inserted too early
2. Insertion anchors `cdl-adhkar` / `cdl-today` are **not** in live static HTML
3. Browser **cache** of old JS without hard refresh
4. User may be on **companion** shell — entry is aimed at **day landing**

## Fix in this package
- Stronger host placement after `.dual-tiles`
- MutationObserver remount if node removed
- Cache-bust `?v=20261027DAYN2`
- Repeated remount timers + landing-ready events

## Deploy
Overwrite:
- index.html
- assets/companion-inline/inline-clarity-dayn-ledger-v1.js
- assets/css/clarity-dayn-ledger-v1.css

Then hard-refresh. Open **Day landing** (not only Companion path).
