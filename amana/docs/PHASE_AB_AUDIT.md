# Phase A+B audit · Amānah UFT

**Bismillah.** Build: `AMANA_UFT_PHASE_AB_20261108`

## Governance contract

| Item | Result |
|------|--------|
| Amānah owns `/amana/tree/` | Pass |
| Other rooms untouched | Pass — only tree/index + amana/assets phase files |
| Key `clarity_user_family_tree_v1` | Pass — no new tree schema |
| Cards key existing only | Pass |
| Companion vault not restored | Pass |
| Educational stamps | Pass |

## Enrichment clause

| Item | Result |
|------|--------|
| Status | **Held** |
| Farāʾiḍ calculator schema | Unchanged |
| Cross-write tree←fiqh | Not introduced |
| Phase C may activate enrich after A+B smoke green on live |

## Phase A (upload + host)

- Hidden file inputs + OS picker
- `#uft-preview` → `#uft-stage` alias
- Sandbox sim: **PASS**

## Phase B (boot + registry)

- Single settle boot after unlock/load
- Relation + host controls usable selects
- No storage key expansion

## Smoke

See `smoke/SMOKE_PHASE_AB.json`
