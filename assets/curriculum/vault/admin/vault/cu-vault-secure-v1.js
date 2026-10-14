/* University Amana Vault — secure on-device engine V2
 * Web Crypto: PBKDF2 + AES-GCM. Passphrase never stored.
 * Educational only — not a fatwa.
 */
(function (g) {
  "use strict";
  if (g.__CU_VAULT_SECURE_V1__) return;
  g.__CU_VAULT_SECURE_V1__ = true;

  var META_KEY = "cu_vault_meta_v1";
  var DATA_KEY = "cu_vault_data_v1";
  var sessionKey = null; /* CryptoKey while unlocked */
  var plain = null;

  function bufToB64(buf) {
    var bytes = new Uint8Array(buf);
    var s = "";
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  }
  function b64ToBuf(b64) {
    var s = atob(b64);
    var bytes = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
    return bytes.buffer;
  }

  function getMeta() {
    try {
      return JSON.parse(localStorage.getItem(META_KEY) || "null");
    } catch (e) {
      return null;
    }
  }

  function setMeta(m) {
    localStorage.setItem(META_KEY, JSON.stringify(m));
  }

  function defaultData() {
    return {
      amana: {
        identity: "",
        nextOfKin: "",
        debts: "",
        wasiyyahNote: "",
        missed: "",
        dua: "",
        janazahNote: "",
        doNot: "No wailing ceremonies as binding ritual; no hired recitation presented as obligation; no bequest to heirs that overrides sharʿī shares (educational reminder)."
      },
      tree: { people: [], notes: "" },
      faraid: { scenario: "", notes: "", errorChecks: {} },
      wasiyyah: { text: "", capThird: true, nonHeir: true }
    };
  }

  async function deriveKey(pass, saltBuf) {
    var enc = new TextEncoder();
    var base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: saltBuf, iterations: 120000, hash: "SHA-256" },
      base,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  async function encryptPayload(key, obj) {
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var enc = new TextEncoder();
    var ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, enc.encode(JSON.stringify(obj)));
    return { iv: bufToB64(iv), ct: bufToB64(ct) };
  }

  async function decryptPayload(key, packed) {
    var iv = b64ToBuf(packed.iv);
    var ct = b64ToBuf(packed.ct);
    var pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(iv) }, key, ct);
    return JSON.parse(new TextDecoder().decode(pt));
  }

  async function createVault(pass) {
    if (!pass || pass.length < 8) throw new Error("Use at least 8 characters.");
    var salt = crypto.getRandomValues(new Uint8Array(16));
    var key = await deriveKey(pass, salt);
    var data = defaultData();
    var packed = await encryptPayload(key, data);
    setMeta({ salt: bufToB64(salt), v: 1, created: Date.now() });
    localStorage.setItem(DATA_KEY, JSON.stringify(packed));
    sessionKey = key;
    plain = data;
    return true;
  }

  async function unlock(pass) {
    var meta = getMeta();
    if (!meta || !meta.salt) throw new Error("No vault yet — create one.");
    var key = await deriveKey(pass, b64ToBuf(meta.salt));
    var packed = JSON.parse(localStorage.getItem(DATA_KEY) || "null");
    if (!packed) throw new Error("Vault data missing.");
    plain = await decryptPayload(key, packed);
    sessionKey = key;
    return true;
  }

  async function save() {
    if (!sessionKey || !plain) throw new Error("Locked.");
    var packed = await encryptPayload(sessionKey, plain);
    localStorage.setItem(DATA_KEY, JSON.stringify(packed));
  }

  function lock() {
    sessionKey = null;
    plain = null;
  }

  function isUnlocked() {
    return !!sessionKey && !!plain;
  }

  function hasVault() {
    return !!getMeta();
  }

  function data() {
    return plain;
  }

  g.ClarityVaultSecure = {
    createVault: createVault,
    unlock: unlock,
    save: save,
    lock: lock,
    isUnlocked: isUnlocked,
    hasVault: hasVault,
    data: data,
    defaultData: defaultData
  };
})(typeof window !== "undefined" ? window : this);
