# Craft · phased plan (revised 20261104C5)

**Bismillah.** Aligns with four-door ARCHITECTURE and single-rail NAV CONTRACT.

## Phase A — Soft surface (this package) · DONE

- [x] `/craft/` tools landing with glass plaques
- [x] Meme (hosts 𝕏 + Facebook desks)
- [x] Tajweed Deep Studio + on-device level meter (live Companion assets)
- [x] Calligraphy / Quiz / Notes entry plaques
- [x] Room-nav: **add one tile only** to existing four-door rail (no double bar)
- [x] Craft pages load shared room-nav script only (no hardcoded nav)
- [x] Companion calling links preserved
- [x] Governance docs in `docs/`

## Phase B — Root landing (operator)

- [ ] Apply `landing-patch/INDEX_FIVE_DOORS_SNIPPET.html` to root `index.html`
- [ ] Update meta “four rooms” → “five rooms” where present
- [ ] Smoke: five plaques + single five-pill rail on every room

## Phase C — Enrichment (optional)

- [ ] Wire remaining Companion craft modules more deeply into Craft pages
- [ ] ClarityCraftRegistry for cross-room deep links
- [ ] Shariah media guards remain (allowlist, source chips, watermarks)

## Phase D — Decommission (explicit approval only)

- [ ] Remove or redirect in-Companion Meme / Tajweed / Calligraphy hosts
- [ ] Update ARCHITECTURE.md if product navigation wording changes
- [ ] Never merge Yawm / Amānah / Campus into Craft

## Smoke matrix (A)

| Check | Expect |
|-------|--------|
| Existing four-door pages | One rail; Craft tile appears after JS runs |
| `/craft/*` | One rail; Craft marked current |
| No second `.clarity-room-nav` | Always |
| Tajweed meter | Web Audio level only; no upload |
| Meme desks | Copy / open compose only |
| Absolute paths | All asset hrefs start with `/` |
