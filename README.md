# Clarity · Tajweed Deep Studio upgrade · C19TJ1

**Bismillah.** Educational only — not a fatwa · not a qāriʾ verdict.

## Architecture review (summary)

Live flow already had four stages: **Curriculum (L0–L6) → Rules → LMR → Journal**, with partial score→curriculum bumps in `craft-tajweed-flow-v1` / `score-pill-v3`.

### Gaps closed in C19TJ1
| Gap | Fix |
|-----|-----|
| Layout below DVI bar | Craft hero **banner** + bismillah + flow pills + practice charter |
| Journal unbounded | **Collapsed to 5 recent** · expandable |
| Path meters laggy / partial | **Realtime bridge**: every scored session → journal + active level meters + analysis refresh |
| Weak student guidance | **Today's focus drill** from weakest phase · one-click Pull into studio |
| Rule order clarity | Charter states research-aligned path: Makhārij → Ṣifāt → Madd → Nūn → Mīm/Ghunnah → Integration |

## Package
```
craft/tajweed/index.html
craft/assets/craft-tajweed-progress-bridge-v1.js
docs/TAJWEED_DEPLOY.md
governance/TAJWEED_GOVERNANCE_AUDIT.md
smoke/SMOKE_TJ_C19TJ1.json
smoke/SIM_CYCLES_TJ_C19TJ1.json
```

Existing vendor/LMR scripts on the live site are **not replaced** — this pack adds the bridge and upgrades the shell HTML.

## Storage
- `clarity_tajweed_practice_journal_v1`
- `clarity_tajweed_curriculum_v2`

Isolation: Craft only. Educational stamps retained.
