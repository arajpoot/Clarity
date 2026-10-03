# Clarity — publish package (2026-10-03)

## Strategy

| Goal | Approach |
|------|----------|
| **Discoverable app** | `index.html` is the live NurOS / Clarity SPA (this build) |
| **Keep ranking pages** | Do **not** delete `prepare-for-death`, `janazah-prayer`, `hajj-checklist`, etc. |
| **One homepage** | Only **replace** root `index.html` |
| **Tell Google** | Updated `robots.txt` + `sitemap.xml` + on-page `index,follow` (removed `noindex`) |

## Files in this package

| File | Action on GitHub **repo root** |
|------|--------------------------------|
| **index.html** | **REPLACE** existing `index.html` |
| **robots.txt** | **REPLACE** existing `robots.txt` |
| **sitemap.xml** | **REPLACE** existing `sitemap.xml` |

### Do **not** delete (keep for SEO + legacy links)

- `prepare-for-death.html` / routes  
- `janazah-prayer.html`  
- `hajj-checklist.html`  
- `islamic-will.html`  
- `sadaqah-jariyah.html`  
- `debts-and-trusts.html`  
- `google888adb85ca…` verification file  
- `_redirects` (Cloudflare Pages)  
- `og-cover.png` if present (Open Graph image)

### Optional archives (keep, low priority)

- `index-10tabs.html`, `indexDoNotRemove…`, `clarity.html` — backup only; not homepage  

## Upload steps (GitHub → Cloudflare Pages)

1. Download this package and unzip if needed.  
2. Open your Clarity repo on GitHub (the one connected to Cloudflare Pages).  
3. For each file above:  
   - **Upload file** → choose `index.html` → commit message: `Publish Clarity SPA 2026-10-03`  
   - Same for `robots.txt` and `sitemap.xml`  
   Or clone locally, copy files into repo root, then:
   ```bash
   git add index.html robots.txt sitemap.xml
   git commit -m "Publish Clarity app + indexing 2026-10-03"
   git push origin main
   ```
4. Wait for Cloudflare Pages deploy (1–3 minutes).  
5. Visit https://clarity-dawah.fyi/ and hard-refresh.  
6. **Google Search Console** (search.google.com/search-console):  
   - Sitemaps → submit `https://clarity-dawah.fyi/sitemap.xml`  
   - URL inspection → `https://clarity-dawah.fyi/` → **Request indexing**  
7. Rich results test (optional): https://search.google.com/test/rich-results  

## What was fixed for indexing

- Removed **`noindex, nofollow`** (was blocking discovery)  
- Single **`index, follow`** robots meta  
- Primary **title, description, canonical, Open Graph, Twitter, JSON-LD** at top of `<head>`  
- Sitemap priority **1.0** on homepage with today’s `lastmod`  

## Privacy note

Amana Vault remains **on-device only**. Publishing the SPA does not upload anyone’s family data to GitHub or Google.

Barakallahu feekum — may it benefit the ummah.
