# Clarity — publish to GitHub root (Cloudflare Pages)

## Replace in repo root
| File | Action |
|------|--------|
| **index.html** | Replace with this package’s index.html (full app) |
| **clarity.html** | Optional alias of the same app |
| **today.html** | New — crawlable Today |
| **charter.html** | New/replace — Charter |
| **rooms.html** | New — four-room RRRA map |
| **tools.html** | Tools index |
| **amana-vault.html**, **family-legacy-tree.html**, **meme-studio.html**, **clarity-notes.html**, **faraid-study.html** | Tool cards |
| **robots.txt** | Replace |
| **sitemap.xml** | Replace |
| **_redirects** | Replace (Cloudflare clean URLs) |

Keep existing legacy path folders if you already have them: prepare-for-death/, janazah-prayer/, etc.

## Do not upload
NurOS-*.html, index-live-now-fixed.html, package zips, old Vercel-only builds.

## Cloudflare Pages
- Framework: None
- Build command: empty
- Output directory: /
- Production branch: main

## After deploy
1. https://clarity-dawah.fyi/ → app
2. /today → Today card
3. /charter.html → Charter
4. /rooms.html → Four rooms
5. Search Console → submit sitemap.xml
6. URL inspection on /today and /charter.html

## Indexing note
Vault **data** stays private. Only explanatory pages are indexed.
