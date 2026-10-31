# Companion Repair B · Shell-race freeze

Bismillah. Educational only — not a fatwa.

## Live finding
SA1 **was deployed**, but **shell-v3** still defaults/`setMode("landing")` and adds `shell-landing-hide` to every tab panel. Authority at end of body lost the race → frozen Companion links.

## Second phased plan (implemented)

| Phase | Fix |
|-------|-----|
| **B1** | Critical **CSS** in `<head>`: companion mode forces `#main-content` + active tab visible/clickable |
| **B2** | **Mode lock** early in head: `enter=companion` / dest / tab hash → `data-shell-mode=companion` before shell |
| **B3** | **Shell neutralizer**: `ClarityShell.setMode("landing")` → `companion` when dest is companion |
| **B4** | **Authority SA1B**: 8s rAF pulse, `style.cssText` !important, re-open tab after shell hide |

## Deploy
Replace root **`index.html`**. Hard-refresh + **clear site data** once.

## Smoke
Static B1–B4 present · **10/10** runtime cycles after simulated shell hide race · `allOk: true`
