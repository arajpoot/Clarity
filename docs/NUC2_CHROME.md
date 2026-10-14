NUC2 — Chrome nuclear pass
==========================
Fighters addressed:
1. "How phases work" / phase plaque appearing ABOVE university banner
2. Washed pill strip on day mode
3. Duplicate cu-map-nav / cu-tabs

Fixes:
- cu-nuclear-chrome-v1.css: sticky banner z-index 10000, body flex order, pills solid plaque
- cu-nuclear-chrome-v1.js: moves late-injected phase chrome after banner / into main; strips dup nav

Still optional later (NC4 deletes): campus-engine-v1.*, companion patches on desk (already off)

Smoke:
- Banner is topmost chrome
- How-phases sits under banner inside desk flow
- Pills look like a solid capsule (day + night)
