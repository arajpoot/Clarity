# U28S · Surface-local curriculum (no deep vault runtime)

**Bismillah.** All desk curriculum assets live under `/campus/assets/curriculum/`.

## Layout
```
campus/assets/curriculum/
  shared/   engine.js spark-quiz.js phase-plaque.js|.css curriculum-controller.js
  seeker/   college-seeker.js loader.js
  practice/ college-practice.js loader.js
  consistency/ ...
  transmission/ ...
  manifest.json · CURRICULUM_RESTORE.txt
campus/desk/{seeker|practice|consistency|transmission}/index.html
campus/desk/index.html
```

## Deploy
1. Upload **entire** `campus/assets/curriculum/` tree from pack
2. Upload four stage `index.html` + desk hub
3. Hard refresh stages — Network should show `/campus/assets/curriculum/...` only (not vault/foundation)

## Smoke
- loader.js + shared/engine.js 200
- build **U28S**
- curriculum host present
