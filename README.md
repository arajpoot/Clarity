# Companion link rescue v3

Wa ʿalaykum as-salām.

## Live status
Unfreeze v2 is deployed, but Companion can still feel frozen: overlays / shell landing / pointer-events races leave tabs or links unclickable. Static HTML still ships every tab as `display:none`.

## Fix
Inline `clarity-companion-link-rescue-v3` (last in body):
- Force companion mode
- Kill gate/welcome overlays (pointer-events none)
- Show `#main-content` + active hash tab
- Re-enable pointer-events on links/buttons in main
- Rebind rail + `clarityOpenSectionDoor`
- MutationObserver: if main is hidden again → re-run

## Deploy
Replace root **`index.html`**. Hard-refresh + clear site data once.

## Smoke
10/10 tab cycles — main clickable, correct panel, overlays dead.
