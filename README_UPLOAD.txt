Path track STABLE · 20261026PATH2

Problem:
- path-progress applyContent() called switchTab(hub) → track pills jumped RRRA sections
- Competing integrity scripts + removeChild on rails felt like "HTML disintegrating"

Fix:
1. clarity-path-progress-v1.js (V5): NO switchTab after path change; no removeChild on path rail
2. companion-path-track-stable-v1.js: gentle extent + mark active; no innerHTML/removeChild
3. index: remove path-track-integrity; load stable AFTER path-progress

Upload ALL:
  assets/clarity-path-progress-v1.js
  assets/companion-path-track-stable-v1.js
  assets/companion-inline/inline-clarity_path_plaques_v1.js
  index.html

Hard-refresh (clear cache). Test Track 1–4: cards filter by path; bottom Reminder/Reality/… stay put.
