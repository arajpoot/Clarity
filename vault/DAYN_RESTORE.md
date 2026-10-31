# Amānah Dayn · Qard ḥasan restore from Clarity-main (14)

Build: **20261031DAYN1**

## Source files (authentic)
- `assets/clarity-dayn-ledger-v2.js` ← `inline-clarity-dayn-ledger-v2.js`
- `assets/clarity-dayn-enrich-v3.js` ← `inline-clarity-dayn-enrich-v3.js`
- `assets/clarity-dayn-ledger-v1.js` ← backup of v1
- `assets/clarity-dayn-mount-adapter-v1.js` — ensures `#clarity-landing-slot-dayn` and vault ledger slot

## Storage (unchanged from original)
- `clarity_dayn_ledger_v1` — lines + repayments
- `clarity_dayn_tutorial_done_v1`

## UI (matches your screenshot)
- Badge: Qard ḥasan ledger only · no interest
- Amānah Dayn · cash-flow entry
- Direction · Amount · Counterparty · Due · Currency · Note
- Save to Amānah ledger · Refresh list · Record repayment
- Educational · not a fatwa · not legal or financial advice

## Deploy
Merge `assets/` + `vault/`, boot:
```html
<script src="/assets/clarity-vault-fortify-boot-v1.js?v=20261031DAYN1" defer></script>
```
Hard refresh.
