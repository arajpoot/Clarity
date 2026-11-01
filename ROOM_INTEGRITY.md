# Room integrity · C1 · 20261101

## C1 layout

| URL | Role |
|-----|------|
| `/` | **Thin door** — three-room entry only |
| `/companion/` | **Companion home** — full shell |
| `/daily/` | **Yawm** — isolated |
| `/campus/` | **University** — isolated |

## Shared (allowed)

- `/assets/room-nav/*`
- `/assets/companion-inline/*` (Companion may read; Yawm/Campus must not)

## Verify

```bash
python3 tools/room-integrity-audit.py
```
