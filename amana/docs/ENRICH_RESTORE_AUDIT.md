# Enrichment restore audit (governance)

**Bismillah.** Build: `AMANA_UFT_ENRICH_RESTORE_20261108`

## Self-audit (why enrichment looked “gone”)

| Observation | Cause |
|-------------|--------|
| Status: Full tree JSON imported · 76 unique members | Storage + count from registry/people OK |
| Stage visually empty | `uftPedigreeHtml` draws **backbone + relatives[]** edges, not a flat registry list |
| “Pedigree empty” integrity line | Workspace integrity strip when backbone not filled |
| Registry not shown | Dock collapsed (`Expand`); unity panel may be below fold |
| Enrichment clause risk | Registry→pedigree graph was incomplete after import |

## Fix

`amana-uft-enrich-restore-v1.js`:
1. Absorb people/members/cards into registry  
2. Map roles → self/father/mother/children/siblings  
3. **Build `relatives[]` edges** (child/sibling/uncle/…) for descendant pedigree  
4. `uftApplyData` / render + **expand registry dock**  
5. Hooked after upload + build-repair  

## Governance

| Clause | Status |
|--------|--------|
| Enrichment (workflow + registry→study pedigree) | **Restored** |
| Educational only / not fatwa / not legal pedigree | Pass |
| Amānah-only keys | Pass |
| No Companion mutation | Pass |

## Smoke

Hard-refresh tree after deploy → re-upload JSON or wait auto-restore → stage should show focus/parents/children when roles exist; registry dock expands.
