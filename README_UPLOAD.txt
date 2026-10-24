Vault freeze fix · 20261024VAULT

ROOT CAUSE: Same as charter — both /vault/ and /campus/vault/ were stubs:
  location.replace("/campus/vault/") → infinite loop.

FIX:
- campus/vault/index.html + vault.js + vault.css = University study locker (from index-old-html)
- Keys: cu_vault_* only (not Companion Amana)
- vault/index.html = one-hop bridge only
- _redirects: /vault → /campus/vault/ (never redirect campus/vault to itself)

Companion Amanah private unlock remains on Companion home — not this page.
Extract at main root. Hard-refresh /campus/vault/
