# Smoke · multi-cycle (notesLoad hard fix)

## Cycles
1. Cold + tab sweep: caught=[] notesLoad=function
2. Early boot + notes tab: caught=[] notesLoad=function
3. Package integrity: missing asset refs=0

## Fix layers
1. Head stub: window.notesLoad always defined
2. clarity-core-block-8.js top harden (CLARITY_NOTESLOAD_HARDEN)
3. Call sites guarded with typeof checks
4. notes-recovery sets __notesLoadReal + window.notesLoad

## Deploy note
Live clarity-dawah.fyi still shows old core error until this package is uploaded
(assets/clarity-core-block-8.js + index.html). Hard-refresh / clear SW after deploy.

Campus /campus/ not included.
