# Campus curriculum deep scan · 2026-11-14

## Location
GitHub + live files under **`/assets/curriculum/`** (directory listing 404; **files 200**).

## Tree (enrichment-relevant)
```
assets/curriculum/
├── seeker/          manifest, register, score-policy  → Stage 1 Seeker
├── new-muslim/      manifest, register                → Stage 2 Practice
├── daily/           manifest, modules                 → Stage 3 Consistency
├── dai/             manifest, register                → Stage 4 Transmission
├── lab/             register.json                     → Lab pill
├── mirath/          syllabus-v1.json                  → Mīrāth pill
├── office/          registry, diploma-templates       → Portal/office halls
├── vault/           SEAL + admin/_quarantine engines  → do not mount quarantine casually
└── shared/
    ├── lesson-packs-v1.json      ★ primary lesson bodies (seeker/new-muslim/daily/dai)
    ├── content-enrichment-v1.json ★ extra pointers + verify links
    ├── deep-shelves-v1.json
    ├── path-quiz-bank.json / module-spark-quiz-bank.json
    └── modules/curriculum-tools-bridge-v1.js
```

## Pill repair map (MORE drawer)
All must stay under `/campus/...` (locked by smart-nav + integrity). Curriculum JSON does not replace room URLs.

| Pill | Campus path | Curriculum support |
|------|-------------|-------------------|
| Seeker path | `/campus/desk/seeker/` | `shared/lesson-packs` phase `seeker` |
| Practice | `/campus/desk/practice/` | phase `new-muslim` |
| Consistency | `/campus/desk/consistency/` | phase `daily` |
| Transmission | `/campus/desk/transmission/` | phase `dai` |
| Faculty / Bots | `/campus/faculty` · `/campus/bots` | office/hall pages |
| Lab | `/campus/lab/` | `lab/register.json` |
| Mīrāth | `/campus/mirath/` | `mirath/syllabus-v1.json` |
| Foundation… | `/campus/desk/foundation/` etc. | classic modules (still live) |

## Also in root `/assets`
- `css/nuros-icons-v3.css`, `nuros-campus-icons-v1.css` — icon pack
- `nuros/nuros-campus-subpage-guard-v1.js` — subpage guard
- `media/tours/clarity-campus-tour-v1.mp4` — campus tour media

## This delivery
`cu-curriculum-enrich-v1.js` fetches lesson-packs + enrichment and paints glass lesson cards on the four stage pages. Nav wire-fix scripts included for Faculty/Bots pill locks.

Educational only — not a fatwa.
