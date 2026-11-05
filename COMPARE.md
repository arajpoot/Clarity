# Companion / Lab Tajweed vs Craft · C16TJ

**Bismillah.** Educational only — not a fatwa · not a qāriʾ verdict.

## Companion / Lab richness
| Feature | Where |
|---------|--------|
| Full LMR DOM (verse/rule modes, pull āyah, listen/match/record/focus, meter, score, log) | Companion `#tj-lmr` panel |
| Deep studio rules + samples + audio/YT hints | Companion + `nx-tajweed-deep-studio` |
| Daily tajweed module card | Companion |
| Learning path / lecture embeds | Companion |
| Practice coach tips | Lab / vendor `practice-coach.js` |
| ClarityTajweedStudio.open(root) simple booth | `tajweed-studio-v1.js` |

## Craft before C16TJ
| Feature | Status |
|---------|--------|
| `#tj-booth-root` + studio boot | yes |
| Scripts: deep studio, LMR, coach, restore | **present (200)** |
| LMR host DOM (`#tj-lmr-surah`, steps, record…) | **empty** — LMR could not bind |
| Local meter fallback only | yes |
| Practice log empty shell | yes |

## C16TJ brings
- `craft-tajweed-lmr-shell-v1.js` — injects Companion-grade LMR host into `#tj-lmr-host`
- Page **C16TJ** loads shell **before** `nx-tj-lmr-js-v1`
- Coach host slot + gov educational note
- Isolation: Craft only · no companion-inline · no fatwa claim

Does **not** re-embed full Companion path/lecture fortress (stays on Companion); Craft remains the practice workbench.
