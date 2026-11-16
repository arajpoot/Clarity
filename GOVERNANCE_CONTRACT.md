# Clarity — Castle-wide governance contract
## Binding for Phase A and all subsequent phases (B–D+)

**Bismillah.**

This document is **binding** for work on Clarity (`clarity-dawah.fyi`): Port, Companion, Yawm (`/daily/`), University/Campus, Amānah, and Craft.

**Purpose:** help users furnish the grave through daily practice and private amānah / legacy preparation.  
**Educational only — not a fatwa, not legal advice, not a bank.**

---

## Binding effect

1. Phase A ships this contract at site root as `GOVERNANCE_CONTRACT.md` (or under `/docs/` if preferred; root preferred for visibility).
2. **Phases B, C, D, and later** must treat this file as a **gate**: no phase exit if enrichment hold is violated.
3. Infrastructure (service worker, caching, vault, digests, Port UI) may **support** room jobs; it may **not** empty or thin rooms to chase performance metrics.
4. Default changelog value for infrastructure work: `enrichment: held` for every room not explicitly in scope.

---

## 1. Castle principle

Each room has a **job**. Faster offline ≠ fewer educational surfaces. Prefer cache, lazy-load, and progressive disclosure over deletion.

---

## 2. Room jobs (enrichment protected)

| Room | Job | Enrichment that must not be stripped without explicit decision |
|------|-----|------------------------------------------------------------------|
| **Port** (`/`) | Wayfinding · castle map · PWA entry | Five-room inventory, disclaimer, room links, offline/PWA status |
| **Companion** | Reminder · path · multi-hub tools | Commands, hadith/names, Reality/Reflection/Action loaders, Ḥajj outline, quiz, media desk, path tiles, About |
| **Yawm** (`/daily/`) | Calm today’s portion | ʿAṣr focus, Muslim 1631, farḍ checklist, small deed / send-light surfaces |
| **University / Campus** | Ordered curriculum | Tracks, lessons, on-device progress — **curriculum frozen** unless a documented Campus ticket says otherwise |
| **Amānah** | Trust · legacy desk · optional vault | Desk notes (no unlock), chambers (dayn, heirs, wasiyyah reminders, family outline), educational will caution |
| **Craft** | Atelier | Meme studio, tajweed tools, calligraphy pad |

**Migration rule:** Moving a tool between rooms is allowed only when the destination already hosts equal or better capability and the source keeps a **clear link** — documented as `enrichment: migrated:X→Y (linked)`, never silent thinning.

---

## 3. Enrichment hold (all rooms, all phases)

During Offline/PWA, vault, digest, and Port work:

1. Do not remove educational cards, banks, loaders, or curriculum shells to shrink bundles.
2. Do not replace a working room shell with a thin “Coming soon” page.
3. Do not break one room’s offline entry while fixing another.
4. Do not use “Campus parity” to mean “delete Companion (or any room) content.”
5. Do add offline badges, cache, and graceful degrade for live APIs.
6. Do prefer progressive disclosure over deletion when a surface is heavy.
7. Do re-smoke each room’s primary inventory after SW or root `index.html` changes.

### Smoke after any root / SW change

| Room | Minimum enrichment smoke |
|------|---------------------------|
| Port | Five towers/links + disclaimer |
| Companion | Hadith or commands text (not endless Loading) |
| Yawm | Daily shell + core deed/checklist UI |
| Campus | Curriculum shell loads |
| Amānah | Desk usable without unlock |
| Craft | Atelier entry + at least one studio UI/link |

---

## 4. Privacy & doctrine

- Passphrase never stored or transmitted.
- On-device first; server only on explicit user request.
- No analytics on vault or dayn digest **content**.
- Amānah digest never mixes Campus/Companion progress.
- Always: **educational only — not a fatwa; verify with scholar / primary texts.**

---

## 5. Service worker (enrichment-safe)

