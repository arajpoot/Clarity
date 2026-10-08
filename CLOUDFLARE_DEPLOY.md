# Cloudflare Pages via GitHub

## One-time setup (Dashboard)
1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select repo: `arajpoot/Clarity`
3. Build settings:
   - **Framework preset:** None
   - **Build command:** (leave empty)
   - **Build output directory:** `/` (root)
   - **Root directory:** `/` (repo root)
4. Environment: none required
5. Save and deploy
6. Custom domain: add `clarity-dawah.fyi` → DNS CNAME to `*.pages.dev`

## Going forward (every update)
1. Push to `main` on GitHub (or upload files to `main`)
2. Cloudflare auto-builds from GitHub connection
3. Purge cache if needed: Caching → Configuration → Purge Everything
4. Users: hard refresh; one-time SW clear if stuck

## Do NOT put asset JS/CSS at repo root
Only under `assets/`. Root should stay: index.html, sw.js, robots.txt, sitemap.xml, _headers, _redirects, .nojekyll, 404.html, SEO folders.

## Delete before each lean upload (if still present)
- `assets/clarity-site-audit-v1.js`
- Any `clarity-*.js` / `clarity-*.css` accidentally at **repo root**
- Old singles merged into packs (layout-fix, meme-enhance, path-progress, etc.)
