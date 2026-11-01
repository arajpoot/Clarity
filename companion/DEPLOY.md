# Companion HOME deploy · 20261031HOME1

## Upload
1. Entire **`companion/`** folder → site root  
2. Root **`index.html`** (thin door → `/companion/`)  
3. Optional root redirect folders (`tajweed/`, `notes/`, …)

## URLs after deploy
- Companion home: `https://clarity-dawah.fyi/companion/`
- Site root: redirects to Companion  
- Yawm / Campus: unchanged  

## Do not delete
Existing `/assets/companion-inline/` on the server — Companion shell still loads those scripts from `/assets/…` until a later migrate.
