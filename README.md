# Companion index.html fix · inline unfreeze

Bismillah. Yawm & Campus untouched.

## Live issues found
1. **Orphan tail after `</body></html>`** — extra `</body>`, `</html>`, blank lines, lazy comments, and `<link>` tags *after* the document ended (invalid HTML; can confuse parsers).
2. **Duplicate** `clarity-vault-fortify-boot-v1.js` loaded twice (DR1 + FORT2).
3. **Landing freeze** — shell mode `landing` hides `#main-content` while `#clarity-day-landing` is not in static HTML; if JS mount fails, the page is blank/frozen.

## Fixes in this `index.html`
- Truncate at first valid `</body></html>` (no trailing junk).
- Single vault fortify boot script.
- **Unfreeze script inlined** before `</body>` (no separate file upload required).
- Recovered CSS links (rail-glow, pedigree) placed before close inside body.

## Simulation
- Structure: 1× body, 1× html close, 0 trailing bytes.
- Unfreeze: mode `landing` + missing day-landing → forces `companion`, sets `#main-content` to `display:block`.

## Deploy
Replace site root `index.html` only. Hard-refresh.
