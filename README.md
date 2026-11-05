# Clarity · Five Doors + Craft · FINAL deploy package · 20261104C9

**Bismillah.** Educational only — not a fatwa.

Smoke-verified deploy bundle: root five-door landing, Craft atelier room, single-rail room-nav upgrade, Cloudflare `_redirects` fix.

## Package contents

```
index.html                          → site root (5 glass plaques)
_redirects                          → site root (removes /craft → campus/lab)
assets/room-nav/
  clarity-room-nav-v1.js            → overwrite (C9 upgrade-all rails)
  clarity-room-nav-v1.css           → overwrite
craft/                              → copy to site root
  index.html, meme/, tajweed/, …
  assets/clarity-craft-banner.jpg
docs/
  CRAFT_SURFACE_NAV_CONTRACT.md
  CRAFT_PHASED_PLAN.md
landing-patch/
  INDEX_FIVE_DOORS_FULL.html        → backup of root index
  INDEX_FIVE_DOORS_SNIPPET.html
  YAWM_ROOM_NAV_INJECT.html         → add script tags to /daily/
```

## Deploy order (required)

1. **`_redirects`** — overwrite site root.  
   Removes `/craft` → `/campus/lab` 301s so Craft tile opens the atelier.

2. **`assets/room-nav/`** — overwrite both files.  
   Use cache-bust `?v=20261104C9` on every page that already links them  
   (Amānah, Campus, Companion, etc.).

3. **`craft/`** — copy entire folder to site root.

4. **`index.html`** — replace site root landing.

5. **Yawm** — add to `/daily/` (head or before `</body>`):
   ```html
   <link rel="stylesheet" href="/assets/room-nav/clarity-room-nav-v1.css?v=20261104C9"/>
   <script src="/assets/room-nav/clarity-room-nav-v1.js?v=20261104C9" defer></script>
   ```

6. **Purge Cloudflare cache** · hard refresh.

## Smoke checklist

- [ ] `GET /craft/` is **200** (not 301 to `/campus/lab/`)
- [ ] `/` shows **5** plaques; Craft → `/craft/`
- [ ] Room rail on landing shows **Craft** pill; seal “Five rooms…”
- [ ] After Yawm inject: `/daily/` rail gains Craft
- [ ] `/amana/` and `/campus/` rail gain Craft after new `?v=20261104C9` JS
- [ ] `/craft/tajweed/` loads; `/craft/meme/` desks present
- [ ] Only **one** `.clarity-room-nav` per page

## Governance

- Four isolation doors unchanged (Companion · Yawm · University · Amānah).
- Craft is a **soft surface** on the shared rail — not a new isolation domain.
- University Lab **Craft Laboratory** stays at `/campus/lab/`.

May Allah accept the effort and make it light for the grave.

## Phase C (this build)
- **C1** Meme: Companion RRRA section chips + source fetch → desks
- **C2** `ClarityCraftRegistry` for future module deep links
- Deploy: copy updated `craft/` (especially `craft/meme/` + new assets)
