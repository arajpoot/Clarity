# Dayn containment fix · Reality leak / freeze

## Cause
`vault/sealed/dayn-ledger-v2.js` `ensureLandingHost()` fell back to:
```js
(document.getElementById("main-content") || document.body).appendChild(host)
```
When Day landing was not ready, Amānah Dayn mounted into Companion **main** → visible (and duplicated) on **Reality** and other tabs. Duplicate `#dayn-amount` / form IDs contributed to freeze.

## Fix
1. **Patched** `vault/sealed/dayn-ledger-v2.js` — mount **only** inside `#clarity-day-landing`; never `#main-content`.
2. **Inline** `dayn-contain-v1` in `index.html` — scrubs Dayn nodes outside landing + vault roots; clears duplicate IDs.

## Deploy
1. Upload `index.html` (root)
2. Upload `vault/sealed/dayn-ledger-v2.js` (overwrite sealed module)
3. Hard-refresh Companion; open Reality — Dayn must be gone; Day landing may show one entry when plaque is open.

Yawm & Campus untouched.
