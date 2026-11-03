# Phase 0 — Freeze & inventory · Companion only

**Bismillah.** Date: 2026-11-03 · Repo: arajpoot/Clarity · tree `56e3eb17dacc`

## Scope lock

| Path | Action |
|------|--------|
| `/campus/**` | **FROZEN** — no edits this program |
| `/amana/**` | **FROZEN** — no edits this program |
| `/companion/**` | Inventory + later repair phases |
| `/daily/` (Yawm / Now) | SoT for pulse — do not re-absorb into Companion |

## Campus untouched fingerprint

- Campus blobs: **296** · bytes ≈ **1211172**
- SHA-256(path:sha list): `6b0be926a02be72dbb168209d098151f2add5c4ca1f06b063964122813c612b2`

Recompute after any commit; if this hash changes, Phase 0 lock was broken.

## Companion `index.html` surface

- Size: **215110** bytes
- External `<script src>`: **67** (57 active · 10 `text/plain` / rb-skip)
- CSS hrefs: **19**
- Named inline scripts: rb-companion-boot, gate-obliterate-js, daily-isolate-js, companion-phase-controller, clarity-shariah-source-guard-v1, clarity-error-guard-v2, clarity-ld-json-publish, clarity-ld-json-primary, clarity-madinah-autoplay-v1, clarity-banner-repair-v1, clarity-surah-continue-v1, clarity-path-night-fix-v1, clarity-path-reset-js-v1, clarity-perf-loader-v1, clarity-surface-polish-v1, clarity-icons-links-polish-v1, clarity-companion-polish-v1-js, clarity-companion-repair-v1, clarity-lite-boot-shim, nuros5-shariah-js-v2, clarity-embed-fold-viewport-v1, clarity-tajweed-read-sync-v1, clarity-quick-nav-v1, clarity-tab-persist-v1, clarity-rrra5-core-js-v1, clarity-callig-pad-boot-v1, clarity-online-sitewide-v1, clarity-rrra5-legacy-cleanup-v1, clarity-section-pills-js-v1, clarity-path-nuclear-v1, clarity-pedigree-plaque-js-v1, clarity-doors-flow-js-v1, clarity-allow-guard-v1, clarity-live-harden-v1, clarity-uft-viewport-recover-js-v1, clarity-amana-backup-guidance-v1, clarity-amana-hardening-v1, clarity-vault-fix-js-v1, clarity-uft-print-fix-v2-js, clarity-vault-security-harden-v1, clarity-vault-note-registry-js

### Role counts

| Role | Count |
|------|------:|
| feature | 29 |
| craft | 11 |
| dead | 10 |
| boot | 8 |
| shell | 8 |
| telemetry | 1 |

### Script manifest (role tags)

