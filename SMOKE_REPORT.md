# G4 pack polished smoke

## Cycles
1. Structure thin+mount+boot
2. Fragment scripts stripped (innerHTML-safe)
3. Inline scripts → companion-frag-inline-v1.js
4. Sequential script load after mount
5. Richness markers present in fragment
6. Governance contract written

## Result
PASS

## Manual smoke after deploy
- /companion/ loads UI (not stuck on Loading)
- window.__PACK_BOOT_LOG → mounted, js-ok…, scripts-done
- Commands / Samiʿnā / Ilm / path tiles
- Backup path works if fragment blocked
