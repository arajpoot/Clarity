# Amānah Dayn · Qard ḥasan architecture (baseline) · C5+ · 20261101

Educational only — not a fatwa · not legal or financial advice · not a court document.

Source of truth recovered from:
- `vault/DAYN_RESTORE.md` · `vault/fortress/ARCHITECTURE.md` · `vault/VAULT_ARCHITECTURE.md`
- Sealed scripts: `dayn-section-bridge-v2.js` · `dayn-ledger-v2.js` · `dayn-mount-adapter-v1.js` · `dayn-enrich-v3.js` · `export-host-v1.js`

---

## Purpose

| Surface | Role |
|---------|------|
| **Outside vault** (day / routine landing slot) | Cash-flow **entry**: direction, amount, counterparty, due, currency, note · save / repay |
| **Inside vault** (Amānah interior, post-unlock) | Same ledger **counterpart** · list · repayments · **CSV / Excel-compatible export** with date stamp |
| **Shared storage** | One device-local store — both surfaces read/write the same lines |

This is **Qard ḥasan ledger only · no interest**.

---

## Data

| Key | Content |
|-----|---------|
| `clarity_dayn_ledger_v1` | Lines + repayments (canonical) |
| `clarity_dayn_tutorial_done_v1` | Tutorial dismissed |

### Line shape (logical)
- direction (in/out / lend/borrow as UI labels)
- amount · currency · counterparty (party)
- due · note · date / createdAt
- repayments[] · remaining computed

---

## UI slots (required DOM)

| Slot | Where | Script |
|------|--------|--------|
| `#clarity-landing-slot-dayn` | Day / routine surface **outside** locked vault | ledger `mountLanding` · bridge `mountDayLandingBundle` |
| `#clarity-vault-slot-dayn` (alias `#amana-vault-ledger-block-dayn`) | **Inside** vault after unlock | ledger `renderVault` · bridge `mountVaultBundle` |
| `[data-dayn-io='1']` / IO host | Vault block | bridge `mountIo` — CSV / Excel / Import |

Bridge also creates **Notes & Qard ḥasan (Dayn)** section shell below heirs letter when hosts exist.

**Gate (if present):**
- `ClarityVaultGate.allowDaynLanding()` — day slot
- `ClarityVaultGate.allowDaynVault()` — vault slot

---

## Excel / CSV ledger (vault IO)

Implemented in **`dayn-section-bridge-v2.js`**:

| Action | Output |
|--------|--------|
| **Generate CSV** | `amana-dayn-YYYY-MM-DD.csv` · `text/csv` |
| **Generate Excel sheet** | `amana-dayn-YYYY-MM-DD.xls` · SpreadsheetML (`application/vnd.ms-excel`) |
| **Import CSV** | Parses into `clarity_dayn_ledger_v1` · fires `clarity-dayn-imported` |

Columns include direction, party, amount, currency, due, note, date, remaining, repayment fields — **time/date stamped filename** via `toISOString().slice(0,10)`.

Export is **on-device download** (Blob), not server upload.

---

## Sealed load order (fortify)

```
runtime-gate-v1.js
facade-v1.js
isolate-guard-v1.js
digest-v1.js
export-host-v1.js
digest-panel-v1.js
dayn-section-bridge-v2.js    ← slots + CSV/Excel IO
dayn-mount-adapter-v1.js     ← ensures landing + vault slots
dayn-ledger-v2.js              ← entry UI + list + repay (v1 retained as backup)
dayn-enrich-v3.js
dayn-ensure-s45.js
passphrase-tutorial-v1.js
```

Path in C2+ Companion: **`/companion/sealed/`** via  
`/companion/assets/clarity-vault-fortify-boot-v1.js` (lazy on Amānah entry).

Historical path: `/vault/sealed/` + `/assets/clarity-vault-fortify-boot-v1.js`.

---

## Ledger API surface (`dayn-ledger-v2`)

Notable functions: `load` · `save` · `saveLine` · `recordRepay` · `settleLine` · `renderToday` · `mountLanding` · `renderVault` · `ensureLandingHost` · `boot`  
Export helper: `clarityDaynExportText` (when exposed).

Enrichment: `dayn-enrich-v3.js` (localStorage-aware).

---

## Related (not Dayn cash-flow)

| Piece | Role |
|--------|------|
| `inline-clarity_vault_note_registry.js` | Heir notes registry (one-way landing → vault) |
| `vault/patches/daily-note-vault-pill.js` | “Open Amānah Vault” navigation pill only |
| Digest / export-host | Post-unlock snapshot · mailto — separate from Dayn sheet |

---

## Isolation

- Yawm `/daily/` and Campus `/campus/` **must not** load sealed Dayn/crypto.
- Dayn mounts in **landing slot or vault interior** — never generic `#main-content` as sole host (fortress rule).
- Passphrase never in export files or URLs.

---

## Gap vs current Companion shell (baseline honesty)

As of C5 package audit:

| Expected | Companion `index.html` |
|----------|-------------------------|
| `#clarity-landing-slot-dayn` | **Not present** (0) |
| `#clarity-vault-slot-dayn` | **Not present** (0) |
| Sealed Dayn scripts | **Present** under `/companion/sealed/` · fortify queue OK |

**Next upgrade (Dayn restore):**  
1. Add landing + vault DOM slots (and optional IO host) in Companion Amānah / day surfaces.  
2. Confirm `dayn-mount-adapter` + ledger `boot` after `clarity-amana-sealed-ready`.  
3. Smoke: save line outside → see inside vault → Generate Excel/CSV date-stamped file.

---

## Deploy reminder (from DAYN_RESTORE)

```html
<script src="/companion/assets/clarity-vault-fortify-boot-v1.js?v=…" defer></script>
```

Hard refresh after slot markup lands.
