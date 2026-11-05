# Clarity · DEPLOY_GATE · project-wide

**Bismillah.** Educational only — not a fatwa.

Use this gate for **every** upgrade, fix, or deploy zip — any room.

## Before packaging
1. List **rooms_touched** (companion | yawm | campus | amana | craft).
2. Confirm **no forbidden cross-loads** per `PROJECT_MANIFEST.json` rooms table.
3. If Craft Meme paint/BG changed: Shariah scan on every URL path; fail closed; required scripts present.
4. If Amānah touched: passphrase never to server; no “we can recover vault” claims.
5. If scripture UI touched: no free-type as revelation (P2).
6. Educational / not-a-fatwa stamp on user-facing HTML (P1).

## Pack must contain
- [ ] `rooms_touched` declared (README or SMOKE JSON)
- [ ] Smoke checklist including **project_invariants**
- [ ] Diff note if contract/manifest amended

## Reject pack if
- Craft Meme introduces `new Image()` / draw path without `clarityShariahScanUrl`
- Companion re-embeds full Craft engines as home (post-port) or Amānah vault
- Yawm loads companion-inline
- Smoke omits isolation / fatwa / scripture rules for touched surfaces
- “Fix” removes a required governance script without same-change manifest amendment

## Operator sign-off
```
rooms_touched: …
P1–P7 checked: yes/no
manifest version: …
```
