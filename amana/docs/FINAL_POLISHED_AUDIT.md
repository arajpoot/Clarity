# Amānah UFT · final polished audit

**Bismillah.** Build: `AMANA_UFT_POLISHED_20261108`  
Live verified: clarity-dawah.fyi `/amana/tree/` + assets HTTP 200

## Live deployment checklist

| Asset | Live |
|-------|------|
| registry-ui-unity-v1.js (UU1) | Present |
| build-repair-v1.js (RU1) | Present |
| upload-fix-v1.js (HK1) | Present |
| phase A/B/C/D + housekeep + workflow | Present |
| Legacy dual grid wrapped `display:none` | Present |

## Multi-cycle sim (live JS × 5)

| Check | Result |
|-------|--------|
| Registry → self/father/children map | 5/5 PASS |
| Registry dedupe | 5/5 PASS |
| No “Upload member cards first” alert | 5/5 PASS |
| Upload picker click | 5/5 PASS |
| Farāʾiḍ workflow strip | 5/5 PASS |
| Storage keys allowed only | 5/5 PASS |
| **LIVE_MULTI_CYCLE** | **5/5 PASS** |

## Governance contract

| Rule | Status |
|------|--------|
| Amānah owns tree / fiqh | Pass |
| Companion / other rooms untouched by this pack | Pass |
| Tree key `clarity_user_family_tree_v1` | Pass |
| Cards key only as sync from registry | Pass |
| Outline key study-only | Pass |
| Educational / not fatwa / not legal pedigree | Pass |

## Enrichment clause

| Item | Status |
|------|--------|
| Workflow Tree → Farāʾiḍ | Active |
| Binding share engine change | None |
| Opt-in outline / load heirs | Yes |

## Security posture (Phase D)

No passphrase in UFT modules · soft-clear import status · educational stamps retained.

## Operator smoke (browser)

1. Hard-refresh `/amana/tree/` (unlocked).  
2. One registry panel: “1 · Member registry — add · link · build”.  
3. Upload full tree JSON **or** use existing registry → **Build tree** → no cards alert.  
4. Pedigree shows focus/parents/children when roles exist.  
5. `/amana/fiqh/` — single workflow/outline cluster; Load heirs study aid only.
