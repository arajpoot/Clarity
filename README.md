# Clarity Craft · Five-Door Package · 20261104C5

**Bismillah.** Educational only — not a fatwa.

Revision of C3 for **single-rail compliance** with live four-door governance.

## What changed vs C3

- Craft HTML pages **no longer hardcode** a full `<nav class="clarity-room-nav">`.
- Shared `clarity-room-nav-v1.js` is the only rail authority:
  - Existing 4-door rail → **upgrade in place** (add Craft tile only).
  - No rail → create full five-link rail once.
  - **Never** double the bar.
- Governance docs added under `docs/` (NAV CONTRACT amendment + phased plan).

## Hero banner
- `craft/assets/clarity-craft-banner.jpg` — Registan / Ulugh Beg (Central Asia madrasa heritage)
- Overlay: **Clarity · Crafts** + An-Naḥl 16:125 (wisdom & good instruction)
- Soft gradient for readability · educational credit line

## Package layout

```
craft/                          → copy to site root
  index.html                    tools landing (glass plaques)
  meme/ calligraphy/ tajweed/ quiz/ notes/
  assets/                       craft CSS/JS

assets/room-nav/                → overwrite site assets/room-nav/
  clarity-room-nav-v1.css
  clarity-room-nav-v1.js        in-place upgrade for Craft tile

landing-patch/
  INDEX_FIVE_DOORS_SNIPPET.html paste into root index.html (.port-grid)

docs/
  CRAFT_SURFACE_NAV_CONTRACT.md single-rail + isolation rules
  CRAFT_PHASED_PLAN.md          phases A–D
```

## Deploy order

1. **Room nav** — replace `assets/room-nav/clarity-room-nav-v1.css` and `.js`.
2. **Craft room** — copy entire `craft/` folder to site root.
3. **Root landing** (optional) — merge five glass plaques from `landing-patch/`.
4. Purge CDN · hard refresh.

## Governance (read before deploy)

- Live product isolation remains **four doors** (`ARCHITECTURE.md`, `amana/NAV_CONTRACT.md`).
- Craft is a **soft surface** — additive tile on the existing rail.
- Decommission of in-Companion craft hosts is **Phase D** and needs explicit approval.

## Smoke checks

- [ ] Any existing room shows **one** rail; Craft pill is present after JS
- [ ] `/craft/` and subpages show **one** rail; Craft is current
- [ ] No second `.clarity-room-nav` in DOM
- [ ] `/craft/tajweed/` meter booth starts/stops (Web Audio)
- [ ] `/craft/meme/` desks copy / open
- [ ] `node --check` on package JS

May Allah accept the effort and make it light for the grave.
