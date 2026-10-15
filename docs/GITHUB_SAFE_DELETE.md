# GitHub safe delete list (FD6 pass)

## Do NOT delete
- index.html (Companion)
- campus/**, lab/**, vault/**, journey/**, charter/**, adhkar/**, library/**
- assets/curriculum/vault/boot.js
- assets/curriculum/vault/SEAL.json
- assets/curriculum/vault/foundation/**
- assets/curriculum/vault/admin/campus/cu-flash-*.js/css
- assets/curriculum/vault/admin/campus/cu-theme-v1.*
- assets/curriculum/vault/admin/campus/cu-nav-rich-v1.*
- assets/curriculum/vault/admin/campus/cu-bi-flow-v1.js
- assets/curriculum/vault/admin/campus/cu-nuclear-chrome-v1.*
- assets/curriculum/vault/admin/campus/cu-nav-phases-v1.js (wings loads)
- assets/curriculum/vault/admin/vault/**
- assets/curriculum/vault/admin/lab/**
- assets/nx-tj-lmr-js-v1.js
- _redirects / _headers if present

## Safe to delete (orphans — zero HTML/wings/core refs)
```
assets/curriculum/vault/admin/campus/cu-phase-plaque-local-v1.js
assets/curriculum/vault/admin/campus/cu-helper-dock-v1.js
assets/curriculum/vault/admin/campus/cu-content-depth-v1.js
assets/curriculum/vault/admin/campus/cu-deep-shelf-v1.js
assets/curriculum/vault/admin/campus/cu-local-certificate-v1.js
assets/curriculum/vault/admin/campus/cu-deploy-gate-v1.js
assets/curriculum/vault/admin/campus/cu-desk-idle-v1.js
assets/curriculum/vault/admin/campus/cu-nav-phases-v1.css
```

## Root notes (deploy clutter — safe if not linked)
```
COMPANION_CD_B1.txt
COMPANION_CD_B2.txt
COMPANION_CD_B3.txt
COMPANION_CD_B4.txt
COMPANION_DIET_PHASE1.txt
V4_NOTES.txt
```

Optional: move SHA256SUMS.txt to docs/ instead of deleting.
campus-index.html — delete only if Cloudflare/GitHub Pages redirect /campus-index.html → /campus/ is active.

## Prefer archive over delete
git mv <file> _archive/$(date +%Y%m%d)/
