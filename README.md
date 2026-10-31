# Amānah Vault Fortress integrity · FORT3

Bismillah. Educational only — not a fatwa.

## Architecture (restored)
- **One public door:** `assets/clarity-vault-fortify-boot-v1.js`
- **Sealed stack:** `/vault/sealed/*` including **Dayn** as a gated component
- **Quarantine:** `assets/clarity-vault-legacy-quarantine-v1.js` strips Dayn UI leaked into Companion tabs from leftover public `/assets/clarity-dayn-*.js` copies

## Leftovers still on CDN (not in HTML script tags for Dayn)
Public copies of dayn ledger may exist under `/assets/` but must not be wired in `index.html`. Quarantine removes their DOM if they paint Reality/etc.

Helpers still listed (backup guide, vault form, note registry) — soft helpers; fortress is authority for Dayn/digest.

## Deploy
1. `index.html`
2. `assets/clarity-vault-fortify-boot-v1.js`
3. `assets/clarity-vault-legacy-quarantine-v1.js`
4. `vault/sealed/*` (especially `dayn-ledger-v2.js`)
5. `vault/patches/daily-note-vault-pill.js`

Hard-refresh. Yawm & Campus untouched.

## Audit
```bash
python3 tools/vault-isolation-audit.py index.html
```
