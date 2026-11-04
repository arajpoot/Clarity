/*! yawm-isolation-guard-v1 · Phase 3
 * Yawm (/daily/) is sole "today" SoT. Blocks accidental Amānah vault APIs.
 * Does not remove Yawm modules. Campus/companion trees not modified.
 */
(function (w, d) {
  "use strict";
  if (w.__YAWM_ISOLATION_GUARD_V1__) return;
  w.__YAWM_ISOLATION_GUARD_V1__ = true;

  function isYawm() {
    try {
      var p = (w.location && w.location.pathname) || "";
      return p === "/daily" || p.indexOf("/daily/") === 0;
    } catch (e) { return false; }
  }
  if (!isYawm()) return;

  var LOG = (w.__YAWM_ISOLATION_LOG = []);
  function log(m) { try { LOG.push(String(m)); } catch (e) {} }

  /* Soft-block vault-style APIs if a shared script leaks in */
  var BLOCK = [
    "clarityAmanaUnlock",
    "clarityAmanaLock",
    "openAmanaVault",
    "amanaPassphraseGate",
    "clarityVaultDecrypt",
    "clarityVaultEncrypt"
  ];
  BLOCK.forEach(function (name) {
    try {
      Object.defineProperty(w, name, {
        configurable: true,
        get: function () {
          log("blocked " + name);
          return function () {
            console.info("[Yawm] " + name + " is Amānah-only — use /amana/");
            return null;
          };
        },
        set: function () { log("set-blocked " + name); }
      });
    } catch (e) {
      w[name] = function () { return null; };
    }
  });

  /* Mark document */
  try {
    d.documentElement.setAttribute("data-yawm-sot", "1");
    d.documentElement.setAttribute("data-clarity-room", "yawm");
  } catch (e) {}

  log("yawm isolation guard active");
})(window, document);
