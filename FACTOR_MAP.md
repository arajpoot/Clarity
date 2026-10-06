# Clarity factor map — script structure

Load order is **dependency order**. `defer` keeps this sequence.

## CSS (head)
| File | Role |
|------|------|
| `clarity-critical-css-v1.css` | Tokens, layout, FOUC-safe base |
| `clarity-css-patches-v1.css` | Path/meme/banner/theme harmony overrides |

## L1 — Runtime overlays
`clarity-runtime-overlays-v1.js`  
Boot · nuros shields · banner-lock · smooth-flow · theme-harmony · security · meme-confidence

## L2 — Core SPA
`clarity-chunk-8.js` — tabs, meme desk, journey, main UI

## L3 — Features
| File | Role |
|------|------|
| `clarity-track-os-v3.js` | Track / path UI hooks |
| `nx-tj-lmr-js-v1.js` | Tajweed LMR |
| `nuros-bridge-enrich-js.js` | Bridge enrichment |
| `clarity-amana-vault-gate-js-v1.js` | Vault crypto gate |
| `clarity-uft-full-restore-v1.js` | Family tree / UFT |
| `clarity-notes-recovery-v1.js` | Notes |
| `clarity-grave-path-curriculum-js.js` | Grave path content |

## L4 — Path curriculum
`clarity-path-progress-v1.js`  
Seeker → New Muslim → Daily → Da'i. **Focus confines visible modules.**

## L5 — Polish (after path)
| File | Role |
|------|------|
| `clarity-polish-wiring-v2.js` | Wiring; must not open-all on Seeker |
| `clarity-ui-shine-v1.js` | Visual polish |

## Rule
New behavior → extend an existing layer file, or append to runtime-overlays.  
Do not add root-level scripts. Publish only the lean allow-list.

## Performance monitoring (in L1 runtime)
`ClarityPerf` — off by default.
- Enable: `localStorage.setItem('clarity_perf','1')` then reload, or `?perf=1`
- Console: `ClarityPerf.log()` or `ClarityPerf.report()`
- Tracks: FCP/paint, navigation, long tasks (>50ms), slow resources, path-apply, meme-draw

## Curriculum folders (authoring)
`assets/curriculum/{shared,seeker,new-muslim,daily,dai}/` + `card-map.json`  
Stamp: `node assets/curriculum/stamp-cli.js --write` → `data-min-i` / `data-always` on cards in `index.html`.

## Path Progress v6 (CSS-first)
`clarity-path-progress-v1.js` stamps `data-min-i` once, then switches only `html[data-path-i]`.
Visibility is pure CSS in `clarity-css-patches-v1.css`. No per-card style thrash on switch.

## Freeze guard (learning doors)
`clarity-path-progress-v1.js` owns `applyPathFilter` + `clarity-path-changed`.
- Reentrancy flag + dispatch only when gate changes
- Discipline block must **not** listen to `clarity-path-changed` (that loop froze tab switches)
- Polish/grave wrappers: single deferred sync; no reapply cascade from non-dai `openAll`

## Release 20261005AC
- Vault eye toggle + align; pass wipe on boot/pageshow
- Tab restore on refresh (hash + last hub)
- Path v6 CSS-first; UFT const→var; CSP no unsafe-eval
- Amana: PBKDF2 210k, AES-GCM, RAM session key only
