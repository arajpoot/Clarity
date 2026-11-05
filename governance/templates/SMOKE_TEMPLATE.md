# SMOKE template · project-wide · binding

**Bismillah.** Educational only — not a fatwa.

Copy this pattern into **every** room pack as `SMOKE_<BUILD>.json` (JSON form is canonical; this markdown is the human guide).

## Agent delivery rule (mandatory)

> **Any proposed fix or upgrade must pass this SMOKE before delivery.**  
> If `project_invariants` are missing, still `pending`, or failed, the pack is **not deliverable**.  
> Optimizing for “it shows on screen” while skipping P1–P7 or room isolation is a failed pack.

## How to fill

1. Set `build`, `date`, `rooms_touched` (non-empty subset of companion | yawm | campus | amana | craft).
2. For each of **P1–P7**: set `"pass"` | `"fail"` | `"n/a"` (n/a only if room truly unaffected — e.g. P5 when Amānah not touched).
3. Set `isolation_checks` for cross-room script rules.
4. Enable the matching `room_addenda.*.applies: true` and complete those fields.
5. List `files_changed`. If contract/manifest changed, set `contract_amended: true` and reason.
6. Operator sets `operator_signoff.invariants_checked: true` only when ready to deploy.

## Reject if

- `rooms_touched` empty or invents a room  
- Any P* is `fail`  
- Craft meme paint touched and scan fields not `pass`  
- Forbidden cross-room load detected  
- Agent delivers without completing applicable gates  

## Refs

- `governance/PROJECT_CONTRACT.md`  
- `governance/PROJECT_MANIFEST.json`  
- `governance/DEPLOY_GATE.md`  
