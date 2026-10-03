# Making Amana Vault & tools searchable

## Important principle

| What | Searchable on Google? |
|------|------------------------|
| **Vault contents** (names, notes, passphrase, family data) | **Never** — stays on device |
| **Public explainer pages** (what the tool is) | **Yes** — these HTML files |
| **Full app** (`index.html`) | Yes, as the app homepage |

You cannot and should not put private vault data in HTML for indexing.

## How this works

1. Upload the `*.html` pages in this folder to your **GitHub repo root** (same place as `index.html`).
2. Replace root **`sitemap.xml`** with the one here (includes tool URLs).
3. In Google Search Console → Sitemaps → submit `https://clarity-dawah.fyi/sitemap.xml`.
4. Optional: URL Inspection → request indexing for each new URL below.

## Public URLs (after deploy)

| Page | URL | Opens app |
|------|-----|-----------|
| Tools hub | https://clarity-dawah.fyi/tools.html | Home |
| Amana Vault explainer | https://clarity-dawah.fyi/amana-vault.html | `#notes` vault tab |
| Family tree explainer | https://clarity-dawah.fyi/family-legacy-tree.html | `#notes` |
| Meme Studio | https://clarity-dawah.fyi/meme-studio.html | `#reminder` |
| Clarity Notes | https://clarity-dawah.fyi/clarity-notes.html | `#action` |
| Farāʾiḍ study | https://clarity-dawah.fyi/faraid-study.html | `#notes` |

Deep links use the app’s tab hash (`#notes`, `#reminder`, `#action`).

## Cloudflare `_redirects` (optional)

If you use pretty paths, you can add:

```
/amana-vault  /amana-vault.html  200
/tools        /tools.html        200
```

## Files to upload to repo root

- amana-vault.html
- family-legacy-tree.html
- meme-studio.html
- clarity-notes.html
- faraid-study.html
- tools.html
- sitemap.xml  (replace)

Keep existing legacy pages (prepare-for-death, janazah, etc.).
