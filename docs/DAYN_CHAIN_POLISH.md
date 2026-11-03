# Dayn Chain Polish · Freeze Fix

**Bismillah.**  
Package: `dayn-polish-package` · 2026-11-02  
Scope: Amānah Dayn only · educational · not a fatwa · not legal/financial advice.

## Problem diagnosed

The Dayn surface froze under load / unlock / navigation because of:

1. **MutationObserver feedback loop** in `dayn-mount-adapter-v1.js`  
   (`observe(document.documentElement, { childList: true, subtree: true })` + DOM writes → re-trigger).
2. **Competing mount owners** of the same slots:
   - `dayn-ensure-s45.js`
   - `dayn-mount-adapter-v1.js`
   - `dayn-section-bridge-v2.js`
   - `dayn-ledger-v2.js`
   - `dayn-enrich-v3.js`
3. Broad click listeners and multiple delayed `boot()` calls that re-rendered the same hosts.

## Fix summary

| Change | File | Effect |
|--------|------|--------|
| Remove MutationObserver entirely | `dayn-mount-adapter-v2.js` | Eliminates infinite mutation cycle |
| Idempotent slot ensure + coordinator | `dayn-mount-adapter-v2.js` | `ClarityAmanaDayn` flag + early return |
| Deterministic sequential load | `amana-fortify-boot-v2.js` | ensure → adapter-v2 → ledger-v2 → bridge |
| Drop enrich-v3 from live chain | fortify-boot v2 | Removes second form renderer; file kept for rollback |
| Event-driven only | adapter v2 | unlock + sealed-ready events; limited timeouts |

## New load order (after unlock)

```
dayn-ensure-s45.js          ← one-shot slot creator
dayn-mount-adapter-v2.js    ← idempotent, no observer
dayn-ledger-v2.js           ← single UI owner (form + vault panel)
dayn-section-bridge-v2.js   ← CSV/Excel I/O + notes section
```

`dayn-enrich-v3.js` remains in `/amana/sealed/` but is **not** loaded by the new boot.

## Install steps

1. Copy into the live tree (or PR):

```
amana/sealed/dayn-mount-adapter-v2.js
amana/assets/amana-fortify-boot-v2.js
```

2. Update chamber pages that currently reference the old fortify boot.

   On `/amana/dayn/index.html` (and gate if it loads fortify):

   Change:
   ```html
   <script src="/amana/assets/amana-fortify-boot-v1.js?v=…" defer></script>
   ```
   to:
   ```html
   <script src="/amana/assets/amana-fortify-boot-v2.js?v=20261102D1" defer></script>
   ```

3. Optional safety: leave `dayn-mount-adapter-v1.js` and `dayn-enrich-v3.js` on disk for rollback, but they are no longer in the live SEALED array.

4. Hard refresh / clear service-worker cache if present.

## Smoke matrix (must pass)

- [ ] Cold load `/amana/` → unlock → open `/amana/dayn/`
- [ ] Add line (Qard ḥasan confirmed)
- [ ] Record repayment
- [ ] Mark settled
- [ ] Export CSV / Excel
- [ ] Lock → unlock → data still present, no duplicate cards
- [ ] Navigate away and back — no freeze, console clean
- [ ] Mobile + desktop, Day/Night

## Rollback

Revert fortify script tag to `amana-fortify-boot-v1.js`.  
The v1 adapter and enrich-v3 remain in sealed/ untouched.

## Next phases (after this lands clean)

- Pedigree family tree as living centre
- Farāʾiḍ study calculator (quiet, educational)
- Enriched wasiyyah + notes export path

Educational only — not a fatwa · not legal advice · not a court document.
