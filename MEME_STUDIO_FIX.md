# Meme Studio + path gate polish (2026-10-05d)

## Root causes found
1. **CSS path-hide used focus path, not unlock max**  
   Rules like `body:not([data-clarity-path="practicing"]):not([data-clarity-path="dai"]) #meme-card` hid Meme Studio whenever the *focused* door was Seeker/New Muslim — even after Daily/Da'i was unlocked. Path-progress `showEl()` could not win against `!important`.

2. **Conflicting flex `order` styles**  
   One block set `.meme-bar-scale { order: 5 }`, another `order: 3`. Layout fought itself.

3. **Site-wide "Use in Meme" pills**  
   Injected by chunk-8 but still subject to the same path CSS hide / gate styles when sections were allowed.

## Fixes
- Introduced `data-clarity-meme-ok="1"` (set by `clarity-path-progress-v1.js` when `max >= practicing`, and by polish-wiring `openAllSections` for Da'i).
- Meme card / studio / pills visibility now driven by that attribute, not focus path alone.
- Consolidated order CSS (`clarity-meme-strip-order-v2`): **Background → Canvas → Scale (first under canvas) → Fetch → Format/export**.
- HTML order inside `.meme-below`: **Scale bar moved above Fetch bar**.
- Cache-bust `?v=20261005d` on path-progress, polish-wiring, chunk-8, ui-shine.

## Layout (meme studio top section)
1. Background chips  
2. Canvas preview  
3. Scale · outline (and other function pills)  
4. Fetch · verse & ḥadīth  
5. Format · export  

## Deploy
Upload full tree (`index.html` + entire `assets/`). Purge CDN. Hard-refresh.
