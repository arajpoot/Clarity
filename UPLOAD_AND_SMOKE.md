# University P1–P7 essentials · 20261020P7

Companion SPA (`/` index.html) untouched.

## Phase summary
| Phase | What shipped |
|-------|----------------|
| 1 | `cu-returner-portal-v1.js` on campus + charter |
| 2 | Desk seeker/practice/consistency/transmission layout: verse → pills → stage → tools |
| 3 | uni-surface CSS on portal/desk/lab/library/vault |
| 4 | Portal duplicate Google Fonts removed |
| 5 | Ghosts (`index-old`, `live-src`) not included |
| 6 | Sandbox FAIL=0 |
| 7 | This package |

## Upload paths
Merge into repo root (same folders).

**Required**
- `campus/assets/js/cu-returner-portal-v1.js`
- `campus/index.html`, `charter/index.html`
- `campus/desk/seeker|practice|consistency|transmission/index.html`
- `campus/assets/css/cu-desk-verse-top-v1.css`
- `campus/assets/css/cu-uni-surface-v1.css`

**Also in zip** (surface-linked): portal, desk hub, buddy, lab hub, library, vault dual.

Live must already have unit/surface engines (`cu-seeker-surface-v1.js`, etc.) — do not delete them.

## Smoke after CF purge
1. New visitor `/campus/` → admission visible  
2. Set admit in localStorage or complete admission → return → banner or portal  
3. `/campus/desk/seeker/` → **verse under banner**, pills, modules, tools **only at bottom**  
4. Same order on practice / consistency / transmission  
5. `/campus/portal/` loads  
6. `/vault/` is University  

Educational only — not a fatwa.
