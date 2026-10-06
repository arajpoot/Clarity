(function(){
  "use strict";
  if (window.__CLARITY_AMANA_GATE__) return;
  window.__CLARITY_AMANA_GATE__ = true;

  var META_KEY = "clarity_amana_vault_meta_v1";
  var DATA_KEY = "clarity_amana_vault_blob_v1";
  var SESSION_UNLOCKED = false;
  var sessionKey = null; // CryptoKey in memory only
  var ITERATIONS = 210000;
  var MIN_PASS_LEN = 10; /* enforced in createVault; HTML minlength is advisory */

  function $(id){ return document.getElementById(id); }
  function status(msg, err){
    var el = $("amana-gate-status");
    if (!el) return;
    el.textContent = msg || "";
    el.className = "av-status" + (err ? " err" : "");
  }

  function hasVault(){
    try { return !!localStorage.getItem(DATA_KEY); } catch(e){ return false; }
  }
  function loadMeta(){
    try { return JSON.parse(localStorage.getItem(META_KEY) || "null"); } catch(e){ return null; }
  }
  function saveMeta(m){
    try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch(e){}
  }

  function strength(pw){
    var s = 0;
    if (!pw) return { score: 0, label: "—" };
    if (pw.length >= 8) s += 1;
    if (pw.length >= 12) s += 1;
    if (pw.length >= 16) s += 1;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 1;
    if (/\d/.test(pw)) s += 1;
    if (/[^A-Za-z0-9]/.test(pw)) s += 1;
    var labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong", "Excellent"];
    var label = labels[Math.min(s, labels.length - 1)] + " · " + pw.length + " chars";
    var pct = Math.min(100, Math.round((s / 6) * 100));
    return { score: s, label: label, pct: pct };
  }

  function updateStrength(){
    var pw = ($("amana-pass-new") || {}).value || "";
    var st = strength(pw);
    var bar = $("amana-strength-bar");
    var lab = $("amana-strength-lab");
    if (bar) {
      bar.style.width = st.pct + "%";
      bar.style.background = st.score < 2 ? "#c45c3e" : st.score < 4 ? "#c9a227" : "#2d8f5f";
    }
    if (lab) lab.textContent = "Strength: " + st.label;
  }

  function bufToB64(buf){
    var bytes = new Uint8Array(buf);
    var s = "";
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }
  function b64ToBuf(b64){
    var s = atob(b64);
    var bytes = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
    return bytes.buffer;
  }

  async function deriveKey(passphrase, saltBuf){
    var enc = new TextEncoder();
    var base = await crypto.subtle.importKey(
      "raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: saltBuf, iterations: ITERATIONS, hash: "SHA-256" },
      base,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  var SESSION_KEY_STORE = "clarity_amana_session_key_v1";

  /* Session key stays in RAM only — never written to storage (XSS-resistant). */
  async function saveSessionKey(key){
    sessionKey = key;
    try { sessionStorage.setItem(SESSION_KEY_STORE, "1"); } catch(e){} /* flag only, not the key */
  }
  async function loadSessionKey(){
    /* Cannot restore CryptoKey after refresh without passphrase — by design */
    if (sessionKey) return sessionKey;
    try { sessionStorage.removeItem(SESSION_KEY_STORE); } catch(e){}
    return null;
  }
  function clearSessionKey(){
    sessionKey = null;
    try { sessionStorage.removeItem(SESSION_KEY_STORE); } catch(e){}
  }

  async function encryptJson(key, obj){
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var enc = new TextEncoder();
    var cipher = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      key,
      enc.encode(JSON.stringify(obj))
    );
    return { iv: bufToB64(iv), data: bufToB64(cipher) };
  }

  async function decryptJson(key, packed){
    var iv = b64ToBuf(packed.iv);
    var data = b64ToBuf(packed.data);
    var plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      data
    );
    return JSON.parse(new TextDecoder().decode(plain));
  }

  function setLockedUI(locked){
    var tab = $("tab-notes");
    var gate = $("amana-vault-gate");
    var interior = $("amana-vault-interior");
    if (!tab) return;
    if (locked) {
      tab.classList.add("amana-locked");
      tab.classList.remove("amana-unlocked");
      if (gate) gate.hidden = false;
      if (interior) interior.hidden = true;
      SESSION_UNLOCKED = false;
      sessionKey = null;
    } else {
      tab.classList.remove("amana-locked");
      tab.classList.add("amana-unlocked");
      try { if (typeof clarityAmanaUnseal === "function") clarityAmanaUnseal(); } catch(e){}
      if (gate) { gate.hidden = true; try { gate.setAttribute("hidden",""); } catch(eG){} }
      if (interior) {
        interior.hidden = false;
        try {
          interior.removeAttribute("hidden");
          interior.removeAttribute("inert");
          interior.setAttribute("aria-hidden", "false");
          interior.setAttribute("data-amana-sealed", "0");
          interior.style.setProperty("display", "block", "important");
          interior.style.setProperty("visibility", "visible", "important");
        } catch(eI){}
      }
      SESSION_UNLOCKED = true;
      try { if (typeof window.clarityAmanaFullyOpen === "function") window.clarityAmanaFullyOpen(); } catch(eO){}
    }
  }

  function showUnlockMode(yes){
    var c = $("amana-gate-create");
    var u = $("amana-gate-unlock");
    if (c) c.hidden = !!yes;
    if (u) u.hidden = !yes;
    if (yes) {
      var meta = loadMeta();
      var hintEl = $("amana-stored-hint");
      if (hintEl) {
        if (meta && meta.hint) {
          hintEl.style.display = "block";
          hintEl.textContent = "Hint: " + meta.hint;
        } else {
          hintEl.style.display = "none";
        }
      }
    }
  }

  function clearPassFields(){
    ["amana-pass-new","amana-pass-confirm","amana-pass-unlock"].forEach(function(id){
      var el = $(id); if (el) el.value = "";
    });
    updateStrength();
  }

  function readinessScore(data){
    var fields = ["fullname","kin","wasi","missed","letter","debts","docs","spouse","children","parents","siblings","otherHeirs"];
    var n = 0;
    fields.forEach(function(f){
      if (data[f] && String(data[f]).trim()) n++;
    });
    return n;
  }

  function fillHeirForm(data){
    data = data || {};
    var map = { fullname: "ahr-fullname", kin: "ahr-kin", wasi: "ahr-wasi", missed: "ahr-missed", letter: "ahr-letter", debts: "ahr-debts", docs: "ahr-docs", spouse: "ahr-spouse", children: "ahr-children", parents: "ahr-parents", siblings: "ahr-siblings", otherHeirs: "ahr-other-heirs" };
    Object.keys(map).forEach(function(k){
      var el = $(map[k]);
      if (el) el.value = data[k] || "";
    });
    var n = readinessScore(data);
    var lab = $("amana-readiness-lab");
    if (lab) lab.textContent = "Readiness: " + n + "/12 (" + Math.round(n/12*100) + "%) — Fill name & next of kin, then note debts.";
  }

  function readHeirForm(){
    return {
      fullname: ($("ahr-fullname") || {}).value || "",
      kin: ($("ahr-kin") || {}).value || "",
      wasi: ($("ahr-wasi") || {}).value || "",
      missed: ($("ahr-missed") || {}).value || "",
      letter: ($("ahr-letter") || {}).value || "",
      debts: ($("ahr-debts") || {}).value || "",
      docs: ($("ahr-docs") || {}).value || "",
      spouse: ($("ahr-spouse") || {}).value || "",
      children: ($("ahr-children") || {}).value || "",
      parents: ($("ahr-parents") || {}).value || "",
      siblings: ($("ahr-siblings") || {}).value || "",
      otherHeirs: ($("ahr-other-heirs") || {}).value || "",
      updated: new Date().toISOString()
    };
  }

  async function persistVault(key, payload){
    var packed = await encryptJson(key, payload);
    localStorage.setItem(DATA_KEY, JSON.stringify(packed));
  }

  async function loadVault(key){
    var raw = localStorage.getItem(DATA_KEY);
    if (!raw) return { heir: {} };
    var packed = JSON.parse(raw);
    return decryptJson(key, packed);
  }

  async function createVault(){
    var pw = ($("amana-pass-new") || {}).value || "";
    var conf = ($("amana-pass-confirm") || {}).value || "";
    var hint = ""; /* hints disabled */
    if (pw.length < MIN_PASS_LEN) {
      status("Use at least " + MIN_PASS_LEN + " characters (12+ recommended).", true);
      return;
    }
    if (pw !== conf) {
      status("Passphrase and confirmation do not match.", true);
      return;
    }
    if (!window.crypto || !crypto.subtle) {
      status("This browser cannot encrypt on-device.", true);
      return;
    }
    status("Creating vault…");
    try {
      var salt = crypto.getRandomValues(new Uint8Array(16));
      var key = await deriveKey(pw, salt);
      var payload = { heir: {}, version: 1, created: new Date().toISOString() };
      await persistVault(key, payload);
      saveMeta({
        salt: bufToB64(salt),
        iterations: ITERATIONS,
        created: payload.created
      });
      sessionKey = key;
      await saveSessionKey(key);
      clearPassFields();
      setLockedUI(false);
      fillHeirForm({});
      status("Vault open. You hold the only key.");
      try { if (typeof uftZoomInit === "function") uftZoomInit(); } catch(e){}
      try { if (typeof uftRender === "function") uftRender(); } catch(e){}
      try {
        var ed = document.getElementById("uft-editor");
        if (ed) ed.classList.remove("collapsed");
        var reg = document.getElementById("uft-registry-box");
        if (reg) reg.setAttribute("open", "");
      } catch(e){}
    } catch (e) {
      console.warn(e);
      status("Could not create vault. Try another browser.", true);
    }
  }

  async function unlockVault(){
    var pw = ($("amana-pass-unlock") || {}).value || "";
    var meta = loadMeta();
    if (!meta || !meta.salt) {
      status("No vault found on this device.", true);
      return;
    }
    if (!pw) {
      status("Enter your passphrase.", true);
      return;
    }
    status("Unlocking…");
    try {
      var key = await deriveKey(pw, b64ToBuf(meta.salt));
      var payload = await loadVault(key);
      sessionKey = key;
      await saveSessionKey(key);
      clearPassFields();
      setLockedUI(false);
      fillHeirForm(payload.heir || {});
      status("");
      try { if (typeof uftZoomInit === "function") uftZoomInit(); } catch(e){}
      try { if (typeof uftRender === "function") uftRender(); } catch(e){}
      try {
        var ed = document.getElementById("uft-editor");
        if (ed) ed.classList.remove("collapsed");
        var reg = document.getElementById("uft-registry-box");
        if (reg) reg.setAttribute("open", "");
      } catch(e){}
    } catch (e) {
      status("Wrong passphrase or damaged vault data.", true);
      try {
        ["amana-pass-unlock","amana-pass-new","amana-pass-confirm"].forEach(function(id){
          var el = document.getElementById(id); if (el) el.value = "";
        });
      } catch(e2){}
    }
  }

  async function saveHeir(){
    if (!sessionKey) {
      status("Vault locked.", true);
      return;
    }
    try {
      var payload = await loadVault(sessionKey);
      payload.heir = readHeirForm();
      payload.updated = new Date().toISOString();
      await persistVault(sessionKey, payload);
      fillHeirForm(payload.heir);
      status("Saved to encrypted vault on this device.");
      setTimeout(function(){ status(""); }, 2000);
    } catch (e) {
      status("Save failed.", true);
    }
  }

  function lockNow(){
    sessionKey = null;
    clearSessionKey();
    try { if (typeof clearPassFields === "function") clearPassFields(); } catch(e){}
    ["amana-pass-new","amana-pass-confirm","amana-pass-unlock"].forEach(function(id){
      var el = document.getElementById(id);
      if (el) { el.value = ""; el.blur(); }
    });
    setLockedUI(true);
    if (hasVault()) showUnlockMode(true);
    else showUnlockMode(false);
    status("Vault locked · passphrase cleared.");
  }
  window.lockNow = lockNow;

  function amanaEsc(s){
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
  function printPack(){
    if (!SESSION_UNLOCKED || !sessionKey) {
      status("Unlock the vault before printing.", true);
      return;
    }
    var d = readHeirForm();
    var w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    try { w.opener = null; } catch(e){}
    var body =
      "Amana Vault · Heir readiness (educational — not a fatwa)\n\n" +
      "Full name: " + (d.fullname || "—") + "\n" +
      "Next of kin: " + (d.kin || "—") + "\n" +
      "Wasī / guardian: " + (d.wasi || "—") + "\n" +
      "Missed obligations:\n" + (d.missed || "—") + "\n\n" +
      "Debts / trusts:\n" + (d.debts || "—") + "\n\n" +
      "Documents:\n" + (d.docs || "—") + "\n\n" +
      "Letter:\n" + (d.letter || "—") + "\n\n" +
      "Printed from on-device Clarity · confirm with scholar & local counsel\n";
    /* textContent path — no HTML injection from vault fields */
    w.document.open();
    w.document.write("<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Amana pack</title></head><body></body></html>");
    w.document.close();
    var pre = w.document.createElement("pre");
    pre.style.cssText = "font-family:system-ui,sans-serif;padding:1.5rem;white-space:pre-wrap;word-break:break-word";
    pre.textContent = body;
    w.document.body.appendChild(pre);
    w.print();
  }

  function wireEyes(){
    document.querySelectorAll(".amana-vault-gate .av-eye").forEach(function(btn){
      btn.addEventListener("click", function(){
        var id = btn.getAttribute("data-for");
        var input = $(id);
        if (!input) return;
        input.type = input.type === "password" ? "text" : "password";
      });
    });
  }

  function boot(){
    var tab = $("tab-notes");
    if (!tab) return;
    if (!$("amana-vault-gate")) return;

    wireEyes();
    var pn = $("amana-pass-new");
    if (pn) pn.addEventListener("input", updateStrength);

    var bc = $("amana-btn-create"); if (bc) bc.addEventListener("click", createVault);
    var bh = $("amana-btn-have"); if (bh) bh.addEventListener("click", function(){ showUnlockMode(true); status(""); });
    var bu = $("amana-btn-unlock"); if (bu) bu.addEventListener("click", unlockVault);
    var bb = $("amana-btn-back-create"); if (bb) bb.addEventListener("click", function(){ showUnlockMode(false); });
    var bl = $("amana-btn-lock"); if (bl) bl.addEventListener("click", lockNow);
    var bs = $("ahr-save"); if (bs) bs.addEventListener("click", saveHeir);
    var bp = $("ahr-print"); if (bp) bp.addEventListener("click", printPack);
    var bf = $("ahr-scroll-fiqh"); if (bf) bf.addEventListener("click", function(){
      var el = $("fiqh-workflow-card") || $("faraid-card");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // Auto-save readiness on blur
    ["ahr-fullname","ahr-kin","ahr-wasi","ahr-missed","ahr-letter","ahr-debts","ahr-docs"].forEach(function(id){
      var el = $(id);
      if (el) el.addEventListener("change", function(){
        if (SESSION_UNLOCKED) {
          fillHeirForm(readHeirForm());
        }
      });
    });

    // Default locked unless this browser tab still has a session key (survives refresh)
    setLockedUI(true);
    if (hasVault()) showUnlockMode(true);
    else showUnlockMode(false);
    updateStrength();
    (async function trySessionRestore(){
      if (!hasVault()) return;
      var key = await loadSessionKey();
      if (!key) return;
      try {
        var payload = await loadVault(key);
        sessionKey = key;
        setLockedUI(false);
        fillHeirForm(payload.heir || {});
        status("");
        try { if (typeof uftZoomInit === "function") uftZoomInit(); } catch(e){}
        try { if (typeof uftRender === "function") uftRender(); } catch(e){}
      } catch(e) {
        clearSessionKey();
      }
    })();

    // When user opens notes tab, ensure gate shows if locked
    document.addEventListener("click", function(ev){
      var t = ev.target && ev.target.closest && ev.target.closest("[data-rail-tab='notes'],[data-tab='notes']");
      if (t && !SESSION_UNLOCKED) setLockedUI(true);
    }, true);

    // Enter to unlock/create
    document.addEventListener("keydown", function(ev){
      if (ev.key !== "Enter") return;
      var tab = $("tab-notes");
      if (!tab || !tab.classList.contains("active") && tab.style.display === "none") return;
      if (!SESSION_UNLOCKED) {
        if ($("amana-gate-unlock") && !$("amana-gate-unlock").hidden) unlockVault();
        else createVault();
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  window.addEventListener("load", function(){ setTimeout(boot, 200); });

  /* Auto-lock inside closure so sessionKey / SESSION_UNLOCKED are the real ones */
  document.addEventListener("visibilitychange", function(){
    if (document.visibilityState === "hidden" && SESSION_UNLOCKED) {
      try { lockNow(); } catch(e){}
    }
  });
  window.addEventListener("pagehide", function(){
    try { lockNow(); } catch(e){}
  });

  window.AmanaVault = {
    lock: lockNow,
    unlock: unlockVault,
    create: createVault,
    isOpen: function(){ return !!SESSION_UNLOCKED && !!sessionKey; },
    hasVault: hasVault
  };
  /* Aliases for security shield + UI */
  window.lockNow = lockNow;
  window.clarityAmanaLock = lockNow;
  window.lockVault = lockNow;
  window.clarityAmanaPrintPack = printPack;
})();
