# Meme Studio background — Shariah audit (repair)

## Failure
UI chips fell through to **picsum.photos** random stock (and prior unsplash pools), which can return **human portraits** — anti-contract for an educational Islamic meme desk (“scenery only · no prophet likeness”).

## Sources of failure
1. `clarity-core-block-8.js` `memeFetchBg` fallback → `picsum.photos/seed/...`
2. `companion-banner-craft-v1.js` “SAFE” pools still mixed **picsum** for nature/night/water/flowers/spirit

## Repair
`companion-meme-shariah-bg-v1.js`:
- Overrides `memeFetchBg` / `__memeOnlineFetch` / sample loaders
- **Allowlist:** `upload.wikimedia.org`, same-origin only
- **Blocklist:** picsum, unsplash, loremflickr, placeholders
- Pools: nature · holy (Haramain) · night sky · water · geometric · blank
- AI/scene pills map to **holy/nature** (no random generative people BG)
- Reclaims override if core reassigns

## Deploy
1. Upload `/companion/assets/companion-meme-shariah-bg-v1.js`
2. Add before `</body>` on companion `index.html`:
   ```html
   <script src="/companion/assets/companion-meme-shariah-bg-v1.js?v=20261104MS"></script>
   ```
3. Hard refresh · open Meme Studio · try Nature / Holy / Night — no people stock

Educational only — not a fatwa.
