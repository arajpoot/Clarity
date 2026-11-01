/*! ClarityVaultDigest — build snapshot after unlock · educational · not legal advice */
(function (w) {
  "use strict";
  var CFG = {
    apiBase: w.CLARITY_VAULT_DIGEST_API || "",
    sessionKey: "clarity.vault.digest.session.v1",
  };

  function loadSession() {
    try {
      return JSON.parse(localStorage.getItem(CFG.sessionKey) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function saveSession(s) {
    try {
      localStorage.setItem(CFG.sessionKey, JSON.stringify(s));
    } catch (e) {}
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function unlocked() {
    try {
      if (w.ClarityVault && w.ClarityVault.isUnlocked) return !!w.ClarityVault.isUnlocked();
    } catch (e) {}
    return !!w.__clarityVaultUnlocked;
  }

  /** Collect export-visible lines from known vault ledger hooks or data attributes */
  function collectLedgerLines() {
    var lines = [];
    // Preferred: official vault export API if present
    try {
      if (w.ClarityAmanaVault && typeof w.ClarityAmanaVault.exportLedgerLines === "function") {
        var a = w.ClarityAmanaVault.exportLedgerLines();
        if (Array.isArray(a)) return a.map(String);
      }
    } catch (e) {}
    // Fallback: elements marked for export inside sealed vault root
    var root =
      document.querySelector("[data-vault-root]") ||
      document.getElementById("amana-vault") ||
      document.getElementById("vault");
    if (root) {
      root.querySelectorAll("[data-ledger-line], .vault-ledger-item, [data-export-line]").forEach(function (el) {
        var t = (el.getAttribute("data-ledger-line") || el.textContent || "").trim();
        if (t) lines.push(t.replace(/\s+/g, " ").slice(0, 500));
      });
    }
    return lines;
  }

  function buildBody(lines) {
    var date = today();
    var out = [];
    out.push("Clarity ledger digest · " + date);
    out.push("Educational · not legal advice · not a court document.");
    out.push("Built on your device after unlock · server only stores and sends this snapshot.");
    out.push("");
    out.push("Entries: " + lines.length);
    out.push("---");
    if (!lines.length) {
      out.push("(No export-visible ledger lines found for this snapshot.)");
    } else {
      lines.forEach(function (ln, i) {
        out.push(i + 1 + ". " + ln);
      });
    }
    out.push("---");
    out.push("Acceptance of deeds is with Allah. This digest is a personal aid only.");
    return out.join("\n");
  }

  async function sha256hex(text) {
    if (!w.crypto || !w.crypto.subtle) return "no-subtle";
    var buf = await w.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map(function (b) {
      return b.toString(16).padStart(2, "0");
    }).join("");
  }

  async function buildAndUpload() {
    if (!unlocked()) return { ok: false, error: "locked" };
    var lines = collectLedgerLines();
    var body_text = buildBody(lines);
    var content_hash = await sha256hex(body_text);
    var session = loadSession();
    if (!CFG.apiBase) {
      // Local-only fallback: stash snapshot for mailto
      session.last_local_snapshot = { date: today(), body_text: body_text, content_hash: content_hash };
      saveSession(session);
      return { ok: true, mode: "local", body_text: body_text, content_hash: content_hash };
    }
    if (!session.subId || session.status !== "active") {
      return { ok: false, error: "subscribe_first", body_text: body_text };
    }
    try {
      var res = await fetch(CFG.apiBase.replace(/\/$/, "") + "/api/vault-digest/snapshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subId: session.subId,
          date: today(),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          body_text: body_text,
          content_hash: content_hash,
        }),
      });
      var data = await res.json();
      if (data && data.ok) {
        session.last_upload = today();
        saveSession(session);
      }
      return Object.assign({ body_text: body_text }, data);
    } catch (e) {
      return { ok: false, error: String(e.message || e), body_text: body_text };
    }
  }

  async function subscribe(email) {
    if (!CFG.apiBase) return { ok: false, error: "no_api" };
    var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    var res = await fetch(CFG.apiBase.replace(/\/$/, "") + "/api/vault-digest/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, timezone: timezone }),
    });
    var data = await res.json();
    if (data && data.subId) {
      var s = loadSession();
      s.subId = data.subId;
      s.status = "pending";
      s.email = email;
      saveSession(s);
    }
    return data;
  }

  async function testSend() {
    var s = loadSession();
    if (!CFG.apiBase || !s.subId) return { ok: false, error: "no_session" };
    var res = await fetch(CFG.apiBase.replace(/\/$/, "") + "/api/vault-digest/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subId: s.subId, date: today() }),
    });
    return res.json();
  }

  function mailtoLocal() {
    var s = loadSession();
    var snap = s.last_local_snapshot;
    if (!snap) return { ok: false, error: "no_local" };
    var email = s.email || "";
    var href =
      "mailto:" +
      encodeURIComponent(email) +
      "?subject=" +
      encodeURIComponent("Clarity ledger digest · " + snap.date) +
      "&body=" +
      encodeURIComponent(snap.body_text.slice(0, 1800));
    w.location.href = href;
    return { ok: true };
  }

  
  async function issueToken() {
    if (!unlocked()) return { ok: false, error: "locked" };
    var session = loadSession();
    if (!CFG.apiBase || !session.subId) return { ok: false, error: "subscribe_first" };
    var res = await fetch(CFG.apiBase.replace(/\/$/, "") + "/api/vault-digest/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subId: session.subId }),
    });
    var data = await res.json();
    if (data && data.ok) { session.api_enabled = true; session.last_token_id = data.tokenId || null; saveSession(session); }
    return data;
  }
  async function revokeTokens() {
    var session = loadSession();
    if (!CFG.apiBase || !session.subId) return { ok: false, error: "no_session" };
    var res = await fetch(CFG.apiBase.replace(/\/$/, "") + "/api/vault-digest/token", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subId: session.subId }),
    });
    var data = await res.json();
    session.api_enabled = false; session.last_token_id = null; saveSession(session);
    return data;
  }

  w.ClarityVaultDigest = {
    buildAndUpload: buildAndUpload,
    issueToken: issueToken,
    revokeTokens: revokeTokens,
    subscribe: subscribe,
    testSend: testSend,
    mailtoLocal: mailtoLocal,
    buildBody: buildBody,
    collectLedgerLines: collectLedgerLines,
    loadSession: loadSession,
    saveSession: saveSession,
    config: CFG,
  };
})(window);
