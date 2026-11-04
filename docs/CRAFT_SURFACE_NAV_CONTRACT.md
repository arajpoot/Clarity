# Craft surface · NAV CONTRACT amendment · 20261104C5

**Bismillah.** Educational only — not a fatwa.

## Source of truth (unchanged)

Live architecture remains **four isolation doors**:

| # | Door | URL | Owns |
|---|------|-----|------|
| 1 | Companion | `/companion/` | Path shell, banner, original craft tools |
| 2 | Yawm | `/daily/` | Daily routine source of truth |
| 3 | University | `/campus/` | Learning institution |
| 4 | Amānah | `/amana/` | On-device trust surface |

See root `ARCHITECTURE.md` and `amana/NAV_CONTRACT.md`.

## Soft fifth surface (this package)

**Craft** (`/craft/`) is a **soft surface**, not a fifth isolation domain.

- It re-surfaces Companion craft tools (Meme, Tajweed Deep Studio, Calligraphy) plus desks, quiz, notes.
- It does **not** own daily SoT, Amānah crypto, or campus grades.
- Companion tools remain live until an explicit decommission phase is approved.

## Single-rail rule (non-negotiable)

1. There is **one** site-wide `.clarity-room-nav` bar.
2. `assets/room-nav/clarity-room-nav-v1.js`:
   - If a rail already exists → **upgrade in place** (append Craft tile if missing; update seal text).
   - If none exists → create the full five-link rail once.
   - **Never** insert a second `.clarity-room-nav`.
3. Craft HTML pages must **not** hardcode a full nav. They only load the shared CSS + JS.
4. Seal text becomes: `Five rooms · educational only · not a fatwa` after Craft is present.

## Isolation preserved

| Surface | Must not |
|---------|----------|
| Craft | Host Yawm daily SoT; load Amānah passphrase / Dayn mutators; write campus vault keys |
| Companion | Become the only path to Craft tools after decommission (future) |
| Other rooms | Import Craft module internals |

## Deploy order

1. Replace `assets/room-nav/clarity-room-nav-v1.{js,css}` (in-place upgrade path).
2. Copy `craft/` to site root.
3. Optional: paste five glass plaques into root `index.html` from `landing-patch/`.
4. Hard refresh / purge CDN.

## Future phase (not in this package)

- Explicit approval required before decommissioning in-Companion Meme / Tajweed / Calligraphy hosts.
- Any change to isolation boundaries requires an ARCHITECTURE.md update.
