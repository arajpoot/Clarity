# Phase 1 — Unfreeze & isolation

## Problem
1. Tab panels / landing races left UI looking frozen.
2. `daily-isolate-js` forced `#clarity-day-landing { display:block }`, fighting Yawm-SoT hide CSS and rb-boot scrub.
3. Multiple boot patches without a single last-writer unfreeze.

## Fix
- **clarity-companion-unfreeze-v3.js**: multi-pass (sync, DOMContentLoaded, load, 300/1200/2800ms)
  - Force `data-clarity-room=companion` + `data-shell-mode=companion`
  - Unlock pointer-events / overflow
  - Hide day-landing + vault chrome on Companion
  - Show `#main-content`
  - Open hash tab or **reminder**
  - Neutralize forced style.display on day-landing
- **clarity-companion-unfreeze-v3.css**: high-specificity hide/show rules
- **daily-isolate-js**: link to `/daily/` only; never show day-landing on Companion

## Untouched
Campus, Amānah, Yawm module source of truth.

## Success
Cold load Companion → main visible, reminder active, no hard TypeError from missing main.
