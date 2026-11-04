# Companion AI auto-maintainer & repair

**File:** `/companion/assets/companion-ai-maintainer-v1.js`  
**Room:** companion only · campus untouched

## What it does
- Pulses on load, core-ready, spine-ready, and every 12s
- Detects: missing core, `switchTab`, theme, banner live/stills, no visible tab, craft stubs, scroll lock
- Applies **idempotent** repairs (stubs, core reload, stills restore, unlock scroll)
- Logs to `window.__CLARITY_AI_MAINT__`
- API: `ClarityAIMaintainer.status()`, `.pulse()`, `.detect()`, `.log()`

## Not
- Not a fatwa agent  
- Does not modify campus / daily / amana  
- Does not invent missing tab DOM  
