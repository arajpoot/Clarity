/*! clarity-amana-engine-v1 · single SOT for unlock · educational — not a fatwa */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_ENGINE_V1__) return;
  w.__CLARITY_AMANA_ENGINE_V1__ = true;

  var SESSION = "clarity_amana_session_unlocked_v1";
  var META = "clarity_amana_gate_meta_v1";
  var IDLE_MS = 12 * 60 * 1000; /* 12 min soft idle lock */
  var lastActive = Date.now();

  var Engine = {
    version: "1.0",
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
        document.body && document.body.setAttribute("data-amana-unlocked", on ? "1" : "0");
      } catch (e2) {}
      document.querySelectorAll("[data-amana-requires-unlock]").forEach(function (el) {
        if (on) {
          el.hidden = false;
          el.removeAttribute("hidden");
          el.removeAttribute("aria-hidden");
        } else {
          el.hidden = true;
          el.setAttribute("hidden", "");
          el.setAttribute("aria-hidden", "true");
        }
      });
      document.querySelectorAll(".amana-unlocked-only").forEach(function (el) {
        el.hidden = !on;
        if (on) el.removeAttribute("hidden");
        else el.setAttribute("hidden", "");
      });
      document.querySelectorAll(".amana-locked-only").forEach(function (el) {
        el.hidden = on;
        if (on) el.setAttribute("hidden", "");
        else el.removeAttribute("hidden");
      });
      try {
        document.dispatchEvent(
          new CustomEvent("clarity-amana-unlock-change", { detail: { unlocked: !!on } })
        );
      } catch (e3) {}
    },

    touch: function () {
      lastActive = Date.now();
    },

    lock: function () {
      try {
        if (w.ClarityVaultSecure && typeof w.ClarityVaultSecure.lock === "function") {
          w.ClarityVaultSecure.lock();
        }
      } catch (e) {}
      this.setUnlocked(false);
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
        var q = "/amana/?need_unlock=1";
        if (opts.reason) q += "&why=" + encodeURIComponent(opts.reason);
        location.href = q;
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

    hasMarker: function () {
      try {
        return !!localStorage.getItem(META);
      } catch (e) {
        return false;
      }
    },

    /** Subpages: block interaction until unlock */
    guardPage: function () {
      var path = location.pathname || "";
      if (path === "/amana/" || path === "/amana" || path === "/amana/index.html") {
        return; /* gate */
      }
      if (path.indexOf("/amana/") !== 0) return;

      if (this.isUnlocked()) {
        this.setUnlocked(true);
        this.touch();
        if (typeof w.ClarityLoadAmanaSealed === "function") {
          w.ClarityLoadAmanaSealed();
        }
        return;
      }

      /* Hard shell: replace interactive main with gate prompt */
      var main = document.querySelector("main") || document.body;
      var shell = document.getElementById("amana-engine-lock-shell");
      if (!shell) {
        shell = document.createElement("div");
        shell.id = "amana-engine-lock-shell";
        shell.setAttribute("role", "dialog");
        shell.setAttribute("aria-modal", "true");
        shell.style.cssText =
          "position:fixed;inset:0;z-index:100000;background:rgba(6,14,12,0.94);display:flex;align-items:center;justify-content:center;padding:1.25rem";
        shell.innerHTML =
          '<div style="max-width:22rem;width:100%;padding:1.25rem;border-radius:16px;border:1px solid rgba(212,180,90,0.4);background:#0c1c16;color:#e8f0ec;text-align:center">' +
          '<div style="font-size:1.5rem;margin-bottom:0.35rem">🔐</div>' +
          '<strong style="color:#e8d5a3;font-size:1.1rem">Amānah chamber locked</strong>' +
          '<p style="font-size:0.85rem;line-height:1.45;opacity:0.92;margin:0.65rem 0">This page needs an unlocked session. Unlock at the gate — educational only, not a fatwa.</p>' +
          '<a href="/amana/?need_unlock=1" style="display:inline-block;margin-top:0.5rem;padding:0.5rem 1.1rem;border-radius:999px;background:#1e7d5e;color:#fff;font-weight:800;text-decoration:none">Open gate</a>' +
          "</div>";
        document.body.appendChild(shell);
      }
      /* Hide underlying forms */
      document.querySelectorAll("main input, main button, main select, main textarea").forEach(function (el) {
        el.disabled = true;
      });
    },

    startIdleWatch: function () {
      var self = this;
      ["pointerdown", "keydown", "touchstart"].forEach(function (ev) {
        document.addEventListener(
          ev,
          function () {
            self.touch();
          },
          { passive: true }
        );
      });
      setInterval(function () {
        if (!self.isUnlocked()) return;
        if (Date.now() - lastActive > IDLE_MS) {
          self.lock();
          try {
            var n = document.getElementById("amana-engine-status");
            if (n) n.textContent = "Locked after idle · unlock again at the gate";
          } catch (e) {}
        }
      }, 30000);
    }
  };

  w.ClarityAmanaEngine = Engine;
  /* Compat aliases used by gate-rich scripts */
  w.ClarityAmanaIsUnlocked = function () {
    return Engine.isUnlocked();
  };
  w.ClarityAmanaSetUnlocked = function (on) {
    Engine.setUnlocked(on);
  };
  w.ClarityAmanaRequireUnlock = function () {
    return Engine.requireUnlock();
  };

  function boot() {
    Engine.setUnlocked(Engine.isUnlocked());
    Engine.guardPage();
    Engine.startIdleWatch();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