| Role | Path | Skip |
|------|------|------|
| shell | `/companion/assets/clarity-banner-av-v1.js` |  |
| shell | `/assets/room-nav/clarity-room-nav-v1.js` |  |
| boot | `/assets/companion-inline/inline-clarity_shariah_source_guard_v1.js` |  |
| boot | `/assets/companion-inline/inline-clarity_error_guard_v2.js` |  |
| boot | `/assets/companion-inline/inline-clarity-micro-boot-v1.js` |  |
| shell | `/assets/companion-inline/inline-bundle-nuros-v1.js` |  |
| boot | `/assets/companion-inline/inline-clarity-shell-v3.js` |  |
| dead | `/assets/companion-inline/inline-clarity-landing-v3.js` | yes |
| shell | `/assets/companion-inline/inline-clarity_madinah_ap.js` |  |
| shell | `/assets/companion-inline/inline-clarity_banner_repair.js` |  |
| shell | `/assets/companion-inline/inline-clarity_banner_moon_v1.js` |  |
| shell | `/assets/companion-inline/inline-clarity_surah_cont.js` |  |
| feature | `/assets/companion-inline/inline-clarity_path_plaques_v1.js` |  |
| feature | `/assets/clarity-path-progress-v1.js` |  |
| feature | `/assets/clarity-grave-path-curriculum-js.js` |  |
| feature | `/assets/companion-inline/inline-clarity_path_night_fix_v1.js` |  |
| dead | `/assets/companion-inline/inline-clarity_path_reset_v1.js` | yes |
| feature | `/assets/companion-inline/inline-clarity-perf-loader-v1.js` |  |
| feature | `/assets/companion-inline/inline-clarity_surface_polish_v1.js` |  |
| feature | `/assets/companion-inline/inline-clarity_icons_links_polish_v1.js` |  |
| feature | `/assets/companion-inline/inline-clarity_companion_polish_v1.js` |  |
| feature | `/assets/companion-inline/inline-clarity_companion_repair_v1.js` |  |
| feature | `/assets/companion-inline/inline-96908bb2ed.js` |  |
| feature | `/assets/clarity-link-stubs-v1.js` |  |
| feature | `/assets/companion-inline/inline-42564f0868.js` |  |
| feature | `/assets/companion-inline/inline-982b3dbd78.js` |  |
| feature | `/assets/companion-inline/inline-clarity_embed_fold.js` |  |
| craft | `/assets/companion-inline/inline-clarity_lmr_read_sync.js` |  |
| feature | `/assets/companion-inline/inline-clarity_quick_nav.js` |  |
| feature | `/assets/companion-inline/inline-clarity_tab_persist.js` |  |
| feature | `/assets/companion-inline/inline-clarity_rrra5_core.js` |  |
| boot | `/assets/companion-inline/inline-clarity_callig_pad_boot.js` |  |
| feature | `/assets/companion-inline/inline-clarity_online_sitewide_v1.js` |  |
| feature | `/assets/companion-inline/inline-clarity_rrra5_legacy_cleanup_v1.js` |  |
| feature | `/assets/companion-inline/inline-clarity_section_pills_v2.js` |  |
| dead | `/assets/companion-inline/inline-clarity_path_nuclear_v1.js` | yes |
| feature | `/assets/companion-inline/inline-clarity_pedigree_plaque_v1.js` |  |
| feature | `/assets/companion-inline/inline-clarity-doors-flow-js-v1.js` |  |
| feature | `/assets/companion-inline/inline-322398e3fd.js` |  |
| boot | `/assets/companion-inline/inline-clarity_live_harden_v1.js` |  |
| feature | `/assets/companion-inline/inline-clarity_uft_viewport_recover.js` |  |
| dead | `/assets/companion-inline/inline-clarity_amana_backup_guide.js` | yes |
| dead | `/assets/companion-inline/inline-clarity_amana_hardening.js` | yes |
| dead | `/assets/companion-inline/inline-clarity_vault_fix.js` | yes |
| feature | `/assets/companion-inline/inline-clarity_uft_print_fix_v2.js` |  |
| dead | `/assets/companion-inline/inline-clarity_vault_harden_v1.js` | yes |
| dead | `/assets/companion-inline/inline-clarity_vault_note_registry.js` | yes |
| telemetry | `https://static.cloudflareinsights.com/beacon.min.js/vce701823e78c4301a35b7e07294d87301792088814092` |  |
| feature | `/assets/nuros-icons-apply-v1.js` |  |
| craft | `/assets/companion-inline/inline-bundle-meme-v1.js` |  |
| boot | `/assets/companion-inline/inline-bundle-security-v1.js` |  |
| feature | `/assets/companion-inline/inline-clarity-qada-tracker-v1.js` |  |
| feature | `/assets/companion-inline/inline-clarity-samina-verse-v1.js` |  |
| shell | `/assets/companion-inline/inline-clarity-final-surface-v1.js` |  |
| craft | `/companion/modules/inline-clarity_lmr_read_sync.js` |  |
| craft | `/companion/modules/inline-nx-tajweed-deep-studio-js-v1.js` |  |
| craft | `/companion/modules/nx-tj-lmr-js-v1.js` |  |
| craft | `/companion/modules/inline-clarity-meme-canvas-clean-v1.js` |  |
| craft | `/companion/modules/inline-clarity-meme-online-bg-v1.js` |  |
| craft | `/companion/modules/inline-clarity_meme_unlock_v2.js` |  |
| craft | `/companion/modules/inline-clarity_meme_push_cards.js` |  |
| craft | `/companion/modules/inline-clarity-tj-meme-tweet-revamp-js.js` |  |
| feature | `/companion/modules/clarity-notes-recovery-v1.js` |  |
| craft | `/companion/modules/inline-bundle-meme-v1.js` |  |
| boot | `/companion/modules/inline-clarity_callig_pad_boot.js` |  |
| dead | `/companion/modules/inline-clarity_vault_note_registry.js` | yes |
| dead | `/companion/assets/clarity-vault-fortify-boot-v1.js` | yes |

## Now / Yawm boundary (confirmed)

- **SoT:** `/daily/modules/now/` (+ deed, adhkar, tasbeeh, salah, light)
- Companion sets `__CLARITY_SKIP_DAY_LANDING__ = true`
- CSS `#yawm-sot-hide-day-landing` hides day-landing stack
- `inline-clarity-landing-v3.js` is **rb-skip** (not executed)
- Prefetch `/daily/` present
- **Conflict risk:** `daily-isolate-js` still tries `land.style.display="block"` on `#clarity-day-landing` — Phase 1 should neutralize

## Freeze-related findings (Phase 1 input)

- rb-companion-boot scrubs day-landing/amana-vault and forces tab-reminder
- Competing CSS: yawm-sot-hide-day-landing vs daily-isolate-js that may display:block landing
- Vault scripts mostly type=text/plain data-rb-skip — good isolation
- Still ~50+ active external scripts — Phase 2 consolidation target

## Phase 0 exit criteria

- [x] Campus fingerprint recorded
- [x] Full script role map for companion/index.html
- [x] Yawm Now confirmed as daily SoT; Companion skip flags documented
- [ ] Human: no commits under campus/ or amana/ until Phase 6 ship

## Next → Phase 1

Single unfreeze path; remove display:block race on day-landing; ensure `#main-content` + reminder tab visible; keep campus hash identical.

Educational only — not a fatwa.