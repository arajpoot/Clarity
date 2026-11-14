# Deploy L5 · 20261113L5

## Upload
1. Root `sitemap.xml` (42 verified 200 URLs)
2. `_redirects` (or `public/_redirects` / `vercel.json` — pick what your host uses)
3. Optional: `docs/console/index.html` (noindex checklist)

## Host notes
- **Cloudflare Pages / Netlify:** use `_redirects`
- **Vercel:** use `vercel.json`
- **GitHub Pages:** may need a meta refresh page at `wasiyah/index.html` if redirects unsupported — ask if needed

## After deploy
1. Open `/wasiyah/` — should land on `/wasiyyah/`
2. GSC → resubmit sitemap
3. URL Inspection on `/dua-for-the-deceased/` and `/docs/legacy/`

Rooms untouched.
