# Companion ARCHITECTURE · 20261031ARCH1

Parallel to Yawm (`/daily/ARCHITECTURE.md`) and Campus shell isolation.

```
/companion/                      ← HOME
  index.html                    ← full Companion shell
  FOUNDATION_LOCK.md
  NAV_CONTRACT.md
  COMPANION_CONTRACT.md
  ARCHITECTURE.md
  MODULES.md
  YAWM_CAMPUS_BOUNDARY.md
  assets/                       ← fortify / surface boot only
  sealed/                       ← Amānah JS (fortress)
  modules/                      ← meme · tajweed · callig · notes pack
  modules/css/
  redirects/                    ← SPA stubs
  patches/
  tools/

/daily/                         ← Yawm (do not edit here)
/campus/                        ← University (do not edit here)
/assets/companion-inline/       ← shared shell scripts on server (read)
```

## Load order (simplified)
1. Shared `/assets/…` shell & banner scripts (absolute paths)
2. `/companion/modules/*` module pack
3. `/companion/assets/clarity-vault-fortify-boot-v1.js` → `/companion/sealed/*`
