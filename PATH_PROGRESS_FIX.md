# Path progress fix (v5)

## Bugs fixed
1. **Quiz re-asked after clear** — unlock is now permanent via `clarity_path_unlocked_max` + `clarity_quiz_passed_v1` (JSON). Switching among unlocked doors never re-opens the quiz.
2. **Sections short on content** — filter is **additive** (union of allowlists through unlocked max), not exclusive to the current door only. Each phase keeps earlier modules.
3. **Aggressive re-lock interval** — removed the 500ms `watchExclusiveLock` loop that re-hid cards after unlock.
4. **Pass threshold** — majority correct (2 of 3) unlocks the door; once unlocked, never quizzed again for that door.
5. **Welcome pick** — choosing a track grants that door and all below (marks quiz passed for those doors).

## Storage keys
- `clarity_path_unlocked_max` — highest index (0=seeker … 3=dai)
- `clarity_quiz_passed_v1` — `{ "new_muslim": true, "practicing": true, ... }`
- Reset via track **Reset** / `clarityPathResetToSeeker()` clears both.

## Deploy
Upload `assets/clarity-path-progress-v1.js` and `index.html` (cache-bust `?v=20261005c`). Purge CDN. Hard-refresh phone.
