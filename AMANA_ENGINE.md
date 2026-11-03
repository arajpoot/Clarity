# Amānah Engine v1 · design

## Problem
1. Dayn UI mounted on gate after unlock (cluttered landing).
2. Chamber routes (dayn/heirs/…) usable without unlock.

## Engine rules
| Surface | Rule |
|---------|------|
| **Gate `/amana/`** | Passphrase + **Dayn intake form always visible** (save needs unlock) |
| **Chamber routes** | `ClarityAmanaEngine.guardPage()` full-screen lock if session locked |
| **Subnav** | Chamber links intercept → gate with `need_unlock` + return URL |
| **Session** | `sessionStorage` unlock flag · idle lock ~12 min |
| **Sealed** | Load ledger chain only after unlock / when engine says open |

## Flow
```
Visit /amana/dayn while locked
  → engine shell “Chamber locked”
  → Open gate → unlock
  → optional return to /amana/dayn
  → sealed scripts load → full ledger
```

## Dayn intake on gate
- Always on gate (entry habit).
- **Save** requires unlock (does not dump full ledger UI onto gate).
- Full ledger stays on `/amana/dayn/`.

Educational only — not a fatwa.
