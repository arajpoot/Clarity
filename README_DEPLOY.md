# Clarity Port — P0–P2 deploy package

**Bismillah.** Educational only — not a fatwa.

You do **not** need to hand-edit HTML. Upload files to the paths below.

## What this is

| Phase | Deliverable |
|-------|-------------|
| **P0** | Inventory freeze · rooms untouched · owned assets only |
| **P1** | Trust strip under hero (local-first · not a fatwa · verify) |
| **P1b** | Door registry — last entered date/time on each room tile |
| **P2b** | Visit notepad — optional, timestamped, **not Amānah** |

## Upload map (FTP / Git / host panel)

```
/index.html                          ← replace Port homepage
/assets/port-trust-strip-v1.css
/assets/port-trust-strip-v1.js
/assets/port-door-registry-v1.css
/assets/port-door-registry-v1.js
/assets/port-visit-notes-v1.css
/assets/port-visit-notes-v1.js
```

If your Port homepage is not `index.html` at site root (e.g. `port/index.html`), upload the HTML to **that** file instead, and keep `/assets/...` paths the same.

## What the user sees

1. **Trust pills** under the hero  
2. Each door: **Not yet entered** or **Last entered · &lt;date time&gt;** after tapping Enter  
3. **Visit notes** card under the room grid — Open → type → Save with timestamp  

## Storage (this device only)

- `clarity.port.doorRegistry.v1`
- `clarity.port.visitNotes.v1`

Does **not** write Amānah or other room keys.

## Governance

- Enrichment only  
- Companion / Yawm / Amānah / Campus / Craft **untouched**  
- Not a fatwa · not legal advice · formal trusts stay in Amānah  

## Rollback

Delete the six `/assets/port-*` files and restore the previous `index.html` (or remove the three CSS + three JS lines from head/body).

## After deploy — 2-minute check

1. Open `https://clarity-dawah.fyi/`  
2. See trust strip pills  
3. Each tile shows a small last-entered line  
4. Scroll — Visit notes card appears  
5. Enter Companion (or any door), return — stamp updated  
6. Save a visit note — timestamp appears; Clear all does not affect Amānah  

## Next phase (not in this zip)

**P3** — “How the castle works” (Arrive → Choose a door → Verify)
