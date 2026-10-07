# Curriculum folders (additive phases)

```
curriculum/
  shared/       always-on (vault, about, notes)
  seeker/       phase 0 — minimum
  new-muslim/   phase 1 — additions only
  daily/        phase 2 — additions only
  dai/          phase 3 — additions only
  card-map.json source of truth for ids → folder
  stamp-cli.js  node: stamp data-min-i onto index.html
  stamp-curriculum.js  browser helper (ClarityCurriculumStamp)
```

## Activation

```
focus seeker      → ON: shared + seeker
focus new_muslim → ON: + new-muslim
focus practicing → ON: + daily
focus dai        → ON: + dai
```

Implemented at runtime via `html[data-path-i]` + CSS (path progress v6).  
Stamp attributes once with:

```bash
node assets/curriculum/stamp-cli.js --write
```

Card **markup** still lives in root `index.html` until partials are extracted into these folders.
