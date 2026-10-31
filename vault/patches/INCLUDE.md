# Include order (existing surfaces only)

Place scripts with other Amānah assets under `/assets/`.
Worker lives under `/vault/workers/vault-digest/` (ops only — not a public page).

```html
<script src="/assets/clarity-vault-facade-v1.js" defer></script>
<script src="/assets/clarity-vault-isolate-guard-v1.js" defer></script>
<script src="/assets/clarity-vault-digest-v1.js" defer></script>
<script src="/assets/clarity-vault-digest-panel-v1.js" defer></script>
<script src="/assets/clarity-vault-passphrase-tutorial-v1.js" defer></script>
<script src="/vault/patches/daily-note-vault-pill.js" defer></script>
```

Optional API base:
```html
<script>window.CLARITY_VAULT_DIGEST_API = "https://YOUR_WORKER.workers.dev";</script>
```

Do not add new public top-level folders. Do not edit `/daily/` or `/campus/`.
