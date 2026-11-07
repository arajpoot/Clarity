# Sim cycle · Phase 0–1 · AMANA_UFT_FIQH_P0P1

**Bismillah.** Educational only — not a fatwa.

## Cycle steps

1. **Inventory** — UFT_LOAD_MAP + FIQH_LOAD_MAP captured from live repo HTML.
2. **Doc align** — five-room ARCHITECTURE + NAV contracts drafted (root + amana).
3. **Seal** — Four → Five rooms string patch specified.
4. **Stable bridge** — `amana-uft-viewport-stable-v1.js` written (preview host, registry↔cards, integrity, status, unlock re-boot).
5. **Farāʾiḍ** — Confirmed calc-v3 already binds `TREE_KEY` / `uftRead`; rich study tables remain; no removal.
6. **Repair decisions**

| Issue | Repair | Enrichment impact |
|-------|--------|-------------------|
| Missing `#uft-preview` | ensurePreview() before render | held (reliability) |
| Registry not in cards | syncRegistryToCards() | held |
| Load-order race | boot at 0 / 400 / 1200 ms + unlock event | held |
| Bridge collapse risk | Phase 1 ships stable **additive**; legacy bridges not deleted | never decreases |
| Seal says Four rooms | Patch to Five rooms | held (wording) |
| ARCHITECTURE four doors | Five rooms table + Craft isolation row | held |

7. **Governance gate**
- rooms_touched: amana (+ docs)
- P4: no Companion/Craft/Campus/Yawm feature scripts
- P5: no passphrase paths touched
- enrichment matrix all `held`
- Phase exit requires live smoke on Port + five rooms after deploy

## Live deploy checklist (operator)

- [ ] Copy docs to repo root / amana/
- [ ] Copy stable JS to `amana/assets/`
- [ ] Patch seal strings on tree + fiqh HTML
- [ ] Add script tag for stable v1 after registry-deep
- [ ] Hard refresh /amana/tree/ and /amana/fiqh/
- [ ] Unlock vault → add registry person → confirm render + integrity line
- [ ] Farāʾiḍ → load heirs from tree (if UI control present)
- [ ] Confirm Companion, Yawm, Campus, Craft still load primary shells
- [ ] Fill live SMOKE checkboxes from sim_pass → pass

## Non-goals verified

- No dayn/heirs/notes/wasiyyah code changes in pack
- No Craft meme/tajweed changes
- No Campus curriculum changes
- No share-calculation claim expansion beyond existing educational stamps
