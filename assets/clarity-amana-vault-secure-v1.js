/* Amana Vault secure — Companion-local */

/**
 * Amana Vault — passphrase locker (Web Crypto AES-GCM + PBKDF2)
 * Pattern from on-device Clarity build. Data never leaves the device.
 * Clarity does not store or recover the passphrase.
 */
(function () {
  "use strict";
  if (window.__CLARITY_AMANA_VAULT_V5__) return;
  window.__CLARITY_AMANA_VAULT_V5__ = true;

  var VAULT_KEY = "clarity_amana_vault_blob_v1";
  var META_KEY = "clarity_amana_vault_meta_v1";
  var SESSION_UNLOCKED = false;
  var sessionKey = null;

  function b64(buf) {
    var bytes = new Uint8Array(buf);
    var s = "";
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }
  function fromB64(str) {
    var bin = atob(str);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes.buffer;
  }

  async function deriveKey(pass, salt) {
    var enc = new TextEncoder();
    var base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: salt, iterations: 120000, hash: "SHA-256" },
      base,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptObj(obj, pass) {
    var salt = crypto.getRandomValues(new Uint8Array(16));
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var key = await deriveKey(pass, salt);
    var plain = new TextEncoder().encode(JSON.stringify(obj));
    var cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, plain);
    return {
      clarityAmanaEncrypted: 1,
      version: 1,
      alg: "AES-GCM",
      kdf: "PBKDF2-SHA256-120000",
      salt: b64(salt),
      iv: b64(iv),
      ciphertext: b64(cipher)
    };
  }

  async function decryptObj(blob, pass) {
    var salt = fromB64(blob.salt);
    var iv = fromB64(blob.iv);
    var key = await deriveKey(pass, new Uint8Array(salt));
    var plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: new Uint8Array(iv) },
      key,
      fromB64(blob.ciphertext)
    );
    return JSON.parse(new TextDecoder().decode(plain));
  }

  function hasVault() {
    try { return !!localStorage.getItem(VAULT_KEY); } catch (e) { return false; }
  }

  function setStatus(msg) {
    var el = document.getElementById("p5-vault-status");
    if (el) el.textContent = msg || "";
  }

  function updateUI() {
    var locked = document.getElementById("p5-vault-locked");
    var open = document.getElementById("p5-vault-open");
    if (locked) locked.style.display = SESSION_UNLOCKED ? "none" : "block";
    if (open) open.style.display = SESSION_UNLOCKED ? "block" : "none";
    var badge = document.getElementById("p5-vault-badge");
    if (badge) badge.textContent = SESSION_UNLOCKED ? "Vault open · this session" : "Vault locked";
  }

  async function setupVault() {
    if (!window.crypto || !crypto.subtle) {
      setStatus("Web Crypto not available in this browser");
      return;
    }
    var p1 = (document.getElementById("p5-vault-pass") || {}).value || "";
    var p2 = (document.getElementById("p5-vault-pass2") || {}).value || "";
    if (p1.length < 8) { setStatus("Use at least 8 characters"); return; }
    if (p1 !== p2) { setStatus("Passphrases did not match"); return; }
    try {
      var empty = { notes: "", contacts: [], debts: [], wasiyyah: "", updatedAt: new Date().toISOString() };
      var blob = await encryptObj(empty, p1);
      localStorage.setItem(VAULT_KEY, JSON.stringify(blob));
      localStorage.setItem(META_KEY, JSON.stringify({ createdAt: new Date().toISOString() }));
      SESSION_UNLOCKED = true;
      window.__AMANA_VAULT_DATA__ = empty;
      setStatus("Vault created · passphrase is only in your memory");
      updateUI();
    } catch (e) {
      setStatus("Setup failed: " + (e.message || e));
    }
  }

  async function unlockVault() {
    if (!window.crypto || !crypto.subtle) {
      setStatus("Web Crypto not available");
      return;
    }
    var pass = (document.getElementById("p5-vault-pass") || {}).value || "";
    if (!pass) { setStatus("Enter passphrase"); return; }
    try {
      var raw = localStorage.getItem(VAULT_KEY);
      if (!raw) { setStatus("No vault yet — use First-time setup"); return; }
      var blob = JSON.parse(raw);
      var data = await decryptObj(blob, pass);
      SESSION_UNLOCKED = true;
      window.__AMANA_VAULT_DATA__ = data;
      setStatus("Unlocked for this session");
      updateUI();
      renderVaultData(data);
    } catch (e) {
      setStatus("Unlock failed — wrong passphrase or corrupted vault");
      SESSION_UNLOCKED = false;
      updateUI();
    }
  }

  async function lockVault() {
    SESSION_UNLOCKED = false;
    window.__AMANA_VAULT_DATA__ = null;
    try {
      var p = document.getElementById("p5-vault-pass");
      var p2 = document.getElementById("p5-vault-pass2");
      if (p) p.value = "";
      if (p2) p2.value = "";
    } catch (e) {}
    setStatus("Locked");
    updateUI();
  }

  async function saveVaultFields() {
    if (!SESSION_UNLOCKED) { setStatus("Unlock first"); return; }
    var pass = (document.getElementById("p5-vault-pass") || {}).value || "";
    if (!pass) {
      pass = prompt("Re-enter passphrase to save (not stored by Clarity):") || "";
    }
    if (!pass) return;
    var data = {
      notes: (document.getElementById("p5-vault-notes") || {}).value || "",
      contacts: (document.getElementById("p5-vault-contacts") || {}).value || "",
      debts: (document.getElementById("p5-vault-debts") || {}).value || "",
      wasiyyah: (document.getElementById("p5-vault-wasiyyah") || {}).value || "",
      updatedAt: new Date().toISOString()
    };
    try {
      var blob = await encryptObj(data, pass);
      localStorage.setItem(VAULT_KEY, JSON.stringify(blob));
      window.__AMANA_VAULT_DATA__ = data;
      setStatus("Saved · encrypted on this device");
    } catch (e) {
      setStatus("Save failed: " + (e.message || e));
    }
  }

  function renderVaultData(data) {
    if (!data) return;
    try {
      var n = document.getElementById("p5-vault-notes");
      var c = document.getElementById("p5-vault-contacts");
      var d = document.getElementById("p5-vault-debts");
      var w = document.getElementById("p5-vault-wasiyyah");
      if (n) n.value = data.notes || "";
      if (c) c.value = typeof data.contacts === "string" ? data.contacts : (data.contacts || []).join("\n");
      if (d) d.value = typeof data.debts === "string" ? data.debts : (data.debts || []).join("\n");
      if (w) w.value = data.wasiyyah || "";
    } catch (e) {}
  }

  function mount() {
    if (document.getElementById("p5-vault-card")) return;
    var card = document.createElement("div");
    card.id = "p5-vault-card";
    card.className = "p5-vault-card";
    card.style.display = "none";
    card.innerHTML =
      "<h3>🔒 Amana Vault</h3>" +
      '<div class="p5-vault-warn"><strong>You are responsible for your passphrase.</strong> Clarity does not store it and cannot recover vault data if it is lost. Educational workspace — not a fatwa.</div>' +
      '<div id="p5-vault-badge" class="p5-vault-status">Vault locked</div>' +
      '<div id="p5-vault-locked">' +
        '<label style="font-size:0.85rem">Passphrase</label><br/>' +
        '<input type="password" id="p5-vault-pass" autocomplete="new-password" placeholder="Enter passphrase" />' +
        '<input type="password" id="p5-vault-pass2" autocomplete="new-password" placeholder="Confirm (setup only)" />' +
        '<div class="p5-vault-actions">' +
          '<button type="button" class="primary" id="p5-vault-unlock">Unlock</button>' +
          '<button type="button" id="p5-vault-setup">First-time setup</button>' +
        "</div>" +
      "</div>" +
      '<div id="p5-vault-open" style="display:none">' +
        '<label style="font-size:0.82rem">Notes</label>' +
        '<textarea id="p5-vault-notes" rows="3" style="width:100%;border-radius:10px;padding:0.5rem;background:rgba(0,0,0,0.35);color:inherit;border:1px solid rgba(212,180,90,0.3)"></textarea>' +
        '<label style="font-size:0.82rem">ICE contacts</label>' +
        '<textarea id="p5-vault-contacts" rows="2" style="width:100%;border-radius:10px;padding:0.5rem;background:rgba(0,0,0,0.35);color:inherit;border:1px solid rgba(212,180,90,0.3)" placeholder="Name · relation · phone"></textarea>' +
        '<label style="font-size:0.82rem">Debts / rights</label>' +
        '<textarea id="p5-vault-debts" rows="2" style="width:100%;border-radius:10px;padding:0.5rem;background:rgba(0,0,0,0.35);color:inherit;border:1px solid rgba(212,180,90,0.3)"></textarea>' +
        '<label style="font-size:0.82rem">Waṣiyyah notes (≤⅓ reminder)</label>' +
        '<textarea id="p5-vault-wasiyyah" rows="2" style="width:100%;border-radius:10px;padding:0.5rem;background:rgba(0,0,0,0.35);color:inherit;border:1px solid rgba(212,180,90,0.3)"></textarea>' +
        '<div class="p5-vault-actions">' +
          '<button type="button" class="primary" id="p5-vault-save">Save encrypted</button>' +
          '<button type="button" id="p5-vault-lock">Lock</button>' +
        "</div>" +
      "</div>" +
      '<div class="p5-vault-status" id="p5-vault-status"></div>';

    var host = document.getElementById("amana-vault-host") || document.getElementById("tab-notes") || document.getElementById("p4-affairs-root") || document.getElementById("p5-offline-pack");
    var main = document.querySelector(".main-content") || document.body;
    if (host && host.parentNode) host.parentNode.insertBefore(card, host);
    else if (document.getElementById("amana-vault-host")) document.getElementById("amana-vault-host").appendChild(card);
    else main.appendChild(card);
    try { card.style.display = "block"; } catch(e) {}

    document.getElementById("p5-vault-unlock").onclick = function () { unlockVault(); };
    document.getElementById("p5-vault-setup").onclick = function () { setupVault(); };
    document.getElementById("p5-vault-lock").onclick = function () { lockVault(); };
    document.getElementById("p5-vault-save").onclick = function () { saveVaultFields(); };
    updateUI();
  }

  function show(room) {
    var card = document.getElementById("p5-vault-card");
    if (card) card.style.display = room === "amanah" ? "block" : "none";
  }

  function boot() {
    mount();
    var prev = window.phase1OpenRoom;
    window.phase1OpenRoom = function (room) {
      try { if (typeof prev === "function") prev(room); } catch (e) {}
      show(room);
    };
    try { show(localStorage.getItem("clarity_phase1_room") || "today"); } catch (e) { show("today"); }

    window.ClarityVault = {
      hasVault: hasVault,
      unlock: unlockVault,
      lock: lockVault,
      isOpen: function () { return SESSION_UNLOCKED; }
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(boot, 360); });
  } else {
    setTimeout(boot, 360);
  }
})();
