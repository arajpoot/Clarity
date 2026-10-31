# Vault digest threat model

## Assets
- User passphrase (highest)
- Encrypted vault payload
- Ledger export lines
- Email address + API tokens

## Controls
- Passphrase: device only, never uploaded
- Digest: built client-side after unlock; server sees snapshot text only
- Email: transactional provider; body = snapshot; unsubscribe required
- Tokens (future): hashed at rest; revoke fails closed

## Out of scope
- Server-side vault decryption
- Silent vendor upload to Claude/Grok
