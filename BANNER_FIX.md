# Banner missing after perf deploy

## Cause
The banner **HTML was never moved to `assets/`**. It stays in `index.html`.

Performance CSS/rules had `.banner { min-height: 0 }` while `.banner-media` is `position: absolute`, so the banner contributed **no height** and looked “gone”.

## Fix in this package
- Restored `min-height` (~150px+) on `#clarity-top-duo .banner`
- Forced overlay + media visible

## Deploy
Re-upload **index.html** (assets folder can stay as-is). Purge Cloudflare cache.
