# Clarity Factor Map (2026-10-05e)

Smooth, tightly-knit asset flow after the size-driven refactor chaos.

## What was broken
- **35 competing `<style id="…">` blocks** in `index.html` (meme order, path gates, banner, vault…) fought each other.
- **Corrupted markup**: `<div id="landing-gate-screen"<div id="landing-gate-screen" …>` (missing `>`).
- **Duplicate audio nodes**: `quran-audio-dup1`, `tj-lmr-master-audio-dup1`.
- **Inconsistent cache-bust**: `?v=20261005b` / `d` / `g` on different scripts → partial stale loads.
- Head alone was ~353 KB; main `:root` CSS ~248 KB + patches ~80 KB.

## Architecture now

```
index.html
  ├─ critical :root CSS          (inline — no FOUC)
  ├─ link → assets/clarity-css-patches-v1.css   (all former id'd style patches)
  ├─ small inline boots          (path-boot, null-guard, banner-lock, …)
  └─ deferred scripts (one version: 20261005e)
       1. clarity-boot-orchestrator-v1.js   ← control plane
       2. clarity-chunk-8.js                L1 core
       3. track-os, tj-lmr, bridge, amana, uft, notes   L2
       4. path-progress, grave-curriculum               L3
       5. polish-wiring, ui-shine                       L4 final paint
```

## Control plane
`window.ClarityBoot` (from orchestrator):
- `ClarityBoot.report()` — module inventory + errors
- `ClarityBoot.scrub()` — dedupe audio / gate nodes
- `ClarityBoot.ensureAll()` — inject any missing deferred module
- `ClarityBoot.reloadCss()` — hot-reload patches CSS
- Unified `VERSION = "20261005e"`

## Size
| File | Role | Notes |
|------|------|--------|
| index.html | ~510 KB | was ~601 KB |
| assets/clarity-css-patches-v1.css | ~86 KB | single cascade |
| assets/clarity-boot-orchestrator-v1.js | ~7 KB | health + scrub |
| assets/clarity-chunk-8.js | ~730 KB | still the big core (future split) |

## Deploy
Upload **full tree**: `index.html`, `robots.txt`, `sitemap.xml`, entire `assets/` (including **new** `clarity-css-patches-v1.css` + `clarity-boot-orchestrator-v1.js`). Purge CDN. Hard-refresh.

Open console → expect: `[ClarityBoot] v20261005e · … · all modules present`
