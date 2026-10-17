/* extracted clarity-amana-vault-secure-login-v1 Phase A */
(function(){
  "use strict";
  if (window.__CLARITY_AMANA_SECURE_LOGIN__) return;
  window.__CLARITY_AMANA_SECURE_LOGIN__ = true;

  var MAX_ATTEMPTS = 5;
  var LOCKOUT_MS = 5 * 60 * 1000; /* 5 minutes after max fails */
  var ATTEMPT_KEY = "clarity_amana_fail_attempts_v1";
  var LOCKOUT_KEY = "clarity_amana_lockout_until_v1";
  var META_KEY = "clarity_amana_vault_meta_v1";
  var DATA_KEY = "clarity_amana_vault_blob_v1";
  var SESSION_KEY_STORE = "clarity_amana_session_key_v1";

  function $(id){ return document.getElementById(id); }

  function clearAllPassFields(){
    ["amana-pass-new", "amana-pass-confirm", "amana-pass-unlock", "amana-pass-hint"].forEach(function(id){
      var el = $(id);
      if (!el) return;
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        /* Never leave fields readonly/disabled — that freezes mobile typing */
        try {
          var active = document.activeElement === el;
          if (!active) el.value = "";
          el.removeAttribute("readonly");
          if (!isLockedOut()) el.disabled = false;
        } catch(e){}
      }
    });
    var rt = $("amana-reset-type");
    if (rt) rt.value = "";
  }

  function getAttempts(){
    try { return parseInt(sessionStorage.getItem(ATTEMPT_KEY) || "0", 10) || 0; } catch(e){ return 0; }
  }
  function setAttempts(n){
    try { sessionStorage.setItem(ATTEMPT_KEY, String(n)); } catch(e){}
  }
  function getLockoutUntil(){
    try { return parseInt(localStorage.getItem(LOCKOUT_KEY) || "0", 10) || 0; } catch(e){ return 0; }
  }
  function setLockoutUntil(ts){
    try { localStorage.setItem(LOCKOUT_KEY, String(ts)); } catch(e){}
  }

  function isLockedOut(){
    var until = getLockoutUntil();
    if (!until) return false;
    if (Date.now() >= until) {
      setLockoutUntil(0);
      setAttempts(0);
      return false;
    }
    return true;
  }

  function updateAttemptsUI(){
    var lab = $("amana-attempts-lab");
    var panel = $("amana-lockout-panel");
    var unlockBtn = $("amana-btn-unlock");
    var pass = $("amana-pass-unlock");
    var n = getAttempts();
    var left = Math.max(0, MAX_ATTEMPTS - n);

    if (isLockedOut()) {
      var sec = Math.ceil((getLockoutUntil() - Date.now()) / 1000);
      var mins = Math.floor(sec / 60);
      var s = sec % 60;
      if (panel) panel.hidden = false;
      if (lab) lab.textContent = "";
      if (unlockBtn) unlockBtn.disabled = true;
      if (pass) { pass.disabled = true; pass.value = ""; }
      var msg = $("amana-lockout-msg");
      if (msg) msg.textContent = "Too many failed attempts. Try again in " + mins + "m " + s + "s, or reset this device vault.";
      return;
    }

    if (panel) panel.hidden = true;
    if (unlockBtn) unlockBtn.disabled = false;
    if (pass) pass.disabled = false;
    if (lab) {
      if (n <= 0) lab.textContent = "";
      else lab.textContent = left + " attempt" + (left === 1 ? "" : "s") + " remaining before temporary lockout";
    }
  }

  function recordFailure(){
    var n = getAttempts() + 1;
    setAttempts(n);
    if (n >= MAX_ATTEMPTS) {
      setLockoutUntil(Date.now() + LOCKOUT_MS);
      setAttempts(MAX_ATTEMPTS);
    }
    updateAttemptsUI();
    return n;
  }

  function recordSuccess(){
    setAttempts(0);
    setLockoutUntil(0);
    updateAttemptsUI();
    clearAllPassFields();
  }

  /* Wrap unlock button — intercept wrong passphrase */
  function wrapUnlock(){
    var btn = $("amana-btn-unlock");
    if (!btn || btn.__secureWrapped) return;
    btn.__secureWrapped = true;
    btn.addEventListener("click", function(ev){
      if (isLockedOut()) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        updateAttemptsUI();
        return false;
      }
    }, true);

    /* After unlock attempt — watch status for failure */
    var statusEl = $("amana-gate-status");
    if (statusEl && !statusEl.__secureObs) {
      statusEl.__secureObs = true;
      var obs = new MutationObserver(function(){
        var t = (statusEl.textContent || "").toLowerCase();
        if (/wrong|invalid|fail|incorrect|decrypt|could not|unable/i.test(t) && statusEl.className.indexOf("err") >= 0) {
          var n = recordFailure();
          if (n >= MAX_ATTEMPTS) {
            statusEl.textContent = "Too many failed attempts. Vault locked temporarily.";
          } else {
            statusEl.textContent = "Incorrect passphrase. " + (MAX_ATTEMPTS - n) + " attempts left.";
          }
          clearAllPassFields();
        }
        if (!t || /unlocking|opened|ready/i.test(t) && statusEl.className.indexOf("err") < 0) {
          /* success path often clears status */
        }
      });
      obs.observe(statusEl, { childList: true, characterData: true, subtree: true });
    }
  }

  /* Hook successful unlock via setLockedUI if available */
  function wrapSetLocked(){
    /* watch class on tab-notes */
    var tab = $("tab-notes");
    if (!tab || tab.__secureMO) return;
    tab.__secureMO = true;
    var wasUnlocked = tab.classList.contains("amana-unlocked");
    var mo = new MutationObserver(function(){
      var now = tab.classList.contains("amana-unlocked");
      if (wasUnlocked && !now) {
        /* locked */
        clearAllPassFields();
        try { sessionStorage.removeItem(SESSION_KEY_STORE); } catch(e){}
      }
      if (!wasUnlocked && now) {
        recordSuccess();
      }
      wasUnlocked = now;
    });
    mo.observe(tab, { attributes: true, attributeFilter: ["class"] });
  }

  function onLeaveVault(){
    clearAllPassFields();
    /* if leaving vault tab while locked UI, ensure no residual */
    var tab = $("tab-notes");
    var active = document.body.getAttribute("data-active-tab") || "";
    if (active !== "notes" && tab && !tab.classList.contains("amana-unlocked")) {
      clearAllPassFields();
    }
  }

  function destroyVaultLocal(){
    try { localStorage.removeItem(DATA_KEY); } catch(e){}
    try { localStorage.removeItem(META_KEY); } catch(e){}
    try { sessionStorage.removeItem(SESSION_KEY_STORE); } catch(e){}
    setAttempts(0);
    setLockoutUntil(0);
    clearAllPassFields();
    var panel = $("amana-lockout-panel");
    var conf = $("amana-reset-confirm");
    if (conf) conf.hidden = true;
    if (panel) panel.hidden = true;
    /* show create mode */
    var create = $("amana-gate-create");
    var unlock = $("amana-gate-unlock");
    if (create) create.hidden = false;
    if (unlock) unlock.hidden = true;
    var st = $("amana-gate-status");
    if (st) {
      st.textContent = "Vault data on this device destroyed. Create a new passphrase.";
      st.className = "av-status";
    }
    updateAttemptsUI();
  }

  function wireReset(){
    var start = $("amana-btn-reset-start");
    var conf = $("amana-reset-confirm");
    var go = $("amana-btn-reset-go");
    if (start && !start.__wired) {
      start.__wired = true;
      start.addEventListener("click", function(){
        if (conf) conf.hidden = false;
      });
    }
    if (go && !go.__wired) {
      go.__wired = true;
      go.addEventListener("click", function(){
        var typed = (($("amana-reset-type") || {}).value || "").trim();
        if (typed !== "RESET VAULT") {
          var st = $("amana-gate-status");
          if (st) {
            st.textContent = "Type RESET VAULT exactly to confirm.";
            st.className = "av-status err";
          }
          return;
        }
        if (!confirm("This permanently deletes encrypted vault data on THIS device. Continue?")) return;
        destroyVaultLocal();
      });
    }
  }

  function boot(){
    clearAllPassFields();
    wrapUnlock();
    wrapSetLocked();
    wireReset();
    updateAttemptsUI();
    setInterval(updateAttemptsUI, 1000);

    /* Leave vault tab / page */
    document.addEventListener("click", function(ev){
      var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab], .door-rail-btn");
      if (!t) return;
      var tab = t.getAttribute("data-rail-tab") || "";
      if (tab && tab !== "notes" && tab !== "vault" && tab !== "amana") {
        setTimeout(onLeaveVault, 30);
      }
    }, true);

    document.addEventListener("visibilitychange", function(){
      if (document.visibilityState === "hidden") clearAllPassFields();
    });
    window.addEventListener("pagehide", clearAllPassFields);

    /* Lock button */
    var bl = $("amana-btn-lock");
    if (bl && !bl.__secureClear) {
      bl.__secureClear = true;
      bl.addEventListener("click", function(){ setTimeout(clearAllPassFields, 0); }, true);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function(){ setTimeout(boot, 200); });
  else setTimeout(boot, 200);
  window.addEventListener("load", function(){ setTimeout(boot, 500); });

  /* Public */
  window.clarityAmanaClearPass = clearAllPassFields;
  window.clarityAmanaDestroyLocalVault = destroyVaultLocal;
})();