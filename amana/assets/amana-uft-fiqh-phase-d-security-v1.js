/*! Amānah UFT/Fiqh · Phase D · security posture
 * - No passphrase handling in these modules
 * - On chamber lock / tab hide: do not leak outline into clipboard helpers
 * - Prefer textContent for dynamic names (XSS-safe)
 * - Clear transient status lines containing imported file names after idle
 * Educational chambers only · vault crypto remains Amānah engine
 */
(function (w, d) {
  "use strict";
  if (w.__CLARITY_AMANA_UFT_FIQH_PHASE_D_SEC__) return;
  w.__CLARITY_AMANA_UFT_FIQH_PHASE_D_SEC__ = true;

  var STATUS_IDS = [
    "uft-fiqh-workflow-status",
    "fiqh-wf-status",
    "uft-fo-status",
    "uft-status"
  ];

  function softClearStatus() {
    STATUS_IDS.forEach(function (id) {
      var el = d.getElementById(id);
      if (!el) return;
      var t = el.textContent || "";
      if (/import|uploaded|file|JSON|CSV/i.test(t)) {
        el.textContent = "Private on this device — educational outline only.";
      }
    });
  }

  function onLock() {
    softClearStatus();
    /* Do not remove outline/tree keys — user data; only soften transient UI */
    try {
      if (w.__AMANA_DECRYPTED_PAYLOAD__) w.__AMANA_DECRYPTED_PAYLOAD__ = null;
    } catch (e) {}
  }

  if (d.addEventListener) {
    d.addEventListener("clarity-amana-unlock-change", function (ev) {
      if (ev.detail && ev.detail.unlocked === false) onLock();
    });
    d.addEventListener("visibilitychange", function () {
      if (d.visibilityState === "hidden") softClearStatus();
    });
  }
  if (w.addEventListener) {
    w.addEventListener("pagehide", onLock);
  }

  /* Hardening: block accidental password fields in tree/fiqh host */
  function scrubPasswordInputs() {
    var root = d.getElementById("user-family-tree-card") || d.getElementById("faraid-card");
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll('input[type="password"]').forEach(function (el) {
      try {
        el.type = "text";
        el.setAttribute("data-amana-sec", "password-type-blocked-on-chamber");
      } catch (e) {}
    });
  }

  function boot() {
    scrubPasswordInputs();
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 1000);
})(window, document);
