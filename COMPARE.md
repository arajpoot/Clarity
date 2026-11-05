# Companion Meme vs Craft Meme · C16 port

**Bismillah.** Educational only — not a fatwa.

## Companion (rich modal / studio fix)
| Feature | Source |
|---------|--------|
| Curated Unsplash + Wikimedia pools (nature, holy, night, water, flowers, spirit, …) | companion-meme-studio-fix-v1 |
| Shariah note: no people/animals random stock | same |
| Soft fail → solid green | same |
| memeFetchBg / __memeOnlineFetch | same |
| Daily verse, night quote, masnun dua helpers | api bridge + studio fix |
| Auto-scale lines | memeAutoScaleLines |
| PNG download / copy / share | memeDownload, memeCopyPng, memeSharePng |
| RRRA section apply | clarityMemeFill / section chips |

## Craft before C16
| Feature | Status |
|---------|--------|
| Section chips + CraftMemeSource | yes |
| Ratio chips | yes |
| BG chips + online-bg / bg-fetch | yes (thinner pools) |
| Shariah scan script + C15R4 bridge fail-closed | yes |
| Curated companion-grade pools | **missing** |
| Auto-scale / Copy PNG / Next scenery | **missing** |
| Studio-fix soft-fail UX | **missing** |

## C16 brings to Craft
- `craft-meme-studio-enrich-v1.js` — port of companion studio fix  
- **Every** pool URL load via `govScanUrl` → `clarityShariahScanUrl` (fail closed)  
- `__memeOnlineFetch` prefers curated POOLS + scanned load  
- UI: Copy PNG · Auto-scale text · Next scenery  
- Full prior stack retained (shariah → enrich → online-bg → … → bridge)

Better than companion for governance: fail-closed scan is mandatory on Craft paint path, not only commentary in comments.
