# Performance package (Oct 2026)

## What changed vs 2.1 MB monolith

| Change | Effect |
|--------|--------|
| Initial HTML **~2.1 MB → ~570 KB** | Faster parse / FCP |
| **9 heavy modules** → `assets/*.js` + `defer` | Main thread free for paint; scripts download in parallel |
| Google Fonts **10+ families → 2** (Scheherazade New + Inter) | Far fewer font bytes & requests |
| Banner image **1280px → 640px** | ~4× less image weight |
| `loading="lazy"` on iframes / non-banner images | Less critical-path work |
| YouTube `autoplay=1` → `0` | No autoplay media on load |
| `fetch` gate for AlQuran / Aladhan / geo / counters until **idle** | LCP not blocked by APIs |

## Deploy (Cloudflare Pages / any static host)

Upload **entire folder** structure:

```
index.html
assets/
  clarity-chunk-8.js
  clarity-uft-full-restore-v1.js
  … (all js files)
robots.txt
sitemap.xml
```

Do **not** upload only `index.html` — deferred scripts will 404.

## After deploy

1. Hard refresh / purge Cloudflare cache  
2. Re-run PageSpeed Mobile on https://clarity-dawah.fyi/  
3. Expect large gains on FCP/LCP/TBT; score depends on mobile throttling still

## Further gains (next)

- Self-host WOFF2 subsets of Scheherazade + Inter  
- Split routes (Journey / Learn) into separate HTML  
- Click-to-load YouTube poster instead of iframe in DOM  
- Preload only banner LCP image via CDN WebP  
