# Assets allowlist

## Included
- companion-track-tiles-restore-v1.css
- companion-track-unhide-v1.js
- companion-path-track-stable-v1.js
- companion-path-track-integrity-v1.js
- companion-notesload-shim-v1.js
- inline-clarity-banner-restore-v1.js
- clarity-banner-revamp-v1.css
- clarity-meme-bg-fetch-v1.js
- inline-clarity-meme-shariah-bg-v1.js
- companion-freeze-guard-v1.js

## Not included (on purpose)
- clarity-chunk-8.js (use via existing a2 spine only)
- full vault/amana suites
- every polish inline
- clarity-banner-revamp-v1.js (CSS only — restore JS owns data)

## Conflict policy
One banner data owner: banner-restore
One track unhide owner: track-unhide
One meme bg owner: meme-bg-fetch (+ shariah filter)
