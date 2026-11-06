/*! amana-unlock-stay-v1
 * Keeps user on /amana/unlock/ during gate work. Blocks accidental redirects to desk.
 * Explicit "Back to desk" links still work.
 * Educational only — not a fatwa.
 */
(function (w, d) {
  "use strict";
  if (w.__AMANA_UNLOCK_STAY_V1__) return;
  w.__AMANA_UNLOCK_STAY_V1__ = true;

  function onUnlockPath() {
    try {
      var p = (w.location.pathname || "").replace(/\/+$/, "");
      return p === "/amana/unlock" || /\/amana\/unlock/i.test(w.location.pathname || "");
    } catch (e) { return false; }
  }
  if (!onUnlockPath()) return;

  d.documentElement.setAttribute("data-amana-surface", "unlock");
  d.documentElement.setAttribute("data-clarity-room", "amana");

  var nativeAssign = w.location.assign.bind(w.location);
  var nativeReplace = w.location.replace.bind(w.location);

  function isDeskOnly(url) {
    try {
      var u = new URL(url, w.location.origin);
      var path = (u.pathname || "").replace(/\/+$/, "") || "/";
      return path === "/amana" || path === "/amana/index.html";
    } catch (e) {
      return /\/amana\/?$/.test(String(url));
    }
  }

  function allow(url) {
    /* allow unlock subpath, chambers, explicit back is user click on <a> */
    return true;
  }

  /* Soft-guard programmatic desk redirects during first 15s after load */
  var armedUntil = Date.now() + 15000;
  function guardTo(url, fn) {
    if (Date.now() < armedUntil && isDeskOnly(url)) {
      try { console.info("[Amānah] stayed on unlock — blocked bounce to desk"); } catch (e) {}
      return;
    }
    return fn(url);
  }

  try {
    w.location.assign = function (url) { return guardTo(url, nativeAssign); };
    w.location.replace = function (url) { return guardTo(url, nativeReplace); };
  } catch (e) {}

  /* Ensure gate visible */
  function showGate() {
    var g = d.getElementById("amana-vault-gate");
    if (g) {
      g.hidden = false;
      g.style.display = "block";
      g.removeAttribute("aria-hidden");
    }
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", showGate);
  else showGate();
  w.addEventListener("load", showGate);
})(window, document);
