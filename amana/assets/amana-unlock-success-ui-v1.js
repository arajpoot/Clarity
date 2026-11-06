/*! amana-unlock-success-ui-v1
 * After unlock: hide passphrase create/entry tiles;
 * promote green unlock bar + chamber doors into that space.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  function onUnlockPage() {
    try {
      var p = (w.location.pathname || "").replace(/\/+$/, "");
      return p === "/amana/unlock" || /\/amana\/unlock/i.test(w.location.pathname || "");
    } catch (e) { return false; }
  }
  if (!onUnlockPage()) return;
  if (w.__AMANA_UNLOCK_SUCCESS_UI_V1__) return;
  w.__AMANA_UNLOCK_SUCCESS_UI_V1__ = true;

  function isUnlocked() {
    try {
      if (w.ClarityAmanaEngine && typeof w.ClarityAmanaEngine.isUnlocked === "function") {
        return !!w.ClarityAmanaEngine.isUnlocked();
      }
    } catch (e) {}
    try {
      return sessionStorage.getItem("clarity_amana_session_unlocked_v1") === "1" ||
        d.documentElement.getAttribute("data-amana-unlocked") === "1";
    } catch (e2) { return false; }
  }

  function ensurePanel() {
    var panel = d.getElementById("amana-unlocked-chambers");
    if (panel) return panel;
    panel = d.createElement("section");
    panel.id = "amana-unlocked-chambers";
    panel.setAttribute("role", "region");
    panel.setAttribute("aria-label", "Vault unlocked — chambers");
    panel.innerHTML =
      '<div class="auc-card">' +
      '  <div class="auc-status" id="auc-status-line">' +
      '    <span class="auc-lock" aria-hidden="true">🔓</span>' +
      '    <div>' +
      '      <strong>Vault unlocked</strong>' +
      '      <p>Session open on this device · educational chamber · lock when you leave</p>' +
      '    </div>' +
      '  </div>' +
      '  <p class="auc-lead">Enter a chamber — passphrase form is put away while unlocked.</p>' +
      '  <div class="auc-doors" role="navigation" aria-label="Amānah chambers">' +
      '    <a class="auc-door" href="/amana/dayn/"><span class="ico">📒</span><span class="lab">Dayn</span><span class="sub">debts ledger</span></a>' +
      '    <a class="auc-door" href="/amana/heirs/"><span class="ico">👨‍👩‍👧‍👦</span><span class="lab">Heirs</span><span class="sub">who inherits</span></a>' +
      '    <a class="auc-door" href="/amana/tree/"><span class="ico">🌳</span><span class="lab">Tree</span><span class="sub">family map</span></a>' +
      '    <a class="auc-door" href="/amana/fiqh/"><span class="ico">📖</span><span class="lab">Farāʾiḍ</span><span class="sub">shares study</span></a>' +
      '    <a class="auc-door" href="/amana/wasiyyah/"><span class="ico">📜</span><span class="lab">Wasiyyah</span><span class="sub">bequest notes</span></a>' +
      '    <a class="auc-door" href="/amana/notes/"><span class="ico">📝</span><span class="lab">Notes</span><span class="sub">private</span></a>' +
      '  </div>' +
      '  <div class="auc-actions">' +
      '    <button type="button" class="auc-lock-btn" id="auc-lock-btn">Lock vault</button>' +
      '    <a class="auc-desk" href="/amana/">← Amānah Desk</a>' +
      '  </div>' +
      '  <p class="auc-note">Educational only — not a fatwa · not legal advice · on-device only</p>' +
      '</div>';
    var gate = d.getElementById("amana-vault-gate");
    if (gate && gate.parentNode) {
      gate.parentNode.insertBefore(panel, gate);
    } else {
      (d.querySelector(".unlock-wrap") || d.body).appendChild(panel);
    }
    var lockBtn = d.getElementById("auc-lock-btn");
    if (lockBtn && !lockBtn.__bound) {
      lockBtn.__bound = true;
      lockBtn.addEventListener("click", function () {
        try {
          if (w.ClarityAmanaEngine && typeof w.ClarityAmanaEngine.lock === "function") {
            w.ClarityAmanaEngine.lock();
          } else {
            sessionStorage.removeItem("clarity_amana_session_unlocked_v1");
            d.documentElement.setAttribute("data-amana-unlocked", "0");
          }
        } catch (e) {}
        apply(false);
      });
    }
    return panel;
  }

  function injectCss() {
    if (d.getElementById("amana-unlock-success-css")) return;
    var s = d.createElement("style");
    s.id = "amana-unlock-success-css";
    s.textContent = [
      "#amana-unlocked-chambers{display:none;max-width:40rem;margin:0.75rem auto 1rem;}",
      "html[data-amana-unlocked='1'] #amana-unlocked-chambers{display:block;}",
      "html[data-amana-unlocked='1'] #amana-vault-gate,",
      "html[data-amana-unlocked='1'] #amana-passphrase-panel,",
      "html[data-amana-unlocked='1'] #amana-gate-create,",
      "html[data-amana-unlocked='1'] #amana-gate-unlock,",
      "html[data-amana-unlocked='1'] .av-purpose,",
      "html[data-amana-unlocked='1'] .av-warn,",
      "html[data-amana-unlocked='1'] #amana-backup-guidance,",
      "html[data-amana-unlocked='1'] #amana-vault-security{display:none!important;}",
      /* hide floating engine pill — replaced by chambers card */
      "html[data-amana-unlocked='1'] #amana-unlock-pill{display:none!important;}",
      ".auc-card{border-radius:18px;border:1px solid rgba(80,200,140,0.45);",
      "background:linear-gradient(165deg,rgba(16,70,50,0.95),rgba(8,28,20,0.98));",
      "padding:1rem 1.05rem 0.9rem;box-shadow:0 10px 32px rgba(0,0,0,0.35);}",
      ".auc-status{display:flex;gap:0.65rem;align-items:flex-start;margin-bottom:0.65rem;}",
      ".auc-status .auc-lock{font-size:1.45rem;line-height:1;}",
      ".auc-status strong{display:block;color:#b8f0c8;font-size:1.05rem;}",
      ".auc-status p{margin:0.15rem 0 0;font-size:0.78rem;opacity:0.9;line-height:1.35;}",
      ".auc-lead{margin:0 0 0.65rem;font-size:0.86rem;opacity:0.92;}",
      ".auc-doors{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0.45rem;}",
      "@media(min-width:520px){.auc-doors{grid-template-columns:repeat(3,minmax(0,1fr));}}",
      ".auc-door{display:flex;flex-direction:column;gap:0.1rem;padding:0.65rem 0.55rem;",
      "border-radius:14px;border:1px solid rgba(212,180,90,0.35);background:rgba(0,0,0,0.28);",
      "text-decoration:none;color:#f0e6c8;transition:transform .15s ease,border-color .15s;}",
      ".auc-door:hover,.auc-door:focus-visible{transform:translateY(-2px);border-color:rgba(180,240,200,0.55);}",
      ".auc-door .ico{font-size:1.15rem;}",
      ".auc-door .lab{font-weight:700;font-size:0.92rem;color:#e8d5a3;}",
      ".auc-door .sub{font-size:0.7rem;opacity:0.8;}",
      ".auc-actions{display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;justify-content:space-between;margin-top:0.75rem;}",
      ".auc-lock-btn{border-radius:999px;padding:0.4rem 0.9rem;border:1px solid rgba(212,180,90,0.4);",
      "background:rgba(0,0,0,0.35);color:#f0e6c8;font-weight:700;cursor:pointer;}",
      ".auc-desk{color:#d4b45a;font-weight:600;font-size:0.85rem;text-decoration:none;}",
      ".auc-note{margin:0.55rem 0 0;font-size:0.7rem;opacity:0.8;text-align:center;}"
    ].join("");
    (d.head || d.documentElement).appendChild(s);
  }

  function apply(force) {
    injectCss();
    var on = typeof force === "boolean" ? force : isUnlocked();
    d.documentElement.setAttribute("data-amana-unlocked", on ? "1" : "0");
    if (on) {
      ensurePanel();
      var gate = d.getElementById("amana-vault-gate");
      if (gate) {
        gate.hidden = true;
        gate.setAttribute("aria-hidden", "true");
      }
      var pill = d.getElementById("amana-unlock-pill");
      if (pill) pill.style.display = "none";
    } else {
      var panel = d.getElementById("amana-unlocked-chambers");
      if (panel) panel.style.display = "none";
      var gate2 = d.getElementById("amana-vault-gate");
      if (gate2) {
        gate2.hidden = false;
        gate2.style.display = "block";
        gate2.removeAttribute("aria-hidden");
      }
    }
  }

  function boot() {
    apply();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    setTimeout(boot, 80);
    setTimeout(boot, 400);
  });
  d.addEventListener("clarity-amana-unlock-change", function () { apply(); });
  setInterval(function () { apply(); }, 2000);

  w.ClarityAmanaUnlockSuccessUI = { refresh: apply };
})(window, document);
