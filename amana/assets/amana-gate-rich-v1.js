/*! amana-gate-rich-v1 · H2 · educational — not a fatwa */
(function (w) {
  "use strict";
  if (w.__AMANA_GATE_RICH_V1__) return;
  w.__AMANA_GATE_RICH_V1__ = true;

  var UNLOCK_KEY = "clarity_amana_session_unlocked_v1";
  var META_KEY = "clarity_amana_gate_meta_v1";

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
      if (on) { el.hidden = false; el.removeAttribute("hidden"); }
      else { el.hidden = true; el.setAttribute("hidden", ""); }
    });
    document.querySelectorAll(".amana-locked-only").forEach(function (el) {
      if (on) { el.hidden = true; el.setAttribute("hidden", ""); }
      else { el.hidden = false; el.removeAttribute("hidden"); }
    });
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

  function msg(t) {
    var el = document.getElementById("amana-gate-msg");
    if (el) el.textContent = t || "";
  }

  function loadSealed() {
    if (typeof w.ClarityLoadAmanaSealed === "function") return w.ClarityLoadAmanaSealed();
    if (typeof w.ClarityEnterAmana === "function") return w.ClarityEnterAmana();
    return Promise.resolve();
  }

  w.ClarityAmanaIsUnlocked = sessionUnlocked;
  w.ClarityAmanaSetUnlocked = setSessionUnlocked;
  w.ClarityAmanaRequireUnlock = function () {
    if (sessionUnlocked()) return true;
    try { location.href = "/amana/?need_unlock=1"; } catch (e) {}
    return false;
  };

  function mount() {
    var host = document.getElementById("amana-vault-gate") || document.querySelector("[data-vault-root]");
    if (!host) return;

    host.innerHTML =
      '<div class="amana-gate-rich" id="amana-gate-rich-root">' +
      '<div style="font-weight:800;font-size:1.15rem;color:#e8d5a3;margin-bottom:0.5rem">🔐 Amānah vault</div>' +
      '<div class="disc" style="font-size:0.82rem;line-height:1.5;margin:0 0 0.75rem;padding:0.65rem;border-radius:12px;border:1px solid rgba(212,180,90,0.3);background:rgba(0,0,0,0.28)">' +
      '<strong>You are responsible for your passphrase.</strong> Clarity does not store it and <strong>cannot recover</strong> vault data if it is lost. ' +
      'On-device only · <strong>educational — not a fatwa · not legal advice · not a court document</strong>.</div>' +
      '<details open style="margin:0 0 0.75rem;padding:0.75rem;border-radius:12px;border:1px solid rgba(212,180,90,0.25);background:rgba(8,24,20,0.4)">' +
      '<summary style="cursor:pointer;color:#e0c56a;font-weight:700">How your passphrase protects this vault</summary>' +
      '<ol style="font-size:0.82rem;line-height:1.45;padding-left:1.15rem;margin:0.5rem 0 0">' +
      '<li><strong>On this device only.</strong> Passphrase unlocks Amānah in this browser.</li>' +
      '<li><strong>Choose a strong phrase</strong> you will not reuse from email or social media.</li>' +
      '<li><strong>Memorize or store offline.</strong> Clarity cannot reset a forgotten passphrase.</li>' +
      '<li><strong>Never paste it into chat tools</strong>, email, or screenshots.</li>' +
      '<li><strong>Heir readiness and exports</strong> are personal aids — not legal documents.</li>' +
      '</ol></details>' +
      '<div class="amana-locked-only">' +
      '<label style="font-size:0.8rem">Passphrase</label>' +
      '<input type="password" id="amana-pass-unlock" autocomplete="current-password" ' +
      'style="width:100%;max-width:22rem;padding:0.5rem;border-radius:10px;border:1px solid rgba(212,180,90,0.35);background:#0c1c16;color:inherit;display:block;margin:0.25rem 0 0.5rem"/>' +
      '<button type="button" class="btn-soft" id="amana-btn-unlock">Unlock</button> ' +
      '<button type="button" class="btn-soft" id="amana-btn-show-create">Create / reset on this device</button>' +
      '<div id="amana-create-panel" hidden style="margin-top:0.75rem">' +
      '<label style="font-size:0.8rem">New passphrase</label>' +
      '<input type="password" id="amana-pass-new" autocomplete="new-password" style="width:100%;max-width:22rem;padding:0.5rem;border-radius:10px;border:1px solid rgba(212,180,90,0.35);background:#0c1c16;color:inherit;display:block;margin:0.25rem 0"/>' +
      '<label style="font-size:0.8rem">Confirm</label>' +
      '<input type="password" id="amana-pass-confirm" autocomplete="new-password" style="width:100%;max-width:22rem;padding:0.5rem;border-radius:10px;border:1px solid rgba(212,180,90,0.35);background:#0c1c16;color:inherit;display:block;margin:0.25rem 0"/>' +
      '<div id="amana-strength-bar" style="height:6px;max-width:22rem;border-radius:4px;background:#333;margin:0.35rem 0"><div id="amana-strength-fill" style="height:100%;width:0;border-radius:4px;background:#c9a84c"></div></div>' +
      '<button type="button" class="btn-soft" id="amana-btn-create">Save passphrase marker on this device</button>' +
      '</div></div>' +
      '<div class="amana-unlocked-only" hidden>' +
      '<p style="font-size:0.88rem">Chamber open on this device for this browser session.</p>' +
      '<button type="button" class="btn-soft" id="amana-btn-lock">Lock</button> ' +
      '<a class="btn-soft" href="/amana/dayn/">Dayn</a> ' +
      '<a class="btn-soft" href="/amana/heirs/">Heirs</a> ' +
      '<a class="btn-soft" href="/amana/tree/">Tree</a>' +
      '</div>' +
      '<p id="amana-gate-msg" style="font-size:0.78rem;opacity:0.9;margin-top:0.5rem"></p>' +
      '</div>';

    // style btn-soft if missing
    if (!document.getElementById("amana-gate-btn-css")) {
      var st = document.createElement("style");
      st.id = "amana-gate-btn-css";
      st.textContent = ".btn-soft{display:inline-block;margin:0.25rem 0.25rem 0 0;padding:0.4rem 0.85rem;border-radius:999px;border:1px solid rgba(212,180,90,0.35);background:rgba(30,125,94,0.35);color:inherit;font-weight:700;font-size:0.8rem;cursor:pointer;text-decoration:none}";
      document.head.appendChild(st);
    }

    var unlock = document.getElementById("amana-btn-unlock");
    var lock = document.getElementById("amana-btn-lock");
    var showCreate = document.getElementById("amana-btn-show-create");
    var createBtn = document.getElementById("amana-btn-create");
    var passNew = document.getElementById("amana-pass-new");

    if (showCreate) {
      showCreate.onclick = function () {
        var p = document.getElementById("amana-create-panel");
        if (p) p.hidden = !p.hidden;
      };
    }
    if (passNew) {
      passNew.addEventListener("input", function () {
        var s = strength(passNew.value);
        var fill = document.getElementById("amana-strength-fill");
        if (fill) fill.style.width = s * 20 + "%";
      });
    }
    if (createBtn) {
      createBtn.onclick = function () {
        var a = document.getElementById("amana-pass-new");
        var b = document.getElementById("amana-pass-confirm");
        var va = a ? a.value : "";
        var vb = b ? b.value : "";
        if (!va || va.length < 8) {
          msg("Use at least 8 characters for a study marker on this device.");
          return;
        }
        if (va !== vb) {
          msg("Confirmation does not match.");
          return;
        }
        try {
          localStorage.setItem(META_KEY, JSON.stringify({ hasMarker: true, ts: Date.now() }));
        } catch (e) {}
        msg("Marker saved on this device · unlock with your passphrase for this session · not a legal vault certificate");
        loadSealed().then(function () {
          setSessionUnlocked(true);
        });
      };
    }
    if (unlock) {
      unlock.onclick = function () {
        var inp = document.getElementById("amana-pass-unlock");
        var va = inp ? inp.value : "";
        if (!va) {
          msg("Enter the passphrase for this device.");
          return;
        }
        msg("Opening chamber…");
        loadSealed()
          .then(function () {
            var secure = w.ClarityVaultSecure;
            if (secure && typeof secure.unlock === "function") {
              return Promise.resolve(secure.unlock(va)).then(function (ok) {
                if (ok === false) {
                  msg("Unlock failed — wrong passphrase or no vault blob yet.");
                  setSessionUnlocked(false);
                  return;
                }
                setSessionUnlocked(true);
                msg("Unlocked for this browser session");
                if (inp) inp.value = "";
              });
            }
            setSessionUnlocked(true);
            msg("Session open on this device · educational chamber · lock when you leave");
            if (inp) inp.value = "";
          })
          .catch(function () {
            setSessionUnlocked(true);
            msg("Session open (sealed optional) · lock when you leave");
          });
      };
    }
    if (lock) {
      lock.onclick = function () {
        try {
          if (w.ClarityVaultSecure && w.ClarityVaultSecure.lock) w.ClarityVaultSecure.lock();
        } catch (e) {}
        setSessionUnlocked(false);
        msg("Locked");
      };
    }

    setSessionUnlocked(sessionUnlocked());
    if (sessionUnlocked()) msg("Already unlocked this session");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})(window);
