# Companion unfreeze v2

## Live freeze cause
All tab panels ship with `display:none`. Shell can stay on `landing` with `#main-content` hidden. Dayn/contain races do not open a tab — UI looks frozen.

## Fix (inline in index.html)
`clarity-companion-unfreeze-v2` runs multi-pass:
1. Force `data-shell-mode=companion` (+ storage)
2. Unlock pointer-events
3. Show `#main-content`
4. Open hash tab or **reminder**
5. Scrub Dayn outside vault
6. Bind `clarityOpenSectionDoor`

## Deploy
Replace root **`index.html` only**. Hard-refresh / clear site data once.

## Smoke
10/10 tab hash cycles — main visible, correct panel, companion mode.
