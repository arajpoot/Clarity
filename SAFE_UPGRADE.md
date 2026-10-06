# Safe smooth upgrade (from working final-scan build)

This release **keeps the same public APIs and on-device behavior** you already rely on.
The curriculum folder model is an **authoring layer** — runtime does not depend on loading those stubs.

## What stays the same

| Area | Unchanged |
|------|-----------|
| Track buttons | `claritySwitchGate('seeker'…)` |
| Unlock / quiz | Same doors, permanent passes |
| Vault | Amana AES-GCM, auto-lock, local-only |
| Notes / UFT | Same keys, same scripts |
| File layout | `index.html` + `assets/*` (plus optional `assets/curriculum/`) |

## What improves (smooth)

| Change | Why it’s safe |
|--------|----------------|
| Path v6 CSS-first switch | Same gates; less main-thread work → less lag |
| `data-min-i` on cards | Matches existing allowlists; CSS only hides |
| Curriculum folders | Docs + map only until you extract partials |
| Vault lock aliases | Fixes auto-lock; no new server |
| CSP without `unsafe-eval` | Stricter; no `eval` in your assets |

## Staged apply (recommended if cautious)

### Stage 1 — lag fix only (minimum)

Upload **only**:

- `index.html`
- `assets/clarity-path-progress-v1.js`
- `assets/clarity-css-patches-v1.css`
- `assets/clarity-polish-wiring-v2.js`
- `assets/clarity-grave-path-curriculum-js.js`

Hard-refresh. Test track switching. If good → Stage 2.

### Stage 2 — vault / security (if not already on live)

- `assets/clarity-amana-vault-gate-js-v1.js`
- `assets/clarity-runtime-overlays-v1.js`
- `assets/clarity-track-os-v3.js`

### Stage 3 — curriculum model (optional, zero runtime risk)

- Entire `assets/curriculum/` folder
- `CURRICULUM_CARD_MAP.md` (optional)

No need to change how users switch phases. Folders are for **you** when editing later.

### Stage 4 — rest of assets (parity)

Copy remaining `assets/*.js` / css if versions differ, plus `robots.txt` / `sitemap.xml` if you use them.

## Rollback

Keep a zip of the current live tree before upload. If anything feels off:

```bash
# restore previous index + path module only
cp BACKUP/index.html .
cp BACKUP/assets/clarity-path-progress-v1.js assets/
```

## Verify after Stage 1

1. Seeker selected → meme/tajweed not shown  
2. Switch tracks → no freeze, UI responds immediately  
3. Console → no SyntaxError  
4. Vault still opens with passphrase  

## API compatibility

These still exist and behave the same:

- `clarityRequestPath` / `claritySwitchGate`
- `clarityWelcomePickTrack` / `clarityPathResetToSeeker`
- `clarityPathProgress.apply` / `.reapply`
- `AmanaVault.lock` / `clarityAmanaLock`

Curriculum stamp is **optional**:

```bash
node assets/curriculum/stamp-cli.js --write
```

Only needed after you edit `card-map.json`. Path v6 also stamps from its internal allowlist on boot if attributes are missing.
