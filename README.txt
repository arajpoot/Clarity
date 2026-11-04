Companion A2 SPINE R1–R7 READY

Archive2 packs vendored + loader (companion room only)

PACKS in companion/assets/a2/:
  clarity-runtime-overlays-v1.js
  clarity-chunk-8.js          ← memeDailyVerse + major meme/callig/tj
  clarity-feature-pack-v1.js  ← tj whisper, meme toolbar, callig pad
  clarity-path-pack-v1.js
  clarity-aux-pack-v1.js      ← banner Haramain / salah chrome
  clarity-sticky-harden-v1.js

LOADER: companion-a2-spine-loader-v1.js
  Skips campus / amana / daily
  Loads packs in order after DOM
  Logs window.__A2_SPINE_LOG

KEPT from prior phases:
  unfreeze, tab persist, room nav clean, meme API bridge (fallback), craft core, banner control

UPLOAD entire companion/ tree from this zip (includes assets/a2/*.js — large).

Smoke:
1. window.__A2_SPINE_LOG → spine-start … loaded … spine-ready · api-ok memeDailyVerse
2. Meme → Daily verse — works, no red error
3. Banner still + Live
4. Tajweed LMR / Callig pad respond
5. Campus/Amānah untouched
