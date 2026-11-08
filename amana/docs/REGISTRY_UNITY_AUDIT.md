# Registry unity + Build tree gate removal

**Bismillah.** Build: `AMANA_UFT_REGISTRY_UNITY_20261108`

## Governance contract

| Rule | Status |
|------|--------|
| Amānah owns `/amana/tree/` | Pass |
| Keys only tree + cards (sync) | Pass |
| Educational / not legal pedigree | Pass |
| Companion untouched | Pass |

## Bug

`uftApplyBuildFromCards` / `uftSuggestBuildFromCards` in full-restore:

```js
if (!cards.length) { alert('Upload member cards first.'); return; }
```

User had full **registry** (70+ names) but **0 loaded cards** → Build tree alert, empty pedigree.

## Fix

- Override both functions: **registry is source of truth**
- `syncRegistryToCards()` fills cards from registry (deduped)
- `mapRegistryToBackbone` + `uftApplyData` draws pedigree
- Build tree chip uses override (capture phase)
- Multi-cycle sim: 4/4 no alert, self/father/children set

## Single path

Registry list → (optional sync to cards) → backbone slots → pedigree render.  
Member-cards upload remains optional enrichment, not a gate.
