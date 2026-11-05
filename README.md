# Clarity project-wide governance

Binding for **all rooms** and **every** upgrade/fix.

| File | Role |
|------|------|
| `governance/PROJECT_CONTRACT.md` | Human + policy rules P1–P7 |
| `governance/PROJECT_MANIFEST.json` | Machine checklist · rooms · gates |
| `governance/DEPLOY_GATE.md` | Reject criteria for packs |
| `governance/UPGRADE_CHECKLIST.md` | Per-change tick list |

Room contracts (e.g. Craft C15R4) **add** constraints; they do not override P1–P7.

Wire this into packaging by including the checklist in every zip and failing review if smoke omits `project_invariants`.

Educational only — not a fatwa.
