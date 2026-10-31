# On-demand ledger API

Clarity does **not** send your ledger to xAI or Anthropic.

1. Unlock vault · subscribe/verify · **Build & upload snapshot**
2. **Issue API token** (copy once)
3. In *your* tools:

```bash
curl -s -H "Authorization: Bearer YOUR_TOKEN" \
  https://YOUR_WORKER.workers.dev/api/vault-digest/latest
```

Revoke immediately if leaked. Never paste your vault passphrase into Claude/Grok.
