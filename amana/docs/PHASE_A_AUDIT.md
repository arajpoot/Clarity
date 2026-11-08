# Phase A audit · Amānah UFT integrity

**Bismillah.** Date: 2026-11-08 · Room: `/amana/tree/` · Enrichment: **held** (no schema change)

## Governance checklist

| Contract item | Status |
|---------------|--------|
| Amānah owns tree (not Companion) | Pass — assets under `/amana/assets/` |
| Storage key `clarity_user_family_tree_v1` only for tree | Pass — upload writes same key |
| Educational only stamps | Pass — status strings educational |
| No companion-inline as home | Pass |
| Enrichment clause | **Held** — no new keys; cards key pre-existing |

## Root cause (upload)

`uftRunUploadMenu` in `clarity-uft-full-restore-v1.js` does:

```js
document.getElementById('uft-load-file').click();
```

Chamber HTML and `amana-uft-file-ops-v1.js` never create `#uft-load-file`, `#uft-cards-file`, `#uft-pack-file`.  
Selecting Upload → Full tree JSON therefore no-ops (no OS directory picker).

## Phase A repairs

1. `amana-uft-upload-fix-v1.js` — inject hidden file inputs, FileReader import, override `uftRunUploadMenu`
2. `amana-uft-phase-a-host-v1.js` — `#uft-preview` → `#uft-stage` cohesion (load-map fragility)

## Explicit non-goals (Phase A)

- No farāʾiḍ calculator changes
- No second tree schema
- No Companion tab reintroduction
- Enrichment maps remain `"held"`

## Smoke (operator)

1. Open `/amana/tree/` (unlock if gate requires)
2. Expand **Save · download · upload**
3. Upload → Full tree JSON → OS file picker **must open**
4. Choose a prior export → tree status shows imported
5. Hard refresh → data still present (same key)
6. Upload → Member cards CSV/JSON → picker opens; cards count updates

## Sign-off fields

- Cold load console: no TypeError on upload menu  
- Picker opens on gesture  
- Import round-trip local only  
