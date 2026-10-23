# University cleaning plan (20261023CLEAN)

Companion: **untouched**

## Found (live scan)

### Free-loaders / dual buses (were loading on pages)
- `cu-campus-progress-v1.js` + `cu-seq-progress-v1.js` (dual truth)
- `cu-no-guides-v1.js`, `cu-dedupe-chrome-v1.js`, `cu-shell-n1.js`
- `cu-student-status-v1.js`, `cu-chrome-canonical-v1.js` on faculty/bots/grading
- Desk hub contained Junior reference noise

### Dead skeletons (exist on origin, not needed for seq desk)
- campus/assets/js/cu-no-guides-v1.js — hide guides dock; not needed on seq pages
- campus/assets/js/cu-dedupe-chrome-v1.js — old chrome dedupe; sequential pages clean
- campus/assets/js/cu-shell-n1.js — legacy shell JS (CSS may still load)
- campus/assets/js/cu-student-status-v1.js — old status; seq desk has You are here
- campus/assets/js/cu-chrome-canonical-v1.js — extra chrome layer on faculty/bots
- campus/assets/js/cu-campus-progress-v1.js — dual progress bus; seq is sole source of truth
- campus/assets/js/cu-seeker-units-v1.js — content source only; not loaded (modules have depth)
- campus/assets/js/cu-seeker-surface-v1.js — old seeker UI
- campus/assets/js/cu-uni-progress-v1.js — superseded by cu-seq-progress-v1
- campus/assets/curriculum/seeker.js — old curriculum loader
- assets/curriculum/vault/foundation/college-seeker.js — Junior track; not on seq desk
- campus/assets/js/cu-personas-rp6.js — personas dock; optional later
- campus/assets/js/cu-guides-close-r2.js — guides sticky fix; guides not on desk

## Phases (this package implements C1–C4)

| Phase | Action | Smoke |
|-------|--------|-------|
| C1 | Inventory | Live script map |
| C2 | Strip junk script tags from University HTML | Pages load fewer JS |
| C3 | Sole progress = `cu-seq-progress-v1` | Mark done advances one bus |
| C4 | Keep modules/desk/campus/faculty/bots/grading | Locks + Continue |

## Do NOT delete from GitHub yet
Quarantine files may still be referenced by portal/lab/old bookmarks. This package **stops loading** them on seq pages. Physical delete = separate phase C5 after you confirm no 404s for 1 week.

## Upload
All files in zip → purge CF `/campus/` → Incognito desk `#m=seeker.m1`
