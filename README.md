# NurOS monolith → Companion · phased import plan
**Bismillāh.** Educational only — not a fatwa. Castle-wide governance §7 (preserve rooms).  
Source: `NurOS-AV-upgraded.html` (~1.88 MB, 34 scripts, 881 ids, 92 h2).  
Target: Companion room tabs + shared `/companion/assets` · **not** a second monolith dump.

---

## What the scan found (high signal)

| Cluster | Density / signals | Companion home |
|--------|-------------------|----------------|
| **Meme atelier** | 1734× meme · `memeFetchBg` · canvas · watermark · Unsplash/Flickr pools | Craft `/craft/meme/` + Action deep card link |
| **Tajweed + LMR** | `nx-tj-lmr-js-v1` (~22 KB) · `nx-tajweed-deep-studio` · 352× lmr | Action `#tj-lmr` (native) + Craft `/craft/tajweed/` |
| **Calligraphy pad** | canvas · mic · bridge AR/EN · score · 57× calligraphy | Craft calligraphy + Action bridge only |
| **Banner AV** | Haramain live · radio · sūrah · hijri/salah · Rabbana | Companion shell banner (already thin) — selective |
| **Seerah / grave / journey** | seerah 287 · grave 285 · journey 229 · track OS | Action Seerah Mirror · Notes/Amānah · path doors |
| **Affairs** | wasiyyah · faraid · hajj 506 · janazah | Amānah + Action Hajj (already phased 1–2) |
| **Voice / Whisper** | whisper 145 · voice search · TTS | Notes + search shelf (allowlist sources) |
| **Shariah / path OS** | track-os · doors · collapse · not-fatwa stamps | Shell path governance (exists) |

**Anti-goals:** paste entire HTML into Companion · equal-rank YouTube with Qurʾān · ungraded hadith APIs · Craft chrome inside Action.

---

## Guiding rules for every phase

1. **Extract → asset file → wire once** (no 1.8 MB tab HTML).
2. **Room isolation:** studio engines may be *shared assets*; room *chrome* stays in Craft / Amānah / etc.
3. **Visibility:** no empty promised card; smoke after each phase.
4. **Citations:** Arabic primary; translation = bridge; tap sources.
5. **Performance:** defer non-critical; no 10 Google font families on shell critical path (subset 2–3).
6. **Surprise with restraint:** import *behavior*, not every repair-script fossil (`nuros5-repair`, double `memeFetchBg`).

---

## Phase map (import order)

### Phase A — Meme BG fetch + export spine → Craft Meme  
**Why first:** highest unique richness (1734 hits); Action only *links*; Craft is the pad.

**Import**
- `MEME_BG_POOLS` (nature / architecture / abstract — scenery-first)
- `memeFetchBg` (single clean implementation; drop duplicate)
- Status line · blank palette · upload · watermark default “clarity-dawah.fyi · educational”
- Canvas export PNG (client-only)

**Wire:** `/craft/meme/` + optional Action “Open atelier” deep card (already).  
**Done when:** Pull BG cycles scenery; export works offline-after-cache; no figurative-face default pools.

### Phase B — LMR engine parity → Action `#tj-lmr` + Craft  
**Why:** monolith has battle-tested `nx-tj-lmr-js-v1` (22 KB).

**Import**
- Diff monolith LMR vs our `companion-action-tj-lmr-native-v1.js`
- Port *working* listen/match/record/score paths only
- Keep educational score disclaimer
- Prefer EveryAyah Ḥuṣarī + islamic.network fallbacks (already in v3)

**Wire:** Action single card (no second panel). Craft keeps full atelier.  
**Done when:** Pull āyah → master play → record → score on mobile Companion mount.

### Phase C — Calligraphy pad → Craft only  
**Import:** canvas pad, tip modes, AR bridge, optional mic → text (Whisper if present).  
**Not** inlined into Action (isolation). Action keeps “open `/craft/calligraphy/`”.  
**Done when:** place glyph, export, hear Arabic TTS optional.

### Phase D — Seerah / Journey depth → Action + path doors  
**Import from:** `clarity-seerah-revamp-js`, track OS day cards (not whole journey scroll).  
**Merge with:** Phase 5 Seerah Mirror fallback (sources already).  
**Done when:** Mirror steps never “Loading…”; each step has tap source.

### Phase E — Affairs pack → Amānah (+ Action Hajj already)  
**Import:** wasiyyah print pack · faraid worksheet *educational* · day3 debts notes.  
**Hajj:** already Action phases 1–2 + do/avoid; only port missing checklist copy.  
**Done when:** print legacy pack works on-device; not a fatwa banner intact.

### Phase F — Banner / Today surface (selective)  
**Import only:** hijri strip · next salah (if geolocation consent) · Rabbana rotator.  
**Skip bulk:** multi-repair banner scripts, duplicate docks, CF-heavy live embeds on critical path.  
**Done when:** shell stays ~14 KB real payload; banner does not block LCP.

### Phase G — Visual system (fonts / icons / tokens)  
**Import:** CSS variables (`--accent`, `--gold`, soft cards) as `companion-nuros-tokens-v1.css`.  
**Fonts:** max 3 — Inter + Scheherazade New + Amiri (already family-compatible).  
**Icons:** emoji + existing CS ico (no icon font blob).  
**Done when:** Action/Craft share tokens; mobile readability audit green.

### Phase H — Hygiene & de-fossilize  
Remove dual `memeFetchBg`, obsolete repair IIFEs, dead `open in app` hashes.  
Run Companion visibility smoke + Shariah source rank check.

---

## Suggested first build (surprise slice)

**A0 micro-package (next coding step):**  
Ship `companion`/`craft` **Meme BG module** extracted as:

```
craft/assets/craft-meme-bg-v1.js    ← pools + memeFetchBg (one)
craft/assets/craft-meme-bg-v1.css
```

Wire only into `/craft/meme/`. Action unchanged except “BG fetch live in Craft” note.

That delivers the most-requested missing feel without risking Companion shell size.

---

## Mapping cheat-sheet

| NurOS tab / cluster | Companion / room |
|---------------------|------------------|
| tab-tajweed + LMR | Action `#tj-lmr` + Craft tajweed |
| meme studio | Craft meme |
| calligraphy | Craft calligraphy |
| seerah / commands | Action / Reflection |
| grave / janazah | Path legacy + Notes |
| notes / wasiyyah / faraid | Amānah + Notes |
| search / quiz | Action search shelf + Campus later |
| banner / today | Companion shell |
| about | Companion About |

---

## Success bar (“done” for the import program)

A practicing user can open Companion at fajr and still only see: **hear · obey · send ahead** — while Craft holds the heavy ateliers.  
No room upgrade deletes another room’s work (§7).  
Every imported tool stays educational, cited, and off the fatwa seat.
