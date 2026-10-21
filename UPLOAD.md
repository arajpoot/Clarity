# Companion perf essentials · Phases A–G · 20261021PERF

## What changed
- A: Deduped stylesheet links; provision/share **v2 only**
- B: `clarity-critical-af-v1.css` + deferred heavy CSS (`media=print` onload)
- C: Heavy packs stay idle-only; `clarity-perf-idle-v2.js`
- D: min-heights for provision + adhkār (CLS shells)
- E: `clarity-gate-flow-v1.js` collapses bulky strips when Gate on
- F: light whitespace trim on index
- G: this essentials pack

## Vault / banner
Isolate + secure stack included. Banner CSS/JS included. Do not delete campus from live site separately unless intentional.

## Deploy
1. Upload `index.html` (root)
2. Merge `assets/*` (new + updated files)
3. Keep full vault files already on host if not in this zip
4. CF purge `/` and `/assets/*`
5. Re-run PageSpeed mobile

## Note
Full live site still needs remaining assets (chunk-8 via idle, curriculum, etc.). This pack is the **perf-critical Companion slice** + index.
