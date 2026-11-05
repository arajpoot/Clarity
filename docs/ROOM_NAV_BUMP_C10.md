# Room-nav cache-bust bump · 20261104C10

Forces browsers/CDN to load the C8+ room-nav JS that **adds the Craft pill** on every existing four-door rail.

## Files to deploy

| Path | Action |
|------|--------|
| `assets/room-nav/clarity-room-nav-v1.js` | overwrite (C8 craft upgrade) |
| `assets/room-nav/clarity-room-nav-v1.css` | overwrite |
| `amana/index.html` | replace (`?v=20261104C10`) |
| `campus/index.html` | replace (`?v=20261104C10`) |
| `companion/index.html` | replace (`?v=20261104C10`) |
| `daily/index.html` | replace (**adds** link+script; Yawm had nav HTML but no room-nav JS) |

## After deploy

1. Purge Cloudflare cache for `/assets/room-nav/*` and the four index paths.
2. Hard refresh each room.
3. Expect seal text **“Five rooms · educational only · not a fatwa”** and a **Craft** pill.

## Smoke

- `/amana/` · `/campus/` · `/companion/` · `/daily/` each show Craft on the single rail
- No second `.clarity-room-nav`
- `/craft/` still works

Educational only — not a fatwa.
