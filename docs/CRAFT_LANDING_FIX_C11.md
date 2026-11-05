# Craft landing fix · C11

## Bug
HTML used `craft-plaque` / `craft-plaque-grid` while CSS only styled `tool-plaque` / `tool-plaques`.
Result: unstyled blue underlined link soup on mobile (screenshot).

## Fix
- Full CSS for `a.craft-plaque`, grid, ico, title, ar, sum, enter
- Kill underline bleed (`text-decoration: none !important`)
- Craft landing is **self-contained** (no Campus Lab as primary path)
- Tajweed / Calligraphy: University Lab demoted to optional bridge only

## Deploy
Overwrite `craft/index.html` + `craft/assets/craft-atelier-v1.css` + module pages if present.
Cache-bust `?v=20261104C11`.
