# Nuclear Desk Cleanse — Clarity University

## Live diagnosis (2026-10-14)

### What the screenshot shows
- Light floating **"How phases work"** card over dark desk
- Junior curriculum card **dark-on-dark / washed text**
- Ghost Companion chrome / dual layout
- Not a content bug — **shell collision**

### Root fighters (live `/campus/desk/`)

| Fighter | Evidence |
|---------|----------|
| **Invalid HTML** | `<header>` / `<nav>` appear *before* `<body>` |
| **Dual navigation** | `cu-banner` + sticky `cu-map-nav` + old tab row |
| **Companion CSS on Desk** | `clarity-css-patches-v1.css` (~143KB, many light tokens) |
| **Addon chrome** | `cu-addon-chrome.css` |
| **Old engine stack** | `campus-engine-v1.*` + `campus-polish-v1.js` + `workers-ops-pack` |
| **Version skew** | Desk at `20261009MP2`; Map/Vault at newer `cu-*` / P5 |
| **How-phases float** | Injected light panel competing with stage |

### GitHub
Public API listing was not available from this environment. Live crawl used as source of truth.

---

## DELETE / STOP LOADING on Desk (do not load)

**Never link from `/campus/desk/`:**
1. `/assets/clarity-css-patches-v1.css` — Companion form factor
2. `/assets/cu-addon-chrome.css` — extra chrome
3. `/assets/curriculum/vault/admin/campus/campus-engine-v1.css`
4. `/assets/curriculum/vault/admin/campus/campus-engine-v1.js`
5. `/assets/curriculum/vault/admin/campus/campus-polish-v1.js`
6. `/assets/curriculum/vault/admin/workers-ops-pack-v1.js` (unless proven required for desk)
7. Duplicate `cu-map-nav` markup when `cu-banner` + `cu-pills` present

**Safe to keep (Desk):**
- `boot.js` + `SEAL.json` + `foundation/*`
- `campus-shell-v1.js`, `cu-campus-mount-v1.js`, `cu-learner-v1.js`
- `cu-shared` / `cu-app-polish` / nuclear / smooth / phase5 CSS
- `phase-plaque.css`, `cu-continue-flow`, `cu-spark-adab`, `cu-mirath-desk`

**Companion (`/`):** leave intact — patches CSS may stay on Companion only.

---

## Phased cleanse

### NC1 — Desk shell integrity (THIS PACKAGE)
- Valid HTML5 (everything inside `body`)
- One banner + pills (align Map/Vault)
- **Remove** companion patches + dual nav
- Force dark readable curriculum card tokens
- Smoke: Desk loads, Junior card readable, no light float

### NC2 — Script diet
- Confirm single boot path; remove rescue double-mount if any
- Idle non-critical polish
- Smoke: spark quiz still unlocks; progress in localStorage

### NC3 — Cross-page parity
- Map / Desk / Lab / Vault same banner+pills contract
- Kill orphan routes (`/welcome/`, `/adhkar/`) from desk nav if 404 — or restore pages
- Smoke: every pill returns 200

### NC4 — Dead asset audit (repo)
List under `/assets/curriculum/vault/admin/campus/` unused `*-v1` not referenced by any HTML
Delete only after grep zero references sitewide

### NC5 — Final smoke
- Desk Junior modules visible
- SEAL green (no red banner)
- Vault unlock still works
- Companion `/` unchanged

---

## Candidate dead / review (repo hygiene — verify before delete)

Search before delete:
- Old `campus-engine-v1.*` if desk no longer references
- `workers-ops-pack-v1.js` if only desk used it
- Duplicate `campus-shell.css` vs `cu-shared-v1.css`
- Orphan `welcome/`, `adhkar/`, `path/unit-1/` if empty

Do **not** delete Companion root `index.html` or Amana Companion leftovers still used at `/`.

## NC2 completed (20261014NC2)

Eager on Desk:
- boot.js (SEAL + foundation)
- campus-shell-v1.js
- cu-campus-mount-v1.js
- cu-learner-v1.js
- cu-page-flow-v1.js
- cu-spark-adab-v1.js

Idle (cu-desk-idle-v1.js sequential):
- cu-overlay-housekeep-v1.js
- cu-continue-flow-v1.js
- cu-mirath-desk-v1.js
- cu-phase5-polish-v1.js
- cu-smooth-runtime-v1.js

Removed from Desk path: rescue, engine, companion patches (NC1).
Guards: mount/shell already singleton.

## NC3 completed (20261014NC3)

Nav contract (all university pages):
Map · Desk · Lab · Vault · Journey · Charter (`cu-pills`)

Removed from Lab/Journey/Charter/Vault where present:
- cu-addon-chrome.css
- companion clarity-css-patches

Orphan routes (still 200 — optional later content, not deleted):
- /welcome/ · /adhkar/ · /path/unit-1/
These are valid pages; not linked in primary pills (reduces chrome fight).

Smoke targets: each primary pill → 200; single pill nav; no companion CSS on university shells.
