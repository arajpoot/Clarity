# C21F3 · Craft-room-wide niyyah footer

**Bismillah.** Educational only — not a fatwa.

## Scope
Shared footer module on **all Craft pages**:
- `/craft/` hub
- `/craft/meme/` · tajweed · calligraphy · quiz · notes · institute

## Mechanism
- `craft-room-footer-v1.css` — niyyah footer visual
- `craft-room-footer-v1.js` — upgrades `footer.craft-footer` (station label from path)
- Station HTML only gains CSS/JS links + build tag — **no studio logic rewritten**

## Multi-cycle sim
1 Assets/idempotent · 2 every page linked · 3 non-regression · 4 path map · 5 hub Write preserved  
**FAIL_COUNT 0 · GREEN**

## Deploy order
1. `/craft/assets/craft-room-footer-v1.css`
2. `/craft/assets/craft-room-footer-v1.js`
3. Replace each page `index.html` under `/craft/` and stations
4. Hard refresh

Educational only — not a fatwa.