- Per-room cache namespaces.
- Network-first for room HTML; cache-first for versioned static assets.
- Precache entry shells and static educational assets; never vault plaintext.
- After SW deploy: visit each room once online, then offline matrix **without** losing Companion G7–G13 (or later) loaders.

---

## 6. Changelog requirement

Every phase deploy notes:

`room | offline | privacy | enrichment | user-visible copy`

Where **enrichment** = `held` | `migrated:X→Y (linked)` | `added` | `explicit-remove:ticket#`.

---

## 7. Phase map (contract applies to all)

| Phase | Focus | Enrichment default |
|-------|--------|-------------------|
| **A** | Offline SW + Castle Port | Port `added`; all other rooms `held` |
| **B** | Amānah vault + trust doc | All rooms `held` (Amānah vault *completion*, not desk wipe) |
| **C** | Yawm calm polish | Yawm layout only; others `held` |
| **D1** | On-device dayn digest | Amānah additive; others `held` |
| **D2** | Optional email digest | Privacy-minimized; others `held` |

---

## 8. Phase exit gate (binding)

A phase is **not done** until:

1. Its technical exit criteria pass, **and**
2. Enrichment smoke table passes for **all six surfaces** (Port + five rooms), **and**
3. Changelog rows include `enrichment:` for each touched or SW-affected room.

---

*Contract version: castle-wide-v1 · ships with Phase A · binds B–D+*

---

## 6. Higher Arch content ladder (L1–L6) — binding guidance

**Bismillah.** All **future upgraded content** across rooms should be designed, labeled, and ordered with this educational ladder in mind. It does **not** issue rulings for a person’s obligations; it **streamlines deep learning** and continuity.

### Source frame (educational)

- **Hadith Jibrīl** (Muslim / Bukhārī): *Islām* · *Īmān* · *Iḥsān*
- Learning adab: practical obedience and farḍ ʿayn **before** stacking optional volume
- Life values: sincerity, consistency, guarding the tongue, household mercy, transmission with **source · audience · adab**

### Levels

| L | Id | Label | Guiding pointer for authors |
|---|-----|--------|------------------------------|
| **1** | `iman_tawhid` | Īmān & Tawḥīd | Allah, belief, commands, Names, orient the heart first |
| **2** | `islam_fard` | Islām · farḍ practice | Pillars, prayer-protect, steady required practice |
| **3** | `sunnah_character` | Sunnah & character | Seerah, prophetic adab, tongue, household |
| **4** | `ihsan_tazkiya` | Iḥsān · purification | Tawbah, dhikr, night watch, grave-oriented sincerity |
| **5** | `tools_craft` | Tools & craft | Studios, search, quiz, meme — **serve** L1–L4, never replace them |
| **6** | `transmission` | Transmission with adab | Share only after personal practice is in view; name sources |

### Rules for upgrades

1. **New cards** should declare `data-arch-level="1"…"6"` when authored; otherwise Companion Arch Engine classifies by content.
2. **Do not** promote L5/L6 above L1–L2 in default seeker/new-Muslim streams.
3. **Do not** delete L1–L4 surfaces to make room for tools (enrichment hold).
4. **Daʿi path** may surface L6 earlier *as aid*, never as substitute for L1–L4.
5. **Yawm / Campus / Amānah / Craft** use the same ladder as *author guidance*; Companion hosts the live Arch Engine.
6. Every surface remains: **educational only — not a fatwa; verify with Qur’an, Sunnah, and a local scholar.**

### Continuity of deep learning

- Path tiles (Seeker · New Muslim · Daily · Daʿi) change **emphasis**, not the existence of the ladder.
- Offline/PWA and vault phases must keep L1–L4 entry points offline-capable where already static.
- Changelog for content work should note arch level, e.g. `arch: L2 · islam_fard`.

---

*Higher Arch added · 20261116 · Companion Arch Engine is the runtime reflection of this section.*
