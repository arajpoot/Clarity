# Companion restore R1–R6 · 20261021R

## Order (canonical)
1. Banner (calendar / Rabbana / salah)
2. Do this today
3. Adhkār
4. Path / phased chrome
5. Main tabs

## Landing
- Pill under Today: Stay | Skip to main | countdown 12s
- Once per local day (localStorage `clarity_landing_gate_v1`)
- Force show: `?landing=1` · force skip: `?landing=0`
- Reset: `localStorage.removeItem('clarity_landing_gate_v1')`

## Adhkār
- Single module: `clarity-adhkar-card-v1.js` only

## Deploy
Upload all files in this zip to site root / assets. CF purge. Hard refresh.
