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
- **Post-ready → 𝕏 / Facebook** — opens share intents with formatted caption  
- Fetch: Wikimedia Commons landscape queries → picsum seed → solid gradient fallback  

## Package
```
craft/meme/index.html
craft/assets/craft-meme-automation-v1.js
docs/MEME_DEPLOY.md
governance/ + smoke/
```

Existing meme vendor scripts stay on the live site; this pack upgrades the shell and injects automation.
