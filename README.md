# Yawm path wire · Companion + Campus

## Error (from live screenshot)
Landing on Daily works, but **Companion path** used `href="/"`.

Root early daily-first then sent `/` → `/daily/` again → **infinite Yawm loop**.  
Campus `/campus/` was fine; Companion was not.

## Fix
| Link | Before | After |
|------|--------|--------|
| Companion (nav + dual tile) | `/` | `/?enter=companion#reminder` |
| Campus / University | `/campus/` | `/campus/` (unchanged) |
| Early root script | always daily on `/` | skip if `?enter=companion` or dest=companion |
| `yawm-hub.js` | — | sets session dest on click |

## Deploy (both)
1. **`daily/index.html`**
2. **`daily/assets/js/yawm-hub.js`**
3. **Root `index.html`** (early head script v3.1 with `enter=companion`) — or replace early block from package

## Smoke
12/12 path cycles pass (vm sandbox): Daily first paint, Companion no loop, Campus open.
