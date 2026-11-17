# PORTREVAMP · full-width · Yawm center · video order · tour repair

**Bismillah.** Educational only — not a fatwa.

## Layout changes
1. **Full-width** banner, nav, and all sections (`100vw` / full bleed)
2. **Order:** Command + Saying → **then** Castle intro **video** → How the castle works → room grid
3. **Yawm center pillar** of the castle grid (spans middle; wings: Companion | Amānah, Campus | Craft)
4. **Tour wiring repair:** `port-room-tours-repair-v1.js` uses `data-room` + `data-tour-src`, tries room paths, falls back to castle intro if room MP4 missing (currently only intro is on server)

## Deploy
1. Upload **`index.html`** as site root `/index.html`
2. Upload **`assets/port-room-tours-repair-v1.js`** → `/assets/port-room-tours-repair-v1.js`
3. Hard refresh `/`
4. Optional later: add real room tour MP4s under `/assets/media/tours/{companion,yawm,amana,campus,craft}-tour.mp4`

## Smoke
- Banner edge-to-edge
- Verse/ḥadīth above intro video
- Yawm card larger/center · “heart of the castle”
- ▶ Tour opens modal (intro fallback if room file 404)
- Enter links: /companion /daily /amana /campus /craft

Educational only — not a fatwa.
