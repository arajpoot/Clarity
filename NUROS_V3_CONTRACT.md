# NurOS V3.1.2 — Governing Contract (Clarity On-Device)

**Bismillāh.** Educational companion only — **not a fatwa**, not legal advice, not a court document.  
Status: **Binding** for all product work on the four-room structure.

---

## 1. Intent

| Intent | Meaning |
|--------|---------|
| **One contract** | One law for Port + Companion + Yawm + University + Amānah |
| **Unified chrome** | Shared icon language, layout rhythm, type system |
| **Unified type** | **Quill** stack for all English · **Amiri** for all Arabic |
| **One access Port** | `/` only: Clarity banner + enriched tiles (summary before enter) |
| **Hard isolation** | Upgrades to one room must not change another room’s code or SoT |
| **No richness loss** | No upgrade may delete or hollow curriculum without a visible retirement note |
| **Shariah authenticity** | Online-fetched Islamic text must pass authenticity rules (§5) |

---

## 2. Constitutional map

| Surface | URL | Role |
|---------|-----|------|
| **Port** | `/` | Sole landing · banner · four tiles |
| **Companion** | `/companion/` | Tools · reminder path · craft · banner |
| **Yawm** | `/daily/` | Today’s portion SoT |
| **University** | `/campus/` | Ordered learning path |
| **Amānah** | `/amana/` | On-device vault · dayn · heirs |

Shared plumbing: `assets/room-nav/*` and declared type/icon tokens only.

---

## 3. Unified design law

- **English:** Quill → Quicksand → system  
- **Arabic:** Amiri → Noto Naskh Arabic → serif fallback  
- **Icons:** one vocabulary on Port + room rail  
- **Port tiles:** icon · name · content summary · enter  

---

## 4. Isolation & non-degradation

1. Room A patches touch only that room’s tree (+ shared nav/type tokens).  
2. Housekeep **wiring**, not curriculum.  
3. Retirements need in-UI note + pointer.  
4. Integrity PASS does not mean fewer features.  

---

## 5. Shariah authenticity (sourced / online fetch)

Applies to **any** verse, ḥadīth, masnūn duʿāʾ, adhkār, or “Islamic quote” loaded from network, packs, or generators (including Companion craft / RRRA / meme).

### 5.1 Required

| Rule | Detail |
|------|--------|
| **Allowlist sources** | Prefer audited endpoints and local packs (e.g. Quran.com API, Sunnah.com where used, in-repo RRRA packs with cited refs) |
| **Citation** | Display **reference** (sūrah:āyah and/or collection + number) with the text |
| **No anonymous fabrications** | Do not invent Arabic or attribute uncited “ḥadīth” |
| **Educational stance** | Surface remains “educational only — not a fatwa” near instructional content |
| **Guard on fetch** | Room loaders should use a **source guard** (allowlist + fail closed or fail to cached authentic pack) |

### 5.2 Audit (every release that changes fetch paths)

1. List new fetch URLs / pack files.  
2. Confirm each Islamic text path is allowlisted or local with refs.  
3. Spot-check rendered output for matching citation.  
4. Record result in smoke/audit artifact (`SHARIAH_FETCH_AUDIT` or equivalent).  

### 5.3 Failure behavior

If fetch fails or source is not allowlisted: **do not** show uncited religious text; fall back to local authentic pack or hide the slot with a neutral message.

### 5.4 Implementation note

Companion may ship `shariah_source_guard` (or successor). Other rooms that fetch text adopt the same allowlist discipline — **without** coupling room SoTs.

---

## 6. Media & craft (Companion)

Heavy craft stays in Companion, behind media bus / budget if needed. Failure → fallback; **not** removal of craft.

---

## 7. Phased plan

| Phase | Focus | Status lens |
|-------|--------|-------------|
| 0 Freeze law | This contract | Binding |
| 1 Port | Banner + tiles + type on `/` | Shipped / deploy |
| 2 Type roll-forward | Quill + Amiri per room | Shipped package |
| 3 Yawm SoT | Daily isolation + seal | Shipped package |
| **4 Companion harden** | Single owners · viewport · craft guard · authenticity wiring | **This phase** |
| 5 University markers | Study mirror; content intact | Later |
| 6 Amānah | On-device only | Later |
| 7 Hardening | Contract smoke every release | Ongoing |

**Future room upgrades** must satisfy §§1–5 before merge.

---

## 8. Integrity checklist (ship gate)

- [ ] Port four tiles with summaries  
- [ ] Quill EN · Amiri AR  
- [ ] No cross-room SoT writes  
- [ ] No unexplained content removal  
- [ ] Educational stance visible  
- [ ] **Fetch paths audited** (§5) when changed  
- [ ] Smoke artifact recorded  

---

## 9. Launch discipline

1. One phase at a time.  
2. Integrity PASS before merge.  
3. Prefer audited sources on banners and fetches.  
4. Educational stance always visible.  
5. Coherence without subtraction.  

---

*NurOS V3.1.2 · One Port · Four rooms · Quill + Amiri · Authenticity · No richness loss.*
