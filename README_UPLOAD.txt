Companion error sweep · 20261026FIX

Fixes from live review:
1. Four track path tiles missing — path plaques CSS had display:none on .clarity-gate-switcher
2. notesLoad is not defined — early shim + bind to recovery
3. Icons v3 not applying reliably — boot ensures CSS + reapply
4. HTML structure — single body/html close

ESSENTIALS upload (Companion only, campus untouched):
  assets/companion-inline/inline-clarity_path_plaques_v1.js
  assets/companion-notesload-shim-v1.js
  assets/companion-icons-v3-boot-v1.js
  assets/css/companion-track-tiles-restore-v1.css
  index.html  (optional full; or inject tags from INJECT.txt)

Hard-refresh Companion home. Confirm Track: Seeker · New Muslim · Daily · Dai visible.
