# PageSpeed notes (20261005AH)

Desktop report ~50 Performance was driven mainly by:

| Metric | Issue | Mitigation in package |
|--------|--------|------------------------|
| **TBT 440ms** | Large JS (chunk-8 ~720KB, UFT ~310KB) | Already `defer` + UFT idle; avoid extra boot work |
| **CLS 0.54** | Banner / rail / fonts | aspect-ratio on banner, min-heights, font display=swap |
| **Cache 505KiB** | Short cache on static assets | `_headers` for Netlify/CF Pages (GitHub Pages ignores) |
| **Images 444KiB** | Wikimedia hero | Prefer 640w, sizes attr; host WebP locally later |

## Host-specific cache

- **Netlify / Cloudflare Pages**: commit `_headers` (included).
- **GitHub Pages**: use a CDN in front or Cloudflare proxy for cache headers.
- Query `?v=20261005AH` already cache-busts on deploy.

## Next gains (manual)

1. Host Makkah hero as local `assets/hero-makkah.webp` (~40–80KB).
2. Split `clarity-chunk-8.js` further (already partially deferred modules).
3. Ensure fonts use `display=swap` only (already in Google Fonts URL).
