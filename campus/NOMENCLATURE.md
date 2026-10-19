# Clarity University — Nomenclature (N0)

**Build:** 20261018N0  
**Scope:** University / campus surfaces only. Companion root naming is separate.

## Phase ids (code, URLs, `data-phase-room`)

| id | Student label | Subtitle |
|----|---------------|----------|
| `seeker` | Seeker | Foundations · belief |
| `practice` | Practice | Skills after foundations |
| `consistency` | Consistency | Steady craft & review |
| `transmission` | Transmission | Share with adab & sources |

## Shared nouns

| Term | Meaning |
|------|---------|
| Map | `/campus/` overview |
| Desk | Phase room `/campus/desk/{id}/` |
| Module | One lesson inside a phase |
| Spark quiz | Short unlock quiz (not a grade of īmān) |
| Phase quiz | End-of-phase gate |
| Lab | Practice studios `/lab/...` |
| Library | Sources |
| Buddy | Study help |
| Transcript | Local learning record |
| Charter | Limits / who this is for |

## Avoid in student UI (primary titles)

- “Junior curriculum” as H1 (OK only as legacy internal id)
- “New Muslim” / “Daily” / “Da’i” as **desk** titles (Companion track names — optional cross-link only)
- “College”, “Junior High”, “Daily HS” in chrome
- Faculty / Security / IT / O&M / Registrar names in student chrome

## Internal APIs (may remain in code)

`ClarityJuniorCurriculum`, `junior-curriculum-card`, foundation college filenames — do not surface as page titles.

## Shell order (N1)

`banner → pills → continue → title → lead → plaque slot → stage → footer`
