/*!
 * amana-vault.js
 * T-AMANA-01 · Phase 0–6 Governance Contract
 * Bismillah.
 * Enrichment: held
 * LAZY — load only on Amānah unlock page / after unlock intent
 * Desk (/amana/) must remain usable WITHOUT this file
 * Passphrase never stored or transmitted
 * Educational only — not a fatwa, not legal advice
 */

/* === 1. amana-isolation-guard-v1.js === */
/*! amana-isolation-guard-v1 · Phase 6
 * Amānah on-device only. Blocks campus grade APIs from binding here.
 * Does not remove vault/dayn/heir modules.
 * Educational only — not a fatwa / not a will.
 */
(function (w, d) {
  "use strict";
  if (w.__AMANA_ISOLATION_GUARD_V1__) return;
  w.__AMANA_ISOLATION_GUARD_V1__ = true;

  function isAmana() {
    try {
      var p = (w.location && w.location.pathname) || "";
      return p === "/amana" || p.indexOf("/amana/") === 0;
    } catch (e) { return false; }
  }
  if (!isAmana()) return;

  var LOG = (w.__AMANA_ISOLATION_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  try {
    d.documentElement.setAttribute("data-clarity-room", "amana");
    d.documentElement.setAttribute("data-amana-sot", "1");
  } catch (e) {}

  /* Soft-block campus grade / university progress writers if leaked */
  var BLOCK = [
    "cuWriteCampusGrade",
    "cuMergeTranscriptIntoVault",
    "clarityImportCampusGrades",
    "cu_uni_progress_write_to_amana"
  ];
  BLOCK.forEach(function (name) {
    try {
      Object.defineProperty(w, name, {
        configurable: true,
        get: function () {
          log("blocked " + name);
          return function () {
            console.info("[Amānah] " + name + " is not allowed in this room");
            return null;
          };
        },
        set: function () { log("set-blocked " + name); }
      });
    } catch (e) {
      w[name] = function () { return null; };
    }
  });

  /* Nav highlight */
  function fixNav() {
    try {
      d.querySelectorAll(".clarity-room-nav a").forEach(function (a) {
        var here = a.getAttribute("data-room-link") === "amana" ||
          ((a.getAttribute("href") || "").indexOf("/amana") === 0);
        a.classList.toggle("is-here", !!here);
        if (here) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    } catch (e) {}
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", fixNav);
  else fixNav();
  w.addEventListener("load", fixNav);

  log("amana isolation guard active");
})(window, document);

/* === 2. clarity-amana-engine-v1.js === */
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

/* === 3. amana-engine-unlock-patch-v1.js === */
/*! Amānah engine unlock patch v1
 * Removes lock-shell overlay when vault becomes unlocked.
 * Fixes chamber "freeze" when user unlocks then opens /amana/dayn/.
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_UNLOCK_PATCH_V1__) return;
  w.__CLARITY_AMANA_UNLOCK_PATCH_V1__ = true;

  function removeLockShell() {
    try {
      var shell = document.getElementById("amana-engine-lock-shell");
      if (shell) shell.remove();
      // Re-enable controls the shell may have disabled
      document.querySelectorAll("main input, main button, main select, main textarea").forEach(function (el) {
        try {
          el.disabled = false;
        } catch (e) {}
      });
    } catch (e) {}
  }

  function onUnlock(ev) {
    if (ev && ev.detail && ev.detail.unlocked) {
      removeLockShell();
      setTimeout(removeLockShell, 50);
      setTimeout(removeLockShell, 300);
    } else if (w.ClarityAmanaEngine && w.ClarityAmanaEngine.isUnlocked()) {
      removeLockShell();
    }
  }

  document.addEventListener("clarity-amana-unlock-change", onUnlock);

  // If already unlocked on load
  function boot() {
    try {
      if (w.ClarityAmanaEngine && w.ClarityAmanaEngine.isUnlocked()) removeLockShell();
      else if (sessionStorage.getItem("clarity_amana_session_unlocked_v1") === "1") removeLockShell();
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 800);
})(window);

/* === 4. amana-fortify-boot-gate-v2.js === */
/*! amana-fortify-boot gate-aware v2 · freeze-fix cycle
 * Gate → no Dayn scripts.
 * /amana/dayn/ → ensure + adapter-v2 + ledger-v3 + bridge-v3 (observer-free).
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_VAULT_FORTRESS_BOOT_GATE_V2__) return;
  w.__CLARITY_VAULT_FORTRESS_BOOT_GATE_V2__ = true;
  w.__CLARITY_VAULT_FORTRESS_BOOT_V2__ = true;
  w.__CLARITY_VAULT_FORTRESS_BOOT_M5__ = true;

  function isGatePath() {
    var p = (location.pathname || "").replace(/\/+$/, "") || "/";
    return p === "/amana" || p === "/amana/index.html" || /\/amana\/?$/.test(location.pathname);
  }

  function isDaynChamber() {
    return /\/amana\/dayn\/?/.test(location.pathname || "");
  }

  var SEALED_DAYN = [
    "/amana/sealed/dayn-ensure-s45.js",
    "/amana/sealed/dayn-mount-adapter-v2.js",
    "/amana/sealed/dayn-ledger-v3.js",
    "/amana/sealed/dayn-section-bridge-v3.js"
  ];

  var SEALED_GATE = [];
  var VERSION = "20261102F2";
  var loading = null;

  function loadScript(src) {
    return new Promise(function (resolve) {
      var name = src.split("/").pop();
      if (document.querySelector('script[src*="' + name + '"]')) {
        resolve(src);
        return;
      }
      var s = document.createElement("script");
      s.src = src + (src.indexOf("?") > -1 ? "&" : "?") + "v=" + VERSION;
      s.async = false;
      s.onload = function () { resolve(src); };
      s.onerror = function () { resolve(src); };
      document.head.appendChild(s);
    });
  }

  w.ClarityLoadAmanaSealed = function () {
    if (loading) return loading;
    var list = isDaynChamber() ? SEALED_DAYN : (isGatePath() ? SEALED_GATE : SEALED_DAYN);
    loading = Promise.resolve();
    list.forEach(function (src) {
      loading = loading.then(function () {
        return new Promise(function (r) {
          setTimeout(function () {
            loadScript(src).then(r);
          }, 20);
        });
      });
    });
    loading = loading.then(function () {
      try {
        document.dispatchEvent(new CustomEvent("clarity-amana-sealed-ready"));
      } catch (e) {}
      return "ready";
    });
    return loading;
  };

  w.ClarityEnterAmana = function () {
    return w.ClarityLoadAmanaSealed();
  };
})(window);

/* === 5. amana-gate-dayn-guard-v1.js === */
/*! Amānah gate Dayn guard v1
 * Prevents full Dayn ledger / form / export from mounting on the unlock (gate) page.
 * Full UI is allowed only on /amana/dayn/ (and optionally other chamber routes).
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__CLARITY_AMANA_GATE_DAYN_GUARD__) return;
  w.__CLARITY_AMANA_GATE_DAYN_GUARD__ = true;

  function isGatePath() {
    var p = (location.pathname || "").replace(/\/+$/, "") || "/";
    return p === "/amana" || p === "/amana/index.html" || /\/amana\/?$/.test(location.pathname);
  }

  function isDaynChamber() {
    return /\/amana\/dayn\/?/.test(location.pathname || "");
  }

  // Public gate policy used by sealed Dayn scripts
  w.ClarityVaultGate = w.ClarityVaultGate || {};
  w.ClarityVaultGate.allowDaynLanding = function () {
    // Landing card only on day-landing surfaces or dayn chamber — never on gate
    if (isGatePath()) return false;
    return true;
  };
  w.ClarityVaultGate.allowDaynVault = function () {
    // Full vault ledger only on dayn chamber (or explicit vault interior pages)
    if (isGatePath()) return false;
    return isDaynChamber() || !!document.querySelector(".amana-vault-interior");
  };
  w.ClarityVaultGate.isGate = isGatePath;
  w.ClarityVaultGate.isDaynChamber = isDaynChamber;

  // Hide any Dayn UI that still leaks onto the gate after unlock
  function scrubGate() {
    if (!isGatePath()) return;
    var selectors = [
      "#clarity-dayn-entry",
      "#clarity-dayn-vault-ledger",
      "#amana-day-landing-ledger",
      "#amana-vault-ledger-block",
      "[data-amana-ledger-block]",
      ".clarity-dayn-entry",
      ".dayn-form",
      ".dayn-today",
      "[data-dayn-io-ui]",
      "#clarity-landing-slot-dayn",
      "#clarity-vault-slot-dayn"
    ];
    selectors.forEach(function (sel) {
      try {
        document.querySelectorAll(sel).forEach(function (el) {
          // Keep the chamber-tools links; only remove full Dayn modules
          if (el.closest && el.closest(".amana-tools")) return;
          el.style.setProperty("display", "none", "important");
          el.setAttribute("data-gate-scrubbed", "1");
          // Prefer removal when it is a pure Dayn block
          if (
            el.id === "clarity-dayn-entry" ||
            el.id === "clarity-dayn-vault-ledger" ||
            el.id === "amana-day-landing-ledger" ||
            el.id === "amana-vault-ledger-block" ||
            el.getAttribute("data-amana-ledger-block") === "1"
          ) {
            try { el.remove(); } catch (e) {}
          }
        });
      } catch (e) {}
    });
  }

  function boot() {
    scrubGate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // Re-scrub after unlock and after sealed scripts finish
  document.addEventListener("clarity-amana-unlock-change", function (ev) {
    if (ev.detail && ev.detail.unlocked) {
      setTimeout(scrubGate, 50);
      setTimeout(scrubGate, 400);
      setTimeout(scrubGate, 1200);
    }
  });
  document.addEventListener("clarity-amana-sealed-ready", function () {
    setTimeout(scrubGate, 30);
    setTimeout(scrubGate, 300);
  });

  // Limited observer only while on gate (disconnects quickly)
  if (isGatePath()) {
    try {
      var obs = new MutationObserver(function () {
        scrubGate();
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(function () {
        try { obs.disconnect(); } catch (e) {}
      }, 8000);
    } catch (e) {}
  }
})(window);

/* === 6. amana-gate-rich-v1.js === */
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
          (window.ClarityAmanaEngine?window.ClarityAmanaEngine.setUnlocked(true):setSessionUnlocked(true));
          status("Vault marker ready on this device · unlocked this session · not a legal certificate");
          if (passNew) passNew.value = "";
          if (passConfirm) passConfirm.value = "";
        }).catch(function () {
          (window.ClarityAmanaEngine?window.ClarityAmanaEngine.setUnlocked(true):setSessionUnlocked(true));
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
                (window.ClarityAmanaEngine?window.ClarityAmanaEngine.setUnlocked(false):setSessionUnlocked(false));
                return;
              }
              (window.ClarityAmanaEngine?window.ClarityAmanaEngine.setUnlocked(true):setSessionUnlocked(true));
              status("Unlocked for this browser session");
              if (passUnlock) passUnlock.value = "";
            });
          }
          (window.ClarityAmanaEngine?window.ClarityAmanaEngine.setUnlocked(true):setSessionUnlocked(true));
          status("Session open · educational chamber · lock when you leave");
          if (passUnlock) passUnlock.value = "";
        }).catch(function () {
          (window.ClarityAmanaEngine?window.ClarityAmanaEngine.setUnlocked(true):setSessionUnlocked(true));
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
        (window.ClarityAmanaEngine?window.ClarityAmanaEngine.setUnlocked(false):setSessionUnlocked(false));
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

/* === 7. amana-unlock-access-v1.js === */
/*! amana-unlock-access-v1
 * /amana/unlock/ IS the passphrase gate — not a locked chamber subpage.
 * - Exclude unlock path from subpage-lock / engine lock-shell redirects to desk
 * - Remove "Chamber locked · Open gate" overlay that bounces to /amana/
 * - Keep passphrase form usable
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  function isUnlockPath() {
    try {
      var p = (w.location.pathname || "").replace(/\/+$/, "");
      return p === "/amana/unlock" || /\/amana\/unlock/i.test(w.location.pathname || "");
    } catch (e) { return false; }
  }
  if (!isUnlockPath()) return;
  if (w.__AMANA_UNLOCK_ACCESS_V1__) return;
  w.__AMANA_UNLOCK_ACCESS_V1__ = true;

  d.documentElement.setAttribute("data-amana-surface", "unlock");
  d.documentElement.setAttribute("data-clarity-room", "amana");
  d.documentElement.setAttribute("data-amana-gate-page", "1");

  function stripLockOverlays() {
    [
      "amana-engine-lock-shell",
      "amana-sub-lock-banner",
      "amana-chamber-lock",
      "amana-lock-modal"
    ].forEach(function (id) {
      var el = d.getElementById(id);
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    /* modal-like nodes with Chamber locked text */
    d.querySelectorAll("div,section,aside").forEach(function (el) {
      var t = (el.textContent || "").trim();
      if (/chamber locked/i.test(t) && /open gate/i.test(t) && el.children.length < 8) {
        try { el.parentNode && el.parentNode.removeChild(el); } catch (e) {}
      }
    });
  }

  function showPassphraseGate() {
    var g = d.getElementById("amana-vault-gate");
    if (g) {
      g.hidden = false;
      g.style.display = "block";
      g.style.visibility = "visible";
      g.removeAttribute("aria-hidden");
      g.querySelectorAll("input,button").forEach(function (el) {
        el.disabled = false;
      });
    }
    var unlockPanel = d.getElementById("amana-gate-unlock");
    var createPanel = d.getElementById("amana-gate-create");
    if (unlockPanel) unlockPanel.hidden = false;
    /* dim body lock overlays */
    d.body.style.overflow = "";
  }

  function patchEngine() {
    var eng = w.ClarityAmanaEngine;
    if (!eng) return;
    /* never redirect to desk from unlock page */
    eng.requireUnlock = function () {
      return true; /* already on gate page */
    };
    /* do not paint lock shell here */
    if (typeof eng.ensureLockShell === "function") {
      eng.ensureLockShell = function () {};
    }
  }

  function patchGlobals() {
    w.ClarityAmanaRequireUnlock = function () { return true; };
  }

  function blockDeskBounce(url) {
    try {
      var u = new URL(String(url), w.location.origin);
      var p = (u.pathname || "").replace(/\/+$/, "") || "/";
      if (p === "/amana" || p === "/amana/index.html") {
        if (String(u.search || "").indexOf("need_unlock") >= 0) return true;
      }
    } catch (e) {
      if (/\/amana\/?\?need_unlock/.test(String(url))) return true;
    }
    return false;
  }

  try {
    var na = w.location.assign.bind(w.location);
    var nr = w.location.replace.bind(w.location);
    w.location.assign = function (u) {
      if (blockDeskBounce(u)) {
        stripLockOverlays();
        showPassphraseGate();
        return;
      }
      return na(u);
    };
    w.location.replace = function (u) {
      if (blockDeskBounce(u)) {
        stripLockOverlays();
        showPassphraseGate();
        return;
      }
      return nr(u);
    };
  } catch (e) {}

  /* Intercept Open gate buttons that point to desk */
  d.addEventListener(
    "click",
    function (ev) {
      var t = ev.target;
      if (!t) return;
      var label = (t.textContent || "").trim().toLowerCase();
      var href = (t.getAttribute && t.getAttribute("href")) || "";
      if (label === "open gate" || /need_unlock=1/.test(href) || href === "/amana/" || href === "/amana") {
        /* if it's the lock overlay CTA, stay and focus passphrase */
        if (/chamber locked|open gate/i.test((t.closest && t.closest("div") || t).textContent || "") || /need_unlock/.test(href)) {
          ev.preventDefault();
          ev.stopPropagation();
          stripLockOverlays();
          showPassphraseGate();
          var inp = d.getElementById("amana-pass-unlock") || d.getElementById("amana-pass-new");
          if (inp) try { inp.focus(); } catch (e) {}
        }
      }
    },
    true
  );

  function boot() {
    stripLockOverlays();
    showPassphraseGate();
    patchEngine();
    patchGlobals();
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  w.addEventListener("load", function () {
    boot();
    setTimeout(boot, 100);
    setTimeout(boot, 400);
    setTimeout(boot, 1000);
  });
  setInterval(function () {
    patchEngine();
    stripLockOverlays();
    showPassphraseGate();
  }, 1500);
})(window, document);

