# Clarity SEO · index enrichment guide
Updated: 2026-11-10

## Host rule
- **Canonical host:** `https://clarity-dawah.fyi` (apex, HTTPS)
- Prefer **trailing slashes** on directory URLs
- `www` should **301 → apex** at the CDN (if not already)

## Files to deploy (site root)
| File | Role |
|------|------|
| `sitemap.xml` | Full public map (45 URLs) |
| `robots.txt` | Allow all + sitemap pointer |
| `_redirects` | Legacy → five-room 301s |
| `seo-index.html` | Human link inventory (`noindex`) |

## Five-room URL map (high priority)
- `/` castle gate
- `/companion/`
- `/daily/` (Yawm) + `/daily/modules/{now,deed,adhkar,tasbeeh,salah,light}/`
- `/campus/` + desk + lab studios
- `/amana/` + dayn/tree/fiqh/heirs/wasiyyah/notes/unlock
- `/craft/` + tajweed/quiz/meme/calligraphy/notes/institute

## GSC cleanup checklist
1. Deploy this package
2. Resubmit `https://clarity-dawah.fyi/sitemap.xml`
3. Validate fix on **404** and **redirect** reason groups
4. Inspect `/grave` and `/tajweed` (expect 301)
5. Remove outdated sitemap entries from any *second* sitemap if one exists in GSC

## Why pages were not indexed (mapped)
| GSC reason | Site cause | Fix in this package |
|------------|------------|---------------------|
| Not found (404) | `/grave`, `/tajweed` in old sitemap | 301 + removed from sitemap |
| Page with redirect | non-slash guide URLs | trailing-slash 301s + sitemap uses slash |
| Redirect error / chains | `/lab` → campus lab | explicit 301 rules |
| Duplicate canonical | www vs apex / slash | apex-only sitemap + host policy |
| Discovered not indexed | incomplete sitemap | expanded to 45 live URLs |

## Content notes
- Do not put passphrase vault *contents* in sitemap (desk/unlock entry points only)
- Keep educational disclaimers on pages; SEO files do not alter fiqh
