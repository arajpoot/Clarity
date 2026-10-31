# Site-wide path wire · Daily · Companion · Campus

Bismillah. Educational only — not a fatwa.

## Problems found
| Surface | Issue |
|---------|--------|
| **Campus / Desk** | “← Companion” used `href="/"` → root early script sent users **back to /daily/** (loop) |
| **Daily** | Companion already used `enter=companion` (OK) |
| **Root** | Lands on `/daily/` (OK); University/Open daily need consistent targets |
| **Legacy SEO paths** | `/grave`, `/seerah`, `/notes`, … **404** |

## Fix
1. **Static HTML** — Campus + Desk Companion → `/?enter=companion#reminder`
2. **`/assets/clarity-site-path-wire-v1.js`** on root, daily, campus, desk:
   - Rewrites bare `/` Companion links
   - Open daily → `/daily/`
   - University path → `/campus/`
   - Remaps retired paths to Campus library/journey or Companion hashes
   - Sets `clarity_landing_dest_v1` on click

## Deploy
```
index.html                          (root — keep early daily-first)
assets/clarity-site-path-wire-v1.js
daily/index.html
campus/index.html
campus/desk/index.html
```

Hard-refresh each surface once.

## Smoke
**12/12** deploy-order path cycles (vm sandbox): Daily land, Companion no loop, Campus open, remaps.
