# Adhkār packs in Yawm · Y2

## Import
Root `adhkar/data/morning.json` + `evening.json` → **`/daily/assets/adhkar-data/`**

## Wire
`/daily/modules/adhkar/` loads packs via `yawm-adhkar-pack-v1.js`  
Morning / Evening toggle · count · next · grade + Sunnah.com when parseable

## Simulation
- 6 morning + 6 evening items, each with `ar` + source/grade  
- Packs only under `/daily/`  
- Hub accept list still passes  
- No Productive Muslim  

## Root `/adhkar/` after deploy
**Safe to delete or replace with redirect** once this package is live:

```
/adhkar/  →  /daily/modules/adhkar/
```

Keep nothing required outside `/daily/` for these packs.
