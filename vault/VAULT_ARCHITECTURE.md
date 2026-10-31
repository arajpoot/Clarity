# Amānah Vault architecture · 20261031V6

Educational only — not a fatwa · not legal advice · not a court document.

## Isolation
Vault is a sealed Companion module. Yawm `/daily/` and Campus `/campus/` are out of scope and must not be edited for vault work.

## Owns
- Unlock / passphrase (device only)
- Ledger, export, Heir readiness
- Post-unlock digest snapshot build
- `POST/GET /api/vault-digest/*` client façade only from vault export UI

## Must not
- Day landing / meme / tajweed calling unlock or reading passphrase fields
- Server reading live vault
- Email or API receiving passphrase or full encrypted blob

## Key namespaces (document actual prefixes used in ship)
- Prefer existing `clarity.amana.*` / vault keys already in gate/secure modules
- Digest subscriber session: `clarity.vault.digest.session.v1` (non-secret UI state only)
- Never store passphrase in these keys

## Façade (public to other Companion code)
- `ClarityVault.openDoor()` — navigate to vault surface only
- `ClarityVault.requestExportSnapshot()` — no-op unless unlocked; used only by vault export UI

## Ship gate
```bash
python3 tools/vault-isolation-audit.py
```
