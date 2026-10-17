# Amana Vault — Phase 1–2 restore (20261016BRIDGE)

**Bismillāh.** Companion-only restore. University (`/campus/*`, sealed curriculum vault) is untouched.

## Decision (amanah-first UX)

| Choice | Reason |
|--------|--------|
| **Castle** (`clarity-amana-vault-secure-v1.js`) as sole crypto | AES-GCM + PBKDF2-120k, attempt lockout, idle + visibility lock, frozen `ClarityVault` API, no passphrase storage |
| **Bridge** for estate tools | Loads family tree + farāʾiḍ stack **only after unlock**; hides them on lock |
| Gate JS **not** dual-mounted | Avoids a second key-derivation path against the same blob |

Educational only — not a fatwa, not a court document. Clarity cannot recover a lost passphrase.

## Files to upload (site root = package root)

Upload these paths as on disk (GitHub Pages / clarity-dawah.fyi root):

```
index.html
assets/clarity-amana-vault-bridge-v1.js          ← NEW
assets/clarity-amana-vault-css-v1.css            ← updated fortify
assets/clarity-amana-vault-secure-v1.js          ← unchanged Castle
assets/clarity-amana-vault-v1.css                ← unchanged
assets/clarity-amana-vault-nuros-v1.js           ← unchanged (package panel / FAB)
assets/amana-phase1-local-guard.js               ← unchanged
assets/clarity-amana-fiqh-v1.js                  ← lazy on unlock
assets/clarity-amana-uft-v1.js                   ← lazy on unlock
assets/clarity-uft-full-restore-v1.js            ← optional, non-fatal
```

Optional (not required for Phase 1–2 lock path):

```
assets/clarity-amana-vault-gate-js-v1.js
assets/clarity-amana-vault-access-v1.js
```

## Behaviour after deploy

1. Open **Amana Vault** (bottom rail or 🕋) → Notes tab + Castle card.
2. **First-time setup** → choose passphrase (≥8; 12+ recommended), confirm, write it offline.
3. **Unlock** → vault fields + Fiqh workflow, family tree, farāʾiḍ, wasiyyah become visible; UFT scripts load once.
4. **Lock** / leave tab / idle 5 min → estate UI hidden; session key cleared from RAM.
5. University routes unchanged.

## Verify checklist

- [ ] Fresh browser profile: setup → lock → unlock → fields restore for session
- [ ] Wrong passphrase: error + eventual lockout message
- [ ] Locked: no family tree / farāʾiḍ / wasiyyah on screen
- [ ] Unlocked: tree container and fiqh path visible
- [ ] `/campus/` still loads; no SEAL.json change

## Version tags

- Bridge: `20261016BRIDGE`
- Castle: `20261015CASTLE`
- Estate scripts query: `20261015FIX1`

---

*Amanah: on-device only. Verify knowledge with Qur’an, Sunnah, and a local scholar.*


## Phase 3 (20261016P3) — content alignment

Added in bridge:
- After unlock → `fiqhGoStep(1)` / scroll to workflow
- Print pack requires unlock (session fields only if no native printer)
- Vault blob keys kept visible to NurOS `clarity_*` package export
- Path-focus CSS for tree / farāʾiḍ / wasiyyah cards

Smoke was run offline (42 passed). No tools/ or builds/ folders required for deploy.

Keep only root + assets/ — no extra folders.


## Minimal tree (deploy)

Upload only existing layout — **no new folders**:

```
index.html
AMANA_VAULT_PHASE12.md          (optional doc)
assets/clarity-amana-vault-bridge-v1.js
assets/clarity-amana-vault-css-v1.css
assets/clarity-amana-vault-secure-v1.js
assets/clarity-amana-vault-v1.css
assets/clarity-amana-vault-nuros-v1.js
assets/amana-phase1-local-guard.js
assets/clarity-amana-fiqh-v1.js
assets/clarity-amana-uft-v1.js
assets/clarity-uft-full-restore-v1.js
```


## Phase C–D (20261016CD)

- **C:** Live `#amana-vault-interior` with heir readiness (`ahr-*`), session lock; gate JS `saveHeir` / `fillHeirForm`.
- **D:** Family tree, farāʾiḍ, wasiyyah inside interior (`#amana-fiqh-tools-wrap`); unique card IDs; UFT/fiqh load on unlock via bridge.
- Structural smoke: **27 passed, 0 failed**.
- Primary crypto/UI: live gate (`AmanaVault`). Castle `secure-v1` kept in package only as optional rollback file.
