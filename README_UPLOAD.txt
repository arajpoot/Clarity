CRITICAL FIX2 · 20261026FIX2

Root cause: path plaques JS still ran:
  el.style.setProperty("display", "none", "important")
on .clarity-gate-switcher — defeating CSS restore.

Now:
- plaques v3: showTrack() only, never hide
- track-unhide-v1.js: MutationObserver + interval last word
- university tile gets 🎓 / nuros-icon-campus
- notesLoad shim v2 early in <head> (no defer)

UPLOAD ALL of:
  assets/companion-inline/inline-clarity_path_plaques_v1.js
  assets/companion-track-unhide-v1.js
  assets/companion-notesload-shim-v1.js
  assets/companion-icons-v3-boot-v1.js
  assets/css/companion-track-tiles-restore-v1.css
  index.html (recommended)

Hard-refresh (or clear cache). Confirm Track: 1 Seeker · 2 New Muslim · 3 Daily · 4 Dai
