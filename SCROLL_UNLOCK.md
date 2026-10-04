# Scroll stuck after purple strips

## Cause
`clarity-chunk-8.js` welcome modal sets `document.documentElement.style.overflowY = 'hidden'`.
If the modal path does not call `hide()` cleanly, **page scroll stays locked**.

Combined with deferred load, the banner can flash, then content (purple section bars) appear while scroll is frozen.

## Fix
1. CSS forces `html, body { overflow-y: auto !important; height: auto }`
2. Boot unlock script clears inline overflow every 250ms for ~5s
3. Welcome hide path removes overflow lock + calls `clarityUnlockScroll()`
4. Stuck overlays (three-doors / welcome if already seen) forced closed

## Deploy
Upload `index.html` + `assets/clarity-chunk-8.js` (or full zip). Purge CF cache.
