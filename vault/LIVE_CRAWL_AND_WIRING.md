# Live crawl report + wiring (repackage)

## Crawl result (clarity-dawah.fyi)

| Item | Status |
|------|--------|
| Fortify JS under `/assets/` | **Present** (sizes match package) |
| Contracts under `/vault/*.md` | **Present** |
| Pill script `/vault/patches/daily-note-vault-pill.js` | **Present** |
| Companion `index.html` script tags for fortify modules | **Missing** |
| `vault-export-host` / panel mount | **Not found** on home HTML |
| Worker `/api/vault-digest/health` | **404 / not deployed** |
| `/vault/` page | University locker only (not Amānah unlock) |

**Conclusion:** Package files are uploaded but **not wired** into Companion HTML, so tutorial, digest panel, façade, and pill will not run. Email/API Worker is not live.

## Required Companion wiring (do not edit /daily/ or /campus/)

Add once near other Amānah scripts on the Companion shell (home `index.html` or the bundle that loads Amana gate):

```html
<!-- Amānah fortify · snapshot digest · passphrase tutorial -->
<script src="/assets/clarity-vault-facade-v1.js?v=20261031V9" defer></script>
<script src="/assets/clarity-vault-isolate-guard-v1.js?v=20261031V9" defer></script>
<script src="/assets/clarity-vault-digest-v1.js?v=20261031V9" defer></script>
<script src="/assets/clarity-vault-digest-panel-v1.js?v=20261031V9" defer></script>
<script src="/assets/clarity-vault-passphrase-tutorial-v1.js?v=20261031V9" defer></script>
<script src="/vault/patches/daily-note-vault-pill.js?v=20261031V9" defer></script>
```

Optional (after Worker deploy):
```html
<script>window.CLARITY_VAULT_DIGEST_API = "https://YOUR_WORKER.workers.dev";</script>
```

### Export panel mount
Ensure unlocked vault export area has one of:
- `id="vault-export-host"`
- `data-vault-export`
- `id="amana-export"`
- class `vault-export`

### Passphrase tutorial mount
Unlock surface should expose one of: `[data-vault-passphrase-panel]`, `#vault-passphrase`, `#amana-vault-gate`, `[data-vault-root]`, or a password input inside the vault root.

## Worker (optional for live email/API)
See `vault/workers/vault-digest/README.md`. Until deployed, **Build snapshot + mailto (local)** still works after unlock.
