# Craft live integrity · diagnosis · C15R1

**Bismillah.** Educational only — not a fatwa.

## Confirmed deployed (live HTML)
| Station | Build meta | Assets 200 |
|---------|------------|------------|
| meme | C15MEME | ratio, online-bg, shariah, export, wire |
| tajweed | C15TJ | LMR, deep studio, practice-coach |
| calligraphy | C15CG | engine, enhance |
| quiz | C15QZ | craft-quiz present |
| notes | C15NT | recovery present |

## Richness gaps found (sim cycle 1)
1. **Quiz bank path mismatch** — `craft-quiz-v1.js` fetched `/craft/assets/vendor/path-quiz-bank.json` while banks lived under `/craft/assets/data/`. Result: stuck on FALLBACK or “Loading bank…”.
2. **Meme wire C14** ignored `__memeOnlineFetch` — used thin Picsum map only; Holy catalog (Kaaba/Nabawi) from online-bg not applied.
3. **Hub still `?v=20261104C13`** — cache-bust lag; plaque copy still pre-enrich wording.

## Repairs in this pack (cycle 1)
| File | Fix |
|------|-----|
| `assets/craft-meme-wire-v1.js` | C15R1 — prefer `__memeOnlineFetch`; Holy Kaaba fallback URL |
| `assets/craft-quiz-v1.js` | C15R1 — try `data/path-quiz-bank.json` then vendor |
| `assets/vendor/path-quiz-bank.json` | Mirror of data bank for old path |
| `assets/data/path-quiz-bank.json` | Canonical bank |
| `index.html` (hub) | C15R1 cache tags + richer plaque sums |

## Residual risks
- Media-reminder canvas may still paint independently of wire until Preview/push; ratio applies to first canvas found under `#mr-root`.
- Deep studio / LMR need browser mic + DOM hosts; text crawl cannot verify meter motion.
- Calligraphy enhance optional if engine API differs.

## Cycle 2 after deploy
Re-crawl meme Holy chip, quiz progress text, hub `C15R1`.
