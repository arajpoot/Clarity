# Amānah Vault Fortress Lock · 20261031FORT1

## Seclusion
All vault-integral runtime scripts live under `/vault/sealed/`.
Public Companion HTML may load **only**:
- `/assets/clarity-vault-fortify-boot-v1.js` (or `clarity-amana-fortress-boot-v1.js`)
- which then loads sealed modules

## Forbidden for other sections (Reminder, Action, craft, campus, daily)
- Import or copy sealed vault modules
- Read/write `clarity_dayn_ledger_v1` except via Dayn UI in sealed stack
- Query passphrase fields outside vault root
- POST vault digest APIs except via sealed digest façade

## Storage keys (vault-owned)
- `clarity_dayn_ledger_v1` / `clarity_dayn_tutorial_done_v1`
- `clarity.vault.digest.session.v1`
- Existing Amānah gate keys (unchanged)

## Passphrase
Never in URL, email, Worker body, or sealed→network without post-unlock snapshot rules.

## Ship gate
```bash
python3 tools/vault-fortress-audit.py
```
