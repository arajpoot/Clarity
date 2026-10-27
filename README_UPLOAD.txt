Path track integrity · 20261026PATH

PROBLEM:
  clarity-path-progress-v1.js applyContent() did:
    switchTab("reminder"|"action") after each Seeker/New Muslim/Daily/Da’i click
  So track pills behaved like section pills instead of path-extent filters.

FIX:
  companion-path-track-integrity-v1.js
  - Sets __clarityPathExtentOnly during path switches
  - switchTab / clarityOpenSectionDoor swallow hub jumps while that flag is on
  - Still runs clarityRequestPath (quiz/unlock) + applyGateSectionFilter (additive sections)
  - Marks active .cgs-btn track pill

Upload:
  assets/companion-path-track-integrity-v1.js
  index.html (script after path-progress)

Hard-refresh. Tap Track 1–4: content cards should expand/collapse by path; bottom RRRA pills stay independent.
