# Clarity — Castle-wide governance contract
## Binding for Phase A and all subsequent phases (B–D+)

**Bismillah.**

This document is **binding** for work on Clarity (`clarity-dawah.fyi`): Port, Companion, Yawm (`/daily/`), University/Campus, Amānah, and Craft.

**Purpose:** help users furnish the grave through daily practice and private amānah / legacy preparation.  
**Educational only — not a fatwa, not legal advice, not a bank.**

---

## Binding effect

1. Phase A ships this contract at site root as `GOVERNANCE_CONTRACT.md` (or under `/docs/` if preferred; root preferred for visibility).
2. **Phases B, C, D, and later** must treat this file as a **gate**: no phase exit if **enrichment hold (§3)** or **visibility of enrichment (§3A)** is violated.
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

---

## 3A. Visibility of enrichment (foundation clause)

**Status:** Binding foundation clause — same force as §3 Enrichment hold.  
**Why:** Human operators do not have infinite cycles. Work that is only green in DOM, flags, or sim logs — but not **seen** on screen — is a contract failure, not a success.

### Rule

Enrichment that cannot be **seen and used** by a normal user after a hard-refresh does **not** count as held or added.

### Must

1. **Screenshot test** — After deploy, the claimed enrichment must appear in a normal viewport (mobile or desktop) without requiring DevTools, grep, or knowledge of internal IDs.
2. **Usable, not merely mounted** — Controls that look present but do nothing, canvases at 0×0, iframes with `display:none` / `src="about:blank"` left inert, and copy only inside closed folds with no discoverable open state, **fail** visibility.
3. **No false green** — Phase exit, ship seal, and audit **GREEN** require **both**:
   - §3 Enrichment hold (content not thinned), **and**
   - §3A Visibility (content visible and operable on screen).
4. **Prefer visible order** — Put restored heroes, primary cards, and media shelves where users actually look; do not bury them under chrome such that the first screen looks unchanged when the ticket promised visible restore.
5. **Changelog** — Every Companion (and room) deploy line must include a visibility tag:
   - `visibility: seen` — confirmed on screen after hard-refresh  
   - `visibility: fold-open` — intentionally in a disclosure the user can open in one tap, and that control is obvious  
   - `visibility: fail` — not allowed at phase exit  

### Must not

1. Call structural sims, flag checks, or “node exists in `#cs-mount`” a completed **glory** or **restore** ticket.
2. Spend operator rounds on invisible architecture when the stated ask was visual restore — unless the operator explicitly ordered architecture-only work.
3. Hide the majority of a tab’s educational media behind empty or zero-size players.

### Smoke (visibility)

| Surface | Minimum visibility smoke |
|---------|---------------------------|
| Companion tab | Hero or ladder readable without DevTools |
| Meme / canvas | Non-zero on-screen stage; paint visible |
| Lecture / YouTube shelves | Player area visible when section is on screen (open fold or inline) |
| Deep learning / studios | Section on screen; primary actions respond |
| Any “restored” block | Findable in one deliberate scroll on mobile |



### Sandbox snapshot rule (binding — human time)

DOM presence and “non-zero getBoundingClientRect” are **not** enough.

A visibility claim is **GREEN** only when **all** of the following hold:

1. **Sandbox / tool snapshot** — A real screenshot (or equivalent viewport capture) from the build or live hard-refresh shows the enrichment **in frame** without requiring the operator to know a secret scroll depth.
2. **First intentional screen** — For tab-level restore tickets, primary restored enrichment appears **at or near** the top of the tab body (under hero/ladder), not only after several viewport-heights of scroll, unless the ticket explicitly says “appendix media.”
3. **Operator sees it** — If the human operator reports “not on my screen” and a hard-refresh confirms absence or only far-below-fold placement when the ticket promised visible restore, the audit is **`visibility: fail`** regardless of sim flags.
4. **Enrichment sticks** — After path-tile changes and leaving/returning to the tab, pinned educational sections and restored media **remain** visible. Disappearing enrichment is a §3 + §3A failure.

**Changelog:** `visibility: seen` requires a snapshot path or explicit operator confirmation note.  
**Forbidden:** marking GREEN from flag/sim-only runs when no snapshot evidence exists for the claimed surface.


### Build sandbox sim snapshot (binding)

Every phase package that claims **`visibility: seen`** must include evidence from **its own sandbox sim run** of the deployed (or deployable) build:

1. **Viewport capture** — At least one screenshot from the agent/sandbox browser session after hard-refresh (or equivalent cache-bust load).
2. **Target in frame** — The claimed enrichment heading or primary control is **legible in that capture** (not only in DOM metrics).
3. **Record in package** — Ship under `governance/` or `smoke/`:
   - short note of what was in frame
   - timestamp / build id
   - pass/fail against the ticket’s visibility claim
4. **No sim-only green** — Flag checks and `getBoundingClientRect` without a sandbox snapshot **do not** satisfy §3A.

Operator-phone confirmation remains valid when the operator attaches their own screenshot; sandbox sim snapshot is the **default** evidence path for agent-delivered packages.

### Fail conditions (visibility)

- Audit green while the operator reports “I don’t see it” and a hard-refresh confirms absence or zero-size UI  
- Restored embeds present in HTML but all players 0×0 / `display:none` with no open path  
- Duplicate removal or rewire that drops a section below visibility without migration + link  

**Changelog tag:** `visibility: seen` | `visibility: fold-open` | `enrichment: held` + visibility tag together on every exit.

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

`room | offline | privacy | enrichment | visibility | user-visible copy`

Where **enrichment** = `held` | `migrated:X→Y (linked)` | `added` | `explicit-remove:ticket#`.
Where **visibility** = `seen` | `fold-open` (see §3A). Phase exit requires enrichment hold **and** visibility ≠ fail.

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

---

## 7. Body richness audit (Companion and all rooms)

**Bismillah.** Shell/allowlist audits are necessary but **not sufficient**.

### Principle

Educational richness lives in the **body** (tab HTML, fragments, mounted cards), not only in the shell script list. A green shell with a thinned body is a **governance fail**.

### Companion body baseline (session-locked)

| Tab | Minimum body bytes (approx) | Role |
|-----|------------------------------|------|
| reminder | ≥ 34 000 | Commands, hadith, names, path cards, craft reminders |
| reality | ≥ 49 000 | Seerah, life events, nations, deepen study |
| reflection | ≥ 36 000 | Tawbah, compass, grave, asma, dhikr |
| action | ≥ 85 000 | Pillars, tajweed, hifz, ḥajj, quiz, search, studios |
| notes | ≥ 6 500 | Ledger surfaces |
| about | ≥ 6 800 | Charter |

Also: `companion/content/main.fragment.html` remains a full-body backup (≥ 180 000 bytes, ~70 h2).

### Required checks after every Companion deploy

1. **Shell** — engine allowlist / boot order  
2. **Body** — each tab URL returns baseline bytes ±10% and key feature strings present  
3. **Visibility** — path governance may **emphasize**, must **not** `display:none` educational cards by default (enrichment hold). Progressive disclosure uses order (L1–L6) and soft emphasis, not deletion or hard hide of the full card set.  
4. **Hydration** — Loading placeholders clear for commands/hadith/names/seerah within a few seconds online  

### Fail conditions

- Default Seeker (or any path) hides the majority of Action/Reminder/Reality cards  
- Tab body drops >15% below baseline without a documented migration to another room with a live link  
- Shell-only audit marked green while body smoke fails  

Changelog tag: `enrichment: body-held` or `enrichment: body-restored`.

---
