# Expected published layout (GitHub / Cloudflare)

```
/
  index.html
  robots.txt
  sitemap.xml
  netlify.toml          (optional)
  _headers              (optional; GitHub Pages ignores)
  assets/
    clarity-amana-vault-gate-js-v1.js
    clarity-chunk-8.js
    clarity-critical-css-v1.css
    clarity-css-patches-v1.css
    clarity-grave-path-curriculum-js.js
    clarity-notes-recovery-v1.js
    clarity-path-progress-v1.js
    clarity-polish-wiring-v2.js
    clarity-runtime-overlays-v1.js
    clarity-track-os-v3.js
    clarity-uft-full-restore-v1.js
    clarity-ui-shine-v1.js
    nuros-bridge-enrich-js.js
    nx-tj-lmr-js-v1.js
    curriculum/         (optional authoring)
```

## Do NOT need on live

- `clarity-boot-orchestrator-v1.js` (404 is OK — merged into runtime-overlays)
- Duplicate nested `assets/assets/`
- Old zip folders at repo root

## After upload

Hard refresh. Network panel scripts should show `?v=20261005AK`.
