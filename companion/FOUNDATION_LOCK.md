# Companion FOUNDATION LOCK · 20261031ARCH1

Modeled on `/daily/FOUNDATION_LOCK.md` isolation.

## This surface owns
- URL home: **`/companion/`**
- Shell UI (Reminder → Notes tabs)
- Amānah sealed stack: **`/companion/sealed/`**
- Module pack: **`/companion/modules/`** (meme, tajweed, calligraphy, notes essentials)
- Fortress boot: **`/companion/assets/`**
- SPA redirects: **`/companion/redirects/`**

## Storage namespaces (Companion / Amānah only)
- `clarity_dayn_ledger_v1` and related Dayn keys
- Vault digest session keys used by sealed digest modules

## Must not
- Write Amānah keys from `/daily/` or `/campus/` scripts
- Load Companion sealed modules from Campus `/vault/` page
- Treat Campus `/vault/` as Amānah Vault

## Ship gate
- Boot loads only `/companion/sealed/`
- Index boot script is `/companion/assets/clarity-vault-fortify-boot-v1.js`
- Yawm and Campus trees are not modified by Companion packages

Educational only — not a fatwa · not legal advice.
