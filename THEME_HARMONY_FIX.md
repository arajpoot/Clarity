# Theme harmony (2026-10-05g)

## Fighters found
1. **Dual theme systems** — `claritySetThemeMode` (light/dark/system) vs palette manager `pmApplyPreset` (day/night/oasis/…) both writing `data-theme` and colors.
2. **Hardcoded dark body** in patches (`#0c1410 !important`) ignoring `--bg` after preset changes.
3. **body::before wash** still painted in night mode.
4. **171+ dark overrides** in main CSS + 65 in patches + ui-shine injects — same surfaces, different greens.
5. **Duplicate `--accent`** in `:root` (two definitions).

## Fix
- **Canonical tokens** in `clarity-css-patches-v1.css` (harmony block at end of cascade).
- Surfaces (`body`, `.card`, hubs, chips, inputs) bound to **variables only**.
- **`clarity-theme-harmony-v1.js`** — single API `clarityHarmonyTheme(name)`; wraps `claritySetThemeMode` + `pmApplyPreset` so they stop fighting.
- Night ↔ dark, day/soft/high/oasis ↔ light + matching token set.

## Deploy
Upload full tree with new `assets/clarity-theme-harmony-v1.js` and updated patches + `index.html` (`?v=20261005g`). Purge CDN.
