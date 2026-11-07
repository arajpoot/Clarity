# Clarity architecture — five rooms

Educational only — not a fatwa · not legal advice · not a court document.

## Single lobby, five rooms

| # | Door | URL | Owns |
|---|------|-----|------|
| 1 | **Companion** | `/companion/` | Path shell (Reminder → Notes), banner; links to Craft workbenches |
| 2 | **Yawm** | `/daily/` | Daily routine **source of truth** (now · deed · tasbeeh · ṣalāh · adhkār · light) |
| 3 | **University** | `/campus/` | Learning institution (desk, lab, library, portal, campus vault *page*) |
| 4 | **Amānah** | `/amana/` | On-device trust surface (dayn · heirs · notes · tree · farāʾiḍ study · wasiyyah) |
| 5 | **Craft** | `/craft/` | Workbenches only (meme · tajweed · calligraphy · quiz · notes tools) |

Root `/` is the **chooser** (five-room inventory + shared room rail). It is not the Companion shell.

## Shared plumbing

- `assets/room-nav/clarity-room-nav-v1.js` — active room from `pathname`; no cross-room module imports
- `assets/room-nav/clarity-room-nav-v1.css` — sticky room rail (five tiles)

## Isolation (non-negotiable)

| Room | Must not |
|------|----------|
| Companion | Host Yawm daily SoT; become the only Amānah UI; host Craft engines as home |
| Yawm | Load Amānah passphrase / Dayn mutators; load companion-inline |
| University | Write Amānah ledger keys; treat campus `/vault/` as Amānah |
| Amānah | Host campus grades or Yawm module SoT; load Craft engines |
| Craft | Load Amānah vault or Companion path shell as home |

Campus `/vault/` (if present) is the **university locker page**, not Amānah. Amānah home is **`/amana/`**.

## Legacy paths

Side folders (wills, janāzah guides, journey, …) may remain as deep links. Product navigation is the **five rooms** only.

---

*Aligned to governance/PROJECT_CONTRACT.md and GOVERNANCE_CONTRACT.md · Phase 0–1 pack · enrichment: held (wording only)*
