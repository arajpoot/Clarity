# Amānah Vault Fortress · 20261031FORT3

```
index.html
  ├─ assets/clarity-vault-legacy-quarantine-v1.js
  └─ assets/clarity-vault-fortify-boot-v1.js   ← ONLY public vault door
        │ sequential
        ▼
vault/sealed/
  runtime-gate-v1.js
  facade-v1.js
  isolate-guard-v1.js
  digest-v1.js / export-host / digest-panel
  dayn-section-bridge-v2.js
  dayn-mount-adapter-v1.js
  dayn-ledger-v2.js          ← Dayn component (gated)
  dayn-enrich-v3.js
  passphrase-tutorial-v1.js
vault/patches/daily-note-vault-pill.js
```

Dayn mounts only in Day landing slot or vault interior — never `#main-content`.
Yawm and Campus untouched.
