# Phase 5d — Archive3 campus restored & upgraded

## Compare

| Build | Size | Character |
|-------|------|-----------|
| Live main (broken) | ~222 KB | Companion shell paste |
| index-old | ~6 KB | Map-only |
| **archive3/campus/index.html** | **~18 KB** | Full admit · seq path · faculty · lab links |
| Phase 5d (this) | ~18 KB+ | archive3 **+** four-room nav · Quill/Amiri · isolation · markers |

## Kept from archive3
- Hero + limits
- Quick links (desk stages, faculty, grading, lab, library)
- Continue learning + `seq-continue-slot` / `seq-stage-map`
- Admission flow DOM
- Campus CSS/JS chain (seq, admission, faculty)

## Added (Phase 5 / NurOS)
- `data-clarity-room="university"`
- Four-room Port nav (University `is-here`)
- Quill + Amiri type tokens
- Isolation note → Amānah separate
- Path markers study-mirror script
- Companion deep links → `/companion/` or Port `/`

## Deploy
`/campus/index.html` + `/campus/assets/university-path-markers-v1.js`  
Server must already have `/campus/assets/css/*` and `/campus/assets/js/*` from campus tree (archive3/main).
