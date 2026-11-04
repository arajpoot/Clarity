# Phase 7 — Release hardening

## Live crawl (2026-11-04)
`integrity("after upgrade")` **PASS**

| Surface | Notes |
|---------|--------|
| Port | Four tiles OK · not a fatwa · type |
| Companion | room=companion · stance OK |
| Yawm | room=yawm · 0 companion asset bleed |
| University | room=university · ~20 KB true campus · 0 companion assets |
| Amānah | room=amana · passphrase · 0 campus assets |

## Ship gate (every release)
1. Four rooms HTTP 200  
2. Port tiles → correct hrefs  
3. No companion asset bleed on Yawm / Amānah / (true) Campus  
4. Campus not Companion-sized shell  
5. Educational stance visible  
6. No critical duplicate ids  
7. Fetch path changes → Shariah audit (§5)  
8. Record smoke JSON  

## Deploy
- `/assets/nuros/nuros-integrity-smoke-v1.js`
- Optional: root `index.html` (Port) with integrity script linked  

In console: `integrity("after upgrade")` → `{ status: "PASS"|"FAIL", issues: [...] }`
