# Companion Room Contract — G0 (aligned to live 2026-11-06)

**Room:** `/companion/` only  
**Campus / Yawm / Amānah:** FROZEN — do not edit  

## Richness kept (contract)

- Four-path tracks (Seeker · New Muslim · Daily · Da’i) + path-governance allow map  
- Banner suite: viewport · mobile · desktop · controls · plaques · enrich · Haramain temps · Live/stills · Qur’an stream  
- Craft: tajweed / calligraphy / meme (craft-core + meme bridge + meme-studio-fix)  
- Shell: unfreeze, tab persist, room-nav  
- Shariah + error guards  
- Room-owner spine packs (overlays · feature · path · aux) — **not** full sticky thrash  

## One-owner rules

| Concern | Owner on live |
|---------|----------------|
| Boot claim / legacy no-op flags | `companion-room-owner-v1` |
| Path card allow/deny | `companion-path-governance-v1` (+ path-progress) |
| Banner chrome | banner-* module chain (viewport → … → enrich) |
| Shell visibility | `clarity-companion-unfreeze-v3` |
| Tabs | `companion-tab-persist-v35` |
| Meme API gaps | `clarity-meme-api-bridge-v1` + `companion-meme-studio-fix-v1` |
| Tracks placement | G1 integrity: **under banner** |

## Boot order (G1)

1. companion-boot-v2  
2. companion-boot-shim-v1  
3. companion-room-owner-v1  
4. shariah-guard · error-guard  
5. banner viewport → mobile → desktop → controls → plaques → enrich → haramain-temps  
6. room-nav · unfreeze · tab-persist  
7. meme bridge · craft-core  
8. path-progress · path-governance · grave-path curriculum · link-stubs  
9. meme-studio-fix  
10. companion-g1-integrity-v1 (placement + notes door + owner assert)

## Explicitly not owners

Parallel home-grown banner-craft / sleek / stabilize / n34 control / separate a2-spine-loader (room-owner loads packs).

## Smoke

1. Four tracks **below banner**  
2. One top room nav  
3. Amānah rail → Notes panel  
4. Path switch respects governance allow map  
5. Meme backgrounds + Daily verse  
6. Banner still + Live; salah/temps  
7. Jump settles  
8. `/campus/`, `/daily/`, `/amana/` unchanged  

## Change policy

Add richness under an existing owner or craft-core — do not add a second banner or second path gardener.
