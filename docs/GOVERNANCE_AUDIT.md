# Bismillāh · Honest YouTube fix

**Root cause:** `.hajj-video-frame` used `padding-bottom:56.25%` + `#0f0f0f` **outside** collapse state → permanent black boxes even with empty/folded details.

**Fix:**
- Strip black aspect stages on Reality + Action
- Upgrade `clarity-embed-fold` → real `cs-yt-collapse` with `data-src`
- CSS: hide frame-wrap unless `details[open]`
- Action: seerah/Names keys reassigned to Reality; unique keys only

Educational only — not a fatwa.
