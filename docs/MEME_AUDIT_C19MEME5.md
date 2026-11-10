# Meme Studio integrity audit · C19MEME5

## Live findings (pre-fix)
| Issue | Detail |
|--------|--------|
| Double paint | Multiple owners: `paint-standard`, `wire.paintWithBg`, `atelier.paint`, `phase-bc.paintWithStoredBg`, `canvas-clean` own `fillText` |
| Version typo | `paint-standard` query `C19MEME4f` |
| Stale scripts | `atelier` / `phase-bc` / `bench-logic` still on page from C18 era |

## Fix
1. **paint-standard** reasserts `memeDraw` ownership + `neutralizeLegacyPainters()` at 0/400/1200ms and on load
2. **atelier / phase-bc / canvas-clean** neutered → only call `memeDraw`
3. **wire** paint routes forced to standard
4. Cache bump **C19MEME5**

## Richness retained
Urdu layer · scale panel · scenery resolve · automation desks · gold frame · RRRA sources

## Governance
Educational only — not a fatwa. Craft self-contained.
