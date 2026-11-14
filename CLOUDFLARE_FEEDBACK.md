# Clarity feedback inbox · Cloudflare channel

**Bismillah.** Educational only — not a fatwa.

This wires **user notes from the About tab** to **your personal inbox** using Cloudflare on `clarity-dawah.fyi`.

You (domain owner) must click these steps in the Cloudflare dashboard — this pack cannot log into your account.

---

## Path A — Email Routing only (fastest)

Works with the **Mail app** button (`mailto:feedback@clarity-dawah.fyi`).

1. Cloudflare dashboard → select zone **clarity-dawah.fyi**
2. **Email** → **Email Routing** → enable
3. Add destination address = **your real inbox** (Gmail etc.) and verify the link Cloudflare sends you
4. **Routing rules** → Create address:
   - **Custom address:** `feedback`
   - **Action:** Forward to → your verified inbox
5. DNS: accept Cloudflare’s MX records for Email Routing if prompted
6. Test: send any mail to `feedback@clarity-dawah.fyi` → should arrive in your inbox

App already uses:

`feedback@clarity-dawah.fyi`

---

## Path B — Worker “Send to Clarity” (no mail app required)

Surprise path: the **Send to Clarity** button `POST`s JSON to `/api/feedback`. A Worker emails you via Cloudflare **Email Workers**.

### B1. Prerequisites
- Path A done (`feedback@clarity-dawah.fyi` routes to you)
- Cloudflare account on the same zone

### B2. Create Worker

1. **Workers & Pages** → Create Worker → name e.g. `clarity-feedback`
2. Paste the code from `workers/clarity-feedback.js` in this pack
3. **Settings → Triggers → Routes** (or Custom domain):
   - Route: `clarity-dawah.fyi/api/feedback*`
4. **Settings → Bindings → Email**:
   - Binding name: `SEB` (must match the script)
   - Or use the `send_email` binding name shown in your dashboard UI
5. Deploy

### B3. Email binding notes
Cloudflare **Email Workers** can *send* only when Email Routing is enabled for the zone and the **from** address is an address on your domain (e.g. `noreply@clarity-dawah.fyi` or `feedback@clarity-dawah.fyi`).

If the binding UI differs slightly in your account, keep:
- **From:** `feedback@clarity-dawah.fyi` (or `noreply@…` you control)
- **To:** your personal inbox (same destination as Email Routing)

### B4. Test
```bash
curl -X POST https://clarity-dawah.fyi/api/feedback \
  -H 'content-type: application/json' \
  -d '{"type":"suggestion","message":"test from curl","room":"companion-about"}'
```
You should get an email. The About button **Send to Clarity** should then succeed without opening a mail client.

If the Worker is not deployed yet, the app **falls back** to a mail draft to `feedback@clarity-dawah.fyi`.

---

## Privacy / adab
- Do not put vault passphrases or private dayn data in feedback
- GitHub button stays optional (public)
- Prefer Email Routing + Worker for private inbox delivery

---

## App constants (in JS)
```js
FEEDBACK_TO = "feedback@clarity-dawah.fyi"
FEEDBACK_API = "/api/feedback"
```
