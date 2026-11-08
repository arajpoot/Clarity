# M5b · Tree performance only (no feature cut)

## Problem
`/amana/tree/` loaded ~20 UFT scripts as separate deferred tags — parse/network contention on mobile.

## Fix
`amana-uft-batch-boot-v1.js` loads the **same** modules in waves:

1. **CORE** — `clarity-amana-uft-v1.js` + `clarity-uft-full-restore-v1.js` (full pedigree)
2. **WAVE2** — registry, viewport, dock, layout, file ops, workspace, build viewport
3. **WAVE3** (idle) — PNG, fiqh bridge, classic boost, housekeep, tree lines, UI order, glass plaque, branch, day-close

## Unchanged
- All pedigree / registry / export features retained
- Other Amānah sections untouched
- Educational only — not a fatwa
