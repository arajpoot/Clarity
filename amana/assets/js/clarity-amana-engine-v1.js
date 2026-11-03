/*! clarity-amana-engine-v2 · M2 · pill below gate · educational — not a fatwa */
(function (w) {
  "use strict";
  w.__CLARITY_AMANA_ENGINE_V2__ = true;

  var SESSION = "clarity_amana_session_unlocked_v1";
  var META = "clarity_amana_gate_meta_v1";
  var IDLE_MS = 12 * 60 * 1000;
  var lastActive = Date.now();

  function ensurePill() {
    var pill = document.getElementById("amana-unlock-pill");
    if (pill) return pill;
    pill = document.createElement("div");
    pill.id = "amana-unlock-pill";
    pill.setAttribute("role", "status");
    /* Place after gate if present, else after subnav, else top of main */
    var gate = document.getElementById("amana-vault-gate");
    var main = document.querySelector("main.amana-wrap") || document.querySelector("main");
    if (gate && gate.parentNode) {
      if (gate.nextSibling) gate.parentNode.insertBefore(pill, gate.nextSibling);
      else gate.parentNode.appendChild(pill);
    } else if (main) {
      main.insertBefore(pill, main.firstChild);
    } else {
      document.body.insertBefore(pill, document.body.firstChild);
    }
    return pill;
  }

  function paintPill(on) {
    var pill = ensurePill();
    if (on) {
      pill.classList.add("is-on");
      pill.style.display = "block";
      pill.innerHTML =
        '🔓 <strong>Vault unlocked</strong> — explore chamber · ' +
        '<a href="/amana/dayn/">Dayn</a>' +
        '<a href="/amana/heirs/">Heirs</a>' +
        '<a href="/amana/tree/">Tree</a>' +
        '<a href="/amana/fiqh/">Farāʾiḍ</a>' +
        '<button type="button" id="amana-pill-lock">Lock</button>';
      var btn = document.getElementById("amana-pill-lock");
      if (btn) btn.onclick = function () { Engine.lock(); };
    } else {
      pill.classList.remove("is-on");
      pill.style.display = "none";
      pill.innerHTML = "";
    }
  }

  var Engine = {
    version: "2.0",
    isUnlocked: function () {
      try { return sessionStorage.getItem(SESSION) === "1"; } catch (e) { return false; }
    },
    setUnlocked: function (on) {
      try {
        if (on) { sessionStorage.setItem(SESSION, "1"); lastActive = Date.now(); }
        else sessionStorage.removeItem(SESSION);
      } catch (e) {}
      try {
        document.documentElement.setAttribute("data-amana-unlocked", on ? "1" : "0");
        if (document.body) document.body.setAttribute("data-amana-unlocked", on ? "1" : "0");
      } catch (e2) {}
      document.querySelectorAll("[data-amana-requires-unlock], .amana-unlocked-only").forEach(function (el) {
        el.hidden = !on;
        if (on) el.removeAttribute("hidden");
        else el.setAttribute("hidden", "");
      });
      paintPill(!!on);
      try {
        document.dispatchEvent(new CustomEvent("clarity-amana-unlock-change", { detail: { unlocked: !!on } }));
      } catch (e3) {}
      if (on && typeof w.ClarityLoadAmanaSealed === "function") {
        try { w.ClarityLoadAmanaSealed(); } catch (e4) {}
      }
    },
    touch: function () { lastActive = Date.now(); },
    lock: function () {
      try { if (w.ClarityVaultSecure && w.ClarityVaultSecure.lock) w.ClarityVaultSecure.lock(); } catch (e) {}
      this.setUnlocked(false);
    },
    requireUnlock: function (opts) {
      opts = opts || {};
      if (this.isUnlocked()) { this.touch(); return true; }
      try { sessionStorage.setItem("clarity_amana_return", opts.next || location.pathname); } catch (e) {}
      if (opts.redirect !== false) location.href = "/amana/?need_unlock=1";
      return false;
    },
    guardPage: function () {
      var path = location.pathname || "";
      if (/\/amana\/?$/.test(path) || path === "/amana/index.html") return;
      if (path.indexOf("/amana/") !== 0) return;
      if (this.isUnlocked()) { this.setUnlocked(true); this.touch(); return; }
      if (document.getElementById("amana-engine-lock-shell")) return;
      var shell = document.createElement("div");
      shell.id = "amana-engine-lock-shell";
      shell.setAttribute("role", "dialog");
      shell.style.cssText = "position:fixed;inset:0;z-index:100000;background:rgba(6,14,12,0.95);display:flex;align-items:center;justify-content:center;padding:1.25rem";
      shell.innerHTML = '<div style="max-width:22rem;padding:1.25rem;border-radius:16px;border:1px solid rgba(212,180,90,0.4);background:#0c1c16;color:#e8f0ec;text-align:center"><div style="font-size:1.5rem">🔐</div><strong style="color:#e8d5a3">Chamber locked</strong><p style="font-size:0.85rem;line-height:1.45">Unlock at the gate. Educational only — not a fatwa.</p><a href="/amana/?need_unlock=1" style="display:inline-block;margin-top:0.5rem;padding:0.5rem 1.1rem;border-radius:999px;background:#1e7d5e;color:#fff;font-weight:800;text-decoration:none">Open gate</a></div>';
      document.body.appendChild(shell);
      document.querySelectorAll("main input, main button, main select, main textarea").forEach(function (el) {
        try { el.disabled = true; } catch (e) {}
      });
    },
    startIdleWatch: function () {
      var self = this;
      ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
        document.addEventListener(ev, function () { self.touch(); }, { passive: true });
      });
      setInterval(function () {
        if (self.isUnlocked() && Date.now() - lastActive > IDLE_MS) self.lock();
      }, 30000);
    }
  };

  w.ClarityAmanaEngine = Engine;
  w.ClarityAmanaIsUnlocked = function () { return Engine.isUnlocked(); };
  w.ClarityAmanaSetUnlocked = function (on) { Engine.setUnlocked(on); };
  w.ClarityAmanaRequireUnlock = function () { return Engine.requireUnlock(); };

  function boot() {
    Engine.setUnlocked(Engine.isUnlocked());
    Engine.guardPage();
    Engine.startIdleWatch();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
