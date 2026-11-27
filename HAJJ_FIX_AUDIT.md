# Hajj module fix audit (pre Phase 3)

## Issues from live screenshot
- Where am I / Done / Undo appeared non-functional
- Likely cause: Action tab mounted into `#cs-mount` without re-executing tab `defer` scripts; globals never bound

## Fixes
1. Durable `window.hajjWhereAmI` / `hajjMarkDone` / `hajjMarkUndone` / `hajjShowStep` overwritten on every boot
2. `MutationObserver` + interval boot when `#hajj-step-select` appears after shell mount
3. Extra `click` listeners on action buttons (not only inline onclick)
4. Progress text matches live UX: `Progress: N / M marked on this device · educational only — not a fatwa`
5. Checklist items clickable → jump to step
6. Module also referenced from Companion shell `index.html` so API exists before tab HTML
7. Mobile button row: flex-wrap, 50% min-width on small screens

## Deploy
```
companion/index.html
companion/tabs/action/index.html
companion/assets/companion-hajj-steps-v1.js
companion/assets/companion-hajj-steps-v1.css
companion/assets/companion-hajj-ihram-panel-v1.js
companion/assets/companion-hajj-ihram-panel-v1.css
```

Purge `/companion/*`. Hard refresh. Test:
1. Action → Ḥajj → change Step → panel updates + citations
2. Where am I → selects next unmarked
3. Done → marks + advances
4. Undo → clears mark
5. Open checklist → items toggle jump
6. Do/avoid panel still present

Educational only — not a fatwa.
