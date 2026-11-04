# Phase 9+ backlog package

## Items

| Item | Artifact |
|------|----------|
| CI smoke + artifact | `scripts/nuros-ci-smoke.mjs` · `.github/workflows/nuros-smoke.yml` |
| Companion media bus / budget | `companion/assets/companion-media-bus-v1.js` |
| Campus subpage isolation guard | `assets/nuros/nuros-campus-subpage-guard-v1.js` |

## Deploy (optional, incremental)

1. **CI:** copy `scripts/` + `.github/workflows/` to repo root; enable Actions  
2. **Companion:** add media-bus script under `/companion/assets/` and one `<script>` in companion head/body (does not remove craft)  
3. **Campus subpages:** optionally link subpage guard on `/campus/desk/`, `/campus/lab/`, etc.

## Contract
Still bound by NUROS V3.1.2 §§1–5 + Phase 8 ops amendment.  
No richness loss · isolation · educational stance.
