# Companion P1 package — foundation-safe

## Architecture (do not invert)

| Surface | Path | Owner |
|---------|------|--------|
| Shell | `/companion/index.html` | Path tiles, rail, mount host, SSR first paint |
| Tabs | `/companion/tabs/{reminder,reality,reflection,action,notes,about}/` | Full tab pages — shell fetches & mounts body |
| Banner | `/companion/banner/` | iframe module |
| Meme | `/companion/meme/` | Own page in room |

Existing engines:
- `companion-shell-v1.js` → `GET /companion/tabs/{tab}/`
- `companion-mount-fortify-v1.js` → injects tab body + scripts into `#cs-mount`

## This package changes

**Only** `companion/index.html`:
1. SSR first-paint inside `#cs-mount` (āyah 59:18 + Bukhārī 1) so view-source / slow JS is not Loading-only
2. Slightly clearer adhkār educational source line on the shell strip
3. Build meta `CM21-P1-SSR-FOUNDATION-20261127`

## Explicitly NOT in this package

- No new loader competing with shell/mount-fortify
- No `companion/content/tabs/` partials
- No edits to `tabs/*/index.html`, banner, meme, campus, yawm, amana, craft
- No deletion of enrichment

## Governance

- §3 Enrichment hold — held (tabs pages untouched)
- §3A Visibility — SSR visible before/without JS; tabs still mount via existing path
- Foundation clause — one-room shell paint only; castle not rewritten

Educational only — not a fatwa.
