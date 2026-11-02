# Companion phased revamp plan · campus untouched
Bismillah. Simulation date: 2026-10-25. Live: https://clarity-dawah.fyi/

## Simulation snapshot
- Title: Journey · Clarity · activeTab=reminder · theme=light
- Banner: present (Hijri · Rabbana · A/V · Salah) · door-rail present
- Dual path cards: Companion path | University path (link only)
- Scripts: ~74 external (+ inners ≈94) · Stylesheets ~23
- No horizontal overflow on tested desktop width
- Mobile: dual path stacks; floating Quick access; media row compresses

## Observed strengths
1. Clear dual-path landing (Companion vs University) without merging campus code
2. Day landing content rich: Do this today · Next salah · Tasbeeh · Long stay · Muslim 1631 · Adhkār
3. Banner media (Stills / Madinah / Tarateel / Listen) operational line
4. Educational disclaimers present
5. Haramain temps + salah location working on desktop snapshot

## Observed integrity / flow risks
1. **Script surface area**: 70+ companion-inline patches (guards, repairs, meme, vault, polish) — load-order fragility
2. **Competing chrome**: top ribbon + Day landing / Hide / Companion path + dual cards + Quick access FAB
3. **Deep learning weak on home**: deeds encourage knowledge but few one-tap Quran.com/Sunnah.com deep chips on primary cards
4. **Mobile A/V**: controls truncated vs desktop full dock
5. **Architecture debt**: core-block + chunk + dozens of inlines vs ARCHITECTURE.md single-source ideal
6. **Title vs mode**: "Journey · Clarity" / SEEKER JOURNEY MODE may confuse vs Companion path label

## Phased plan (Companion only)

### Phase 0 — Freeze & inventory (1–2 days)
- Freeze `/campus/**`
- Manifest: every script/link in index.html with role (boot|shell|feature|vault|dead)
- Smoke matrix: mobile+desktop · Day/Night · Companion path click · Amana gate open/close · radio play
- Deliverable: COMPANION_LOAD_MAP.json

### Phase 1 — Integrity (boot & isolation)
- Single boot order: guards → shell-v3 → landing-v3 → feature packs → vault last
- Collapse duplicate guards (master-shield / security sweeps) into one allowlist
- Ensure University path is `<a href="/campus/">` only — no campus JS pull
- Vault isolate: Action/meme never mounts vault interior (existing trench + test)
- Deliverable: green smoke, no console TypeError on cold load

### Phase 2 — Information architecture & flow

#### Canonical landing sequence (LOCKED — do not reorder)

Observed on live Companion and **required to maintain** through all revamps:

```
┌─────────────────────────────────────────┐
│ 0. Sticky chrome (theme · packs · gate) │  ← utility only
│ 1. Banner (Hijri · verse · A/V · ṣalāh) │  ← provision
├─────────────────────────────────────────┤
│ LANDING A — Daily pulse                 │
│  2. Do this today (one deed · mark)     │
│  3. Adhkār card (masnūn · count)        │
├─────────────────────────────────────────┤
│ LANDING B — Gate to main                │
│  4. Pill strip (Day landing · focus)    │
│  5. Two path tiles                      │
│       • Companion path → main Companion │
│       • University path → /campus/ only │
└─────────────────────────────────────────┘
│ After path choice: Companion main doors │
│ (Today · Learn · Affairs · Amana)       │
```

**Two landings to main (explicit):**

| Landing | Purpose | Must remain |
|--------|---------|-------------|
| **A — Daily pulse** | Immediate practice without choosing a long track | Do this today **then** Adhkār card |
| **B — Path gate** | Choose surface | Pill **then** two tiles: Companion main **or** University |

Rules:
- Do **not** put dual path tiles above Do this today / Adhkār (avoid forcing a track choice before one deed).
- University tile = navigation only (`/campus/`) — no campus JS.
- Companion tile opens **main Companion** (Reminder · Reality · Reflection · Action / door rail), not a third home.
- Pill strip is the soft switcher (Day landing / Hide / focus) — not a third path.
- Banner stays above both landings; chrome stays utility.

Home after Companion path is chosen (not on first paint if sequence is pulse-first):
- Calm doors: Today · Learn · Affairs · Amana
- Demote duplicate “Companion path” marketing card once user is already inside main.


### Phase 3 — Deep learning layer
- Every primary card: grade/collection where hadith · Quran.com / Sunnah.com chip
- Daily pack: verse + thematic sahih hadith + ponder + one "people of the past" (curated)
- Learn door: hifz goal + tajweed 5-min + quiz×3 sharing **one** local streak with Today
- Affairs: worksheets already — add source footers (4:11–12 study outline, not calculator verdict)
- Deliverable: DEEP_LEARN_SPEC.md + content pack v1

### Phase 4 — UI revamp (plaque system)
- Unify tokens: gold/green plaques, consistent radius, mobile bottom rail
- Banner: restore full circular dock parity mobile/desktop (Stills · Live place · Radio · Surah · volume)
- Reduce floating Quick access collision with adhkār
- Day/Night/System: single theme source, no flash
- Deliverable: companion-surface-v3.css (replace lean + scattered polish)

### Phase 5 — Architecture consolidation
- Target: index.html shell ≤150KB HTML; ≤12 script entries via bundles:
  - companion-boot.js (guards+shell+landing)
  - companion-features.js (path, adhkar, meme optional)
  - companion-amana.js (lazy on vault open)
- Deprecate hash-named inlines after merge
- Keep thin SEO folders; shared footer component
- Deliverable: bundle map + LEGACY_DELETE for companion-inline

### Phase 6 — Hardening & ship
- Security smoke (vault passphrase never logged)
- Shariah source audit pass on new copy
- Perf: defer non-banner JS; LCP banner still
- Package: index.html + assets companion-only zip (no campus)

## Success criteria
- New visitor completes Landing A (one deed + sees Adhkār) before needing Landing B
- Path tiles remain after pulse; Companion vs University clear in <30s
- No campus files modified
- Cold load: zero hard JS errors
- Mobile: full banner controls usable; no overlapping FABs
- Deep learning: every hadith shows grade·collection·number or hidden

## Non-goals (this program)
- Campus curriculum/lab changes
- Cloud accounts
- Live inheritance verdict calculator
- Second streak system
