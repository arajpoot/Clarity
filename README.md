# Clarity Companion · lite (~500KB HTML)

Bismillah. Scripts/styles offloaded to `assets/` like prior builds.

## Size
- `index.html` ≈ 513–525 KB (was ~2.1 MB monolith)
- `assets/` holds large JS/CSS modules

## Deploy
Upload `index.html` + entire `assets/` folder keeping relative paths:
```
index.html
assets/clarity-core-block-8.js
assets/clarity-uft-full-restore-v1.js
assets/*.css
...
```

## Integrity
- Day landing + dual paths (Companion / University campus link)
- ALLOW boot shim + gate guards
- Welcome track stubs
- Simulation: landing, dual, switchTab, ALLOW.seeker OK

University `/campus/` not in this package — leave production campus untouched.
