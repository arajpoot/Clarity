# NurOS V3.1.2 — Governing Contract (Clarity On-Device)

**Bismillāh.** Educational companion only — **not a fatwa**, not legal advice, not a court document.  
Status: **Binding** for all product work on the four-room structure.

---

## 1. Intent (clarified)

This contract exists to bring **coherence** to the **existing four-room** app — not to replace rooms or thin them out.

| Intent | Meaning |
|--------|---------|
| **One contract** | One law for Port + Companion + Yawm + University + Amānah |
| **Unified chrome** | Shared **icon language**, **layout rhythm**, and **type system** across rooms |
| **Unified type** | **Quill** (or approved Quill stack) for **all English** · **Amiri** for **all Arabic** |
| **One access Port** | Root `/` is the **only** product landing: Clarity banner + **enriched tiles** (style + content summary) before entry |
| **Hard isolation** | Upgrades to one room **must not** change another room’s code, SoT, or content |
| **No richness loss** | No upgrade may delete, hide, or hollow curriculum/modules without an explicit, user-visible retirement note |

---

## 2. Constitutional map

| Surface | URL | Role |
|---------|-----|------|
| **Port (landing)** | `/` | Sole access gate · Clarity banner · four enriched room tiles |
| **Companion** | `/companion/` | Tools · reminder path · craft · banner |
| **Yawm** | `/daily/` | Today’s portion (daily SoT) |
| **University** | `/campus/` | Ordered learning path (campus) |
| **Amānah** | `/amana/` | On-device vault · dayn · heirs |

Legacy deep links may remain. **Product entry** is only through the Port tiles (or the shared room rail that mirrors those four doors).

---

## 3. Unified design law

### 3.1 Type (mandatory)

| Script | Face |
|--------|------|
| English / UI Latin | **Quill** (system fallback only if Quill fails to load) |
| Arabic | **Amiri** (documented Arabic fallback only if Amiri fails) |

- Applies to **Port and every room**.  
- Room-specific display CSS may refine size/weight; it may **not** substitute a different primary English or Arabic family.

### 3.2 Icons

- One **icon vocabulary** (same semantic icons for Companion / Yawm / University / Amānah on Port and room rail).  
- Rooms may add module icons; they must not invent a second Port language.

### 3.3 Port tiles (mandatory content)

Each room tile on `/` **must** include:

1. **Icon** (unified set)  
2. **Room name**  
3. **Short content summary** — what the user will find (enlighten before open)  
4. **Clear enter affordance**  

Tiles are **enriched** (visual plaque/style consistent with Clarity banner), not bare links.

### 3.4 Clarity banner on Port

Port landing carries a **Clarity banner** (brand + educational stance). It does not load another room’s private SoT (no Amānah crypto, no Yawm-only mutators, no campus grades).

---

## 4. Isolation (non-negotiable)

| Rule | Enforcement |
|------|-------------|
| Room A upgrade | Touches only that room’s paths + its declared shared nav chrome |
| Shared code | Only `assets/room-nav/*` and explicitly listed shared type/icon tokens |
| No cross-SoT | Companion ↛ Yawm daily SoT; Yawm ↛ Amānah vault; Campus ↛ Amānah ledger; Amānah ↛ campus grades |
| Future upgrades | A patch to Companion must not alter `/campus/`, `/daily/`, or `/amana/` trees |

---

## 5. Non-degradation of richness (non-negotiable)

1. **Housekeep wiring, not curriculum** — remove ghost scripts/CSS; do not remove lessons, path doors, craft surfaces, or campus materials to “simplify.”  
2. **Any retirement** of a user-facing module requires an **in-UI note** and a pointer to the replacement (e.g. old vault → Amānah room).  
3. **Integrity PASS** is required to ship; PASS does not mean “fewer features.”  
4. **Fallbacks** (banner stills, ṣalāh list, fonts) exist to **preserve use**, not to replace rich modules permanently.

---

## 6. Media & craft (Companion)

- Heavy craft (meme / calligraphy / speech) stays **inside Companion**, behind a media bus / budget if needed.  
- Failure degrades to safe fallbacks; it does **not** authorize removing craft from the product.

---

## 7. Phased plan (updated)

| Phase | Work | Done when |
|-------|------|-----------|
| **0 — Freeze law** | This contract binding; no merge that breaks type, Port-only entry, isolation, or richness | Team agrees; contract in repo |
| **1 — Port redesign** | `/` = Clarity banner + **four enriched tiles** (icon, name, summary, enter); unified icons; Quill + Amiri loaded | Staging: landing enlightens before open; integrity PASS |
| **2 — Type & icon roll-forward** | Apply Quill (EN) + Amiri (AR) + icon tokens **room by room** without content removal | Each room matches type law; visual smoke |
| **3 — Yawm SoT confirm** | `/daily/` remains sole “today” SoT; no vault/azan leakage | Isolation check PASS |
| **4 — Companion harden** | Single surface owners; craft behind bus; viewport/banner integrity | Tab smoke; no richness cut |
| **5 — University path markers** | Study-mirror markers only; campus content intact | Campus freeze unless this phase |
| **6 — Amānah** | On-device only; Companion only points here | No campus grades in vault UI |
| **7 — Release hardening** | Contract smoke every release; reject dup ids / dead CSS that fights type or Port | `integrity("after upgrade")` PASS |

---

## 8. Integrity checklist (ship gate)

- [ ] Port is the sole product landing with **four summarized tiles**  
- [ ] Quill on English UI; Amiri on Arabic  
- [ ] Unified room icons on Port + rail  
- [ ] No cross-room SoT writes  
- [ ] No unexplained content removal vs previous release  
- [ ] Educational stance visible  
- [ ] Smoke artifact recorded  

---

## 9. Launch discipline

1. One phase at a time.  
2. Integrity **PASS** before merge.  
3. Prefer audited sources on Shariah-facing banners.  
4. Educational stance always visible.  
5. **Coherence without subtraction** — unify style; keep depth.

---

## 10. Artifacts

| File | Role |
|------|------|
| `NUROS_V3_CONTRACT.md` | Governing law (this document) |
| `clarity-kernel.html` | Optional reference kernel — must not become a fifth live room |
| Live `ARCHITECTURE.md` | URL map; must agree with §2 |

---

*NurOS V3.1.2 · One Port · Four isolated rooms · Quill + Amiri · No richness loss.*
