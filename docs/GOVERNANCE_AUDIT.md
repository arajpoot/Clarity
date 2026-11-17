# Bismillāh · Enrichment backbone P17

**Verdict: GREEN**

## Root cause of short-lived restore
1. Live still served **old** path-governance with ALLOW + `display:none`
2. Script flag `__COMPANION_PATH_GOV_SHELL_V1__` prevented a second honest file from installing
3. Late scripts re-applied hide after nuclear

## Backbone repair
- Replace governance: **show all cards**, path-only tips gated
- **enrichment-backbone-v1.js last**: patches `ClarityPathGovernanceShell.apply`, sustained re-show 8s
- Hygiene: no card hiding
- path-soft: restore only
- CSS: force card visibility

Educational only — not a fatwa.
