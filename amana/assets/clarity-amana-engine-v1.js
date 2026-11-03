/*! clarity-amana-engine-v1.1 · unlock pill · chamber guard · educational — not a fatwa */
(function (w) {
  "use strict";
  /* allow upgrade */
  w.__CLARITY_AMANA_ENGINE_V1__ = true;

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
    pill.style.cssText =
      "display:none;position:sticky;top:0;z-index:99990;text-align:center;" +
      "padding:0.45rem 0.75rem;font-size:0.8rem;font-weight:700;" +
      "background:linear-gradient(90deg,rgba(30,125,94,0.92),rgba(20,90,70,0.92));" +
      "color:#f3ecda;border-bottom:1px solid rgba(212,180,90,0.45);" +
      "backdrop-filter:blur(6px)";
    document.body.insertBefore(pill, document.body.firstChild);
    return pill;
  }

  function paintPill(on) {
    var pill = ensurePill();
    if (on) {
      pill.style.display = "block";
      pill.innerHTML =
        '🔓 <span>Vault unlocked this session</span> · ' +
        '<a href="/amana/dayn/" style="color:#ffe9a8;text-decoration:underline;margin:0 0.25rem">Dayn</a>' +
        '<a href="/amana/heirs/" style="color:#ffe9a8;text-decoration:underline;margin:0 0.25rem">Heirs</a>' +
        '<a href="/amana/tree/" style="color:#ffe9a8;text-decoration:underline;margin:0 0.25rem">Tree</a>' +
        '<button type="button" id="amana-pill-lock" style="margin-left:0.5rem;padding:0.2rem 0.65rem;border-radius:999px;' +
        'border:1px solid rgba(255,255,255,0.35);background:rgba(0,0,0,0.25);color:inherit;font-weight:800;cursor:pointer;font-size:0.75rem">Lock</button>';
      var btn = document.getElementById("amana-pill-lock");
      if (btn) {
        btn.onclick = function () {
          Engine.lock();
        };
      }
    } else {
      pill.style.display = "none";
      pill.innerHTML = "";
    }
  }

  var Engine = {
    version: "1.1",
    sessionKey: SESSION,
    metaKey: META,

    isUnlocked: function () {
      try {
        return sessionStorage.getItem(SESSION) === "1";
      } catch (e) {
        return false;
      }
    },

    setUnlocked: function (on) {
      try {
        if (on) {
          sessionStorage.setItem(SESSION, "1");
          lastActive = Date.now();
        } else {
          sessionStorage.removeItem(SESSION);
        }
      } catch (e) {}
      try {
        document.documentElement.setAttribute("data-amana-unlocked", on ? "1" : "0");
        if (document.body) document.body.setAttribute("data-amana-unlocked", on ? "1" : "0");
      } catch (e2) {}
      document.querySelectorAll("[data-amana-requires-unlock], .amana-unlocked-only").forEach(function (el) {
        if (on) {
          el.hidden = false;
          el.removeAttribute("hidden");
        } else {
          el.hidden = true;
          el.setAttribute("hidden", "");
        }
      });
      document.querySelectorAll(".amana-locked-only").forEach(function (el) {
        el.hidden = !!on;
        if (on) el.setAttribute("hidden", "");
        else el.removeAttribute("hidden");
      });
      paintPill(!!on);
      try {
        document.dispatchEvent(
          new CustomEvent("clarity-amana-unlock-change", { detail: { unlocked: !!on } })
        );
      } catch (e3) {}
      if (on && typeof w.ClarityLoadAmanaSealed === "function") {
        try {
          w.ClarityLoadAmanaSealed();
        } catch (e4) {}
      }
    },

    touch: function () {
      lastActive = Date.now();
    },

    lock: function () {
      try {
        if (w.ClarityVaultSecure && w.ClarityVaultSecure.lock) w.ClarityVaultSecure.lock();
      } catch (e) {}
      this.setUnlocked(false);
      var st = document.getElementById("amana-engine-status");
      if (st) st.textContent = "Locked · unlock at the gate to explore the chamber";
    },

    requireUnlock: function (opts) {
      opts = opts || {};
      if (this.isUnlocked()) {
        this.touch();
        return true;
      }
      var next = opts.next || location.pathname + location.search + location.hash;
      try {
        sessionStorage.setItem("clarity_amana_return", next);
      } catch (e) {}
      if (opts.redirect !== false) {
        location.href = "/amana/?need_unlock=1";
      }
      return false;
    },

    consumeReturn: function () {
      try {
        var r = sessionStorage.getItem("clarity_amana_return");
        sessionStorage.removeItem("clarity_amana_return");
        return r;
      } catch (e) {
        return null;
      }
    },

    guardPage: function () {
      var path = location.pathname || "";
      if (path === "/amana/" || path === "/amana" || /\/amana\/?$/.test(path)) return;
      if (path.indexOf("/amana/") !== 0) return;

      if (this.isUnlocked()) {
        this.setUnlocked(true);
        this.touch();
        return;
      }

      var shell = document.getElementById("amana-engine-lock-shell");
      if (!shell) {
        shell = document.createElement("div");
        shell.id = "amana-engine-lock-shell";
        shell.setAttribute("role", "dialog");
        shell.setAttribute("aria-modal", "true");
        shell.style.cssText =
          "position:fixed;inset:0;z-index:100000;background:rgba(6,14,12,0.95);" +
          "display:flex;align-items:center;justify-content:center;padding:1.25rem";
        shell.innerHTML =
          '<div style="max-width:22rem;width:100%;padding:1.25rem;border-radius:16px;' +
          "border:1px solid rgba(212,180,90,0.4);background:#0c1c16;color:#e8f0ec;text-align:center\">" +
          '<div style="font-size:1.5rem;margin-bottom:0.35rem">🔐</div>' +
          '<strong style="color:#e8d5a3;font-size:1.1rem">Amānah chamber locked</strong>' +
          '<p style="font-size:0.85rem;line-height:1.45;opacity:0.92;margin:0.65rem 0">' +
          "Unlock at the gate to use Dayn, heirs, tree, and study tools. Educational only — not a fatwa.</p>" +
          '<a href="/amana/?need_unlock=1" style="display:inline-block;margin-top:0.5rem;padding:0.5rem 1.1rem;' +
          'border-radius:999px;background:#1e7d5e;color:#fff;font-weight:800;text-decoration:none">Open gate</a>' +
          "</div>";
        document.body.appendChild(shell);
      }
      document.querySelectorAll("main input, main button, main select, main textarea").forEach(function (el) {
        try {
          el.disabled = true;
        } catch (e) {}
      });
    },

    startIdleWatch: function () {
      var self = this;
      ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
        document.addEventListener(ev, function () { self.touch(); }, { passive: true });
      });
      setInterval(function () {
        if (!self.isUnlocked()) return;
        if (Date.now() - lastActive > IDLE_MS) self.lock();
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
    /* after unlock on gate, optional return */
    if (Engine.isUnlocked()) {
      var ret = Engine.consumeReturn();
      /* don't auto-navigate aggressively — pill links are enough */
      if (ret && /need_unlock/.test(location.search) && ret.indexOf("/amana/") === 0 && ret !== location.pathname) {
        /* stay on gate; pill shows chamber links */
      }
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
