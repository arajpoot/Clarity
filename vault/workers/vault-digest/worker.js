/**
 * Cloudflare Worker — vault digest (snapshot-only)
 * Env: EMAIL_API_KEY, EMAIL_FROM, APP_ORIGIN, DIGEST_SIGNING_SECRET
 * Bindings: DIGEST_KV (KV namespace)
 *
 * Does NOT accept passphrases or vault blobs.
 */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

function id() {
  return crypto.randomUUID();
}

async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sendEmail(env, to, subject, body) {
  // Resend-compatible example; swap provider as needed
  if (!env.EMAIL_API_KEY) {
    return { ok: false, error: "EMAIL_API_KEY missing" };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + env.EMAIL_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM || "Clarity Digest <onboarding@resend.dev>",
      to: [to],
      subject,
      text: body,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    return { ok: false, error: t.slice(0, 200) };
  }
  return { ok: true };
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "");

    // Health
    if (path.endsWith("/api/vault-digest/health")) {
      return json({ ok: true, mode: "snapshot-only" });
    }

    // Subscribe
    if (path.endsWith("/api/vault-digest/subscribe") && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const email = String(body.email || "").trim().toLowerCase();
      const timezone = String(body.timezone || "UTC");
      if (!email || !email.includes("@")) return json({ ok: false, error: "email" }, 400);
      const subId = await sha256(email + (env.DIGEST_SIGNING_SECRET || "dev"));
      const token = id();
      const rec = {
        email,
        timezone,
        status: "pending",
        verify_token: token,
        created_at: new Date().toISOString(),
        last_sent: null,
      };
      await env.DIGEST_KV.put("sub:" + subId, JSON.stringify(rec));
      const verifyUrl = (env.APP_ORIGIN || url.origin) + "/api/vault-digest/verify?token=" + token + "&s=" + subId;
      const mail = await sendEmail(
        env,
        email,
        "Confirm Clarity ledger digest",
        "Confirm daily ledger digest (snapshot-only).\n\n" +
          verifyUrl +
          "\n\nClarity does not hold your vault passphrase. Educational · not legal advice.\n"
      );
      return json({ ok: true, pending: true, subId, mail });
    }

    // Verify
    if (path.endsWith("/api/vault-digest/verify") && request.method === "GET") {
      const token = url.searchParams.get("token");
      const subId = url.searchParams.get("s");
      if (!token || !subId) return json({ ok: false }, 400);
      const raw = await env.DIGEST_KV.get("sub:" + subId);
      if (!raw) 
    // Phase 7 on-demand API
    if (path.endsWith("/api/vault-digest/token") && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      if (body.passphrase || body.password || body.vault_blob) return json({ ok: false, error: "forbidden_fields" }, 400);
      const subId = String(body.subId || "");
      const raw = await env.DIGEST_KV.get("sub:" + subId);
      if (!raw) return json({ ok: false, error: "sub" }, 404);
      const rec = JSON.parse(raw);
      if (rec.status !== "active") return json({ ok: false, error: "not_active" }, 403);
      const last = rec.last_token_at ? Date.parse(rec.last_token_at) : 0;
      if (Date.now() - last < 60000) return json({ ok: false, error: "rate_limit" }, 429);
      const tokenPlain = id() + "." + id();
      const tokenHash = await sha256(tokenPlain + (env.DIGEST_SIGNING_SECRET || "dev"));
      const tokenId = id();
      await env.DIGEST_KV.put("tok:" + tokenHash, JSON.stringify({ tokenId, subId, created_at: new Date().toISOString(), revoked: false, last_read: null }));
      const listKey = "toklist:" + subId;
      let list = [];
      try { list = JSON.parse((await env.DIGEST_KV.get(listKey)) || "[]"); } catch (e) { list = []; }
      list.push(tokenHash);
      if (list.length > 20) { const old = list.shift(); await env.DIGEST_KV.delete("tok:" + old); }
      await env.DIGEST_KV.put(listKey, JSON.stringify(list));
      rec.last_token_at = new Date().toISOString();
      await env.DIGEST_KV.put("sub:" + subId, JSON.stringify(rec));
      return json({ ok: true, token: tokenPlain, tokenId, base_url: url.origin, auth: "Authorization: Bearer <token>", endpoints: { latest: "/api/vault-digest/latest", by_date: "/api/vault-digest/by-date?date=YYYY-MM-DD", dates: "/api/vault-digest/dates" }, note: "Copy once. Clarity does not send ledger to model vendors. Educational · not legal advice." });
    }
    if (path.endsWith("/api/vault-digest/token") && request.method === "DELETE") {
      const body = await request.json().catch(() => ({}));
      const subId = String(body.subId || "");
      const listKey = "toklist:" + subId;
      let list = [];
      try { list = JSON.parse((await env.DIGEST_KV.get(listKey)) || "[]"); } catch (e) { list = []; }
      for (const h of list) {
        const raw = await env.DIGEST_KV.get("tok:" + h);
        if (raw) { const t = JSON.parse(raw); t.revoked = true; await env.DIGEST_KV.put("tok:" + h, JSON.stringify(t)); }
      }
      await env.DIGEST_KV.put(listKey, JSON.stringify([]));
      return json({ ok: true, revoked: list.length });
    }
    async function authToken(request, env) {
      const h = request.headers.get("Authorization") || "";
      const m = h.match(/^Bearer\s+(.+)$/i);
      if (!m) return null;
      const tokenHash = await sha256(m[1].trim() + (env.DIGEST_SIGNING_SECRET || "dev"));
      const raw = await env.DIGEST_KV.get("tok:" + tokenHash);
      if (!raw) return null;
      const rec = JSON.parse(raw);
      if (rec.revoked) return null;
      return { tokenHash, ...rec };
    }
    if (path.endsWith("/api/vault-digest/latest") && request.method === "GET") {
      const auth = await authToken(request, env);
      if (!auth) return json({ ok: false, error: "unauthorized" }, 401);
      let dates = [];
      try { dates = JSON.parse((await env.DIGEST_KV.get("dates:" + auth.subId)) || "[]"); } catch (e) { dates = []; }
      if (!dates.length) return json({ ok: false, error: "no_snapshot" }, 404);
      dates.sort();
      const date = dates[dates.length - 1];
      const snapRaw = await env.DIGEST_KV.get("snap:" + auth.subId + ":" + date);
      if (!snapRaw) return json({ ok: false, error: "no_snapshot" }, 404);
      const snap = JSON.parse(snapRaw);
      auth.last_read = new Date().toISOString();
      await env.DIGEST_KV.put("tok:" + auth.tokenHash, JSON.stringify(auth));
      return json({ ok: true, date: snap.date, content_hash: snap.content_hash, body_text: snap.body_text, disclaimer: "Snapshot only · educational · not legal advice" });
    }
    if (path.endsWith("/api/vault-digest/by-date") && request.method === "GET") {
      const auth = await authToken(request, env);
      if (!auth) return json({ ok: false, error: "unauthorized" }, 401);
      const date = String(url.searchParams.get("date") || "").slice(0, 10);
      if (!date) return json({ ok: false, error: "date" }, 400);
      const snapRaw = await env.DIGEST_KV.get("snap:" + auth.subId + ":" + date);
      if (!snapRaw) return json({ ok: false, error: "no_snapshot" }, 404);
      const snap = JSON.parse(snapRaw);
      return json({ ok: true, date: snap.date, content_hash: snap.content_hash, body_text: snap.body_text, disclaimer: "Snapshot only · educational · not legal advice" });
    }
    if (path.endsWith("/api/vault-digest/dates") && request.method === "GET") {
      const auth = await authToken(request, env);
      if (!auth) return json({ ok: false, error: "unauthorized" }, 401);
      let dates = [];
      try { dates = JSON.parse((await env.DIGEST_KV.get("dates:" + auth.subId)) || "[]"); } catch (e) { dates = []; }
      return json({ ok: true, dates });
    }

    return json({ ok: false, error: "not_found" }, 404);
      const rec = JSON.parse(raw);
      if (rec.verify_token !== token) return json({ ok: false, error: "token" }, 403);
      rec.status = "active";
      rec.verified_at = new Date().toISOString();
      delete rec.verify_token;
      await env.DIGEST_KV.put("sub:" + subId, JSON.stringify(rec));
      return json({ ok: true, status: "active" });
    }

    // Snapshot upload — NO passphrase field accepted
    if (path.endsWith("/api/vault-digest/snapshot") && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      if (body.passphrase || body.password || body.vault_blob) {
        return json({ ok: false, error: "forbidden_fields" }, 400);
      }
      const subId = String(body.subId || "");
      const date = String(body.date || "").slice(0, 10);
      const body_text = String(body.body_text || "").slice(0, 100000);
      const content_hash = String(body.content_hash || "");
      if (!subId || !date || !body_text) return json({ ok: false, error: "fields" }, 400);
      const raw = await env.DIGEST_KV.get("sub:" + subId);
      if (!raw) return json({ ok: false, error: "sub" }, 404);
      const rec = JSON.parse(raw);
      if (rec.status !== "active") return json({ ok: false, error: "not_active" }, 403);
      await env.DIGEST_KV.put(
        "snap:" + subId + ":" + date,
        JSON.stringify({ date, body_text, content_hash, uploaded_at: new Date().toISOString() })
      );
      return json({ ok: true, date });
    }

    // Test send
    if (path.endsWith("/api/vault-digest/test") && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const subId = String(body.subId || "");
      const date = String(body.date || new Date().toISOString().slice(0, 10));
      const raw = await env.DIGEST_KV.get("sub:" + subId);
      if (!raw) return json({ ok: false }, 404);
      const rec = JSON.parse(raw);
      const snapRaw = await env.DIGEST_KV.get("snap:" + subId + ":" + date);
      if (!snapRaw) return json({ ok: false, error: "no_snapshot" }, 404);
      const snap = JSON.parse(snapRaw);
      const mail = await sendEmail(
        env,
        rec.email,
        "Clarity ledger digest · " + date,
        snap.body_text +
          "\n\n---\nBuilt on your device after unlock · server only stores and sends this snapshot.\nEducational · not legal advice.\n"
      );
      return json({ ok: mail.ok, mail });
    }

    // Pause
    if (path.endsWith("/api/vault-digest/pause") && request.method === "POST") {
      const body = await request.json().catch(() => ({}));
      const subId = String(body.subId || "");
      const raw = await env.DIGEST_KV.get("sub:" + subId);
      if (!raw) return json({ ok: false }, 404);
      const rec = JSON.parse(raw);
      rec.status = "paused";
      await env.DIGEST_KV.put("sub:" + subId, JSON.stringify(rec));
      return json({ ok: true, status: "paused" });
    }

    return json({ ok: false, error: "not_found" }, 404);
  },

  // Cron: send today's snapshot for active subs (simplified — list keys in production via index)
  async scheduled(event, env, ctx) {
    // Production: maintain a sub index list in KV. Placeholder no-op with log.
    console.log("vault-digest cron tick", event.scheduledTime);
  },
};
