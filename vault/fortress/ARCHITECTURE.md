# Fortress architecture · 20261031FORT1

```
assets/clarity-vault-fortify-boot-v1.js     ← thin public door only
        │
        ▼
vault/sealed/*                             ← integral vault logic
vault/patches/daily-note-vault-pill.js     ← nav-only patch
vault/workers/vault-digest/                ← optional server snapshot email
vault/fortress/*.md                        ← contracts
```

Yawm `/daily/` and Campus `/campus/` remain untouched by this package.
