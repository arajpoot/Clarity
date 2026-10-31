# Amānah Vault fortify drop (existing surfaces)

## Layout (matches live site)
- `vault/` — contracts, patches, worker ops, passphrase tutorial snippet
- `assets/` — façade, digest, panel, **passphrase tutorial** JS
- `tools/` — isolation audit

No new public top-level product folders. Do not touch `/daily/` or `/campus/`.

## Passphrase tutorial
`assets/clarity-vault-passphrase-tutorial-v1.js` injects a short guide on the unlock/passphrase surface.
Static copy: `vault/passphrase-tutorial-snippet.html`.
