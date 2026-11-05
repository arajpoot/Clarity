# Craft room richness · C12 · self-contained

## Sources scanned
- `assets/craft/*` (tajweed-studio, calligraphy-studio, meme-bg-fetch, share-desks, media-reminder, craft-bridge)
- `assets/nx-tajweed-deep-studio-*`
- `companion/assets/clarity-meme-api-bridge-v1.js`
- `assets/curriculum/shared/*quiz-bank.json`
- `campus/lab/calligraphy/*`, `lab/tajweed/practice-coach.js`

## Mounted into `/craft/assets/vendor/`
All tools load **local vendor copies** under `/craft/` so the room works without Campus Lab as a dependency.

| Tool | Enrichment |
|------|------------|
| Tajweed | `ClarityTajweedStudio.open` + nx deep studio + practice coach + meter |
| Calligraphy | `ClarityCalligraphy.open` + enhance + quick pad fallback |
| Meme | Section sources + Media Reminder studio + share desks + meme API bridge + bg-fetch |
| Quiz | Fallback bank + module/path curriculum JSON |
| Notes | Local tagged log (already on-device) |

Educational only — not a fatwa. Isolation doors unchanged; Craft remains soft fifth surface.
