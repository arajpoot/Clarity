# _redirects fix (Cloudflare / Netlify)

## Bug
The lean package had:

```
/* /index.html 200
```

That rewrite sends **every path** (including `/assets/*.js` and `*.css`) to `index.html`.
Browsers then load HTML instead of JavaScript → blank or stuck site.

## Fix
- Removed the `/*` catch-all.
- Kept only explicit topic / app routes.
- Real files (`/assets/*`, `sw.js`, `robots.txt`, …) are served normally.

## GitHub Pages
GitHub Pages **ignores** `_redirects` (Netlify/Cloudflare format).
For pure GitHub Pages, SPA fallbacks use `404.html` if needed.
Keep this corrected `_redirects` if you also deploy to Cloudflare Pages or Netlify.

## After upload
1. Replace root `_redirects` with this file.
2. Cloudflare → Caching → Purge Everything.
3. Confirm: `https://yoursite/assets/clarity-feature-pack-v1.js` returns JavaScript, not HTML.