/* === 8. amana-unlock-success-ui-v1.js === */
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

/* === 9. amana-unlock-stay-v1.js === */
/*! amana-unlock-stay-v1 · C3
 * Hard stay on /amana/unlock until user explicitly leaves via <a> click.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  var path = (w.location.pathname || "").replace(/\/+$/, "");
  if (path !== "/amana/unlock" && !/\/amana\/unlock/i.test(w.location.pathname || "")) return;
  if (w.__AMANA_UNLOCK_STAY_V3__) return;
  w.__AMANA_UNLOCK_STAY_V3__ = true;

  d.documentElement.setAttribute("data-amana-surface", "unlock");
  d.documentElement.setAttribute("data-clarity-room", "amana");
  try { w.sessionStorage.setItem("amana_on_unlock", "1"); } catch (e) {}

  function isDesk(url) {
    try {
      var u = new URL(String(url), w.location.origin);
      var p = (u.pathname || "").replace(/\/+$/, "") || "/";
      return p === "/amana" || p === "/amana/index.html";
    } catch (e) {
      return /^\/amana\/?$/.test(String(url));
    }
  }

  var userAllowedDesk = false;
  d.addEventListener(
    "click",
    function (ev) {
      var a = ev.target && ev.target.closest && ev.target.closest("a[href]");
      if (!a) return;
      var href = a.getAttribute("href") || "";
      if (isDesk(href) || href === "/amana/" || href === "/amana") {
        userAllowedDesk = true;
        try { w.sessionStorage.removeItem("amana_on_unlock"); } catch (e) {}
      }
    },
    true
  );

  function block(url) {
    if (userAllowedDesk) return false;
    if (!isDesk(url)) return false;
    try { console.info("[Amānah unlock] blocked bounce to desk:", url); } catch (e) {}
    return true;
  }

  try {
    var desc = Object.getOwnPropertyDescriptor(w.Location.prototype, "href");
    if (desc && desc.set) {
      Object.defineProperty(w.location, "href", {
        configurable: true,
        enumerable: true,
        get: function () { return desc.get.call(w.location); },
        set: function (v) {
          if (block(v)) return;
          return desc.set.call(w.location, v);
        }
      });
    }
  } catch (e) {}

  var na = w.location.assign.bind(w.location);
  var nr = w.location.replace.bind(w.location);
  w.location.assign = function (u) { if (!block(u)) return na(u); };
  w.location.replace = function (u) { if (!block(u)) return nr(u); };

  /* show gate */
  function showGate() {
    var g = d.getElementById("amana-vault-gate");
    if (g) {
      g.hidden = false;
      g.style.display = "block";
      g.removeAttribute("aria-hidden");
    }
    var badge = d.getElementById("amana-unlock-path-badge");
    if (!badge) {
      badge = d.createElement("p");
      badge.id = "amana-unlock-path-badge";
      badge.style.cssText = "text-align:center;font-size:0.75rem;opacity:0.85;color:#d4b45a;margin:0.35rem 0";
      badge.textContent = "Vault unlock page · passphrase on this device";
      var wrap = d.querySelector(".unlock-wrap") || d.body;
      wrap.insertBefore(badge, wrap.firstChild);
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", showGate);
  else showGate();
  w.addEventListener("load", showGate);
  setInterval(showGate, 2000);
})(window, document);

