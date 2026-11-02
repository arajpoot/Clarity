# A6 · Passphrase gate UI · 20261101

- Real password field + Unlock / Lock / Load modules on `/amana/`
- Disclaimers: responsibility, no recovery, educational, not a fatwa
- Passphrase tutorial from sealed `passphrase-tutorial-v1.js` (mounts on `[data-vault-passphrase-panel]`)
- `runtime-gate-v1.js` treats `/amana/*` as vault context so tutorial + Dayn vault APIs allow
- Soft unlock opens chamber panels; uses `ClarityVaultSecure.unlock` when present

Educational only — not a fatwa · not legal advice.
