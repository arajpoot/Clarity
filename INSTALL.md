# Craft Meme Enrich · C1 package · 20261104

**Bismillah.** Educational only — not a fatwa.

## What this package adds
| Asset | Role |
|-------|------|
| `craft/assets/craft-meme-ratio-v1.js` | 1:1 · 16:9 · 4:5 · Twitter · Facebook canvas sizes |
| `craft/assets/craft-meme-bg-fetch-v1.js` | Curated holy/nature/… catalog + auto-fit helpers |
| `craft/assets/craft-meme-online-bg-v1.js` | Live pools + Flickr/Commons/Picsum + `__memeOnlineFetch` |
| `craft/assets/craft-meme-shariah-scan-v1.js` | URL theme filter before image apply |
| `craft/assets/craft-meme-canvas-clean-v1.js` | Clean paint helpers |
| `craft/assets/craft-meme-export-v1.js` | ⬇ PNG download |
| `craft/assets/craft-meme-layout-v1.css` | BG above canvas · controls below |
| `craft/meme/UI_ENRICH_SNIPPET.html` | Ratio chips + expanded BG + export row markup |

## Install into live `/craft/`
1. Copy all `craft/assets/craft-meme-*.js` and `craft-meme-layout-v1.css` into live `/craft/assets/`.
2. In `/craft/meme/index.html`:
   - Add ratio section + expanded BG chips + export row from `UI_ENRICH_SNIPPET.html`.
   - After existing craft scripts, add (order matters):
     ```html
     <link rel="stylesheet" href="/craft/assets/craft-meme-layout-v1.css?v=20261104C15" />
     <script src="/craft/assets/craft-meme-shariah-scan-v1.js?v=20261104C15" defer></script>
     <script src="/craft/assets/craft-meme-online-bg-v1.js?v=20261104C15" defer></script>
     <script src="/craft/assets/craft-meme-bg-fetch-v1.js?v=20261104C15" defer></script>
     <script src="/craft/assets/craft-meme-canvas-clean-v1.js?v=20261104C15" defer></script>
     <script src="/craft/assets/craft-meme-ratio-v1.js?v=20261104C15" defer></script>
     <script src="/craft/assets/craft-meme-export-v1.js?v=20261104C15" defer></script>
     ```
3. Wire BG chips: existing `data-meme-bg` handlers should call `window.__memeOnlineFetch(kind)` when kind ≠ blank (online-bg already exposes this).
4. Smoke checklist in README.

## Isolation
- No companion-inline loads.
- No path-unlock gate (Craft stays open).
- Shariah scan wraps image loads.
- Educational only — not a fatwa.

## Smoke
- [ ] Ratio chips resize canvas (check 1:1 vs 16:9)
- [ ] Holy / nature fetch; status line updates
- [ ] Blocked theme skipped
- [ ] PNG downloads
- [ ] Desks still work
- [ ] No companion-inline in Network tab

## Step 2 done — full index included
Replace live `/craft/meme/index.html` with this package’s `craft/meme/index.html` (build **C15MEME**).

It already includes:
- Expanded BG chips (nature · night · water · holy · flowers · flickr · solid)
- Ratio chips (1:1 · 16:9 · 4:5 · Twitter · Facebook)
- Export row (⬇ PNG · Re-paint · Push desks)
- Script order: existing craft stack → shariah → online-bg → bg-fetch → canvas-clean → ratio → export
- Inline BG click → `__memeOnlineFetch(kind)`

Still copy all `craft/assets/craft-meme-*` files into live `/craft/assets/` first.
