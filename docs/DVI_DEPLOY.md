# Deploy · Dawah Vocational Institute · C19DVI5

**Bismillah.** Educational only — not a fatwa.

## Files to place

1. `craft/index.html` → site `/craft/index.html` (includes DVI plaque)
2. `craft/institute/index.html` → site `/craft/institute/index.html`
3. Optional: keep `PLAQUE_SNIPPET.html` if patching an older landing by hand

## Order
1. Deploy institute workbench first (or together).
2. Deploy craft landing so the tile is visible.
3. Hard refresh / purge CDN for `/craft/` and `/craft/institute/`.
4. Smoke: open `/craft/` → see **Dawah Vocational Institute** tile → Enter → tutorial + Lab load.

## Notes
- Room nav remains shared (`clarity-room-nav-v1`); no second rail.
- Query `?v=20261109C19DVI5` is cache-bust only.
- No Amānah / Campus / Companion engines are loaded by this pack.
