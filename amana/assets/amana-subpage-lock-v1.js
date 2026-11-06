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
