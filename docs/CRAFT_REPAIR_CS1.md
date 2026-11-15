# Craft modules repair CS1

**Root cause:** Shell mounts Reminder via `innerHTML` → archive meme/callig boot scripts never run → empty canvas / Listening…

**Fix:** `companion-craft-studios-v1.js` mount-safe:
- Paints meme canvas (gradient + text + watermark)
- Loads live `/assets/clarity-meme-canvas-clean-v1.js` when available
- Initializes calligraphy stroke canvas
- Re-runs on every tab remount

Archive3 richness retained via optional script loads; local paint guarantees visible studio even if CDN scripts lag.
