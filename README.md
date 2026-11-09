# Clarity · Meme Studio upgrade · C19MEME1

**Bismillah.** Educational only — not a fatwa.

## Architecture review (summary)

| Stage | Role | C19MEME1 fix |
|-------|------|----------------|
| Section sources (RRRA) | Pack lines → canvas + desks | Unchanged; still governed |
| Background pills | Online scenery | **Scenery-only** (nature/night/water/flowers/solid); holy/free hidden; hardened fetch + fallbacks |
| Canvas / ratios | Export PNG | Unchanged |
| Desks 𝕏 + Facebook | Caption boxes | **Post-ready format** + one-button intents |
| Layout | Tool page | Banner + media daʿwah charter + automation bar |

## New automation
- **Daily pack** — rotates Reminder/Reality/Reflection/Action by day · pulls matching scenery · fills desks  
- **Fill desks** — formats text for X (≤280 + stamp) and Facebook  
- **1-click Tweet 𝕏** — fills desk, prefills twitter.com/intent/tweet
- **1-click Facebook** — fills desk, copies caption, opens Facebook sharer  
- Fetch: Wikimedia Commons landscape queries → picsum seed → solid gradient fallback  

## Package
```
craft/meme/index.html
craft/assets/craft-meme-automation-v1.js
docs/MEME_DEPLOY.md
governance/ + smoke/
```

Existing meme vendor scripts stay on the live site; this pack upgrades the shell and injects automation.


## Canvas paint standard (C19MEME1)
- Arabic (Amiri) top · English (Georgia) center · reference bottom
- Gold double border + corner ticks + vignette
- `craft-meme-paint-standard-v1.js` hooks `memeDraw`

### Post caption standard
Same layers as canvas: Arabic → English → (Qur’an x:y) → `clarity-dawah.fyi · educational only —`
Desks auto-sync when canvas paints.
