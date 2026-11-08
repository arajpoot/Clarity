# Housekeeping repair · pedigree hydrate + fiqh dedupe

**Bismillah.** Build: `AMANA_UFT_AD_HK_20261108`

## Issues (from live screenshots)

1. Full tree JSON import showed status success but pedigree stage stayed “Pedigree empty” while registry list had members.
2. Farāʾiḍ page stacked multiple “Tree outline for study” + workflow panels.

## Fixes

| Fix | File |
|-----|------|
| Hydrate self/father/mother/children from registry roles after import | `amana-uft-upload-fix-v1.js` |
| Prefer `uftApplyData` for full redraw | same |
| On tree load, if stage empty but storage has people → apply + hydrate | `amana-uft-fiqh-housekeep-v1.js` |
| Hide duplicate outline panels on fiqh | same |

## Governance

Amānah-only · same storage keys · educational only · enrichment workflow retained · not a fatwa.
