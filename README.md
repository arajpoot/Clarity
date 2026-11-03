# Amānah Dayn · Freeze Polish Package

**Bismillah.**

Delivers a clean, observer-free Dayn chain so the remaining Amānah enrichments (pedigree tree, farāʾiḍ study calculator, enriched wasiyyah) can land on a stable base.

## Contents

```
dayn-polish-package/
├── INSTALL.txt
├── README.md
├── docs/
│   └── DAYN_CHAIN_POLISH.md      ← diagnosis + smoke matrix
├── amana/
│   ├── assets/
│   │   └── amana-fortify-boot-v2.js
│   ├── sealed/
│   │   └── dayn-mount-adapter-v2.js
│   └── dayn/
│       └── index.html.patch      ← one-line boot swap
```

## What changed

- **Removed** the `MutationObserver` that re-fired on every DOM write.
- **Made** slot creation fully idempotent.
- **Introduced** `window.ClarityAmanaDayn` coordinator.
- **Re-ordered** sealed load: ensure → adapter-v2 → ledger-v2 → bridge.
- **Dropped** `dayn-enrich-v3` from the live chain (file stays for rollback).

## Quick install

1. Copy the two JS files into the matching paths under your Clarity tree.
2. Apply the one-line patch (or manually change the fortify script `src` on `/amana/dayn/`).
3. Hard refresh.
4. Run the smoke list in `docs/DAYN_CHAIN_POLISH.md`.

Educational only — not a fatwa · not legal advice · not a court document.