/* === 10. amana-subpage-lock-v1.js === */
/*! amana-subpage-lock-v1 · H3b — excludes /amana/unlock/ (that page IS the gate)
 * Educational only — not a fatwa.
 */
(function (w) {
  "use strict";
  if (w.__AMANA_SUBPAGE_LOCK_V1__) return;
  w.__AMANA_SUBPAGE_LOCK_V1__ = true;
  var UNLOCK_KEY = "clarity_amana_session_unlocked_v1";
  function unlocked() {
    try { return sessionStorage.getItem(UNLOCK_KEY) === "1"; } catch (e) { return false; }
  }
  function run() {
    var path = (location.pathname || "");
    if (path === "/amana/" || path === "/amana") return;
    /* Unlock page is the passphrase gate — never soft-lock it */
    if (/\/amana\/unlock\/?/i.test(path)) return;
    if (path.indexOf("/amana/") !== 0) return;
    if (unlocked()) {
      document.documentElement.setAttribute("data-amana-unlocked", "1");
      return;
    }
    if (document.getElementById("amana-sub-lock-banner")) return;
    var bar = document.createElement("div");
    bar.id = "amana-sub-lock-banner";
    bar.setAttribute("role", "alert");
    bar.style.cssText = "position:sticky;top:0;z-index:9999;padding:0.75rem 1rem;background:#1a1008;border-bottom:2px solid #c9a84c;color:#f5e6c8;font-size:0.88rem;text-align:center";
    bar.innerHTML = "🔐 Amānah tools need an unlocked session. <a href='/amana/unlock/' style='color:#e8d5a3;font-weight:800'>Open passphrase gate</a> · educational only — not a fatwa.";
    document.body.insertBefore(bar, document.body.firstChild);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})(window);

/* === END amana-vault.js · T-AMANA-01 · Bismillah === */
