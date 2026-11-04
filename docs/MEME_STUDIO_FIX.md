# Meme Studio fix — layout + Shariah BG + scene-per-verse

## Deploy
1. Upload `companion/assets/companion-meme-studio-fix-v1.js`
2. Before `</body>` on `/companion/index.html`:
```html
<script src="/companion/assets/companion-meme-studio-fix-v1.js?v=20261104MS2"></script>
```

## Behavior
- How-to / scale / options bars moved **above** canvas
- All `memeFetchBg` → Wikimedia-only pools; picsum/unsplash blocked
- Flickr chip retargeted to safe nature
- `clarityMemeSceneForVerse()` picks mood scene from canvas text (night/water/holy/nature…)
- Hooks RRRA fetch / daily verse / Apply+bg

Educational only — not a fatwa.
