# Amana Vault — 360° Security Audit (2026-10-16)

**Scope:** Companion Amana Vault (live gate + interior + bridge + UFT/fiqh loaders). University curriculum seal out of vault crypto scope except isolation check.

**Standard:** Local-first “bank-like” for a browser PWA — not a hardware HSM or regulated bank core.

---

## Trust model (what “secured like a bank” means here)

| Property | Target |
|----------|--------|
| Passphrase | Never leaves device; never written to storage |
| Vault ciphertext | AES-GCM; authenticity via GCM tag |
| KDF | PBKDF2-SHA-256, 120 000 iterations, random salt |
| Session | Memory-only key after unlock; lock on idle / tab hide |
| Clarity server | Does not receive passphrase or vault plaintext |
| Educational | Not a fatwa, court document, or legal advice |

---

## Findings

### Fixed in this pass (plugged)

| ID | Severity | Issue | Fix |
|----|----------|-------|-----|
| A1 | **High** | Raw AES key was designed to sit in `sessionStorage` (XSS / shared device could decrypt) | **Memory-only** `sessionKey`; strip `sessionStorage` key material |
| A2 | **High** | `printPack` wrote heir fields into `document.write` without escaping | **`amanaEsc`** on full print body; unlock required |
| A3 | **Med** | Unlock success could leave session open if user walks away | **5 min idle lock** + **lock on `visibilitychange` hidden** |
| A4 | **Med** | Status / freeze UX hid failures | Prior FIX2 yield + status CSS (retained) |

### Acceptable / residual (document, not silent)

| ID | Severity | Issue | Residual risk |
|----|----------|-------|----------------|
| R1 | Med | CSP allows `'unsafe-inline'` and `'unsafe-eval'` | Any future XSS is higher impact; long-term: nonces + remove eval |
| R2 | Med | `connect-src` includes `http:` | Prefer HTTPS-only connect when media allows |
| R3 | Low | PBKDF2 120k (not Argon2id) | WebCrypto has no Argon2; 120k balances mobile; optional raise to 210k+ later |
| R4 | Med | Family tree (UFT) may use its own local keys when unlocked | Tree content is **user data on device**; treat device lock screen as outer control |
| R5 | Low | Print opens new window | User-initiated; escaped; still do not print on shared printers carelessly |
| R6 | Info | Orphan Castle/old gate files in `assets/` if not deleted | Not loaded by index; delete recommended list already given |
| R7 | Info | Browser password managers | Mitigated with `autocomplete=off` / input-fix; cannot fully block manager UI |

### Verified strong controls

- Passphrase **not** found in `localStorage.setItem` paths for vault modules  
- Blob keys: `clarity_amana_vault_blob_v1` + `clarity_amana_vault_meta_v1` (salt/meta only in meta)  
- AES-GCM encrypt/decrypt with random IV per write  
- Attempt lockout (secure-login) + RESET requires typed confirmation  
- Gate vs University: vault does not depend on SEAL; campus path separate  
- No remote `fetch` of vault plaintext in gate/secure modules  

---

## Asset load allow-list (companion)

**Must load:** live-gate, secure-login, input-fix, unlock-form, single-path, gate CSS, interior CSS, bridge, nuros, phase1 guard; UFT/fiqh **on unlock only**.

**Must not load:** `clarity-amana-vault-secure-v1.js`, `clarity-amana-vault-gate-js-v1.js`, `clarity-amana-vault-access-v1.js`.

---

## Operator checklist (user amanah)

1. Device OS lock + browser site isolation  
2. Unique vault passphrase (12+), offline backup of phrase only  
3. Export/print only when alone; lock after  
4. After this SEC deploy: hard refresh; old session keys in `sessionStorage` are cleared on next lock/load  
5. Shared computer: always Lock + close tab  

---

## Verdict

**Vault path is materially hardened** for on-device educational use: ciphertext at rest, passphrase not stored, session key not persisted, print XSS closed, idle/visibility lock on.  

**Not** a substitute for institutional banking controls (HSM, Argon2, CSP without unsafe-eval, formal pentest). Residual items R1–R3 are the honest gap to “true bank grade” in a browser.

*Audit pass: 20261016SEC · Clarity Amana*
