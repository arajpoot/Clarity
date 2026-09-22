# Clarity — GitHub → Cloudflare Pages

## Upload ONLY these files to the repo root

| File | Role |
|------|------|
| **index.html** | Main app (served at `/`) — Learn, Today, Affairs, tools |
| **clarity.html** | Same app (alias at `/clarity`) |
| debts-and-trusts.html | Google indexing card |
| sadaqah-jariyah.html | Google indexing card |
| islamic-will.html | Google indexing card |
| prepare-for-death.html | Google indexing card |
| hajj-checklist.html | Google indexing card |
| _redirects | Cloudflare clean URLs |
| sitemap.xml | Search Console |
| robots.txt | Crawlers |

Do **not** upload: NurOS-Clarity-*.html, Clarity-*-package.zip, old Vercel builds, or duplicate “final” copies.

## Cloudflare Pages settings

- Framework: None
- Build command: (empty)
- Output directory: `/` (repo root)
- Production branch: main

## After push

1. Open https://your-domain/ → should load app at #today
2. Learn → One letter → Calligraphy pad
3. Submit sitemap.xml in Google Search Console
