# Clarity · Phase 0–1 pack · Tree + Farāʾiḍ stabilisation

**Bismillah.**

Educational only — **not a fatwa** · not legal advice · not a court document.

## Purpose

Governance-bound Phase 0–1 for Amānah **Tree (UFT)** and **Farāʾiḍ** only:

1. Five-room documentation alignment (Craft is fifth room).
2. Inventory load maps for Tree and Farāʾiḍ.
3. Additive viewport stabilisation bridge (preview host, registry↔cards, integrity hints).
4. Farāʾiḍ remains on the same `clarity_user_family_tree_v1` source.
5. Enrichment **never decreases**; other rooms and other Amānah chambers untouched.

## Pack layout

```
clarity-p0p1-pack/
  README.md                          ← this file
  docs/
    ARCHITECTURE.md                  → repo root ARCHITECTURE.md
    NAV_CONTRACT.md                  → repo root NAV_CONTRACT.md
  amana/
    ARCHITECTURE.md
    NAV_CONTRACT.md
    UFT_LOAD_MAP.json
    FIQH_LOAD_MAP.json
    SEAL_AND_HTML_PATCHES.md
  assets-outline/
    amana-uft-viewport-stable-v1.js  → amana/assets/amana-uft-viewport-stable-v1.js
  smoke/
    SMOKE_AMANA_UFT_FIQH_P0P1.json
    SIM_CYCLE_REPORT.md
  governance/
    UPGRADE_CHECKLIST_FILLED.md
```

## Implementation order (executed)

1. **Docs + seal** — five-room contracts; seal patch instructions.
2. **Tree stabilisation** — stable viewport bridge (additive).
3. **Farāʾiḍ** — verified shared TREE_KEY; no surface removal.
4. **SMOKE + sim cycle** — repairs documented; enrichment matrix held.
5. **Deliver** — this package.

## Deploy (repo)

1. Replace root `ARCHITECTURE.md` and `NAV_CONTRACT.md` with `docs/*`.
2. Replace `amana/ARCHITECTURE.md` and `amana/NAV_CONTRACT.md`.
3. Copy `assets-outline/amana-uft-viewport-stable-v1.js` → `amana/assets/`.
4. Apply seal string patches per `amana/SEAL_AND_HTML_PATCHES.md`.
5. In `amana/tree/index.html`, after registry-deep script, add:
   ```html
   <script defer src="/amana/assets/amana-uft-viewport-stable-v1.js?v=20261106P1"></script>
   ```
6. Run live smoke; promote SMOKE entries from `sim_pass` to `pass`.

## Changelog rows

```
room        | offline | privacy | enrichment | user-visible copy
------------|---------|---------|------------|------------------
Port        | held    | held    | held       | five-room wording (docs)
Companion   | held    | held    | held       | —
Yawm        | held    | held    | held       | —
Campus      | held    | held    | held       | —
Amānah      | held    | held    | held       | Tree stable bridge; five-room seal
Craft       | held    | held    | held       | documented as fifth room
```

## Binding

- `GOVERNANCE_CONTRACT.md` — enrichment hold + phase exit gate  
- `governance/PROJECT_CONTRACT.md` — five rooms + P1–P7  
- `governance/PROJECT_MANIFEST.json` — isolation table  
- `governance/DEPLOY_GATE.md` — pack requirements  

---

*Pack build: AMANA_UFT_FIQH_P0P1 · 2026-11-06*
