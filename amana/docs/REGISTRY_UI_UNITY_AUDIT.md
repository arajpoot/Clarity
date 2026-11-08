# Registry UI unity audit

**Bismillah.** Build: `AMANA_UFT_REGISTRY_UI_UNITY_20261108`

## Problem
Two intake UIs on `/amana/tree/`:
1. Static HTML — Registry · add person (+ link host/rel)
2. `amana-uft-registry-deep-v1.js` — Registry · full fields (gender/vital/export)

## Fix
`amana-uft-registry-ui-unity-v1.js`:
- Single `<details id="uft-registry-unified">` — name, role, gender, vital, contacts, link host/rel
- Placeholder `#uft-registry-deep` marker so deep injector no-ops
- Hides legacy dual grid
- Save uses `uftRegAddNew` + role/gender/vital on registry row
- Build / pull wired to existing APIs

## Governance
Amānah tree only · same storage keys · educational only · not a legal pedigree.
