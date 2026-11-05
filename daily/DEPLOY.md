# Yawm Restore · Phase 0–4 · Deployment Pack

**Bismillah.** Educational only — not a fatwa.

Build: **20261104Y2R** (Phases 0–4 complete)

## What this pack restores
- Enriched `/daily/index.html` — full banner (ʿAṣr plaque + gravity), dual path tiles, module hub, surface cards
- Banner image, surface CSS/JS, isolation guard, theme fallback
- Six modules: now · deed · adhkar · tasbeeh · salah · light
- Adhkār JSON, deed/fard/protection/send-light data
- Full nuros icon set

## Contracts (locked — Phase 1)
- Edit **only** under `/daily/`
- No companion-inline · no craft · no campus desk JS
- Four doors: Companion · Yawm · University · Amānah
- Storage: `clarity.daily.*`
- Isolation guard active

## Wiring polish (Phase 3)
- Relative isolation + theme fallback scripts
- Theme key: `clarity.daily.theme.v1`
- Module links relative; dual tiles absolute to room roots

## Quick install (Phase 4)
1. **Backup** current live `/daily/` (or git branch).
2. Replace the entire live `/daily/` tree with this pack’s `daily/` folder.
3. Confirm relative paths resolve (banner, CSS, JS, modules).
4. Hard-refresh / purge CDN cache.
5. Run smoke checklist below.

## Smoke checklist (must PASS)
- [ ] Banner image + verse plaque + gravity line visible
- [ ] Dual path tiles present and link correctly
- [ ] Six module doors open (`/daily/modules/...`)
- [ ] Theme toggle works (persists on this device)
- [ ] Room nav four doors; Yawm marked current
- [ ] Isolation: Network tab shows no companion-inline scripts
- [ ] Educational stamps present
- [ ] Mobile: no horizontal overflow; tiles stack cleanly

## Rollback
Revert to the previous `/daily/` snapshot if any smoke item fails.

Campus / Amānah / Companion core remain untouched.
