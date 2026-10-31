/*! Digest panel — ledger section only · never passphrase gate · educational */
(function () {
  "use strict";
  function badContext(el) {
    if (!el) return true;
    var t = (el.textContent || "").toLowerCase();
    if (/create\s*&\s*open vault|i have a vault|confirm passphrase/.test(t) && el.querySelector && el.querySelector('input[type="password"]'))
      return true;
    // if host itself is inside a password form card with strength meter
    var card = el.closest("section,form,article,.card") || el;
    var ct = (card.textContent || "").toLowerCase();
    if (/strength:\s*—/.test(ct) && card.querySelector('input[type="password"]')) return true;
    return false;
  }
  function host() {
    var h =
      document.getElementById("vault-export-host") ||
      document.querySelector("#amana-ledger-section [data-vault-export]") ||
      document.querySelector("[data-vault-ledger] [data-vault-export]") ||
      document.querySelector("[data-vault-export]");
    if (h && badContext(h)) return null;
    return h;
  }
  function render() {
    if (window.ClarityVaultGate && !window.ClarityVaultGate.allowDigestPanel()) return;
    var h = host();
    if (!h || h.querySelector("[data-vault-digest-panel]")) return;
    if (badContext(h)) return;
    var box = document.createElement("div");
    box.setAttribute("data-vault-digest-panel", "1");
    box.style.cssText =
      "margin:1rem 0 0;padding:1rem;border:1px solid rgba(201,168,76,.35);border-radius:12px;background:rgba(0,0,0,.2)";
    box.innerHTML =
      "<h3 style='margin:0 0 .5rem;color:#c9a84c;font-size:.85rem;letter-spacing:.06em;text-transform:uppercase'>Daily email digest · snapshot-only</h3>" +
      "<p style='font-size:.82rem;opacity:.9;margin:0 0 .75rem'>Built on your device after unlock. Server only stores and sends this snapshot. Passphrase never leaves this device. Educational · not legal advice.</p>" +
      "<label style='display:block;font-size:.8rem;margin:.35rem 0'>Email<br/><input id='cvd-email' type='email' autocomplete='email' style='width:100%;max-width:22rem;padding:.4rem;border-radius:8px;border:1px solid rgba(201,168,76,.3);background:rgba(0,0,0,.25);color:inherit'/></label>" +
      "<div style='margin-top:.5rem;display:flex;flex-wrap:wrap;gap:.35rem'>" +
      "<button type='button' id='cvd-sub' style='padding:.4rem .8rem;border:0;border-radius:999px;background:#1e7d5e;color:#fff;font-weight:700'>Enable / verify</button>" +
      "<button type='button' id='cvd-snap' style='padding:.4rem .8rem;border:0;border-radius:999px;background:#1e7d5e;color:#fff;font-weight:700'>Build &amp; upload today’s snapshot</button>" +
      "<button type='button' id='cvd-test' style='padding:.4rem .8rem;border-radius:999px;border:1px solid rgba(201,168,76,.4);background:transparent;color:inherit'>Send test</button>" +
      "<button type='button' id='cvd-mail' style='padding:.4rem .8rem;border-radius:999px;border:1px solid rgba(201,168,76,.4);background:transparent;color:inherit'>mailto (local)</button>" +
      "</div>" +
      "<p id='cvd-status' style='font-size:.78rem;margin-top:.5rem;opacity:.9'></p>" +
      "<details style='margin-top:.85rem' data-vault-api-panel>" +
      "<summary style='cursor:pointer;color:#c9a84c;font-weight:700'>On-demand ledger API (optional)</summary>" +
      "<p style='font-size:.78rem;opacity:.9'>Personal token for <em>your</em> Claude/Grok tools to GET snapshots you uploaded after unlock. Clarity does not send ledger to model vendors. Revoke anytime. Educational · not legal advice.</p>" +
      "<button type='button' id='cvd-token' style='padding:.35rem .75rem;border:0;border-radius:999px;background:#1e7d5e;color:#fff;font-weight:700;margin:.25rem'>Issue API token</button>" +
      "<button type='button' id='cvd-revoke' style='padding:.35rem .75rem;border-radius:999px;border:1px solid rgba(201,168,76,.4);background:transparent;color:inherit;margin:.25rem'>Revoke tokens</button>" +
      "<pre id='cvd-token-out' style='display:none;white-space:pre-wrap;font-size:.72rem;margin-top:.5rem;padding:.5rem;background:rgba(0,0,0,.35);border-radius:8px'></pre>" +
      "</details>";
    h.appendChild(box);
    var st = document.getElementById("cvd-status");
    function msg(t) { if (st) st.textContent = t; }
    document.getElementById("cvd-sub").onclick = async function () {
      var email = (document.getElementById("cvd-email").value || "").trim();
      if (!email) return msg("Enter email");
      if (!window.ClarityVaultDigest) return msg("Digest module missing");
      msg("Subscribing…");
      var r = await window.ClarityVaultDigest.subscribe(email);
      msg(r && r.ok ? "Check inbox to verify, then upload a snapshot." : "Subscribe failed: " + (r && r.error));
    };
    document.getElementById("cvd-snap").onclick = async function () {
      if (!window.ClarityVault || !window.ClarityVault.isUnlocked()) return msg("Unlock vault first");
      msg("Building snapshot…");
      var r = await window.ClarityVaultDigest.buildAndUpload();
      msg(r && r.ok ? "Snapshot ready (" + (r.mode || "uploaded") + ")." : "Failed: " + (r && r.error));
    };
    document.getElementById("cvd-test").onclick = async function () {
      var r = await window.ClarityVaultDigest.testSend();
      msg(r && r.ok ? "Test send requested." : "Test failed: " + (r && r.error));
    };
    document.getElementById("cvd-mail").onclick = function () {
      var r = window.ClarityVaultDigest.mailtoLocal();
      msg(r && r.ok ? "Opening mail app…" : "Build a local snapshot first");
    };
    document.getElementById("cvd-token").onclick = async function () {
      if (!window.ClarityVault || !window.ClarityVault.isUnlocked()) return msg("Unlock vault first");
      msg("Issuing token…");
      var r = await window.ClarityVaultDigest.issueToken();
      var out = document.getElementById("cvd-token-out");
      if (r && r.ok && r.token) {
        out.style.display = "block";
        out.textContent = "Bearer token (copy once):\n" + r.token + "\n\nGET " + (r.base_url || "") + "/api/vault-digest/latest\nAuthorization: Bearer <token>\n\n" + (r.note || "");
        msg("Token issued — copy now; it will not be shown again.");
      } else msg("Token failed: " + (r && r.error));
    };
    document.getElementById("cvd-revoke").onclick = async function () {
      var r = await window.ClarityVaultDigest.revokeTokens();
      msg(r && r.ok ? "Tokens revoked (" + (r.revoked || 0) + ")." : "Revoke failed");
      var out = document.getElementById("cvd-token-out");
      if (out) { out.textContent = ""; out.style.display = "none"; }
    };
  }
  function tick() { render(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick);
  else tick();
  setTimeout(tick, 1000);
  setTimeout(tick, 2500);
  setTimeout(tick, 5000);
  try {
    var obs = new MutationObserver(tick);
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { try { obs.disconnect(); } catch (e) {} }, 25000);
  } catch (e) {}
})();
