# Phase 5c — true campus map restored

## Problem
Live `/campus/index.html` was **~222 KB Companion shell** (wrong file).

## Source of truth recovered
GitHub `campus/index-old.html` (~6 KB) — Journey Map with desk / lab / library cards and `campus.js` on-ramp.

## New package
- `campus/index.html` ~true university map (**no `/companion/assets/`**)
- `campus/assets/university-path-markers-v1.js` — study mirror + nav fix
- Uses existing `/campus/assets/css/*` and `/campus/campus.js` already on server

## Deploy
Replace **only** `/campus/index.html` and upload markers JS under `/campus/assets/`.
Do not upload the 222 KB companion-clone as campus again.
