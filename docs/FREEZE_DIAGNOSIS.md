# Dayn freeze — live diagnosis & fix

**Bismillah.**

## Live crawl findings (2026-11-02)

On `https://clarity-dawah.fyi/amana/dayn/`:

1. **Lock shell stuck**  
   `clarity-amana-engine-v1.js` `guardPage()` creates `#amana-engine-lock-shell` when chamber is visited locked.  
   `setUnlocked(true)` did **not** remove that shell.  
   Result: full-screen overlay stayed after unlock → page felt frozen / unclickable.

2. **Bridge MutationObserver**  
   `dayn-section-bridge-v2.js` still had:
   ```js
   var obs = new MutationObserver(function () { tick(); });
   obs.observe(document.documentElement, { childList: true, subtree: true });
   // disconnect only after 25s
   ```
   `tick()` mutates DOM → observer re-fires → jank / freeze under load.

3. Phase B ledger-v3 and adapter-v2 were already live and fine; enrich-v3 was not in the fortify chain.

## Fixes in this package

| File | Fix |
|------|-----|
| `amana-engine-unlock-patch-v1.js` | Removes lock shell on unlock + re-enables controls |
| `dayn-section-bridge-v3.js` | Observer-free; export I/O only; no competing form |
| `amana-fortify-boot-gate-v2.js` | Loads bridge-v3 instead of v2 |
| Ready HTML | Includes unlock patch script tags |

## Verified in simulation

- Unlock → shell removed  
- Form fields enabled  
- Save line → list updates  
- Still interactive after save  

Educational only — not a fatwa.
