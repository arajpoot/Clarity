# Phase A–D audit · Amānah Tree + Farāʾiḍ

**Bismillah.** Build: `AMANA_UFT_AD_20261108`

## Live verification (pre-C/D)

| Asset | Live |
|-------|------|
| tree index Phase A/B/E scripts | Present on clarity-dawah.fyi |
| upload-fix / host / boot / registry / workflow-enrich | HTTP 200 |
| Multi-cycle sim (5× live JS) | **5/5 PASS** |

## Governance contract

| Rule | Status |
|------|--------|
| Amānah owns tree/fiqh | Pass |
| Companion / other rooms untouched by this pack | Pass |
| Tree key `clarity_user_family_tree_v1` | Pass |
| Outline key study-only | Pass |
| Educational / not fatwa stamps | Pass |
| Enrichment | Workflow active · no binding engine |

## Security (Phase D)

| Control | Status |
|---------|--------|
| No passphrase in UFT/fiqh modules | Pass |
| Dynamic gender list via textContent | Pass (Phase C) |
| Tab hide / lock soft-clears import status | Pass |
| Password inputs blocked on chamber cards | Pass |
| Vault crypto remains engine-owned | Pass |

## Phase map

| Phase | Deliverable |
|-------|-------------|
| A | Upload picker + preview host |
| B | Boot settle + registry selects |
| E/C | Workflow outline + gender checklist + from=tree |
| D | Chamber security posture |

## Explicit non-goals

Not a court document · not HSM · not Companion vault tab restore
