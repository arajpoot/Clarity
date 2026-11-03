# Amānah gate restore · 20261102G2

## What happened
After H2, `amana-gate-rich-v1.js` **rebuilt the gate with `innerHTML`**, replacing the classic rich DOM (purpose, ḥadīth warning, lockout, backup guidance). Fortify boot on `/amana/` was a **minimal stub (~329 bytes)** instead of the full companion fortify module (~3.6KB).

## Restore
- Classic gate HTML from Companion vault extract
- Full `amana-fortify-boot-v1.js` from companion fortify
- Gate JS **v2** wires existing IDs — does **not** wipe the plaque

Educational only — not a fatwa.
