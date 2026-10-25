# Performance notes (PageSpeed)

## What this build does
1. **Critical path only:** shell-v3 + landing-v3 load immediately (defer).
2. **~1.2 MB companion JS** loads via `requestIdleCallback` (or after 2.5s) and immediately when user opens Companion.
3. **Secondary CSS** uses `media="print" onload="this.media='all'"` (non-blocking).
4. **CLS:** min-heights on banner / landing / ribbon; `contain: layout` on cards.
5. **Images:** `loading="lazy"`; Kaaba asset stepped down to 640px.
6. **Scroll/touch:** overflow auto + pan/pinch preserved.

## Hosting (GitHub Pages / any static host)
Add long cache for hashed assets if you rename with content hashes; otherwise:
```
Cache-Control: public, max-age=86400
```
for `/assets/*`.

## Expected impact vs prior ~21 score
- Much lower initial JS parse/block (no 707KB core on first paint)
- Faster FCP/LCP for landing
- Lower TBT on first load
- CLS reduced via reserved heights

Re-run PageSpeed after deploy + hard refresh. Numbers vary with network throttle.
