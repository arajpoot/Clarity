# Companion governance contract — G4 packaging polished

## Room
- Path: `/companion/` only
- `data-clarity-room="companion"`
- Campus / Yawm / Amānah: **frozen** (do not edit for this package)

## Richness (must remain in fragment)
- Allah’s Commands (command-box)
- Daily Samiʿnā verse
- Ilm pathway 7-day
- Calligraphy lab, Meme studio, Tajweed surfaces
- Full Action hub, RRRA tabs, banner AV
- Path tiles (Seeker → Da’i)

## Packaging
- Thin `index.html` entry
- `content/main.fragment.html` body richness (scripts stripped; loaded by boot)
- Versioned assets + sequential `companion-pack-boot-v1.js`
- `content/full.backup.html` recovery
- Inline body scripts extracted to `companion-frag-inline-v1.js` when present

## Stability rules
- One room-nav (shared component)
- No second mount root
- Feature scripts load **after** mount
- Failures surface alert + backup link

## Change policy
- Prefer CSS/JS modules over growing the fragment
- Do not delete richness modules to “look like Campus”
- Campus packaging parity ≠ Campus curriculum merge
