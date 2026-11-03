/*! amana-gate-rich-v2 · restore classic gate DOM · educational — not a fatwa */
(function (w) {
  "use strict";
  if (w.__AMANA_GATE_RICH_V2__) return;
  w.__AMANA_GATE_RICH_V2__ = true;

  var UNLOCK_KEY = "clarity_amana_session_unlocked_v1";
  var META_KEY = "clarity_amana_gate_meta_v1";

  function $(id) { return document.getElementById(id); }
  function sessionUnlocked() {
    try { return sessionStorage.getItem(UNLOCK_KEY) === "1"; } catch (e) { return false; }
  }
  function setSessionUnlocked(on) {
    try {
      if (on) sessionStorage.setItem(UNLOCK_KEY, "1");
      else sessionStorage.removeItem(UNLOCK_KEY);
    } catch (e) {}
    try {
      document.body.setAttribute("data-amana-unlocked", on ? "1" : "0");
      document.documentElement.setAttribute("data-amana-unlocked", on ? "1" : "0");
    } catch (e2) {}
    document.querySelectorAll(".amana-unlocked-only").forEach(function (el) {
      el.hidden = !on;
      if (on) el.removeAttribute("hidden");
      else el.setAttribute("hidden", "");
    });
  }
  function status(t) {
    var el = $("amana-gate-status");
    if (el) el.textContent = t || "";
  }
  function strength(s) {
    var n = 0;
    if (!s) return 0;
    if (s.length >= 8) n++;
    if (s.length >= 12) n++;
    if (/[A-Z]/.test(s) && /[a-z]/.test(s)) n++;
    if (/\d/.test(s)) n++;
    if (/[^A-Za-z0-9]/.test(s)) n++;
    return Math.min(n, 5);
  }
  function paintStrength(val) {
    var bar = $("amana-strength-bar");
    var lab = $("amana-strength-lab");
    var s = strength(val);
    var labels = ["", "Weak", "Fair", "Good", "Strong", "Very strong"];
    if (bar) {
      bar.style.width = s * 20 + "%";
      bar.setAttribute("data-level", String(s));
    }
    if (lab) lab.textContent = labels[s] || "";
  }
  function showCreate(on) {
    var c = $("amana-gate-create");
    var u = $("amana-gate-unlock");
    if (c) c.hidden = !on;
    if (u) u.hidden = on;
  }
  function loadSealed() {
    if (typeof w.ClarityLoadAmanaSealed === "function") return w.ClarityLoadAmanaSealed();
    if (typeof w.ClarityEnterAmana === "function") return w.ClarityEnterAmana();
    return Promise.resolve();
  }

  w.ClarityAmanaIsUnlocked = sessionUnlocked;
  w.ClarityAmanaSetUnlocked = setSessionUnlocked;

  function wireEyes() {
    document.querySelectorAll(".av-eye").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-for");
        var inp = id && $(id);
        if (!inp) return;
        inp.type = inp.type === "password" ? "text" : "password";
      });
    });
  }

  function mount() {
    var host = $("amana-vault-gate");
    if (!host) return;

    /* Do not wipe rich static DOM — only wire */
    var passNew = $("amana-pass-new");
    var passConfirm = $("amana-pass-confirm");
    var passUnlock = $("amana-pass-unlock");
    var btnCreate = $("amana-btn-create");
    var btnHave = $("amana-btn-have");
    var btnUnlock = $("amana-btn-unlock");
    var btnBack = $("amana-btn-back-create");
    var btnResetStart = $("amana-btn-reset-start");
    var btnResetGo = $("amana-btn-reset-go");

    if (passNew) {
      passNew.addEventListener("input", function () { paintStrength(passNew.value); });
    }
    if (btnHave) {
      btnHave.addEventListener("click", function () { showCreate(false); });
    }
    if (btnBack) {
      btnBack.addEventListener("click", function () { showCreate(true); });
    }
    if (btnCreate) {
      btnCreate.addEventListener("click", function () {
        var a = passNew ? passNew.value : "";
        var b = passConfirm ? passConfirm.value : "";
        if (!a || a.length < 8) {
          status("Use at least 8 characters.");
          return;
        }
        if (a !== b) {
          status("Confirmation does not match.");
          return;
        }
        try {
          localStorage.setItem(META_KEY, JSON.stringify({ hasMarker: true, ts: Date.now() }));
        } catch (e) {}
        var secure = w.ClarityVaultSecure;
        var p = Promise.resolve();
        if (secure && typeof secure.create === "function") {
          p = Promise.resolve(secure.create(a));
        } else if (secure && typeof secure.setup === "function") {
          p = Promise.resolve(secure.setup(a));
        }
        p.then(function () {
          return loadSealed();
        }).then(function () {
          if (window.ClarityAmanaEngine) window.ClarityAmanaEngine.setUnlocked(true); else setSessionUnlocked(true);
          status("Vault marker ready on this device · unlocked this session · not a legal certificate");
          if (passNew) passNew.value = "";
          if (passConfirm) passConfirm.value = "";
        }).catch(function () {
          if (window.ClarityAmanaEngine) window.ClarityAmanaEngine.setUnlocked(true); else setSessionUnlocked(true);
          status("Session open on this device · educational only");
        });
      });
    }
    if (btnUnlock) {
      btnUnlock.addEventListener("click", function () {
        var va = passUnlock ? passUnlock.value : "";
        if (!va) {
          status("Enter your passphrase.");
          return;
        }
        status("Opening…");
        loadSealed().then(function () {
          var secure = w.ClarityVaultSecure;
          if (secure && typeof secure.unlock === "function") {
            return Promise.resolve(secure.unlock(va)).then(function (ok) {
              if (ok === false) {
                status("Unlock failed — wrong passphrase or no vault yet.");
                if (window.ClarityAmanaEngine) window.ClarityAmanaEngine.setUnlocked(false); else setSessionUnlocked(false);
                return;
              }
              if (window.ClarityAmanaEngine) window.ClarityAmanaEngine.setUnlocked(true); else setSessionUnlocked(true);
              status("Unlocked for this browser session");
              if (passUnlock) passUnlock.value = "";
            });
          }
          if (window.ClarityAmanaEngine) window.ClarityAmanaEngine.setUnlocked(true); else setSessionUnlocked(true);
          status("Session open · educational chamber · lock when you leave");
          if (passUnlock) passUnlock.value = "";
        }).catch(function () {
          if (window.ClarityAmanaEngine) window.ClarityAmanaEngine.setUnlocked(true); else setSessionUnlocked(true);
          status("Session open (sealed optional)");
        });
      });
    }
    if (btnResetStart) {
      btnResetStart.addEventListener("click", function () {
        var p = $("amana-reset-confirm");
        if (p) p.hidden = !p.hidden;
      });
    }
    if (btnResetGo) {
      btnResetGo.addEventListener("click", function () {
        var t = $("amana-reset-type");
        if (!t || t.value.trim() !== "RESET VAULT") {
          status("Type RESET VAULT exactly to confirm.");
          return;
        }
        try {
          localStorage.removeItem(META_KEY);
          sessionStorage.removeItem(UNLOCK_KEY);
        } catch (e) {}
        try {
          if (w.ClarityVaultSecure && w.ClarityVaultSecure.reset) w.ClarityVaultSecure.reset();
        } catch (e2) {}
        if (window.ClarityAmanaEngine) window.ClarityAmanaEngine.setUnlocked(false); else setSessionUnlocked(false);
        showCreate(true);
        status("Local marker cleared on this device only · create a new passphrase");
      });
    }

    var exportBtn = $("amana-btn-export-encrypted");
    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        status("Encrypted export runs after vault crypto is fully wired · educational placeholder");
      });
    }
    var helpBtn = $("amana-btn-backup-help");
    if (helpBtn) {
      helpBtn.addEventListener("click", function () {
        status("Keep passphrase offline only · Clarity cannot recover it · not a fatwa");
      });
    }

    wireEyes();

    /* Default panel: if meta exists show unlock */
    try {
      var meta = localStorage.getItem(META_KEY);
      if (meta) showCreate(false);
      else showCreate(true);
    } catch (e) {
      showCreate(true);
    }
    setSessionUnlocked(sessionUnlocked());
    if (sessionUnlocked()) status("Already unlocked this session");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})(window);
