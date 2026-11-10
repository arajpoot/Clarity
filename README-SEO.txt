Clarity SEO index repair package
================================
Deploy to site root:
  sitemap.xml
  robots.txt
  _redirects   (Cloudflare Pages / Netlify)

After deploy:
  1. GSC → Sitemaps → resubmit https://clarity-dawah.fyi/sitemap.xml
  2. URL inspection on /grave and /tajweed (should 301)
  3. Prefer apex clarity-dawah.fyi; 301 www → apex at CDN if not already
  4. Use "Validate fix" on Redirect error / 404 reason groups

Sitemap URLs: 39
Date: 2026-11-10
