# Y0 · Inventory lock · Day-landing → Yawm · 20261102

**Status: LOCKED · no deletes · no room scrapes yet**

## Sources
- Companion (local archive3 merge): 255618 bytes
- Yawm live `/daily/`: 16146 bytes

## Yawm hub modules (live)
- `modules/adhkar/` → {'status': 200, 'size': 8283}
- `modules/deed/` → {'status': 200, 'size': 6510}
- `modules/light/` → {'status': 200, 'size': 5348}
- `modules/now/` → {'status': 200, 'size': 5635}
- `modules/salah/` → {'status': 200, 'size': 3442}
- `modules/tasbeeh/` → {'status': 200, 'size': 5319}

## Element ids already on Yawm
- `#cdl-adh-progress`
- `#cdl-adh-window`
- `#cdl-adhkar`
- `#cdl-adhkar-list`
- `#cdl-continuity`
- `#cdl-deed`
- `#cdl-done`
- `#cdl-fard`
- `#cdl-fard-check`
- `#cdl-fard-today`
- `#cdl-hist`
- `#cdl-lane`
- `#cdl-light`
- `#cdl-mark`
- `#cdl-now`
- `#cdl-oath`
- `#cdl-period`
- `#cdl-pillars`
- `#cdl-post`
- `#cdl-post-list`
- `#cdl-provisions`
- `#cdl-salah`
- `#cdl-sleep`
- `#cdl-sleep-list`
- `#cdl-streak`
- `#cdl-tas-count`
- `#cdl-tas-inc`
- `#cdl-tas-reset`
- `#cdl-today`
- `#cdl-wudu`
- `#clarity-day-landing`
- `#theme-toggle`

## Companion day-related scripts
- `/assets/companion-inline/inline-clarity-landing-v3.js?v=20261101WB1`
- `/assets/companion-inline/inline-clarity_vault_note_registry.js?v=20261101WB1`
- `/companion/modules/inline-clarity_vault_note_registry.js?v=20261101WB1`

## Assignment matrix

| Source (Companion landing) | Dest | Yawm target | Note |
|----------------------------|------|-------------|------|
| Dual path tiles (Companion path · University pat | **COMPANION_KEEP** | — | SOT pathways on Companion after Y3; Yawm may link  |
| Day landing shell #clarity-day-landing | **YAWM_SHELL** | /daily/ #clarity-day-landing | Yawm hub already uses this id |
| data-landing=pulse | **YAWM** | /daily/ + modules/now/ · modules/deed/ | Today pulse / now window |
| data-landing=adhkar | **YAWM** | /daily/modules/adhkar/ · #cdl-adhkar | Morning/evening pack |
| data-landing=paths | **COMPANION_KEEP** | optional links only | Path tiles stay Companion SOT |
| data-landing=pill | **YAWM_OR_COMPANION** | hub strip | Reopen/hide pill — Yawm default after Y3 |
| Do this today · deed · Mark done | **YAWM** | /daily/modules/deed/ · #cdl-deed #cdl-ma | Reuse deed storage when identified in Y1 |
| Next ṣalāh | **YAWM** | /daily/modules/salah/ · banner times | Link schedule; avoid second prayer engine |
| Tasbeeh today | **YAWM** | /daily/modules/tasbeeh/ · #cdl-tas-* | Device counter |
| Adhkār · morning window | **YAWM** | /daily/modules/adhkar/ | Port rich copy from Companion landing card |
| Vault note registry | **AMANAH_OR_BRIDGE** | optional entry widget | Registry module script; heirs read in Amānah |
| Remember the long stay | **YAWM** | #cdl-oath · provisions | Educational grave reminder |
| Reward that may continue | **YAWM** | #cdl-continuity · #cdl-light | Jariyah / Muslim 1631 context |
| Farḍ / pillars / wudu maps | **YAWM** | #cdl-fard #cdl-pillars #cdl-wudu #cdl-sa | Already scaffolded on Yawm snapshot |
| Banner live · theme · packs | **COMPANION_OR_SHARED** | — | Stay Companion chrome unless shared asset |
| inline-clarity-landing-v3.js | **YAWM_WIRE** | Y2 load on /daily/ | Primary landing behavior script |
| inline-clarity_vault_note_registry.js | **AMANAH_OR_BRIDGE** | Y2 optional | One-way registry |

## Legend
- **YAWM** — port in Y1–Y2
- **YAWM_SHELL** — shell already on `/daily/`
- **YAWM_WIRE** — script load in Y2
- **COMPANION_KEEP** — pathways SOT remain
- **AMANAH_OR_BRIDGE** — registry channel
- **COMPANION_OR_SHARED** — banner/theme

## Policy
- No file deletes in Y0
- Campus / Amānah untouched
- Scrape Companion landing only in **Y3** after Yawm is rich

## Next
**Y1** — Enrich `/daily/` (and modules) from YAWM rows; keep storage keys stable.
