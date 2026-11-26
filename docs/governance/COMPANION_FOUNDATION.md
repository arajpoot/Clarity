# Companion Foundation Charter (Campus-grade)

Educational only — not a fatwa. Companion room only.

## Purpose

University keeps a charter so stages are ordered and progress is not random.
Companion keeps a **foundation seal** and layered modules so reminder work is not one fragile file that a single upgrade can erase.

## Seal

```html
<html data-companion-foundation-seal="v1" data-clarity-room="companion">
```

Do not remove the seal without a major foundation bump and migration notes.

## Must-ship foundation modules

Ship these together on every Companion deploy:

| Module | Role |
|--------|------|
| `companion-shell-v1.*` | Shell structure |
| `companion-mount-fortify-v1.js` | Campus-style script rehydrate on tab mount |
| `companion-path-governance-shell-v1.js` | Educational path gates |
| `companion-visibility-foundation-v1.*` | §V visibility runtime |
| `companion-hold-fix-v1.js` | Enrichment holds / richness |
| `companion-integrity-v1.js` | Card gating / craft boundaries |
| `companion-root-safe-v1.js` | Root safety |

Archive / enrich layers may stack; prefer refine over delete.

## Upgrade preserve rules

1. Additive versioned files first (`*-v2.js`).
2. Never strip foundation seal casually.
3. Migrate `localStorage` keys; do not silent-rename path unlock keys.
4. Companion deploy must not wipe other rooms’ SW buckets.
5. Empty shell (promised sections invisible) = failed deploy under governance §R1 / §V1.
6. Rollback via prior query string or archive folder is preferred.

## Governance binding

This charter implements:

- `/docs/governance/` § Visibility & richness  
- `/docs/governance/` § Companion foundation  
- `/docs/governance/` § Upgrade & preserve  

Session work on Companion assumes these rules until the seal major-versions.
