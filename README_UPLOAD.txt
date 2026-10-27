FREEZE FIX · 20261026FREEZE

Cause:
- path plaques MutationObserver watched style/class on whole document
- track-unhide setInterval(force, 3000) rewrote track styles
- Together: infinite mutation → style → mutation loop → page freeze on refresh

Fix:
1. plaques: MutationObserver removed
2. track-unhide: setInterval removed
3. path-track-stable: no intervals, single re-boot, applying lock
4. freeze-guard early in <head>

Upload ALL:
  assets/companion-freeze-guard-v1.js
  assets/companion-track-unhide-v1.js
  assets/companion-inline/inline-clarity_path_plaques_v1.js
  assets/companion-path-track-stable-v1.js
  assets/clarity-path-progress-v1.js
  index.html

Hard-refresh (or close tab and reopen). Page should paint without freeze.
