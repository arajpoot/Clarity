Clarity Companion — Phase 0 + Phase 1 READY TO UPLOAD
Bismillah. Educational only — not a fatwa.

WHAT TO DO (no patching)

1. Open your GitHub repo: arajpoot/Clarity
2. Go into the companion folder
3. Upload / replace these files:

   companion/index.html          ← already patched
   companion/assets/clarity-companion-unfreeze-v3.js
   companion/assets/clarity-companion-unfreeze-v3.css

4. Optional: also upload the PHASE0_*.md/json docs into companion/

5. Commit message example:
   Companion Phase 0+1 unfreeze (campus untouched)

6. Push. Wait for Cloudflare Pages deploy.

7. Open https://clarity-dawah.fyi/companion/ and hard-refresh
   (or open in private window)

DO NOT upload or change anything inside campus/ or amana/

Smoke check:
- Page is not blank
- Reminder section shows
- In browser console type: window.__COMPANION_UNFREEZE_LOG
