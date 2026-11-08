# UFT build-tree + registry de-dupe repair

**Bismillah.** Build: `AMANA_UFT_BUILD_REPAIR_20261108`

## Problems (screenshots)

1. Registry list populated (many names) but pedigree stage still empty / only role labels.
2. Double registry field sets / duplicate name rows after JSON load.
3. Step 4 “Build tree” did not pull registry names into backbone slots.

## Fixes (`amana-uft-build-repair-v1.js`)

| Action | Detail |
|--------|--------|
| Registry dedupe | Merge same name+role; keep phone/email |
| Role → backbone map | self, spouse, parents, GP, children, siblings, grandchildren |
| Auto-apply | When registry has people and backbone empty |
| Build chip | Triggers suggest + apply / repair apply |
| Upload hook | Calls `uftBuildRepairApply` after import |

## Governance

Same keys · Amānah tree only · educational outline · not a legal pedigree.
