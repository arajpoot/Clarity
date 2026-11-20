# U34PATH · Path conductor + bots streamline

## Why bots felt dead
Assets (workers-ops, seq-bots, resurrect) were live **U31BOTS**, but:
- CuSeq bus often missing on bots page → “Sequential bus not loaded”
- Ops panel did not show Junior station progress
- No automation strip from Campus gate → Seeker station

## Surprise
**Path conductor** reads on-device Junior progress and offers next step on:
- `/campus/` landing (after gate)
- `/campus/desk/` and stage desks (via same script when wired)
- `/campus/bots/` station map + progress

## Deploy
1. `cu-path-conductor-v1.css` + `.js`
2. `campus/index.html` · `campus/bots/index.html` · `campus/desk/index.html`
3. Hard refresh gate, bots, desk

Smoke: Landing shows “Your next step” with x/12 · Bots cit-scan shows Junior progress · no Junior leak on foundation · U33 station holds
