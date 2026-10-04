# Why Google rejected /today

## What we measured on the live host
- `https://clarity-dawah.fyi/` → **200 OK**
- `https://clarity-dawah.fyi/today` → **307 redirect loop**
- `https://clarity-dawah.fyi/today.html` → **307 redirect loop**
- Live `sitemap.xml` still **does not list** `/today/` (old sitemap)
- Live `robots.txt` still **old** (no /today allow line — still Allow:/ so not blocked)

Google live test fails on redirect loops / non-200. Indexing request is then rejected.

## Fix (do all of these)

1. **Deploy this package** so these files exist on Cloudflare:
   - `today/index.html` → serves **`/today/`** with **200** (no redirect)
   - `today.html` (backup)
   - updated `sitemap.xml`, `robots.txt`, `_redirects`

2. **Cloudflare dashboard** → Rules / Redirects:
   - Remove any bulk rule like “Force HTTPS + strip/add trailing slash + remove .html” that maps
     `/today` ↔ `/today.html` both ways (that causes the 307 loop).

3. **Test in a private window**
   - Open `https://clarity-dawah.fyi/today/`  
   - Must show the Today page with real text (not infinite redirect)
   - View-source: must see `<title>Today — one sincere deed` and **no** `noindex`

4. **Search Console**
   - Sitemaps → submit `https://clarity-dawah.fyi/sitemap.xml` again
   - URL inspection → test **`https://clarity-dawah.fyi/today/`** (with trailing slash)
   - Only click “Request indexing” after live test is **URL is available to Google**

5. Prefer inspecting **`/today/`** not `/today` until redirects are clean.
