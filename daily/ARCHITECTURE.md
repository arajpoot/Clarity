# Yawm architecture · fortified foundation (20261030S10F)

Educational only — not a fatwa · not legal advice.

## Isolation rule

`/daily/` is a **self-contained wing**, same idea as Campus:

| May | Must not |
|-----|----------|
| Edit files only under `/daily/` | Import or execute Companion SPA scripts (`companion-inline`, provision-v2, landing-v3, etc.) |
| Link **out** to `/`, `/campus/` | Iframe Companion or Campus |
| Use `clarity.daily.*` localStorage keys | Write vault unlock / AES / passphrase UI |
| Prefer Quran.com + Sunnah.com | Add Productive Muslim or other blogs |
| Run `tools/yawm-content-audit.py` before ship | Ship if audit FAIL |

Companion, Campus, Lab, Library, About, and vault **unlock** stay outside this folder.

## Surface map

```
daily/
  index.html              Hub · ʿAṣr · six live tiles
  ARCHITECTURE.md         This contract
  NAV_CONTRACT.md         Outward links only
  FOUNDATION_LOCK.md      What must not drift
  tools/yawm-content-audit.py
  assets/
    daily.css
    daily-banner.jpg
    js/yawm-hub.js        Hub runtime only
    data/*.json           deed / fard / protection / send-light
    adhkar/*.json         morning · evening packs
    icons/nuros-*.svg
  modules/
    now/ deed/ adhkar/ tasbeeh/ salah/ light/
```

## Data keys (on-device only)

- `clarity.daily.deed.v1`
- `clarity.daily.tasbeeh.v1`
- `clarity.daily.adhkar.v1`
- `clarity.daily.fard.v1`
- `clarity.daily.qada.v1`
- `clarity.daily.sendlight.v1`
- `clarity.daily.vaultnote.v1`  (note text only — not vault unlock)
- `clarity.daily.theme.v1`

## Report card rule

Any ḥadīth block: **grade (or “verify grade”)** · **collection** · **number** · **Sunnah.com link**.  
Else: “Not loaded” + link.  
Follow-ups only under: **One way to act — not a ruling.**

## Ship gate

```bash
cd daily && python3 tools/yawm-content-audit.py
# exit 0 required
```

Do not merge Yawm changes into Companion `index.html` day-landing. Companion may **link** to `/daily/` only.
