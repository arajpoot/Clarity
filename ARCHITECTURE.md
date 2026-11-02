# Clarity architecture — four doors

Educational only — not a fatwa · not legal advice · not a court document.

## Single lobby, four rooms

| # | Door | URL | Owns |
|---|------|-----|------|
| 1 | **Companion** | `/companion/` | Path shell (Reminder → Notes), banner, craft (meme · tajweed · calligraphy) |
| 2 | **Yawm** | `/daily/` | Daily routine **source of truth** (now · deed · tasbeeh · ṣalāh · adhkār · light) |
| 3 | **University** | `/campus/` | Learning institution (desk, lab, library, portal, campus vault *page*) |
| 4 | **Amānah** | `/amana/` | On-device trust surface (dayn · heirs · notes · tree · farāʾiḍ study · wasiyyah) |

Root `/` is the **chooser** (four cards + shared room rail). It is not the Companion shell.

## Shared plumbing

- `assets/room-nav/clarity-room-nav-v1.js` — active room from `pathname`; no cross-room module imports
- `assets/room-nav/clarity-room-nav-v1.css` — sticky four-door rail

## Isolation (non-negotiable)

| Room | Must not |
|------|----------|
| Companion | Host Yawm daily SoT; become the only Amānah UI |
| Yawm | Load Amānah passphrase / Dayn mutators |
| University | Write Amānah ledger keys; treat campus `/vault/` as Amānah |
| Amānah | Host campus grades or Yawm module SoT |

Campus `/vault/` (if present) is the **university locker page**, not Amānah. Amānah home is **`/amana/`**.

## Legacy paths

Side folders (wills, janāzah guides, journey, …) may remain as deep links. Product navigation is the **four doors** only.
