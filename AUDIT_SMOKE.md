# C21F audit · enriched footer + Write to Clarity (Craft hub)

**Bismillah.** Educational only — not a fatwa.

## Scope
- `/craft/` landing only (stations untouched)
- Enriched **app-wide footer pattern** (Craft first): room pills · Quran.com/Sunnah.com · edu stamp · build line
- Write to Clarity SSR + hydrate (`room: craft`)

## Multi-cycle sim
| Cycle | Focus | Result |
|-------|--------|--------|
| 1 | Isolation · 6 plaques · no companion-inline | PASS |
| 2 | Footer links · sources · CSS | PASS |
| 3 | Write SSR · API · timeout · order before footer | PASS |
| 4 | Sources section · registry · nav non-regression | PASS |
| 5 | No Port ID collisions | PASS |

**FAIL_COUNT: 0 · GREEN**

## Live checks
- `POST /api/feedback` → ok (craft room payload test)
- New assets 404 until deploy (expected)
- Existing `craft-atelier-v1.css` + registry **200**

## Deploy order
1. `/craft/assets/craft-enriched-footer-v1.css`
2. `/craft/assets/craft-write-to-clarity-v1.css`
3. `/craft/assets/craft-write-to-clarity-v1.js`
4. Replace `/craft/index.html`
5. Hard refresh

Educational only — not a fatwa.
