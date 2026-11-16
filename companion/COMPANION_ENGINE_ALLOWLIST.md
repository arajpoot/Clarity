# Companion Engine Allowlist · production seal

**Bismillah.** Binding for `/companion/` deploys under castle-wide `GOVERNANCE_CONTRACT.md`.

**Phase:** allowlist-seal · 20261115AL1  
**Enrichment hold:** do not strip educational cards to “simplify” the allowlist.

## Rule

1. Live shell may load **only** scripts/styles listed below (plus `/companion/banner/` iframe app).
2. Files under `companion/assets/` **not** listed are **archival** — do not add to `index.html` without a documented ticket and smoke.
3. Pathway on-demand packs (`assets/pathways/*/pack-v1.js`) may load **only** via pathway-bridge, not as static shell tags.
4. Root `/assets/companion-inline/*` is legacy; new work stays under `/companion/assets/`.

## Production JS (19)

| File | Job |
|------|-----|
| companion-shell-v1.js | Tab fetch → `#cs-mount` |
| companion-mount-fortify-v1.js | Safe remount / script dispatch |
| companion-content-stream-v2.js | Path × tab focus |
| companion-tab-engines-v1.js | data-engine hydrate |
| companion-housekeep-v1.js | Surface cleanup |
| companion-rrra-quiet-v1.js | Quiet RRRA chrome |
| companion-deeplink-v1.js | Hash deep links |
| companion-path-stacks-v1.js | Path stacks |
| companion-path-governance-shell-v1.js | Path gates |
| companion-pathway-bridge-v1.js | Path ↔ content bridge |
| companion-nuros-path-engine-v1.js | NurOS path UX |
| companion-hadith-governance-v1.js | Hadith sparks |
| companion-repair-v3.js | Commands, names, reality/reflection loaders, nav |
| companion-action-wiring-v1.js | Search openers, ḥajj, askGrok base |
| companion-action-fix-v1.js | Search ID alignment, mirror, VT honesty |
| companion-hifz-engine-v1.js | Hifz coach |
| companion-craft-studios-v1.js | Meme/callig rehydrate |
| companion-about-mount-v1.js | About surface |
| companion-allowlist-seal-v1.js | Runtime seal / drift log |

## Production CSS (9)

| File | Job |
|------|-----|
| companion-shell-v1.css | Shell layout |
| companion-about-notes-v1.css | About/notes |
| companion-engines-v1.css | Engine surfaces |
| companion-rich-restore-v1.css | Card restore |
| companion-housekeep-v1.css | Housekeep |
| companion-rrra-quiet-v1.css | RRRA quiet |
| companion-nuros-path-engine-v1.css | Path UX |
| companion-repair-v3.css | Repair minimal |
| companion-theme-surface-v1.css | Forms + links (no white holes / blue defaults) |

## Explicitly archival (do not shell-load)

- G5–G12 phase packs, boot-v2, pack-boot, smoke*-fix, spine-dedupe  
- Most `inline-*` hashed boots  
- Banner control scripts (belong to `/companion/banner/`)  
- Vault/dayn boots (Amānah room)  
- Stale `COMPANION_LOAD_MAP*.json` — **this allowlist supersedes them**

## Smoke after any shell change

1. Phase meta contains allowlist or later phase id  
2. Yawm nav → `/daily/`  
3. Reminder: command/hadith/name leave Loading  
4. Action: search uses field text; mirror not Loading  
5. `window.__COMPANION_ALLOWLIST_SEAL__.drift` is `[]` (or only known banner iframe)

## Governance

- Castle-wide enrichment hold still binds.  
- Next castle phase remains **B — Amānah vault + trust doc** when scheduled.  
- This phase seals Companion engine truth only.
