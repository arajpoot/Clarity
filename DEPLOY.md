# Craft room · final upgrade deploy · C15 · 20261104

**Bismillah.** Educational only — not a fatwa.

## Scope
Drop-in enrichment for **Craft only** (`/craft/`).  
Does **not** modify Companion, Yawm, Campus, or Amānah.

## Contents
```
craft/
  CRAFT_CONTRACT.md
  ROOM_LOCK.txt
  NAV_CONTRACT.md
  meme/index.html          # C15MEME — ratio · online BG · shariah · export
  tajweed/index.html       # C15TJ  — deep studio · LMR · practice
  calligraphy/index.html   # C15CG  — engine · pad · PNG
  quiz/index.html          # C15QZ  — local banks
  notes/index.html         # C15NT  — scratch + recovery (not vault)
  assets/
    craft-meme-*.js|css
    craft-tajweed-restore-v1.*
    craft-notes-recovery-v1.js
    data/path-quiz-bank.json
    data/module-spark-quiz-bank.json
    vendor/  (tajweed LMR, deep studio, callig engine, practice-coach, …)
```

## Deploy steps
1. Backup live `/craft/` (optional but recommended).
2. Merge this package’s `craft/assets/` into live `/craft/assets/` (overwrite craft-meme-* and vendor/data additions).
3. Replace live station `index.html` files:
   - `/craft/meme/index.html`
   - `/craft/tajweed/index.html`
   - `/craft/calligraphy/index.html`
   - `/craft/quiz/index.html`
   - `/craft/notes/index.html`
4. Copy contracts into `/craft/` if desired.
5. Hard-refresh / purge CDN. Build tags: C15MEME · C15TJ · C15CG · C15QZ · C15NT.

## Isolation
- No companion-inline script tags on Craft pages.
- No Amānah vault on Notes.
- Craft is sole workbench home (see CRAFT_CONTRACT.md).
