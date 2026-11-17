# PORTPOLISH · glossy gold · banner · tour modal

**Bismillah.** Educational only — not a fatwa.

## Fixes (from your screenshots)
1. **Glossy plaques + golden outline** — tower cards, command/intro/how cards  
2. **Banner height** — no tall empty black band under title  
3. **Room tour modal** — `position: fixed` full viewport (`100dvh`), high z-index, modal reparented to `body`, body scroll lock; video max-height so bottom is not “stuck” mid-screen  

## Deploy
1. Upload `index.html` → site root `/`  
2. Upload `assets/port-polish-v1.css` → `/assets/port-polish-v1.css`  
3. Upload `assets/port-polish-modal-v1.js` → `/assets/port-polish-modal-v1.js`  
4. Keep `port-room-tours-repair-v1.js` on `/assets/` (included in pack)  
5. Hard refresh  

## Smoke
- Room cards show gold rim + soft gloss  
- Banner sits tight under chips  
- ▶ Tour opens full-screen overlay; dialog centered; close works; page behind doesn’t clip the video  

Educational only — not a fatwa.
