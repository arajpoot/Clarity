# Clarity University — Administrator Office

This folder is the **Administrator Office**: source of truth for enrollment,
scoring, and certificates. Runtime scripts read these JSON files when available
and fall back to built-in defaults offline.

## Directory map

```
curriculum/
  office/                 ← YOU ARE HERE (central admin)
    registry.json         ← colleges, enrollment rules, storage keys
    ledger-schema.json    ← how scores are shaped and graded
    diploma-templates.json← certificate art + phase seals
    office-controller-v1.js ← loads office files + bridges runtime
  seeker/                 ← College of Foundations (Phase 1)
  new-muslim/             ← College of Practice (Phase 2)
  daily/                  ← College of Consistency (Phase 3)
  dai/                    ← College of Transmission (Phase 4)
  shared/                 ← quiz banks, always-on tools
```

## Each college folder may hold

- `manifest.json` — public track description (already present)
- `register.json` — enrollment defaults for this college
- `score-policy.json` — pass thresholds for this college
- `diploma-template.json` — optional override of office template

## Motto

Knowledge with adab · recognition without pretence.

Educational only — not an accredited degree or fatwa service.


## Staff wing
See `staff/staff-roster.json` and `staff-dispatcher-v1.js`.
