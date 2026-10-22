# Companion Phase 1–7 · 20261021P7

## Surfaces
- **Landing** (`clarity-landing-active`): Banner + Do this today + Adhkār + chips. Paths/tabs dimmed. Pill: Stay | Skip to main (no countdown).
- **Main** (`clarity-landing-done` + `clarity-main-active`): Banner + learning paths + tabs. Day stack hidden.

## Test
- `?landing=1` → force landing
- `?main=1` → force main
- Clear: `localStorage.removeItem('clarity_landing_gate_v1')`
- Stay → remains on day surface; Skip → main; **Day surface** button re-opens landing

## Upload
index.html + assets listed. CF purge. Hard refresh.
