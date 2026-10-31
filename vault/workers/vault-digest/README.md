# vault-digest Worker

Snapshot-only. Never send passphrase fields.

```bash
cd workers/vault-digest
wrangler kv:namespace create DIGEST_KV
# bind id in wrangler.toml
wrangler secret put EMAIL_API_KEY
wrangler secret put DIGEST_SIGNING_SECRET
wrangler deploy
```

Point `ClarityVaultDigest.apiBase` at the Worker URL.
