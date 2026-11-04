# Companion Stability Charter — S0

**Date:** 2026-11-04  
**Room:** Companion only (`/companion/`)  
**Campus / Amānah / Yawm:** FROZEN — do not edit

## Goal
Campus-like stability: small boot surface, one owner per concern, allowlisted assets, smoke sheet.

## One-owner rules

| Concern | Owner | Must not compete with |
|---------|--------|------------------------|
| Shell / main visible | `clarity-companion-unfreeze-v3` | day-landing scripts |
| Tabs | `companion-tab-persist-v35` | legacy tab persist (skipped) |
| Learning tracks (4 tiles) | `/assets/companion-track-unhide` + tiles CSS | home-grown track CSS fights |
| Banner data (salah/hijri/temps/live) | `/assets/.../inline-clarity-banner-restore` | banner-craft, banner-control, integrity, av |
| Banner chrome CSS | revamp CSS via allowlist + restore-v1 absolute sides | stacked sleek/craft/stabilize |
| Meme background | `/assets` meme-bg-fetch + shariah-bg | parallel memeFetchBg inventors after allowlist |
| Meme missing onclicks | `clarity-meme-api-bridge` | — |
| Notes door | unity-v2 / restore → `#tab-notes` | vault gate chrome on companion |
| Craft richness | a2 spine (optional) + craft-core | sticky-harden (already skipped) |

## Boot order (S1)

1. `companion-boot-v2.js`
2. `companion-assets-allowlist-v1.js` → root `/assets` allowlist
3. `clarity-companion-unfreeze-v3.js` + CSS
4. `companion-tab-persist-v35.js`
5. `companion-unity-v2` + `companion-restore-v1` (doors, gates, sides)
6. `clarity-meme-api-bridge-v1.js`
7. `companion-craft-core-v1.js`
8. `companion-a2-spine-loader-v1.js` (craft packs; sticky skipped)

## Explicitly stripped (S1)

Home-grown / duplicate: banner-craft JS, banner-sleek JS, stabilize JS, banner-control, nav-clean, banner-integrity, banner-av, unity-v1, selected polish inlines.

## Campus lock

Do not modify:

- `/campus/**`
- campus load maps / curriculum workers unless a separate campus task

## Smoke sheet (must pass before feature work)

1. One top room nav (no surface-doors row)
2. Four track tiles visible (Seeker, New Muslim, Daily, Da’i)
3. Reminder default; hash tab persist
4. Amānah / Notes door shows notes hub
5. Meme: background chip → image; Daily verse no ReferenceError
6. Banner: still image; Live toggles; salah list populates
7. No continuous viewport jump after ~2s
8. `__ALLOWLIST_LOG` ends with `done`

## Change policy

- New feature → add to allowlist or craft-core, not a new parallel *owner*
- If something breaks smoke → revert that module, don’t stack another patch
